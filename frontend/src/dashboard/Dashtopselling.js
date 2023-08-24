import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Paper, OutlinedInput, FormControl, MenuItem, Select, Typography, Grid, Button, Table, TableBody, TableContainer, TableHead, } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../components/Table";
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../services/Baseservice';
import { AuthContext } from '../context/Appcontext';
import { userStyle } from '../pages/PageStyle';
import { ExportXL, ExportCSV } from '../pages/Export';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

function Dashtopselling({isLocations, isLocationChange}) {

  const getcmonth = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const valnmonth = monthNames[getcmonth.getMonth()];

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  // POS
  const [label, setLabel] = useState([]);

  const { auth, setngs } = useContext(AuthContext);
  const [exceldata, setExceldata] = useState([]);

  const getmonthnum = getcmonth.getMonth() + 1;

  const fetchPos = async () => {
    try {
      let res = await axios.get(SERVICE.POS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      let posresult = res.data.pos1.filter((data, index) => {
        if(isLocationChange){
          return data.assignbusinessid == setngs.businessid  && isLocations == data.location
        }else{
          return data.assignbusinessid == setngs.businessid
        }
      })



      let mergepos = posresult.filter((data) => {
        let splittedMonth = data.createdAt.split("-")
        if (splittedMonth[1] == getmonthnum)
          return data
      });
      let allpos = [];
      mergepos.map(item => {
        item.goods.map(value => {
          allpos.push(value);
          const final = [...allpos.reduce((r, o) => {
            const key = o.productid;
            const items = r.get(key) || Object.assign({}, o, {
              quantity: 0
            })
            items.quantity += +o.quantity
            return r.set(key, items);
          }, new Map).values()
          ];
          let sorted = final.sort(({ quantity: a }, { quantity: b }) => b - a);
          setLabel(sorted);
        })
      })
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
      fetchPos();
    }, [isLocations, label]);



  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'HIPOS | TOP SELLING PRODUCTS',
    pageStyle: 'print'
  });

  //  PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#topsellingPDF' })
    doc.save('topselling.pdf')
  }

  // Export Excel
  const fileName = 'Top Selling Products'
  // get perticular columns for export excel
  const getexcelDatas = async () => {
    var data = label.map(t => ({
      "Product Id": t.productid,
      Quantity: t.quantity

    }));
    setExceldata(data);
  }

  useEffect(() => {
    getexcelDatas();
  }, [label]);

  //table sorting
  const [sorting, setSorting] = useState({ column: '', direction: '' });

  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = label.sort((a, b) => {
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
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const filteredDatas = label?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(label.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      <Box sx={userStyle.container}>
        <Typography variant='h6'>Top Selling Products ({valnmonth})</Typography><br></br>
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
              <MenuItem value={(label.length)}>All</MenuItem>
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
                <ExportCSV csvData={exceldata} fileName={fileName} />
                <ExportXL csvData={exceldata} fileName={fileName} />
                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
          </Grid>
        </Grid><br />
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 400 }}
            aria-label="customized table"
            id="expcattable"
          >
            <TableHead>
              <StyledTableRow>
                <StyledTableCell onClick={() => handleSorting('productid')}><Box sx={userStyle.tableheadstyle}><Box>Product Id</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productid')}</Box></Box></StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('quantity')}><Box sx={userStyle.tableheadstyle}><Box>Quantity</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('quantity')}</Box></Box></StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ?
                (filteredData?.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="left">{row.productid}</StyledTableCell>
                    <StyledTableCell align="left">{row.quantity}</StyledTableCell>
                  </StyledTableRow>
                )))
                : <StyledTableRow><StyledTableCell colSpan={2} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
              }
            </TableBody>
          </Table>
        </TableContainer><br />
        <Box style={userStyle.dataTablestyle}>
          <Box>
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, label.length)} of {label.length} entries
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
        { /* ****** Print ****** */}
        <Box sx={userStyle.printcls} >
          <Box>
            <Typography variant='h5' >Top Selling</Typography>
          </Box>
          <>
            <Box>
              <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="topsellingPDF" ref={componentRef}>
                  <TableHead sx={{ fontWeight: "600" }} >
                    <StyledTableRow>
                      <StyledTableCell align="left">Product Id</StyledTableCell>
                      <StyledTableCell align="left">Quantity</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {label && (
                      label.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="left">{row.productid}</StyledTableCell>
                          <StyledTableCell align="left">{row.quantity}</StyledTableCell>
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
    </Box>
  );
}


export default Dashtopselling;