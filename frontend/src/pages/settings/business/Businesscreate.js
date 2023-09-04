import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button } from '@mui/material';
import { userStyle, colourStyles } from '../../PageStyle';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Selects from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

export default function Businesscreate({ isSetngs, setIsSetngs }) {
    const [file, setFile] = useState();
    const [fileSignature, setFileSignature] = useState();
    const { auth, setngs } = useContext(AuthContext);
    const { isUserRoleAccess } = useContext(UserRoleAccessContext);
    const [busilocations, setBusilocations] = useState();

    // Business Location
    const fetchLocation = async () => {
        try {
            let res = await axios.post(SERVICE.BUSINESS_LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation],

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

    useEffect(() => {
        fetchLocation();
    }, [])

    // Image Upload
    function handleChange(e) {
        let businesslogo = document.getElementById("businesslogo")
        var path = (window.URL || window.webkitURL).createObjectURL(businesslogo.files[0]);
        toDataURL(path, function (dataUrl) {
            businesslogo.setAttribute('value', String(dataUrl));
            setIsSetngs({ ...isSetngs, businesslogo: String(dataUrl) })
            return dataUrl;
        })
        setFile(URL.createObjectURL(e.target.files[0]));
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

    // Signature Upload
    function handleChangeSignature(e) {
        let signature = document.getElementById("signature")
        var path = (window.URL || window.webkitURL).createObjectURL(signature.files[0]);
        toDataURLsignature(path, function (dataUrl) {
            signature.setAttribute('value', String(dataUrl));
            setIsSetngs({ ...isSetngs, signature: String(dataUrl) })
            return dataUrl;
        })
        setFileSignature(URL.createObjectURL(e.target.files[0]));
    }

    function toDataURLsignature(url, callback) {
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

    return (
        <Box>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Business Name</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            value={isSetngs.businessname}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, businessname: e.target.value };
                            })}
                            type="text"
                            name="businessname"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Business Address</InputLabel>
                    <FormControl size="small" fullWidth>
                        <OutlinedInput
                            id="component-outlined"
                            value={isSetngs.buniessaddress}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, buniessaddress: e.target.value };
                            })}
                            type="text"
                            name="buniessaddress"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Business Location</InputLabel>
                    <FormControl size="small" fullWidth>
                        <Selects
                            maxMenuHeight={200}
                            styles={colourStyles}
                            placeholder={isSetngs.businesslocation}
                            onChange={(e) => setIsSetngs((prevState) => {
                                return { ...prevState, businesslocation: e.value };
                            })}
                            options={busilocations}
                        />
                    </FormControl>
                </Grid>
                <Grid item lg={4} md={6} sm={12} xs={12}>
                    <InputLabel>Upload Signature</InputLabel>
                    <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                        {fileSignature || isSetngs.signature ? (
                            <>
                                <img src={fileSignature ? fileSignature : isSetngs.signature} style={{ width: '50%' }} height="100px" />
                            </>
                        ) : ("")}
                    </Grid><br />
                    <FormControl size="small" fullWidth>
                        <Button component="label" sx={userStyle.uploadBtn}>
                            Upload
                            <input type='file' id="signature" name='file' hidden onChange={handleChangeSignature} />
                        </Button>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4}>
                    <InputLabel htmlFor="component-outlined">Start date</InputLabel>
                    <Grid sx={{ display: 'flex' }}  >
                        <FormControl size="small" fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                value={isSetngs.startdate}
                                onChange={(e) => setIsSetngs((prevState) => {
                                    return { ...prevState, startdate: e.target.value };
                                })}
                                type="date"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item lg={4} md={6} sm={12} xs={12}>
                    <InputLabel>Upload Logo</InputLabel>
                    <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
                        {file || isSetngs.businesslogo ? (
                            <>
                                <img src={file ? file : isSetngs.businesslogo} style={{ width: '50%' }} height="100px" />
                            </>
                        ) : ("")}
                    </Grid><br />
                    <FormControl size="small" fullWidth>
                        <Button component="label" sx={userStyle.uploadBtn}>
                            Upload
                            <input type='file' id="businesslogo" name='file' hidden onChange={handleChange} />
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
}