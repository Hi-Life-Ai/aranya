import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput, Table, TableBody, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { ExportXL, ExportCSV } from '../../Export';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/header/Headtitle';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { useReactToPrint } from 'react-to-print';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Departmentlisttable() {

  const [department, setdepartments] = useState([]);
  const [isDepartment, setIsDepartments] = useState([]);
  const [exceldata, setExceldata] = useState([]);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  //role access
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const { auth, setngs } = useContext(AuthContext);

  //delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [departmentdel, setDepartmentDel] = useState({});

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleClose = () => {
    setIsDeleteOpen(false);
  };

  //  Fetch department Data
  const fetchDepartments = async () => {
    try {
      let response = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      let result = response.data.departments.filter((data, index)=>{
        return data.assignbusinessid == setngs.businessid
      })
      setdepartments(result);
      setIsDepartments(result);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
  };

  //  get particular columns for export excel
  const getexcelDatas = async () => {
    
    var data = isDepartment.map(t => ({
      id: t.departmentid, name: t.departmentname
    }));
    setExceldata(data);
  }

  //alert delete popup
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.DEPARTMENT_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      })
      setDepartmentDel(res.data.sdepartment);//set function to get particular row
    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
    }
  }

  //alert delete popup
  let deparatmentid = departmentdel._id;
  const deleteDepartment = async (deparatmentid) => {
    try {
      let res = await axios.delete(`${SERVICE.DEPARTMENT_SINGLE}/${deparatmentid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      await fetchDepartments();
      handleClose();
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
      fetchDepartments();
    }, []
  );

  useEffect(
    () => {
      getexcelDatas();
    }, [department]
  )

  // Export Excel
  const fileName = 'Department'

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Department',
    pageStyle: 'print'
  });

  //pdf
  const columns = [{ title: "DEPARTMENT ID", field: "departmentid", }, { title: "DEPARTMENT NAME", field: "departmentname", }]  // PDF

  const downloadPdf = () => {
    const newData = isDepartment.map(row => {
      delete row._id;
      delete row.__v;
      delete row.createdAt;
      delete row.assignbusinessid;
      return row
    })
    const doc = new jsPDF();
    doc.autoTable({ theme: "grid", columns: columns.map(col => ({ ...col, dataKey: col.field })), body: isDepartment })
    doc.save('departments.pdf')
  }

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = department.sort((a, b) => {
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
  const filteredDatas = department?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(department.length / pageSize);

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
      <Headtitle title={'Departments'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Departments<Typography component="span" sx={userStyle.SubHeaderText}>Manage your departments</Typography></Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            {isUserRoleCompare[0].adepartment && (
              <>
                <Link to="/user/department/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
              <MenuItem value={(department.length)}>All</MenuItem>
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
            {isUserRoleCompare[0].exceldepartment && (
              <>
                <ExportCSV csvData={exceldata} fileName={fileName} />
              </>
            )}
            {isUserRoleCompare[0].csvdepartment && (
              <>
                <ExportXL csvData={exceldata} fileName={fileName} />
              </>
            )}
            {isUserRoleCompare[0].printdepartment && (
              <>
                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
              </>
            )}
            {isUserRoleCompare[0].pdfdepartment && (
              <>
                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
              </>
            )}
          </Grid>
        </Grid><br />
        <TableContainer component={Paper} sx={userStyle.tablecontainer}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table" id="departmenttable" ref={componentRef}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell >Actions</StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('departmentid')}><Box sx={userStyle.tableheadstyle}><Box>Department ID</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('departmentid')}</Box></Box></StyledTableCell>
                <StyledTableCell onClick={() => handleSorting('departmentname')}><Box sx={userStyle.tableheadstyle}><Box>Department Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('departmentname')}</Box></Box></StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody align="left">
              {filteredData.length > 0 ?
                (filteredData.map((row, index) => (
                  <StyledTableRow >
                    <StyledTableCell component="th" scope="row">
                      <Grid sx={{ display: 'flex' }}>
                        {isUserRoleCompare[0].edepartment && (
                          <>
                            <Link to={`/user/department/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>

                          </>
                        )}
                        {isUserRoleCompare[0].ddepartment && (
                          <>
                            <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                          </>
                        )}
                      </Grid>
                    </StyledTableCell>
                    <StyledTableCell >{row.departmentid}</StyledTableCell>
                    <StyledTableCell>{row.departmentname}</StyledTableCell>
                  </StyledTableRow>
                )))
                : <StyledTableRow><StyledTableCell colSpan={3} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
              }
            </TableBody>
          </Table>
        </TableContainer><br /><br />
        <Box style={userStyle.dataTablestyle}>
          <Box>
            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, department.length)} of {department.length} entries
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
      { /* content end */}
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
          <Button onClick={(e) => deleteDepartment(deparatmentid)} autoFocus variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>

      { /* ****** Print ****** */}
      <Box sx={userStyle.printcls} >
        <Box>
          <Typography variant='h5' >Department</Typography>
        </Box>
        <>
          <Box>
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table aria-label="simple table" id="roletablePDF" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }} >
                  <StyledTableRow >
                    <StyledTableCell sx={{ width: '600px !important' }}><b>Department ID</b></StyledTableCell>
                    <StyledTableCell ><b>Department Name</b></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {isDepartment && (
                    isDepartment.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">{row.departmentid}</StyledTableCell>
                        <StyledTableCell >{row.departmentname}</StyledTableCell>
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

function Departmentlist() {
  return (
    <Box  >
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <Departmentlisttable /><br /><br /><br />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
export default Departmentlist;