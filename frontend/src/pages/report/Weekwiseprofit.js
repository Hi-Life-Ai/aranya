import React, { useState, useEffect, useRef, useContext } from "react";
import { FcInfo } from "react-icons/fc";
import { Box, Select, MenuItem, OutlinedInput, Typography, Tooltip, Dialog, TextField, DialogContent, IconButton, DialogActions, InputLabel, FormControl, Grid, TableFooter, Paper, Table, TableBody, TableHead, TableContainer, Button } from '@mui/material';
import { userStyle, colourStyles } from '../PageStyle';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import axios from 'axios';
import jsPDF from "jspdf";
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { ExportXL, ExportCSV } from '../Export';
import autoTable from 'jspdf-autotable';
import Headtitle from '../../components/header/Headtitle';
import { UserRoleAccessContext } from '../../context/Appcontext';
import { SERVICE } from '../../services/Baseservice';
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import { AuthContext } from '../../context/Appcontext';
import { toast } from 'react-toastify';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import Selects from 'react-select';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

function WeekwiseprofitList() {

    const [weekwise, setWeekWiseProfit] = useState([]);
    const [exceldata, setExceldata] = useState([]);
    const { auth, setngs } = useContext(AuthContext);

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenalert = () => { setIsErrorOpen(true); };
    const handleClosealert = () => { setIsErrorOpen(false); };

    // Acces
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

    //  Data Table
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    const [dateFilter, setDateFilter] = useState({
        selectdate: today, location: ''
    })

    let salesamount = 0.00;
    let profitamount = 0.00;

    const [locations, setLocations] = useState([]);

    let productName = [];
    let productId = [];
    let location = [];
    let quantity = [];
    let Mrp = [];
    let Sellingvalue = [];
    let sales = [];
    let allData = [];

    const fetchLocation = async () => {
        try {
            let req = await axios.get(SERVICE.BUSINESS_LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = req.data.busilocations.filter((data, index) => {
                if (isUserRoleAccess.role == 'Admin') {
                    return data.assignbusinessid == setngs.businessid && data.activate == true
                } else {
                    if (isUserRoleAccess.businesslocation.includes(data.name)) {
                        return data.assignbusinessid == setngs.businessid && data.activate == true
                    }
                }
            })
            setLocations(
                result?.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                }))
            );

        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    useEffect(() => {
        fetchLocation();
    }, []);

    const fetchCompareData = async () => {

        try {
            let req = await axios.get(SERVICE.POS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let dates = new Date(dateFilter.selectdate)
            const previousWeekStart = new Date(dates.getFullYear(), dates.getMonth(), dates.getDate() - 7);
            let startweekdate = moment(previousWeekStart).format('DD-MM-YYYY')
            let Endweekdate = moment(dates).format('DD-MM-YYYY')

            let val = req.data.pos1.filter((item) => {
                let selectdate = moment(item.date).format('DD-MM-YYYY');
                if (dateFilter.location == item.location && (startweekdate <= selectdate && Endweekdate + 1 >= selectdate)) {
                    return item
                } else {
                    setWeekWiseProfit([])
                }
            })

            val.map(item => {
                item.goods.map(value => {
                    location.push(item.location)
                    productId.push(value.productid)
                    productName.push(value.productname)
                    quantity.push(value.quantity)
                    Mrp.push(value.mrp)
                    Sellingvalue.push(value.sellingvalue == undefined || "" ? 0 : Number(value.sellingvalue))
                    sales.push(value.subtotal)
                })

                allData = productId.map(function (data, i) {
                    return {
                        productid: data,
                        productname: productName[i],
                        location: location[i],
                        quantity: quantity[i],
                        mrp: Mrp[i],
                        sellingvalue: Sellingvalue[i],
                        sales: sales[i],
                    };
                });

                const result = [...allData.reduce((r, o) => {
                    const key = o.productid;
                    const items = r.get(key) || Object.assign({}, o, {
                        quantity: 0,
                        sellingvalue: 0,
                        profit: 0,
                        sales: 0,
                        allmrp: 0,
                        allsellingvalue: 0,
                    });
                    items.quantity += +o.quantity
                    items.sellingvalue += +o.sellingvalue
                    items.sales += +o.sales
                    items.allmrp += +o.quantity * +o.mrp
                    items.allsellingvalue += +o.quantity * +o.sellingvalue
                    return r.set(key, items);
                }, new Map).values()];

                setWeekWiseProfit(result);
            })

        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    // Excel
    const fileName = 'Day Wise Profit '
    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = weekwise.map(t => ({
            'Location': t.location,
            'Product Name': t.productname,
            'Quantity': t.quantity,
            'MRP': t.allmrp.toFixed(2),
            'Sales': t.sales.toFixed(2),
            'Profit': (t.sales - (t.allmrp)).toFixed(2)
        }));
        setExceldata(data);
    }

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ARANYA HERBALS | WEEK WISE PROFIT ',
        pageStyle: 'print'
    });

    //  PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#pdftable' })
        doc.save('Week Wise Profit .pdf')
    }

    // DATA TABLE
    // ......
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const renderSortingIcon = (column) => {
        if (sorting.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sorting.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const filteredDatas = weekwise?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(weekwise.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    useEffect(
        () => {
            getexcelDatas();
        }, [weekwise]
    )

    const handleSubmit = () => {
        if (dateFilter.location == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Location"}</p>
                </>
            );
            handleClickOpenalert()
        }else if(dateFilter.selectdate == ""){
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Date"}</p>
                </>
            );
            handleClickOpenalert()

        } else {
            fetchCompareData()
        }

    }
    return (
        <Box >
            <Headtitle title={'Week Wise Profit Report'} />
            { /* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Week Wise Profit Report</Typography>
            { /* ****** Table Start ****** */}
            <>
                <Box sx={userStyle.container} >
                    <Grid container sx={{ justifyContent: "center" }} spacing={2}>
                        <Grid item lg={2} md={2}></Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <InputLabel >Location<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth >
                                <Selects
                                    onChange={(e) => {
                                        setDateFilter({ ...dateFilter, location: e.name });
                                    }}
                                    placeholder={"Select Location"}
                                    styles={colourStyles}
                                    options={locations}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                        <InputLabel  >Date<b style={{ color: 'red' }}>*</b></InputLabel>
                            <Grid sx={{display: 'flex'}}>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    value={dateFilter.selectdate}
                                    type="date"
                                    size="small"
                                    onChange={(e) => setDateFilter({ ...dateFilter, selectdate: e.target.value })}
                                />
                            </FormControl>
                            <Tooltip arrow 
                                title=" It will generate previous 7 day's sales report from given date ">
                                <IconButton size="small">
                                    <FcInfo />
                                </IconButton>
                            </Tooltip>
                            </Grid>
                        </Grid>
                        <Grid item lg={3} md={3}>
                            <Button onClick={handleSubmit} variant='outlined' sx={userStyle.btngenerate} >Generate</Button>
                        </Grid>
                        <Grid item lg={1} md={1}></Grid>
                    </Grid>
                </Box><br />
                <Box sx={userStyle.container} >
                    <Grid style={userStyle.dataTablestyle}>
                        <Box>
                            <label htmlFor="pageSizeSelect">Show&ensp;</label>
                            <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={(weekwise.length)}>All</MenuItem>
                            </Select>
                            <label htmlFor="pageSizeSelect">&ensp;entries</label>
                        </Box>
                        <Box>
                            <Grid sx={{ display: 'flex' }}>
                                <Grid><Typography sx={{ marginTop: '6px' }}>Search:&ensp;</Typography></Grid>
                                <FormControl fullWidth size="small" >
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </FormControl>
                            </Grid>
                        </Box>
                    </Grid>
                    <br /><br />
                    { /* ****** Header Buttons ****** */}
                    <Grid container sx={{ justifyContent: "center" }} >
                        <Grid >
                            {isUserRoleCompare[0].csvweekwiseprofit && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0].excelweekwiseprofit && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0].printweekwiseprofit && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0].pdfweekwiseprofit && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid><br /><br></br>
                    { /* ****** Table start ****** */}
                    <Box>
                        <TableContainer component={Paper} >
                            <Table sx={{}} aria-label="simple table">
                                <TableHead sx={{ fontWeight: "600" }} >
                                    <StyledTableRow >
                                        <StyledTableCell onClick={() => handleSorting('location')}><Box sx={userStyle.tableheadstyle}><Box>Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('location')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('quantity')}><Box sx={userStyle.tableheadstyle}><Box>Quantity</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('quantity')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('mrp')}><Box sx={userStyle.tableheadstyle}><Box>MRP</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('mrp')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('sales')}><Box sx={userStyle.tableheadstyle}><Box>Sales</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sales')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('totalsale')}><Box sx={userStyle.tableheadstyle}><Box>Profit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('totalsale')}</Box></Box></StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.length > 0 ?
                                        (filteredData.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">{row.location}</StyledTableCell>
                                                <StyledTableCell align="left">{row.productname}</StyledTableCell >
                                                <StyledTableCell align="left">{row.quantity}</StyledTableCell>
                                                <StyledTableCell align="left">{row.allmrp.toFixed(2)}</StyledTableCell>
                                                <StyledTableCell align="left">{row.sales.toFixed(2)}</StyledTableCell>
                                                <StyledTableCell align="left">{(Number(row.sales) - Number(row.allmrp)).toFixed(2)}</StyledTableCell>
                                            </StyledTableRow>
                                        )))
                                        : <StyledTableRow><StyledTableCell colSpan={7} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                    }
                                </TableBody>
                                <TableFooter sx={{ backgroundColor: '#9591914f', height: '50px' }}>
                                    <StyledTableRow className="table2_total" >
                                        {weekwise && (
                                            weekwise.forEach(
                                                (item => {
                                                    salesamount += +item.sales;
                                                    profitamount += Number(item.sales) - Number(item.allmrp)
                                                })
                                            ))}
                                        <StyledTableCell align="center" colSpan={4} sx={{ color: 'black', fontSize: '20px', justifyContent: 'center', border: '1px solid white !important' }}>Total:</StyledTableCell>
                                        <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹ {salesamount.toFixed(2)}</StyledTableCell>
                                        <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹ {profitamount.toFixed(2)}</StyledTableCell>

                                    </StyledTableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        <br /><br />
                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, weekwise.length)} of {weekwise.length} entries
                            </Box>
                            <Box>
                                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                                    Prev
                                </Button>
                                {pageNumbers?.map((pageNumber) => (
                                    <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                        {pageNumber}
                                    </Button>
                                ))}
                                {lastVisiblePage < totalPages && <span>...</span>}
                                <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={{ textTransform: 'capitalize', color: 'black' }}>
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    { /* ****** Table End ****** */}
                </Box>
            </>
            { /* ****** Print ****** */}
            <Box sx={userStyle.printcls}>
                <Box>
                    <Typography variant='h5' >Week Wise Profit </Typography>
                </Box>
                <>
                    <Box  >
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table aria-label="simple table" id="pdftable" ref={componentRef}>
                                <TableHead sx={{ fontWeight: "600" }} >
                                    <StyledTableRow >
                                        <StyledTableCell>Location</StyledTableCell>
                                        <StyledTableCell>Product Name</StyledTableCell>
                                        <StyledTableCell>Quantity</StyledTableCell>
                                        <StyledTableCell>MRP</StyledTableCell>
                                        <StyledTableCell>Sales</StyledTableCell>
                                        <StyledTableCell>Profit</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {weekwise.length > 0 && (
                                        weekwise.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">{row.location}</StyledTableCell>
                                                <StyledTableCell align="left">{row.productname}</StyledTableCell >
                                                <StyledTableCell align="left">{row.quantity}</StyledTableCell>
                                                <StyledTableCell align="left">{row.allmrp.toFixed(2)}</StyledTableCell>
                                                <StyledTableCell align="left">{row.sales.toFixed(2)}</StyledTableCell>
                                                <StyledTableCell align="left">{(Number(row.sales) - Number(row.allmrp)).toFixed(2)}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    )}
                                </TableBody>
                                <TableFooter sx={{ backgroundColor: '#9591914f', height: '50px' }}>
                                    <StyledTableRow className="table2_total" >
                                        {weekwise && (
                                            weekwise.forEach(
                                                (item => {
                                                    salesamount += +item.sales;
                                                    profitamount += Number(item.sales) - Number(item.allmrp)
                                                })
                                            ))}
                                        <StyledTableCell align="center" colSpan={4} sx={{ color: 'black', fontSize: '20px', justifyContent: 'center', border: '1px solid white !important' }}>Total:</StyledTableCell>
                                        <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹ {salesamount.toFixed(2)}</StyledTableCell>
                                        <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹ {profitamount.toFixed(2)}</StyledTableCell>

                                    </StyledTableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClosealert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <Typography>{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClosealert}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
function Weekwiseprofit() {
    return (
        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <WeekwiseprofitList /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}
export default Weekwiseprofit;