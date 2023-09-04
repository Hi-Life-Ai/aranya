import React from "react";
import { Grid, Typography } from "@mui/material";

const LogoSection = ({ data }) => {
    return (
        <>
            <Grid container >
                <Grid item lg={6} md={6} sm={6} xs={6} sx={{ textAlign: 'left', }}>
                    {data.invoiceLogo ? (
                        <>
                            <img src={data?.invoiceLogo} alt="Aranya Herbals" width="100px" height="50px" /><br />
                        </>
                    ) : (
                        <></>
                    )}
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6} sx={{ textAlign: 'right', }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: "1000", }}>ARANYA HEALTH CARE | INVOICE</Typography>
                    <Grid container>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Typography sx={{ fontSize: '10px', fontWeight: "1000", }}><b>Invoice Number:</b></Typography>
                            <Typography sx={{ fontSize: '10px', fontWeight: "1000", }}><b>Invoice Date:</b></Typography>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                            <Typography sx={{ fontSize: '10px', }} >{data.invoiceNumber}</Typography>
                            <Typography sx={{ fontSize: '10px', }} >{data.invoiceDate}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid><br /><br />
        </>
    );
};

export default LogoSection;