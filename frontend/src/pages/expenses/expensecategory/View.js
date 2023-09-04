import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle'

function Expensecategoryviewlist() {

    const [expenseCategoryForm, setExpenseCategoryForm] = useState({});
    const { auth, } = useContext(AuthContext);

    const id = useParams().id

    //  Expense category
    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.EXPENSE_CATEGORY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setExpenseCategoryForm(response.data.sexcategory);
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
        fetchHandler();
    }, [id]);



    return (
        <Box>
            <Headtitle title={'View Expense Category'} />
            <Typography sx={userStyle.HeaderText}> View Expense Category </Typography>
            <form >
                <Box sx={userStyle.container}>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Category name <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={expenseCategoryForm.categoryname}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Category Code<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={expenseCategoryForm.categorycode}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/expense/expensecategory/list"><Button sx={userStyle.buttoncancel}>back</Button></Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </form>
            {/* ALERT DIALOG */}
        </Box>
    );
}

const Expensecategoryview = () => {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Expensecategoryviewlist /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}
export default Expensecategoryview;