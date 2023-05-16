import React, { useState, useEffect, useContext, } from "react";
import { userStyle } from "../../PageStyle";
import { Box, Grid, FormControl, OutlinedInput, InputLabel, Card, TableCell, Typography, Button, Table,TableContainer, TableHead, TableRow, TableBody, } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { Link } from 'react-router-dom';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import moment from 'moment';

const DraftView = () => {

    const { auth, setngs } = useContext(AuthContext)

    const [isDraft, setIsDraft] = useState({});
    const [tableData, setTableData] = useState([]);

    const id = useParams().id; 

    // get all pos 
    const fetchDraft = async () => {
        try {
            let res = await axios.get(`${SERVICE.DRAFT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setIsDraft(res.data.sdraft);
            setTableData(res.data.sdraft.goods);
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    let backPage = useNavigate();

    const handleBack = ()=>{
        backPage('/sell/draft/list');
    }

    useEffect(
        ()=>{
            fetchDraft();
        },[id]
    )

    return (
        <Box id="fullScreen"
            sx={{
                backgroundColor: 'white',
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Headtitle title={'Draft View'} />
            <form >
                {/* Navbar Start */}
                <Box sx={{ padding: "5px"}}>
                    <Grid container spacing={1} sx={userStyle.poscontainer} >
                        <Grid item lg={2} md={2} sm={2} xs={12}>
                            <Box sx={{ float: "left" }}>
                            {setngs.businesslogo ? (
                                        <>
                                       <Link to="/">
                                            <img src={setngs?.businesslogo} alt="logo" style={{ width: '150px', height: '70px', paddingLeft: 'px' }}></img>
                                        </Link>
                                        </>
                                    ) : (
                                        <></>
                                )}
                            </Box>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ marginTop: "5px" }}>
                            <InputLabel sx={{ marginTop: '-3px' }}> Company Name </InputLabel>
                            <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        value={isDraft.company}
                                    />
                                </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ marginTop: "5px" }}>
                            <InputLabel sx={{ marginTop: '-3px' }}> Business Location</InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={isDraft.location}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ marginTop: "5px" }}>
                            <InputLabel sx={{ marginTop: '-3px' }}> Salesman</InputLabel>
                            <FormControl size="small" fullWidth>
                                    <OutlinedInput
                                        value={isDraft.salesman}
                                    />
                                </FormControl>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ marginTop: "5px" }}>
                            <InputLabel sx={{ marginTop: '-3px' }}> Date </InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    value={moment(isDraft.date).utc().format('DD-MM-YYYY')}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                {/* Navbar Ends */}
                <Grid container sx={{ backgroundColor: "#f0f2ff", }} >
                    <Grid item xs={12} sm={12} md={8} lg={8} sx={{ paddingRight: '3px', backgroundColor: '#fff' }} >
                        {/* <br /> */}
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12} md={12} lg={12} >
                                {/* Table start */}
                                <TableContainer sx={{ paddingLeft: 1, height: '450px' }}  >
                                    <Table style={{ marginTop: "10px", borderRight: "1px solid rgba(224, 224, 224, 1)", }}
                                        aria-label="customized table" padding='none'>
                                        <TableHead >
                                            <TableRow sx={userStyle.tableHead1}>
                                                <TableCell style={{ marginLeft: '5px', paddingLeft: "10px", width: '155px', }}> Product Name </TableCell>
                                                <TableCell style={{ width: '55px' }}>Rate type</TableCell>
                                                <TableCell style={{ width: '55px' }}>Qty</TableCell>
                                                <TableCell style={{ width: '95px' }}>MRP</TableCell>
                                                <TableCell style={{ width: '95px' }}>Net Rate</TableCell>
                                                <TableCell style={{ width: '175px' }}>Discount</TableCell>
                                                <TableCell style={{ width: '155px' }}>After Discount </TableCell>
                                                <TableCell style={{ width: '55px' }}>GST</TableCell>
                                                <TableCell style={{ width: '155px' }}>Subtotal</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tableData.length > 0 &&
                                                tableData.map((data, i) => {
                                                    return (
                                                        <>
                                                            <TableRow >
                                                                <TableCell sx={{ fontSize: '12px', }} key={i}>{data?.productname}</TableCell>
                                                                <TableCell ><Typography sx={{ fontSize: '12px' }}>{data?.ratetype}</Typography></TableCell>
                                                                <TableCell ><Typography sx={{ fontSize: '12px' }}>{data?.quantity}</Typography></TableCell>
                                                                <TableCell ><Typography sx={{ fontSize: '12px' }}> {data?.mrp}</Typography></TableCell>
                                                                <TableCell><Typography sx={{ fontSize: '12px' }}>{data?.netrate}</Typography></TableCell>
                                                                <TableCell><Typography sx={{ fontSize: '12px' }}>{data?.discountcheck == false ? data?.discountamt == "" ? 0 : data?.discountamt : data?.discountamt == "" ? 0+'%' : data?.discountamt+'%'}</Typography></TableCell>
                                                                <TableCell ><Typography sx={{ fontSize: '12px' }}>{data?.afterdiscount}</Typography></TableCell>
                                                                <TableCell><Typography sx={{ fontSize: '12px' }}>{data?.taxtareval}</Typography></TableCell>
                                                                <TableCell><Typography sx={{ fontSize: '12px' }}><b>{data?.subtotal.toFixed(2)}</b></Typography></TableCell>                                                            </TableRow>
                                                        </>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {/* Table Ends */}
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: '-24px' }}>
                                <Grid container spacing={1}>
                                    <Grid item md={7} sm={6} xs={12} sx={{ display: 'flex' }}>
                                            <Typography sx={{ marginLeft: '15px' }}>
                                                <b> Total Items :</b>&ensp;{isDraft.totalitems}
                                            </Typography>
                                            <Typography sx={{ marginLeft: '15px', }}>
                                                <b>Total Quantity:</b>&ensp;{isDraft.totalproducts}
                                            </Typography>
                                    </Grid>
                                    <Grid item md={5} sm={6} xs={12} sx={{ paddingLeft: '4px', paddingRight: '1px', marginTop: '-4px' }}>
                                        <Button fullWidth variant="text" sx={{ marginTop: "5px", boxShadow: "inset 0px 0px 10px #1976d2", }}>
                                            <b>GRAND TOTAL :</b>&ensp;{isDraft.grandtotal}
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>CGST:</b>&ensp;{isDraft.taxcgst}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>SGST:</b>&ensp;{isDraft.taxigst}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>IGST:</b>&ensp;{isDraft.taxsgst}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} sx={{ p: 1, backgroundColor: '#fff', }}>
                        <Card sx={{ margin: '15px', padding: '30px', boxShadow: '0 0 10px -2px #444444' }}>
                            <Box>
                                <Typography ><b>Company Name:</b> {isDraft.company}</Typography><br />
                                <Typography ><b>Address:</b> {isDraft.companyaddress}</Typography>
                                <Typography ><b>GSTN:</b> {isDraft.gstn}</Typography>
                                <Typography ><b>Contact Person:</b> {isDraft.companycontactpersonname+'/'+isDraft.companycontactpersonnumber}</Typography>
                                <Typography ><b>Bank Name:</b> {isDraft.bankname}</Typography>
                                <Typography ><b>Account Number:</b> {isDraft.accountnumber}</Typography>
                                <Typography ><b>IFSC Code:</b> {isDraft.ifsccode}</Typography>
                                <Typography ><b>Salesman:</b> {isDraft.salesman+'/'+isDraft.salesmannumber}</Typography><br />
                                <Typography ><b>Delivery Name:</b> {isDraft.location}</Typography><br />
                                <Typography ><b>Address:</b> {isDraft.deliveryaddress}</Typography>
                                <Typography ><b>GSTN:</b> {isDraft.deliverygstn}</Typography>
                                <Typography ><b>Contact Person:</b> {isDraft.deliverycontactpersonname+'/'+isDraft.deliverycontactpersonnumber}</Typography><br />
                                <Typography ><b>Driver Details</b></Typography><br />
                                <Typography ><b>Driver Name:</b> {isDraft.drivername}</Typography>
                                <Typography ><b>Driver No:</b> {isDraft.drivernumber}</Typography>
                                <Typography ><b>Contact No:</b> {isDraft.drivernphonenumber}</Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container sx={userStyle.btnGrid}>
                    <Grid item md={8} sm={8} xs={12} sx={{ display: "flex", color: 'black' }}>
                        <Button disableRipple sx={userStyle.buttoncancel} onClick={handleBack}>BACK</Button>
                        <Typography 
                            sx={{ marginLeft: '15px', color: 'grey', fontSize: "20px" }}>
                            <b>Total:</b> <span style={{ color: 'green' }}>{isDraft.totalbillamt}</span>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};
export default DraftView;