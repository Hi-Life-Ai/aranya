import React, { useState, useContext } from "react";
import { Box, Grid,Dialog, DialogContent,DialogActions, Typography, Button, FormControl, InputLabel, OutlinedInput} from '@mui/material';
import { userStyle } from "../../PageStyle";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export default function Prefixescreate({isSetngs, setIsSetngs}) {

    // Pop up error
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()

    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };

    const handleValidationUser = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,usersku: value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,usersku: value};
            })
        }else if(val.length > 2){
            setShowAlert("Prefix can't more than 2 characters!")
            handleClickOpen();
            let num = val.slice(0, 2);
            setIsSetngs((prevState)=> {
                return {...prevState,usersku: num};
            })
        }
    }

    const handleValidationDepartment = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,departmentsku: value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,departmentsku: value};
            })
        }else if(val.length > 2){
            setShowAlert("Prefix can't more than 2 characters!")
            handleClickOpen();
            let num = val.slice(0, 2);
            setIsSetngs((prevState)=> {
                return {...prevState,departmentsku: num};
            })
        }
    }

    const handleValidationSales = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,salesku: value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,salesku: value};
            })
        }else if(val.length > 2){
            setShowAlert("Prefix can't more than 2 characters!")
            handleClickOpen();
            let num = val.slice(0, 2);
            setIsSetngs((prevState)=> {
                return {...prevState,salesku: num};
            })
        }
    }

    const handleValidationDraft = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,draftsku: value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,draftsku: value};
            })
        }else if(val.length > 2){
            setShowAlert("Prefix can't more than 2 characters!")
            handleClickOpen();
            let num = val.slice(0, 2);
            setIsSetngs((prevState)=> {
                return {...prevState,draftsku: num};
            })
        }
    }

    const handleValidationQuotation = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,quotationsku: value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,quotationsku: value};
            })
        } else if(val.length > 2){
            setShowAlert("Prefix can't more than 2 characters!")
            handleClickOpen();
            let num = val.slice(0, 2);
            setIsSetngs((prevState)=> {
                return {...prevState,quotationsku: num};
            })
        }
    }

    const handleValidationExpense = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,expensesku: value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,expensesku: value};
            })
        }else if(val.length > 2){
            setShowAlert("Prefix can't more than 2 characters!")
            handleClickOpen();
            let num = val.slice(0, 2);
            setIsSetngs((prevState)=> {
                return {...prevState,expensesku: num};
            })
        }
    }

    const handleValidationBusinessLocation = (e) => {
        let val = e.target.value;
        let numbers = new RegExp('[0-9]')
        var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (e.target.value.match(numbers)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,businesslocationsku: value};
            })
        }
        else if (regExSpecialChar.test(e.target.value)) {
            setShowAlert("Please enter characters only! (A-Z or a-z)")
            handleClickOpen();
            let num = val.length;
            let value = val.slice(0, num - 1)
            setIsSetngs((prevState)=> {
                return {...prevState,businesslocationsku: value};
            })
        }else if(val.length > 2){
            setShowAlert("Prefix can't more than 2 characters!")
            handleClickOpen();
            let num = val.slice(0, 2);
            setIsSetngs((prevState)=> {
                return {...prevState,businesslocationsku: num};
            })
        }
    }

    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <InputLabel htmlFor="component-outlined">User</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.usersku}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,usersku:e.target.value};
                            }); handleValidationUser(e)}}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <InputLabel htmlFor="component-outlined">Department</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.departmentsku}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,departmentsku:e.target.value};
                            }); handleValidationDepartment(e)}}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <InputLabel htmlFor="component-outlined">Sales</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.salesku}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,salesku:e.target.value};
                            }); handleValidationSales(e)}}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <InputLabel htmlFor="component-outlined">Draft</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.draftsku}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,draftsku:e.target.value};
                            }); handleValidationDraft(e)}}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <InputLabel htmlFor="component-outlined">Quotation</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.quotationsku}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,quotationsku:e.target.value};
                            }); handleValidationQuotation(e)}}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <InputLabel htmlFor="component-outlined">Expense</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.expensesku}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,expensesku:e.target.value};
                            }); handleValidationExpense(e)}}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    <InputLabel htmlFor="component-outlined">Business Location</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            type="text"
                            value={isSetngs.businesslocationsku}
                            onChange={(e) => {setIsSetngs((prevState)=> {
                                return {...prevState,businesslocationsku:e.target.value};
                            }); handleValidationBusinessLocation(e)}}
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