import React, { useContext, useState, useEffect } from 'react';
import { userStyle } from '../PageStyle';
import { Box, Paper, Table, TableBody, TableHead, Grid,Typography, TableContainer, Button, } from '@mui/material';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../components/header/Headtitle';
import { SERVICE } from '../../services/Baseservice';
import { AuthContext } from '../../context/Appcontext';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
function Stockadjustviewlist() {
    const { auth } = useContext(AuthContext);
    const [adjustitem, setAdjustitem] = useState({});

    const id = useParams().id;

    const fetchStockadjust = async () => {
        try {
            let response = await axios.get(`${SERVICE.TRANSFER_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
            setAdjustitem(response.data.stransfer);
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };

    useEffect(
        () => {
        fetchStockadjust();
    }, []);
    return (
        <Box>
            <Headtitle title={'View Stock Adjust'} />
            <Typography sx={userStyle.HeaderText}>View Stock Adjust</Typography>
            <Box sx={userStyle.container}>
                <TableContainer component={Paper} >
                    <Table aria-label="simple table" id="tableRefone2" >
                        <TableHead sx={{ fontWeight: "600" }} >
                            <StyledTableRow >
                                <StyledTableCell>Date</StyledTableCell>
                                <StyledTableCell>From Location</StyledTableCell>
                                <StyledTableCell>Product Name</StyledTableCell>
                                <StyledTableCell>Quantity</StyledTableCell>
                                <StyledTableCell>To Locations</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow >
                                <StyledTableCell>{adjustitem.date}</StyledTableCell>    
                                <StyledTableCell>{adjustitem.fromlocation}</StyledTableCell>
                                <StyledTableCell>{adjustitem.products?.map((a) => a.productname+', ')}</StyledTableCell>
                                <StyledTableCell>{adjustitem.products?.map((value) => value.locations?.map((data, liindec) => value.quantity[data] + ', '))}</StyledTableCell>
                                <StyledTableCell>{adjustitem.products?.map((value) => value.locations + ', ')}</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer><br /><br />
                <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                    <Grid >
                        <Link to='/stockadjust/list'><Button sx={userStyle.buttoncancel} type="button">BACK</Button></Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
function Stockadjustview() {
    return (
        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' }}}>
                    <Stockadjustviewlist /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}
export default Stockadjustview;