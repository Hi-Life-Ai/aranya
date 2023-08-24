import React, { useState, useEffect, useContext, useRef } from 'react';
import { Button, Grid, Box, Select, MenuItem, FormControl, OutlinedInput, Dialog, DialogContent, DialogActions, Typography, Table, TableHead, TableContainer, TableBody, Paper } from '@mui/material';
import { FaFilePdf, FaPrint } from 'react-icons/fa';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import axios from 'axios';
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';
import jsPDF from "jspdf";
import Headtitle from '../../../components/header/Headtitle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ExportXL, ExportCSV } from '../../Export';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import { useReactToPrint } from "react-to-print";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

const Taxratelisttable = () => {

  const [taxRate, setTaxRate] = useState([]);
  const [hsnGrp, sethsnGrp] = useState([]);
  const [exceldata, setExceldata] = useState([]);
  const [tax, setTax] = useState({});
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const { auth, setngs } = useContext(AuthContext);

  // Datatable Taxrate
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryHsn, setSearchQueryHsn] = useState("");

  //delete model
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };

  // Get Datas
  const fetchTaxrate = async () => {
    try {
      let res = await axios.get(SERVICE.TAXRATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      })
      let taxresult = res.data.taxrates.filter((data, index) => {
        return data.assignbusinessid == setngs.businessid 
      })
      setTaxRate(taxresult)
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
    fetchTaxrate();
  }, []);

  const rowData = async (id) => {
    try {
      let response = await axios.get(`${SERVICE.TAXRATE_SINGLE}/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        });
      setTax(response.data.staxrate);
    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
    }
  }
  let taxid = tax._id;

  // Delete 
  const deleteTaxRate = async (taxid) => {
    try {
      let response = await axios.delete(`${SERVICE.TAXRATE_SINGLE}/${taxid}`,
        {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        });
      handleClose();
      await fetchTaxrate();
    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
    }
  };

  // Excel
  const fileName = 'Tax Rate'
  // get particular columns for export excel
  const getexcelDatas = async () => {

    var data = taxRate.map((t, i) => ({
      'Tax Name': t.taxname, 'Total Tax': t.taxtotal, GST: t.taxrategst, CGST: t.taxratecgst, IGST: t.taxrateigst
    }));

    setExceldata(data);
  }

  useEffect(() => {
    getexcelDatas();
  }, [taxRate]);

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'ARANYA HERBALS | TAX RATE',
    pageStyle: 'print'
  });


  //  PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#alltaxratepdf' })
    doc.save('All Taxrate.pdf')
  }

  // datatable
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = taxRate.sort((a, b) => {
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
  const filteredDatas = taxRate?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(taxRate.length / pageSize);

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
    <>
      <Headtitle title={'Tax Rates'} />
      <Typography sx={userStyle.HeaderText}>Tax Rates </Typography>
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>All your tax rates</Typography>
          </Grid>
          <Grid item xs={4}>
            <Link to="/settings/taxrate/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
          </Grid>
        </Grid><br></br><br />
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
              <MenuItem value={(taxRate.length)}>All</MenuItem>
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

        {/* EXPORT BUTTONS START */}
        <Grid container sx={userStyle.gridcontainer}>
          <Grid container sx={{ justifyContent: "center" }} >
            <Grid >
              {isUserRoleCompare[0].csvtaxrate && (
                <>
                  <ExportCSV csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0].exceltaxrate && (
                <>
                  <ExportXL csvData={exceldata} fileName={fileName} />
                </>
              )}
              {isUserRoleCompare[0].printtaxrate && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                </>
              )}
              {isUserRoleCompare[0].pdftaxrate && (
                <>
                  <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                </>
              )}
            </Grid>
          </Grid>
        </Grid><br></br>

        {/* EXPORT BUTTONS END */}

        {/* TAX RATE TABLE START */}
        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ margin: '20px' }} aria-label="customized table" id="alltaxrate">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell sx={{ border: '1px solid #dddddd7d !important' }}>Action</StyledTableCell>
                  <StyledTableCell sx={{ border: '1px solid #dddddd7d !important' }} onClick={() => handleSorting('taxname')}><Box sx={userStyle.tableheadstyle}><Box>Name </Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('taxname')}</Box></Box></StyledTableCell>
                  <StyledTableCell sx={{ border: '1px solid #dddddd7d !important' }} onClick={() => handleSorting('taxtotal')}><Box sx={userStyle.tableheadstyle}><Box>Tax %</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('taxtotal')}</Box></Box></StyledTableCell>
                  <StyledTableCell sx={{ border: '1px solid #dddddd7d !important' }} onClick={() => handleSorting('taxrategst')}><Box sx={userStyle.tableheadstyle}><Box>GST %</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('taxrategst')}</Box></Box></StyledTableCell>
                  <StyledTableCell sx={{ border: '1px solid #dddddd7d !important' }} onClick={() => handleSorting('taxratecgst')}><Box sx={userStyle.tableheadstyle}><Box>CGST %</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('taxratecgst')}</Box></Box></StyledTableCell>
                  <StyledTableCell sx={{ border: '1px solid #dddddd7d !important' }} onClick={() => handleSorting('taxrateigst')}><Box sx={userStyle.tableheadstyle}><Box>IGST %</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('taxrateigst')}</Box></Box></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ?
                  (filteredData.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">
                        <Grid sx={{ display: 'flex' }}>
                          {isUserRoleCompare[0].etaxrate && (<Link to={`/settings/taxrate/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>)}
                          {isUserRoleCompare[0].dtaxrate && (<Button onClick={(e) => { handleClickOpen(); rowData(row._id) }} sx={userStyle.buttondelete}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></Button>)}
                        </Grid>
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">{row.taxname}</StyledTableCell>
                      <StyledTableCell component="th" scope="row">{row.taxtotal}</StyledTableCell>
                      <StyledTableCell align="left">{row.taxrategst}</StyledTableCell>
                      <StyledTableCell align="left">{row.taxratecgst}</StyledTableCell>
                      <StyledTableCell align="left">{row.taxrateigst}</StyledTableCell>
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
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, taxRate.length)} of {taxRate.length} entries
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
      {/* ******* TAX RATE TABLE END ******* */}

      { /* ****** Print ****** */}
      <Box sx={userStyle.printcls}>
        <Box>
          <Typography variant='h5' >Tax Rate Print</Typography>
        </Box>
        <>
          <Box  >
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table sx={{ margin: '20px' }} aria-label="customized table" id="alltaxratepdf" ref={componentRef}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell sx={{ border: '1px solid #dddddd7d !important' }}>Name </StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: '1px solid #dddddd7d !important' }}>Tax %</StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: '1px solid #dddddd7d !important' }}>GST %</StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: '1px solid #dddddd7d !important' }}>CGST %</StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: '1px solid #dddddd7d !important' }}>IGST %</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {taxRate.length > 0 && (
                    taxRate.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">{item.taxname}</StyledTableCell>
                        <StyledTableCell component="th" scope="row">{item.taxtotal}</StyledTableCell>
                        <StyledTableCell align="left">{item.taxratecgst}</StyledTableCell>
                        <StyledTableCell align="left">{item.taxrateigst}</StyledTableCell>
                        <StyledTableCell align="left">{item.taxrategst}</StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      </Box>
      <br />
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
          <Button onClick={(e) => deleteTaxRate(taxid)} autoFocus variant="contained" color='error'> OK  </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

function Taxratelist() {
  return (
    <Box  >
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <Taxratelisttable /><br /><br /><br />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
export default Taxratelist;