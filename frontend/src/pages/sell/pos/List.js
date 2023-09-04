import React, { useState, useEffect, createRef, useRef, useContext } from 'react';
import { Box, Button, Select, MenuItem, TableFooter, FormControl, OutlinedInput, Dialog, DialogContent, DialogActions, Grid, Typography, Table, TableBody, TableContainer, TableHead, Paper } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import Headtitle from '../../../components/header/Headtitle';
import { Link } from 'react-router-dom';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import moment from 'moment';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import jsPDF from "jspdf";
import { toast } from 'react-toastify';
import { ExportXL, ExportCSV } from '../../Export';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { useReactToPrint } from "react-to-print";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { ThreeDots } from 'react-loader-spinner';


function Poslisttable() {

    const { auth, setngs } = useContext(AuthContext);
    const [pos, setPos] = useState([]);
    const [deletePoss, setDeletePoss] = useState({});
    const [exceldata, setExceldata] = useState([]);
    const [isLoader, setIsLoader] = useState(false);

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");


    // User Access
    const { isUserRoleCompare, isUserRoleAccess, allPos } = useContext(UserRoleAccessContext);

    // Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleCloseMod = () => { setIsDeleteOpen(false); };

    console.log(allPos);

    // Pos
    const fetchPos = async () => {
        try {
            let res = await axios.post(SERVICE.POS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            // let result = res.data.pos1.filter((data, index) => {
            //     return data.assignbusinessid == setngs.businessid
            // })
            setPos(res?.data?.pos1);
            setIsLoader(true);
        } catch (err) {
            setIsLoader(true);
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(
        () => {
            fetchPos();
        }, []
    );

    //set function to get particular row
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.POS_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDeletePoss(res.data.spos);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // Alert delete popup
    let supid = deletePoss._id;
    const deletePos = async () => {
        try {
            let res = await axios.delete(`${SERVICE.POS_SINGLE}/${supid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchPos();
            handleCloseMod();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Excel
    const fileName = "POS";
    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = pos.map(t => ({
            'Date': moment(t.date).utc().format('DD-MM-YYYY'), 'Invoice No': t.referenceno, 'Company': t.company, 'Company Address': t.companyaddress, 'Company GSTN': t.gstn, 'Bank Name': t.bankname, 'Acc No': t.accountnumber, 'IFSC Code': t.ifsccode, 'Company contact person Name': t.companycontactpersonname, 'Company Contact Person No': t.companycontactpersonnumber,
            'Delivery': t.location, 'Delivery Address': t.deliveryaddress, 'Delivery GSTN': t.deliverygstn, 'Delivery Contact Person Name': t.deliverycontactpersonname, 'Delivery Contact Person No': t.deliverycontactpersonnumber, 'Driver Name': t.drivername, 'Driver No': t.drivername, 'Driver Phone No': t.drivernphonenumber, 'Sales Person Name': t.salesman, 'Sales Person Contact No': t.salesmannumber,
            'Grand Total': t.grandtotal, 'Total Quantity': t.totalproducts, 'Total Items': t.totalitems, 'Added By': t.userbyadd
        }));
        setExceldata(data);
    }

    useEffect(
        () => {
            getexcelDatas();
        }, [pos]
    );

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ARANYA HERBALS | POS',
        pageStyle: 'print'
    });

    const ref = createRef();
    const options = {
        orientation: 'portrait',
        unit: 'in'
    };

    // Pdf
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#postablepdf' })
        doc.save('POS.pdf')
    }

    // Sorting
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

    // Datatable
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
    const filteredDatas = pos?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(pos.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    let totalsales = 0;

    return (
        <Box>
            <Headtitle title={'POS'} />
            <Typography sx={userStyle.HeaderText}>POS</Typography>
            {/* Table */}
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item xs={8}></Grid>
                    <Grid item xs={4}>
                        {isUserRoleCompare[0].apos && (
                            <>
                                <Link to="/sell/pos/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                            </>
                        )}
                    </Grid>
                </Grid><br /><br />
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
                            <MenuItem value={(pos.length)}>All</MenuItem>
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
                </Grid><br /><br />
                {isLoader ? <>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            {isUserRoleCompare[0].csvpos && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0].excelpos && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0].printpos && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0].pdfpos && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid><br /><br />
                    <Box>
                        <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table" id="postable" >
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell>Action</StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('date')}><Box sx={userStyle.tableheadstyle}><Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('date')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('referenceno')}><Box sx={userStyle.tableheadstyle}><Box>Invoice No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('referenceno')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('company')}><Box sx={userStyle.tableheadstyle}><Box>Company Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('company')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('location')}><Box sx={userStyle.tableheadstyle}><Box>Transfered Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('location')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('grandtotal')}><Box sx={userStyle.tableheadstyle}><Box>Grand Total</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('aftergranddisctotal')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('totalitems')}><Box sx={userStyle.tableheadstyle}><Box>Total Items</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('totalitems')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSorting('userbyadd')}><Box sx={userStyle.tableheadstyle}><Box>Added By</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('userbyadd')}</Box></Box></StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.length > 0 ?
                                        (filteredData.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell component="th" scope="row">
                                                    <Grid sx={{ display: 'flex' }}>
                                                        <Link to={`/sell/pos/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                        {isUserRoleCompare[0].dpos && (
                                                            <>
                                                                <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{moment(row.date).utc().format('DD-MM-YYYY')}</StyledTableCell>
                                                <StyledTableCell align="left">{row.referenceno}</StyledTableCell>
                                                <StyledTableCell align="left">{row.company}</StyledTableCell>
                                                <StyledTableCell align="left">{row.location}</StyledTableCell>
                                                <StyledTableCell align="left">{row.grandtotal}</StyledTableCell>
                                                <StyledTableCell align="left">{row.totalitems}</StyledTableCell>
                                                <StyledTableCell align="left">{row.userbyadd}</StyledTableCell>
                                            </StyledTableRow>
                                        )))
                                        : <StyledTableRow><StyledTableCell colSpan={10} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                    }
                                </TableBody>
                                <TableFooter sx={{ backgroundColor: '#9591914f', height: '50px' }}>
                                    <StyledTableRow className="table2_total" >
                                        {pos && (
                                            pos.forEach(
                                                (item => {
                                                    totalsales += +item.grandtotal;
                                                })
                                            ))}

                                        <StyledTableCell align="center" colSpan={5} sx={{ color: 'black', fontSize: '20px', justifyContent: 'center', border: '1px solid white !important' }}>Total:</StyledTableCell>
                                        <StyledTableCell align="left" colSpan={3} sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹{totalsales.toFixed(2)} </StyledTableCell>
                                    </StyledTableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer><br /><br />
                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, pos.length)} of {pos.length} entries
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
                </> : <>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                    </Box>
                </>}

            </Box>
            <>
                <Box>
                    {/* ALERT DIALOG */}
                    <Dialog
                        open={isDeleteOpen}
                        onClose={handleCloseMod}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseMod} variant="outlined">Cancel</Button>
                            <Button autoFocus variant="contained" color='error'
                                onClick={(e) => deletePos(supid)}
                            > OK </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </>

            { /* ****** Print ****** */}
            <Box sx={userStyle.printcls} >
                <Box>
                    <Typography variant='h5' >Pos</Typography>
                </Box>
                <>
                    <Box  >
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table aria-label="simple table" id="postablepdf" ref={componentRef}>
                                <TableHead sx={{ fontWeight: "600" }} >
                                    <StyledTableRow >
                                        <StyledTableCell align="left">Date</StyledTableCell>
                                        <StyledTableCell align="left">Invoice No.</StyledTableCell>
                                        <StyledTableCell align="left">Company Name</StyledTableCell>
                                        <StyledTableCell align="left">Transfered Location</StyledTableCell>
                                        <StyledTableCell align="left">Grand Total</StyledTableCell>
                                        <StyledTableCell align="left">Total Items</StyledTableCell>
                                        <StyledTableCell align="left">Added By</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {pos && (
                                        pos.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">{moment(row.date).utc().format('DD-MM-YYYY')}</StyledTableCell>
                                                <StyledTableCell align="left">{row.referenceno}</StyledTableCell>
                                                <StyledTableCell align="left">{row.company}</StyledTableCell>
                                                <StyledTableCell align="left">{row.location}</StyledTableCell>
                                                <StyledTableCell align="left">{row.grandtotal}</StyledTableCell>
                                                <StyledTableCell align="left">{row.totalitems}</StyledTableCell>
                                                <StyledTableCell align="left">{row.userbyadd}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </>
            </Box>
        </Box>
    );
}
const Poslist = () => {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Poslisttable /><br /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}
export default Poslist;