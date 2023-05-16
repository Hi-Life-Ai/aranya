import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Select, MenuItem, TextField, TextareaAutosize, Typography, FormGroup, FormControlLabel, Checkbox, Button, Tooltip, IconButton, Dialog, DialogContent, DialogActions } from '@mui/material';
import { FcInfo } from "react-icons/fc";
import { FaInfo } from "react-icons/fa";
import { colourStyles, userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CreateCatMod from './Categorucreate';
import Selects from "react-select";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Headtitle from '../../../components/header/Headtitle';

const Expesecreatelist = () => {

    const { auth, setngs } = useContext(AuthContext);
    const { isUserRoleAccess } = useContext(UserRoleAccessContext);
    const [excategorys, setExcategorys] = useState();
    const [busilocations, setBusilocations] = useState();
    const [taxrates, setTaxrates] = useState();
    //set change expense category
    const [saveExpcate, setSaveExpcate] = useState();
    // expense date
    const [expenseDateTime, setExpenseDateTime] = useState(dayjs());
    const [paidonDateTime, setPaidonDateTime] = useState(dayjs());
    const [locationData, setLocationData] = useState([])

    const [expenseAdd, setExpenseAdd] = useState({
        busilocation: "", expcategory: "None", referenceno: "",
        expcontact: "", expimage: "", exptax: setngs ? setngs.applicabletax == undefined ? "" : setngs.applicabletax : setngs.applicabletax, totalamount: "", expnote: "", 
        expamount: "", repeaton: "", exppaidon: "", paymethod: "None", cardnum: "", cardhname: "",
        cardtransnum: "", cardtype: "None", month: "", year: "", securitycode: "", checkno: "",
        baccno: "", transnum1: "", transnum2: "", transnum3: "", transnum4: "",
        transnum5: "", transnum6: "", transnum7: "", paynotes: "", duppaydue: 0.00, paydue: 0.0
    });

    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    //  File Upload
    const [files, setFiles] = useState([]);

    const handleFileUpload = (event) => {
        const files = event.target.files;
        const reader = new FileReader();
        for (let i = 0; i <= 1; i++) {
            const file = files[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setFiles((prevFiles) => [
                    ...prevFiles,
                    { name: file.name, data: reader.result.split(',')[1] },
                ]);
            };
        }
    };

    const handleFileDelete = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const fetchData = async () => {
        try {
            let res = await axios.get(SERVICE.EXPENSE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = res.data.expenses.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid
            })
            let locresult = result.map((data, index) => {
                return data.referenceno
            })
            setLocationData(locresult);
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    useEffect(() => {
        fetchData()
    }, [locationData])


    // Expense
    const getcyear = new Date().getUTCFullYear();
    const valnyear = getcyear.toString();
    let newval = setngs ? setngs.expensesku == undefined ? `EP${valnyear}/0001` : `${setngs.expensesku}${valnyear}/` + "0001" : `EP${valnyear}/0001`;

    const [expenses, setExpenses] = useState();
    const fetchExpense = async () => {
        try {
            let res = await axios.get(SERVICE.EXPENSE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = res.data.expenses.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid
            })
            setExpenses(result);
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    // Business Locations
    const fetchLocation = async () => {
        try {
            let res = await axios.get(SERVICE.BUSINESS_LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = res.data.busilocations.filter((data, index) => {
                if (isUserRoleAccess.role == 'Admin') {
                    return data.assignbusinessid == setngs.businessid && data.activate == true
                } else {
                    if (isUserRoleAccess.businesslocation.includes(data.name)) {
                        return data.assignbusinessid == setngs.businessid && data.activate == true
                    }
                }
            })
            setBusilocations(
                result?.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                }))
            );
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    // Expense Category
    const fetchExpenseCategory = async () => {
        try {
            let res = await axios.get(SERVICE.EXPENSE_CATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = res.data.excategorys.filter((data, index) => {
                return data.assignbusinessid == setngs.businessid
            })
            setExcategorys(
                result?.map((d) => ({
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname,
                }))
            );
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

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
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    // Upload File
    const handleFileChange = (e) => {
        let expimage = document.getElementById("expimage")
        var path = (window.URL || window.webkitURL).createObjectURL(expimage.files[0]);
        document.getElementById('expimagedetail').innerText = ""
        document.getElementById('expimagedetail').innerText = expimage.value.replace(/^.*[\\\/]/, '')
        toDataURL(path, function (dataUrl) {
            expimage.setAttribute('value', String(dataUrl));
            setExpenseAdd({ ...expenseAdd, expimage: String(dataUrl) })
            return dataUrl;
        })
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

    // Add Expense
    const backLPage = useNavigate();

    // Store Expense data
    const sendRequest = async () => {
        try {
            let EXPENSE_REQ = await axios.post(SERVICE.EXPENSE_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                busilocation: String(expenseAdd.busilocation == "" ? setngs.businesslocation : expenseAdd.busilocation),
                expcategory: String(expenseAdd.expcategory),
                referenceno: String(newval),
                expdate: String(expenseDateTime),
                expimage: String(expenseAdd.expimage),
                exptax: String(expenseAdd.exptax),
                totalamount: String(expenseAdd.totalamount),
                expnote: String(expenseAdd.expnote),
                exppaidon: String(paidonDateTime),
                expamount: Number(expenseAdd.expamount),
                paymethod: String(expenseAdd.paymethod),
                cardnum: String(expenseAdd.cardnum),
                cardhname: String(expenseAdd.cardhname),
                cardtransnum: String(expenseAdd.cardtransnum),
                cardtype: String(expenseAdd.cardtype),
                month: String(expenseAdd.month),
                year: String(expenseAdd.year),
                securitycode: String(expenseAdd.securitycode),
                checkno: String(expenseAdd.checkno),
                baccno: String(expenseAdd.baccno),
                transnum1: String(expenseAdd.transnum1),
                paynotes: String(expenseAdd.paynotes),
                paydue: Number(expenseAdd.paydue),
                files: [...files],
                assignbusinessid: String(setngs.businessid),
            });
            setExpenseAdd(EXPENSE_REQ.data);
            backLPage('/expense/expense/list');
            toast.success(EXPENSE_REQ.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    useEffect(
        () => {
            fetchExpense();
            fetchRates();
            fetchLocation();
        }, []
    );

    useEffect(
        () => {
            fetchExpenseCategory();
        }, [saveExpcate]
    )

    const addExpenseSubmit = (e) => {
        e.preventDefault();
        if (expenseAdd.totalamount == "" || expenseAdd.totalamount == 0) {
            setShowAlert("Please enter Total amount!")
            handleClickOpen();
        }
        else if (locationData.includes(expenseAdd.referenceno)) {
            setShowAlert("ID Already Exists");
            handleClickOpen();
        }
        else {
            sendRequest();
        }
    }

    return (
        <Box>
            <Headtitle title={'Add Expense'} />
            <form onSubmit={addExpenseSubmit}>
                <Typography sx={userStyle.HeaderText}>Add Expense</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={{ padding: '40px 20px', }}>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={busilocations}
                                    styles={colourStyles}
                                    placeholder={setngs ? setngs.businesslocation : ""}
                                    onChange={(e) => { setExpenseAdd({ ...expenseAdd, busilocation: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Expense Category <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}>
                                    <Selects
                                        options={excategorys}
                                        styles={colourStyles}
                                        onChange={(e) => { setExpenseAdd({ ...expenseAdd, expcategory: e.value }); }}
                                    />
                                    <Grid sx={userStyle.spanIcons2}>
                                        <CreateCatMod setSaveExpcate={setSaveExpcate} />
                                    </Grid>
                                    <Grid sx={{'& .MuiIconButton-root': {marginTop: '7px'}}}>
                                    <Tooltip title="You can add expense categories through the plus icon" placement="top" arrow>
                                        <IconButton size="small">
                                            <FcInfo />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {expenses && (
                                expenses.map(
                                    () => {
                                        let strings = setngs ? `${setngs.expensesku}${valnyear}/` : 'EP' + valnyear + '/';
                                        let refNo = expenses[expenses.length - 1].referenceno;
                                        let digits = (expenses.length + 1).toString();
                                        const stringLength = refNo.length;
                                        let lastChar = refNo.charAt(stringLength - 1);
                                        let getlastBeforeChar = refNo.charAt(stringLength - 2);
                                        let getlastThreeChar = refNo.charAt(stringLength - 3);
                                        let lastBeforeChar = refNo.slice(-2);
                                        let lastThreeChar = refNo.slice(-3);
                                        let lastDigit = refNo.slice(-4);
                                        let refNOINC = parseInt(lastChar) + 1
                                        let refLstTwo = parseInt(lastBeforeChar) + 1;
                                        let refLstThree = parseInt(lastThreeChar) + 1;
                                        let refLstDigit = parseInt(lastDigit) + 1;
                                        if (digits.length < 4 && getlastBeforeChar == 0 && getlastThreeChar == 0) {
                                            refNOINC = ("000" + refNOINC);
                                            newval = strings + refNOINC;
                                        } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                                            refNOINC = ("00" + refLstTwo);
                                            newval = strings + refNOINC;
                                        } else if (digits.length < 4 && getlastThreeChar > 0) {
                                            refNOINC = ("0" + refLstThree);
                                            newval = strings + refNOINC;
                                        } else {
                                            refNOINC = (refLstDigit);
                                            newval = strings + refNOINC;
                                        }
                                    }))}
                            <InputLabel htmlFor="component-outlined">Reference No</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    type='text'
                                    value={newval}
                                    name="referenceno"
                                />
                            </FormControl>
                            <Typography variant='body2' sx={{ mt: '5px' }}>Leave empty to autogenerate</Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Date</InputLabel>
                            <FormControl size="small" fullWidth >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        renderInput={(props) => <TextField {...props} size="small" />}
                                        value={expenseDateTime}
                                        onChange={(newValue) => {
                                            setExpenseDateTime(newValue);
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Applicable Tax</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIconTax}><FaInfo /></Grid>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={taxrates}
                                        styles={colourStyles}
                                        placeholder={setngs?.applicabletax}
                                        onChange={(e) => { setExpenseAdd({ ...expenseAdd, exptax: e.value, }); }}
                                    >
                                    </Selects>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Total Amount<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    sx={userStyle.input}
                                    id="component-outlined"
                                    type='number'
                                    value={expenseAdd.totalamount}
                                    onChange={(e) => { setExpenseAdd({ ...expenseAdd, totalamount: e.target.value, paydue: Number(e.target.value) - Number(expenseAdd.expamount) }) }}
                                    name="totalamount"
                                />
                            </FormControl>
                        </Grid>
                        {files.length < 1 ? (
                            <Grid item md={4} sm={6} xs={12}>
                                {!files.length > 0 && <> <Button variant="outlined" component="label" sx={userStyle.uploadFileBtn}>
                                    {!files.length > 0 && <Box sx={{ width: '100%', color: 'black', }}> <CloudUploadIcon /> &ensp; <span style={{ paddingTop: "-15px !important" }}> Upload Documents </span></Box>}
                                    <input hidden type="file" onChange={handleFileUpload} />
                                </Button>
                                </>}
                            </Grid>
                        )
                            :
                            (
                                <>
                                    <br />
                                    <Grid item md={4} sm={6} xs={12} sx={{ padding: '10px', display: "flex", justifyContent: "center" }}>
                                        {files &&
                                            (files.map((file, index) => (
                                                <>
                                                    <Grid item md={1} xs={11} sm={11}>
                                                        <Typography><a style={{ color: "#357ae8" }}
                                                            href={`data:application/octet-stream;base64,${file.data}`}
                                                            download={file.name}
                                                        >
                                                            {((file.name).split(".")[1] === "pdf") ? <FaFilePdf style={{ fontSize: "75px" }} /> :
                                                                ((file.name).split(".")[1] === "csv") ? <FaFileCsv style={{ fontSize: "75px" }} /> :
                                                                    ((file.name).split(".")[1] === "xlsx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                                        ((file.name).split(".")[1] === "docx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                                            <img src={`data:application/octet-stream;base64,${file.data}`} style={{ width: '80px', height: '80px' }} />}
                                                        </a></Typography>
                                                    </Grid>
                                                    <Grid item md={1} xs={1} sm={1} sx={{ '& .MuiGrid-root': { maxWidth: "9.666667%" } }}>
                                                        <Typography><Button onClick={() => handleFileDelete(index)} size="small" sx={{ marginLeft: "40px", marginTop: "-12px" }} ><DeleteIcon /></Button>  </Typography>
                                                    </Grid>
                                                </>
                                            )))}
                                    </Grid>
                                </>
                            )}
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Expense Note</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid rgb(0 0 0 / 60%)' }}
                                    value={expenseAdd.expnote}
                                    onChange={(e) => { setExpenseAdd({ ...expenseAdd, expnote: e.target.value }) }}
                                    name="expensenotes"
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box><br />
                <Box sx={userStyle.container}>
                    <Typography variant="h6" >Add payment</Typography><br />
                    <Grid container spacing={3} >
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Amount <b style={{ color: 'red' }}>*</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><MoneyOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth >
                                    <OutlinedInput
                                        sx={userStyle.input}
                                        id="component-outlined"
                                        value={expenseAdd.expamount}
                                        onChange={(e) => { setExpenseAdd({ ...expenseAdd, expamount: e.target.value, paydue: Number(expenseAdd.totalamount) - Number(e.target.value) }) }}
                                        type='number'
                                        name="expamount"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Paidon Date</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <FormControl size="small" fullWidth >
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            renderInput={(props) => <TextField {...props} size="small" />}
                                            value={paidonDateTime}
                                            onChange={(newValue) => {
                                                setPaidonDateTime(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Payment Method <b style={{ color: 'red' }}>*</b></InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIcons}><MoneyOutlinedIcon /></Grid>
                                <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={expenseAdd.paymethod}
                                        onChange={(e) => { setExpenseAdd({ ...expenseAdd, paymethod: e.target.value }) }}
                                        name="paymethod"
                                        fullWidth
                                    >
                                        <MenuItem value="None">None</MenuItem>
                                        <MenuItem value="Cash">Cash</MenuItem>
                                        <MenuItem value="Card">Card</MenuItem>
                                        <MenuItem value="Cheque">Cheque</MenuItem>
                                        <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                        <MenuItem value="UPI">UPI</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {/* ****** Dropdown options ****** */}
                        {/* ****** Card Section ****** */}
                        {expenseAdd.paymethod === "Card" &&
                            (
                                <>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Card Number</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.cardnum}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, cardnum: e.target.value }) }}
                                                label="Card Number"
                                                type='text'
                                                name="cardnum"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Card Holder Name</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.cardhname}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, cardhname: e.target.value }) }}
                                                label="Card Holder Name"
                                                type="text"
                                                name="cardhname"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Card Transaction No</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.cardtransnum}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, cardtransnum: e.target.value }) }}
                                                label="Card Transaction No"
                                                type='text'
                                                name="cardtransnum"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                            <InputLabel id="demo-select-small">Card Type</InputLabel>
                                            <Select
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={expenseAdd.cardtype}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, cardtype: e.target.value }) }}
                                                label="Card Type"
                                                name="cardtype"
                                                fullWidth
                                            >
                                                <MenuItem value="None">None</MenuItem>
                                                <MenuItem value="Credit Card">Credit Card</MenuItem>
                                                <MenuItem value="Debit Card">Debit Card</MenuItem>
                                                <MenuItem value="Visa">Visa</MenuItem>
                                                <MenuItem value="MasterCard">MasterCard</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Month</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.month}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, month: e.target.value }) }}
                                                label="Month"
                                                type='text'
                                                name="month"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Year</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.year}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, year: e.target.value }) }}
                                                label="Year"
                                                type='text'
                                                name="year"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Security Code</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.securitycode}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, securitycode: e.target.value }) }}
                                                label="Security Code"
                                                type='text'
                                                name="securitycode"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            )
                        }
                        {/* ****** Cheque Section ****** */}
                        {expenseAdd.paymethod === "Cheque" &&
                            (
                                <>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Cheque No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.checkno}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, checkno: e.target.value }) }}
                                                label="Cheque No."
                                                type='number'
                                                name="checkno"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            )
                        }
                        {/* ****** Bank Section ****** */}
                        {expenseAdd.paymethod === "Bank Transfer" &&
                            (
                                <>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Bank Account No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.baccno}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, baccno: e.target.value }) }}
                                                label="Bank Account No."
                                                type='number'
                                                name="baccno"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>

                            )
                        }
                        {/* ****** Transaction Section Start ****** */}
                        {expenseAdd.paymethod === "UPI" &&
                            (
                                <>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Transaction No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseAdd.transnum1}
                                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, transnum1: e.target.value }) }}
                                                label="Transaction No."
                                                type='text'
                                                name="transnum1"
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            )
                        }
                        {/* *************** End ************ */}
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Payment Note</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid rgb(0 0 0 / 60%)' }}
                                    value={expenseAdd.paynotes}
                                    onChange={(e) => { setExpenseAdd({ ...expenseAdd, paynotes: e.target.value }) }}
                                    name="paynotes"
                                />
                            </FormControl><br /><br />
                            <hr />
                        </Grid>
                        <Grid container style={{ justifyContent: "right", }} sx={userStyle.textInput}>
                            <Typography variant='subtitle1'
                                value={expenseAdd.paydue}
                                onChange={(e) => { setExpenseAdd({ ...expenseAdd, paydue: e.target.value }) }}
                            ><b>Payment due:</b> ₹ {expenseAdd.paydue}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/expense/expense/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            <Button sx={userStyle.buttonadd} type='submit'>SAVE</Button>
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
        </Box >
    );
}
const Expensecreate = () => {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Expesecreatelist /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Expensecreate;