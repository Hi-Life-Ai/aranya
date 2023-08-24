import React, { useState, useContext, useEffect } from 'react';
import { Box, Grid, Typography, FormControl, InputLabel, OutlinedInput, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';

function Expensecategoryadd() {

    const [expenseCategoryForm, setExpenseCategoryForm] = useState({
        categoryname: "", categorycode: "",
    });
    const { auth, setngs } = useContext(AuthContext);
    const [isExcatCode, setIsExcatCode] = useState([]);
    const [isExcatName, setIsExcatName] = useState([]);
    let backPage = useNavigate();
    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    //Store expense category data
    const sendRequest = async () => {
        try {
            let EXPENSECATE_REQ = await axios.post(SERVICE.EXPENSE_CATEGORY_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: String(expenseCategoryForm.categoryname),
                categorycode: String(expenseCategoryForm.categorycode),
                assignbusinessid: String(setngs.businessid),
            });
            toast.success(EXPENSECATE_REQ.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backPage("/expense/expensecategory/list")
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                setShowAlert(messages);
                handleClickOpen();
            }else{
                setShowAlert("Something went wrong!");
                handleClickOpen();
            }
        }
    };
    
    const fetchDataName = async () => {
        try {
            let res = await axios.get(SERVICE.EXPENSE_CATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = res.data.excategorys.filter((data, index) => {
                    return data.assignbusinessid == setngs.businessid
                
            })
            let excode = result.map((data,index)=>{
                return data.categorycode
              })
          
              let exname = result.map((data,index)=>{
                return data.categoryname
              })
              setIsExcatCode(excode);
              setIsExcatName(exname);
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
        fetchDataName()
    }, [])

    const addExpCateSubmit = (e) => {
        e.preventDefault();
        if (expenseCategoryForm.categoryname == "") {
            setShowAlert("Please enter categoty name!");
            handleClickOpen();
        }
        else if (expenseCategoryForm.categorycode == "") {
            setShowAlert("Please enter categoty code!");
            handleClickOpen();
        }
        else if (isExcatName.includes(expenseCategoryForm.categoryname)) {
            setShowAlert("Name Already Exists");
            handleClickOpen();
        }
        else if (isExcatCode.includes(expenseCategoryForm.categorycode)) {
            setShowAlert("ID Already Exists");
            handleClickOpen();
        }
        else {
            sendRequest();
        }
    }

    return (
        <Box>
            <form onSubmit={addExpCateSubmit}>
                <Typography sx={userStyle.HeaderText}>Add Expense Category</Typography>
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
                                    onChange={(e) => { setExpenseCategoryForm({ ...expenseCategoryForm, categorycode: e.target.value }) }}
                                    type="text"
                                    name="categorycode"
                                />
                            </FormControl>
                        </Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/expense/expensecategory/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                                <Button sx={userStyle.buttonadd} type='submit'>SAVE</Button>
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

const ExpenseCategorycreate = () => {
    return (
        <>
            <Box >
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Expensecategoryadd /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default ExpenseCategorycreate;