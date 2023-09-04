import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Select, MenuItem, OutlinedInput, Table, TableBody, InputLabel, TableFooter, TableContainer, TableHead, FormControl, Paper, Button, Grid, Typography } from '@mui/material';
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
import { ThreeDots } from 'react-loader-spinner';
function SubCategoryProfitWiselist() {

  const [exceldata, setExceldata] = useState([]);
  const { auth, setngs } = useContext(AuthContext);
  const [subcateOptions, setSubcateOptions] = useState([])
  const [posData, setPosData] = useState([])

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  let totalsales = 0
  let totalprofit = 0
  // Acces
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

  // Category
  const fetchSubCategory = async () => {
    try {
      let request = await axios.post(SERVICE.CATEGORY_OPTIONS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
      });

      let sub_data = request.data.result.map((data) => {
        return data.subcategories
      })
      let condata = sub_data.flat()
      setSubcateOptions(condata.map((d) => ({
        ...d,
        label: d.subcategryname,
        value: d.subcategryname,
      })))

    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])




  const fetchSubcateProfit = async (e) => {


    try {
      let req_data = await axios.post(SERVICE.SUBCATE_PROFIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation],
        subcategory: String(e.subcategryname)

      });

      let result = req_data.data.filterpos
      console.log(result);

      const finalprofits = [...result.reduce((r, o) => {
        const key = o.productid;
        const items = r.get(key) || Object.assign({}, o, {
          quantity: 0,
          sellingvalue: 0,
          profit: 0,
          sales: 0,
          allmrp: 0,
          allsellingvalue: 0,
        });
        items.quantity += +o.quantity
        items.sellingvalue += +o.sellingvalue
        items.sales += +o.subtotal
        items.allmrp += +o.quantity * +o.mrp
        items.allsellingvalue += +o.quantity * +o.sellingvalue
        return r.set(key, items);
      }, new Map).values()];


      setPosData(finalprofits);
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










  // Export Excel
  const fileName = 'Category Wise Profit'
  //  get particular columns for export excel
  const getexcelDatas = async () => {
    let data = posData.map(t => ({
      "Productname": t.productname,
      "Date": t.formatedate,
      "Location": t.businesslocation,
      "Mrp rate": t.allmrp.toFixed(2),
      "Sales ": t.subtotal.toFixed(2),
      "Quantity": t.quantity,
      "Profit": (t.subtotal - (t.allmrp)).toFixed(2)
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
    documentTitle: 'ARANYA HERBALS | SUB CATEGORY WISE PROFIT',
    pageStyle: 'print'
  });
  // PDF
  const downloadpdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#postable' })
    doc.save('Sub Category Wise Profit.pdf')
  }

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = posData.sort((a, b) => {
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
      <Headtitle title={'Sub Category Wise Profit Report'} />
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Typography sx={userStyle.HeaderText}>Sub Category Wise Profit Report</Typography>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid><br />
      <Box sx={userStyle.filtercontent} >
        <Grid container spacing={2}>
          <Grid item md={4} lg={4} ></Grid>
          <Grid item md={4} lg={3} >
            <InputLabel htmlFor="component-outlined">Sub Category Name <b style={{ color: "red" }}> *</b></InputLabel>
            <FormControl size="small" fullWidth >
              <Selects
                onChange={(e) => { fetchSubcateProfit(e) }}
                placeholder={"Sub Categories"}
                styles={colourStyles}
                options={subcateOptions}
              />
            </FormControl>
          </Grid>
          <Grid item md={4} lg={4} ></Grid>
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
            {isUserRoleCompare[0].csvsubcategorywiseprofit && (<ExportCSV csvData={exceldata} fileName={fileName} />)}
            {isUserRoleCompare[0].excelsubcategorywiseprofit && (<ExportXL csvData={exceldata} fileName={fileName} />)}
            {isUserRoleCompare[0].printsubcategorywiseprofit && (<Button sx={userStyle.buttongrp} onClick={handleprint}><FaPrint />&ensp;Print&ensp;</Button>)}
            {isUserRoleCompare[0].pdfsubcategorywiseprofit && (<Button sx={userStyle.buttongrp} onClick={() => downloadpdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>)}
          </Grid>
        </Grid><br /><br />
        <Box>
          {isLoader ? (
            <>
              <TableContainer component={Paper} >
                <Table sx={{ minWidth: 700 }}>
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell onClick={() => handleSorting('businesslocation')}><Box sx={userStyle.tableheadstyle}><Box>Location Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('businesslocation')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Product Name </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('mrp')}><Box sx={userStyle.tableheadstyle}><Box>MRP </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('mrp')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('quantity')}><Box sx={userStyle.tableheadstyle}><Box>Quantity </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('quantity')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('subtotal')}><Box sx={userStyle.tableheadstyle}><Box>Sales </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subtotal')}</Box></Box></StyledTableCell>
                      <StyledTableCell onClick={() => handleSorting('profits')}><Box sx={userStyle.tableheadstyle}><Box>Profit </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('profits')}</Box></Box></StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {filteredData.length > 0 ?
                      (filteredData.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell >{row.businesslocation}</StyledTableCell>
                          <StyledTableCell >{row.productname}</StyledTableCell>
                          <StyledTableCell >{row.allmrp}</StyledTableCell>
                          <StyledTableCell >{row.quantity}</StyledTableCell>
                          <StyledTableCell >{row.subtotal.toFixed(2)}</StyledTableCell>
                          <StyledTableCell >{(Number(row.subtotal) - Number(row.allmrp)).toFixed(2)}</StyledTableCell>
                        </StyledTableRow>

                      )))
                      : <StyledTableRow><StyledTableCell colSpan={10} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                    }
                  </TableBody>
                  <TableFooter sx={{ backgroundColor: '#9591914f', height: '50px' }}>
                    <StyledTableRow className="table2_total" >
                      {posData && (
                        posData.forEach(
                          (item => {
                            totalsales += +item.subtotal;
                            totalprofit += Number(item.subtotal) - Number(item.allmrp)
                          })
                        ))}

                      <StyledTableCell align="center" colSpan={4} sx={{ color: 'black', fontSize: '20px', justifyContent: 'center', border: '1px solid white !important' }}>Total:</StyledTableCell>
                      <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹{totalsales.toFixed(2)} </StyledTableCell>
                      <StyledTableCell align="left" sx={{ color: 'black', fontSize: '16px', border: '1px solid white !important' }}>₹ {totalprofit.toFixed(2)}</StyledTableCell>
                    </StyledTableRow>
                  </TableFooter>
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
      <TableContainer component={Paper} sx={userStyle.printcls}  >
        <Table id="postable" ref={componentRef} >
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Location Name</StyledTableCell>
              <StyledTableCell >Product Name </StyledTableCell>
              <StyledTableCell >Mrp</StyledTableCell>
              <StyledTableCell >Quantity</StyledTableCell>
              <StyledTableCell >Sales</StyledTableCell>
              <StyledTableCell >Profits</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {posData.length > 0 ?
              (posData.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">{moment(row.date).utc().format('DD-MM-YYYY')}</StyledTableCell>
                  <StyledTableCell >{row.location}</StyledTableCell>
                  <StyledTableCell >{row.productname}</StyledTableCell>
                  <StyledTableCell >{row.allmrp}</StyledTableCell>
                  <StyledTableCell >{row.quantity}</StyledTableCell>
                  <StyledTableCell >{row.subtotal.toFixed(2)}</StyledTableCell>
                  <StyledTableCell >{(Number(row.subtotal) - Number(row.allmrp)).toFixed(2)}</StyledTableCell>
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
                    totalsales += +item.subtotal;
                    totalprofit += Number(item.subtotal) - Number(item.allmrp)
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

function SubCategoryProfitWise() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <SubCategoryProfitWiselist /><br /><br /><br /><br ></br>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

export default SubCategoryProfitWise;