import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Paper, Button, Grid, OutlinedInput, FormControl, MenuItem, Select, Typography, Table, TableBody, TableContainer, TableHead, } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../components/Table";
import { dashboardstyle } from './Dashboardstyle';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../services/Baseservice';
import { userStyle } from '../pages/PageStyle';
import { AuthContext } from '../context/Appcontext';
import { ExportXL, ExportCSV } from '../pages/Export';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

function Dashstockalert() {

  const [quantity, setQuantity] = useState([]);

  const { auth, setngs } = useContext(AuthContext);
  const [exceldata, setExceldata] = useState([]);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // Products
  const fetchProducts = async () => {
    try {
      let response = await axios.get(SERVICE.PRODUCT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      let result = response.data.products.filter((data, index)=>{
          return data.assignbusinessid == setngs.businessid
    })
      let prodData = result.filter((data) => {
        return data.currentstock <= data.minquantity
      })

      setQuantity(prodData)

    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
    }
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
  const filteredDatas = quantity?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(quantity.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  useEffect(
    () => {
    fetchProducts();
  }, [])


  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'HIPOS | STOCK ALERT',
    pageStyle: 'print'
  });

  //  PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#stockalertPDF' })
    doc.save('stockalert.pdf')
  }

  // Export Excel
  const fileName = 'Stock Alert'
  // get perticular columns for export excel
  const getexcelDatas = async () => {
    var data = quantity.map(t => ({
      Code: 't.sku',
      Product: 't.productname',
      "Current Stock": 't.currentstock',
      "Alert Quantity": 't.minquantity',
    }));
    setExceldata(data);
  }

  useEffect(() => {
    getexcelDatas();
  }, [quantity]);

  return (
    <Box>
      <Box sx={userStyle.container}>
        <Box sx={dashboardstyle}>
          <Typography variant='h6'>Stock Alert</Typography>
        </Box>
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
              <MenuItem value={(quantity.length)}>All</MenuItem>
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
        </Grid><br />
        <Grid container sx={userStyle.gridcontainer}>
          <Grid>
            <ExportCSV csvData={exceldata} fileName={fileName} />
            <ExportXL csvData={exceldata} fileName={fileName} />
            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
          </Grid>
        </Grid><br />
        <TableContainer component={Paper} >
          <Table aria-label="customized table" id="draftstable">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell onClick={() => handleSorting('sku')}><Box sx={userStyle.tableheadstyle}><Box>Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sku')}</Box></Box></StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Product</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('currentstock')}><Box sx={userStyle.tableheadstyle}><Box>Current Stock</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('currentstock')}</Box></Box></StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('minquantity')}><Box sx={userStyle.tableheadstyle}><Box>Alert Quantity</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('minquantity')}</Box></Box></StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ?
                (filteredData.map((row, index) => (
                  <StyledTableRow key={index} >
                    <StyledTableCell align="left">{row.sku}</StyledTableCell>
                    <StyledTableCell align="left">{row.productname}</StyledTableCell>
                    <StyledTableCell align="left">{row.currentstock}</StyledTableCell>
                    <StyledTableCell align="left">{row.minquantity}</StyledTableCell>
                  </StyledTableRow>
                )))
                : <StyledTableRow><StyledTableCell colSpan={5} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
              }
            </TableBody>
          </Table>
        </TableContainer><br />
        { /* ****** Print ****** */}
        <Box sx={userStyle.printcls} >
          <Box>
            <Typography variant='h5' >Stock Alert</Typography>
          </Box>
          <>
            <Box>
              <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="stockalertPDF" ref={componentRef}>
                  <TableHead sx={{ fontWeight: "600" }} >
                    <StyledTableRow>
                      <StyledTableCell align="left">Code</StyledTableCell>
                      <StyledTableCell align="left">Product</StyledTableCell>
                      <StyledTableCell align="left">Current Stock</StyledTableCell>
                      <StyledTableCell align="left">Alert Quantity</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {quantity && (
                      quantity.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="left">{row.sku}</StyledTableCell>
                          <StyledTableCell align="left">{row.productname}</StyledTableCell>
                          <StyledTableCell align="left">{row.currentstock}</StyledTableCell>
                          <StyledTableCell align="left">{row.minquantity}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        </Box>
        <br /><br />
        <Box style={userStyle.dataTablestyle}>
          <Box>
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, quantity.length)} of {quantity.length} entries
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
  );
}

export default Dashstockalert;