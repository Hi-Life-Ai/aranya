import React, { useState, useEffect, useContext } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Typography, FormGroup, FormControlLabel, Checkbox, Divider, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Roleeditlist() {

    const [role, setRole] = useState({});
    const { auth, setngs } = useContext(AuthContext);

    // Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => { setIsErrorOpen(true); };
    const handleClose = () => { setIsErrorOpen(false); };
    
    const id = useParams().id

    const userAllSelect = () => {
        setRole((prevUser) => {
            return { ...prevUser, checkalluser: !role.checkalluser, vuser: !role.vuser, auser: !role.auser, euser: !role.euser, duser: !role.duser, exceluser: !role.exceluser, csvuser: !role.csvuser, printuser: !role.printuser, pdfuser: !role.pdfuser }
        }
        )
    }

    const roleAllSelect = () => {
        setRole((prevRole) => {
            return { ...prevRole, checkallrole: !role.checkallrole, arole: !role.arole, erole: !role.erole, drole: !role.drole, excelrole: !role.excelrole, csvrole: !role.csvrole, printrole: !role.printrole, pdfrole: !role.pdfrole, }
        })
    }

    const departmentAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkalldepartment: !role.checkalldepartment,
                adepartment: !role.adepartment,
                exceldepartment: !role.exceldepartment,
                csvdepartment: !role.csvdepartment,
                printdepartment: !role.printdepartment,
                pdfdepartment: !role.pdfdepartment,
                edepartment: !role.edepartment,
                ddepartment: !role.ddepartment,
            }
        })
    }

    const categoryAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallcategory: !role.checkallcategory, acategory: !role.acategory, ecategory: !role.ecategory, dcategory: !role.dcategory, printcategory: !role.printcategory, pdfcategory: !role.pdfcategory }
        })
    }

    const unitAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallunit: !role.checkallunit, aunit: !role.aunit, eunit: !role.eunit, dunit: !role.dunit, excelunit: !role.excelunit, csvunit: !role.csvunit, printunit: !role.printunit, pdfunit: !role.pdfunit }
        })
    }

    const productAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallproduct: !role.checkallproduct, vproduct: !role.vproduct, iproduct: !role.iproduct, aproduct: !role.aproduct, eproduct: !role.eproduct, dproduct: !role.dproduct, excelproduct: !role.excelproduct, csvproduct: !role.csvproduct, printproduct: !role.printproduct, pdfproduct: !role.pdfproduct }
        })
    }

    const categoryWiseReportAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallcatwisereport: !role.checkallcatwisereport,
                csvcatwisereport: !role.csvcatwisereport,
                excelcatwisereport: !role.excelcatwisereport,
                printcatwisereport: !role.printcatwisereport,
                pdfcatwisereport: !role.pdfcatwisereport,
            }
        })
    }

    const subCategoryWiseReportAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallsubcatwisereport: !role.checkallsubcatwisereport,
                csvsubcatwisereport: !role.csvsubcatwisereport,
                excelsubcatwisereport: !role.excelsubcatwisereport,
                printsubcatwisereport: !role.printsubcatwisereport,
                pdfsubcatwisereport: !role.pdfsubcatwisereport,
            }
        })
    }

    const unitWiseReportAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallunitwisereport: !role.checkallunitwisereport,
                csvunitwisereport: !role.csvunitwisereport,
                excelunitwisereport: !role.excelunitwisereport,
                printunitwisereport: !role.printunitwisereport,
                pdfunitwisereport: !role.pdfunitwisereport,
            }
        })
    }

    const expiryReportAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData, checkallexpiryreport: !role.checkallexpiryreport,
                excelexpiryreport: !role.excelexpiryreport,
                csvexpiryreport: !role.csvexpiryreport,
                printexpiryreport: !role.printexpiryreport,
                pdfexpiryreport: !role.pdfexpiryreport
            }
        })
    }

    const LocationWiseStockReportAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkalllocationwisestockreport: !role.checkalllocationwisestockreport,
                excellocationwisestockreport: !role.excellocationwisestockreport,
                csvlocationwisestockreport: !role.csvlocationwisestockreport,
                printlocationwisestockreport: !role.printlocationwisestockreport,
                pdflocationwisestockreport: !role.pdflocationwisestockreport
            }
        })
    }

    const LocationWiseExpirykReportAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkalllocationwiseexpreport: !role.checkalllocationwiseexpreport,
                csvlocationwiseexpreport: !role.csvlocationwiseexpreport,
                excellocationwiseexpreport: !role.excellocationwiseexpreport,
                printlocationwiseexpreport: !role.printlocationwiseexpreport,
                pdflocationwiseexpreport: !role.pdflocationwiseexpreport
            }
        })
    }


    const stockReportAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallstockreport: !role.checkallstockreport,
                excelstockreport: !role.excelstockreport,
                csvstockreport: !role.csvstockreport,
                printstockreport: !role.printstockreport,
                pdftockreport: !role.pdftockreport,
            }
        })
    }

    const stockTransferListAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallcurrentstocktransferlist: !role.checkallcurrentstocktransferlist,
                vstocktransferlist: !role.vstocktransferlist,
                acurrentstocktransferlist: !role.acurrentstocktransferlist,
                excelcurrentstocktransferlist: !role.excelcurrentstocktransferlist,
                csvcurrentstocktransferlist: !role.csvcurrentstocktransferlist,
                pdfcurrentstocktransferlist: !role.pdfcurrentstocktransferlist,
                printcurrentstocktransferlist: !role.printcurrentstocktransferlist
            }
        })
    }

    const stockAdjustListAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallcurrentstockadjust: !role.checkallcurrentstockadjust,
                excelcurrentstockadjust: !role.excelcurrentstockadjust,
                csvcurrentstockadjust: !role.csvcurrentstockadjust,
                printcurrentstockadjust: !role.printcurrentstockadjust,
                pdfcurrentstockadjust: !role.pdfcurrentstockadjust,
                vstockadjust: !role.vstockadjust
            }
        })
    }

    const posAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallpos: !role.checkallpos, apos: !role.apos, epos: !role.epos, dpos: !role.dpos, vpos: !role.vpos, excelpos: !role.excelpos, csvpos: !role.csvpos, printpos: !role.printpos, pdfpos: !role.pdfpos }
        })
    }

    const draftAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkalldraft: !role.checkalldraft, adraft: !role.adraft, edraft: !role.edraft, ddraft: !role.ddraft, vdraft: !role.vdraft, exceldraft: !role.exceldraft, csvdraft: !role.csvdraft, printdraft: !role.printdraft, pdfdraft: !role.pdfdraft }
        })
    }

    const quotationAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallquotation: !role.checkallquotation, aquotation: !role.aquotation, equotation: !role.equotation, dquotation: !role.dquotation, vquotation: !role.vquotation, excelquotation: !role.excelquotation, csvquotation: !role.csvquotation, printquotation: !role.printquotation, pdfquotation: !role.pdfquotation }
        })
    }

    const expenseAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallexpense: !role.checkallexpense, aexpense: !role.aexpense, eexpense: !role.eexpense, dexpense: !role.dexpense, excelexpense: !role.excelexpense, csvexpense: !role.csvexpense, printexpense: !role.printexpense, pdfexpense: !role.pdfexpense }
        })
    }

    const expenseCategoryAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallexpensecategory: !role.checkallexpensecategory, aexpensecategory: !role.aexpensecategory, eexpensecategory: !role.eexpensecategory, dexpensecategory: !role.dexpensecategory, excelexpensecategory: !role.excelexpensecategory, csvexpensecategory: !role.csvexpensecategory, printexpensecategory: !role.printexpensecategory, pdfexpensecategory: !role.pdfexpensecategory }
        })
    }

    // Report Module
    const categoryWiseProfitAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallcategorywiseprofit: !role.checkallcategorywiseprofit,
                csvcategorywiseprofit: !role.csvcategorywiseprofit,
                excelcategorywiseprofit: !role.excelcategorywiseprofit,
                printcategorywiseprofit: !role.printcategorywiseprofit,
                pdfcategorywiseprofit: !role.pdfcategorywiseprofit
            }
        })
    }

    const dayWiseProfitAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkalldaywiseprofit: !role.checkalldaywiseprofit,
                csvdaywiseprofit: !role.csvdaywiseprofit,
                exceldaywiseprofit: !role.exceldaywiseprofit,
                printdaywiseprofit: !role.printdaywiseprofit,
                pdfdaywiseprofit: !role.pdfdaywiseprofit
            }
        })
    }

    const locationWiseIndProfitAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkalllocationwiseprofit: !role.checkalllocationwiseprofit,
                csvlocationwiseprofit: !role.csvlocationwiseprofit,
                excellocationwiseprofit: !role.excellocationwiseprofit,
                printlocationwiseprofit: !role.printlocationwiseprofit,
                pdflocationwiseprofit: !role.pdflocationwiseprofit
            }
        })
    }

    const locationWiseTotProfitAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkalllocationwisetotalprofit: !role.checkalllocationwisetotalprofit,
                csvlocationwisetotalprofit: !role.csvlocationwisetotalprofit,
                excellocationwisetotalprofit: !role.excellocationwisetotalprofit,
                printlocationwisetotalprofit: !role.printlocationwisetotalprofit,
                pdflocationwisetotalprofit: !role.pdflocationwisetotalprofit
            }
        })
    }

    const monthWiseProfitAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallmonthwiseprofit: !role.checkallmonthwiseprofit,
                csvmonthwiseprofit: !role.csvmonthwiseprofit,
                excelmonthwiseprofit: !role.excelmonthwiseprofit,
                printmonthwiseprofit: !role.printmonthwiseprofit,
                pdfmonthwiseprofit: !role.pdfmonthwiseprofit
            }
        })
    }

    const subCatWiseProfitAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallsubcategorywiseprofit: !role.checkallsubcategorywiseprofit,
                csvsubcategorywiseprofit: !role.csvsubcategorywiseprofit,
                excelsubcategorywiseprofit: !role.excelsubcategorywiseprofit,
                printsubcategorywiseprofit: !role.printsubcategorywiseprofit,
                pdfsubcategorywiseprofit: !role.pdfsubcategorywiseprofit
            }
        })
    }

    const weekWiseProfitAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallweekwiseprofit: !role.checkallweekwiseprofit,
                csvweekwiseprofit: !role.csvweekwiseprofit,
                excelweekwiseprofit: !role.excelweekwiseprofit,
                printweekwiseprofit: !role.printweekwiseprofit,
                pdfweekwiseprofit: !role.pdfweekwiseprofit
            }
        })
    }

    const yearWiseProfitAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallyearwiseprofit: !role.checkallyearwiseprofit,
                csvyearwiseprofit: !role.csvyearwiseprofit,
                excelyearwiseprofit: !role.excelyearwiseprofit,
                printyearwiseprofit: !role.printyearwiseprofit,
                pdfyearwiseprofit: !role.pdfyearwiseprofit
            }
        })
    }

    const itemWiseProfitAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallitemwisereport: !role.checkallitemwisereport,
                csvitemwisereport: !role.csvitemwisereport,
                excelitemwisereport: !role.excelitemwisereport,
                printitemwisereport: !role.printitemwisereport,
                pdfitemwisereport: !role.pdfitemwisereport
            }
        })
    }

    const itemSearchAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallitemsearch: !role.checkallitemsearch,
                excelitemsearch: !role.excelitemsearch,
                csvitemsearch: !role.csvitemsearch,
                printitemsearch: !role.printitemsearch,
                pdfitemsearch: !role.pdfitemsearch
            }
        })
    }

    const stockAdjustReportAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallstockadjustreport: !role.checkallstockadjustreport,
                excelstockadjustreport: !role.excelstockadjustreport,
                csvstockadjustreport: !role.csvstockadjustreport,
                printstockadjustreport: !role.printstockadjustreport,
                pdfstockadjustreport: !role.pdfstockadjustreport
            }
        })
    }

    const stockTransferReportAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallstocktransferreport: !role.checkallstocktransferreport,
                excelstocktransferreport: !role.excelstocktransferreport,
                csvstocktransferreport: !role.csvstocktransferreport,
                printstocktransferreport: !role.printstocktransferreport,
                pdfstocktransferreport: !role.pdfstocktransferreport
            }
        })
    }

    const stockRejectedReportAllSelect = () => {
        setRole((prevData) => {
            return {
                ...prevData,
                checkallstockrejectedreport: !role.checkallstockrejectedreport,
                csvstockrejectedreport: !role.csvstockrejectedreport,
                excelstockrejectedreport: !role.excelstockrejectedreport,
                printstockrejectedreport: !role.printstockrejectedreport,
                pdfstockrejectedreport: !role.pdfstockrejectedreport
            }
        })
    }

    const businessLocationAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkallbusinesslocation: !role.checkallbusinesslocation, activatebusinesslocation: !role.activatebusinesslocation, abusinesslocation: !role.abusinesslocation, ebusinesslocation: !role.ebusinesslocation, dbusinesslocation: !role.dbusinesslocation, excelbusinesslocation: !role.excelbusinesslocation, csvbusinesslocation: !role.csvbusinesslocation, printbusinesslocation: !role.printbusinesslocation, pdfbusinesslocation: !role.pdfbusinesslocation, }
        })
    }

    const taxrateAllSelect = () => {
        setRole((prevData) => {
            return { ...prevData, checkalltaxrate: !role.checkalltaxrate, ataxrate: !role.ataxrate, etaxrate: !role.etaxrate, dtaxrate: !role.dtaxrate, exceltaxrate: !role.exceltaxrate, csvtaxrate: !role.csvtaxrate, printtaxrate: !role.printtaxrate, pdftaxrate: !role.pdftaxrate }
        })
    }

    const fetchHandler = async () => {
        try {
            let response = await axios.get(`${SERVICE.ROLE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
            setRole(response.data.srole);
        } catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    useEffect(
        () => {
            fetchHandler();
        }, [id]
    )


    const backPage = useNavigate();

    const fetchRole = async () => {
        try {
            let roles = await axios.put(`${SERVICE.ROLE_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

                rolename: String(role.rolename),
                assignbusinessid: String(setngs.businessid),
                // User
                usermanagement: Boolean(role.usermanagement),
                alluser: Boolean(role.alluser),
                checkalluser: Boolean(role.checkalluser),
                vuser: Boolean(role.vuser),
                auser: Boolean(role.auser),
                euser: Boolean(role.euser),
                duser: Boolean(role.duser),
                exceluser: Boolean(role.exceluser),
                csvuser: Boolean(role.csvuser),
                printuser: Boolean(role.printuser),
                pdfuser: Boolean(role.pdfuser),
                // Role
                allrole: Boolean(role.allrole),
                checkallrole: Boolean(role.checkallrole),
                arole: Boolean(role.arole),
                erole: Boolean(role.erole),
                drole: Boolean(role.drole),
                excelrole: Boolean(role.excelrole),
                csvrole: Boolean(role.csvrole),
                printrole: Boolean(role.printrole),
                pdfrole: Boolean(role.pdfrole),
                // Department
                alldepartment: Boolean(role.alldepartment),
                checkalldepartment: Boolean(role.checkalldepartment),
                adepartment: Boolean(role.adepartment),
                exceldepartment: Boolean(role.exceldepartment),
                csvdepartment: Boolean(role.csvdepartment),
                printdepartment: Boolean(role.printdepartment),
                pdfdepartment: Boolean(role.pdfdepartment),
                edepartment: Boolean(role.edepartment),
                ddepartment: Boolean(role.ddepartment),

                // Product
                productmanagement: Boolean(role.productmanagement),
                // Category
                allcategory: Boolean(role.allcategory),
                checkallcategory: Boolean(role.checkallcategory),
                acategory: Boolean(role.acategory),
                ecategory: Boolean(role.ecategory),
                dcategory: Boolean(role.dcategory),
                printcategory: Boolean(role.printcategory),
                pdfcategory: Boolean(role.pdfcategory),
                // Unit
                allunit: Boolean(role.allunit),
                checkallunit: Boolean(role.checkallunit),
                aunit: Boolean(role.aunit),
                eunit: Boolean(role.eunit),
                dunit: Boolean(role.dunit),
                excelunit: Boolean(role.excelunit),
                csvunit: Boolean(role.csvunit),
                printunit: Boolean(role.printunit),
                pdfunit: Boolean(role.pdfunit),
                // Products
                allproduct: Boolean(role.allproduct),
                checkallproduct: Boolean(role.checkallproduct),
                vproduct: Boolean(role.vproduct),
                iproduct: Boolean(role.iproduct),
                aproduct: Boolean(role.aproduct),
                eproduct: Boolean(role.eproduct),
                dproduct: Boolean(role.dproduct),
                excelproduct: Boolean(role.excelproduct),
                csvproduct: Boolean(role.csvproduct),
                printproduct: Boolean(role.printproduct),
                pdfproduct: Boolean(role.pdfproduct),
                // Category wise report 
                allcatwisereport: Boolean(role.allcatwisereport),
                checkallcatwisereport: Boolean(role.checkallcatwisereport),
                csvcatwisereport: Boolean(role.csvcatwisereport),
                excelcatwisereport: Boolean(role.excelcatwisereport),
                printcatwisereport: Boolean(role.printcatwisereport),
                pdfcatwisereport: Boolean(role.pdfcatwisereport),
                // Sub category wise report
                allsubcatwisereport: Boolean(role.allsubcatwisereport),
                checkallsubcatwisereport: Boolean(role.checkallsubcatwisereport),
                csvsubcatwisereport: Boolean(role.csvsubcatwisereport),
                excelsubcatwisereport: Boolean(role.excelsubcatwisereport),
                printsubcatwisereport: Boolean(role.printsubcatwisereport),
                pdfsubcatwisereport: Boolean(role.pdfsubcatwisereport),
                //Unit wise report
                allunitwisereport: Boolean(role.allunitwisereport),
                checkallunitwisereport: Boolean(role.checkallunitwisereport),
                csvunitwisereport: Boolean(role.csvunitwisereport),
                excelunitwisereport: Boolean(role.excelunitwisereport),
                printunitwisereport: Boolean(role.printunitwisereport),
                pdfunitwisereport: Boolean(role.pdfunitwisereport),
                // Print Label
                allproductlabel: Boolean(role.allproductlabel),

                // Stock
                stockmanagement: Boolean(role.stockmanagement),
                // Currentstock
                acurrentstock: Boolean(role.acurrentstock),
                // Expiry Report
                allexpiryreport: Boolean(role.allexpiryreport),
                checkallexpiryreport: Boolean(role.checkallexpiryreport),
                excelexpiryreport: Boolean(role.excelexpiryreport),
                csvexpiryreport: Boolean(role.csvexpiryreport),
                printexpiryreport: Boolean(role.printexpiryreport),
                pdfexpiryreport: Boolean(role.pdfexpiryreport),

                // Location Wise Stock
                alllocationwisestockreport: Boolean(role.alllocationwisestockreport),
                checkalllocationwisestockreport: Boolean(role.checkalllocationwisestockreport),
                excellocationwisestockreport: Boolean(role.excellocationwisestockreport),
                csvlocationwisestockreport: Boolean(role.csvlocationwisestockreport),
                printlocationwisestockreport: Boolean(role.printlocationwisestockreport),
                pdflocationwisestockreport: Boolean(role.pdflocationwisestockreport),

                // Location Wise Expiry Report
                alllocationwiseexpreport: Boolean(role.alllocationwiseexpreport),
                checkalllocationwiseexpreport: Boolean(role.checkalllocationwiseexpreport),
                csvlocationwiseexpreport: Boolean(role.csvlocationwiseexpreport),
                excellocationwiseexpreport: Boolean(role.excellocationwiseexpreport),
                printlocationwiseexpreport: Boolean(role.printlocationwiseexpreport),
                pdflocationwiseexpreport: Boolean(role.pdflocationwiseexpreport),

                // Stock Report
                allstockreport: Boolean(role.allstockreport),
                checkallstockreport: Boolean(role.checkallstockreport),
                excelstockreport: Boolean(role.excelstockreport),
                csvstockreport: Boolean(role.csvstockreport),
                printstockreport: Boolean(role.printstockreport),
                pdftockreport: Boolean(role.pdftockreport),

                // Stock Transfer
                stocktransferlistmanagement: Boolean(role.stocktransferlistmanagement),
                allcurrentstocktransferlist: Boolean(role.allcurrentstocktransferlist),
                checkallcurrentstocktransferlist: Boolean(role.checkallcurrentstocktransferlist),
                vstocktransferlist: Boolean(role.vstocktransferlist),
                acurrentstocktransferlist: Boolean(role.acurrentstocktransferlist),
                excelcurrentstocktransferlist: Boolean(role.excelcurrentstocktransferlist),
                csvcurrentstocktransferlist: Boolean(role.csvcurrentstocktransferlist),
                pdfcurrentstocktransferlist: Boolean(role.pdfcurrentstocktransferlist),
                printcurrentstocktransferlist: Boolean(role.printcurrentstocktransferlist),

                // Stock Adjust
                stockadjustmanagement: Boolean(role.stockadjustmanagement),
                allcurrentstockadjust: Boolean(role.allcurrentstockadjust),
                checkallcurrentstockadjust: Boolean(role.checkallcurrentstockadjust),
                excelcurrentstockadjust: Boolean(role.excelcurrentstockadjust),
                csvcurrentstockadjust: Boolean(role.csvcurrentstockadjust),
                printcurrentstockadjust: Boolean(role.printcurrentstockadjust),
                pdfcurrentstockadjust: Boolean(role.pdfcurrentstockadjust),
                vstockadjust: Boolean(role.vstockadjust),

                // Sell
                sellmanagement: Boolean(role.sellmanagement),
                // Pos
                allpos: Boolean(role.allpos),
                checkallpos: Boolean(role.checkallpos),
                apos: Boolean(role.apos),
                epos: Boolean(role.epos),
                dpos: Boolean(role.dpos),
                vpos: Boolean(role.vpos),
                excelpos: Boolean(role.excelpos),
                csvpos: Boolean(role.csvpos),
                printpos: Boolean(role.printpos),
                pdfpos: Boolean(role.pdfpos),
                // Draft
                alldraft: Boolean(role.alldraft),
                checkalldraft: Boolean(role.checkalldraft),
                adraft: Boolean(role.adraft),
                edraft: Boolean(role.edraft),
                ddraft: Boolean(role.ddraft),
                vdraft: Boolean(role.vdraft),
                exceldraft: Boolean(role.exceldraft),
                csvdraft: Boolean(role.csvdraft),
                printdraft: Boolean(role.printdraft),
                pdfdraft: Boolean(role.pdfdraft),
                // Quotation
                allquotation: Boolean(role.allquotation),
                checkallquotation: Boolean(role.checkallquotation),
                aquotation: Boolean(role.aquotation),
                equotation: Boolean(role.equotation),
                dquotation: Boolean(role.dquotation),
                vquotation: Boolean(role.vquotation),
                excelquotation: Boolean(role.excelquotation),
                csvquotation: Boolean(role.csvquotation),
                printquotation: Boolean(role.printquotation),
                pdfquotation: Boolean(role.pdfquotation),

                // Expense
                expensemanagement: Boolean(role.expensemanagement),
                // Expense
                allexpense: Boolean(role.allexpense),
                checkallexpense: Boolean(role.checkallexpense),
                aexpense: Boolean(role.aexpense),
                eexpense: Boolean(role.eexpense),
                dexpense: Boolean(role.dexpense),
                excelexpense: Boolean(role.excelexpense),
                csvexpense: Boolean(role.csvexpense),
                printexpense: Boolean(role.printexpense),
                pdfexpense: Boolean(role.pdfexpense),
                // Expense Category

                dallexpensecategoryuser: Boolean(role.dallexpensecategoryuser),
                allexpensecategory: Boolean(role.allexpensecategory),
                checkallexpensecategory: Boolean(role.checkallexpensecategory),
                aexpensecategory: Boolean(role.aexpensecategory),
                eexpensecategory: Boolean(role.eexpensecategory),
                dexpensecategory: Boolean(role.dexpensecategory),
                excelexpensecategory: Boolean(role.excelexpensecategory),
                csvexpensecategory: Boolean(role.csvexpensecategory),
                printexpensecategory: Boolean(role.printexpensecategory),
                pdfexpensecategory: Boolean(role.pdfexpensecategory),


                // report module

                reportmanagenent: Boolean(role.reportmanagenent),

                // Category Wise Profit
                allcategorywiseprofit: Boolean(role.allcategorywiseprofit),
                checkallcategorywiseprofit: Boolean(role.checkallcategorywiseprofit),
                csvcategorywiseprofit: Boolean(role.csvcategorywiseprofit),
                excelcategorywiseprofit: Boolean(role.excelcategorywiseprofit),
                printcategorywiseprofit: Boolean(role.printcategorywiseprofit),
                pdfcategorywiseprofit: Boolean(role.pdfcategorywiseprofit),

                // Day Wise Profit
                alldaywiseprofit: Boolean(role.alldaywiseprofit),
                checkalldaywiseprofit: Boolean(role.checkalldaywiseprofit),
                csvdaywiseprofit: Boolean(role.csvdaywiseprofit),
                exceldaywiseprofit: Boolean(role.exceldaywiseprofit),
                printdaywiseprofit: Boolean(role.printdaywiseprofit),
                pdfdaywiseprofit: Boolean(role.pdfdaywiseprofit),

                //  Location Wise Profit Individual
                alllocationwiseprofit: Boolean(role.alllocationwiseprofit),
                checkalllocationwiseprofit: Boolean(role.checkalllocationwiseprofit),
                csvlocationwiseprofit: Boolean(role.csvlocationwiseprofit),
                excellocationwiseprofit: Boolean(role.excellocationwiseprofit),
                printlocationwiseprofit: Boolean(role.printlocationwiseprofit),
                pdflocationwiseprofit: Boolean(role.pdflocationwiseprofit),

                // Location wise profit Total
                alllocationwisetotalprofit: Boolean(role.alllocationwisetotalprofit),
                checkalllocationwisetotalprofit: Boolean(role.checkalllocationwisetotalprofit),
                excellocationwisetotalprofit: Boolean(role.excellocationwisetotalprofit),
                csvlocationwisetotalprofit: Boolean(role.csvlocationwisetotalprofit),
                printlocationwisetotalprofit: Boolean(role.printlocationwisetotalprofit),
                pdflocationwisetotalprofit: Boolean(role.pdflocationwisetotalprofit),

                // Month Wise Profit
                allmonthwiseprofit: Boolean(role.allmonthwiseprofit),
                checkallmonthwiseprofit: Boolean(role.checkallmonthwiseprofit),
                csvmonthwiseprofit: Boolean(role.csvmonthwiseprofit),
                excelmonthwiseprofit: Boolean(role.excelmonthwiseprofit),
                printmonthwiseprofit: Boolean(role.printmonthwiseprofit),
                pdfmonthwiseprofit: Boolean(role.pdfmonthwiseprofit),

                // Sub Category Wise Profit
                allsubcategorywiseprofit: Boolean(role.allsubcategorywiseprofit),
                checkallsubcategorywiseprofit: Boolean(role.checkallsubcategorywiseprofit),
                csvsubcategorywiseprofit: Boolean(role.csvsubcategorywiseprofit),
                excelsubcategorywiseprofit: Boolean(role.excelsubcategorywiseprofit),
                printsubcategorywiseprofit: Boolean(role.printsubcategorywiseprofit),
                pdfsubcategorywiseprofit: Boolean(role.pdfsubcategorywiseprofit),

                // Week Wise Profit
                allweekwiseprofit: Boolean(role.allweekwiseprofit),
                checkallweekwiseprofit: Boolean(role.checkallweekwiseprofit),
                csvweekwiseprofit: Boolean(role.csvweekwiseprofit),
                excelweekwiseprofit: Boolean(role.excelweekwiseprofit),
                printweekwiseprofit: Boolean(role.printweekwiseprofit),
                pdfweekwiseprofit: Boolean(role.pdfweekwiseprofit),

                // Year Wise Profit
                allyearwiseprofit: Boolean(role.allyearwiseprofit),
                checkallyearwiseprofit: Boolean(role.checkallyearwiseprofit),
                csvyearwiseprofit: Boolean(role.csvyearwiseprofit),
                excelyearwiseprofit: Boolean(role.excelyearwiseprofit),
                printyearwiseprofit: Boolean(role.printyearwiseprofit),
                pdfyearwiseprofit: Boolean(role.pdfyearwiseprofit),

                // Item Wise Profit report
                allitemwisereport: Boolean(role.allitemwisereport),
                checkallitemwisereport: Boolean(role.checkallitemwisereport),
                excelitemwisereport: Boolean(role.excelitemwisereport),
                csvitemwisereport: Boolean(role.csvitemwisereport),
                printitemwisereport: Boolean(role.printitemwisereport),
                pdfitemwisereport: Boolean(role.pdfitemwisereport),

                // Item Search
                allitemsearch: Boolean(role.allitemsearch),
                checkallitemsearch: Boolean(role.checkallitemsearch),
                excelitemsearch: Boolean(role.excelitemsearch),
                csvitemsearch: Boolean(role.csvitemsearch),
                printitemsearch: Boolean(role.printitemsearch),
                pdfitemsearch: Boolean(role.pdfitemsearch),

                // Stock Adjust Report
                allstockadjustreport: Boolean(role.allstockadjustreport),
                checkallstockadjustreport: Boolean(role.checkallstockadjustreport),
                excelstockadjustreport: Boolean(role.excelstockadjustreport),
                csvstockadjustreport: Boolean(role.csvstockadjustreport),
                printstockadjustreport: Boolean(role.printstockadjustreport),
                pdfstockadjustreport: Boolean(role.pdfstockadjustreport),

                // Stock Transfer Report
                allstocktransferreport: Boolean(role.allstocktransferreport),
                checkallstocktransferreport: Boolean(role.checkallstocktransferreport),
                excelstocktransferreport: Boolean(role.excelstocktransferreport),
                csvstocktransferreport: Boolean(role.csvstocktransferreport),
                printstocktransferreport: Boolean(role.printstocktransferreport),
                pdfstocktransferreport: Boolean(role.pdfstocktransferreport),

                // Stock Rejected Report
                allstockrejectedreport: Boolean(role.allstockrejectedreport),
                checkallstockrejectedreport: Boolean(role.checkallstockrejectedreport),
                excelstockrejectedreport: Boolean(role.excelstockrejectedreport),
                csvstockrejectedreport: Boolean(role.csvstockrejectedreport),
                printstockrejectedreport: Boolean(role.printstockrejectedreport),
                pdfstockrejectedreport: Boolean(role.pdfstockrejectedreport),

                // Settings
                settingsmanagement: Boolean(role.settingsmanagement),
                // Location
                allbusinesslocation: Boolean(role.allbusinesslocation),
                checkallbusinesslocation: Boolean(role.checkallbusinesslocation),
                activatebusinesslocation: Boolean(role.activatebusinesslocation),
                abusinesslocation: Boolean(role.abusinesslocation),
                ebusinesslocation: Boolean(role.ebusinesslocation),
                dbusinesslocation: Boolean(role.dbusinesslocation),
                excelbusinesslocation: Boolean(role.excelbusinesslocation),
                csvbusinesslocation: Boolean(role.csvbusinesslocation),
                printbusinesslocation: Boolean(role.printbusinesslocation),
                pdfbusinesslocation: Boolean(role.pdfbusinesslocation),
                // Taxrate
                alltaxrate: Boolean(role.alltaxrate),
                checkalltaxrate: Boolean(role.checkalltaxrate),
                ataxrate: Boolean(role.ataxrate),
                etaxrate: Boolean(role.etaxrate),
                dtaxrate: Boolean(role.dtaxrate),
                exceltaxrate: Boolean(role.exceltaxrate),
                csvtaxrate: Boolean(role.csvtaxrate),
                printtaxrate: Boolean(role.printtaxrate),
                pdftaxrate: Boolean(role.pdftaxrate),
                
                // Business Settings
                businesssettings: Boolean(role.businesssettings),

                // Dashboard
                home: Boolean(role.home),
                selectlocation: Boolean(role.selectlocation),
                from: Boolean(role.from),
                to: Boolean(role.to),
                totalpurchase: Boolean(role.totalpurchase),
                totalsales: Boolean(role.totalsales),
                purchasedue: Boolean(role.purchasedue),
                salesdue: Boolean(role.salesdue),
                totalsalesreturn: Boolean(role.totalsalesreturn),
                totalpurchasereturn: Boolean(role.totalpurchasereturn),
                expenses: Boolean(role.expenses),
                barchart: Boolean(role.barchart),
                topproductspiechart: Boolean(role.topproductspiechart),
                topcustomerspiechart: Boolean(role.topcustomerspiechart),
                stockalerttable: Boolean(role.stockalerttable),
                recentsalestable: Boolean(role.recentsalestable),
                topsellproductstable: Boolean(role.topsellproductstable),
            });
            setRole(roles.data);
            toast.success(roles.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            backPage('/user/role/list');
        }
        catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role.rolename == "") {
            setShowAlert("Please Enter Role Name!")
            handleClickOpen();
        }
        else {
            fetchRole();
        }
    }

    return (
        <Box>
            <Headtitle title={'Edit Role'} />
            <form onSubmit={handleSubmit}>
                <Box>
                    <Grid display="flex">
                        <Typography sx={userStyle.HeaderText}>Edit Role</Typography>
                    </Grid>
                </Box>
                <Box sx={userStyle.container}>
                    <Grid container spacing={2} sx={{
                        padding: '40px 20px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid #b97df0',
                        },
                    }}>
                        <Grid item md={5}>
                            <InputLabel htmlFor="component-outlined" sx={{ display: "flex" }}>Role Name<Typography style={{ color: "red" }}>*</Typography></InputLabel>
                            <FormControl size="small" fullWidth>
                                <OutlinedInput
                                    id="component-outlined"
                                    value={role.rolename}
                                    onChange={(e) => { setRole({ ...role, rolename: e.target.value }) }}
                                    type="text"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={7}></Grid>
                        <Grid item md={12}>
                            <InputLabel sx={{ fontWeight: '600' }}>Permissions</InputLabel>
                        </Grid>

                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.usermanagement)} onChange={(e) => setRole({ ...role, usermanagement: !role.usermanagement })} />} label="User management" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alluser)} onChange={(e) => setRole({ ...role, alluser: !role.alluser })} />} label="User" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalluser)} onChange={(e) => userAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.auser)} onChange={(e) => setRole({ ...role, auser: !role.auser })} />} label="Add user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.euser)} onChange={(e) => setRole({ ...role, euser: !role.euser })} />} label="Edit user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.duser)} onChange={(e) => setRole({ ...role, duser: !role.duser })} />} label="Delete user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vuser)} onChange={(e) => setRole({ ...role, vuser: !role.vuser })} />} label="View user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceluser)} onChange={(e) => setRole({ ...role, exceluser: !role.exceluser })} />} label="Excel user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvuser)} onChange={(e) => setRole({ ...role, csvuser: !role.csvuser })} />} label="CSV user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printuser)} onChange={(e) => setRole({ ...role, printuser: !role.printuser })} />} label="Print user" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfuser)} onChange={(e) => setRole({ ...role, pdfuser: !role.pdfuser })} />} label="Pdf user" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allrole)} onChange={(e) => setRole({ ...role, allrole: !role.allrole })} />} label="Role" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallrole)} onChange={(e) => roleAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.arole)} onChange={(e) => setRole({ ...role, arole: !role.arole })} />} label="Add role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.erole)} onChange={(e) => setRole({ ...role, erole: !role.erole })} />} label="Edit role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.drole)} onChange={(e) => setRole({ ...role, drole: !role.drole })} />} label="Delete role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelrole)} onChange={(e) => setRole({ ...role, excelrole: !role.excelrole })} />} label="Excel role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvrole)} onChange={(e) => setRole({ ...role, csvrole: !role.csvrole })} />} label="CSV role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printrole)} onChange={(e) => setRole({ ...role, printrole: !role.printrole })} />} label="Print role" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfrole)} onChange={(e) => setRole({ ...role, pdfrole: !role.pdfrole })} />} label="Pdf role" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alldepartment)} onChange={(e) => setRole({ ...role, alldepartment: !role.alldepartment })} />} label="Department" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalldepartment)} onChange={(e) => departmentAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.adepartment)} onChange={(e) => setRole({ ...role, adepartment: !role.adepartment })} />} label="Add Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.edepartment)} onChange={(e) => setRole({ ...role, edepartment: !role.edepartment })} />} label="Edit Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ddepartment)} onChange={(e) => setRole({ ...role, ddepartment: !role.ddepartment })} />} label="Delete Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceldepartment)} onChange={(e) => setRole({ ...role, exceldepartment: !role.exceldepartment })} />} label="Excel Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvdepartment)} onChange={(e) => setRole({ ...role, csvdepartment: !role.csvdepartment })} />} label="Csv Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printdepartment)} onChange={(e) => setRole({ ...role, printdepartment: !role.printdepartment })} />} label="Print Department" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfdepartment)} onChange={(e) => setRole({ ...role, pdfdepartment: !role.pdfdepartment })} />} label="Pdf Department" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />

                        {/* Product */}
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.productmanagement)} onChange={(e) => setRole({ ...role, productmanagement: !role.productmanagement })} />} label="Product management" />
                            </FormGroup>
                        </Grid>
                        {/* Category */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allcategory)} onChange={(e) => setRole({ ...role, allcategory: !role.allcategory })} />} label="Category" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallcategory)} onChange={(e) => categoryAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.acategory)} onChange={(e) => setRole({ ...role, acategory: !role.acategory })} />} label="Add category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ecategory)} onChange={(e) => setRole({ ...role, ecategory: !role.ecategory })} />} label="Edit category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dcategory)} onChange={(e) => setRole({ ...role, dcategory: !role.dcategory })} />} label="Delete category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printcategory)} onChange={(e) => setRole({ ...role, printcategory: !role.printcategory })} />} label="Print category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfcategory)} onChange={(e) => setRole({ ...role, pdfcategory: !role.pdfcategory })} />} label="Pdf category" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allunit)} onChange={(e) => setRole({ ...role, allunit: !role.allunit })} />} label="Unit" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallunit)} onChange={(e) => unitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aunit)} onChange={(e) => setRole({ ...role, aunit: !role.aunit })} />} label="Add unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.eunit)} onChange={(e) => setRole({ ...role, eunit: !role.eunit })} />} label="Edit unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dunit)} onChange={(e) => setRole({ ...role, dunit: !role.dunit })} />} label="Delete unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelunit)} onChange={(e) => setRole({ ...role, excelunit: !role.excelunit })} />} label="Excel unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvunit)} onChange={(e) => setRole({ ...role, csvunit: !role.csvunit })} />} label="CSV unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printunit)} onChange={(e) => setRole({ ...role, printunit: !role.printunit })} />} label="Print unit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfunit)} onChange={(e) => setRole({ ...role, pdfunit: !role.pdfunit })} />} label="Pdf unit" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allproduct)} onChange={(e) => setRole({ ...role, allproduct: !role.allproduct })} />} label="Product" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallproduct)} onChange={(e) => productAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.iproduct)} onChange={(e) => setRole({ ...role, iproduct: !role.iproduct })} />} label="Import product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aproduct)} onChange={(e) => setRole({ ...role, aproduct: !role.aproduct })} />} label="Add product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.eproduct)} onChange={(e) => setRole({ ...role, eproduct: !role.eproduct })} />} label="Edit product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dproduct)} onChange={(e) => setRole({ ...role, dproduct: !role.dproduct })} />} label="Delete product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vproduct)} onChange={(e) => setRole({ ...role, vproduct: !role.vproduct })} />} label="View product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelproduct)} onChange={(e) => setRole({ ...role, excelproduct: !role.excelproduct })} />} label="Excel product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvproduct)} onChange={(e) => setRole({ ...role, csvproduct: !role.csvproduct })} />} label="CSV product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printproduct)} onChange={(e) => setRole({ ...role, printproduct: !role.printproduct })} />} label="Print product" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfproduct)} onChange={(e) => setRole({ ...role, pdfproduct: !role.pdfproduct })} />} label="Pdf product" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Category wise Report  Start*/}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allcatwisereport)} onChange={(e) => setRole({ ...role, allcatwisereport: !role.allcatwisereport })} />} label="Category Wise Report" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallcatwisereport)} onChange={(e) => categoryWiseReportAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvcatwisereport)} onChange={(e) => setRole({ ...role, csvcatwisereport: !role.csvcatwisereport })} />} label="Csv Category Wise Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelcatwisereport)} onChange={(e) => setRole({ ...role, excelcatwisereport: !role.excelcatwisereport })} />} label="Excel Category Wise Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printcatwisereport)} onChange={(e) => setRole({ ...role, printcatwisereport: !role.printcatwisereport })} />} label="Print Category Wise Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfcatwisereport)} onChange={(e) => setRole({ ...role, pdfcatwisereport: !role.pdfcatwisereport })} />} label="Pdf Category Wise Report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Category Wise Report End */}

                        {/* Sub Category wise Report  Start*/}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allsubcatwisereport)} onChange={(e) => setRole({ ...role, allsubcatwisereport: !role.allsubcatwisereport })} />} label="Sub Category Wise Report" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallsubcatwisereport)} onChange={(e) => subCategoryWiseReportAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvsubcatwisereport)} onChange={(e) => setRole({ ...role, csvsubcatwisereport: !role.csvsubcatwisereport })} />} label="Csv Sub Category Wise Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelsubcatwisereport)} onChange={(e) => setRole({ ...role, excelsubcatwisereport: !role.excelsubcatwisereport })} />} label="Excel Sub Category Wise Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printsubcatwisereport)} onChange={(e) => setRole({ ...role, printsubcatwisereport: !role.printsubcatwisereport })} />} label="Print Sub Category Wise Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfsubcatwisereport)} onChange={(e) => setRole({ ...role, pdfsubcatwisereport: !role.pdfsubcatwisereport })} />} label="Pdf Sub Category Wise Report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Sub Category Wise Report End */}

                        {/*Unit wise Report  Start*/}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allunitwisereport)} onChange={(e) => setRole({ ...role, allunitwisereport: !role.allunitwisereport })} />} label="Unit Wise Report" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallunitwisereport)} onChange={(e) => unitWiseReportAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvunitwisereport)} onChange={(e) => setRole({ ...role, csvunitwisereport: !role.csvunitwisereport })} />} label="Csv Unit Wise Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelunitwisereport)} onChange={(e) => setRole({ ...role, excelunitwisereport: !role.excelunitwisereport })} />} label="Excel Unit Wise Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printunitwisereport)} onChange={(e) => setRole({ ...role, printunitwisereport: !role.printunitwisereport })} />} label="Print Unit Wise Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfunitwisereport)} onChange={(e) => setRole({ ...role, pdfunitwisereport: !role.pdfunitwisereport })} />} label="Pdf Unit Wise Report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Unit Wise Report End */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={7}></Grid>
                        <Grid item md={5}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allproductlabel)} onChange={(e) => setRole({ ...role, allproductlabel: !role.allproductlabel })} />} label="Print Label" />
                            </FormGroup><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        {/* Sell */}
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.sellmanagement)} onChange={(e) => setRole({ ...role, sellmanagement: !role.sellmanagement })} />} label="Sell management" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allpos)} onChange={(e) => setRole({ ...role, allpos: !role.allpos })} />} label="Pos" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallpos)} onChange={(e) => posAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.apos)} onChange={(e) => setRole({ ...role, apos: !role.apos })} />} label="Add pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.epos)} onChange={(e) => setRole({ ...role, epos: !role.epos })} />} label="Edit pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dpos)} onChange={(e) => setRole({ ...role, dpos: !role.dpos })} />} label="Delete pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vpos)} onChange={(e) => setRole({ ...role, vpos: !role.vpos })} />} label="View pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelpos)} onChange={(e) => setRole({ ...role, excelpos: !role.excelpos })} />} label="Excel pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvpos)} onChange={(e) => setRole({ ...role, csvpos: !role.csvpos })} />} label="Csv pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printpos)} onChange={(e) => setRole({ ...role, printpos: !role.printpos })} />} label="Print pos" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfpos)} onChange={(e) => setRole({ ...role, pdfpos: !role.pdfpos })} />} label="Pdf pos" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        {/* Draft */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alldraft)} onChange={(e) => setRole({ ...role, alldraft: !role.alldraft })} />} label="Draft" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalldraft)} onChange={(e) => draftAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.adraft)} onChange={(e) => setRole({ ...role, adraft: !role.adraft })} />} label="Add draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.edraft)} onChange={(e) => setRole({ ...role, edraft: !role.edraft })} />} label="Edit draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ddraft)} onChange={(e) => setRole({ ...role, ddraft: !role.ddraft })} />} label="Delete draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vdraft)} onChange={(e) => setRole({ ...role, vdraft: !role.vdraft })} />} label="View draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceldraft)} onChange={(e) => setRole({ ...role, exceldraft: !role.exceldraft })} />} label="Excel draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvdraft)} onChange={(e) => setRole({ ...role, csvdraft: !role.csvdraft })} />} label="Csv draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printdraft)} onChange={(e) => setRole({ ...role, printdraft: !role.printdraft })} />} label="Print draft" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfdraft)} onChange={(e) => setRole({ ...role, pdfdraft: !role.pdfdraft })} />} label="Pdf draft" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        {/* Quatation */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allquotation)} onChange={(e) => setRole({ ...role, allquotation: !role.allquotation })} />} label="Quotation" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallquotation)} onChange={(e) => quotationAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aquotation)} onChange={(e) => setRole({ ...role, aquotation: !role.aquotation })} />} label="Add quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.equotation)} onChange={(e) => setRole({ ...role, equotation: !role.equotation })} />} label="Edit quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dquotation)} onChange={(e) => setRole({ ...role, dquotation: !role.dquotation })} />} label="Delete quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vquotation)} onChange={(e) => setRole({ ...role, vquotation: !role.vquotation })} />} label="View quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelquotation)} onChange={(e) => setRole({ ...role, excelquotation: !role.excelquotation })} />} label="Excel quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvquotation)} onChange={(e) => setRole({ ...role, csvquotation: !role.csvquotation })} />} label="Csv quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printquotation)} onChange={(e) => setRole({ ...role, printquotation: !role.printquotation })} />} label="Print quotation" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfquotation)} onChange={(e) => setRole({ ...role, pdfquotation: !role.pdfquotation })} />} label="Pdf quotation" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        {/* Stock */}
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.stockmanagement)} onChange={(e) => setRole({ ...role, stockmanagement: !role.stockmanagement })} />} label="Stock management" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={7}></Grid>
                        <Grid item md={5}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.acurrentstock)} onChange={(e) => setRole({ ...role, acurrentstock: !role.acurrentstock })} />} label="Add current stock" />
                            </FormGroup><br /><hr /><br />
                        </Grid>

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allexpiryreport)} onChange={(e) => setRole({ ...role, allexpiryreport: !role.allexpiryreport })} />} label="Expiry Stock Report" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallexpiryreport)} onChange={(e) => expiryReportAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelexpiryreport)} onChange={(e) => setRole({ ...role, excelexpiryreport: !role.excelexpiryreport })} />} label="Excel expiry stock report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvexpiryreport)} onChange={(e) => setRole({ ...role, csvexpiryreport: !role.csvexpiryreport })} />} label="CSV expirty stock report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printexpiryreport)} onChange={(e) => setRole({ ...role, printexpiryreport: !role.printexpiryreport })} />} label="Print expiry stock report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfexpiryreport)} onChange={(e) => setRole({ ...role, pdfexpiryreport: !role.pdfexpiryreport })} />} label="Pdf expiry stock report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alllocationwisestockreport)} onChange={(e) => setRole({ ...role, alllocationwisestockreport: !role.alllocationwisestockreport })} />} label="Location Wise Stock Report" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalllocationwisestockreport)} onChange={(e) => LocationWiseStockReportAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <Grid>
                                            <FormGroup>
                                                <FormControlLabel control={<Checkbox checked={Boolean(role.excellocationwisestockreport)} onChange={(e) => setRole({ ...role, excellocationwisestockreport: !role.excellocationwisestockreport })} />} label="Excel location wise stock report" />
                                            </FormGroup>
                                        </Grid>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvlocationwisestockreport)} onChange={(e) => setRole({ ...role, csvlocationwisestockreport: !role.csvlocationwisestockreport })} />} label="CSV location wise stock report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printlocationwisestockreport)} onChange={(e) => setRole({ ...role, printlocationwisestockreport: !role.printlocationwisestockreport })} />} label="Print location wise stock report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdflocationwisestockreport)} onChange={(e) => setRole({ ...role, pdflocationwisestockreport: !role.pdflocationwisestockreport })} />} label="Pdf location wise stock report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Location Wise Expiry Report Start */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alllocationwiseexpreport)} onChange={(e) => setRole({ ...role, alllocationwiseexpreport: !role.alllocationwiseexpreport })} />} label="Location Wise Expiry Report" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalllocationwiseexpreport)} onChange={(e) => LocationWiseExpirykReportAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excellocationwiseexpreport)} onChange={(e) => setRole({ ...role, excellocationwiseexpreport: !role.excellocationwiseexpreport })} />} label="Excel location wise Expiry report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvlocationwiseexpreport)} onChange={(e) => setRole({ ...role, csvlocationwiseexpreport: !role.csvlocationwiseexpreport })} />} label="CSV location wise Expiry report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printlocationwiseexpreport)} onChange={(e) => setRole({ ...role, printlocationwiseexpreport: !role.printlocationwiseexpreport })} />} label="Print location wise Expiry report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdflocationwiseexpreport)} onChange={(e) => setRole({ ...role, pdflocationwiseexpreport: !role.pdflocationwiseexpreport })} />} label="Pdf location wise Expiry report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Location Wise Expiry Report End */}

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allstockreport)} onChange={(e) => setRole({ ...role, allstockreport: !role.allstockreport })} />} label="Stock Report" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallstockreport)} onChange={(e) => stockReportAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelstockreport)} onChange={(e) => setRole({ ...role, excelstockreport: !role.excelstockreport })} />} label="Excel stock report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvstockreport)} onChange={(e) => setRole({ ...role, csvstockreport: !role.csvstockreport })} />} label="CSV stock report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printstockreport)} onChange={(e) => setRole({ ...role, printstockreport: !role.printstockreport })} />} label="Print stock report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdftockreport)} onChange={(e) => setRole({ ...role, pdftockreport: !role.pdftockreport })} />} label="Pdf stock report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        {/* Stock Transfer Start */}
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.stocktransferlistmanagement)} onChange={(e) => setRole({ ...role, stocktransferlistmanagement: !role.stocktransferlistmanagement })} />} label="Stock Transfer Management" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allcurrentstocktransferlist)} onChange={(e) => setRole({ ...role, allcurrentstocktransferlist: !role.allcurrentstocktransferlist })} />} label="Stock Transfer List" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallcurrentstocktransferlist)} onChange={(e) => stockTransferListAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.acurrentstocktransferlist)} onChange={(e) => setRole({ ...role, acurrentstocktransferlist: !role.acurrentstocktransferlist })} />} label="Add Stock Transfer List" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vstocktransferlist)} onChange={(e) => setRole({ ...role, vstocktransferlist: !role.vstocktransferlist })} />} label="View Stock Transfer List" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelcurrentstocktransferlist)} onChange={(e) => setRole({ ...role, excelcurrentstocktransferlist: !role.excelcurrentstocktransferlist })} />} label="Excel Stock Transfer List" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvcurrentstocktransferlist)} onChange={(e) => setRole({ ...role, csvcurrentstocktransferlist: !role.csvcurrentstocktransferlist })} />} label="Csv Stock Transfer List" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfcurrentstocktransferlist)} onChange={(e) => setRole({ ...role, pdfcurrentstocktransferlist: !role.pdfcurrentstocktransferlist })} />} label="Pdf Stock Transfer List" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printcurrentstocktransferlist)} onChange={(e) => setRole({ ...role, printcurrentstocktransferlist: !role.printcurrentstocktransferlist })} />} label="Print Stock Transfer List" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Stock Transfer End */}

                        {/* Stock Adjust Start */}

                        <Divider sx={{ my: 2 }} />
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.stockadjustmanagement)} onChange={(e) => setRole({ ...role, stockadjustmanagement: !role.stockadjustmanagement })} />} label="Stock Adjust Management" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allcurrentstockadjust)} onChange={(e) => setRole({ ...role, allcurrentstockadjust: !role.allcurrentstockadjust })} />} label="Stock Adjust" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallcurrentstockadjust)} onChange={(e) => stockAdjustListAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.vstockadjust)} onChange={(e) => setRole({ ...role, vstockadjust: !role.vstockadjust })} />} label="View Stock Adjust" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelcurrentstockadjust)} onChange={(e) => setRole({ ...role, excelcurrentstockadjust: !role.excelcurrentstockadjust })} />} label="Excel Stock Adjust" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvcurrentstockadjust)} onChange={(e) => setRole({ ...role, csvcurrentstockadjust: !role.csvcurrentstockadjust })} />} label="Csv Stock Adjust" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printcurrentstockadjust)} onChange={(e) => setRole({ ...role, printcurrentstockadjust: !role.printcurrentstockadjust })} />} label="Print Stock Adjust" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfcurrentstockadjust)} onChange={(e) => setRole({ ...role, pdfcurrentstockadjust: !role.pdfcurrentstockadjust })} />} label="Pdf Stock Adjust" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        {/* Expense */}
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.expensemanagement)} onChange={(e) => setRole({ ...role, expensemanagement: !role.expensemanagement })} />} label="Expense management" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allexpense)} onChange={(e) => setRole({ ...role, allexpense: !role.allexpense })} />} label="Expense" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallexpense)} onChange={(e) => expenseAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aexpense)} onChange={(e) => setRole({ ...role, aexpense: !role.aexpense })} />} label="Add expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.eexpense)} onChange={(e) => setRole({ ...role, eexpense: !role.eexpense })} />} label="Edit expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dexpense)} onChange={(e) => setRole({ ...role, dexpense: !role.dexpense })} />} label="Delete expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelexpense)} onChange={(e) => setRole({ ...role, excelexpense: !role.excelexpense })} />} label="Excel expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvexpense)} onChange={(e) => setRole({ ...role, csvexpense: !role.csvexpense })} />} label="Csv expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printexpense)} onChange={(e) => setRole({ ...role, printexpense: !role.printexpense })} />} label="Print expense" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfexpense)} onChange={(e) => setRole({ ...role, pdfexpense: !role.pdfexpense })} />} label="Pdf expense" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        {/* Expense Category */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allexpensecategory)} onChange={(e) => setRole({ ...role, allexpensecategory: !role.allexpensecategory })} />} label="Expense category" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallexpensecategory)} onChange={(e) => expenseCategoryAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.aexpensecategory)} onChange={(e) => setRole({ ...role, aexpensecategory: !role.aexpensecategory })} />} label="Add expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.eexpensecategory)} onChange={(e) => setRole({ ...role, eexpensecategory: !role.eexpensecategory })} />} label="Edit expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dexpensecategory)} onChange={(e) => setRole({ ...role, dexpensecategory: !role.dexpensecategory })} />} label="Delete expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelexpensecategory)} onChange={(e) => setRole({ ...role, excelexpensecategory: !role.excelexpensecategory })} />} label="Excel expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvexpensecategory)} onChange={(e) => setRole({ ...role, csvexpensecategory: !role.csvexpensecategory })} />} label="Csv expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printexpensecategory)} onChange={(e) => setRole({ ...role, printexpensecategory: !role.printexpensecategory })} />} label="Print expense category" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfexpensecategory)} onChange={(e) => setRole({ ...role, pdfexpensecategory: !role.pdfexpensecategory })} />} label="Pdf expense category" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />

                        {/* Report Start */}
                        {/* Category Wise Profit */}
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.reportmanagenent)} onChange={(e) => setRole({ ...role, reportmanagenent: !role.reportmanagenent })} />} label="Report management" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allcategorywiseprofit)} onChange={(e) => setRole({ ...role, allcategorywiseprofit: !role.allcategorywiseprofit })} />} label="Category Wise Profit" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallcategorywiseprofit)} onChange={(e) => categoryWiseProfitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelcategorywiseprofit)} onChange={(e) => setRole({ ...role, excelcategorywiseprofit: !role.excelcategorywiseprofit })} />} label="Excel Category Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvcategorywiseprofit)} onChange={(e) => setRole({ ...role, csvcategorywiseprofit: !role.csvcategorywiseprofit })} />} label="Csv Category Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printcategorywiseprofit)} onChange={(e) => setRole({ ...role, printcategorywiseprofit: !role.printcategorywiseprofit })} />} label="Print Category Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfcategorywiseprofit)} onChange={(e) => setRole({ ...role, pdfcategorywiseprofit: !role.pdfcategorywiseprofit })} />} label="Pdf Category Wise Profit" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Day Wise Profit */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alldaywiseprofit)} onChange={(e) => setRole({ ...role, alldaywiseprofit: !role.alldaywiseprofit })} />} label="Day Wise Profit" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalldaywiseprofit)} onChange={(e) => dayWiseProfitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceldaywiseprofit)} onChange={(e) => setRole({ ...role, exceldaywiseprofit: !role.exceldaywiseprofit })} />} label="Excel Day Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvdaywiseprofit)} onChange={(e) => setRole({ ...role, csvdaywiseprofit: !role.csvdaywiseprofit })} />} label="Csv Day Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printdaywiseprofit)} onChange={(e) => setRole({ ...role, printdaywiseprofit: !role.printdaywiseprofit })} />} label="Print Day Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfdaywiseprofit)} onChange={(e) => setRole({ ...role, pdfdaywiseprofit: !role.pdfdaywiseprofit })} />} label="Pdf Day Wise Profit" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Location Wise Profit Individual*/}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alllocationwiseprofit)} onChange={(e) => setRole({ ...role, alllocationwiseprofit: !role.alllocationwiseprofit })} />} label="Location Wise Profit Individual" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalllocationwiseprofit)} onChange={(e) => locationWiseIndProfitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excellocationwiseprofit)} onChange={(e) => setRole({ ...role, excellocationwiseprofit: !role.excellocationwiseprofit })} />} label="Excel Location Wise Profit Individual" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvlocationwiseprofit)} onChange={(e) => setRole({ ...role, csvlocationwiseprofit: !role.csvlocationwiseprofit })} />} label="Csv Location Wise Profit Individual" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printlocationwiseprofit)} onChange={(e) => setRole({ ...role, printlocationwiseprofit: !role.printlocationwiseprofit })} />} label="Print Location Wise Profit Individual" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdflocationwiseprofit)} onChange={(e) => setRole({ ...role, pdflocationwiseprofit: !role.pdflocationwiseprofit })} />} label="Pdf Location Wise Profit Individual" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Location Wise Profit Total*/}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alllocationwisetotalprofit)} onChange={(e) => setRole({ ...role, alllocationwisetotalprofit: !role.alllocationwisetotalprofit })} />} label="Location Wise Profit Total" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalllocationwisetotalprofit)} onChange={(e) => locationWiseTotProfitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excellocationwisetotalprofit)} onChange={(e) => setRole({ ...role, excellocationwisetotalprofit: !role.excellocationwisetotalprofit })} />} label="Excel Location Wise Profit Total" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvlocationwisetotalprofit)} onChange={(e) => setRole({ ...role, csvlocationwisetotalprofit: !role.csvlocationwisetotalprofit })} />} label="Csv Location Wise Profit Total" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printlocationwisetotalprofit)} onChange={(e) => setRole({ ...role, printlocationwisetotalprofit: !role.printlocationwisetotalprofit })} />} label="Print Location Wise Profit Total" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdflocationwisetotalprofit)} onChange={(e) => setRole({ ...role, pdflocationwisetotalprofit: !role.pdflocationwisetotalprofit })} />} label="Pdf Location Wise Profit Total" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Sub Category Wise Profit */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allsubcategorywiseprofit)} onChange={(e) => setRole({ ...role, allsubcategorywiseprofit: !role.allsubcategorywiseprofit })} />} label="Sub Category Wise Profit" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallsubcategorywiseprofit)} onChange={(e) => subCatWiseProfitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelsubcategorywiseprofit)} onChange={(e) => setRole({ ...role, excelsubcategorywiseprofit: !role.excelsubcategorywiseprofit })} />} label="Excel Sub Category Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvsubcategorywiseprofit)} onChange={(e) => setRole({ ...role, csvsubcategorywiseprofit: !role.csvsubcategorywiseprofit })} />} label="Csv Sub Category Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printsubcategorywiseprofit)} onChange={(e) => setRole({ ...role, printsubcategorywiseprofit: !role.printsubcategorywiseprofit })} />} label="Print Sub Category Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfsubcategorywiseprofit)} onChange={(e) => setRole({ ...role, pdfsubcategorywiseprofit: !role.pdfsubcategorywiseprofit })} />} label="Pdf Sub Category Wise Profit" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Month Wise Profit */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allmonthwiseprofit)} onChange={(e) => setRole({ ...role, allmonthwiseprofit: !role.allmonthwiseprofit })} />} label="Month Wise Profit" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallmonthwiseprofit)} onChange={(e) => monthWiseProfitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelmonthwiseprofit)} onChange={(e) => setRole({ ...role, excelmonthwiseprofit: !role.excelmonthwiseprofit })} />} label="Excel Month Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvmonthwiseprofit)} onChange={(e) => setRole({ ...role, csvmonthwiseprofit: !role.csvmonthwiseprofit })} />} label="Csv Month Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printmonthwiseprofit)} onChange={(e) => setRole({ ...role, printmonthwiseprofit: !role.printmonthwiseprofit })} />} label="Print Month Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfmonthwiseprofit)} onChange={(e) => setRole({ ...role, pdfmonthwiseprofit: !role.pdfmonthwiseprofit })} />} label="Pdf Month Wise Profit" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Week Wise Profit */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allweekwiseprofit)} onChange={(e) => setRole({ ...role, allweekwiseprofit: !role.allweekwiseprofit })} />} label="Week Wise Profit" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallweekwiseprofit)} onChange={(e) => weekWiseProfitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelweekwiseprofit)} onChange={(e) => setRole({ ...role, excelweekwiseprofit: !role.excelweekwiseprofit })} />} label="Excel Week Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvweekwiseprofit)} onChange={(e) => setRole({ ...role, csvweekwiseprofit: !role.csvweekwiseprofit })} />} label="Csv Week Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printweekwiseprofit)} onChange={(e) => setRole({ ...role, printweekwiseprofit: !role.printweekwiseprofit })} />} label="Print Week Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfweekwiseprofit)} onChange={(e) => setRole({ ...role, pdfweekwiseprofit: !role.pdfweekwiseprofit })} />} label="Pdf Week Wise Profit" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Year Wise Profit */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allyearwiseprofit)} onChange={(e) => setRole({ ...role, allyearwiseprofit: !role.allyearwiseprofit })} />} label="Year Wise Profit" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallyearwiseprofit)} onChange={(e) => yearWiseProfitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelyearwiseprofit)} onChange={(e) => setRole({ ...role, excelyearwiseprofit: !role.excelyearwiseprofit })} />} label="Excel Year Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvyearwiseprofit)} onChange={(e) => setRole({ ...role, csvyearwiseprofit: !role.csvyearwiseprofit })} />} label="Csv Year Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printyearwiseprofit)} onChange={(e) => setRole({ ...role, printyearwiseprofit: !role.printyearwiseprofit })} />} label="Print Year Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfyearwiseprofit)} onChange={(e) => setRole({ ...role, pdfyearwiseprofit: !role.pdfyearwiseprofit })} />} label="Pdf Year Wise Profit" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Item Wise Profit */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allitemwisereport)} onChange={(e) => setRole({ ...role, allitemwisereport: !role.allitemwisereport })} />} label="Item Wise Profit" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallitemwisereport)} onChange={(e) => itemWiseProfitAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelitemwisereport)} onChange={(e) => setRole({ ...role, excelitemwisereport: !role.excelitemwisereport })} />} label="Excel Item Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvitemwisereport)} onChange={(e) => setRole({ ...role, csvitemwisereport: !role.csvitemwisereport })} />} label="Csv Item Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printitemwisereport)} onChange={(e) => setRole({ ...role, printitemwisereport: !role.printitemwisereport })} />} label="Print Item Wise Profit" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfitemwisereport)} onChange={(e) => setRole({ ...role, pdfitemwisereport: !role.pdfitemwisereport })} />} label="Pdf Item Wise Profit" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Item Search */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allitemsearch)} onChange={(e) => setRole({ ...role, allitemsearch: !role.allitemsearch })} />} label="Item Search" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallitemsearch)} onChange={(e) => itemSearchAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelitemsearch)} onChange={(e) => setRole({ ...role, excelitemsearch: !role.excelitemsearch })} />} label="Excel Item Search" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvitemsearch)} onChange={(e) => setRole({ ...role, csvitemsearch: !role.csvitemsearch })} />} label="Csv Item Search" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printitemsearch)} onChange={(e) => setRole({ ...role, printitemsearch: !role.printitemsearch })} />} label="Print Item Search" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfitemsearch)} onChange={(e) => setRole({ ...role, pdfitemsearch: !role.pdfitemsearch })} />} label="Pdf Item Search" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Stock Adjust Report */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allstockadjustreport)} onChange={(e) => setRole({ ...role, allstockadjustreport: !role.allstockadjustreport })} />} label="Stock Adjust Report" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallstockadjustreport)} onChange={(e) => stockAdjustReportAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelstockadjustreport)} onChange={(e) => setRole({ ...role, excelstockadjustreport: !role.excelstockadjustreport })} />} label="Excel Stock Adjust Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvstockadjustreport)} onChange={(e) => setRole({ ...role, csvstockadjustreport: !role.csvstockadjustreport })} />} label="Csv Stock Adjust Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printstockadjustreport)} onChange={(e) => setRole({ ...role, printstockadjustreport: !role.printstockadjustreport })} />} label="Print Stock Adjust Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfstockadjustreport)} onChange={(e) => setRole({ ...role, pdfstockadjustreport: !role.pdfstockadjustreport })} />} label="Pdf Stock Adjust Report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Stock Transfer Report */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allstocktransferreport)} onChange={(e) => setRole({ ...role, allstocktransferreport: !role.allstocktransferreport })} />} label="Stock Transfered Report" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallstocktransferreport)} onChange={(e) => stockTransferReportAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelstocktransferreport)} onChange={(e) => setRole({ ...role, excelstocktransferreport: !role.excelstocktransferreport })} />} label="Excel Stock Transfered Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvstocktransferreport)} onChange={(e) => setRole({ ...role, csvstocktransferreport: !role.csvstocktransferreport })} />} label="Csv Stock Transfered Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printstocktransferreport)} onChange={(e) => setRole({ ...role, printstocktransferreport: !role.printstocktransferreport })} />} label="Print Stock Transfered Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfstocktransferreport)} onChange={(e) => setRole({ ...role, pdfstocktransferreport: !role.pdfstocktransferreport })} />} label="Pdf Stock Transfered Report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Stock Rejected Report */}
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allstockrejectedreport)} onChange={(e) => setRole({ ...role, allstockrejectedreport: !role.allstockrejectedreport })} />} label="Stock Rejected Report" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallstockrejectedreport)} onChange={(e) => stockRejectedReportAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelstockrejectedreport)} onChange={(e) => setRole({ ...role, excelstockrejectedreport: !role.excelstockrejectedreport })} />} label="Excel Stock Rejected Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvstockrejectedreport)} onChange={(e) => setRole({ ...role, csvstockrejectedreport: !role.csvstockrejectedreport })} />} label="Csv Stock Rejected Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printstockrejectedreport)} onChange={(e) => setRole({ ...role, printstockrejectedreport: !role.printstockrejectedreport })} />} label="Print Stock Rejected Report" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfstockrejectedreport)} onChange={(e) => setRole({ ...role, pdfstockrejectedreport: !role.pdfstockrejectedreport })} />} label="Pdf Stock Rejected Report" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>

                        {/* Report End */}

                        {/* Settings */}
                        <Grid item md={12}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.settingsmanagement)} onChange={(e) => setRole({ ...role, settingsmanagement: !role.settingsmanagement })} />} label="Settings management" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.allbusinesslocation)} onChange={(e) => setRole({ ...role, allbusinesslocation: !role.allbusinesslocation })} />} label="Business location" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkallbusinesslocation)} onChange={(e) => businessLocationAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.activatebusinesslocation)} onChange={(e) => setRole({ ...role, activatebusinesslocation: !role.activatebusinesslocation })} />} label="Activate business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.abusinesslocation)} onChange={(e) => setRole({ ...role, abusinesslocation: !role.abusinesslocation })} />} label="Add business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ebusinesslocation)} onChange={(e) => setRole({ ...role, ebusinesslocation: !role.ebusinesslocation })} />} label="Edit business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dbusinesslocation)} onChange={(e) => setRole({ ...role, dbusinesslocation: !role.dbusinesslocation })} />} label="Delete business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.excelbusinesslocation)} onChange={(e) => setRole({ ...role, excelbusinesslocation: !role.excelbusinesslocation })} />} label="Excel business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvbusinesslocation)} onChange={(e) => setRole({ ...role, csvbusinesslocation: !role.csvbusinesslocation })} />} label="Csv business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printbusinesslocation)} onChange={(e) => setRole({ ...role, printbusinesslocation: !role.printbusinesslocation })} />} label="Print business location" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdfbusinesslocation)} onChange={(e) => setRole({ ...role, pdfbusinesslocation: !role.pdfbusinesslocation })} />} label="Pdf expense category" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={4}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.alltaxrate)} onChange={(e) => setRole({ ...role, alltaxrate: !role.alltaxrate })} />} label="Taxrate" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={3}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.checkalltaxrate)} onChange={(e) => taxrateAllSelect()} />} label="Select All" />
                            </FormGroup>
                        </Grid>
                        <Grid item md={5}>
                            <Grid display="block">
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.ataxrate)} onChange={(e) => setRole({ ...role, ataxrate: !role.ataxrate })} />} label="Add taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.etaxrate)} onChange={(e) => setRole({ ...role, etaxrate: !role.etaxrate })} />} label="Edit taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.dtaxrate)} onChange={(e) => setRole({ ...role, dtaxrate: !role.dtaxrate })} />} label="Delete taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.exceltaxrate)} onChange={(e) => setRole({ ...role, exceltaxrate: !role.exceltaxrate })} />} label="Excel taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.csvtaxrate)} onChange={(e) => setRole({ ...role, csvtaxrate: !role.csvtaxrate })} />} label="Csv taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.printtaxrate)} onChange={(e) => setRole({ ...role, printtaxrate: !role.printtaxrate })} />} label="Print taxrate" />
                                    </FormGroup>
                                </Grid>
                                <Grid>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox checked={Boolean(role.pdftaxrate)} onChange={(e) => setRole({ ...role, pdftaxrate: !role.pdftaxrate })} />} label="Pdf taxrate" />
                                    </FormGroup>
                                </Grid>
                            </Grid><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={7}></Grid>
                        <Grid item md={5}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={Boolean(role.businesssettings)} onChange={(e) => setRole({ ...role, businesssettings: !role.businesssettings })} />} label="Business settings" />
                            </FormGroup><br /><hr /><br />
                        </Grid>
                        <Divider sx={{ my: 2 }} />

                        {/* Dashboard start */}
                        <Divider sx={{ my: 2 }} />
                        <Grid item md={7}></Grid>
                        <Grid item md={5}>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.home)} onChange={(e) => setRole({ ...role, home: !role.home })} />} label="Home" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.selectlocation)} onChange={(e) => setRole({ ...role, selectlocation: !role.selectlocation })} />} label="Select Location Dropdown" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.from)} onChange={(e) => setRole({ ...role, from: !role.from })} />} label="From" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.to)} onChange={(e) => setRole({ ...role, to: !role.to })} />} label="To" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.totalsales)} onChange={(e) => setRole({ ...role, totalsales: !role.totalsales })} />} label="Total Sales" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.expenses)} onChange={(e) => setRole({ ...role, expenses: !role.expenses })} />} label="Expenses" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.barchart)} onChange={(e) => setRole({ ...role, barchart: !role.barchart })} />} label="Bar Chart" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.topproductspiechart)} onChange={(e) => setRole({ ...role, topproductspiechart: !role.topproductspiechart })} />} label="Top Selling Products Pie Chart" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.stockalerttable)} onChange={(e) => setRole({ ...role, stockalerttable: !role.stockalerttable })} />} label="Stock Alert Table" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.recentsalestable)} onChange={(e) => setRole({ ...role, recentsalestable: !role.recentsalestable })} />} label="Recent Sales Table" />
                                </FormGroup>
                            </Grid>
                            <Grid>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={Boolean(role.topsellproductstable)} onChange={(e) => setRole({ ...role, topsellproductstable: !role.topsellproductstable })} />} label="Top Selling Products Table" />
                                </FormGroup>
                            </Grid>
                        </Grid>
                        {/* Dashboard end */}
                        <Grid item md={12} sm={6} xs={6} >
                            <Link to="/user/role/list"><Button sx={userStyle.buttoncancel} >CANCEL</Button></Link>
                            <Button sx={userStyle.buttonadd} type="submit">UPDATE</Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>

            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleClose}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box >
    );
}

function Roleedit() {
    return (
        <Box >
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <Roleeditlist /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}
export default Roleedit;