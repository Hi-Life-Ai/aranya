import React, { useState, useEffect, useContext } from 'react';
import { userStyle, } from '../../PageStyle';
import { Box, Grid, FormControl, Tooltip, InputLabel,OutlinedInput, TextareaAutosize, Typography,FormGroup, FormControlLabel, Checkbox, Button, IconButton } from '@mui/material';
import { FcInfo } from "react-icons/fc";
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';


function Productcreatelist() {

    const { auth } = useContext(AuthContext);

    const id = useParams().id;
    // Text field
    const [product, setProduct] = useState({});

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
    useEffect(() => {
        getProducts()
    }, [])

    return (
        <Box>
            <Headtitle title={'Product View'} />
            <form>
                {/* header text */}
                <Typography sx={userStyle.HeaderText}>View product</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                <Grid container spacing={2} sx={userStyle.textInput}>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Category <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                            <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={product.category}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Sub category</InputLabel>
                            <FormControl size="small" fullWidth>
                            <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={product.subcategory}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Product Name <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={product.productname}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Company Rate<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={product.companyrate}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Super Stocky's Rate<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={product.superstockrate}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Dealer Rate<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={product.dealerrate}
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
                                    id="outlined-adornment-password"
                                    value={product.sku}
                                    sx={userStyle.input}
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
                                />
                            </FormControl>

                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel >Applicable Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={product.applicabletax}
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel >Label type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={product.labeltype}
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Expiry Date<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={product.expirydate}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Unit</InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={product.unit}
                                    sx={userStyle.input}
                                />
                                </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="outlined-adornment-password">Quantity</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={product.currentstock}
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                        <FormGroup>
                                <span><FormControlLabel control={<Checkbox checked={product.managestock} />} label="Manage Stock" />
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
                                        value={product.minquantity}
                                        sx={userStyle.input}
                                    />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <InputLabel htmlFor="outlined-adornment-password">Maximum Quantity</InputLabel>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            value={product.maxquantity}
                                            sx={userStyle.input}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        ) : (<> </>)}
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Selling Price Tax Type </InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={product.sellingpricetax}
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel sx={{ m: 1 }}>Product Image</InputLabel>
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                {product.productimage ? (
                                    <>
                                    <img src={product.productimage} style={{width:'50%'}} height="100px" />  
                                    </>
                                ):(
                                    <></>
                                )}
                            </Grid>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <InputLabel sx={{ m: 1 }}>Product Description</InputLabel>
                            <FormControl size="small" fullWidth>
                                <TextareaAutosize aria-label="minimum height" minRows={7} style={{ border: '1px solid rgb(0 0 0 / 60%)' }}
                                    value={product.productdescription}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/product/product/list"><Button sx={userStyle.buttoncancel}>Back</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
                {/* content end */}
            </form>
            <br /> <br />
            {/* ALERT DIALOG */}

        </Box>
    );
}


function Productcreate() {
    return (

        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <Productcreatelist /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}

export default Productcreate;