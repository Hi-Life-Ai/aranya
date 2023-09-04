import React from "react";
import { Typography } from "@mui/material";

const SignatureSection = ({ data }) => {
    return (
        <>
            {data.invoiceSignature ? (
                <>
                    <Typography align='right'><img src={data.invoiceSignature} width="80px" height="45px" /></Typography>
                </>
            ) : (
                <></>
            )}
            <Typography align='right'><b>Authorized Signatory</b></Typography>
        </>
    );
};

export default SignatureSection;