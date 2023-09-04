import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, FormGroup, FormControlLabel, IconButton, Tooltip, Checkbox, OutlinedInput, TextField, TextareaAutosize, Typography, Button, Dialog, DialogContent, DialogActions, Select, MenuItem, } from '@mui/material';
import { FcInfo } from "react-icons/fc";
import { FaInfo } from "react-icons/fa";
import { userStyle, colourStyles } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Selects from "react-select";
import CreateCatMod from './Categorucreate';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Headtitle from '../../../components/header/Headtitle'

const Expenseeditlist = () => {

    const { auth, setngs } = useContext(AuthContext);
    const { isUserRoleAccess } = useContext(UserRoleAccessContext);
    const [expenseForm, setExpenseForm] = useState({
        busilocation: "", expcategory: "", referenceno: "",
        expcontact: "", expimage: "", exptax: "", totalamount: "", expnote: "",
        expamount: "", repeaton: "", exppaidon: "", paymethod: "", cardnum: "", cardhname: "",
        cardtransnum: "", cardtype: "", month: "", year: "", securitycode: "", checkno: "",
        baccno: "", transnum1: "", transnum2: "", transnum3: "", transnum4: "",
        transnum5: "", transnum6: "", transnum7: "", paynotes: "", duppaydue: 0.00, paydue: 0.0
    });
    const [busilocations, setBusilocations] = useState();
    const [taxrates, setTaxrates] = useState();
    const [excategorys, setExcategorys] = useState();
    //set change expense category
    const [saveExpcate, setSaveExpcate] = useState();

    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    //  File Upload
    const [files, setFiles] = useState([]);

    const handleFileUpload = (event) => {
        const files = event.target.files[0];

        const reader = new FileReader()
        const file = files;
        reader.readAsDataURL(files)
        if (file) {
            // Get the file extension
            const fileExtension = file.name.split('.').pop().toLowerCase();
            // Check if the file is an image or PDF
            if (['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension)) {
                // Handle the file upload here
                reader.onloadend = (event) => {
                    setFiles((prevFiles) => [
                        ...prevFiles,
                        { name: file.name, preview: reader.result, data: reader.result.split(',')[1] },
                    ]);
                };
            } else {
                // Display an error message or take appropriate action for unsupported file types
                toast.error('Unsupported file type. Only images and PDFs are allowed.');
            }
        }
    };

    const handleFileDelete = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    // Business Locations
    const fetchLocation = async () => {
        try {
            let res = await axios.post(SERVICE.BUSINESS_LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]

            });

            setBusilocations(
                res.data.busilocations?.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // Expense Category
    const fetchExpenseCategory = async () => {
        try {
            let res = await axios.post(SERVICE.EXPENSE_CATEGORY_BYID, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]

            });

            setExcategorys(
                res.data.excategorys?.map((d) => ({
                    ...d,
                    label: d.categoryname,
                    value: d.categoryname,
                }))
            );
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

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.EXPENSE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setExpenseForm(response.data.sexpense);
            setFiles(response?.data?.sexpense?.files)
            await fetchLocation(response.data.sexpense);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    //taxrates
    const fetchRates = async () => {
        try {
            let response = await axios.post(SERVICE.TAXRATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
            });

            setTaxrates(
                response.data.taxrates?.map((d) => ({
                    ...d,
                    label: d.taxname,
                    value: d.taxname,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const backLPage = useNavigate();

    const sendRequest = async () => {
        try {
            let expenseedit = await axios.put(`${SERVICE.EXPENSE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                busilocation: String(expenseForm.busilocation),
                expcategory: String(expenseForm.expcategory),
                referenceno: String(expenseForm.referenceno),
                expdate: String(expenseForm.expdate),
                expimage: String(expenseForm.expimage),
                exptax: String(expenseForm.exptax),
                totalamount: String(expenseForm.totalamount),
                expnote: String(expenseForm.expnote),
                exppaidon: String(expenseForm.exppaidon),
                expamount: Number(expenseForm.expamount),
                paymethod: String(expenseForm.paymethod),
                cardnum: String(expenseForm.cardnum),
                cardhname: String(expenseForm.cardhname),
                cardtransnum: String(expenseForm.cardtransnum),
                cardtype: String(expenseForm.cardtype),
                month: String(expenseForm.month),
                year: String(expenseForm.year),
                securitycode: String(expenseForm.securitycode),
                checkno: String(expenseForm.checkno),
                baccno: String(expenseForm.baccno),
                transnum1: String(expenseForm.transnum1),
                paynotes: String(expenseForm.paynotes),
                paydue: Number(expenseForm.paydue),
                files: [...files]
            });
            setExpenseForm(expenseedit.data);
            toast.success(expenseedit.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backLPage('/expense/expense/list');
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
        fetchRates();
        fetchHandler();
    }, [id]);

    useEffect(
        () => {
            fetchExpenseCategory();
        }, [saveExpcate]
    )

    const editSubmit = (e) => {
        e.preventDefault();
        if (expenseForm.totalamount == "" || expenseForm.totalamount == 0) {
            setShowAlert("Please enter Total amount!")
            handleClickOpen();
        } else {
            sendRequest()
        }
    }

    return (
        <Box>
            <Headtitle title={'Edit Expense'} />
            <form onSubmit={editSubmit}>
                <Typography sx={userStyle.HeaderText}>Edit Expense</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={{ padding: '40px 20px', }}>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <Selects
                                    options={busilocations}
                                    styles={colourStyles}
                                    placeholder={expenseForm.busilocation}
                                    onChange={(e) => { setExpenseForm({ ...expenseForm, busilocation: e.value }); }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Expense Category <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <Grid sx={{ display: 'flex' }}  >
                                    <Selects
                                        options={excategorys}
                                        styles={colourStyles}
                                        placeholder={expenseForm.expcategory}
                                        onChange={(e) => { setExpenseForm({ ...expenseForm, expcategory: e.value }); }}
                                    />
                                    <Grid sx={userStyle.spanIcons}>
                                        <CreateCatMod setSaveExpcate={setSaveExpcate} />
                                    </Grid>
                                    <Grid sx={{ '& .MuiIconButton-root': { marginTop: '7px' } }}>
                                        <Tooltip title="You can add categories through the plus icon" placement="top" arrow>
                                            <IconButton size="small">
                                                <FcInfo />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Reference No</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    type='text'
                                    value={expenseForm.referenceno}
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
                                        renderInput={(props) => <TextField {...props} />}
                                        value={expenseForm.expdate}
                                        onChange={(newValue) => {
                                            setExpenseForm({ ...expenseForm, expdate: newValue });
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
                                        placeholder={expenseForm.exptax}
                                        onChange={(e) => { setExpenseForm({ ...expenseForm, exptax: e.value, }); }}
                                    >
                                    </Selects>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined" >Total Amount<b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    type='number'
                                    value={expenseForm.totalamount}
                                    onChange={(e) => { setExpenseForm({ ...expenseForm, totalamount: e.target.value, paydue: Number(e.target.value) - Number(expenseForm.expamount) }) }}
                                    name="totalamount"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            {!files.length > 0 && <> <Button variant="outlined" component="label" sx={userStyle.uploadFileBtn}>
                                {!files.length > 0 && <Box sx={{ width: '100%', color: 'black', }}> <CloudUploadIcon /> &ensp; <span style={{ paddingTop: "-15px !important" }}> Upload Documents </span></Box>}
                                <input hidden type="file" onChange={handleFileUpload} />
                            </Button>
                            </>}
                            <br />
                            {files &&
                                (files.map((file, index) => (
                                    <Grid sx={{ display: 'flex', justifyContent: "center" }}>
                                        <Typography><a style={{ color: "#357ae8" }}
                                            href={`data:application/octet-stream;base64,${file.data}`}
                                            download={file.name}
                                        >
                                            {((file.name).split(".")[1] === "pdf") ? <FaFilePdf style={{ fontSize: "75px" }} /> :
                                                ((file.name).split(".")[1] === "csv") ? <FaFileCsv style={{ fontSize: "75px" }} /> :
                                                    ((file.name).split(".")[1] === "xlsx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                        ((file.name).split(".")[1] === "docx" || "txt" || "doc") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                            <img src={`data:application/octet-stream;base64,${file.data}`} alt="edit" style={{ width: '80px', height: '80px' }} />}
                                        </a></Typography> <br></br>
                                        <Typography><Button onClick={() => handleFileDelete(index)} size="small" sx={{ marginTop: "-12px" }} ><DeleteIcon /></Button> </Typography>
                                    </Grid>
                                )))}
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Expense Note</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid rgb(0 0 0 / 60%)' }}
                                    value={expenseForm.expnote}
                                    onChange={(e) => { setExpenseForm({ ...expenseForm, expnote: e.target.value }) }}
                                    name="paynotes"
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
                                        id="component-outlined"
                                        value={expenseForm.expamount}
                                        onChange={(e) => { setExpenseForm({ ...expenseForm, expamount: e.target.value, paydue: Number(expenseForm.totalamount) - Number(e.target.value) }) }}
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
                                            renderInput={(props) => <TextField {...props} />}
                                            value={expenseForm.paidon}
                                            onChange={(newValue) => {
                                                setExpenseForm({ ...expenseForm, paidon: newValue });
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
                                        value={expenseForm.paymethod}
                                        onChange={(e) => { setExpenseForm({ ...expenseForm, paymethod: e.target.value }) }}
                                        name="paymethod"
                                        fullWidth
                                    >
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
                        {expenseForm.paymethod === "Card" &&
                            (
                                <>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Card Number</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.cardnum}
                                                onChange={(e) => { setExpenseForm({ ...expenseForm, cardnum: e.target.value }) }}
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
                                                value={expenseForm.cardhname}
                                                onChange={(e) => { setExpenseForm({ ...expenseForm, cardhname: e.target.value }) }}
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
                                                value={expenseForm.cardtransnum}
                                                onChange={(e) => { setExpenseForm({ ...expenseForm, cardtransnum: e.target.value }) }}
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
                                                value={expenseForm.cardtype}
                                                onChange={(e) => { setExpenseForm({ ...expenseForm, cardtype: e.target.value }) }}
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
                                                value={expenseForm.month}
                                                onChange={(e) => { setExpenseForm({ ...expenseForm, month: e.target.value }) }}
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
                                                value={expenseForm.year}
                                                onChange={(e) => { setExpenseForm({ ...expenseForm, year: e.target.value }) }}
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
                                                value={expenseForm.securitycode}
                                                onChange={(e) => { setExpenseForm({ ...expenseForm, securitycode: e.target.value }) }}
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
                        {expenseForm.paymethod === "Cheque" &&
                            (
                                <>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Cheque No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.checkno}
                                                onChange={(e) => { setExpenseForm({ ...expenseForm, checkno: e.target.value }) }}
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
                        {expenseForm.paymethod === "Bank Transfer" &&
                            (
                                <>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Bank Account No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.baccno}
                                                onChange={(e) => { setExpenseForm({ ...expenseForm, baccno: e.target.value }) }}
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
                        {expenseForm.paymethod === "UPI" &&
                            (
                                <>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Transaction No.</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.transnum1}
                                                onChange={(e) => { setExpenseForm({ ...expenseForm, transnum1: e.target.value }) }}
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
                                    value={expenseForm.paynotes}
                                    onChange={(e) => { setExpenseForm({ ...expenseForm, paynotes: e.target.value }) }}
                                    name="paynotes"
                                />
                            </FormControl><br /><br />
                            <hr />
                        </Grid>
                        <Grid container style={{ justifyContent: "right", }} sx={userStyle.textInput}>
                            <Typography variant='subtitle1'
                                value={expenseForm.paydue}
                                onChange={(e) => { setExpenseForm({ ...expenseForm, paydue: e.target.value }) }}
                            ><b>Payment due:</b> ₹ {expenseForm.paydue}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/expense/expense/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
                            <Button sx={userStyle.buttonadd} type='submit'>UPDATE</Button>
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
const Expenseedit = () => {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Expenseeditlist /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Expenseedit;