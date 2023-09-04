import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Button, Grid, Select, MenuItem, OutlinedInput, Paper, TableFooter, Typography, TableContainer, Table, TableHead, TableBody, FormControl, } from '@mui/material';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { userStyle, colourStyles } from '../PageStyle';
import axios from 'axios';
import Selects from "react-select";
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

function Unitwisereportall() {

    const [products, setProducts] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectFilter, setSelectFilter] = useState({ unit: "" })
    const [exceldata, setExceldata] = useState([]);
    const { auth, setngs } = useContext(AuthContext);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");

    let total = 0.00;
    //role access
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);

    // get all products
    const fetchUnit = async () => {
        try {
            let res = await axios.get(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            let result = res.data.units.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid
            })

            setUnits(
                result?.map((d) => ({

                    ...d,
                    label: d.unit,
                    value: d.unit,
                }))
            );
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    const searchLoc = async () => {
        try {
            let res = await axios.get(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = res.data.products.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid
            })

            let prodDataLocation = result.filter((data) => {

                if (data.unit == selectFilter.unit) {
                    return data
                }
            });
            setProducts(prodDataLocation);
        }
        catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    useEffect(() => {
        fetchUnit();
    }, [])

    // Export Excel
    const fileName = 'Unit Wise Report';
    //  get particular columns for export excel
    const getexcelDatas = async () => {
        var data = products.map(t => ({
            "Item Code": t.sku,
            "Item Name": t.productname,
            "Category": t.category,
            "MRP": t.mrp.toFixed(2),
            "Unit": t.unit,
            "Tax": t.hsncode,
            "Current Stock": t.currentstock,
        }));
        setExceldata(data);
    }

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ARANYA HERBALS | UNIT WISE REPORT',
        pageStyle: 'print'
    });

    //PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        doc.autoTable({
            html: '#producttable',
            margin: { top: 10 },
        })
        doc.save('Unit Wise Report.pdf')
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

    return (
        <Box >
            <Headtitle title={'Unit Wise Product Report'} />
            { /* ****** Header Content ****** */}
            <Typography variant='body2' sx={userStyle.HeaderText}>Unit Wise Product Report</Typography>
            <Box sx={userStyle.filtercontent} >
                <Grid container spacing={2}>
                    <Grid item lg={4} md={4}  ></Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl size="small" fullWidth >
                            <Selects
                                onChange={(e) => {
                                    setSelectFilter({ ...selectFilter, unit: e.value });
                                }}
                                placeholder={"Unit"}
                                styles={colourStyles}
                                options={units}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item lg={2} md={2} sm={12} xs={12}>
                        <Button variant='outlined'sx={{
                             backgroundColor: '#339d3a !important',
                             height: '35px !important',
                             borderRadius: '5px !important',
                             color: 'white',
                             '&:hover': {
                                 backgroundColor: 'white !important',
                                 border: '1px solid #339d3a',
                                 color: '#339d3a',
                             }
                        }} onClick={(e) => { searchLoc() }} >Generate</Button>
                    </Grid>
                    <Grid item lg={3} md={3}  ></Grid>
                </Grid>
            </Box>
            <br />
            { /* ****** Table Start ****** */}
            <>
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
                            {isUserRoleCompare[0].csvunitwisereport && (
                                <>
                                    <ExportCSV csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0].excelunitwisereport && (
                                <>
                                    <ExportXL csvData={exceldata} fileName={fileName} />
                                </>
                            )}
                            {isUserRoleCompare[0].printunitwisereport && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                </>
                            )}
                            {isUserRoleCompare[0].pdfunitwisereport && (
                                <>
                                    <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                </>
                            )}
                        </Grid>
                    </Grid><br />
                    { /* Table Start */}
                    <TableContainer component={Paper} >
                        <Table >
                            <TableHead  >
                                <StyledTableRow >
                                    <StyledTableCell onClick={() => handleSorting('sku')}><Box sx={userStyle.tableheadstyle}><Box>Item Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sku')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Item Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('category')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('mrp')}><Box sx={userStyle.tableheadstyle}><Box>MRP</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('unit')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('unit')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('hsncode')}><Box sx={userStyle.tableheadstyle}><Box>Tax</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('hsncode')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('currentstock')}><Box sx={userStyle.tableheadstyle}><Box>Current Stock</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('minquantity')}</Box></Box></StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length > 0 ?
                                    (filteredData.map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell>{row.sku}</StyledTableCell>
                                            <StyledTableCell>{row.productname}</StyledTableCell>
                                            <StyledTableCell>{row.category}</StyledTableCell>
                                            <StyledTableCell>{row.mrp.toFixed(2)}</StyledTableCell>
                                            <StyledTableCell>{row.unit}</StyledTableCell>
                                            <StyledTableCell>{row.hsn == "" || row.hsn == "None" ? row.applicabletax : row.hsn}</StyledTableCell>
                                            <StyledTableCell>{row.currentstock}</StyledTableCell>
                                        </StyledTableRow>
                                    )))
                                    : <StyledTableRow><StyledTableCell colSpan={13} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                }
                            </TableBody>
                            <TableFooter sx={{ backgroundColor: '#9591914f', height: '50px' }}>
                                <StyledTableRow className="table2_total" >
                                    {products && (
                                        products.forEach(
                                            (item => {
                                                total += +item.mrp;
                                            })
                                        ))}
                                    <StyledTableCell align="center" colSpan={3} sx={{ color: 'black', fontSize: '20px', justifyContent: 'center', border: '1px solid white !important' }}>Total:</StyledTableCell>
                                    <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹ {total.toFixed(2)}</StyledTableCell>
                                    <StyledTableCell align="left" colSpan={3}></StyledTableCell>
                                </StyledTableRow>
                            </TableFooter>
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
                            <Table sx={{ minWidth: 700 }} aria-label="customized table" id="producttable" ref={componentRef}>
                                <TableHead>
                                    <StyledTableRow >
                                        <StyledTableCell>Item Code </StyledTableCell>
                                        <StyledTableCell>Item Name</StyledTableCell>
                                        <StyledTableCell>Category</StyledTableCell>
                                        <StyledTableCell>MRP</StyledTableCell>
                                        <StyledTableCell>Unit</StyledTableCell>
                                        <StyledTableCell>Tax</StyledTableCell>
                                        <StyledTableCell>Current Stock</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {products &&
                                        products?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{row.sku}</StyledTableCell>
                                                <StyledTableCell>{row.productname}</StyledTableCell>
                                                <StyledTableCell>{row.category}</StyledTableCell>
                                                <StyledTableCell>{row.mrp.toFixed(2)}</StyledTableCell>
                                                <StyledTableCell>{row.unit}</StyledTableCell>
                                                <StyledTableCell>{row.hsn == "" || row.hsn == "None" ? row.applicabletax : row.hsn}</StyledTableCell>
                                                <StyledTableCell>{row.currentstock}</StyledTableCell>
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

function Unitwisereport() {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Unitwisereportall /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Unitwisereport;