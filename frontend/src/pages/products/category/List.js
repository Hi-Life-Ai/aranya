import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Select, MenuItem, FormControl, OutlinedInput, Table, TableBody, TableContainer, TableHead, Paper, Button, Grid, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FaPrint, FaFilePdf, } from 'react-icons/fa';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from "jspdf";
import { useReactToPrint } from 'react-to-print';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import Headtitle from '../../../components/header/Headtitle';

function Categorieslisttable() {

  const { auth, setngs } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [cats, setCats] = useState({});
  const [exceldata, setExceldata] = useState([]);

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");

  // Access
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  // Delete modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  //  Fetch Category Data
  const fetchCategory = async () => {
    try {
      let res = await axios.get(SERVICE.CATEGORIES, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      let result = res.data.categories.filter((data, index) => {
        return data.assignbusinessid == setngs.businessid
      })
      setCategories(result);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
  };

  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.CATEGORIES_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      })
      setCats(res.data.scategory);
      //set function to get particular row
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
  let catid = cats._id;
  const deleteCats = async (catid) => {
    try {
      let res = await axios.delete(`${SERVICE.CATEGORIES_SINGLE}/${catid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      await fetchCategory();
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
      fetchCategory();
    }, []
  );

  // Export Excel
  const fileName = 'Category'

  //  get particular columns for export excel
  const getexcelDatas = async () => {
    var data = categories.map(t => ({
      categoryname: t.categoryname, categorycode: t.categorycode, categorydescription: t.categorydescription,
      subcategories: t.subcategories, brands: t.brands
    }));
    setExceldata(data);
  }

  useEffect(
    () => {
      getexcelDatas()
    }, [categories]
  );

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'ARANYA HERBALS | CATEGORY',
    pageStyle: 'print'
  });

  // PDF
  const downloadPdf = () => {
    const newData = categories.map(row => {
      delete row._id
      return row
    })
    const doc = new jsPDF();
    autoTable(doc, { html: '#categorytablepdf' });
    doc.save('Categories.pdf')
  }

  // Sorting
  const handleSorting = (column) => {
    const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
    setSorting({ column, direction });
  };

  const sortedData = categories.sort((a, b) => {
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
  const filteredDatas = categories.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(categories.length / pageSize);

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
      <Headtitle title={'Categorys'} />
      {/* header text */}
      <Typography sx={userStyle.HeaderText}>Categories<Typography component="span" sx={userStyle.SubHeaderText}>Manage your categories</Typography></Typography>
      {/* content start */}
      <Box sx={userStyle.container}>
        <Grid container spacing={2}>
          <Grid item xs={8} sx={userStyle.HeaderText}>All your categories</Grid>
          <Grid item xs={4}>
            {isUserRoleCompare[0].acategory && (
              <>
                <Link to="/product/category/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd} >ADD</Button></Link>
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
              <MenuItem value={(categories.length)}>All</MenuItem>
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
        <Grid container sx={{ justifyContent: 'center' }}>
          <Grid>
            {isUserRoleCompare[0].printcategory && (
              <>
                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
              </>
            )}
            {isUserRoleCompare[0].pdfcategory && (
              <>
                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
              </>
            )}
          </Grid>
        </Grid><br /><br />
        <Box>
          {/* Table Start */}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell >Action</StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('categoryname')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categoryname')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('categorycode')}><Box sx={userStyle.tableheadstyle}><Box>Category Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categorycode')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('categorydescription')}><Box sx={userStyle.tableheadstyle}><Box>Description</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('categorydescription')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('subcategories')}><Box sx={userStyle.tableheadstyle}><Box>Sub Category Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategories')}</Box></Box></StyledTableCell>
                  <StyledTableCell onClick={() => handleSorting('subcategories')}><Box sx={userStyle.tableheadstyle}><Box>Sub Category Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategories')}</Box></Box></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody align="left">
                {filteredData.length > 0 ?
                  (filteredData.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>
                        <Grid sx={{ display: 'flex' }}>
                          {isUserRoleCompare[0].ecategory && (
                            <>
                              <Link to={`/product/category/edit/${item._id}`} style={{ textDecoration: 'none', color: '#fff' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>
                            </>
                          )}
                          {isUserRoleCompare[0].dcategory && (
                            <>
                              <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(item._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                            </>
                          )}
                        </Grid>
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">{item.categoryname}</StyledTableCell>
                      <StyledTableCell>{item.categorycode}</StyledTableCell>
                      <StyledTableCell>{item.categorydescription}</StyledTableCell>
                      <StyledTableCell>{item.subcategories.map((value) => value.subcategryname + ",")}</StyledTableCell>
                      <StyledTableCell>{item.subcategories.map((value) => value.subcategrycode + ",")}</StyledTableCell>
                    </StyledTableRow>
                  )))
                  : <StyledTableRow><StyledTableCell colSpan={8} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                }
              </TableBody>
            </Table>
          </TableContainer><br /><br />
          <Box style={userStyle.dataTablestyle}>
            <Box>
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, categories.length)} of {categories.length} entries
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
          {/* Table End */}
        </Box>
      </Box>
      { /* content end */}
      {/* Print layout */}
      {/* ****** Table Start ****** */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" id="categorytablepdf" ref={componentRef}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell >Category Code</StyledTableCell>
              <StyledTableCell >Description</StyledTableCell>
              <StyledTableCell >Sub Category Name</StyledTableCell>
              <StyledTableCell >Sub Category Code</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody align="left">
            {categories &&
              (categories.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">{item.categoryname}</StyledTableCell>
                  <StyledTableCell>{item.categorycode}</StyledTableCell>
                  <StyledTableCell>{item.categorydescription}</StyledTableCell>
                  <StyledTableCell>{item.subcategories.map((value) => value.subcategryname + ",")}</StyledTableCell>
                  <StyledTableCell>{item.subcategories.map((value) => value.subcategrycode + ",")}</StyledTableCell>
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
          <Button onClick={(e) => deleteCats(catid)} autoFocus variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function Categorieslist() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <Categorieslisttable /><br /><br /><br /><br />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
export default Categorieslist;