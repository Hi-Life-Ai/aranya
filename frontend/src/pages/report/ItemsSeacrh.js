import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Select, MenuItem, OutlinedInput, Table, TableBody, Tooltip, IconButton, InputLabel, TableContainer, TableHead, FormControl, Paper, Button, Grid, Typography } from '@mui/material';
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
import { UserRoleAccessContext } from '../../context/Appcontext';
import { AuthContext } from '../../context/Appcontext';
import Selects from 'react-select';
import { useReactToPrint } from "react-to-print";
import { FcInfo } from "react-icons/fc";
import { toast } from 'react-toastify';
import { Login } from '@mui/icons-material';
import { ThreeDots } from 'react-loader-spinner';

function Items() {

  const [exceldata, setExceldata] = useState([]);
  const { auth, setngs } = useContext(AuthContext);
  const [products, setProducts] = useState([])
  const [isLoader, setIsLoader] = useState(false);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [salesData, setSalesData] = useState([])
  const currentDate = new Date();
  let startdate = moment(currentDate).utc().format('DD-MM-YYYY')

  let tableDatas = [];
  let locations = [];
  let prodname = [];
  let mrprate = [];
  let profit = [];
  let quantity = [];
  let todaysales = [];
  let weeksal = []
  let monthlysale = [];
  let yearlysale = [];


  const previousWeekDates = [];

  for (let i = 1; i <= 7; i++) {
    const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7 + i);
    previousWeekDates.push(moment(previousDate).utc().format('DD-MM-YYYY'));
  }

  // Acces
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

  // Products
  const fetchProducts = async () => {
    try {
      let request = await axios.post(SERVICE.PRODUCTS_ALL, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation]
      });
      let req_data = request.data.products
      setProducts(req_data.map((data) => ({
        ...data,
        label: data.productname,
        value: data.productname
      })))
      setIsLoader(true)
    } catch (err) {
      setIsLoader(true)
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])








  const fetchDatalocation = async (e) => {


    try {
      let req = await axios.post(SERVICE.ITEM_SEARCH, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation],
        product: String(e.productname)
      });
      let result = req.data.filterpos.filter((data) => {
        let dateTrim = moment(data.formatedate).format('DD-MM-YYYY')
        if (dateTrim == startdate) {
          todaysales.push(data.subtotal)
        } else if (dateTrim != startdate) {
          todaysales.push(0)
        }

      })


      let todaysum = todaysales.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });


      let weeklydata = req.data.filterpos.map((data) => {
        let dateTrim = moment(data.formatedate).format('DD-MM-YYYY')
        if (previousWeekDates.includes(dateTrim)) {
          weeksal.push(data.subtotal);
        } else {
          weeksal.push(0)
        }
      })

      let sum = weeksal.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });




      let monthdata = req.data.filterpos.filter((data) => {

        if (new Date().getMonth() == new Date(data.formatedate).getMonth() + 1) {
          monthlysale.push(data.subtotal)
        } else {
          monthlysale.push(0)
        }
      })

      let monthsum = monthlysale.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });






      let yearly = req.data.filterpos.filter((data) => {
        if (new Date(data.formatedate).getFullYear() == new Date().getFullYear()) {
          yearlysale.push(data.subtotal)
        }
      })


      let yearlysum = yearlysale.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });


      req.data.filterpos.filter((value) => {
        locations.push(value.businesslocation)
        prodname.push(value.productname)
        mrprate.push(value.sellingvalue)
        quantity.push(value.quantity)
        profit.push(Number(value.subtotal) - Number(value.netrate))

      })


      tableDatas = prodname.map(function (data, i) {
        return { productnames: data, locations: locations[i], mrprate: mrprate[i], todaysales: todaysum, quantity: quantity[i], weeklysale: sum, monthlysales: monthsum, yearlysales: yearlysum }
      })


      const final = [...tableDatas.reduce((r, o) => {
        const key = o.productnames;
        const items = r.get(key) || Object.assign({}, o, {
        });
        return r.set(key, items);
      }, new Map).values()];


      setSalesData(final);

      setIsLoader(true)
    } catch (err) {
      setIsLoader(true)
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      }
      else {
        toast.error("Something went wrong!")
      }
    }
  }


  // Export Excel
  const fileName = 'Item Search'
  //  get particular columns for export excel
  const getexcelDatas = async () => {
    let data = salesData.map(t => ({
      "Productname": t.productnames,
      "Location": t.locations,
      "Mrp rate": Number(t.mrprate).toFixed(2),
      "Today Sales ": Number(t.sales).toFixed(2),
      "Weekly Sales": Number(t.weeklysale).toFixed(2),
      "Montly Sales": Number(t.monthlysales).toFixed(2),
      "Yearly Sales": Number(t.yearlysales).toFixed(2)

    }));
    setExceldata(data);
  }

  useEffect(() => {
    getexcelDatas();
  }, [salesData])

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'ARANYA HERBALS | ITEM SEARCH',
    pageStyle: 'print'
  });

  // PDF
  const downloadpdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#postable' })
    doc.save(' Item Search.pdf')
  }

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = salesData.sort((a, b) => {
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
  const filteredDatas = salesData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(salesData.length / pageSize);

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
      <Headtitle title={'Item Search'} />
      {/* header text */}
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography sx={userStyle.HeaderText}>Item Search </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid><br />
      <Box sx={userStyle.filtercontent} >
        <Grid container spacing={2}>
          <Grid item md={4} lg={4} ></Grid>
          <Grid item md={4} lg={3} >
            <InputLabel htmlFor="component-outlined" >Product Name <b style={{ color: "red" }}> *</b></InputLabel>
            <FormControl size="small" fullWidth >
              <Selects
                onChange={(e) => { fetchDatalocation(e) }}
                styles={colourStyles}
                options={products}
              />
            </FormControl>
          </Grid>
          <Grid item md={1} lg={1} sx={{ marginTop: "25px" }}>
            <Tooltip arrow sx={{ zIndex: '1' }}
              title=" it will generate single Product's Day, Week, Month and Yearly sales report">
              <IconButton size="small">
                <FcInfo />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item md={3} lg={3} ></Grid>
        </Grid>

      </Box><br />

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
              <MenuItem value={(salesData.length)}>All</MenuItem>
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
            {isUserRoleCompare[0].csvitemsearch && (
              <ExportCSV csvData={exceldata} fileName={fileName} />
            )}
            {isUserRoleCompare[0].excelitemsearch && (
              <ExportXL csvData={exceldata} fileName={fileName} />
            )}
            {isUserRoleCompare[0].printitemsearch && (
              <Button sx={userStyle.buttongrp} onClick={handleprint}><FaPrint />&ensp;Print&ensp;</Button>
            )}
            {isUserRoleCompare[0].pdfitemsearch && (
              <Button sx={userStyle.buttongrp} onClick={() => downloadpdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
            )}
          </Grid>
        </Grid><br /><br />
        <Box>
          {isLoader ? (
            <>
              <TableContainer component={Paper} >
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell onClick={() => handleSorting('productnames')}><Box sx={userStyle.tableheadstyle}><Box>Product  Name </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productnames')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('locations')}><Box sx={userStyle.tableheadstyle}><Box>Locations </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('locations')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('mrprate')}><Box sx={userStyle.tableheadstyle}><Box>MRP rate </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('mrprate')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('sales')}><Box sx={userStyle.tableheadstyle}><Box>Today Sales  </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sales')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('weeklysale')}><Box sx={userStyle.tableheadstyle}><Box>Weekly Sales </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('weeklysale')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('monthlysales')}><Box sx={userStyle.tableheadstyle}><Box>Monthly Report </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('monthlysales')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('yearlysales')}><Box sx={userStyle.tableheadstyle}><Box>Yearly Report </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('yearlysales')}</Box></Box></StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {filteredData.length > 0 ?
                      (filteredData.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell >{row.productnames}</StyledTableCell>
                          <StyledTableCell >{row.locations}</StyledTableCell>
                          <StyledTableCell >{Number(row.mrprate).toFixed(2)}</StyledTableCell>
                          <StyledTableCell >{Number(row.todaysales).toFixed(2)}</StyledTableCell>
                          <StyledTableCell >{Number(row.weeklysale).toFixed(2)}</StyledTableCell>
                          <StyledTableCell >{Number(row.monthlysales).toFixed(2)}</StyledTableCell>
                          <StyledTableCell >{Number(row.yearlysales).toFixed(2)}</StyledTableCell>
                        </StyledTableRow>
                      )))
                      : <StyledTableRow><StyledTableCell colSpan={13} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                    }
                  </TableBody>
                </Table>

              </TableContainer>

            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ThreeDots height="80" width="80" radius="9" color="#1976D2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
              </Box>
            </>
          )}

          <br /><br />
          <Box style={userStyle.dataTablestyle}>
            <Box>
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, salesData.length)} of {salesData.length} entries
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
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Location Name</StyledTableCell>
              <StyledTableCell >Mrp </StyledTableCell>
              <StyledTableCell >Today Sales</StyledTableCell>
              <StyledTableCell > Weekly Sales</StyledTableCell>
              <StyledTableCell > Monthly Sales</StyledTableCell>
              <StyledTableCell > Yearly  Sales</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {salesData &&
              (salesData.map((row, index) =>
              (
                <StyledTableRow key={index}>
                  <StyledTableCell >{row.productnames}</StyledTableCell>
                  <StyledTableCell >{row.locations}</StyledTableCell>
                  <StyledTableCell >{Number(row.mrprate).toFixed(2)}</StyledTableCell>
                  <StyledTableCell >{Number(row.sales).toFixed(2)}</StyledTableCell>
                  <StyledTableCell >{Number(row.weeklysale).toFixed(2)}</StyledTableCell>
                  <StyledTableCell >{Number(row.monthlysales).toFixed(2)}</StyledTableCell>
                  <StyledTableCell >{Number(row.yearlysales).toFixed(2)}</StyledTableCell>

                </StyledTableRow>
              )
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function ItemsListSearch() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <Items /><br /><br /><br /><br ></br>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

export default ItemsListSearch;