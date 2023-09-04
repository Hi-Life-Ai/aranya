import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Button, Grid, Select, MenuItem, OutlinedInput, Paper, Typography, TableContainer, Table, TableHead, TableBody, FormControl, } from '@mui/material';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { userStyle } from '../PageStyle';
import axios from 'axios';
import jsPDF from "jspdf";
import { ExportXL, ExportCSV } from '../Export';
import { toast } from 'react-toastify';
import { UserRoleAccessContext } from '../../context/Appcontext';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import { useReactToPrint } from "react-to-print";
import Headtitle from '../../components/header/Headtitle';
import { SERVICE } from '../../services/Baseservice';
import { AuthContext } from '../../context/Appcontext';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

function Stockreportall() {

    const [products, setProducts] = useState([]);
    const [exceldata, setExceldata] = useState([]);
    const { auth } = useContext(AuthContext);

    // Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    //role access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    const fetchProduct = async () => {
        try {
            let res = await axios.get(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setProducts(res.data.products);
        }
        catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };
    useEffect(() => {
        fetchProduct();
    }, [])

    // Export Excel
    const fileName = 'Stock Report';
    //  get particular columns for export excel
    const getexcelDatas = async () => {
        var data = products.map(t => ({
            "Item Name": t.productname,
            "Item Code": t.sku,
            "Current Stock": t.currentstock,
            "MRP": t.mrp,
            "Tax": t.hsncode,
        }));
        setExceldata(data);
    }

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ARANYA HERBALS | STOCK REPORT',
        pageStyle: 'print'
    });

    //PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        doc.autoTable({
            html: '#stockreporttable',
        })
        doc.save('Stock Report.pdf')
    }

    useEffect(() => {
        getexcelDatas();
    }, [products])

    //table sorting

    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = products.sort((a, b) => {
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

    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const filteredDatas = products.filter((item) =>
        Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(products.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    let total = 0.00;

    return (
        <Box >
            <Headtitle title={'Stock Report'} />
            { /* ****** Header Content ****** */}
            <Typography variant='body2' sx={userStyle.HeaderText}>Stock Report</Typography>

            <br />
            { /* ****** Table Start ****** */}
            <>
                <Box sx={userStyle.container} >
                    <br /><br />
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
                                <MenuItem value={(products.length)}>All</MenuItem>
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
                    { /* Header Content */}

                    { /* Header Buttons */}
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            {isUserRoleCompare[0].csvstockreport && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0].excelstockreport && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0].printstockreport && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0].pdftockreport && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid><br />
                    { /* Table Start */}
                    <TableContainer component={Paper} >
                        <Table>
                            <TableHead  >
                                <StyledTableRow >
                                    <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Item Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('sku')}><Box sx={userStyle.tableheadstyle}><Box>Item Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sku')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('currentstock')}><Box sx={userStyle.tableheadstyle}><Box>Current Stock</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('currentstock')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('mrp')}><Box sx={userStyle.tableheadstyle}><Box>MRP</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('mrp')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('hsn')}><Box sx={userStyle.tableheadstyle}><Box>Tax</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('hsn')}</Box></Box></StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length > 0 ?
                                    (filteredData.map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell>{row.productname}</StyledTableCell>
                                            <StyledTableCell>{row.sku}</StyledTableCell>
                                            <StyledTableCell>{row.currentstock}</StyledTableCell>
                                            <StyledTableCell>{row.mrp}</StyledTableCell>
                                            <StyledTableCell>{row.hsn == "" ? row.applicabletax : row.hsn}</StyledTableCell>
                                        </StyledTableRow>
                                    )))
                                    : <StyledTableRow><StyledTableCell colSpan={13} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <br /><br />
                    <Box style={userStyle.dataTablestyle}>
                        <Box>
                            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, products.length)} of {products.length} entries
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

                    { /* Table End */}
                </Box>
            </>

            {/* print layout     */}
            <>
                <Box >
                    <Box sx={userStyle.printcls}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table" id="stockreporttable" ref={componentRef}>
                                <TableHead>
                                    <StyledTableRow >
                                        <StyledTableCell>Item Code </StyledTableCell>
                                        <StyledTableCell>Item Name</StyledTableCell>
                                        <StyledTableCell>Current Stock</StyledTableCell>
                                        <StyledTableCell>MRP</StyledTableCell>
                                        <StyledTableCell>Tax</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {products &&
                                        products?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{row.productname}</StyledTableCell>
                                                <StyledTableCell>{row.sku}</StyledTableCell>
                                                <StyledTableCell>{row.currentstock}</StyledTableCell>
                                                <StyledTableCell>{row.mrp}</StyledTableCell>
                                                <StyledTableCell>{row.hsn == "" ? row.applicabletax : row.hsn}</StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>

            </>
        </Box>
    );

}
function Stockreport() {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Stockreportall /><br /><br /><br />
                        <Footer /><br />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Stockreport;