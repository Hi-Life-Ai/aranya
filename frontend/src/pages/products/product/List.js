import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Grid, Select, MenuItem, FormControl, OutlinedInput, Dialog, DialogContent, DialogActions, Paper, Table, TableBody, TableHead, TableContainer, Button } from '@mui/material';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { userStyle } from "../../PageStyle";
import axios from 'axios';
import jsPDF from "jspdf";
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ExportXL, ExportCSV } from '../../Export';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from "../../../components/header/Headtitle";
import { ThreeDots } from 'react-loader-spinner';


function Productlisttable() {

  const { auth, setngs } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [exceldata, setExceldata] = useState([]);
  const [prid, setPrid] = useState({});

  // Datatable 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sorting, setSorting] = useState({ column: '', direction: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoader, setIsLoader] = useState(false);

  // Access
  const { isUserRoleCompare, isUserRoleAccess, allProducts } = useContext(UserRoleAccessContext);

  // Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => { setIsDeleteOpen(true); };
  const handleClose = () => { setIsDeleteOpen(false); };

  // get all products
  const fetchProduct = async () => {
    try {
      let response = await axios.post(SERVICE.PRODUCT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        businessid: String(setngs.businessid),
        role: String(isUserRoleAccess.role),
        userassignedlocation: [isUserRoleAccess.businesslocation]

      });

      setIsLoader(true);
      setProducts(response?.data?.products);

    } catch (err) {
      setIsLoader(true);
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  console.log(allProducts, "all")
  // delete function api
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      })
      setPrid(res.data.sproduct);
      //set function to get particular row
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  }

  //alert delete popup
  let prodid = prid._id;
  const deleteProd = async (prodid) => {
    try {
      let res = await axios.delete(`${SERVICE.PRODUCT_SINGLE}/${prodid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      await fetchProduct();
      handleClose();
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        toast.error(messages);
      } else {
        toast.error("Something went wrong!")
      }
    }
  };

  useEffect(
    () => {
      fetchProduct();
    }, []
  )

  // Excel
  const fileName = "Products";

  // get perticular columns for export excel
  const productexcel = async () => {
    var data = products.map(t => ({
      'Product Name': t.productname, SKU: t.sku,
      'Category': t.category, 'Sub Category': t.subcateory, 'Unit': t.unit, 'Tax': t.applicabletax,
      'Label Type': t.labeltype, 'Manage Stock': t.managestock, 'Company Rate': t.companyrate, 'Super Stock Rate': t.superstockrate, 'Dealer Rate': t.dealerrate,
      'productdescription': t.productdescription, 'applicabletax': t.applicabletax, 'Selling Price Tax': t.sellingpricetax,
      'Min Quantity': t.minquantity, 'Max Quantity': t.maxquantity, 'HSN': t.hsn, 'MRP': t.mrp.toFixed(2),
    }));
    setExceldata(data);
  }

  useEffect(
    () => {
      productexcel();
    }, [products]
  )

  // Print
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'ARANYA HERBALS | PRODUCTS',
    pageStyle: 'print'
  });

  // PDF
  const downloadPdf = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: '#producttablepdf' });
    doc.save('Products.pdf')
  }

  // Sorting
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
  const filteredDatas = products?.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
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
      <Headtitle title={'Products'} />
      { /* ****** Header Content ****** */}
      <Typography sx={userStyle.HeaderText}>Products <Typography component="span" sx={userStyle.SubHeaderText}>Manage your Products</Typography></Typography>
      { /* ****** Table Start ****** */}
      <>
        <Box sx={userStyle.container} >
          { /* Header Content */}
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>All your Products</Typography>
            </Grid>
            <Grid item xs={4}>
              {isUserRoleCompare[0].aproduct && (
                <>
                  <Link to="/product/product/create" style={{ textDecoration: 'none', color: 'white' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
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
          </Grid><br /><br />
          { /* Header Buttons */}
          {isLoader ? <>
            <Grid container sx={{ justifyContent: "center", }} >
              <Grid>
                {isUserRoleCompare[0].excelproduct && (
                  <>
                    <ExportCSV csvData={exceldata} fileName={fileName} />
                  </>
                )}
                {isUserRoleCompare[0].csvproduct && (
                  <>
                    <ExportXL csvData={exceldata} fileName={fileName} />
                  </>
                )}
                {isUserRoleCompare[0].printproduct && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                  </>
                )}
                {isUserRoleCompare[0].pdfproduct && (
                  <>
                    <Button sx={userStyle.buttongrp} onClick={downloadPdf}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                  </>
                )}
              </Grid>
              {/* Table Grid Container */}
            </Grid><br /><br />
            { /* Table Start */}
            <TableContainer component={Paper} >
              <Table aria-label="simple table">
                <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} >
                  <StyledTableRow >
                    <StyledTableCell >Actions</StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('productimage')}><Box sx={userStyle.tableheadstyle}><Box>Product Image</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productimage')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('productname')}><Box sx={userStyle.tableheadstyle}><Box>Product Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('productname')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('sku')}><Box sx={userStyle.tableheadstyle}><Box>SKU</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sku')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('category')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Sub category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategory')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('unit')}><Box sx={userStyle.tableheadstyle}><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('unit')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('applicabletax')}><Box sx={userStyle.tableheadstyle}><Box>Tax</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('applicabletax')}</Box></Box></StyledTableCell>
                    <StyledTableCell onClick={() => handleSorting('hsn')}><Box sx={userStyle.tableheadstyle}><Box>Hsn</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('hsn')}</Box></Box></StyledTableCell>

                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {filteredData.length > 0 ?
                    (filteredData.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row" colSpan={1}>
                          <Grid sx={{ display: 'flex' }}>
                            {isUserRoleCompare[0].eproduct && (
                              <>
                                <Link to={`/product/product/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit} style={{ minWidth: '0px' }}><EditOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                              </>
                            )}
                            {isUserRoleCompare[0].dproduct && (
                              <>
                                <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id); }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                              </>
                            )}
                            {isUserRoleCompare[0].vproduct && (
                              <>
                                <Link to={`/product/product/view/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonview} style={{ minWidth: '0px' }}><VisibilityOutlinedIcon style={{ fontSize: 'large' }} /></Button></Link>
                              </>
                            )}
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell ><img src={row.productimage} alt="image" width="70px" height="70px" /></StyledTableCell>
                        <StyledTableCell >{row.productname}</StyledTableCell>
                        <StyledTableCell >{row.sku}</StyledTableCell>
                        <StyledTableCell >{row.category}</StyledTableCell>
                        <StyledTableCell >{row.subcategory}</StyledTableCell>
                        <StyledTableCell >{row.unit}</StyledTableCell>
                        <StyledTableCell >{row.applicabletax}</StyledTableCell>
                        <StyledTableCell >{row.hsn}</StyledTableCell>
                      </StyledTableRow>
                    )))
                    : <StyledTableRow><StyledTableCell colSpan={12} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                  }
                </TableBody>
              </Table>
            </TableContainer><br /><br />
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
          </> : <>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
            </Box>
          </>}

          { /* Table End */}
        </Box>
      </>
      { /* ****** Table End ****** */}
      {/* Print layout */}
      <TableContainer component={Paper} sx={userStyle.printcls}>
        <Table aria-label="simple table" id="producttablepdf" ref={componentRef}>
          <TableHead sx={{ fontWeight: "600", fontSize: "14px" }} >
            <StyledTableRow >
              <StyledTableCell >Product Name</StyledTableCell>
              <StyledTableCell >SKU</StyledTableCell>
              <StyledTableCell >Category</StyledTableCell>
              <StyledTableCell >Sub category</StyledTableCell>
              <StyledTableCell >Unit</StyledTableCell>
              <StyledTableCell >Tax</StyledTableCell>
              <StyledTableCell >Hsn</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {products?.length > 0 ? (
              products?.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell >{row.productname}</StyledTableCell>
                  <StyledTableCell >{row.sku}</StyledTableCell>
                  <StyledTableCell >{row.category}</StyledTableCell>
                  <StyledTableCell >{row.subcategory}</StyledTableCell>
                  <StyledTableCell >{row.unit}</StyledTableCell>
                  <StyledTableCell >{row.applicabletax}</StyledTableCell>
                  <StyledTableCell >{row.hsn}</StyledTableCell>
                </StyledTableRow>
              ))
            ) : (<StyledTableCell colSpan={8}><Typography>No data available in table</Typography></StyledTableCell>
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
          <Button onClick={(e) => deleteProd(prodid)} autoFocus variant="contained" color='error'> OK </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function Productlist() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <Productlisttable /><br /><br /><br /><br />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
export default Productlist;