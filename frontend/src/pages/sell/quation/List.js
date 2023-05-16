import React, { useState, useEffect, useContext, createRef, useRef } from 'react';
import { Box, Button, Select, MenuItem, FormControl, OutlinedInput, Grid, Dialog, DialogContent, DialogActions, Typography, Table, TableBody, TableContainer, TableHead, Paper } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ExportXL, ExportCSV } from '../../Export';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { SERVICE } from '../../../services/Baseservice';
import Headtitle from '../../../components/header/Headtitle';
import jsPDF from "jspdf";
import moment from 'moment';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';
import { useReactToPrint } from "react-to-print";

const Quotationlisttable = () => {

    const { auth, setngs } = useContext(AuthContext);
    const [quotations, setQuotations] = useState([]);
    const [deleteqot, setDeleteqot] = useState({});
    const [exceldata, setExceldata] = useState([]);

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // User Access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    // Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => { setIsDeleteOpen(true); };
    const handleClose = () => { setIsDeleteOpen(false); };

    // Quotations
    const fetchQuotation = async () => {
        try {
            let response = await axios.get(SERVICE.QUOTATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = response.data.quotations.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid
            })
            setQuotations(result);
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    useEffect(
        () => {
            fetchQuotation();
        }, []
    );

    //set function to get particular row
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.QUOTATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setDeleteqot(res.data.squotation);
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    // Alert delete popup
    let supid = deleteqot._id;
    const deleteQuot = async () => {
        try {
            let res = await axios.delete(`${SERVICE.QUOTATION_SINGLE}/${supid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            await fetchQuotation();
            handleClose();
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    // Export Excel
    const fileName = 'Quotations'
    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = quotations.map(t => ({
            'Date': moment(t.date).utc().format('DD-MM-YYYY'), 'Invoice No': t.referenceno, 'Company': t.company,'Company Address': t.companyaddress,'Company GSTN': t.gstn,'Bank Name': t.bankname,'Acc No': t.accountnumber,'IFSC Code': t.ifsccode,'Company contact person Name': t.companycontactpersonname,'Company Contact Person No': t.companycontactpersonnumber,
             'Delivery': t.location,'Delivery Address': t.deliveryaddress,'Delivery GSTN': t.deliverygstn,'Delivery Contact Person Name': t.deliverycontactpersonname,'Delivery Contact Person No': t.deliverycontactpersonnumber,'Driver Name': t.drivername,'Driver No': t.drivername,'Driver Phone No': t.drivernphonenumber,'Sales Person Name': t.salesman, 'Sales Person Contact No': t.salesmannumber,
            'Grand Total': t.grandtotal, 'Total Quantity':t.totalproducts,'Total Items': t.totalitems, 'Added By': t.userbyadd
        }));
        setExceldata(data);
    }

    useEffect(
        () => {
            getexcelDatas();
        }, [quotations]
    );

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ARANYA HERBALS | QUOTATION',
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
        autoTable(doc, { html: '#listquotationtablepdf' })
        doc.save('Quotation.pdf')
    }

    // Sorting
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = quotations.sort((a, b) => {
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
    const filteredDatas = quotations?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(quotations.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Box>
            <Headtitle title={'Quotation List'} />
            <Typography sx={userStyle.HeaderText}>Quotations</Typography>
            {/* Table */}
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item xs={8}></Grid>
                    <Grid item xs={4}>
                        {isUserRoleCompare[0].aquotation && (
                            <>
                                <Link to="/sell/pos/create" style={{ textDecoration: 'none', color: 'white' }}> <Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
                            <MenuItem value={(quotations.length)}>All</MenuItem>
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
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid >
                        {isUserRoleCompare[0].csvquotation && (
                            <>
                                <ExportCSV csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0].excelquotation && (
                            <>
                                <ExportXL csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0].printquotation && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                            </>
                        )}
                        {isUserRoleCompare[0].pdfquotation && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                            </>
                        )}
                    </Grid>
                </Grid><br /><br />
                <Box>
                    <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="listquotationtable">
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell align="left">Action</StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('date')}><Box sx={userStyle.tableheadstyle}><Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('date')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('referenceno')}><Box sx={userStyle.tableheadstyle}><Box>Quotation No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('referenceno')}</Box></Box></StyledTableCell>
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
                                            <StyledTableCell >
                                                <Grid sx={{ display: 'flex' }}>
                                                    {isUserRoleCompare[0].equotation && (
                                                        <>
                                                            <Link to={`/sell/quotation/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                        </>
                                                    )}
                                                    {isUserRoleCompare[0].dquotation && (
                                                        <>
                                                            <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                                        </>
                                                    )}
                                                    {isUserRoleCompare[0].vquotation && (
                                                        <>
                                                            <Link to={`/sell/quotation/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                        </>
                                                    )}
                                                </Grid>
                                            </StyledTableCell>
                                            <StyledTableCell component="th" scope="row">{moment(row.date).utc().format('DD-MM-YYYY')}</StyledTableCell>
                                            <StyledTableCell align="left">{row.referenceno}</StyledTableCell>
                                            <StyledTableCell align="left">{row.company}</StyledTableCell>
                                            <StyledTableCell align="left">{row.location}</StyledTableCell>
                                            <StyledTableCell align="left">{row.grandtotal}</StyledTableCell>
                                            <StyledTableCell align="left">{row.totalitems}</StyledTableCell>
                                            <StyledTableCell align="left">{row.userbyadd}</StyledTableCell>
                                        </StyledTableRow>
                                    )))
                                    : <StyledTableRow><StyledTableCell colSpan={9} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer><br /><br />
                    <Box style={userStyle.dataTablestyle}>
                        <Box>
                            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, quotations.length)} of {quotations.length} entries
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
            </Box>
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="outlined">Cancel</Button>
                        <Button autoFocus variant="contained" color='error' onClick={(e) => deleteQuot(supid)}> OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            { /* ****** Print ****** */}
            <Box sx={userStyle.printcls} >
                <Box>
                    <Typography variant='h5' >Draft</Typography>
                </Box>
                <>
                    <Box  >
                        <TableContainer component={Paper} sx={userStyle.printcls}>
                            <Table aria-label="simple table" id="listquotationtablepdf" ref={componentRef}>
                                <TableHead sx={{ fontWeight: "600" }} >
                                    <StyledTableRow >
                                        <StyledTableCell align="left">Date</StyledTableCell>
                                        <StyledTableCell align="left">Quotation No.</StyledTableCell>
                                        <StyledTableCell align="left">Comapny Name</StyledTableCell>
                                        <StyledTableCell align="left">Transfered Location</StyledTableCell>
                                        <StyledTableCell align="left">Grand Total</StyledTableCell>
                                        <StyledTableCell align="left">Total Items</StyledTableCell>
                                        <StyledTableCell align="left">Added By</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {quotations && (
                                        quotations.map((row, index) => (
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
const Quotationlist = () => {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Quotationlisttable /><br /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}
export default Quotationlist;