import React, { useState, useEffect, useContext } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import { AuthContext } from '../../../context/Appcontext';

function Createunitmod({ setFetchsaveunit }) {

    // Unit Modal
    const [unitmodal, setUnitmodal] = useState(false);
    const unitModOpen = () => { setUnitmodal(true); };
    const unitModClose = () => { setUnitmodal(false); setUnitForm({ ...unitForm, unit: "", shotname: "" }); setShowAlert("") };
    const { auth, setngs } = useContext(AuthContext);
    const [unitData, setUnitData] = useState([])

    // ******** Text field ******** //
    const [unitForm, setUnitForm] = useState({ unit: "", shotname: "" });
    const { isUserRoleCompare, isUserRoleAccess, allProducts } = useContext(UserRoleAccessContext);

    //popup model
    const [showAlert, setShowAlert] = useState()

    const fetchData = async () => {
        try {
            let res = await axios.post(SERVICE.UNIT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
            });
            let result = res?.data?.units?.map((data, index) => {
                return data.unit
            })
            setUnitData(result);
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
        fetchData()
    }, [unitData])

    // ******** Request to db ******** //
    // Add Datas
    const sendRequest = async () => {
        try {
            let response = await axios.post(SERVICE.UNIT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                unit: String(unitForm.unit),
                shortname: String(unitForm.shortname),
                businessid: String(setngs.businessid),
            });
            setFetchsaveunit("None")
            setUnitForm(response.data);
            toast.success(response.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            unitModClose();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const addUnitSubmit = (e) => {
        e.preventDefault();
        if (unitData.includes(unitForm.unit)) {
            setShowAlert("Unit Already Exists");
        }
        else if (unitForm.unit == "") {
            setShowAlert("Please enter unit name!");
        }
        else {
            sendRequest();
        }

    };

    return (
        <Box>
            <Grid sx={userStyle.spanPlusIcons} onClick={unitModOpen}  ><AddCircleOutlineOutlinedIcon /></Grid>
            <Dialog
                onClose={unitModClose}
                aria-labelledby="customized-dialog-title1"
                open={unitmodal}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        border: '1px solid #b97df0',
                    },
                }}
                maxWidth="md"
            >
                <form>
                    <DialogTitle id="customized-dialog-title1" onClose={unitModClose} sx={{ backgroundColor: '#e0e0e0', color: "#000", display: "flex" }}>
                        Add Unit
                    </DialogTitle>
                    <DialogContent dividers style={{
                        minWidth: '750px', height: '160px',
                    }}>
                        <Grid container spacing={3}>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Unit Name <b style={{ color: 'red' }}>*</b></InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.alertOutline}
                                        id="component-outlined"
                                        value={unitForm.unit}
                                        onChange={(e) => { setUnitForm({ ...unitForm, unit: e.target.value }) }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <InputLabel htmlFor="component-outlined">Short Name</InputLabel>
                                <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        sx={userStyle.alertOutline}
                                        id="component-outlined"
                                        value={unitForm.shotname}
                                        onChange={(e) => { setUnitForm({ ...unitForm, shotname: e.target.value }) }}
                                    />
                                </FormControl>
                                <p style={{ color: 'red' }}>{showAlert}</p>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={addUnitSubmit}>Save</Button>
                        <Button onClick={unitModClose} variant='contained' color="error" sx={userStyle.buttoncancel}>Close</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default Createunitmod;