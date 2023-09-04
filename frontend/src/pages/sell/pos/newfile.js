const invoiceData = {
    invoiceLogo: setngs?.businesslogo,
    invoiceNumber: newvalpos,
    invoiceDate: moment(purchaseDateTime).format('DD-MM-YYYY'),
    invoiceDelLocation: posAdd.location,
    invoiceDelAddress: posAdd.deliveryaddress,
    invoiceDelGstn: posAdd.deliverygstn,
    invoiceDelConPerName: posAdd.deliverycontactpersonname,
    invoiceDelConPerNumber: posAdd.deliverycontactpersonnumber,
    invoiceSalesman: posAdd.salesman,
    invoiceSalesmanNumber: posAdd.salesmannumber,
    invoiceCompany: posAdd.company,
    invoiceCompAddress: posAdd.companyaddress,
    invoiceCompGstno: posAdd.gstno,
    invoiceCompConPerName: posAdd.companycontactpersonname,
    invoiceCompConPerNumber: posAdd.companycontactpersonnumber,
    invoiceDriverName: posAdd.drivername,
    invoiceDriverNumber: posAdd.drivernumber,
    invoiceDriverPhoneNumber: posAdd.drivernphonenumber,
    invoiceBankName: posAdd.bankname,
    invoiceAccNumber: posAdd.accountnumber,
    invoiceIFSCCode: posAdd.ifsccode,
    invoiceSignature: setngs.signature,
    invoiceCgst: CGST,
    invoiceSgst: GST,
    invoiceIgst: IGST
};

import React, { useState, useEffect, useRef, useContext, } from "react";
import { useReactToPrint } from "react-to-print";

const Poscreate = () => {
    const componentRef = useRef(null);
    // Calculate page data for each copy type
    const rowsPerPage = 20;
    const originalPageData = calculatePageData(invoiceData.invoiceTableData, rowsPerPage);
    const duplicatePageData = calculatePageData(invoiceData.invoiceTableData, rowsPerPage);
    const customerPageData = calculatePageData(invoiceData.invoiceTableData, rowsPerPage);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ARANYA HEALTH CARE | INVOICE ',
        pageStyle: 'print',
    });
    retunr(
        <Box ref={componentRef} sx={userStyle.printcls} id="aranysinvoice">
            <div className="copy-container">
                <InvoiceComponent data={invoiceData} title="ARANYA HEALTH CARE | ORIGINAL" pageData={originalPageData} />
            </div>
            <div className="copy-container">
                <InvoiceComponent data={invoiceData} title="ARANYA HEALTH CARE | DUPLICATE" pageData={duplicatePageData} />
            </div>
            <div className="copy-container">
                <InvoiceComponent data={invoiceData} title="ARANYA HEALTH CARE | CUSTOMER" pageData={customerPageData} />
            </div>
        </Box>
    )
}

const calculatePageData = (tableData, rowsPerPage) => {
    const pageCount = Math.ceil(tableData.length / rowsPerPage);
    const pageData = [];

    for (let i = 0; i < pageCount; i++) {
        const startIndex = i * rowsPerPage;
        const endIndex = Math.min((i + 1) * rowsPerPage, tableData.length);
        const pageRows = tableData.slice(startIndex, endIndex);
        pageData.push(pageRows);
    }

    return pageData;
};

const InvoiceComponent = ({ data, title, pageData }) => {
    return (
        <Box >
            {pageData.map((page, pageIndex) => (
                <div key={pageIndex} className="page">
                    <Box>
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
                                    {page.map((data, i) => (
                                        <TableRow sx={{ paddingTop: '5px' }} key={i}>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }} key={i}>{data?.productname}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.hsn}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.sellingvalue}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.quantity}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.netrate}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.taxtareval + "%"}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{data?.mrp}</TableCell>
                                            <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", }}>{Number(data?.subtotal).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ position: 'fixed', bottom: 0, }}>
                            <Grid container spacing={1}>
                                <Grid item md={7.5} sm={7.5} xs={7.5}></Grid>
                                <Grid item md={2} sm={2} xs={2}><Typography sx={{ fontSize: '15px' }}><b>Net Total</b></Typography></Grid>
                                <Grid item md={2.5} sm={2.5} xs={2.5}><Typography sx={{ fontSize: '15px', textAlign: 'center' }}><b>{Number(totalNetCostCalcSubInvoice()).toFixed(2)}</b></Typography></Grid>
                            </Grid>
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
                            <Box sx={{ borderLeft: '1px solid black', borderRight: '1px solid black', padding: '10px !important' }}>
                                <Typography align="left" sx={{ fontSize: '10px', fontWeight: '400' }}>Amount Chargeable (in words)</Typography>
                                <Typography align="left" sx={{ fontSize: '14px', fontWeight: 'bold' }}>{totalNetCostInWords}</Typography>
                            </Box>
                            <Box sx={{ border: '1px solid black' }}>
                                <Grid container  >
                                    <Grid item md={5.5} sm={5.5} xs={5.5} >
                                        <Typography sx={{ textDecoration: "underline", paddingLeft: '10px', paddingLeft: '10px', fontSize: '10px', fontWeight: '1000' }}><b>Declaration</b></Typography>
                                        <Typography sx={{ textAlign: 'left', paddingLeft: '10px', fontSize: '10px' }}>Any loss or breakage in goods supplied against this invoice should be intimated whithin 10 days of receipt of goods with documentary evidence.</Typography>
                                    </Grid>
                                    <Grid item md={0.5} sm={0.5} xs={0.5} sx={{ textAlign: 'center', borderRight: '1px solid black' }}></Grid>
                                    <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'left', }}>
                                        <Grid container >
                                            <Grid item md={12} sm={12} xs={12} sx={{ paddingLeft: '10px' }}>
                                                <Typography sx={{ fontSize: '10px' }}>Company's Bank Details</Typography>
                                                <Grid container sx={{ '& .MuiGrid-item': { padding: '0px' } }}>
                                                    <Grid item md={5.5} sm={5.5} xs={5.5}>
                                                        <Typography sx={{ fontSize: '10px' }}>Bank Name</Typography>
                                                        <Typography sx={{ fontSize: '10px' }}>Acc No</Typography>
                                                        <Typography sx={{ fontSize: '10px' }}>IFSC Code</Typography>
                                                    </Grid>
                                                    <Grid item md={0.5} sm={0.5} xs={0.5}>
                                                        <Typography sx={{ fontSize: '10px' }}>:</Typography>
                                                        <Typography sx={{ fontSize: '10px' }}>:</Typography>
                                                        <Typography sx={{ fontSize: '10px' }}>:</Typography>
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
                    </Box>
                </div>
            ))}
        </Box>
    );
}

export default Poscreate;
