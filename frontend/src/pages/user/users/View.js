import React, { useState, useEffect, useContext } from 'react';
import { Button, Typography, FormGroup, FormControlLabel, Checkbox, Grid,Tooltip, IconButton, InputLabel, FormControl, Box, OutlinedInput, TextareaAutosize } from '@mui/material';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { FcInfo } from "react-icons/fc";
import { useParams } from 'react-router-dom';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { Link } from 'react-router-dom';
import moment from 'moment';

function Userviewlist() {

    const { auth, setngs } = useContext(AuthContext);
    const [useradd, setUseradd] = useState({});

    const id = useParams().id

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.USER_SINGLE}/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
            });
            setUseradd(response.data.suser);
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
        fetchHandler();
    }, [id]);

    let dateval = useradd.date ? moment(useradd.date).format("DD-MM-YYYY") : "";
    let dob = useradd.dateofbirth ? moment(useradd.dateofbirth).format("DD-MM-YYYY") : "";
    let doj = useradd.dateofjoin ? moment(useradd.dateofjoin).format("DD-MM-YYYY") : "";

    return (
        <Box>
            <Headtitle title={'User View'} />
            <Typography sx={userStyle.HeaderText}>View User</Typography>
            <Box sx={userStyle.container}>
                <form>
                    <Grid container spacing={2} sx={{
                        padding: '40px 20px'
                    }}>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Entry Number <b style={{ color: "red" }}>*</b></InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        value={useradd.entrynumber}
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                            <Typography variant="caption">Leave blank to auto generate</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Date</InputLabel>
                            <FormControl size="small" fullWidth>
                            <OutlinedInput
                                    sx={userStyle.input}
                                    value={dateval}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >User ID <b style={{ color: "red" }}>*</b></InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        value={useradd.userid}
                                        type="text"
                                    />
                                </FormControl>
                            </Grid>
                            <Typography variant="caption">Leave blank to auto generate</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Staff Name <b style={{ color: "red" }}>*</b> </InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.staffname}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Father's Name <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.fathername}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel>Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                            <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.businesslocation + ", "}
                                    type="text"
                                />
                                </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Department</InputLabel>
                            <FormControl size="small" fullWidth>
                            <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.department}
                                    type="text"
                                />
                                </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Role <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                            <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.role}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        { useradd.role == "Salesman" ? 
                        <>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Sales Commission (%)</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={useradd.salescommission}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        </> : ""}
                        <Grid item xs={12} sm={6} md={4} lg={4} sx={{ '& .MuiFormControlLabel-root': { marginTop: '20px !important' }, '& .MuiIconButton-root': {marginTop: '20px'} }}>
                            <FormGroup>
                                <span>
                                    <FormControlLabel  control={<Checkbox checked={useradd.useractive}  />} label="User Active" />
                                    <Tooltip arrow title="Active users only login!">
                                        <IconButton size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </span>
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Date of Join</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={doj}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Gender</InputLabel>
                            <FormControl size="small" fullWidth>
                            <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.gender}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Blood Group</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.bloodgroup}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Date of Birth</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.dob}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Nationality</InputLabel>
                            <FormControl size="small" fullWidth>
                            <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.nationality}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Address</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput aria-label="minimum height"
                                    value={useradd.address}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Area/city</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.areacity}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Pincode</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.pincode}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Mobile <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.phonenum}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Other Contact Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.otherphonenum}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Email <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.email}
                                    type="email"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Marital Status</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.maritalstatus}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Family Details</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.familydetails}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Education Details</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.educationdetails}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Experience Details</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    type="text"
                                    value={useradd.experiencedetails}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Job Details</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    type="text"
                                    value={useradd.jobdetails}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Language Known</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    type="text"
                                    value={useradd.languageknown}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Aadhaar Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.aadharnumber}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Bank A/C Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.accnumber}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                                {useradd.profileimage ? (
                                    <>
                                    <img src={useradd.profileimage} style={{ width: '30%' }} alt="Profile Image" />
                                    </>
                                ):(
                                    <></>
                                )}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                            <InputLabel >Remarks</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={10} mincol={5} style={{ border: '1px solid rgb(0 0 0 / 60%)' }}
                                    value={useradd.remarks}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/user/user/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Box>
    );
}

function Userview() {
    return (
        <Box >
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <Userviewlist /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}

export default Userview;