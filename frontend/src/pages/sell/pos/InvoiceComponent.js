import React from "react";
import { Box, Grid, Paper, TableCell, Typography, Table, TableBody, TableContainer, TableHead, TableRow, TableFooter, } from "@mui/material";

const InvoiceComponent = ({ data, title }) => {

    let cgst = 0;
    let gst = 0;
    let igst = 0;
    let CGST = 0;
    let GST = 0;
    let IGST = 0;

    // Initialize tax variables
    let cgstTotal = 0;
    let gstTotal = 0;
    let igstTotal = 0;

    // Iterate through tableData to calculate tax values
    data.invoiceTableData?.forEach((item) => {
        item?.subtax?.forEach((data) => {
            const quantity = Number(item.quantity); // Quantity of the current product
            const taxRateCGST = Number(data.taxratecgst || 0);
            const taxRateSGST = Number(data.taxrategst || 0);
            const taxRateIGST = Number(data.taxrateigst || 0);

            cgstTotal += (quantity * taxRateCGST);
            gstTotal += (quantity * taxRateSGST);
            igstTotal += (quantity * taxRateIGST);
        });
    });

    //subtotal
    function totalNetCostCalcSubInvoice() {
        let totalvalue = 0;
        if (data.invoiceTableData?.length > 0) {
            data.invoiceTableData?.forEach((value) => {
                totalvalue += Number(value.subtotal)
            })
            return totalvalue.toFixed(0);
        }
    }

    // total quantity calculation
    const totalQuantityCalcInvoice = () => {
        let totalquanvalue = 0;
        if (data.invoiceTableData?.length > 0) {
            data.invoiceTableData?.forEach((value) => {
                totalquanvalue += Number(value.quantity)
            })
            return totalquanvalue.toFixed(0);
        }
    }

    //total taxvalue calc for invoice
    const totalTaxValCalInvoice = () => {
        let totaltaxvalue = 0;
        if (data.invoiceTableData?.length > 0) {
            data.invoiceTableData?.forEach((value) => {
                totaltaxvalue += Math.abs((((value.taxtareval == "" || value.taxtareval == undefined ? 0 : value.taxtareval) / 100) * (value.mrp == "" || value.mrp == undefined ? 0 : value.mrp))) * Number(value.quantity)
            })
            return totaltaxvalue;
        }
    }

    // convert 
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    function numberToWords(num) {

        if (num === 0) {
            return 'Zero Rupees';
        }

        const words = [];

        for (let i = 0; i < thousands.length; i++) {
            if (num % 1000 !== 0) {
                const wordSegment = numberToWordsHundred(num % 1000);
                words.push(wordSegment + ' ' + thousands[i]);
            }
            num = Math.floor(num / 1000);
            if (num === 0) {
                break;
            }
        }

        return words.reverse().join(', ');
    }

    function numberToWordsHundred(num) {
        const hundred = Math.floor(num / 100);
        const remainder = num % 100;

        const words = [];

        if (hundred !== 0) {
            words.push(units[hundred] + ' Hundred');
        }

        if (remainder !== 0) {
            if (remainder < 10) {
                words.push(units[remainder]);
            } else if (remainder >= 11 && remainder <= 19) {
                words.push(teens[remainder - 10]);
            } else {
                const tensDigit = Math.floor(remainder / 10);
                const unitsDigit = remainder % 10;
                words.push(tens[tensDigit] + (unitsDigit !== 0 ? ' ' + units[unitsDigit] : ''));
            }
        }

        return words.join(' ');
    }

    const totalNetCost = Number(totalNetCostCalcSubInvoice()).toFixed(2);
    const totalNetCostInWords = numberToWords(Number(totalNetCost)) + ' Rupees Only';

    return (

        <Box >
            {/* <br /><br /><br /><br /> */}
            <Grid container >
                <Grid item lg={6} md={6} sm={6} xs={6} sx={{ textAlign: 'left', }}>
                    {data.invoiceLogo ? (
                        <>
                            <img src={data.invoiceLogo} alt="Aranya Herbals" width="100px" height="50px" /><br />
                        </>
                    ) : (
                        <></>
                    )}
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} sx={{ textAlign: 'right', }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: "1000", }}>{title}</Typography>
                    <Grid container>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Typography sx={{ fontSize: '10px', fontWeight: "1000", }}><b>Invoice Number:</b></Typography>
                            <Typography sx={{ fontSize: '10px', fontWeight: "1000", }}><b>Invoice Date:</b></Typography>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceNumber}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceDate}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid><br />
            <Grid container >
                <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'left', }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: "1000", }}><b>DELIVERY DETAILS:</b><br /></Typography>
                    <Grid container>
                        <Grid item md={4} sm={4} xs={4}>
                            <Typography sx={{ fontSize: '10px', }}><b>Name:</b></Typography>
                            <Typography sx={{ fontSize: '10px', }}><b>Address:</b></Typography>
                            <Typography sx={{ fontSize: '10px', }}><b>GSTN:</b></Typography>
                            <Typography sx={{ fontSize: '10px', }}><b>Contact person:</b></Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceDelLocation}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceDelAddress}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceDelGstn}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceDelConPerName + '/' + data.invoiceDelConPerNumber}</Typography>
                        </Grid>
                    </Grid><br />
                    <Grid container>
                        <Grid item md={4} sm={4} xs={4}>
                            <Typography sx={{ fontSize: '10px', }}><b>Order Number:</b></Typography>
                            <Typography sx={{ fontSize: '10px', }}><b>Order Date:</b></Typography>
                            <Typography sx={{ fontSize: '10px', }}><b>Salesman:</b></Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceNumber}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceDate}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceSalesman + '/' + data.invoiceSalesmanNumber}</Typography>
                        </Grid>
                    </Grid><br />
                </Grid>
                <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'right', }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: "1000", }}><b>COMPANY DETAILS:</b> <br /></Typography>
                    <Grid container>
                        <Grid item md={4} sm={4} xs={4}>
                            <Typography sx={{ fontSize: '10px', }}><b>Name:</b></Typography>
                            <Typography sx={{ fontSize: '10px', }}><b>Address:</b></Typography>
                            <Typography sx={{ fontSize: '10px', }}><b>GSTN:</b></Typography>
                            <Typography sx={{ fontSize: '10px', }}><b>Contact person:</b></Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceCompany}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceCompAddress}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceCompGstno}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceCompConPerName + '/' + data.invoiceCompConPerNumber}</Typography>
                        </Grid>
                    </Grid><br />
                    <Typography sx={{ fontSize: '12px', fontWeight: "1000", }}><b>TRANSPORT DETAILS:</b> <br /></Typography>
                    <Grid container>
                        <Grid item md={4} sm={4} xs={4}>
                            <Typography sx={{ fontSize: '10px', }}><b>Driver Name:</b></Typography>
                            <Typography sx={{ fontSize: '10px', }}><b>No:</b></Typography>
                            <Typography sx={{ fontSize: '10px', }}><b>Contact No:</b></Typography>
                        </Grid>
                        <Grid item md={8} sm={8} xs={8} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceDriverName}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceDriverNumber}</Typography>
                            <Typography sx={{ fontSize: '10px', }}>{data.invoiceDriverPhoneNumber}</Typography>
                        </Grid>
                    </Grid><br />
                </Grid>
            </Grid>
            <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box>
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none' }}>
                <Table aria-label="simple table" >
                    <TableHead >
                        <TableRow sx={{ borderBottom: 'none' }}>
                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: '300px' }}>ITEM</TableCell>
                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: '100px' }}>HSN</TableCell>
                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: '100px' }}>UNIT PRICE</TableCell>
                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: '100px' }}>QUANTITY</TableCell>
                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: '100px' }}>NET PRICE</TableCell>
                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: '100px' }}>GST</TableCell>
                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: '100px' }}>MRP</TableCell>
                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: '150px' }}>TOTAL</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {data.invoiceTableData.length > 0 &&
                            data.invoiceTableData.map((data, i) => {
                                return (
                                    <>
                                        <TableRow sx={{ paddingTop: '5px' }}>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }} key={i}>{data?.productname}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.hsn}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.sellingvalue}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.quantity}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.netrate}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.taxtareval + "%"}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.mrp}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{Number(data?.subtotal).toFixed(2)}</TableCell>
                                        </TableRow>
                                    </>
                                );
                            })}
                    </TableBody>
                    <TableFooter >
                        <TableRow >
                            <TableCell align="center" colSpan={7} sx={{ borderBottom: 'none !important' }}><Typography sx={{ fontSize: '15px', fontWeight: 'bold' }}><b>Net Total</b></Typography></TableCell>
                            <TableCell align="left" sx={{ borderBottom: 'none !important' }}><Typography sx={{ fontSize: '15px', fontWeight: 'bold' }}><b>{Number(totalNetCostCalcSubInvoice()).toFixed(2)}</b></Typography></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer><br /><br /><br /><br />
            {/* <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box> */}
            <Box sx={{ bottom: '0px', }}>
                <Grid container >
                    <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'left' }}>
                        <Table >
                            <TableHead>
                                <TableRow >
                                    <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', width: '10px' }}><b>Cgst</b></TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', width: '10px' }}><b>Sgst</b></TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', width: '10px' }}><b>Igst</b></TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', width: '10px' }}><b>Taxable Value</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', }}><b>{cgstTotal + "%"}</b></TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', }}><b>{gstTotal + "%"}</b></TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', }}><b>{igstTotal + "%"}</b></TableCell>
                                    <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', }}><b>{Number(totalTaxValCalInvoice()).toFixed(2)}</b></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'center', borderRight: '1px solid black', borderTop: '1px solid black', borderBottom: '1px solid black', }}>
                        <br />
                        <Grid container>
                            <Grid item md={7.5} sm={7.5} xs={7.5} sx={{ textAlign: "right" }}>
                                <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>Net Amount</b></Typography>
                                <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>No. Of Items</b></Typography>
                                <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>Total Items</b></Typography>
                            </Grid>
                            <Grid item md={0.5} sm={0.5} xs={0.5} sx={{ textAlign: "center", borderRight: '1px solid black' }}></Grid>
                            <Grid item md={4} sm={4} xs={4} sx={{ textAlign: "center" }}>
                                <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{Number(totalNetCostCalcSubInvoice()).toFixed(2)}</b></Typography>
                                <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{data.invoiceTableData.length}</b></Typography>
                                <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{totalQuantityCalcInvoice()}</b></Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br /> */}
                <Grid item md={12} sm={12} xs={12}>
                    <Typography align="left" sx={{ fontSize: '10px', fontWeight: '400' }}>Amount Chargeable (in words)</Typography>
                    <Typography align="left" sx={{ fontSize: '14px', fontWeight: 'bold' }}>{totalNetCostInWords}</Typography>
                </Grid><br />
                {/* <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br /> */}
                <Grid container spacing={1} sx={{ border: '1px solid black' }}>
                    <Grid item md={5.5} sm={5.5} xs={5.5} sx={{ textAlign: 'left' }}>
                        <Typography sx={{ textDecoration: "underline", paddingLeft: '10px', paddingLeft: '10px', fontSize: '10px', fontWeight: '1000' }}><b>Declaration</b></Typography>
                        <Typography sx={{ textAlign: 'left', paddingLeft: '10px', fontSize: '10px', fontWeight: '1000' }}>Any loss or breakage in goods supplied against this invoice should be intimated whithin 10 days of receipt of goods with documentary evidence.</Typography>
                    </Grid>
                    <Grid item md={0.5} sm={0.5} xs={0.5} sx={{ textAlign: 'center', borderRight: '1px solid black' }}></Grid>
                    <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'left', }}>
                        <Grid container >
                            <Grid item md={12} sm={12} xs={12} sx={{ paddingLeft: '10px' }}>
                                <Typography sx={{ fontSize: '10px' }}>Company's Bank Details</Typography>
                                <Grid container sx={{ '& .MuiGrid-item': { padding: '0px' } }}>
                                    <Grid item md={5.5} sm={5.5} xs={5.5}>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}>Bank Name</Typography>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}>Acc No</Typography>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}>IFSC Code</Typography>
                                    </Grid>
                                    <Grid item md={0.5} sm={0.5} xs={0.5}>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}>:</Typography>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}>:</Typography>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}>:</Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{data.invoiceBankName}</b></Typography>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{data.invoiceAccNumber}</b></Typography>
                                        <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{data.invoiceIFSCCode}</b></Typography>
                                    </Grid>
                                </Grid><br />
                            </Grid>
                            <Grid item md={12} sm={12} xs={12} sx={{ textAlign: 'right', borderTop: '1px solid black', paddingRight: '10px' }}>
                                <br />
                                {data.invoiceSignature ? (
                                    <>
                                        <Typography align='right'><img src={data.invoiceSignature} width="80px" height="45px" /></Typography>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <Typography align='right'><b>Authorized Signatory</b></Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>

    );
};

export default InvoiceComponent;
