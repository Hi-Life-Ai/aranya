import React, { useState, useEffect, useContext, useRef, createRef } from 'react';
import { Button, Grid, Select, MenuItem, FormControl, OutlinedInput, Typography, Box, Table, TableBody, TableContainer, TableHead, Paper, Dialog, DialogContent, DialogActions } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import { FaPrint, FaFilePdf } from "react-icons/fa";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { ExportXL, ExportCSV } from '../../Export';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { userStyle } from '../../PageStyle';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import { useReactToPrint } from "react-to-print";
import { AuthContext } from '../../../context/Appcontext';

function Roleslisttable() {

  const { auth, setngs } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [deltRole, setDeltRole] = useState({})
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
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // Roles
  const fetchHandler = async () => {
    try {
      let role = await axios.get(`${SERVICE.ROLE}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      let result = role.data.roles.filter((data, index) => {
        return data.rolename != 'Admin' && data.assignbusinessid == setngs.businessid
      })
      setRoles(result)
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  }

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.ROLE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setDeltRole(res.data.srole);
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  }

  //alert delete popup
  let roleid = deltRole._id;

  const deleteRole = async (roleid) => {

    try {
      let res = await axios.delete(`${SERVICE.ROLE_SINGLE}/${roleid}`, {
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

  useEffect(() => {
    fetchHandler();
  }, []);

  // Export Excel
  const fileName = 'Role'
  // get perticular columns for export excel
  const getexcelDatas = async () => {
    var data = roles.map((data) => {
      return data
    })
    setExceldata(data);
  }

  useEffect(() => {
    getexcelDatas();
  }, [roles]);

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'ARANYA HERBALS | ROLES',
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
    autoTable(doc, { html: '#roletablePDF' })
    doc.save('Role.pdf')
  }

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = roles.sort((a, b) => {
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
  const filteredDatas = roles.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(roles.length / pageSize);

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
      <Headtitle title={'Roles'} />
      <Typography sx={userStyle.HeaderText}>Roles <Typography component="span" sx={userStyle.SubHeaderText}>Manage Roles</Typography></Typography>
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography sx={userStyle.importheadtext}>All Roles</Typography>
          </Grid>
          <Grid item xs={4}>
            {isUserRoleCompare[0].arole && (
              <>
                <Link to="/user/role/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
              <MenuItem value={(roles.length)}>All</MenuItem>
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
            {isUserRoleCompare[0].csvrole && (
              <>
                <ExportCSV csvData={exceldata} fileName={fileName} />
              </>
            )}
            {isUserRoleCompare[0].excelrole && (
              <>
                <ExportXL csvData={exceldata} fileName={fileName} />
              </>
            )}
            {isUserRoleCompare[0].printrole && (
              <>
                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
              </>
            )}
            {isUserRoleCompare[0].pdfrole && (
              <>
                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>

              </>
            )}
          </Grid>
        </Grid><br />
        <Box>
          <TableContainer component={Paper} sx={userStyle.tablecontainer}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table" id="roletable">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell sx={{ width: '600px !important' }} onClick={() => handleSorting('rolename')}><Box sx={userStyle.tableheadstyle}><Box>Roles</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('rolename')}</Box></Box></StyledTableCell>
                  <StyledTableCell>Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody align="left">
                {filteredData.length > 0 ?
                  (filteredData.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell component="th" scope="row">{row.rolename}</StyledTableCell>
                      <StyledTableCell>
                        <Grid sx={{ display: 'flex' }}>
                          {isUserRoleCompare[0].erole && <Link to={`/user/role/edit/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>}
                          {isUserRoleCompare[0].drole && (<Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>)}
                        </Grid>
                      </StyledTableCell>
                    </StyledTableRow>
                  )))
                  : <StyledTableRow><StyledTableCell colSpan={2} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                }
              </TableBody>
            </Table>
          </TableContainer><br /><br />
          <Box style={userStyle.dataTablestyle}>
            <Box>
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, roles.length)} of {roles.length} entries
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
          <Button onClick={(e) => deleteRole(roleid)} autoFocus variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>


      { /* ****** Print ****** */}
      <Box sx={userStyle.printcls} >
        <Box>
          <Typography variant='h5' >Roles</Typography>
        </Box>
        <>
          <Box>
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table aria-label="simple table" id="roletablePDF" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }} >
                  <StyledTableRow >
                    <StyledTableCell sx={{ width: '600px !important' }}><b>Roles</b></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {roles && (
                    roles.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">{row.rolename}</StyledTableCell>
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

function Roleslist() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <Roleslisttable /><br /><br /><br /><br />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

export default Roleslist;