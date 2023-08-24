import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Button, Grid, OutlinedInput,Dialog,DialogContent, DialogActions, Paper, Typography, TableContainer, Table, TableHead,TableBody, TableFooter, Select, MenuItem, FormControl } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { userStyle } from '../../PageStyle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import axios from 'axios';
import jsPDF from "jspdf";
import { ExportXL, ExportCSV } from '../../Export';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import { SERVICE } from "../../../services/Baseservice";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';


function Expensestablelist() {

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth, setngs } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);
    const [exceldata, setExceldata] = useState([]);
    const [exp, setExp] = useState({});
    //sort
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");


    //delete model
    const [openDelete, setOpenDelete] = useState(false);
    const handleClickOpen = () => { setOpenDelete(true); };
    const handleCloseDelete = () => { setOpenDelete(false); }


    let total = 0.00;
    let sum = 0.00;

    // Expense
    const fetchExpense = async () => {
        try {
            let res = await axios.get(SERVICE.EXPENSE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
             
            let result = res.data.expenses.filter((data, index)=>{
                if(isUserRoleAccess.role == 'Admin'){
                return data.assignbusinessid == setngs.businessid
                }else {
                if(isUserRoleAccess.businesslocation.includes(data.busilocation)){
                return data.assignbusinessid == setngs.businessid
                }
            }
            })
            setExpenses(result);
        } catch (err) {
            const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
        }
    };

    const rowDataexp = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.EXPENSE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
            setExp(res.data.sexpense);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }
    let expid = exp._id;

    // Delete
    const deleteExpense = async (id) => {
        try {
            let response = await axios.delete(`${SERVICE.EXPENSE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchExpense();
            handleCloseDelete();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(
        () => {
            fetchExpense();
        }, []
    );

    // Export Excel
    const fileName = 'Expenses'
    // get perticular columns for export excel
    const getexcelDatas = async () => {
        var data = expenses.map(t => ({
            Date: t.exppaidon, 'Reference No': t.referenceno,
            'Expense Category': t.expcategory,'Expense Note': t.expnote, Location: t.busilocation, Tax: t.exptax,
            'Total Amount': t.totalamount, 'Amount Paid': t.expamount, 'Payment Due': t.paydue,'Payment Method': t.paymethod, 'Paid On': t.exppaidon,'Payment Note': t.paynotes,
        }));
        setExceldata(data);
    }

    useEffect(
        () => {
            getexcelDatas();
        }, [expenses]
    );

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ARANYA HERBALS | EXPENSES',
        pageStyle: 'print'
    });

    // PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#expensetablepdf' })
        doc.save('Expenses.pdf')
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
    const filteredDatas = expenses?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(expenses.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }


    return (
        <Box>
            <Typography sx={userStyle.HeaderText}>Expenses</Typography>
            <br />
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.HeaderText}>All Expenses</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        {isUserRoleCompare[0].aexpense && (
                            <>
                                <Link to="/expense/expense/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
                            </>
                        )}
                    </Grid>
                </Grid>
                <br></br>
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
                            <MenuItem value={(expenses.length)}>All</MenuItem>
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
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid>
                        {isUserRoleCompare[0].csvexpense && (
                            <>
                                <ExportCSV csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0].excelexpense && (
                            <>
                                <ExportXL csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0].printexpense && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>                            </>
                        )}
                        {isUserRoleCompare[0].pdfexpense && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                            </>
                        )}
                    </Grid>
                </Grid><br />
                <Box>
                    {/* ****** Table Start ****** */}
                    <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="expensetable">
                            <TableHead>
                                <StyledTableRow >
                                    <StyledTableCell >Action</StyledTableCell>

                                    <StyledTableCell onClick={() => handleSorting('expdate')}><Box sx={userStyle.tableheadstyle}><Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('expdate')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('referenceno')}><Box sx={userStyle.tableheadstyle}><Box>Reference No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('referenceno')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('expcategory')}><Box sx={userStyle.tableheadstyle}><Box>Expense Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('expcategory')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('busilocation')}><Box sx={userStyle.tableheadstyle}><Box>Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('busilocation')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('paydue')}><Box sx={userStyle.tableheadstyle}><Box>Payment status</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('paydue')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('exptax')}><Box sx={userStyle.tableheadstyle}><Box>Tax</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('exptax')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('totalamount')}><Box sx={userStyle.tableheadstyle}><Box>Total Amount</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('totalamount')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('paydue')}><Box sx={userStyle.tableheadstyle}><Box>Payment Due</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('paydue')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('expnote')}><Box sx={userStyle.tableheadstyle}><Box>Expense Note</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('expnote')}</Box></Box></StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length > 0 ?
                                    (filteredData.map((item, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell component="th" scope="row">
                                                <Grid sx={{ display: 'flex' }}>
                                                    {isUserRoleCompare[0].eexpense && (
                                                        <>
                                                            <Link to={`/expense/espense/edit/${item._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                        </>
                                                    )}
                                                    {isUserRoleCompare[0].dexpense && (
                                                        <>
                                                            <Button variant="contained" color="error" size="small" onClick={(e) => { handleClickOpen(); rowDataexp(item._id) }} sx={userStyle.buttondelete}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                                        </>
                                                    )}
                                                </Grid>
                                            </StyledTableCell>
                                            <StyledTableCell align="left">{moment(item.expdate).format("DD-MM-YYYY")}</StyledTableCell>
                                            <StyledTableCell align="left">{item.referenceno}</StyledTableCell>
                                            <StyledTableCell align="left">{item.expcategory}</StyledTableCell>
                                            <StyledTableCell align="left">{item.busilocation}</StyledTableCell>
                                            <StyledTableCell align="left">
                                            <Button size="small" variant='contained' sx={{ padding: '0px 2px', fontSize: '11px', textTransform: 'capitalize', opacity: '0.9' }}
                                                    color={item.paydue != 0 ? "info" : "success"}>
                                                    {item.paydue != 0 ? "Pending" : "Paid"}
                                                </Button>
                                            </StyledTableCell>
                                            <StyledTableCell align="left">{item.exptax}</StyledTableCell>
                                            <StyledTableCell align="left">₹ {Number(item.totalamount).toFixed(2)}</StyledTableCell>
                                            <StyledTableCell align="left">₹ {Number(item.paydue).toFixed(2)}</StyledTableCell>
                                            <StyledTableCell align="left">{item.expnote}</StyledTableCell>
                                            {/* <StyledTableCell>{item.files.map((file,index)=> (
                                                <>
                                                <Button sx={userStyle.buttonview} style={{ minWidth: '0px' }} onClick={file.data}><SimCardDownloadIcon  /></Button>
                                                </>
                                            ))}</StyledTableCell> */}
                                        </StyledTableRow>
                                    )))
                                    : <StyledTableRow><StyledTableCell colSpan={10} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                }
                            </TableBody>
                            <TableFooter sx={{ backgroundColor: '#9591914f', height: '75px' }}>
                                <StyledTableRow className="table2_total" >
                                    {expenses && (
                                        expenses.forEach(
                                            (item => {
                                                total += +item.totalamount;
                                                sum += +item.paydue;
                                            })
                                        ))}
                                    <StyledTableCell align="center" colSpan={5} sx={{ color: 'black', fontSize: '20px', justifyContent: 'center', border: '1px solid white !important' }}>Total:</StyledTableCell>
                                    <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px' }}></StyledTableCell>
                                    <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}></StyledTableCell>
                                    <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹ {total.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹ {sum.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="left"></StyledTableCell>
                                </StyledTableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer><br></br>
                    <Box style={userStyle.dataTablestyle}>
                        <Box>
                            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, expenses.length)} of {expenses.length} entries
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
                    {/* ****** Table End ****** */}
                </Box>
            </Box>
            {/* print layout */}
            {/* ****** Table Start ****** */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="expensetablepdf" ref={componentRef}>
                    <TableHead>
                        <StyledTableRow >
                            <StyledTableCell align="left" >Date</StyledTableCell>
                            <StyledTableCell align="left" >Reference No.</StyledTableCell>
                            <StyledTableCell align="left" >Expense Category</StyledTableCell>
                            <StyledTableCell align="left" >Location</StyledTableCell>
                            <StyledTableCell align="left" >Payment status</StyledTableCell>
                            <StyledTableCell align="left" >Tax</StyledTableCell>
                            <StyledTableCell align="left" >Total Amount</StyledTableCell>
                            <StyledTableCell align="left" >Payment Due</StyledTableCell>
                            <StyledTableCell align="left" >Expense Note</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {expenses &&
                            expenses.map((item, index) => {
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell align="left">{moment(item.expdate).format("DD-MM-YYYY")}</StyledTableCell>
                                        <StyledTableCell align="left">{item.referenceno}</StyledTableCell>
                                        <StyledTableCell align="left">{item.expcategory}</StyledTableCell>
                                        <StyledTableCell align="left">{item.busilocation}</StyledTableCell>
                                        <StyledTableCell align="left">
                                                <Button size="small" variant='contained' sx={{ padding: '0px 2px', fontSize: '11px', textTransform: 'capitalize', opacity: '0.9' }}
                                                    color={item.paydue != 0 ? "info" : "success"}>
                                                    {item.paydue != 0 ? "Pending" : "Paid"}
                                                </Button>
                                            </StyledTableCell>
                                        <StyledTableCell align="left">{item.exptax}</StyledTableCell>
                                        <StyledTableCell align="left">{Number(item.totalamount).toFixed(2)}</StyledTableCell>
                                        <StyledTableCell align="left">{Number(item.paydue).toFixed(2)}</StyledTableCell>
                                        <StyledTableCell align="left">{item.expnote}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* printlayout ends */}
            
            {/* ALERT DIALOG */}
            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} variant="outlined">Cancel</Button>
                    <Button onClick={(e) => deleteExpense(expid)} autoFocus variant="contained" color='error'> OK  </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
function Expenselist() {
    return (
        <>
            <Box >
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Expensestablelist /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Expenselist;