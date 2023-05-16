import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Select, MenuItem, OutlinedInput, Typography, TextField, FormControl, Grid, Paper, Table, TableBody, TableHead, TableContainer, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle, colourStyles } from '../PageStyle';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import axios from 'axios';
import jsPDF from "jspdf";
import { FaPrint, FaFilePdf } from 'react-icons/fa';
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
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Selects from 'react-select';

function Stockadjustreportlist() {

    const [stockAdjust, setStockAdjust] = useState([]);
    const [locations, setLocations] = useState([]);
    const [exceldata, setExceldata] = useState([]);
    const { auth, setngs } = useContext(AuthContext);

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenalert = () => { setIsErrorOpen(true); };
    const handleClosealert = () => { setIsErrorOpen(false); };

    //  Data Table
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // Datefield
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    const [dateFilter, setDateFilter] = useState({
        startdate: today, enddate: today, location: ""
    })

    // Access
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

    const fetchLocation = async () => {
        try {
            let req = await axios.get(SERVICE.BUSINESS_LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = req.data.busilocations.filter((data, index) => {
                if (isUserRoleAccess.role == 'Admin') {
                    return data.assignbusinessid == setngs.businessid && data.activate ==true
                } else {
                    if (isUserRoleAccess.businesslocation.includes(data.name)) {
                        return data.assignbusinessid == setngs.businessid && data.activate ==true
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


    const fetchTransfer = async () => {

        try {
            let response = await axios.get(SERVICE.TRANSFERS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            //get all transfer data date filter function
            let alldataresult = response.data.transfers.filter((data, index)=>{
                // convert string ('dd-mm-yyyy') to date format ('yyyy-mm-dd')
                const dateString = data.date;
                const parts = dateString.split('-');
                const date = new Date(parts[2], parts[1] - 1, parts[0]); // month is 0-indexed in Date constructor      
                let dateTrim = moment(date).format('YYYY-MM-DD')

                if (dateFilter.startdate == today && dateFilter.enddate == today) {
                    return data
                } else if (dateFilter.startdate <= dateTrim && dateFilter.enddate + 1 >= dateTrim) {
                    return data
                }
                else if (dateFilter.startdate <= dateTrim && dateFilter.enddate == "") {
                    return data
                }
                else if (dateFilter.startdate == "" && dateFilter.enddate + 1 >= dateTrim) {
                    return data
                }
            })

            //stock transfer data
            //admin
            let transferresult = alldataresult.filter((data, index)=>{
                if (data.tobusinesslocations.includes(dateFilter.location)) {
                    return data.assignbusinessid == setngs.businessi && data.status == true && data.reject == false
                }
                
            })  
            //other user  
            let transferDatatransfer = alldataresult.filter((data, index)=>{
                return data.assignbusinessid == setngs.businessid && data.status == true && data.reject == false
            })
            // let transferData = response.data.transfers
            let userLocations = isUserRoleAccess.businesslocation
            let filteredDataTransfer = []
            transferDatatransfer.forEach((data, index)=> {
                let products = []
                // let actualProducts = data.products[0]
                data.products.forEach((product)=> {
                    let quantity = {}
                    for (let key in product.quantity) {
                        if (userLocations.includes(key)) {
                            quantity[key] = product.quantity[key]
                        }
                    }
                    let locations = product.locations.filter((data, index)=> {
                        if (userLocations.includes(data) && dateFilter.location == data) {
                            return true;
                        }
                    })
                    if (locations.length != 0) {
                        products.push({...product, quantity, locations})

                    }
                    
                })
                if (products.length != 0) {
                filteredDataTransfer.push({...data, products})

                }
            })

            setStockAdjust(isUserRoleAccess.role == 'Admin' ? transferresult : filteredDataTransfer);

        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    const handleSubmit = () => {
        if (dateFilter.location == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Location"}</p>
                </>
            );
            handleClickOpenalert()
        }
        else if (dateFilter.startdate == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select From Date"}</p>
                </>
            );
            handleClickOpenalert()
        }
        else if (dateFilter.enddate == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select End Date"}</p>
                </>
            );
            handleClickOpenalert()
        }
        else {
            fetchTransfer()
        }
    }

    // Excel
    const fileName = 'Stock Adjust Report '
    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = stockAdjust.map(t => (
            {
                'Date': t.date,
                'From-Location': t.fromlocation,
                'To-Location': t.productname,
                'Product Name': t.productname.map((c => c.productname).join(',')),
                'Quantity': t.quantity,
            }));
        setExceldata(data);
    }

    useEffect(
        () => {
            getexcelDatas();
        }, [stockAdjust]
    )


    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ARANYA HERBALS | STOCK ADJUST REPORT ',
        pageStyle: 'print'
    });

    //  PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#pdftable' })
        doc.save('Stock Adjust Report .pdf')
    }

    // DATA TABLE
    // ......
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = stockAdjust.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return a[sorting.column] > b[sorting.column] ? 1 : -1;
        } else if (sorting.direction === 'desc') {
            return a[sorting.column] < b[sorting.column] ? 1 : -1;
        }
        return 0;
    });

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
    const filteredDatas = stockAdjust?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(stockAdjust.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Box >
            <Headtitle title={'Stock Adjust Report '} />
            { /* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Stock Adjust Report </Typography>
            { /* ****** Table Start ****** */}
            <>
                <Box sx={userStyle.container} >
                    <Grid container sx={{ justifyContent: "center" }} spacing={2}>
                    <Grid item lg={1} md={1}></Grid>
                        <Grid item lg={3} md={3}>
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
                        <Grid item lg={3} md={3} sx={{ display: 'flex' }}>
                            <Typography sx={{ marginTop: 1 }}>From</Typography>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    id="component-outlined"
                                    value={dateFilter.startdate}
                                    type="date"
                                    size="small"
                                    onChange={(e) => setDateFilter({ ...dateFilter, startdate: e.target.value })}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sx={{ display: 'flex' }}>
                            <Typography sx={{ marginTop: 1 }}>To</Typography>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    id="component-outlined"
                                    value={dateFilter.enddate}
                                    type="date"
                                    size="small"
                                    onChange={(e) => setDateFilter({ ...dateFilter, enddate: e.target.value })}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={1} md={1}>
                            <Button onClick={handleSubmit} variant='outlined' sx={{
                                 backgroundColor: '#339d3a !important',
                                 border: '1px solid #339d3a',
                                 height: '35px !important',
                                 borderRadius: '5px !important',
                                 color: 'white',
                                 '&:hover': {
                                     backgroundColor: 'white !important',
                                     border: '1px solid #339d3a',
                                     color: '#339d3a',
                                 }
                            }} >Generate</Button>
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
                                <MenuItem value={(stockAdjust.length)}>All</MenuItem>
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
                        <Grid>
                            {isUserRoleCompare[0].printstockadjustreport && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0].pdfstockadjustreport && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid><br /><br></br>
                    { /* ****** Table start ****** */}
                    <Box>
                        <TableContainer component={Paper} >
                            <Table aria-label="simple table">
                                <TableHead sx={{ fontWeight: "600" }} >
                                    <StyledTableRow >
                                        <StyledTableCell onClick={() => handleSorting('date')}><Box sx={userStyle.tableheadstyle}><Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('date')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('fromlocation')}><Box sx={userStyle.tableheadstyle}><Box>From-Company</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('fromlocation')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('products')}><Box sx={userStyle.tableheadstyle}><Box>To-Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('products')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('products')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('products')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('products')}><Box sx={userStyle.tableheadstyle}><Box>Quantity</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('products')}</Box></Box></StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.length > 0 ?
                                        (filteredData.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">{row.date}</StyledTableCell>
                                                <StyledTableCell align="left">{row.fromlocation + ", "}</StyledTableCell>
                                                <StyledTableCell align="left">{row.products.map((value) => value.locations + ", ")}</StyledTableCell>
                                                <StyledTableCell align="left">{row.products.map((value) => value.productname + ",")}</StyledTableCell >
                                                <StyledTableCell align="left">{row.products.map((value) => row.tobusinesslocations.map((data, liindec) => value.quantity[data] + ','))}</StyledTableCell>
                                            </StyledTableRow>
                                        )))
                                        : <StyledTableRow><StyledTableCell colSpan={7} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br /><br />
                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, stockAdjust.length)} of {stockAdjust.length} entries
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
            < Box sx={userStyle.printcls} >
                <Box>
                    <Typography variant='h5' >Stock Transfer Report </Typography>
                </Box>
                <>
                    <Box  >
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table aria-label="simple table" id="pdftable" ref={componentRef}>
                                <TableHead sx={{ fontWeight: "600" }} >
                                    <StyledTableRow >
                                        <StyledTableCell>Date</StyledTableCell>
                                        <StyledTableCell>From-Location</StyledTableCell>
                                        <StyledTableCell>To-Location</StyledTableCell>
                                        <StyledTableCell>Product Name</StyledTableCell>
                                        <StyledTableCell>Quantity</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {stockAdjust.length > 0 ?
                                        (stockAdjust.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">{row.date}</StyledTableCell>
                                                <StyledTableCell align="left">{row.fromlocation + ", "}</StyledTableCell>
                                                <StyledTableCell align="left">{row.products.map((value) => value.locations + ", ")}</StyledTableCell>
                                                <StyledTableCell align="left">{row.products.map((value) => value.productname + ",")}</StyledTableCell >
                                                <StyledTableCell align="left">{row.products.map((value) => row.tobusinesslocations.map((data, liindec) => value.quantity[data] + ','))}</StyledTableCell>
                                            </StyledTableRow>
                                        )))
                                        : <StyledTableRow><StyledTableCell colSpan={7} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            </Box >
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
        </Box >
    );
}
function Stockadjustreport() {
    return (
        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <Stockadjustreportlist /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}
export default Stockadjustreport;