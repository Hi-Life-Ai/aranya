import React, { useState, useEffect, useContext } from 'react';
import { userStyle, } from '../../PageStyle';
import { Box, Grid, FormControl, Tooltip, InputLabel,OutlinedInput, TextareaAutosize, Typography, TextField, FormGroup, FormControlLabel, Checkbox, Button, IconButton } from '@mui/material';
import { FcInfo } from "react-icons/fc";
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';


function Productcreatelist() {

    const { auth } = useContext(AuthContext);

    const id = useParams().id;
    // Text field
    const [product, setProduct] = useState({});
    const backLPage = useNavigate();

    const getProducts = async () => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            setProduct(res.data.sproduct);
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
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
                            <Grid sx={{ display: 'flex' }}>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        value={product.category}

                                    />
                                </FormControl>
                            </Grid>

                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Sub category</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
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
                            <InputLabel htmlFor="component-outlined" >MRP<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    type='number'
                                    id="component-outlined"
                                    value={product.mrp}
                                    sx={userStyle.input}
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
                                    value={product.hsn}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <InputLabel >Label type</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={product.labeltype}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Expiry Date<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    type='date'
                                    value={product.expirydate}
                                />
                            </FormControl>
                        </Grid>

                        {/* color multi select end */}
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel >Unit</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <OutlinedInput
                                        value={product.unit}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="outlined-adornment-password">Quantity</InputLabel>
                            <FormControl variant="outlined" size="small" fullWidth>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    value={product.currentstock}
                                    type="number"
                                    sx={userStyle.input}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={6} xs={12}>
                            <FormGroup>
                                <span><FormControlLabel control={<Checkbox checked={Boolean(product.managestock)}/>} label="Manage Stock" />
                                    <Tooltip title="Enable or disable stock management for a product." placement="top" arrow>
                                        <IconButton size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </span>
                            </FormGroup>
                            <Typography variant='body2' style={{ marginTop: "5px" }}>Enable stock management at product level</Typography>
                        </Grid>
                            <>
                                <Grid item lg={3} md={3} sm={6} xs={12}>
                                    <InputLabel htmlFor="outlined-adornment-password">Minimum Quantity</InputLabel>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            value={product?.minquantity}
                                            type="number"
                                            sx={userStyle.input}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} sm={6} xs={12}>
                                    <InputLabel htmlFor="outlined-adornment-password">Maximum Quantity</InputLabel>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            value={product?.maxquantity}
                                            type="number"
                                            sx={userStyle.input}
                                        />
                                    </FormControl>
                                </Grid>
                            </>
                        <Grid item lg={9} md={9} sm={8} xs={12}>
                            <InputLabel  sx={{ m: 1 }}>Product Description</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={7} style={{ border: '1px solid rgb(0 0 0 / 60%)' }}
                                    value={product.productdescription}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={3} md={3} sm={4} xs={12}>
                            <InputLabel sx={{ m: 1 }}>Product Image</InputLabel>
                            <img src={product.productimage} alt="image" width="70px" height="70px" />
                        </Grid>
                    </Grid><br />
                    <Grid container spacing={2}>
                        <Grid item md={4} sm={4} xs={12}>
                            <InputLabel >HSN code</InputLabel>
                            <FormControl size="small" fullWidth>
                                <TextField
                                    id="date"
                                    type="text"
                                    size='small'
                                    value={product.hsncode}
                                />
                            </FormControl>
                        </Grid>
                        {/* : */}
                        <Grid item md={4} sm={4} xs={12}>
                            <InputLabel >Applicable Tax</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={product?.applicabletax}
                                />

                            </FormControl>
                        </Grid>

                        <Grid item md={4} sm={4} xs={12}>
                            <InputLabel >Selling Price Tax Type </InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={product?.sellingpricetax}
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