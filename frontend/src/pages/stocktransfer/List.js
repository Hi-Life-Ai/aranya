import React, { useState, useEffect, useRef, useContext, } from "react";
import { Box, Button, Typography, Paper, Select, MenuItem, FormControl, OutlinedInput, TableHead, Table, TableContainer,TableCell,TableRow, TableBody, Grid } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link } from 'react-router-dom';
import { userStyle } from '../PageStyle';
import "rsuite/dist/rsuite.css";
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import Headtitle from '../../components/header/Headtitle';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from "../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { useReactToPrint } from "react-to-print"
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import autoTable from 'jspdf-autotable';
import jsPDF from "jspdf";

const Transfertablelist = () => {

    const [transfer, setTransfer] = useState([]);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const { auth, setngs } = useContext(AuthContext);
    let arr = [];

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    // transfer 
    const fetchtransfer = async () => {
        try {
            let response = await axios.get(SERVICE.TRANSFERS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

          setTransfer(response.data.transfers)
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    useEffect(
        () => {
            fetchtransfer();
        }, []);

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Stock Transfer',
        pageStyle: 'print'
    });

    //  PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#transfertablepdf' })
        doc.save('Stocktransfer.pdf')
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
    const filteredDatas = transfer?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(transfer.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <Box>
                <Headtitle title={'Stock Transfer'} />
                <Typography sx={userStyle.HeaderText}>Stock Transfer</Typography>
            </Box>
            {/* //table----------------------------------------------- */}
            <Box sx={userStyle.container}>
                { /* Table header  */}
                <Grid container >
                    <Grid item lg={8} md={8} sm={8} xs={12}>
                        <Typography sx={userStyle.importheadtext}>All your transfer</Typography>
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={12} sx={{ textAlign: 'right !important' }}>
                        {isUserRoleCompare[0].acurrentstocktransferlist && (
                            <>
                                <Link to="/stocktransfer/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
                            <MenuItem value={(transfer.length)}>All</MenuItem>
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
                <Grid container sx={{ justifyContent: "center", }}>
                    {isUserRoleCompare[0].printcurrentstocktransferlist && (
                        <>
                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                        </>
                    )}
                    {isUserRoleCompare[0].pdfcurrentstocktransferlist && (
                        <>
                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                        </>
                    )}
                </Grid><br /><br />
                { /* Table start */}
                <Box>
                    <TableContainer component={Paper} >
                        <Table aria-label="customized table" id="transfertable">
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell onClick={() => handleSorting('date')}><Box sx={userStyle.tableheadstyle}><Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('date')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('fromlocation')}><Box sx={userStyle.tableheadstyle}><Box>From Company</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('fromlocation')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('products')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('products')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('products')}><Box sx={userStyle.tableheadstyle}><Box>Quantity</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('products')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('tobusinesslocations')}><Box sx={userStyle.tableheadstyle}><Box>To Locations</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('tobusinesslocations')}</Box></Box></StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length > 0 ?
                                    (filteredData.map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell>{row.date}</StyledTableCell>
                                            <StyledTableCell>{row.fromlocation}</StyledTableCell>
                                            <StyledTableCell>{row.products?.map((value) => value.productname + ", ")}</StyledTableCell>
                                            <StyledTableCell>{row.products?.map((value) => value.locations?.map((data, liindec) => value.quantity[data] + ','))}</StyledTableCell>
                                            <StyledTableCell>{row.tobusinesslocations+ ", "}</StyledTableCell>
                                           <StyledTableCell>
                                                <Grid sx={{display:'flex'}}>
                                                {isUserRoleCompare[0].vstocktransferlist && (
                                                        <>
                                                        <Link to={`/stocktransfer/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                                                        </>
                                                    )}
                                                </Grid>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )))
                                    : <StyledTableRow><StyledTableCell colSpan={6} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <br /><br />
                    <Box style={userStyle.dataTablestyle}>
                        <Box>
                            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, transfer.length)} of {transfer.length} entries
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
                { /* Table end */}
            </Box>
            <Box sx={userStyle.printcls}>
                <TableContainer component={Paper} >
                    <Table aria-label="customized table" id="transfertablepdf" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>From Company</TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>To Locations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transfer && (
                                transfer.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.fromlocation}</TableCell>
                                        <TableCell>{row.products.map((value) => value.productname + ", ")}</TableCell>
                                        <StyledTableCell>{row.products.map((value) => value.locations.map((data, liindec) => value.quantity[data] + ','))}</StyledTableCell>
                                        <TableCell>{row.tobusinesslocations+ ", "}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </>
    )
}

function Transferlists() {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Transfertablelist /><br /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Transferlists;