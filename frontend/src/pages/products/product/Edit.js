import React, { useState, useEffect, useContext } from 'react';
import { userStyle, colourStyles } from '../../PageStyle';
import { Box, Grid, FormControl, Tooltip, InputLabel, Dialog, DialogContent, DialogActions, OutlinedInput, TextareaAutosize, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Button, IconButton } from '@mui/material';
import { FcInfo } from "react-icons/fc";
import Selects from "react-select";
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import Createunitmod from './Createunitmod';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Webcamimage from '../Webcamproduct';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import CreatecateMod from './CreateCatemod';

function Producteditlist() {

    const [locationData, setLocationData] = useState([])
    const { auth, setngs } = useContext(AuthContext);
    const [categories, setCategories] = useState();
    const [units, setUnits] = useState();
    const [file, setFile] = useState();
    const [subcategories, setSubcategories] = useState();
    const [fetchsaveunit, setFetchsaveunit] = useState();
    const [fetchCate, setFetchCate] = useState();
    const [taxrates, setTaxrates] = useState();
    const id = useParams().id;

    // Text field
    const [product, setProduct] = useState({
        productname: "", sku: "", hsn: "", hsncode: "", barcodetype: "Qr code", unit: "", currentstock: 0, pruchaseincludetax: 0, sellingexcludetax: 0, producttype: "Single", applicabletax: "",
        purchaseexcludetax: 0, sellingpricetax: "", category: "", subcategory: "DEFAULT", businesslocation: "", managestock: true, minquantity: "", maxquantity: "", productdescription: "", productimage: "",
        mrp: "", expirydate: "", companyrate: "", superstockrate: "", dealerrate: ""
    });

    // ALERT POPUP
    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenalert = () => { setIsErrorOpen(true); };
    const handleClosealert = () => { setIsErrorOpen(false); };

    //webcam
    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [getImg, setGetImg] = useState(null)
    const [isWebcamCapture, setIsWebcamCapture] = useState(false)
    const webcamOpen = () => {
        setIsWebcamOpen(true);
    };
    const webcamClose = () => {
        setIsWebcamOpen(false);
    };

    const webcamDataStore = () => {
        setIsWebcamCapture(true)
        //popup close
        webcamClose();
    }

    //add webcamera popup
    const showWebcam = () => {
        webcamOpen();
    }

    //selling price tax 
    const selltaxtype = [
        { value: "Exclusive", label: "Exclusive" },
        { value: "Inclusive", label: "Inclusive" }
    ];

    //barcode code types 
    const barcodetypes = [
        { value: "Qr code", label: "Qr code" },
        { value: "Code 128 (C128)", label: "Code 128 (C128)" },
        { value: "Code 39 (C39)", label: "Code 39 (C39)" },
        { value: "EAN-13", label: "EAN-13" },
        { value: "EAN-8", label: "EAN-8" },
        { value: "UPC-A", label: "UPC-A" },
        { value: "UPC-E", label: "UPC-E" },
    ];

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
            setUnits(
                result?.map((d) => ({
                    ...d,
                    label: d.unit,
                    value: d.unit,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
        }


    };



    const fetchData = async () => {
        try {
            let res = await axios.get(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = res.data.products.map((data, index) => {
                if (data.assignbusinessid == setngs.businessid) {
                    return data.sku
                }
            })
            setLocationData(result);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => {
        fetchData()
    }, [locationData, fetchCate])

    // Categorys
    const fetchCategory = async () => {
        try {
            let response = await axios.get(SERVICE.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = response.data.categories.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid
            })

            setCategories(
                result?.map((d) => ({
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // cascade sub category
    const searchSubcatename = async (id) => {
        try {
            let productlist = await axios.get(`${SERVICE.CATEGORIES_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setSubcategories(
                productlist?.data?.scategory?.subcategories?.map((d) => ({
                    ...d,
                    label: d.subcategryname,
                    value: d.subcategryname,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
        }
    }

    // Taxrates
    const fetchRates = async () => {
        try {
            let response = await axios.get(SERVICE.TAXRATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let taxRateData = response.data.taxrates.filter((data) => {
                return data.assignbusinessid == setngs.businessid
            })
            setTaxrates(
                taxRateData?.map((d) => ({
                    ...d,
                    label: d.taxname,
                    value: d.taxname,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
        }
    };

    // Image Upload
    function handleChange(e) {
        let productimage = document.getElementById("productimage")
        var path = (window.URL || window.webkitURL).createObjectURL(productimage.files[0]);
        toDataURL(path, function (dataUrl) {
            productimage.setAttribute('value', String(dataUrl));
            setProduct({ ...product, productimage: String(dataUrl) })
            return dataUrl;
        })
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    function toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    const resetImage = () => {
        setProduct({ ...product, productimage: "" });
        setGetImg("");
    }

    const backLPage = useNavigate();
    let capture = isWebcamCapture == true ? getImg : product.productimage;


    const getProducts = async () => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            setProduct(res.data.sproduct);
        } catch (err) {
            const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
        }
    }
    // store product data
    const sendRequest = async () => {

        try {
            let PRODUCT_REQ = await axios.put(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(product.category),
                subcategory: String(product.subcategory),
                productname: String(product.productname),
                mrp: Number(product.mrp),
                companyrate: Number(product.companyrate),
                superstockrate: Number(product.superstockrate),
                dealerrate: Number(product.dealerrate),
                sku: String(product.sku),
                hsn: String(product.hsn),
                labeltype: String(product.labeltype),
                expirydate: String(product.expirydate),
                unit: String(product.unit),
                currentstock: Number(product.currentstock),
                managestock: Boolean(product.managestock),
                minquantity: Number(product.managestock ? product.minquantity : 0),
                maxquantity: Number(product.managestock ? product.maxquantity : 0),
                productdescription: String(product.productdescription),
                productimage: String(capture),
                applicabletax: String(product.applicabletax),
                sellingpricetax: String(product.sellingpricetax),
            });
            setProduct(PRODUCT_REQ.data);
            toast.success(PRODUCT_REQ.data.message);
            backLPage('/product/product/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                setShowAlert(messages);
                handleClickOpenalert();
            }else{
                setShowAlert("Something went wrong!");
                handleClickOpenalert();
            }
        }
    };


    useEffect(() => {
        getProducts()
    }, [id])

    useEffect(() => {
        fetchCategory();
        fetchRates();
    }, [categories, setngs])

    useEffect(
        () => {
            fetchUnit();
        }, [fetchsaveunit, fetchsaveunit]
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (product.category == "") {
            setShowAlert("Please select category!");
            handleClickOpenalert()
        } else if (product.productname == "") {
            setShowAlert("Please Enter product name!");
            handleClickOpenalert()
        }
        else if (product.expirydate == "") {
            setShowAlert("Please select expiry Rate!");
            handleClickOpenalert()
        }
        else if (product.companyrate == "") {
            setShowAlert("Please Enter Company Rate!");
            handleClickOpenalert()
        }
        else if (product.dealerrate == "") {
            setShowAlert("Please enter Dealer Rate!");
            handleClickOpenalert()
        }
        else if (product.superstockrate == "") {
            setShowAlert("Please select Super Stocky Rate!");
            handleClickOpenalert()
        } else {
            sendRequest();
        }
    };

    // Number field
    const exceptThisSymbols = ["e", "E", "+", "-", "."];

    return (
        <Box>
            <Headtitle title={'Edit product'} />
            <form>
                {/* header text */}
                <Typography sx={userStyle.HeaderText}>Edit product</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                    <Grid container spacing={2} sx={userStyle.textInput}>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Category <b style={{ color: 'red' }}>*</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Selects
                                        options={categories}
                                        styles={colourStyles}
                                        placeholder={product.category}
                                        onChange={(e) => {
                                            searchSubcatename(e._id);
                                            setProduct({ ...product, category: e.value, productname: e.value + ' ' + product.subcategory })
                                        }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons2}>
                                    <CreatecateMod setFetchCate={setFetchCate} />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Sub category</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={subcategories}
                                    styles={colourStyles}
                                    placeholder={product.subcategory}
                                    onChange={(e) => {
                                        setProduct({ ...product, subcategory: e.value, productname: product.category + ' ' + e.value })
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Product Name <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.productname}
                                    onChange={(e) => {
                                        setProduct({
                                            ...product,
                                            productname: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Company Rate<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={product.companyrate}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setProduct({ ...product, companyrate: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Super Stocky's Rate<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={product.superstockrate}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setProduct({ ...product, superstockrate: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Dealer Rate<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={product.dealerrate}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setProduct({ ...product, dealerrate: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >MRP<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={product.mrp}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setProduct({ ...product, mrp: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <Grid sx={{ display: "flex" }}>
                                <InputLabel htmlFor="component-outlined">SKU <b style={{ color: 'red' }}>*</b></InputLabel>
                                <Grid style={userStyle.spanIcon}>
                                    <Tooltip title='"Unique product id it blank to automatically generate sku.You can modify sku prefix in Business settings.' placement="top" arrow>
                                        <IconButton edge="end" size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.sku}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel >HSN</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={product.hsn}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setProduct({ ...product, hsn: e.target.value }) }}
                                />
                            </FormControl>

                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel >Applicable Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={taxrates}
                                    styles={colourStyles}
                                    placeholder={setngs?.applicabletax}
                                    onChange={(e) => { setProduct({ ...product, applicabletax: e.value, }); }}
                                >
                                </Selects>
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel >Label type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={barcodetypes}
                                    styles={colourStyles}
                                    placeholder={product.labeltype}
                                    onChange={(e) => { setProduct({ ...product, labeltype: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Expiry Date<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    type='date'
                                    value={product.expirydate}
                                    onChange={(e) => { setProduct({ ...product, expirydate: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>

                        {/* color multi select end */}
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Unit</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Selects
                                        options={units}
                                        styles={colourStyles}
                                        placeholder={product?.unit}
                                        onChange={(e) => { setProduct({ ...product, unit: e.unit, }); }}
                                    />
                                </FormControl>
                                <Grid sx={userStyle.spanIcons2}>
                                    <Createunitmod setFetchsaveunit={setFetchsaveunit} />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="outlined-adornment-password">Quantity</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={product.currentstock}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setProduct({ ...product, currentstock: e.target.value }) }}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <FormGroup>
                                <span><FormControlLabel control={<Checkbox checked={product.managestock}
                                    onClick={(e) => { setProduct({ ...product, managestock: !product.managestock }) }} />} label="Manage Stock" />
                                    <Tooltip title="Enable or disable stock management for a product." placement="top" arrow>
                                        <IconButton size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </span>
                            </FormGroup>
                            <Typography variant='body2' style={{ marginTop: "5px" }}>Enable stock management at product level</Typography>
                        </Grid>
                        {product.managestock ? (
                            <>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <InputLabel htmlFor="outlined-adornment-password">Minimum Quantity</InputLabel>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            value={product?.minquantity}
                                            onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                            onChange={(e) => { setProduct({ ...product, minquantity: e.target.value }) }}
                                            type="number"
                                            sx={userStyle.input}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <InputLabel htmlFor="outlined-adornment-password">Maximum Quantity</InputLabel>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            value={product?.maxquantity}
                                            onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                            onChange={(e) => { setProduct({ ...product, maxquantity: e.target.value }) }}
                                            type="number"
                                            sx={userStyle.input}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        ) : (<> </>)}
                       <Grid item lg={4} md={4} sm={6} xs={12}>
                                <InputLabel >Selling Price Tax Type </InputLabel>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={selltaxtype}
                                        styles={colourStyles}
                                        placeholder={product?.sellingpricetax}
                                        onChange={(e) => { setProduct({ ...product, sellingpricetax: e.value }); }}
                                    />
                                </FormControl>
                            </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel sx={{ m: 1 }}>Product Image</InputLabel>
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                {file || capture ? (
                                    <>
                                        <img src={file || capture} style={{ width: '50%' }} height="100px" />
                                    </>
                                ):(<></>)}
                            </Grid><br />
                            <Grid sx={{ display: 'flex' }}>
                                <FormControl size="small" fullWidth>
                                    <Grid sx={{ display: 'flex' }}>
                                        <Button component="label" sx={userStyle.uploadBtn}>
                                            Upload
                                            <input type='file' id="productimage" name='file' hidden onChange={handleChange}
                                            />
                                        </Button>&ensp;
                                        <Button onClick={showWebcam} sx={userStyle.uploadBtn}>Webcam</Button>&ensp;
                                        <Button onClick={resetImage} sx={userStyle.buttoncancel}>Reset</Button>
                                    </Grid>
                                    <Typography variant='body2' style={{ marginTop: "5px" }}>Max File size: 5MB</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                            <InputLabel sx={{ m: 1 }}>Product Description</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={7} style={{ border: '1px solid rgb(0 0 0 / 60%)' }}
                                    value={product.productdescription}
                                    onChange={(e) => { setProduct({ ...product, productdescription: e.target.value }) }}
                                    name="paynotes"
                                />
                            </FormControl>
                        </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/product/product/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>


                            <Button sx={userStyle.buttonadd} type="submit" onClick={handleSubmit}>Update</Button>
                        </Grid>
                    </Grid>
                </Box>
                {/* content end */}
            </form>
            <br /> <br />
            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClosealert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClosealert}>ok</Button>
                    </DialogActions>
                </Dialog>
                {/* webcam alert start */}
                <Dialog
                    open={isWebcamOpen}
                    onClose={webcamClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                        <Webcamimage getImg={getImg} setGetImg={setGetImg} />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="success" onClick={webcamDataStore}>OK</Button>
                        <Button variant="contained" color="error" onClick={webcamClose}>CANCEL</Button>
                    </DialogActions>
                </Dialog>
                {/* webcam alert end */}
            </Box>
        </Box>
    );
}


function Productedit() {
    return (

        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <Producteditlist /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}

export default Productedit;