import React, { useState, useEffect, useContext } from 'react';
import { Button, Typography, FormGroup, FormControlLabel, Checkbox, Select, Grid, Tooltip, IconButton, InputLabel, FormControl, Box, MenuItem, TextField, OutlinedInput, TextareaAutosize, Dialog, DialogContent, DialogActions } from '@mui/material';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { userStyle, colourStyles } from '../../PageStyle';
import { FcInfo } from "react-icons/fc";
import axios from 'axios';
import { toast } from 'react-toastify';
import Selects from 'react-select';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Createdepartmentmod from './Createdepartment';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

function Usereditlist() {

    const [file, setFile] = useState();
    const { auth, setngs } = useContext(AuthContext);
    const [fetchsavedepartment, setFetchsavedepartment] = useState("");
    const [rolevalue, setRolevalue] = useState();
    const [departmentnames, setDepartmentnames] = useState();
    const [isPasswordchange, setIsPasswordchange] = useState(false);
   
    const [datevalue, setDateValue] = useState(dayjs());

    const handleChange = (newValue) => {
        setDateValue(newValue);
    };

    const [useradd, setUseradd] = useState({
        entrynumber: "", date: "", department: "", role: "", counter: "", userid: "", dateofjoin: "",
        staffname: "", fathername: "", gender: "", bloodgroup: "", dateofbirth: "", nationality: "", address: "",
        areacity: "", pincode: "", phonenum: "", otherphonenum: "", useractive: "", email: "", password: "", maritalstatus: "",
        familydetails: "", profileimage: "", educationdetails: "", experiencedetails: "", jobdetails: "", languageknown: "",
    });

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    // For Role as designation
    const fetchRole = async () => {
        try {
            let req = await axios.get(`${SERVICE.ROLE}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = req.data.roles.filter((data, index)=>{
                return data.rolename != 'Admin' && data.assignbusinessid == setngs.businessid
            })
            setRolevalue(result?.map((d) => ({
                ...d,
                label: d.rolename,
                value: d.rolename,
            })))
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    // For Department
    const fetchDepartment = async () => {
        try {
            let req = await axios.get(`${SERVICE.DEPARTMENT}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = req.data.departments.filter((data, index)=>{
                return data.assignbusinessid == setngs.businessid
            })
            setDepartmentnames(
                result?.map((d) => ({
                    ...d,
                    label: d.departmentname,
                    value: d.departmentname,
                })))
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    useEffect(() => {
        fetchRole();
    }, [])

    useEffect(() => {
        fetchDepartment();
    }, [fetchsavedepartment])


    const handleMobile = (e) => {
        if (e.length > 10) {
            setShowAlert("Mobile number can't have more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setUseradd({ ...useradd, phonenum: num })
        }
    }

    const handleAadhaar = (e) => {
        var a = e.target.value;
        if (a.length > 12) {
            setShowAlert("Aadhaar number can't have more than 12 characters!")
            handleClickOpen();
            let num = a.slice(0, 12);
            setUseradd({ ...useradd, aadharnumber: num })
        }
    }

    const handlePincode = (e) => {
        if (e.length > 6) {
            setShowAlert("Pincode can't have more than 6 characters!")
            handleClickOpen();
            let num = e.slice(0, 6);
            setUseradd({ ...useradd, pincode: num })
        }
    }
    const handleAlter = (e) => {
        if (e.length > 10) {
            setShowAlert("Phone number can't have more than 10 characters!")
            handleClickOpen();
            let num = e.slice(0, 10);
            setUseradd({ ...useradd, otherphonenum: num })
        }
    }

    const id = useParams().id

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.USER_SINGLE}/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                })
                setUseradd(response.data.suser);
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    useEffect(() => {
        fetchHandler();
    }, [id]);

    const backPage = useNavigate();

    // update user with password
    const updateUser = async () => {
        try {
            let res = await axios.put(`${SERVICE.USER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                entrynumber: Number(useradd.entrynumber),
                date: String(useradd.date),
                businesslocation: [...useradd.businesslocation],
                department: String(useradd.department),
                role: String(useradd.role),
                counter: String(useradd.counter),
                userid: String(useradd.userid),
                dateofjoin: String(useradd.dateofjoin),
                staffname: String(useradd.staffname),
                fathername: String(useradd.fathername),
                gender: String(useradd.gender),
                bloodgroup: String(useradd.bloodgroup),
                dateofbirth: String(useradd.dateofbirth),
                nationality: String(useradd.nationality),
                address: String(useradd.address),
                areacity: String(useradd.areacity),
                pincode: Number(useradd.pincode),
                phonenum: Number(useradd.phonenum),
                otherphonenum: Number(useradd.otherphonenum),
                useractive: Boolean(useradd.useractive),
                email: String(useradd.email),
                password: String(useradd.password),
                maritalstatus: String(useradd.maritalstatus),
                familydetails: String(useradd.familydetails),
                profileimage: String(useradd.profileimage),
                educationdetails: String(useradd.educationdetails),
                experiencedetails: String(useradd.experiencedetails),
                jobdetails: String(useradd.jobdetails),
                languageknown: String(useradd.languageknown),
                aadharnumber: Number(useradd.aadharnumber),
                accnumber: Number(useradd.accnumber),
                remarks: String(useradd.remarks),
                country: String(useradd.nationality),
                termscondition: Boolean(false),
                assignbusinessid:String(useradd.assignbusinessid),
                state: String(""),
                companyname: String(""),
            });
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backPage('/user/user/list');
        }
        catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    // update user without password
    const updateUserPW = async () => {
        try {
            let res = await axios.put(`${SERVICE.USER_SINGLEPW}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                entrynumber: Number(useradd.entrynumber),
                date: String(useradd.date),
                businesslocation: [...useradd.businesslocation],
                department: String(useradd.department),
                role: String(useradd.role),
                counter: String(useradd.counter),
                userid: String(useradd.userid),
                dateofjoin: String(useradd.dateofjoin),
                staffname: String(useradd.staffname),
                fathername: String(useradd.fathername),
                gender: String(useradd.gender),
                bloodgroup: String(useradd.bloodgroup),
                dateofbirth: String(useradd.dateofbirth),
                nationality: String(useradd.nationality),
                address: String(useradd.address),
                areacity: String(useradd.areacity),
                pincode: Number(useradd.pincode),
                phonenum: Number(useradd.phonenum),
                otherphonenum: Number(useradd.otherphonenum),
                useractive: Boolean(useradd.useractive),
                email: String(useradd.email),
                maritalstatus: String(useradd.maritalstatus),
                familydetails: String(useradd.familydetails),
                profileimage: String(useradd.profileimage),
                educationdetails: String(useradd.educationdetails),
                experiencedetails: String(useradd.experiencedetails),
                jobdetails: String(useradd.jobdetails),
                languageknown: String(useradd.languageknown),
                aadharnumber: Number(useradd.aadharnumber),
                accnumber: Number(useradd.accnumber),
                remarks: String(useradd.remarks),
                country: String(useradd.nationality),
                termscondition: Boolean(false),
                assignbusinessid:String(useradd.assignbusinessid),
                state: String(""),
                companyname: String(""),
            });
            toast.success(res.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backPage('/user/user/list');
        }
        catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
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

    // Image Upload
    function handleUploadimage(e) {
        let profileimage = document.getElementById("profileimage");
        var path = (window.URL || window.webkitURL).createObjectURL(profileimage.files[0]);
        toDataURL(path, function (dataUrl) {
            profileimage.setAttribute('value', String(dataUrl));
            setUseradd({ ...useradd, profileimage: String(dataUrl) })
            return dataUrl;
        })
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (useradd.staffname == "") {
            setShowAlert("Please enter staff name!")
            handleClickOpen();
        }
        else if (useradd.fathername == "") {
            setShowAlert("Please enter father name!")
            handleClickOpen();
        }
        else if (useradd.role == "") {
            setShowAlert("Please enter role!")
            handleClickOpen();
        }
        else if (useradd.phonenum == "") {
            setShowAlert("Please enter mobile!")
            handleClickOpen();
        }
        else if (useradd.email == "") {
            setShowAlert("Please enter email!")
            handleClickOpen();
        }else if(!useradd.email.includes('@' || '.')){
            setShowAlert('Please enter correct email!')
            handleClickOpen();
        }
        else if (useradd.password == "") {
            setShowAlert("Please enter password!")
            handleClickOpen();
        }
        else if(isPasswordchange){
            updateUser();
        }else{
            updateUserPW();
        }
    }

    var regex = /[`+!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    const handleValidationStaff = (e) => {
        var regexstaff = /[`+!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        if (e.target.value.match(numbers)) {
            setShowAlert("Please Enter Letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setUseradd({ ...useradd, staffname: value })
        }
        else if (regexstaff.test(e.target.value)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setUseradd({ ...useradd, staffname: value })
        }
    }

    const handleValidationfName = (e) => {
        var regexstaff = /[`+!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')

        if (e.target.value.match(numbers)) {
            setShowAlert("Please Enter Letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setUseradd({ ...useradd, fathername: value })
        }
        else if (regexstaff.test(e.target.value)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setUseradd({ ...useradd, fathername: value })
        }
    }

    const handleValidationNationality = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        if (e.target.value.match(numbers)) {
            setShowAlert("Please Enter Letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setUseradd({ ...useradd, nationality: value })
        }
        else if (regex.test(e.target.value)) {
            setShowAlert("Please enter letter only! (a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setUseradd({ ...useradd, nationality: value })
        }
    }
    
    const handleValidationSalescommision = (e) => {
        let val = e.target.value;
        let alphabets = new RegExp('[a-zA-Z]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(alphabets)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setUseradd({ ...useradd, salescommission: value })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setUseradd({ ...useradd, salescommission: value })
        }
    }

    // Number field
    const exceptThisSymbols = ["e", "E", "+", "-", "."];

    return (
        <Box>
            <Headtitle title={'User Edit'} />
            <Typography sx={userStyle.HeaderText}>Edit User</Typography>
            <Box sx={userStyle.container}>
                <form onSubmit={handleSubmit}>
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
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        value={useradd.date}
                                        defaultValue={datevalue}
                                        onChange={handleChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >User ID<b style={{ color: "red" }}>*</b></InputLabel>
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
                                    onChange={(e) => { setUseradd({ ...useradd, staffname: e.target.value }); handleValidationStaff(e) }}
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
                                    onChange={(e) => { setUseradd({ ...useradd, fathername: e.target.value }); handleValidationfName(e) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Business Location</InputLabel>
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
                            <Grid sx={{display:'flex'}}>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={departmentnames}
                                    value={{ value: useradd.department, label: useradd.department }}
                                    styles={colourStyles}
                                    onChange={(e) => { setUseradd({ ...useradd, department: e.departmentname }) }}
                                >
                                </Selects>
                            </FormControl>
                            <Grid sx={userStyle.spanIcons2}>
                                <Createdepartmentmod  setFetchsavedepartment={setFetchsavedepartment}/>
                            </Grid>
                            <Grid sx={{'& .MuiIconButton-root': {marginTop: '7px'}}}>
                                    <Tooltip title="You can add departments through the plus icon" placement="top" arrow>
                                        <IconButton size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Role <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={rolevalue}
                                    styles={colourStyles}
                                    value={{ value: useradd.role, label: useradd.role }}
                                    onChange={(e) => { setUseradd({ ...useradd, role: e.rolename }) }}
                                >
                                </Selects>
                            </FormControl>
                        </Grid>
                        { useradd.role == "Salesman" ? 
                        <>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Sales Commission (%)</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={useradd.salescommission}
                                    onChange={(e) => { setUseradd({ ...useradd, salescommission: e.target.value }); handleValidationSalescommision(e); }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        </> : ""}
                        <Grid item xs={12} sm={6} md={4} lg={4} sx={{ '& .MuiFormControlLabel-root': { marginTop: '20px !important' }, '& .MuiIconButton-root': {marginTop: '20px'} }}>
                            <FormGroup>
                                <span>
                                <FormControlLabel control={<Checkbox checked={Boolean(useradd.useractive)} onChange={(e) => setUseradd({ ...useradd, useractive: !useradd.useractive })} />} label="User Active" />
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
                                    value={useradd.dateofjoin}
                                    onChange={(e) => { setUseradd({ ...useradd, dateofjoin: e.target.value }) }}
                                    type="date"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Gender</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    value={useradd.gender}
                                    onChange={(e) => { setUseradd({ ...useradd, gender: e.target.value }); }}
                                >
                                    <MenuItem value={'Male'}>Male</MenuItem>
                                    <MenuItem value={'Female'}>Female</MenuItem>
                                    <MenuItem value={'Others'}>Others</MenuItem>
                                </Select>
                            </FormControl><br></br>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Blood Group</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.bloodgroup}
                                    onChange={(e) => { setUseradd({ ...useradd, bloodgroup: e.target.value }) }}
                                    type="text"

                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Date of Birth</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.dateofbirth}
                                    onChange={(e) => { setUseradd({ ...useradd, dateofbirth: e.target.value }) }}
                                    type="date"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Nationality</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.nationality}
                                    onChange={(e) => { setUseradd({ ...useradd, nationality: e.target.value }); handleValidationNationality(e) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Address</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput aria-label="minimum height"
                                    value={useradd.address}
                                    onChange={(e) => { setUseradd({ ...useradd, address: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Area/city</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.areacity}
                                    onChange={(e) => { setUseradd({ ...useradd, areacity: e.target.value }) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Pincode</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.pincode}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setUseradd({ ...useradd, pincode: e.target.value }); handlePincode(e.target.value) }}
                                    type="number"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Mobile <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.phonenum}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setUseradd({ ...useradd, phonenum: e.target.value }); handleMobile(e.target.value) }}
                                    type="number"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Other Contact Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.otherphonenum}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setUseradd({ ...useradd, otherphonenum: e.target.value }); handleAlter(e.target.value) }}
                                    type="number"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Email <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.email}
                                    onChange={(e) => { setUseradd({ ...useradd, email: e.target.value }) }}
                                    type="email"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Password <b style={{ color: "red" }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.password}
                                    onChange={(e) => { setUseradd({ ...useradd, password: e.target.value }); setIsPasswordchange(true); }}
                                    type="password"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Marital Status</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Select
                                    value={useradd.maritalstatus}
                                    onChange={(e) => { setUseradd({ ...useradd, maritalstatus: e.target.value }) }}
                                >
                                    <MenuItem value={'Married'}>Married</MenuItem>
                                    <MenuItem value={'Unmarried'}>Unmarried</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Family Details</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.familydetails}
                                    onChange={(e) => { setUseradd({ ...useradd, familydetails: e.target.value }) }}
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
                                    onChange={(e) => { setUseradd({ ...useradd, educationdetails: e.target.value }) }}
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
                                    onChange={(e) => { setUseradd({ ...useradd, experiencedetails: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Job Details</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    type="text"
                                    value={useradd.jobdetails}
                                    onChange={(e) => { setUseradd({ ...useradd, jobdetails: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Language Known</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    type="text"
                                    value={useradd.languageknown}
                                    onChange={(e) => { setUseradd({ ...useradd, languageknown: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Aadhaar Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.aadharnumber}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setUseradd({ ...useradd, aadharnumber: e.target.value }); handleAadhaar(e) }}
                                    type="number"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <InputLabel >Bank A/C Number</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    value={useradd.accnumber}
                                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                    onChange={(e) => { setUseradd({ ...useradd, accnumber: e.target.value }) }}
                                    type="number"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel sx={{ m: 1 }}>Profile Image</InputLabel>
                            <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                            {useradd.profileimage || file ? (
                                    <>
                                    <img src={file ? file : useradd.profileimage} style={{ width: '30%' }} alt="Profile Image" />
                                    </>
                                ):(
                                    <></>
                                )}
                            </Grid>
                            <Grid sx={{ display: 'flex', justifyContent: "center" }}>
                                <Button component="label" sx={userStyle.buttonadd} size={"small"}>
                                    Upload
                                    <input type='file' id="profileimage" name='file' hidden onChange={handleUploadimage} />
                                </Button>
                                <Button component="label" sx={userStyle.buttoncancel} size={"small"} onClick={(e) => {setUseradd({...useradd, profileimage: ""});setFile("")}}>
                                    Reset
                                </Button>
                            </Grid> <br />
                            <Typography variant='body2' style={{ marginTop: "5px" }} align="left">Max File size: 5MB</Typography>
                            <Typography variant='body2' style={{ marginTop: "5px" }} align="left">Allowed File: .jpeg, .jpg, .png</Typography>

                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                            <InputLabel >Remarks</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={10} mincol={5} style={{ border: '1px solid rgb(0 0 0 / 60%)' }}
                                    value={useradd.remarks}
                                    onChange={(e) => { setUseradd({ ...useradd, remarks: e.target.value }) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}></Grid>
                        <Grid container sx={userStyle.gridcontainer}>
                            <Grid >
                                <Link to="/user/user/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                                <Button sx={userStyle.buttonadd} type="submit" >UPDATE</Button>

                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Box>
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
                        <Button variant="contained" color="error" onClick={handleClose} >ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

function Useredit() {
    return (
        <Box >
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <Usereditlist /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}

export default Useredit;