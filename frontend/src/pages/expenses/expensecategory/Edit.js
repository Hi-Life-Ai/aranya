import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Typography, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle'

function Expensecategoryeditlist() {

    const [expenseCategoryForm, setExpenseCategoryForm] = useState({});
    const { auth, setngs } = useContext(AuthContext);
    const backLPage = useNavigate();
    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const sendRequest = async () => {
        try {
            let expensecateedit = await axios.put(`${SERVICE.EXPENSE_CATEGORY_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: String(expenseCategoryForm.categoryname),
                categorycode: String(expenseCategoryForm.categorycode),
            });
            setExpenseCategoryForm(expensecateedit.data);
            toast.success(expensecateedit.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/expense/expensecategory/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

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

    const editExpCateSubmit = (e) => {
        e.preventDefault();
        if (expenseCategoryForm.categoryname == "") {
            setShowAlert("Please enter categoty name!");
            handleClickOpen();
        } else if (expenseCategoryForm.categorycode == "") {
            setShowAlert("Please enter categoty code!");
            handleClickOpen();
        } else {
            sendRequest();
        }
    }

    return (
        <Box>
            <Headtitle title={'View Expense Category'} />
            <Typography sx={userStyle.HeaderText}> Edit Expense Category </Typography>
            <form onSubmit={editExpCateSubmit}>
                <Box sx={userStyle.container}>
                    <Grid container spacing={2}>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Category name <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={expenseCategoryForm.categoryname}
                                    onChange={(e) => { setExpenseCategoryForm({ ...expenseCategoryForm, categoryname: e.target.value }) }}
                                    type="text"
                                    name="categoryname"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={6} sm={12} xs={12}>
                            <InputLabel htmlFor="component-outlined">Category Code<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={expenseCategoryForm.categorycode}
                                    type="text"
                                    name="categorycode"
                                />
                            </FormControl>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/expense/expensecategory/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                                <Button sx={userStyle.buttonadd} type='submit'>UPDATE</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </form>
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

const Expensecategoryedit = () => {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Expensecategoryeditlist /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}
export default Expensecategoryedit;