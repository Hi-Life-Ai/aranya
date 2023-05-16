import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import { Box, Table, TableBody, Select, MenuItem, FormControl, OutlinedInput, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { useReactToPrint } from "react-to-print";
import { userStyle } from '../../PageStyle';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { ExportXL, ExportCSV } from '../../Export';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Userslisttable() {

  const [users, setUsers] = useState([]);
  const [deltUser, setDeltUser] = useState({});
  const [exceldata, setExceldata] = useState([]);
  const { auth, setngs } = useContext(AuthContext);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // Access
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // User
  const fetchHandler = async () => {
    try {
      let res = await axios.get(`${SERVICE.USER_TERMSFALSE}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      let result = res.data.usersterms.filter((data, index) => {
        return data.assignbusinessid == setngs.businessid
      })
      setUsers(result);
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  }

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setDeltUser(res.data.suser);
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  }

  //alert delete popup
  let userid = deltUser._id;

  const deleteUser = async (userid) => {

    try {
      let res = await axios.delete(`${SERVICE.USER_SINGLE}/${userid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      await fetchHandler();
      handleClose();
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  };

  // Export Excel
  const fileName = 'User'
  // get perticular columns for export excel
  const getexcelDatas = async () => {
    var data = users.map(t => ({ "Entry No": t.entrynumber, "Staff Name": t.staffname, "User Id": t.userid, "Father Name": t.fathername, "Date": t.date, "Business Location": t.businesslocation, "Role": t.role, "Counter": t.counter, "Date of Join": t.dateofjoin, "Gender": t.gender, "Blood Group": t.bloodgroup, "Date of Birth": t.dateofbirth, "Nationality": t.nationality, "Address": t.address, "Area/City": t.areacity, "Pincode": t.pincode, "Mobhile No": t.phonenum, "Other No": t.otherphonenum, "Active User": t.useractive, "Email": t.email, "Marital Status": t.maritalstatus, "Family details": t.familydetails, "Education details": t.educationydetails, "Job details": t.jobdetails, "Experience details": t.experiencedetails, "Aadhar No": t.aadharnumber, "Acc No": t.accnumber, "Nationality": t.country, "Remarks": t.remarks }));
    setExceldata(data);
  }

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'HIPOS | USERS',
    pageStyle: 'print'
  });

  const ref = createRef();
  const options = {
    orientation: 'portrait',
    unit: 'in'
  };

  //  PDF
  const downloadPdf = () => {
    const doc = new jsPDF()
    autoTable(doc, { html: '#usertablePDF' })
    doc.save('User.pdf')
  }

  useEffect(() => {
    fetchHandler();
  }, []);

  useEffect(() => {
    getexcelDatas();
  }, [users]);

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = users.sort((a, b) => {
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
  const filteredDatas = users?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(users.length / pageSize);

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
      <Headtitle title={'Users'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Users <Typography component="span" sx={userStyle.SubHeaderText}>Manage Users</Typography></Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>All your users</Typography>
          </Grid>
          <Grid item xs={4}>
            {isUserRoleCompare[0].auser && (
              <>
                <Link to="/user/user/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
              <MenuItem value={(users.length)}>All</MenuItem>
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
          <Grid >
            {isUserRoleCompare[0].csvuser && (
              <>
                <ExportCSV csvData={exceldata} fileName={fileName} />
              </>
            )}
            {isUserRoleCompare[0].exceluser && (
              <>
                <ExportXL csvData={exceldata} fileName={fileName} />
              </>
            )}
            {isUserRoleCompare[0].printuser && (
              <>
                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
              </>
            )}
            {isUserRoleCompare[0].pdfuser && (
              <>
                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>

              </>
            )}
          </Grid>
        </Grid><br />
        <Box>
          <TableContainer component={Paper} >
            <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Actions</StyledTableCell>
                  <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('userid')}><Box sx={userStyle.tableheadstyle}><Box>User ID</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('userid')}</Box></Box></StyledTableCell>
                  <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('staffname')}><Box sx={userStyle.tableheadstyle}><Box>Staff Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('staffname')}</Box></Box></StyledTableCell>
                  <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('role')}><Box sx={userStyle.tableheadstyle}><Box>Role</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('role')}</Box></Box></StyledTableCell>
                  <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('email')}><Box sx={userStyle.tableheadstyle}><Box>Email</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('email')}</Box></Box></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody align="left">
                {filteredData.length > 0 ?
                  (filteredData.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell >
                        <Grid sx={{ display: 'flex' }}>
                          {isUserRoleCompare[0].euser && <Link to={`/user/user/edit/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>}
                          {isUserRoleCompare[0].vuser && <Link to={`/user/user/view/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonview}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>}
                          {isUserRoleCompare[0].duser && (<Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>)}
                        </Grid>
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">{row.userid}</StyledTableCell>
                      <StyledTableCell >{row.staffname}</StyledTableCell>
                      <StyledTableCell >{row.role}</StyledTableCell>
                      <StyledTableCell >{row.email}</StyledTableCell>
                    </StyledTableRow>
                  )))
                  : <StyledTableRow><StyledTableCell colSpan={5} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                }
              </TableBody>
            </Table>
          </TableContainer><br /><br />
          <Box style={userStyle.dataTablestyle}>
            <Box>
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, users.length)} of {users.length} entries
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

      {/* Delete */}
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
          <Button onClick={(e) => deleteUser(userid)} autoFocus variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>

      { /* ****** Print ****** */}
      <Box sx={userStyle.printcls} >
        <Box>
          <Typography variant='h5' >Users</Typography>
        </Box>
        <>
          <Box>
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table aria-label="simple table" id="usertablePDF" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }} >
                  <StyledTableRow >
                    <StyledTableCell ><b>User ID</b></StyledTableCell>
                    <StyledTableCell ><b>Name</b></StyledTableCell>
                    <StyledTableCell ><b>Role</b></StyledTableCell>
                    <StyledTableCell ><b>Email</b></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {users && (
                    users.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">{row.userid}</StyledTableCell>
                        <StyledTableCell >{row.staffname}</StyledTableCell>
                        <StyledTableCell >{row.role}</StyledTableCell>
                        <StyledTableCell >{row.email}</StyledTableCell>
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
  );
}

function Userslist() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <Userslisttable /><br /><br /><br /><br />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
export default Userslist;