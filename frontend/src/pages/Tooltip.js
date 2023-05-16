import React, { useStyles } from 'react';
import { makeStyles,} from "@material-ui/core/styles";

 export  const useStyles = makeStyles(theme => ({
            arrow: {
                fontSize: 25,
                color: "7009AB !important",
                "&::before": {
                backgroundColor: "7009AB !important",
                boxShadow: '6px 6px 6px 9px #dedbdbae',
                }
            },
            tooltip: {
                fontSize:"17px !important",
                color: "#7009AB !important",
                backgroundColor: "white !important",
                boxShadow: '6px 6px 6px 9px #dedbdbae',
                padding:"20px",
            }
            }));
    
 export const classes = useStyles();
 