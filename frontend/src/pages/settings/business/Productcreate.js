import React, { useState, useEffect, useContext } from "react";
import { Box, Grid,Dialog,DialogContent,DialogActions,Typography,Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { userStyle, colourStyles } from "../../PageStyle";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Selects from 'react-select';
import { toast } from 'react-toastify';

export default function Productcreate({isSetngs, setIsSetngs}) {

    const [units, setUnits] = useState();
    const [taxrates, setTaxrates] = useState();
    const { auth, setngs } = useContext(AuthContext);

    // Pop up error
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()

    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const handleValidationSku = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,skuprefix: value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,skuprefix: value};
            })
        }else if(val.length > 2){
            setShowAlert("Prefix can't more than 2 characters!")
            handleClickOpen();
            let num = val.slice(0, 2);
            setIsSetngs((prevState)=> {
                return {...prevState,skuprefix: num};
            })
        }
    }

    const handleValidationMinQty = (e) => {
        let val = e.target.value;
        let alphabets = new RegExp('[a-zA-Z]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(alphabets)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,minquantity:value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,minquantity:value};
            })        
        }
    }

    const handleValidationMaxQty = (e) => {
        let val = e.target.value;
        let alphabets = new RegExp('[a-zA-Z]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(alphabets)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,maxquantity:value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,maxquantity:value};
            })        
        }
    }

    const handleValidationExpiryDay = (e) => {
        let val = e.target.value;
        let alphabets = new RegExp('[a-zA-Z]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(alphabets)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,expiryday:value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter numbers only! (0-9)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,expiryday:value};
            })        
        }
    }

    //selling price tax 
    const selltaxtype = [
        {value:"Exclusive", label:"Exclusive"},
        {value:"Inclusive", label:"Inclusive"}
    ];

    // Units
    const fetchUnit = async () => {
        try {
            let response = await axios.get(SERVICE.UNIT,{
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let result = response.data.units.filter((data, index)=>{
                return data.assignbusinessid == setngs.businessid
            })
            setUnits(
                result?.map((d) => ({
                    ...d,
                    label: d.unit,
                    value: d.unit,
                }))
            );
        } catch (err) {
            const messages = err.response.data.message;
            toast.err(messages);
        }
    };

     // Taxrates
     const fetchRates = async () => {
        try {
            let response = await axios.get(SERVICE.TAXRATE,{
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            let taxRateData = response.data.taxrates.filter((data) => {
                return data.assignbusinessid == setngs.businessid
            });
            setTaxrates(
                taxRateData?.map((d) => ({
                    ...d,
                    label: d.taxname,
                    value: d.taxname,
                }))
            );
        } catch (err) {
            const messages = err.response.data.message;
            toast.err(messages);
        }
    };

    useEffect(
        () =>{
            fetchUnit();
            fetchRates();
        },[]
    )

    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">SKU Prefix</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            name="skuprefix"
                            value={isSetngs.skuprefix}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,skuprefix:e.target.value};
                            }); handleValidationSku(e)}}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Default Unit</InputLabel>
                    <FormControl size="small" fullWidth>
                    <Selects
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.defaultunit}
                            onChange={(e) => setIsSetngs((prevState)=> {
                                return {...prevState,defaultunit:e.value};
                            })}
                            options={units}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel id="demo-select-small">Applicable Tax</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.applicabletax}
                            onChange={(e) => setIsSetngs((prevState)=> {
                                return {...prevState,applicabletax:e.value};
                            })}
                            options={taxrates}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Selling price tax</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.sellingpricetax}
                            onChange={(e) => setIsSetngs((prevState)=> {
                                return {...prevState,sellingpricetax:e.value};
                            })}
                            options={selltaxtype}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Min quantity</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            name="skuprefix"
                            value={isSetngs.minquantity}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,minquantity:e.target.value};
                            }) ; handleValidationMinQty(e)}}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Max quantity</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            name="skuprefix"
                            value={isSetngs.maxquantity}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,maxquantity:e.target.value};
                            }); handleValidationMaxQty(e)}}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <InputLabel htmlFor="component-outlined">Expiry Days</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            name="skuprefix"
                            value={isSetngs.expiryday}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,expiryday:e.target.value};
                            }); handleValidationExpiryDay(e)}}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            {/* ALERT DIALOG */}
            <Dialog
                open={isErrorOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}