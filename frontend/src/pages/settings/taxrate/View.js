import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Typography, Button, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { AuthContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';

const Viewpage = () => {

    const { auth } = useContext(AuthContext);

    const [taxRate, setTaxRate] = useState({
        taxname: "", taxrategst: 0, taxratecgst: 0, taxrateigst: 0, taxtotal: 0,
    });

    const id = useParams().id;

    // Get Datas
    const fetchHandler = async () => {
        try {
            let req = await axios.get(`${SERVICE.TAXRATE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setTaxRate(req.data.staxrate);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }

        }
    };

    useEffect(() => {
        fetchHandler()
    }, [id]);


    return (
        <Box>
            <Headtitle title={'Taxrate View'} />
            <form>
                <Typography sx={userStyle.HeaderText}>View Tax Rate </Typography>
                <Box sx={userStyle.container}>
                    <Box sx={{ '& .MuiTextField-root': { maxWidth: '100%', minWidth: '100%', width: '400px' }, '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7', }, }} noValidate autoComplete="off">
                        <Grid container spacing={2}>
                            <Grid item sm={5} md={5}>
                                <InputLabel htmlFor="component-outlined" > Name <b style={{ color: "red" }}> *</b></InputLabel>
                                <FormControl size="small" fullWidth >
                                    <OutlinedInput
                                        value={taxRate.taxname}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item sm={3} md={3}>
                                <InputLabel htmlFor="component-outlined" >GST %</InputLabel>
                                <FormControl size="small" fullWidth >
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        value={taxRate.taxrategst}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={3} md={3}>
                                <InputLabel htmlFor="component-outlined" >CGST %</InputLabel>
                                <FormControl size="small" fullWidth >
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        value={taxRate.taxratecgst}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={3} md={3}>
                                <InputLabel htmlFor="component-outlined" >IGST %</InputLabel>
                                <FormControl size="small" fullWidth >
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        value={taxRate.taxrateigst}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={3} md={3}>
                                <InputLabel htmlFor="component-outlined" >Total %</InputLabel>
                                <FormControl size="small" fullWidth >
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        value={taxRate.taxtotal}
                                        readOnly
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                    </Box>
                </Box>
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid >
                        <Link to={"/settings/taxrate/list"} ><Button sx={userStyle.buttoncancel} >Back</Button></Link>
                    </Grid>
                </Grid>
            </form>
            {/* ALERT DIALOG */}
        </Box>
    );
}

const Taxrateview = () => {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Viewpage /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Taxrateview;