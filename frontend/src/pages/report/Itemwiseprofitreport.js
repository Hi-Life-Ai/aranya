import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Select, MenuItem, OutlinedInput, Table, TableBody, InputLabel, TableContainer, TableFooter, TableHead, FormControl, Paper, Button, Grid, Typography } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { userStyle, colourStyles } from '../PageStyle';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { ExportXL, ExportCSV } from '../Export';
import Headtitle from '../../components/header/Headtitle';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { SERVICE } from '../../services/Baseservice';
import moment from "moment";
import { toast } from 'react-toastify';
import { UserRoleAccessContext } from '../../context/Appcontext';
import { AuthContext } from '../../context/Appcontext';
import Selects from 'react-select';
import { useReactToPrint } from "react-to-print";

function ItemWiseProfitList() {

  const [exceldata, setExceldata] = useState([]);
  const [products, setProducts] = useState([])
  const [locationsData, setLocationsData] = useState([]);
  const [posData, setPosData] = useState([])

  const { auth, setngs } = useContext(AuthContext);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  let tableDatas = [];
  let dates = [];
  let locations = [];
  let prodname = [];
  let mrprate = [];
  let sellingrate = [];
  let sales = [];
  let quantity = [];

  let totalsales = 0
  let totalprofit = 0

  // Access
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

  // Locations
  const fetchLocation = async () => {
    try {
      let req = await axios.get(SERVICE.BUSINESS_LOCATION, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      let result = req.data.busilocations.filter((data, index) => {
        if (isUserRoleAccess.role == 'Admin') {
          return data.assignbusinessid == setngs.businessid && data.activate == true
        } else {
          if (isUserRoleAccess.businesslocation.includes(data.name)) {
            return data.assignbusinessid == setngs.businessid && data.activate == true
          }
        }
      })
      setLocationsData(
        result?.map((d) => ({
          ...d,
          label: d.name,
          value: d.name,
        }))
      );

    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
  }

  useEffect(() => {
    fetchLocation();
  }, []);

  // Products
  const fetchProducts = async () => {
    try {
      let request = await axios.get(SERVICE.PRODUCT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      let req_data = request.data.products.filter((data) => {
        if (data.assignbusinessid == setngs.businessid) {
          return data
        }
      })
      setProducts(req_data.map((data) => ({
        ...data,
        label: data.productname,
        value: data.productname
      })))

    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter
  const filterLocation = async (e) => {
    try {
      let res = await axios.get(SERVICE.POS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });

      let expDataLocation = res.data.pos1.filter((data) => {
        return data.location == e.name;
      })

      expDataLocation.filter((data) => {
        data.goods.forEach((value) => {
          dates.push(data.date)
          locations.push(data.location)
          prodname.push(value.productname)
          mrprate.push(value.mrp)
          sellingrate.push(value.sellingvalue == undefined || "" ? 0 : value.sellingvalue)
          sales.push(value.subtotal)
          quantity.push(value.quantity)
        })
      })

      //create new array for table datas and passing to a setstate
      setPosData(tableDatas = prodname.map(function (data, i) {
        return { productnames: data, locations: locations[i], dates: dates[i], mrprate: mrprate[i], sellingrate: sellingrate[i], sales: sales[i], quantity: quantity[i] }
      }))
    }
    catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
    }
  };

  // Pos
  const fetchProfit = async (e) => {
    try {
      let req_data = await axios.get(SERVICE.POS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });

      req_data.data.pos1.filter((data) => {
        data.goods.forEach((value) => {
          if (value.productname == e.productname) {
            dates.push(data.date)
            locations.push(data.location)
            prodname.push(value.productname)
            mrprate.push(value.mrp * value.quantity)
            sellingrate.push(value.sellingvalue == undefined || "" ? 0 : value.sellingvalue)
            sales.push(value.subtotal)
            quantity.push(value.quantity)
          }
        })
      })

      //create new array for table datas and passing to a setstate
      setPosData(tableDatas = prodname.map(function (data, i) {
        return { productnames: data, locations: locations[i], dates: dates[i], mrprate: mrprate[i], sellingrate:sellingrate[i], sales: sales[i], quantity: quantity[i] }
      }))

    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
    }
  }

  // Export Excel
  const fileName = 'Item Wise Profit Report'
  //  get particular columns for export excel
  const getexcelDatas = async () => {
    let data = posData.map(t => ({
      "Productname": t.productnames,
      "Date": t.dates,
      "Location": t.locations,
      "Mrp rate": t.mrprate.toFixed(2),
      "Sales ": t.sales.toFixed(2),
      "Quantity": t.quantity,
      "Profit": (t.sales - (t.mrprate)).toFixed(2)
    }));
    setExceldata(data);
  }

  useEffect(() => {
    getexcelDatas();
  }, [posData])

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'ARANYA HERBALS | ITEM WISE PROFIT',
    pageStyle: 'print'
  });

  // PDF
  const downloadpdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#postable' })
    doc.save('Item Wise Profit.pdf')
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
  const filteredDatas = posData?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(posData.length / pageSize);

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
      <Headtitle title={'Item Wise Profit Report'} />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography sx={userStyle.HeaderText}>Item Wise Profit Report</Typography>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid><br />
      <Box sx={userStyle.filtercontent} >
        <Grid container spacing={2}>
          <Grid item md={3} lg={3} ></Grid>
          <Grid item md={3} lg={3} >
            <InputLabel>Location <b style={{ color: "red" }}> *</b></InputLabel>
            <FormControl size="small" fullWidth >
              <Selects
                onChange={filterLocation}
                placeholder={"Select Location"}
                styles={colourStyles}
                options={locationsData}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} lg={3} >
            <InputLabel>Product Name <b style={{ color: "red" }}> *</b></InputLabel>
            <FormControl size="small" fullWidth >
              <Selects
                onChange={(e) => { fetchProfit(e) }}
                placeholder={"Select Product"}
                styles={colourStyles}
                options={products}
              />
            </FormControl>
          </Grid>
          <Grid item md={3} lg={3} ></Grid>
        </Grid>
      </Box><br />
      {/* header text */}
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid></Grid>
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
              <MenuItem value={(posData.length)}>All</MenuItem>
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
            {isUserRoleCompare[0].csvitemwisereport && (<ExportCSV csvData={exceldata} fileName={fileName} />)}
            {isUserRoleCompare[0].excelitemwisereport && (<ExportXL csvData={exceldata} fileName={fileName} />)}
            {isUserRoleCompare[0].printitemwisereport && (<Button sx={userStyle.buttongrp} onClick={handleprint}><FaPrint />&ensp;Print&ensp;</Button>)}
            {isUserRoleCompare[0].pdfitemwisereport && (<Button sx={userStyle.buttongrp} onClick={() => downloadpdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>)}
          </Grid>
        </Grid><br /><br />
        <Box>
          <TableContainer component={Paper} >
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell onClick={() => handleSorting('dates')}><Box sx={userStyle.tableheadstyle}><Box>Date </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('dates')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('locations')}><Box sx={userStyle.tableheadstyle}><Box>Location Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('locations')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('prodname')}><Box sx={userStyle.tableheadstyle}><Box>Product Name </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('prodname')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('mrprate')}><Box sx={userStyle.tableheadstyle}><Box>MRP </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('mrprate')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('quantity')}><Box sx={userStyle.tableheadstyle}><Box>Quantity </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('quantity')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('sales')}><Box sx={userStyle.tableheadstyle}><Box>Sales </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sales')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('profits')}><Box sx={userStyle.tableheadstyle}><Box>Profit </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('profits')}</Box></Box></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody align="left">
                {filteredData.length > 0 ?
                  (filteredData.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">{moment(row.dates).utc().format('DD-MM-YYYY')}</StyledTableCell>
                      <StyledTableCell >{row.locations}</StyledTableCell>
                      <StyledTableCell >{row.productnames}</StyledTableCell>
                      <StyledTableCell >{row.mrprate.toFixed(2)}</StyledTableCell>
                      <StyledTableCell >{row.quantity}</StyledTableCell>
                      <StyledTableCell >{row.sales.toFixed(2)}</StyledTableCell>
                      <StyledTableCell >{(Number(row.sales) - Number(row.mrprate)).toFixed(2)}</StyledTableCell>
                    </StyledTableRow>
                  )))
                  : <StyledTableRow><StyledTableCell colSpan={13} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                }
              </TableBody>
              <TableFooter sx={{ backgroundColor: '#9591914f', height: '50px' }}>
                <StyledTableRow className="table2_total" >
                  {posData && (
                    posData.forEach(
                      (item => {
                        totalsales += +item.sales;
                        totalprofit += +item.sales - (+item.mrprate);
                      })
                    ))}
                  <StyledTableCell align="center" colSpan={5} sx={{ color: 'black', fontSize: '20px', justifyContent: 'center', border: '1px solid white !important' }}>Total:</StyledTableCell>
                  <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹{totalsales.toFixed(2)} </StyledTableCell>
                  <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹ {totalprofit.toFixed(2)}</StyledTableCell>
                </StyledTableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <br /><br />
          <Box style={userStyle.dataTablestyle}>
            <Box>
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, posData.length)} of {posData.length} entries
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
      {/* content end */}
      {/* print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls} ref={componentRef} >
        <Table id="postable" >
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Date Code</StyledTableCell>
              <StyledTableCell>Location Name</StyledTableCell>
              <StyledTableCell >Product Name </StyledTableCell>
              <StyledTableCell >Mrp</StyledTableCell>
              <StyledTableCell >Sales</StyledTableCell>
              <StyledTableCell >Profits</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {posData &&
              (posData.map((row, index) =>
              (
                <StyledTableRow key={index}>
                  <StyledTableCell >{row.dates}</StyledTableCell>
                  <StyledTableCell >{row.locations}</StyledTableCell>
                  <StyledTableCell >{row.productnames}</StyledTableCell>
                  <StyledTableCell >{row.mrprate.toFixed(2)}</StyledTableCell>
                  <StyledTableCell >{row.sales.toFixed(2)}</StyledTableCell>
                  <StyledTableCell >{(Number(row.sales) - Number(row.mrprate)).toFixed(2)}</StyledTableCell>
                </StyledTableRow>
              )
              ))}
          </TableBody>
          <TableFooter sx={{ backgroundColor: '#9591914f', height: '50px' }}>
                <StyledTableRow className="table2_total" >
                  {posData && (
                    posData.forEach(
                      (item => {
                        totalsales += +item.sales;
                        totalprofit += +item.sales - (+item.mrprate);
                      })
                    ))}
                  <StyledTableCell align="center" colSpan={5} sx={{ color: 'black', fontSize: '20px', justifyContent: 'center', border: '1px solid white !important' }}>Total:</StyledTableCell>
                  <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹{totalsales.toFixed(2)} </StyledTableCell>
                  <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹ {totalprofit.toFixed(2)}</StyledTableCell>
                </StyledTableRow>
              </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}

function ItemWiseProfitReport() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <ItemWiseProfitList /><br /><br /><br /><br ></br>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

export default ItemWiseProfitReport;