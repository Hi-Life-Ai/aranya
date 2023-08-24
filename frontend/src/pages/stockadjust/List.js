import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, Select, FormControl, MenuItem, Grid, Paper, Table, OutlinedInput, TableBody, TableHead, TableContainer, Button, DialogActions, DialogContent, Dialog, } from '@mui/material';
import { userStyle } from '../PageStyle';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import axios from 'axios';
import jsPDF from "jspdf";
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { ExportXL, ExportCSV } from '../Export';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';
import Headtitle from '../../components/header/Headtitle';
import { UserRoleAccessContext } from '../../context/Appcontext';
import { AuthContext } from '../../context/Appcontext';
import { SERVICE } from '../../services/Baseservice';
import { useReactToPrint } from "react-to-print";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Link } from 'react-router-dom';

function StocktransferandAdjustlist() {

    const { auth, setngs } = useContext(AuthContext);
    const [exceldata, setExceldata] = useState([]);
    const [transfereditem, setTransfereditem] = useState([]);
    const [Adjustitem, setAdjustitem] = useState([]);
    const [isReject, setIsReject] = useState();
    const [isAccept, setIsAccept] = useState({ transferid: "", tolocation: [], product: [] });
    const [isproducts, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    // Datatable Transfer
    const [pageTfr, setPageTfr] = useState(1);
    const [pageSizeTfr, setPageSizeTfr] = useState(1);
    const [sortingTfr, setSortingTfr] = useState({ column: '', direction: '' });
    const [searchQueryTfr, setSearchQueryTfr] = useState("");

    // Datatable Adjust
    const [pageAdj, setPageAdj] = useState(1);
    const [pageSizeAdj, setPageSizeAdj] = useState(1);
    const [sortingAdj, setSortingAdj] = useState({ column: '', direction: '' });
    const [searchQueryAdj, setSearchQueryAdj] = useState("");

    // Access
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

    // Accept model
    const [isAcceptOpen, setIsAcceptOpen] = useState(false);
    const handleAcceptOpen = () => { setIsAcceptOpen(true); };
    const handleAcceptClose = () => { setIsAcceptOpen(false); };

    // Reject model
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const handleRejectOpen = () => { setIsRejectOpen(true); };
    const handleRejectClose = () => { setIsRejectOpen(false); };

    // autoid
    let newval = setngs ? setngs.skuprefix == undefined ? "SK0000" : setngs.skuprefix + "0001" : "SK0000";

    //fetch all products
    const fetchAllProducts = async () =>{
        try{
            let resproduct = await axios.get(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            let productresult = resproduct.data.products.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid
            })

            setAllProducts(productresult);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    //product auto id
    allProducts?.map(
        () => {
            let strings = setngs ? setngs.skuprefix : "SK";
            let refNo = allProducts[allProducts.length - 1].sku;
            let digits = (allProducts.length + 1).toString();
            const stringLength = refNo.length;
            let lastChar = refNo.charAt(stringLength - 1);
            let getlastBeforeChar = refNo.charAt(stringLength - 2);
            let getlastThreeChar = refNo.charAt(stringLength - 3);
            let lastBeforeChar = refNo.slice(-2);
            let lastThreeChar = refNo.slice(-3);
            let lastDigit = refNo.slice(-4);
            let refNOINC = parseInt(lastChar) + 1
            let refLstTwo = parseInt(lastBeforeChar) + 1;
            let refLstThree = parseInt(lastThreeChar) + 1;
            let refLstDigit = parseInt(lastDigit) + 1;
            if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                refNOINC = ("000" + refNOINC);
                newval = strings + refNOINC;
            } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                refNOINC = ("00" + refLstTwo);
                newval = strings + refNOINC;
            } else if (digits.length < 4 && getlastThreeChar > 0) {
                refNOINC = ("0" + refLstThree);
                newval = strings + refNOINC;
            } else {
                refNOINC = (refLstDigit);
                newval = strings + refNOINC;
            }
        }); 

    // transfereditem
    const fetchTransfers = async () => {
        try {
            let response = await axios.get(`${SERVICE.TRANSFERS}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            let resproduct = await axios.get(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            let productresult = resproduct.data.products.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid
            })

            //stock transfer data
            //admin
            let transferresult = response.data.transfers.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid && data.status == false && data.reject == false

            })
            //other user  
            let transferDatatransfer = response.data.transfers.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid && data.status == false && data.reject == false
            })
            // let transferData = response.data.transfers
            let userLocations = isUserRoleAccess.businesslocation
            let filteredDataTransfer = []
            transferDatatransfer.forEach((data, index) => {
                let products = []
                // let actualProducts = data.products[0]
                data.products.forEach((product) => {
                    let quantity = {}
                    for (let key in product.quantity) {
                        if (userLocations.includes(key)) {
                            quantity[key] = product.quantity[key]
                        }
                    }
                    let locations = product.locations.filter((data, index) => {
                        if (userLocations.includes(data)) {
                            return true;
                        }
                    })
                    if (locations.length != 0) {
                        products.push({ ...product, quantity, locations })

                    }

                })
                if (products.length != 0) {
                    filteredDataTransfer.push({ ...data, products })

                }
            })

            //stock adjust data
            //admin
            let adjustresult = response.data.transfers.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid && data.status == true && data.reject == false
            })
            // other user
            let transferData = response.data.transfers.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid && data.status == true && data.reject == false
            })
            let filteredData = []
            transferData.forEach((data, index) => {
                let products = []
                // let actualProducts = data.products[0]
                data.products.forEach((product) => {
                    let quantity = {}
                    for (let key in product.quantity) {
                        if (userLocations.includes(key)) {
                            quantity[key] = product.quantity[key]
                        }
                    }
                    let locations = product.locations.filter((data, index) => {
                        if (userLocations.includes(data)) {
                            return true;
                        }
                    })
                    if (locations.length != 0) {
                        products.push({ ...product, quantity, locations })

                    }

                })
                if (products.length != 0) {
                    filteredData.push({ ...data, products })

                }
            })
            setProducts(productresult);
            setAdjustitem(isUserRoleAccess.role == 'Admin' ? adjustresult : filteredData)
            setTransfereditem(isUserRoleAccess.role == 'Admin' ? transferresult : filteredDataTransfer)
        } catch (err) {
            const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
        }
    };

    const handleCancel = async () => {

        try {
            let response = await axios.put(`${SERVICE.TRANSFER_SINGLE}/${isReject}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                reject: Boolean(true),
            })

            await handleRejectClose();

            toast.success(response.data.message, {
                position: toast.POSITION.TOP_CENTER
            });

        } catch (err) {
            const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
        }
    }


    const handleAccept = async () => {
        let acceptedProduct = isAccept.product
        let acceptedProductLength = isAccept.product.length
        let allProducts = isproducts
        let allProductsLength = isproducts.length

        for (let acceptIndex = 0; acceptIndex < acceptedProductLength;) {
            let acceptProduct = acceptedProduct[acceptIndex]
            let updateProduct = ""
            for (let allProductsIndex = 0; allProductsIndex < allProductsLength; allProductsIndex++) {
                if (allProducts[allProductsIndex].category == acceptProduct.category || allProducts[allProductsIndex].subcategory == acceptProduct.subcategory && allProducts[allProductsIndex].productname == acceptProduct.productname) {
                    updateProduct = allProducts[allProductsIndex];
                    break;
                }

            }
            if (updateProduct) {
                //update call
                await axios.put(`${SERVICE.PRODUCT_SINGLE}/${updateProduct._id}`,{
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    currentstock: Number(updateProduct.currentstock) + Number(acceptProduct.quantity[acceptProduct.locations])
                })
                acceptIndex++
                
            } else {
                // store call
                await axios.post(SERVICE.PRODUCT_CREATE, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    category: String(acceptProduct.category),
                    subcategory: String(acceptProduct.subcategory),
                    productname: String(acceptProduct.productname),
                    mrp: Number(acceptProduct.mrp),
                    companyrate: Number(acceptProduct.companyrate),
                    superstockrate: Number(acceptProduct.superstockrate),
                    dealerrate: Number(acceptProduct.dealerrate),
                    sku: String(newval),
                    hsn: String(""),
                    labeltype: String("Qr code"),
                    expirydate: String(acceptProduct.expirydate),
                    unit: String(acceptProduct.unit),
                    currentstock: Number(acceptProduct.quantity[acceptProduct.locations]),
                    managestock: Boolean(false),
                    minquantity: Number(0),
                    maxquantity: Number(0),
                    productdescription: String(""),
                    productimage: String(""),
                    applicabletax: String(""),
                    sellingpricetax: String(acceptProduct.sellingpricetax),
                    assignbusinessid: String(setngs.businessid),
                });
                await fetchAllProducts();
                acceptIndex++
            }

        }

        await axios.put(`${SERVICE.TRANSFER_SINGLE}/${isAccept.transferid}`, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
            status: Boolean(true),
        })

        await handleAcceptClose();

    }

    useEffect(
        () => {
            fetchTransfers();
        }, [isRejectOpen, isAcceptOpen])

    // Excel
    const fileName = 'Stock Transfer'
    //  get particular columns for export excel
    const getexcelDatas = async () => {
        let data = Adjustitem.map((t, i) => ({
            Location: t.tobusinesslocation,
        }));
        setExceldata(data);
    }

    useEffect(
        ()=>{
            fetchAllProducts();
        },[]
    )

    useEffect(() => {
        getexcelDatas();
    }, [transfereditem])

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | Stock Adjust',
        pageStyle: 'print'
    });

    //  PDF
    const downloadPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, { html: '#stockadjustpdf' })
        doc.save('Stock Adjust.pdf')
    }

    // Sorting Transfer
    const handleSortingTfr = (column) => {
        const direction = sortingTfr.column === column && sortingTfr.direction === 'asc' ? 'desc' : 'asc';
        setSortingTfr({ column, direction });
    };

    const renderSortingIconTfr = (column) => {
        if (sortingTfr.column !== column) {
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
        } else if (sortingTfr.direction === 'asc') {
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

    // Datatable Tranfer
    const handlePageChangeTfr = (newPage) => {
        setPageTfr(newPage);
    };

    const handlePageSizeChangeTfr = (event) => {
        setPageSizeTfr(Number(event.target.value));
        setPageTfr(1);
    };

    const handleSearchChangeTfr = (event) => {
        setSearchQueryTfr(event.target.value);
    };
    const filteredDatasTfr = transfereditem?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQueryTfr.toLowerCase())
        )
    );

    const filteredDataTfr = filteredDatasTfr.slice((pageTfr - 1) * pageSizeTfr, pageTfr * pageSizeTfr);

    const totalPagesTfr = Math.ceil(transfereditem.length / pageSizeTfr);

    const visiblePagesTfr = Math.min(totalPagesTfr, 3);

    const firstVisiblePageTfr = Math.max(1, pageTfr - 1);
    const lastVisiblePageTfr = Math.min(firstVisiblePageTfr + visiblePagesTfr - 1, totalPagesTfr);

    const pageNumbersTfr = [];

    for (let i = firstVisiblePageTfr; i <= lastVisiblePageTfr; i++) {
        pageNumbersTfr.push(i);
    }

    // Sorting Adjust
    const handleSortingAdj = (column) => {
        const direction = sortingAdj.column === column && sortingAdj.direction === 'asc' ? 'desc' : 'asc';
        setSortingAdj({ column, direction });
    };

    const renderSortingIconAdj = (column) => {
        if (sortingAdj.column !== column) {
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
        } else if (sortingAdj.direction === 'asc') {
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

    // Datatable Adjust
    const handlePageChangeAdj = (newPage) => {
        setPageAdj(newPage);
    };

    const handlePageSizeChangeAdj = (event) => {
        setPageSizeAdj(Number(event.target.value));
        setPageAdj(1);
    };

    const handleSearchChangeAdj = (event) => {
        setSearchQueryAdj(event.target.value);
    };
    const filteredDatasAdj = Adjustitem?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQueryAdj.toLowerCase())
        )
    );

    const filteredDataAdj = filteredDatasAdj.slice((pageAdj - 1) * pageSizeAdj, pageAdj * pageSizeAdj);

    const totalPagesAdj = Math.ceil(Adjustitem.length / pageSizeAdj);

    const visiblePagesAdj = Math.min(totalPagesAdj, 3);

    const firstVisiblePageAdj = Math.max(1, pageAdj - 1);
    const lastVisiblePageAdj = Math.min(firstVisiblePageAdj + visiblePagesAdj - 1, totalPagesAdj);

    const pageNumbersAdj = [];

    for (let i = firstVisiblePageAdj; i <= lastVisiblePageAdj; i++) {
        pageNumbersAdj.push(i);
    }

    return (
        <Box sx={userStyle.filtercontent} >
            <Headtitle title={'Stock Transfer and Adjust'} />
            <Grid container sx={{ display: 'flex' }} spacing={3}>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                    { /* --------------------------- Stock Transfer --------------------------- Start */}
                    <Typography component={'span'} variant='body2' sx={userStyle.HeaderText}>Stock Transfer</Typography><br />
                    <Box >
                        <>
                            <br /><br />
                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <label htmlFor="pageSizeSelect">Show&ensp;</label>
                                    <Select id="pageSizeSelect" value={pageSizeTfr} onChange={handlePageSizeChangeTfr} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(transfereditem.length)}>All</MenuItem>
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
                                                value={searchQueryTfr}
                                                onChange={handleSearchChangeTfr}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Box>
                            </Grid><br /><br />
                            <Box>
                                { /* ****** Table start ****** */}
                                <TableContainer component={Paper} >
                                    <Table aria-label="simple table" id="tableRef1" >
                                        <TableHead sx={{ fontWeight: "600" }} >
                                            <StyledTableRow>
                                                <StyledTableCell onClick={() => handleSortingTfr('createdAt')}><Box sx={userStyle.tableheadstyle}><Box>Date</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTfr('createdAt')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSortingTfr('fromlocation')}><Box sx={userStyle.tableheadstyle}><Box>From Company</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTfr('fromlocation')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSortingTfr('products')}><Box sx={userStyle.tableheadstyle}><Box>Product</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTfr('products')}</Box></Box></StyledTableCell>
                                                <StyledTableCell onClick={() => handleSortingTfr('products')}><Box sx={userStyle.tableheadstyle}><Box>Product Quantity</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconTfr('products')}</Box></Box></StyledTableCell>
                                                <StyledTableCell>Action</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredDataTfr.length > 0 ?
                                                filteredDataTfr.map((row, index) => {
                                                    return (
                                                        <StyledTableRow key={index}>
                                                            <StyledTableCell>{row.date}</StyledTableCell>
                                                            <StyledTableCell>{row.fromlocation}</StyledTableCell>
                                                            <StyledTableCell>{row.products.map((value) => value.productname + ", ")}</StyledTableCell>
                                                            <StyledTableCell>{row.products.map((value) => value.locations.map((data, liindec) => value.quantity[data] + ', '))}</StyledTableCell>
                                                            <StyledTableCell>
                                                                <Button variant="contained" color="success" size="small" onClick={(e) => { handleAcceptOpen(); setIsAccept({ ...isAccept, transferid: row._id, tolocation: row.tobusinesslocations, product: row.products }) }}><DoneOutlineOutlinedIcon /></Button>&emsp;
                                                                <Button variant="contained" color="error" size="small" onClick={(e) => { handleRejectOpen(); setIsReject(row._id) }} ><CancelOutlinedIcon /></Button>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    )
                                                })
                                                : <StyledTableRow><StyledTableCell colSpan={6} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer><br /><br />
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {((pageTfr - 1) * pageSizeTfr) + 1} to {Math.min(pageTfr * pageSizeTfr, transfereditem.length)} of {transfereditem.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => handlePageChangeTfr(pageTfr - 1)} disabled={pageTfr === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                                            Prev
                                        </Button>
                                        {pageNumbersTfr?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeTfr(pageNumber)} className={((pageTfr)) === pageNumber ? 'active' : ''} disabled={pageTfr === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePageTfr < totalPagesTfr && <span>...</span>}
                                        <Button onClick={() => handlePageChangeTfr(pageTfr + 1)} disabled={pageTfr === totalPagesTfr} sx={{ textTransform: 'capitalize', color: 'black' }}>
                                            Next
                                        </Button>
                                    </Box>
                                </Box>

                                { /* ****** Table End ****** */}
                            </Box>
                        </>
                    </Box>
                </Grid>


                <Grid item lg={6} md={12} sm={12} xs={12}>
                    { /* --------------------------- Stock Adjust --------------------------- Start */}
                    <Typography component={'span'} variant='body2' sx={userStyle.HeaderText}>Stock Adjust</Typography>
                    <>
                        <Box>
                            <br /><br />
                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <label htmlFor="pageSizeSelect">Show&ensp;</label>
                                    <Select id="pageSizeSelect" value={pageSizeAdj} onChange={handlePageSizeChangeAdj} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(Adjustitem.length)}>All</MenuItem>
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
                                                value={searchQueryAdj}
                                                onChange={handleSearchChangeAdj}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Box>
                            </Grid><br /><br />
                            <Grid container sx={{ justifyContent: "center" }} >
                                <Grid>
                                    {/* {isUserRoleCompare[0].excelcurrentstockadjust && (
                                        <>
                                            <ExportCSV csvData={exceldata} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare[0].csvcurrentstockadjust && (
                                        <>
                                            <ExportXL csvData={exceldata} fileName={fileName} />
                                        </>
                                    )} */}
                                    {isUserRoleCompare[0].printcurrentstockadjust && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare[0].pdfcurrentstockadjust && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                </Grid>
                            </Grid><br /><br />
                            { /* ****** Table start ****** */}
                            <TableContainer component={Paper} >
                                <Table aria-label="simple table" id="tableRefone2" >
                                    <TableHead sx={{ fontWeight: "600" }} >
                                        <StyledTableRow>
                                            <StyledTableCell>Action</StyledTableCell>
                                            <StyledTableCell onClick={() => handleSortingAdj('tobusinesslocation')}><Box sx={userStyle.tableheadstyle}><Box>Transfered Location</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconAdj('tobusinesslocation')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSortingAdj('products')}><Box sx={userStyle.tableheadstyle}><Box>Product</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconAdj('products')}</Box></Box></StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredDataAdj.length > 0 ?
                                            filteredDataAdj.map((row, index) => {
                                                return (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell>
                                                            {isUserRoleCompare[0].vstockadjust &&
                                                                <Link to={`/stockadjust/view/${row._id}`} style={{ textDecoration: 'none', color: 'white', }}><Button sx={userStyle.buttonview} variant="contained"><VisibilityOutlinedIcon /></Button></Link>
                                                            }
                                                        </StyledTableCell>
                                                        <StyledTableCell sx={{ fontSize: "15px" }}>{row.tobusinesslocations}</StyledTableCell>
                                                        <StyledTableCell sx={{ fontSize: "15px" }}>{row.products.map((value) => value.productname + ", ")}</StyledTableCell>
                                                    </StyledTableRow>
                                                )
                                            })
                                            : <StyledTableRow><StyledTableCell colSpan={3} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer><br /><br />
                            <Box style={userStyle.dataTablestyle}>
                                <Box>
                                    Showing {((pageAdj - 1) * pageSizeAdj) + 1} to {Math.min(pageAdj * pageSizeAdj, Adjustitem.length)} of {Adjustitem.length} entries
                                </Box>
                                <Box>
                                    <Button onClick={() => handlePageChangeAdj(pageAdj - 1)} disabled={pageAdj === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                                        Prev
                                    </Button>
                                    {pageNumbersAdj?.map((pageNumber) => (
                                        <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeAdj(pageNumber)} className={((pageAdj)) === pageNumber ? 'active' : ''} disabled={pageAdj === pageNumber}>
                                            {pageNumber}
                                        </Button>
                                    ))}
                                    {lastVisiblePageAdj < totalPagesAdj && <span>...</span>}
                                    <Button onClick={() => handlePageChangeAdj(pageAdj + 1)} disabled={pageAdj === totalPagesAdj} sx={{ textTransform: 'capitalize', color: 'black' }}>
                                        Next
                                    </Button>
                                </Box>
                            </Box>
                            { /* ****** Table End ****** */}
                        </Box>
                    </>
                    { /* ------------------------- Print ------------------------------------- */}
                    <Box sx={userStyle.printcls}>
                        <>
                            <Box  >
                                <TableContainer component={Paper} >
                                    <Table sx={{ fontWeight: "600" }} aria-label="simple table" ref={componentRef} id="stockadjustpdf">
                                        <TableHead sx={{ fontWeight: "600" }} >
                                            <Typography component={'span'} variant='body2' >Stock Adjust Print</Typography>
                                            <StyledTableRow  >
                                                <StyledTableCell>Transfered Location</StyledTableCell>
                                                <StyledTableCell>Product</StyledTableCell>
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Adjustitem &&
                                                Adjustitem.map((row, index) => {
                                                    return (
                                                        <StyledTableRow key={index}>
                                                            <StyledTableCell sx={{ fontSize: "15px" }}>{row.tobusinesslocations}</StyledTableCell>
                                                            <StyledTableCell sx={{ fontSize: "15px" }}>{row.products.map(a => a.productname + ", ")}</StyledTableCell>
                                                        </StyledTableRow>
                                                    )
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </>
                    </Box>
                </Grid>
            </Grid>
            <Box>
                {/* Reject DIALOG */}
                <Dialog
                    open={isRejectOpen}
                    onClose={handleRejectClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'red', textAlign: 'center' }}>Are you sure want to Reject?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleRejectClose} variant="outlined">Cancel</Button>
                        <Button autoFocus variant="contained" color='error' onClick={() => { handleCancel(); }}> OK </Button>
                    </DialogActions>
                </Dialog>
                {/* Accept dialog */}
                <Dialog
                    open={isAcceptOpen}
                    onClose={handleAcceptClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'red', textAlign: 'center' }}>Are you sure want to Accept?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAcceptClose} variant="outlined">Cancel</Button>
                        <Button autoFocus variant="contained" color='error' onClick={() => { handleAccept(); }}> OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>

    );
}


function StocktransferandAdjust() {
    return (
        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <StocktransferandAdjustlist /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}
export default StocktransferandAdjust;