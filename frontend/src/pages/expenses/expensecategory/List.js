import React, { useContext, useEffect, useState, useRef } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput, Paper, Button, Grid, Typography, Dialog, DialogActions, DialogContent, Table, TableBody, TableContainer, TableHead, } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import jsPDF from "jspdf";
import { ExportXL, ExportCSV } from '../../Export';
import { toast } from 'react-toastify';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';
import { useReactToPrint } from "react-to-print";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

function Expcategorylist() {

    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const { auth, setngs } = useContext(AuthContext);
    const [excategorys, setExcategorys] = useState([]);
    const [expcat, setExpcat] = useState("");
    const [exceldata, setExceldata] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    //delete model
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    // Expense Category 
    const fetchExpenseCategory = async () => {
        try {
            let res = await axios.get(SERVICE.EXPENSE_CATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = res.data.excategorys.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid
            })
            setExcategorys(result)
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    useEffect(
        () => {
            fetchExpenseCategory();
        }, []
    );

    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.EXPENSE_CATEGORY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            setExpcat(res.data.sexcategory);
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages)
        }
    }
    let expcatid = expcat._id;

    const backLPage = useNavigate();

    // delete 
    const deleteExpenseCat = async (id) => {
        try {
            let response = await axios.delete(`${SERVICE.EXPENSE_CATEGORY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            await fetchExpenseCategory();
            handleClose();
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    // get particular columns for export excel
    const excelDatas = async () => {
        var data = excategorys.map(t => ({ 'Category Name': t.categoryname, 'Category Code': t.categorycode }));
        setExceldata(data);
    }

    useEffect(
        () => {
            excelDatas();
        }, [excategorys]
    );

    // Export Excel
    const fileName = 'Expense Category'

    //  PDF
    const columns = [
        { title: "Category Name", field: "categoryname" },
        { title: "Category Code", field: "categorycode" },
    ]
    const downloadpdf = () => {
        const doc = new jsPDF()
        doc.autoTable({
            theme: "grid",
            columns: columns.map(col => ({ ...col, dataKey: col.field })),
            body: excategorys
        })
        doc.save('Expense Category.pdf')
    }

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ARANYA HERBALS | EXPENSE CATEGORY',
        pageStyle: 'print'
    });


    // Sorting
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = excategorys.sort((a, b) => {
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
    const filteredDatas = excategorys?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(excategorys.length / pageSize);

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
            <Typography sx={userStyle.HeaderText}>Expense Categories <Typography sx={userStyle.SubHeaderText}>Manage your expense categories</Typography></Typography>
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>All your expense categories</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        {isUserRoleCompare[0].aexpensecategory && (
                            <>
                                <Link to='/expense/expensecategory/create' style={{ textDecoration: 'none', color: 'black' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
                            </>
                        )}
                    </Grid>
                </Grid><br></br>
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
                            <MenuItem value={(excategorys.length)}>All</MenuItem>
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
                </Grid><br></br><br></br>
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid>
                        {isUserRoleCompare[0].excelexpensecategory && (
                            <>
                                <ExportCSV csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0].csvexpensecategory && (
                            <>
                                <ExportXL csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0].printexpensecategory && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>                        </>
                        )}
                        {isUserRoleCompare[0].pdfexpensecategory && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={() => downloadpdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                            </>
                        )}
                    </Grid>
                </Grid>
                <Box>
                    <TableContainer component={Paper} sx={userStyle.tablecontainer}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="expcattable" >
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell onClick={() => handleSorting('categoryname')}><Box sx={userStyle.tableheadstyle}><Box>Category Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categoryname')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('categorycode')}><Box sx={userStyle.tableheadstyle}><Box>Category Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categorycode')}</Box></Box></StyledTableCell>
                                    <StyledTableCell>Action</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length > 0 ?
                                    (filteredData.map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell component="th" scope="row">{row.categoryname} </StyledTableCell>
                                            <StyledTableCell align="left">{row.categorycode}</StyledTableCell>
                                            <StyledTableCell align="left">
                                                {isUserRoleCompare[0].eexpensecategory && (
                                                    <>
                                                        <Link to={`/expense/expensecategory/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>
                                                    </>
                                                )}
                                                {isUserRoleCompare[0].dexpensecategory && (
                                                    <>
                                                        <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontSize: "large" }} /></Button>
                                                    </>
                                                )}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )))
                                    : <StyledTableRow><StyledTableCell colSpan={10} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer><br></br>
                    <Box style={userStyle.dataTablestyle}>
                        <Box>
                            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, excategorys.length)} of {excategorys.length} entries
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
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="expcattable" ref={componentRef}>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Category Name</StyledTableCell>
                            <StyledTableCell align="left">Category Code</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {excategorys && (
                            excategorys.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row">{row.categoryname} </StyledTableCell>
                                    <StyledTableCell align="left">{row.categorycode}</StyledTableCell>
                                </StyledTableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* printlayout ends */}
            {/* ALERT DIALOG */}
            <Dialog
                open={open}
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
                    <Button onClick={(e) => deleteExpenseCat(expcatid)} autoFocus variant="contained" color='error'> OK  </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
const Expensecategorylist = () => {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Expcategorylist /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}
export default Expensecategorylist;