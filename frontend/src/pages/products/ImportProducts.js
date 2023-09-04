import React, { useState, useEffect, useContext } from 'react';
import { Button, Grid, Paper, Typography, Box, TableContainer, TableHead, Table, TableBody, } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '../../components/Table';
import Navbar from '../../components/header/Navbar';
import Footer from '../../components/footer/Footer';
import { userStyle } from '../PageStyle';
import { FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import axios from 'axios'
import { CsvBuilder } from 'filefy';
import SendToServer from './SendToServer';
import Headtitle from '../../components/header/Headtitle';
import { SERVICE } from '../../services/Baseservice';
import { UserRoleAccessContext } from '../../context/Appcontext';
import { AuthContext } from '../../context/Appcontext';
import { toast } from 'react-toastify';


function Importproduct() {

    const [items, setItems] = useState([]);
    const [show, setShow] = useState(true)
    const { auth, setngs } = useContext(AuthContext);
    const [products, setProducts] = useState([]);

    // autoid
    let newval = setngs ? setngs.skuprefix == undefined ? "SK0000" : setngs.skuprefix + "0001" : "SK0000";

    function sendJSON() {

        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
            }
        };
        try {
            xmlhttp.open("POST", SERVICE.PRODUCT_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xmlhttp.send(JSON.stringify(items));
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    const readexcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: "buffer" });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((d) => {
            setItems(d);
        });

    };
    const { isUserRoleCompare, isUserRoleAccess, allProducts } = useContext(UserRoleAccessContext);


    // get all products
    const fetchProduct = async () => {
        try {
            let res_product = await axios.post(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]

            });

            setProducts(res_product?.data?.products);
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
        fetchProduct();
    },)

    const ExportsHead = () => {
        new CsvBuilder("products")
            .setColumns(["sku", "productname", "category", "subcategory", "companyrate", "superstockrate", "dealerrate", "mrp", "labeltype", "expirydate", "unit", "currentstock", "managestock", "minquantity", "maxquantity", "hsn", "applicabletax", "sellingpricetax", "productdescription", "assignbusinessid",])
            .exportFile();
    }

    return (
        <Box>
            <Headtitle title={'Import products'} />
            <Typography sx={userStyle.HeaderText}>Import Products</Typography>
            <Box sx={userStyle.container}>
                <Typography variant='h6' >File to import</Typography><br />
                <Grid container spacing={2}>
                    <Grid item md={8}>
                        <Button variant="contained" component="label" sx={userStyle.uploadBtn}>
                            Upload <input hidden
                                type="file"
                                accept=".xlsx, .xls , .csv"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    readexcel(file);
                                }}
                            />
                        </Button>
                    </Grid>
                    <Grid item md={4}>
                        {show && <div><div readexcel={readexcel}></div><SendToServer sendJSON={sendJSON} /></div>}

                    </Grid>
                </Grid>
                <br /><br />
                <Button variant="contained" color="success" sx={{ textTransform: 'Capitalize' }} onClick={(e) => ExportsHead()} ><FaDownload />&ensp;Download template file</Button>
            </Box>
            <br />
            {/* ****** Instructions Box ****** */}
            <Box sx={userStyle.container}>
                <Typography sx={userStyle.importheadtext}>Instructions</Typography>
                <br />
                <Typography sx={userStyle.importsubheadtex}>Follow the instructions carefully before importing the file</Typography>
                <Typography sx={userStyle.importsubheadtext}>The columns of the file should be in the following order.</Typography>
                <br /><br />
                <TableContainer component={Paper} sx={{
                    padding: 1, width: '100%', margin: 'auto', overflow: 'auto',
                    "&::-webkit-scrollbar": { width: 20 },
                    "&::-webkit-scrollbar-track": { backgroundColor: 'pink' },
                    "&::-webkit-scrollbar-thumb": { backgroundColor: 'blue' }
                }} >
                    {/* ****** Table ****** */}
                    <Table md={{ minWidth: 200, maxHeight: '5px', overflow: 'auto' }} aria-label="customized table">
                        <TableHead >
                            <StyledTableRow>
                                <StyledTableCell >Column Number</StyledTableCell>
                                <StyledTableCell align="left">Column Name</StyledTableCell>
                                <StyledTableCell align="left">Instruction</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                {products && (
                                    products?.map(
                                        () => {
                                            let strings = setngs ? setngs.skuprefix : "SK";
                                            let refNo = products[products.length - 1].sku;
                                            let digits = (products.length + 1).toString();
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
                                <StyledTableCell component="th" scope="row">1</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Product code </Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Use this autogenerate code for product code<b> {`(${newval})`}</b><br /> While adding more than one Product, increament the last digit of code by one<br /></Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">2</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Product Name</Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">3</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Category</Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">4</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Company rate</Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">5</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Super stock's rate </Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">6</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Dealer rate </Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">7</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>MRP </Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">8</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>HSN Code  </Typography> <Typography>(Optional)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">9</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Expiry Date</Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell><Typography sx={userStyle.importTabledata}>Should be in date format <b>(YYYY/MM/DD)</b></Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">10</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Unit</Typography> <Typography>(Optional)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">11</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Manage Stock  </Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If hsn code entered give as <b>TRUE</b> or give <b>FALSE</b></Typography></StyledTableCell>
                            </StyledTableRow>


                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">12</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Quantity</Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box></StyledTableCell>
                                <StyledTableCell align="left">Should be number</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">13</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Mininmum quantity </Typography> <Typography>(Optional)</Typography>	</Box></StyledTableCell>
                                <StyledTableCell align="left">Should be number</StyledTableCell>
                            </StyledTableRow>

                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">14</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Maximum quantity</Typography> <Typography>(Optional)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell align="left">Should be number</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">15</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Applicable Tax </Typography> <Typography>(Optional)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>If hsn entered keep this field as blank or hsn empty enter tax in this field</Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">16</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Selling Tax Type </Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}><b>Inclusive</b> or <b>Exclusive</b></Typography></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">17</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Product Description</Typography> <Typography>(Optional)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell align="left"></StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">18</StyledTableCell>
                                <StyledTableCell align="left"><Box sx={{ display: 'flex', gap: '2px' }}><Typography sx={userStyle.importTabledata}>Assinged Business Id </Typography> <Typography>(Required<b style={{ color: 'red' }}>*</b>)</Typography></Box>	</StyledTableCell>
                                <StyledTableCell align="left"> <Typography sx={userStyle.importTabledata}>Use this code only while add product<b> {`(${setngs.businessid})`}</b></Typography></StyledTableCell>
                            </StyledTableRow>

                        </TableBody>
                    </Table>
                    {/* ****** Table Ends ****** */}
                </TableContainer>
                <br />
            </Box>
            {/* ****** Instructions Box Ends ****** */}
        </Box>
    );
}
function ImportProducts() {
    return (
        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <Importproduct /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}
export default ImportProducts;