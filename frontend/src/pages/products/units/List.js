import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput, Table, TableBody, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useReactToPrint } from 'react-to-print';
import { ExportXL, ExportCSV } from '../../Export';
import { toast } from 'react-toastify';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Unitslisttable() {

  const { auth, setngs } = useContext(AuthContext);
  const [units, setUnits] = useState([]);
  const [exceldata, setExceldata] = useState([]);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // Access
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [unitdld, setUnitld] = useState({});
  // Modal open
  const handleClickOpen = () => {  setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // Units
  const fetchUnit = async () => {
    try {
      let response = await axios.get(SERVICE.UNIT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      let result = response.data.units.filter((data, index) => {
        return data.assignbusinessid == setngs.businessid
      })
      setUnits(result);
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  };

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let response = await axios.get(`${SERVICE.UNIT_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      })
      setUnitld(response.data.sunit);
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  }

  //alert delete popup
  let uid = unitdld._id;
  const deleteUnits = async (uid) => {
    try {
      let response = await axios.delete(`${SERVICE.UNIT_SINGLE}/${uid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      await fetchUnit();
      handleClose();
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  };

  useEffect(
    () => {
      fetchUnit();
    }, []
  );

  // Export Excel
  const fileName = 'Units'
  const getexcelDatas = async () => {
    var data = units.map(t => ({ 'Unit Name': t.unit, 'Short Name': t.shortname,}));
    setExceldata(data);
  }

  useEffect(
    () => {
      getexcelDatas();
    }, [units]
  );

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'ARANYA HERBALS | UNITS',
    pageStyle: 'print'
  });

  // PDF
  const downloadPdf = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: '#unittablepdf' });
    doc.save('Units.pdf')
  }

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = units.sort((a, b) => {
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
  const filteredDatas = units.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(units.length / pageSize);

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
      <Headtitle title={'Units'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Units<Typography component="span" sx={userStyle.SubHeaderText}>Manage your units</Typography></Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>All your units</Typography>
          </Grid>
          <Grid item xs={4}>
            {isUserRoleCompare[0].aunit && (
              <>
                <Link to="/product/unit/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
              <MenuItem value={(units.length)}>All</MenuItem>
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
          {isUserRoleCompare[0].excelunit && (
            <>
              <ExportCSV csvData={exceldata} fileName={fileName} />
            </>
          )}
          {isUserRoleCompare[0].csvunit && (
            <>
              <ExportXL csvData={exceldata} fileName={fileName} />
            </>
          )}
          {isUserRoleCompare[0].printunit && (
            <>
              <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
            </>
          )}
          {isUserRoleCompare[0].pdfunit && (
            <>
              <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
            </>
          )}
          <Grid>
          </Grid>
        </Grid><br /><br />
        <Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Action</StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('unit')}><Box sx={userStyle.tableheadstyle}><Box>Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('unit')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('shortname')}><Box sx={userStyle.tableheadstyle}><Box>Short name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('shortname')}</Box></Box></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody align="left">
                {filteredData.length > 0 ?
                  (filteredData.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>
                        <Grid sx={{ display: 'flex' }}>
                          {isUserRoleCompare[0].eunit && (
                            <>
                              <Link to={`/product/unit/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>
                            </>
                          )}
                          {isUserRoleCompare[0].dunit && (
                            <>
                              <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                            </>
                          )}
                        </Grid>
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">{row.unit}</StyledTableCell>
                      <StyledTableCell>{row.shortname}</StyledTableCell>
                    </StyledTableRow>
                  )))
                  : <StyledTableRow><StyledTableCell colSpan={3} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                }
              </TableBody>
            </Table>
          </TableContainer><br /><br />
          <Box style={userStyle.dataTablestyle}>
            <Box>
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, units.length)} of {units.length} entries
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
      {/* Print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="unittablepdf" ref={componentRef}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Short name</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {units &&
              (units.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">{row.unit}</StyledTableCell>
                  <StyledTableCell>{row.shortname}</StyledTableCell>
                </StyledTableRow>
              ))
              )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* printlayout ends */}
      {/* ALERT DIALOG */}
      <Dialog
        open={isDeleteOpen}
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
          <Button onClick={(e) => deleteUnits(uid)} autoFocus variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function Unitslist() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <Unitslisttable /><br /><br /><br /><br />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
export default Unitslist;
