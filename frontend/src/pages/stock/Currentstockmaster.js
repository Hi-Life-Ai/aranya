import React, { useState, useEffect, useContext } from 'react';
import { userStyle, colourStyles } from '../PageStyle';
import { Box, Grid, FormControl, InputLabel, Dialog, DialogContent, DialogActions, OutlinedInput, Typography, Button } from '@mui/material';
import Selects from "react-select";
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../services/Baseservice';
import { AuthContext } from '../../context/Appcontext';
import Headtitle from '../../components/header/Headtitle';

function Currentstockmastercreate() {

    const { auth } = useContext(AuthContext);

    // Text field
    const [current, setCurrent] = useState({ productname: "", currentstock: "" });
    const [products, setProducts] = useState();
    const [sum, setSum] = useState("");

    // Empty ALERT POPUP
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenalert = () => { setIsErrorOpen(true); };
    const handleClosealert = () => { setIsErrorOpen(false); };

    // Submit popup
    const [isAddCurrent, setIsAddCurrent] = useState(false);
    const handleClickOpenCurrent = () => {

        if (current.productname == "") {
            setShowAlert("Please select Products!");
            handleClickOpenalert()
        }
        else if (current.currentstock == "" || 0) {
            setShowAlert("Please enter quantity!");
            handleClickOpenalert()
        }
        else {
            setIsAddCurrent(true);
        }
    };
    const handleCloseCurrent = () => {
        setIsAddCurrent(false);
        setCurrent({ productname: "", currentstock: "" })
    };

    // Categorys
    const fetchProducts = async () => {
        try {
            let response = await axios.get(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setProducts(
                response?.data?.products?.map((d) => ({
                    ...d,
                    label: d.productname,
                    value: d.sku,
                }))
            );
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };
    useEffect(() => { fetchProducts() }, [])

    const sendRequest = () => {
        products.map((data) => {
            if (data.sku == sum) {
                axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    currentstock: Number(data.currentstock) + Number(current.currentstock)
                });
                handleCloseCurrent();
                toast.success("Updated Successfully", {
                    position: toast.POSITION.TOP_CENTER
                  });
            }
        })
    }

    return (
        <Box>
            <Headtitle title={'Current Stock Master'} />
            <form>
                {/* header text */}
                <Typography sx={userStyle.HeaderText}>Current Stock Master</Typography>
                {/* content start */}
                <Box sx={userStyle.container}>
                    <Grid container spacing={2} sx={userStyle.textInput}>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Products <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={products}
                                    styles={colourStyles}
                                    placeholder='Products'
                                    onChange={(e) => { setCurrent({ ...current, productname: e.productname, }); setSum(e.sku); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Current Stock <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    type='number'
                                    id="component-outlined"
                                    value={current.currentstock}
                                    onChange={(e) => { setCurrent({ ...current, currentstock: e.target.value, }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={1} md={1} sm={6} xs={12}>
                            <Grid sx={{ marginTop: '20px', display: 'left' }}>
                                <Button sx={userStyle.buttonadd} onClick={handleClickOpenCurrent}>Save</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br />
                </Box>
                {/* content end */}
            </form>

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
            </Box>

            <Box>
                <Dialog
                    open={isAddCurrent}
                    onClose={handleCloseCurrent}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCurrent} variant="outlined">Cancel</Button>
                        <Button onClick={sendRequest} autoFocus variant="contained" color='error' type='submit'> OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}


function Currentstockmaster() {
    return (

        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <Currentstockmastercreate /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}

export default Currentstockmaster;