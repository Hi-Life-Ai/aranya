import React from "react";
import { Typography } from "@mui/material";

const InvoiceHeader = ({ title, invoiceData }) => {
    console.log(invoiceData);
    return (

        <Typography sx={{ fontSize: '12px', fontWeight: "1000" }}>{title}</Typography>
    );
};

export default InvoiceHeader;