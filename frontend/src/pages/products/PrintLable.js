import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, FormGroup, FormControlLabel, Select, MenuItem, Dialog, DialogContent, DialogActions, Table, TableBody, TableContainer, TableHead, Typography, Checkbox, IconButton, Tooltip, Paper, Button, } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { AiOutlineSetting } from 'react-icons/ai';
import { userStyle } from '../PageStyle';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import ClearIcon from '@mui/icons-material/Clear';
import Selects from "react-select";
import { AiOutlineClose } from "react-icons/ai";
import axios from 'axios';
import Qrcodegenerate from './Qrcode';
import Qrcodegeneratesize2 from './Qrcodesize2';
import Qrcodegeneratesize3 from './Qrcodesize3';
import Qrcodegeneratesize4 from './Qrcodesize4';
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from '../../context/Appcontext';
import { toast } from 'react-toastify';
import { SERVICE } from '../../services/Baseservice';
import { AuthContext } from '../../context/Appcontext';


function PrintLabellist() {

    const componentRef = useRef();
    const { auth, setngs } = useContext(AuthContext);
    // search data
    const [productsList, setProductsList] = useState([]);
    const [tableData, setTableData] = useState([]);
    // search addressone
    const [getProductData, setGetProductData] = useState([]);
    const [isQrCodePreview, setIsQrCodePreview] = useState(false);
    const [productLabel, setProductLabel] = useState({ isProductLocation: true, isProductCode: true, isProductCategory: true, isProductSubcategory: true, isProductMrp: true });

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const { isUserRoleCompare, isUserRoleAccess, allProducts } = useContext(UserRoleAccessContext);


    //   Products
    const fetchProducts = async () => {
        try {
            let response = await axios.post(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]

            });
            // let result = response.data.products.filter((data, index) => {
            //     return data.assignbusinessid == setngs.businessid
            // })
            setProductsList(
                response?.data?.products?.map((d) => ({
                    ...d,
                    label: d.productname,
                    value: d.sku,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const fetchDataProd = (e) => {
        setTableData((tableData) => [...tableData, { ...e, labelitem: "" }]);

        // let isAlreadyAdded = false;
        // let addedproductId = tableData.map((item) => {
        //     if (e.sku == item.sku) {
        //         isAlreadyAdded = true
        //         setShowAlert("This  product already added!")
        //         handleClickOpen();
        //         return { ...item }
        //     } else {
        //         return item
        //     }
        // })
        // if (isAlreadyAdded) {
        //     setTableData(addedproductId)
        // }

    };

    // Delete Searched Product
    const deleteRow = (index) => {
        setTableData(tableData.filter((v, item) =>
            item !== index
        ));
        setIsQrCodePreview(false);
        // let rows = [];
        // setTableData(

        //             getProductData.forEach((value, index) => {

        //                 for (let i = 0; i >= Number(tableData[index].labelitem); i--) {
        //                     rows.push(
        //                         <>
        //                             <Grid item md={4} sx={{ margin: 0, padding: 0, width: '170px', height: '123px' }} key={i}>
        //                                 <Qrcodegeneratesize2 getProductData={value} productLabel={productLabel} />
        //                             </Grid>
        //                         </>
        //                     )
        //                 }
        //             })



        // )
    }

    const searchAdd = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setGetProductData([...getProductData, res.data.sproduct]);
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: "print",
    });

    const multiplyQrlabel = (id, value) => {
        let labelItemTabledata = tableData.map((item, index) => {
            if (index == id) {
                return { ...item, labelitem: value }
            }
            else {
                return item;
            }
        })
        setTableData(labelItemTabledata);
    }

    useEffect(
        () => {
            fetchProducts();
        }, []
    )


    return (
        <Box>
            <Typography sx={userStyle.HeaderText}>Print Labels&ensp;</Typography>
            {/* label card 1 start */}
            <Box sx={userStyle.container} style={{ minHeight: '300px' }}>
                <Typography sx={userStyle.importheadtext}>Add products to generate Labels</Typography><br /><br />
                <Grid container style={{ justifyContent: "center", }} sx={userStyle.textInput}>
                    <Grid md={8} sx={12} xs={12}>
                        <Grid sx={{ display: 'flex' }}  >
                            <Grid sx={userStyle.spanIcons}>< SearchOutlinedIcon />  </Grid>
                            <FormControl size="small" fullWidth >
                                <Selects
                                    options={productsList}
                                    onChange={(e) => {
                                        fetchDataProd(e)
                                        searchAdd(e._id)
                                    }}

                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <br />
                <TableContainer component={Paper}>
                    <Table aria-label="customized table" id="">
                        <TableHead >
                            <StyledTableRow >
                                <StyledTableCell >Product name</StyledTableCell>
                                <StyledTableCell >Product Code</StyledTableCell>
                                <StyledTableCell >No. of labels</StyledTableCell>

                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {tableData && tableData.map((item, index) => {
                                return (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell >{item.productname}</StyledTableCell>
                                        <StyledTableCell>{item.sku}</StyledTableCell>
                                        <StyledTableCell>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={item.labelitem}
                                                onChange={(e) => multiplyQrlabel(index, e.target.value)}
                                                type="number"
                                                size="small"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <AiOutlineClose style={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: 'large' }} onClick={(e) => deleteRow(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }} />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer><br />
            </Box><br /><br />
            <Box sx={userStyle.container}>
                {/* label informations */}
                <Typography sx={userStyle.importheadtext}>Information to show in Labels</Typography><br /><br />
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Grid sx={{ display: 'flex' }}  >
                            <Grid sx={userStyle.spanIconTax}><AiOutlineSetting /></Grid>
                            <FormControl size="small" fullWidth sx={userStyle.formfield}>
                                <InputLabel id="demo-select-small">Label Size</InputLabel>
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    label="Label Size"
                                    value={productLabel.barcodesetting}
                                    onChange={(event) => { setProductLabel({ ...productLabel, barcodesetting: event.target.value }) }}
                                    fullWidth
                                >
                                    <MenuItem value="size1">Label Size: 35mm<ClearIcon sx={{ fontSize: '12px' }} />22mm</MenuItem>
                                    <MenuItem value="size2">label Size: 25mm<ClearIcon sx={{ fontSize: '12px' }} />25mm</MenuItem>
                                    <MenuItem value="size3">label Size: 25mm<ClearIcon sx={{ fontSize: '12px' }} />20mm</MenuItem>
                                    <MenuItem value="size4">label Size: 50mm<ClearIcon sx={{ fontSize: '12px' }} />20mm</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid><br />
                <Box>
                    <form action=''>
                        {productLabel.barcodesetting === "size1" ?
                            (
                                <>
                                    <Grid container>
                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox checked={productLabel.isProductLocation} onClick={(e) => setProductLabel({ ...productLabel, isProductLocation: !productLabel.isProductLocation })} />} label="Location name" />
                                            </FormGroup>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Product code" />
                                            </FormGroup>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox checked={productLabel.isProductCategory} onClick={(e) => setProductLabel({ ...productLabel, isProductCategory: !productLabel.isProductCategory })} />} label="Category" />
                                            </FormGroup>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox checked={productLabel.isProductMrp} onClick={(e) => setProductLabel({ ...productLabel, isProductMrp: !productLabel.isProductMrp })} />} label="Selling Price" />
                                            </FormGroup>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4} lg={4}>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox checked={productLabel.isProductSubcategory} onClick={(e) => setProductLabel({ ...productLabel, isProductSubcategory: !productLabel.isProductSubcategory })} />} label="Sub Category" />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>
                                </>
                            ) :
                            (
                                productLabel.barcodesetting === "size2" ?
                                    (
                                        <>
                                            <Grid container>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductLocation} onClick={(e) => setProductLabel({ ...productLabel, isProductLocation: !productLabel.isProductLocation })} />} label="Location name" />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Product code" />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductCategory} onClick={(e) => setProductLabel({ ...productLabel, isProductCategory: !productLabel.isProductCategory })} />} label="Category" />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductMrp} onClick={(e) => setProductLabel({ ...productLabel, isProductMrp: !productLabel.isProductMrp })} />} label="Selling Price" />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductSubcategory} onClick={(e) => setProductLabel({ ...productLabel, isProductSubcategory: !productLabel.isProductSubcategory })} />} label="Sub Category" />
                                                    </FormGroup>
                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : productLabel.barcodesetting === "size3" ?
                                        (
                                            <>
                                                <Grid container>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductLocation} onClick={(e) => setProductLabel({ ...productLabel, isProductLocation: !productLabel.isProductLocation })} />} label="Location name" />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Product code" />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductCategory} onClick={(e) => setProductLabel({ ...productLabel, isProductCategory: !productLabel.isProductCategory })} />} label="Category" />
                                                        </FormGroup>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6} md={4} lg={4}>
                                                        <FormGroup>
                                                            <FormControlLabel control={<Checkbox checked={productLabel.isProductMrp} onClick={(e) => setProductLabel({ ...productLabel, isProductMrp: !productLabel.isProductMrp })} />} label="Selling Price" />
                                                        </FormGroup>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ) : <>
                                            <Grid container>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductLocation} onClick={(e) => setProductLabel({ ...productLabel, isProductLocation: !productLabel.isProductLocation })} />} label="Location name" />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductCode} onClick={(e) => setProductLabel({ ...productLabel, isProductCode: !productLabel.isProductCode })} />} label="Product code" />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductCategory} onClick={(e) => setProductLabel({ ...productLabel, isProductCategory: !productLabel.isProductCategory })} />} label="Category" />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductMrp} onClick={(e) => setProductLabel({ ...productLabel, isProductMrp: !productLabel.isProductMrp })} />} label="Selling Price" />
                                                    </FormGroup>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} lg={4}>
                                                    <FormGroup>
                                                        <FormControlLabel control={<Checkbox checked={productLabel.isProductSubcategory} onClick={(e) => setProductLabel({ ...productLabel, isProductSubcategory: !productLabel.isProductSubcategory })} />} label="Sub Category" />
                                                    </FormGroup>
                                                </Grid>
                                            </Grid>
                                        </>
                            )
                        }
                        <br /><hr />
                        <Box sx={{ float: 'right' }}>
                            <Button sx={userStyle.buttonadd} onClick={handleprint}>PRINT</Button>
                            <Button sx={userStyle.buttonadd} onClick={(e) => setIsQrCodePreview(true)}>UPDATE</Button>
                        </Box><br />
                    </form>

                </Box>
            </Box><br /><br />

            <div ref={componentRef} style={{ padding: 0, margin: 0 }}>
                < Grid container columnSpacing={1} sx={{ padding: 0, backgroundColor: 'white', }} width="555px">
                    {isQrCodePreview &&
                        (() => {
                            let rows = [];
                            getProductData.forEach((value, index) => {

                                for (let i = 1; i <= Number(tableData[index].labelitem); i++) {
                                    rows.push(
                                        <>
                                            <Grid item md={4} sx={{ margin: 0, padding: 0, width: '170px', height: '123px' }} key={i}>
                                                <Qrcodegeneratesize2 getProductData={value} productLabel={productLabel} />
                                            </Grid>
                                        </>
                                    )
                                }
                            })
                            return rows;
                        })
                            ()}
                </Grid>
            </div>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

function PrintLabel() {
    return (
        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <PrintLabellist /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}

export default PrintLabel;