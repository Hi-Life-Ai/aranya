import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Button, Grid, Select, MenuItem, InputLabel, OutlinedInput, Paper, Typography, TableContainer, Table, TableHead, TableBody, FormControl, } from '@mui/material';
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
import moment from "moment";

function Expiringreportall() {

  const [products, setProducts] = useState([]);
  const [exceldata, setExceldata] = useState([]);
  const { auth, setngs } = useContext(AuthContext);
  const [location, setLocation] = useState([]);

  let expiryday = setngs.expiryday;

  // Jquery...
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // Role Access
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

  // Business Location
  const fetchLocation = async () => {
    try {
      let req = await axios.get(SERVICE.BUSINESS_LOCATION, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      let result = req.data.busilocations.filter((data, index) => {
        if (isUserRoleAccess.role == 'Admin') {
          return data.assignbusinessid == setngs.businessid
        } else {
          if (isUserRoleAccess.businesslocation.includes(data.locationid)) {
            return data.assignbusinessid == setngs.businessid
          }
        }
      })
      setLocation(
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

  // Filter
  const searchLoc = async (e) => {
    try {
      let res = await axios.get(SERVICE.POS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });

      let result = res.data.pos1.filter((data) => {
        return data.location == e.name
      });

      let current = new Date();
      let currentDate = moment(current).format('DD-MM-YYYY');

      let finalResult = []
      
      result.forEach((value) => {
       
        value.goods.forEach((valueData) => {

          // Expire date
          let expDate = new Date(valueData.expirydate);
          let previousexpirydate = new Date(expDate.getTime() - expiryday * 24 * 60 * 60 * 1000)
          let beforeDate = moment(previousexpirydate).format('DD-MM-YYYY');
          if (currentDate < beforeDate ) {
            finalResult.push(valueData);
          }
        })
      })

      setProducts(finalResult)

    }
    catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  };

  // Export Excel
  const fileName = 'Location Wise Expiry Report';
  //  get particular columns for export excel
  const getexcelDatas = async () => {
    var data = products.map(t => ({
      "Item Code": t.productid,
      "Item Name": t.productname,
      "Manufacture Date": t.unit,
      "Location": t.location,
      "Quantity": t.quantity,
      "MRP": t.mrp,
      "Expiry Data": t.expirydate,
    }));
    setExceldata(data);
  }

  useEffect(() => {
    getexcelDatas();
  }, [products])

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'ARANYA HERBALS | LOCATION WISE EXPIRY REPORT',
    pageStyle: 'print'
  });

  //PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.autoTable({
      html: '#producttable',
      margin: { top: 10 },
    })
    doc.save('Location Wise Expiry Report.pdf')
  }

  // Table sorting
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
      <Headtitle title={'Location Wise Expiry Report'} />
      { /* ****** Header Content ****** */}
      <Typography variant='body2' sx={userStyle.HeaderText}>Location Wise Expiry Report</Typography>

      <br />

      <Box sx={userStyle.filtercontent} >
        <Grid container spacing={2}>
          <Grid item lg={4} md={4}  ></Grid>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <InputLabel>Location <b style={{ color: "red" }}> *</b></InputLabel>
            <FormControl size="small" fullWidth >
              <Selects
                onChange={searchLoc}
                placeholder={"Select Location"}
                styles={colourStyles}
                options={location}
              />
            </FormControl>
          </Grid>
          <Grid item lg={3} md={3}></Grid>
        </Grid>
      </Box><br /><br />
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
              {isUserRoleCompare[0].csvlocationwiseexpreport && (
                <>
                  <ExportCSV csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0].excellocationwiseexpreport && (
                <>
                  <ExportXL csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0].printlocationwiseexpreport && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0].pdflocationwiseexpreport && (
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
                  <StyledTableCell onClick={() => handleSorting('productid')}><Box sx={userStyle.tableheadstyle}><Box>Item Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productid')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Item Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('createdAt')}><Box sx={userStyle.tableheadstyle}><Box>Manufacture Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('createdAt')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('location')}><Box sx={userStyle.tableheadstyle}><Box>Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('location')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('quantity')}><Box sx={userStyle.tableheadstyle}><Box>Quantity</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('quantity')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('mrp')}><Box sx={userStyle.tableheadstyle}><Box>MRP</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('mrp')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('expirydate')}><Box sx={userStyle.tableheadstyle}><Box>Expiry Data</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('expirydate')}</Box></Box></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ?
                  (filteredData.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{row.productid}</StyledTableCell>
                      <StyledTableCell>{row.productname}</StyledTableCell>
                      <StyledTableCell>{moment(row.createdAt).format('DD-MM-YYYY')}</StyledTableCell>
                      <StyledTableCell>{row.location}</StyledTableCell>
                      <StyledTableCell>{row.quantity}</StyledTableCell>
                      <StyledTableCell>{row.mrp}</StyledTableCell>
                      <StyledTableCell>{moment(row.expirydate).format('DD-MM-YYYY')}</StyledTableCell>
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
              <Table sx={{ minWidth: 700 }} aria-label="customized table" id="producttable" ref={componentRef}>
                <TableHead>
                  <StyledTableRow >
                    <StyledTableCell>Item Code </StyledTableCell>
                    <StyledTableCell>Item Name</StyledTableCell>
                    <StyledTableCell>Manufacture Date</StyledTableCell>
                    <StyledTableCell>Location</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>MRP</StyledTableCell>
                    <StyledTableCell>Expiry Data</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {products &&
                    products?.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{row.productid}</StyledTableCell>
                        <StyledTableCell>{row.productname}</StyledTableCell>
                        <StyledTableCell>{moment(row.createdAt).format('DD-MM-YYYY')}</StyledTableCell>
                        <StyledTableCell>{row.location}</StyledTableCell>
                        <StyledTableCell>{row.quantity}</StyledTableCell>
                        <StyledTableCell>{row.mrp}</StyledTableCell>
                        <StyledTableCell>{moment(row.expirydate).format('DD-MM-YYYY')}</StyledTableCell>
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
function Locationwiseexpiringreport() {
  return (
    <>
      <Box>
        <Navbar />
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>
          <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
            <Expiringreportall /><br /><br /><br />
            <Footer /><br />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Locationwiseexpiringreport;