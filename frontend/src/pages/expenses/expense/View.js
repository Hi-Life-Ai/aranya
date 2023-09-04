import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, FormControl, DialogContent, DialogActions, Dialog, InputLabel, OutlinedInput, TextField, TextareaAutosize, Typography, Button, Select, MenuItem, } from '@mui/material';
import { FcInfo } from "react-icons/fc";
import { FaInfo } from "react-icons/fa";
import { userStyle, colourStyles } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import MoneyOutlinedIcon from '@mui/icons-material/MoneyOutlined';
import { useParams } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SERVICE } from "../../../services/Baseservice";
import { AuthContext } from '../../../context/Appcontext';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import Headtitle from '../../../components/header/Headtitle'
import wordIcon from "../../../assets/images/logo/docx_icon.png";
import excelIcon from "../../../assets/images/logo/excel_icon.png";
import csvIcon from "../../../assets/images/logo/csv_icon.png";
import fileIcon from "../../../assets/images/logo/file_icon.png";
import { makeStyles } from "@material-ui/core";
import SearchIcon from '@mui/icons-material/Search';
import { FaExpand } from "react-icons/fa";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));

const Expenseviewlist = () => {

    const { auth, } = useContext(AuthContext);
    const [expenseForm, setExpenseForm] = useState([]);

    //  File Upload
    const [files, setFiles] = useState([]);


    const id = useParams().id

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.EXPENSE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setFiles(response?.data?.sexpense?.files)
            setExpenseForm(response.data.sexpense);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    useEffect(() => {
        fetchHandler();
    }, [id]);


    // download  model START....................


    const classes = useStyles();

    const [download, setDownload] = useState()
    const [isOpendownload, setIsOpenDownload] = useState(false);
    const handleOpenDownload = () => { setIsOpenDownload(true); };
    const handleCloseDownload = () => { setIsOpenDownload(false); };

    const [openview, setOpenview] = useState(false);
    const [viewImage, setViewImage] = useState("");
    const [showFullscreen, setShowFullscreen] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };
    const handleFullscreenClick = () => {
        setShowFullscreen(true);
    };
    const handleFullscreenClose = () => {
        setShowFullscreen(false);
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split(".").pop();
        switch (extension) {
            // case "pdf":
            //     return pdfIcon;
            // case "doc":
            case "docx":
                return wordIcon;
            case "xls":
            case "xlsx":
                return excelIcon;
            case "csv":
                return csvIcon;
            default:
                return fileIcon;
        }
    };
    // END ...............

    return (
        <Box>
            <Headtitle title={'View Expense'} />
            <form >
                <Typography sx={userStyle.HeaderText}>View Expense</Typography>
                <Box sx={userStyle.container}>
                    <Grid container spacing={3} sx={{ padding: '40px 20px', }}>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={expenseForm.busilocation}
                                    styles={colourStyles}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Expense Category <b style={{ color: 'red' }}>*</b></InputLabel>
                            <FormControl size="small" fullWidth sx={{ display: 'flex' }}>
                                <OutlinedInput
                                    value={expenseForm.expcategory}
                                    styles={colourStyles}
                                    readOnly
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel htmlFor="component-outlined">Reference No</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    type='text'
                                    value={expenseForm.referenceno}
                                    readOnly

                                />
                            </FormControl>
                            <Typography variant='body2' sx={{ mt: '5px' }}>Leave empty to autogenerate</Typography>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12} >
                            <InputLabel id="demo-select-small">Date</InputLabel>
                            <FormControl size="small" fullWidth >
                                <OutlinedInput
                                    value={expenseForm.expdate}
                                    readOnly

                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>
                            <InputLabel id="demo-select-small">Applicable Tax</InputLabel>
                            <Grid sx={{ display: 'flex' }}  >
                                <Grid sx={userStyle.spanIconTax}><FaInfo /></Grid>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        value={expenseForm.exptax}
                                        styles={colourStyles}
                                        readOnly
                                    />
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
                                    readOnly

                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={4} sm={6} xs={12}>

                            <br />
                            {files &&
                                (files.map((file, index) => (
                                    <Grid sx={{ display: 'flex', justifyContent: "center" }}>
                                        <Typography>{file.name}</Typography>
                                        <Typography style={{ color: "#357ae8", cursor: "pointer" }} onClick={(e) => { handleOpenDownload(); setDownload(files[0]); }}>
                                            {((file.name).split(".")[1] === "pdf") ? <FaFilePdf style={{ fontSize: "75px" }} /> :
                                                ((file.name).split(".")[1] === "csv") ? <FaFileCsv style={{ fontSize: "75px" }} /> :
                                                    ((file.name).split(".")[1] === "xlsx") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                        ((file.name).split(".")[1] === "docx" || "txt" || "doc") ? <FaFileExcel style={{ fontSize: "75px" }} /> :
                                                            <img src={`data:application/octet-stream;base64,${file.data}`} alt="edit" style={{ width: '80px', height: '80px' }} />}
                                        </Typography>
                                        <br></br>
                                    </Grid>
                                )))}
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <InputLabel id="demo-select-small" sx={{ m: 1 }}>Expense Note</InputLabel>
                            <FormControl size="small" fullWidth >
                                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid rgb(0 0 0 / 60%)' }}
                                    value={expenseForm.expnote}
                                    readOnly

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
                                        readOnly

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
                                            readOnly
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
                                    <OutlinedInput
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={expenseForm.paymethod}
                                        readOnly
                                    />
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
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Card Holder Name</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.cardhname}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Card Transaction No</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.cardtransnum}
                                                readOnly
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
                                                readOnly
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
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Year</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.year}
                                                readOnly
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <FormControl size="small" fullWidth >
                                            <InputLabel htmlFor="component-outlined" >Security Code</InputLabel>
                                            <OutlinedInput
                                                id="component-outlined"
                                                value={expenseForm.securitycode}
                                                readOnly
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
                                                readOnly
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
                                                readOnly
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
                                                readOnly
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
                                    readOnly
                                    name="paynotes"
                                />
                            </FormControl><br /><br />
                            <hr />
                        </Grid>
                        <Grid container style={{ justifyContent: "right", }} sx={userStyle.textInput}>
                            <Typography variant='subtitle1'
                                value={expenseForm.paydue}
                            ><b>Payment due:</b> ₹ {expenseForm.paydue}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container sx={userStyle.gridcontainer}>
                        <Grid >
                            <Link to="/expense/expense/list"><Button sx={userStyle.buttoncancel}>back</Button></Link>
                        </Grid>
                    </Grid>
                </Box>
            </form>
            {/* ALERT DIALOG */}

            <Dialog
                maxWidth='md'
                fullWidth
                open={isOpendownload}
                onClose={handleCloseDownload}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >
                <DialogContent ><br />
                    <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Grid item lg={2} md={4} sm={4} xs={6}>
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>File Name</Typography><br /><br />
                            <Grid sx={{ display: "flex", justifyContent: "center" }}>{download ? (
                                <>
                                    <Typography>{download.name}</Typography>
                                </>
                            ) : (<></>)}
                            </Grid>
                        </Grid>
                        <Grid item lg={2} md={4} sm={4} xs={6}>
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Download</Typography><br /><br />
                            <Grid sx={{ display: "flex", justifyContent: "center" }}>{download ? (
                                <>
                                    <a
                                        style={{ color: "#357AE8" }}
                                        href={`data:application/octet-stream;base64,${download.data}`}
                                        download={download.name}
                                    >
                                        <FileDownloadIcon />
                                    </a>
                                </>
                            ) : (<></>)}
                            </Grid>
                        </Grid>
                        <Grid item lg={2} md={4} sm={4} xs={6}>
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Preview</Typography><br /><br />
                            <Grid sx={{ display: "flex", justifyContent: "center" }}>{download ? (

                                <>
                                    {download?.type?.includes("image/") ?
                                        <>
                                            <img src={download.preview} alt={download.name} style={{ maxHeight: '100px', marginTop: '10px' }} />
                                            <Button style={userStyle.buttonedit}
                                                onClick={() => {
                                                    handleClickOpenview();
                                                    setViewImage(download.preview);
                                                }} ><VisibilityOutlinedIcon style={{ fontsize: "large" }} /></Button>
                                        </>
                                        :
                                        <>
                                            <Box sx={{ justifyContent: 'center' }}>
                                                <Button variant='contained' onClick={() => renderFilePreview(download)} style={{ textTranform: 'capitalize !important', marginBottom: '20px' }}><SearchIcon />Preview</Button>
                                                <img className={classes.preview} src={getFileIcon(download.name)} height="100" alt="file icon" />
                                            </Box>

                                        </>
                                    }
                                </>
                            ) : (<></>)}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDownload} variant="outlined" color="error">close</Button>&emsp;&emsp;&emsp;<br /><br /><br />
                </DialogActions>
            </Dialog>

            <Dialog open={openview} onClose={handleClickOpenview} >
                <DialogContent sx={{ maxWidth: "100%", alignItems: "center" }}>
                    <img
                        src={viewImage}
                        alt={viewImage}
                        style={{ maxWidth: "90%", }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            cursor: "pointer",
                            padding: "5px",
                            backgroundColor: "rgba(255,255,255,0?.8)",
                        }}
                        onClick={() => { handleFullscreenClick(); }}
                    >
                        <FaExpand size={20} />
                    </div>

                    <Button variant="contained" onClick={() => { handleCloseview(); handleCloseDownload() }}>
                        {" "}
                        Back{" "}
                    </Button>
                </DialogContent>
            </Dialog>
        </Box >
    );
}
const Expenseview = () => {
    return (
        <>
            <Box>
                <Navbar />
                <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                    <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                        <Expenseviewlist /><br /><br /><br />
                        <Footer />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Expenseview;