import React, { useState, useEffect, useRef, useContext, } from "react";
import { userStyle } from "../../PageStyle";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Select, MenuItem, DialogTitle, InputLabel, FormControl, OutlinedInput, FormControlLabel, Card, Checkbox, FormGroup, Paper, TextField, TableCell, Typography, Drawer, Button, Table, Tooltip, IconButton, TableContainer, TableHead, TableRow, TableBody, DialogActions, DialogContent, Dialog, TableFooter, } from "@mui/material";
import { FaMoneyBillAlt, FaRegWindowClose, } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FcInfo } from "react-icons/fc";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Link, useParams } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CloseIcon from "@material-ui/icons/Close";
import noimage from "../../../assets/images/dashboardbg/no-image.png";
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import moment from 'moment';

// right Navbar overlap width
const drawerWidth = 250;
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    hide: {
        display: "none"
    },
    drawer: {
        width: drawerWidth
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: "flex-start"
    },
    closeicon: {
        textAlign: "left"
    },
}));

const Draftedit = () => {

    const { auth, setngs } = useContext(AuthContext);

    // Access
    const { isUserRoleAccess } = useContext(UserRoleAccessContext);

    const classes = useStyles();

    // pos inside products array data
    const productInputs = {
        companyrate: "", superstockrate: "", dealerrate: "", ratetype: "", sellingvalue: "", hsn: "", discountcheck: false, productid: "", productname: "", subtax: [], quantity: "", sellingpricetax: "", taxtareval: "", subtotal: "", applicabletax: "", discountamt: 0,
        mrp: "", afterdiscount: 0, netrate: "", expirydate: "", category: "", subcategory: "",
    }


    // pos db store data 
    const [draftEdit, setDraftEdit] = useState({
        company: "", companyaddress: "", companycontactpersonname: "", companycontactpersonnumber: "", referenceno: "", location: "", date: "",
        salesman: "", salescommission: "", salesmannumber: "", totalitems: "", totalproducts: 0, grandtotal: 0, totalbillamt: 0, userbyadd: "", gstno: "", bankname: "",
        accountnumber: "", ifsccode: "", deliveryaddress: "", deliverygstn: "", deliverycontactpersonname: "", deliverycontactpersonnumber: "", drivername: "", drivernumber: "", drivernphonenumber: "",
    });

    const [productsList, setProductsList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [products, setProducts] = useState([]);
    const [taxrates, setTaxrates] = useState();
    const [pos, setPos] = useState([]);
    const [mergeprod, setMergeprod] = useState();
    const [busioptions, setBusiOptions] = useState([])
    const [salesmans, setSalesmans] = useState([])
    const [company, setCompany] = useState();

    //collapse Navbar drawer open for category
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [category, setCategory] = useState([])
    const [subcategory, setSubCategory] = useState([])
    const [comparecate, setComparecate] = useState()
    const [comparesub, setComparesub] = useState()
    const handleDrawerOpen = () => { setOpen1(true); };
    const handleDrawerClose = () => { setOpen1(false); };

    //Navbarsub drawer open for sub category
    const handleDrawerOpen1 = () => { setOpen2(true); };
    const handleDrawerClose1 = () => { setOpen2(false); };

    const backLPage = useNavigate();

    // paynow button popup
    const [isPay, setIsPay] = useState(false);
    const handleClickOpenpay = () => {
        {
            if (tableData.length == 0) {
                setShowAlert("Please select any one of product details!");
                alertOpen();
            } else if (draftEdit.company == "") {
                setShowAlert("Please select any one of company!");
                alertOpen();
            }
            else if (draftEdit.location == "") {
                setShowAlert("Please select any one of location!");
                alertOpen();
            } else {
                setIsPay(true);
            }
        };
    }

    const handleClosepay = () => { setIsPay(false); };

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'ARANYA HERBALS | INVOICE',
        pageStyle: 'print'
    });

    // Show Ledger Alert
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const alertOpen = () => { setIsErrorOpen(true); };
    const alertClose = () => { setIsErrorOpen(false); };

    let tempTotal = 0;
    let subitems = [];

    let cgst = 0;
    let gst = 0;
    let igst = 0;
    let CGST = 0;
    let GST = 0;
    let IGST = 0;

    const id = useParams().id;

    //fetch draft
    const fetchDraftSingle = async () => {
        try {
            let res = await axios.get(`${SERVICE.DRAFT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setDraftEdit(res.data.sdraft);
            setTableData(res.data.sdraft.goods);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(
        () => {
            fetchDraftSingle();
        }, [id]
    )

    //fetch settings company 
    const fetchCompany = () => {
        setCompany(setngs?.company?.map((t) => ({
            ...t,
            label: t.companyname,
            value: t.companyname,
        })))
        console.log(company, "com....")
    }

    // fetch all products for category/brand/sub category onclick with particular data
    const fetchProd = async (e) => {
        try {
            let response = await axios.post(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]

            });
            // let result = response.data.products.filter((data, index) => {
            //     return data.assignbusinessid == setngs.businessid
            // })
            setMergeprod(response?.data?.products);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // get taxvrate data for products
    const taxrateRequest = async () => {
        try {
            let response = await axios.post(SERVICE.TAXRATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            // let taxRateData = response.data.taxrates.filter((data) => {
            //     return data.assignbusinessid == setngs.businessid
            // })
            setTaxrates(response?.data?.taxrates);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // fetch all products for get particular product in product select give products
    const fetchProductsall = async () => {
        try {
            let response = await axios.post(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]

            });
            // let result = response.data.products.filter((data, index) => {
            //     return data.assignbusinessid == setngs.businessid
            // })
            setProducts(response?.data?.products);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // get all stock data
    const fetchHandleStock = async () => {
        try {
            var response = await axios.post(SERVICE.PRODUCT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            // let result = response.data.products.filter((data, index) => {
            //     return data.assignbusinessid == setngs.businessid
            // })
            setProductsList(response?.data?.products?.map((t) => ({
                ...t,
                label: t.productname,
                value: t.productname
            })))
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
                alertOpen();
            } else {
                setShowAlert("Something went wrong!");
                alertOpen();
            }
        }
    }

    // fetch categories
    const fetchcategory = async (e) => {
        try {
            let response = await axios.post(SERVICE.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]


            });
            // let result = response.data.categories.filter((data, index) => {
            //     return data.assignbusinessid == setngs.businessid
            // })
            setCategory(response?.data?.categories);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    // fetch subcategory
    const fetchSubcategory = async (e) => {
        try {
            let req = await axios.post(SERVICE.CATEGORIES, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]

            });
            // let result = req.data.categories.filter((data, index) => {
            //     return data.assignbusinessid == setngs.businessid
            // })
            let reqdata = req?.data?.categories?.filter(item => {
                return item.subcategories
            })
            setSubCategory(req?.data?.categories);

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // fetch product compare with category,subcategory and brand
    const singleId = (id) => {
        let compareitem = products.filter(row => {
            return row.category == id
        })
        setComparecate(compareitem)
    }
    const singlesub = (id) => {
        let compareitem = products.filter(row => {
            return row.subcategory == id
        })
        setComparesub(compareitem)
    }

    // Product Onchange to get particular productid
    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            })
            fetchtable(res?.data?.sproduct)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const fetchlocated = async () => {
        try {
            var response = await axios.post(SERVICE.BUSINESS_LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation],
                active: Boolean(true),
            });

            // let result = response.data.busilocations.filter((data, index) => {
            //     if (isUserRoleAccess.role == 'Admin') {
            //         return data.assignbusinessid == setngs.businessid && data.activate == true
            //     } else {
            //         if (isUserRoleAccess.businesslocation.includes(data.name)) {
            //             return data.assignbusinessid == setngs.businessid && data.activate == true
            //         }
            //     }
            // })

            setBusiOptions(response?.data?.busilocations?.map((data) => ({
                ...data,
                label: data.name,
                value: data.name
            })))

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }

    const fetchSalesman = async () => {
        try {
            let res = await axios.post(`${SERVICE.USER_TERMSFALSE}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]

            });

            // let result = res.data.usersterms.filter((data, index) => {
            //     return data.assignbusinessid == setngs.businessid
            // })
            let getresult = res?.data?.usersterms?.filter((data) => {
                return data.role == "Salesman"
            })

            setSalesmans(getresult?.map((d) => ({
                ...d,
                label: d.staffname,
                value: d.staffname
            })))

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    }


    useEffect(
        () => {
            fetchlocated();
            fetchCompany();
            fetchSalesman();
        }, [])

    // pos/draft/quotation auto id
    let newvalpos = setngs ? setngs.salesku == undefined ? "PO0001" : setngs.salesku + "0001" : "PO0001";

    let getTaxRateData = [];
    const fetchDataProd = (e) => {

        let getTaxRateData = taxrates?.filter((data) => {
            if (e.applicabletax == data.taxname) {
                return data
            }
        })

        let isAlreadyAdded = false;
        let addQuantity = tableData.map((item) => {

            if (e.sku == item.productid) {
                isAlreadyAdded = true
                return { ...item, quantity: item.quantity + 1, afterdiscount: ((Number(item.quantity + 1) * Number(item.sellingvalue))), netrate: ((Number(item.quantity + 1) * Number(item.sellingvalue))), subtotal: ((Number(item.quantity + 1) * Number(item.sellingvalue) * Number(e.applicabletax == "" || e.applicabletax == undefined ? 0 : getTaxRateData[0]?.taxtotal) / 100)) + ((Number(item.quantity + 1) * Number(item.sellingvalue))) }
            } else {
                return item
            }
        })

        if (isAlreadyAdded) {
            setTableData(addQuantity)
        } else {
            setTableData((tableData) => {
                return [...tableData, {
                    ...productInputs,
                    companyrate: e.companyrate,
                    superstockrate: e.superstockrate,
                    dealerrate: e.dealerrate,
                    mrp: e.mrp,
                    ratetype: "",
                    sellingvalue: e.mrp,
                    category: e.category,
                    subcategory: e.subcategory,
                    productid: e.sku,
                    productname: e.productname,
                    quantity: 1,
                    netrate: e.mrp,
                    discountcheck: false,
                    afterdiscount: e.mrp,
                    discountamt: 0,
                    subtax: getTaxRateData,
                    sellingpricetax: e.sellingpricetax,
                    hsn: e.hsn == "" || e.hsn == undefined ? "" : e.hsn,
                    applicabletax: e.applicabletax == "" || e.applicabletax == undefined ? "" : e.applicabletax,
                    taxtareval: e.applicabletax == "" || e.applicabletax == undefined ? "" : getTaxRateData[0]?.taxtotal,
                    subtotal: e.mrp * 1 * Number(e.applicabletax == "" || e.applicabletax == undefined ? 0 : getTaxRateData[0]?.taxtotal) / 100 + e.mrp,
                    expirydate: e.expirydate,
                }]
            });
        }
    };

    function handleProductchange(productindex, reference, productInputName, inputvalue) {

        let userInputs = tableData?.map((value, indexList) => {

            if (productindex == indexList) {
                if (reference == "amount" && value?.discountcheck == true) {
                    let afterdisval = (Number(value?.netrate) - (Number(value?.netrate) * (Number(inputvalue) / 100)));
                    return { ...value, [productInputName]: inputvalue, afterdiscount: afterdisval, subtotal: (Number(afterdisval) * Number(value.taxtareval) / 100 + Number(afterdisval)) }
                }
                else if (reference == "amount" && value?.discountcheck == false) {
                    let afterdisval = Number(value?.netrate) - Number(inputvalue);
                    return { ...value, [productInputName]: inputvalue, afterdiscount: afterdisval, subtotal: (Number(afterdisval) * Number(value.taxtareval) / 100 + Number(afterdisval)) }
                }
                else if (reference == "percentage" && inputvalue == true) {
                    let afterdisval = Number(value?.netrate) - (Number(value?.netrate) * (Number(value.discountamt) / 100));
                    return { ...value, [productInputName]: Boolean(true), afterdiscount: afterdisval, subtotal: (Number(afterdisval) * Number(value.taxtareval) / 100 + Number(afterdisval)) }

                }
                else if (reference == "percentage" && inputvalue == false) {
                    let afterdisval = Number(value?.netrate) - Number(value.discountamt)
                    return { ...value, [productInputName]: Boolean(false), afterdiscount: afterdisval, subtotal: (Number(afterdisval) * Number(value.taxtareval) / 100 + Number(afterdisval)) }

                } else if (reference == "rateamount") {
                    if (inputvalue == "companyrate") {
                        //netrate
                        let netcost = Number(value.quantity) * Number(value.companyrate);
                        //after discount rate
                        let aftterdisccost;
                        if (value.discountcheck == true) {
                            let afterdisval = Number(netcost) - (Number(netcost) * (Number(value.discountamt) / 100));
                            aftterdisccost = afterdisval;
                        } else if (value.discountcheck == false) {
                            let afterdisval = Number(netcost) - Number(value.discountamt);
                            aftterdisccost = afterdisval;
                        }
                        //subtotal
                        let subcost = ((Number(aftterdisccost) * Number(value.taxtareval)) / 100 + Number(aftterdisccost));

                        return { ...value, [productInputName]: inputvalue, sellingvalue: value.companyrate, subtotal: subcost, netrate: netcost, afterdiscount: aftterdisccost, }
                    } else if (inputvalue == "superstockrate") {
                        //netrate
                        let netcost = Number(value.quantity) * Number(value.superstockrate);
                        //after discount rate
                        let aftterdisccost;
                        if (value.discountcheck == true) {
                            let afterdisval = Number(netcost) - (Number(netcost) * (Number(value.discountamt) / 100));
                            aftterdisccost = afterdisval;
                        } else if (value.discountcheck == false) {
                            let afterdisval = Number(netcost) - Number(value.discountamt);
                            aftterdisccost = afterdisval;
                        }
                        //subtotal
                        let subcost = ((Number(aftterdisccost) * Number(value.taxtareval)) / 100 + Number(aftterdisccost));

                        return { ...value, [productInputName]: inputvalue, sellingvalue: value.superstockrate, subtotal: subcost, netrate: netcost, afterdiscount: aftterdisccost, }
                    }
                    else if (inputvalue == "dealarrate") {
                        //netrate
                        let netcost = Number(value.quantity) * Number(value.dealerrate);
                        //after discount rate
                        let aftterdisccost;
                        if (value.discountcheck == true) {
                            let afterdisval = Number(netcost) - (Number(netcost) * (Number(value.discountamt) / 100));
                            aftterdisccost = afterdisval;
                        } else if (value.discountcheck == false) {
                            let afterdisval = Number(netcost) - Number(value.discountamt);
                            aftterdisccost = afterdisval;
                        }
                        //subtotal
                        let subcost = ((Number(aftterdisccost) * Number(value.taxtareval)) / 100 + Number(aftterdisccost));

                        return { ...value, [productInputName]: inputvalue, sellingvalue: value.dealerrate, subtotal: subcost, netrate: netcost, afterdiscount: aftterdisccost, }
                    }
                }
                else {
                    return value
                }
            }
            else {
                return value
            }
        });
        setTableData(userInputs);
    }

    // total quantity calculation
    const totalQuantityCalc = () => {
        let totalquanvalue = 0;
        if (tableData?.length > 0) {
            tableData?.forEach((value) => {
                totalquanvalue += Number(value.quantity)
            })
            return totalquanvalue.toFixed(0);
        }
    }

    //subtotal
    function totalNetCostCalcSub() {
        let totalvalue = 0;
        if (tableData?.length > 0) {
            tableData?.forEach((value) => {
                totalvalue += +Number(value.subtotal)
            })
            return totalvalue.toFixed(0);
        }
    }

    //subtotal
    function totalNetRate() {
        let totalnetrate = 0;
        if (tableData?.length > 0) {
            tableData?.forEach((value) => {
                totalnetrate += +Number(value.netrate)
            })
            return totalnetrate.toFixed(0);
        }
    }

    useEffect(() => {
        setDraftEdit({ ...draftEdit, grandtotal: (totalNetCostCalcSub()) })

    }, [])


    tableData?.map((item) => {
        item?.subtax?.filter((data) => {
            cgst += Number(data.taxratecgst == undefined ? 0 : data.taxratecgst);
            gst += Number(data.taxrategst == undefined ? 0 : data.taxrategst);
            igst += Number(data.taxrateigst == undefined ? 0 : data.taxrateigst);
        })
    })

    CGST = cgst
    GST = gst
    IGST = igst

    //total taxvalue calc for invoice
    const totalTaxValCal = () => {
        let totaltaxvalue = 0;
        if (tableData?.length > 0) {
            tableData?.forEach((value) => {
                totaltaxvalue += Math.abs((((value.taxtareval == "" || value.taxtareval == undefined ? 0 : value.taxtareval) / 100) * (value.mrp == "" || value.mrp == undefined ? 0 : value.mrp))) * Number(value.quantity)
            })
            return totaltaxvalue;
        }
    }


    // delete table data after data fetchparticular row
    const deleteRow = (i, e) => {
        setTableData(tableData.filter((e, item) => item !== i));
        tableData.splice(i, 1);
        if (tableData.length > 0) {
            tempTotal = 0
        }
    }

    // exit screen and re exit screen
    const fulscren = document.getElementById("fullScreen")

    function openFullscreen() {
        if (fulscren.requestFullscreen) {
            fulscren.requestFullscreen();
        } else if (fulscren.webkitRequestFullscreen) { /* Safari */
            fulscren.webkitRequestFullscreen();
        } else if (fulscren.msRequestFullscreen) { /* IE11 */
            fulscren.msRequestFullscreen();
        }
    }

    // fetch pos forrecent transction
    const fetchPos = async () => {
        try {
            let req = await axios.post(SERVICE.POS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]


            });
            // let result = req.data.pos1.filter((data, index) => {
            //     return data.assignbusinessid == setngs.businessid
            // })
            setPos(req?.data?.pos1);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };


    // Auto id for pos cash/card
    {
        pos && (
            pos.map(
                () => {
                    let strings = setngs ? setngs.salesku : "PO";
                    let refNo = pos[pos.length - 1].referenceno;
                    let digits = (pos.length + 1).toString();
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
                        newvalpos = strings + refNOINC;
                    } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                        refNOINC = ("00" + refLstTwo);
                        newvalpos = strings + refNOINC;
                    } else if (digits.length < 4 && getlastThreeChar > 0) {
                        refNOINC = ("0" + refLstThree);
                        newvalpos = strings + refNOINC;
                    } else {
                        refNOINC = (refLstDigit);
                        newvalpos = strings + refNOINC;
                    }
                }))
    }

    // save pos data to db cash
    const updateRequest = async () => {

        // reduce Current Stock in product
        tableData.map((item, index) => {
            products.forEach((data, i) => {
                if (item.productid == data.sku) {
                    axios.put(`${SERVICE.PRODUCT_SINGLE}/${data._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        currentstock: Number(data.currentstock) - Number(item.quantity),
                    });
                }
            })
        })

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.POS_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

                assignbusinessid: String(setngs.businessid),
                referenceno: String(newvalpos),
                company: String(draftEdit.company),
                companyaddress: String(draftEdit.companyaddress == undefined || null ? "" : draftEdit.companyaddress),
                gstn: String(draftEdit.gstno),
                bankname: String(draftEdit.bankname),
                accountnumber: String(draftEdit.accountnumber),
                ifsccode: String(draftEdit.ifsccode),
                companycontactpersonname: String(draftEdit.companycontactpersonname == undefined || null ? "" : draftEdit.companycontactpersonname),
                companycontactpersonnumber: Number(draftEdit.companycontactpersonnumber == undefined || null ? 0 : draftEdit.companycontactpersonnumber),
                location: String(draftEdit.location),
                deliveryaddress: String(draftEdit.deliveryaddress == undefined || null ? "" : draftEdit.deliveryaddress),
                deliverygstn: String(draftEdit.deliverygstn == undefined | null ? "" : draftEdit.deliverygstn),
                deliverycontactpersonname: String(draftEdit.deliverycontactpersonname == undefined || null ? "" : draftEdit.deliverycontactpersonname),
                deliverycontactpersonnumber: Number(draftEdit.deliverycontactpersonnumber == undefined || null ? 0 : draftEdit.deliverycontactpersonnumber),
                drivernumber: String(draftEdit.drivernumber == undefined || null ? "" : draftEdit.drivernumber),
                drivername: String(draftEdit.drivername == undefined || null ? "" : draftEdit.drivername),
                drivernphonenumber: Number(draftEdit.drivernphonenumber == undefined || null ? 0 : draftEdit.drivernphonenumber),
                salesman: String(draftEdit.salesman == undefined || null ? "" : draftEdit.salesman),
                salesmannumber: Number(draftEdit.salesmannumber == undefined || null ? 0 : draftEdit.salesmannumber),
                salescommission: Number(draftEdit.salescommission == undefined ? 0 : draftEdit.salescommission),
                date: String(draftEdit.date),
                goods: [...tableData],
                totalitems: Number(tableData.length),
                totalproducts: Number(totalQuantityCalc()),
                totalnettax: Number(totalTaxValCal().toFixed(2)),
                taxcgst: Number(CGST ? CGST : 0),
                taxigst: Number(IGST ? IGST : 0),
                taxsgst: Number(GST ? GST : 0),
                grandtotal: Number(totalNetCostCalcSub()),
                totalbillamt: Number(totalNetCostCalcSub()),
                userbyadd: String(isUserRoleAccess.staffname),
                signature: String(setngs.signature),
            });
            let res = await axios.delete(`${SERVICE.DRAFT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            handleprint();
            handleSubmitclear();
            backLPage('/sell/pos/create');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(messages);
                alertOpen();
            } else {
                setShowAlert("Something went wrong!");
                alertOpen();
            }
        }
    };

    const handlePosSubmit = (e) => {
        e.preventDefault();

        setDraftEdit({ ...draftEdit, referenceno: newvalpos })

        if (tableData.length == 0) {
            setShowAlert("Please select any one of product details!");
            alertOpen();
        }
        else {
            if (draftEdit.company == " ") {
                setShowAlert("Please select company");
                alertOpen();
            }
            else if (draftEdit.location == " ") {
                setShowAlert("Please select location");
                alertOpen();
            }
            else {
                updateRequest();
            }
        }
    }


    // store draft data
    const updateDraft = async () => {

        try {
            let draftreq = await axios.put(`${SERVICE.DRAFT_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                assignbusinessid: String(draftEdit.assignbusinessid),
                referenceno: String(draftEdit.referenceno),
                company: String(draftEdit.company),
                companyaddress: String(draftEdit.companyaddress == undefined || null ? "" : draftEdit.companyaddress),
                gstn: String(draftEdit.gstno),
                bankname: String(draftEdit.bankname),
                accountnumber: String(draftEdit.accountnumber),
                ifsccode: String(draftEdit.ifsccode),
                companycontactpersonname: String(draftEdit.companycontactpersonname == undefined || null ? "" : draftEdit.companycontactpersonname),
                companycontactpersonnumber: Number(draftEdit.companycontactpersonnumber == undefined || null ? 0 : draftEdit.companycontactpersonnumber),
                location: String(draftEdit.location),
                deliveryaddress: String(draftEdit.deliveryaddress == undefined || null ? "" : draftEdit.deliveryaddress),
                deliverygstn: String(draftEdit.deliverygstn == undefined | null ? "" : draftEdit.deliverygstn),
                deliverycontactpersonname: String(draftEdit.deliverycontactpersonname == undefined || null ? "" : draftEdit.deliverycontactpersonname),
                deliverycontactpersonnumber: Number(draftEdit.deliverycontactpersonnumber == undefined || null ? 0 : draftEdit.deliverycontactpersonnumber),
                drivernumber: String(draftEdit.drivernumber == undefined || null ? "" : draftEdit.drivernumber),
                drivername: String(draftEdit.drivername == undefined || null ? "" : draftEdit.drivername),
                drivernphonenumber: Number(draftEdit.drivernphonenumber == undefined || null ? 0 : draftEdit.drivernphonenumber),
                salesman: String(draftEdit.salesman == undefined || null ? "" : draftEdit.salesman),
                salesmannumber: Number(draftEdit.salesmannumber == undefined || null ? 0 : draftEdit.salesmannumber),
                salescommission: Number(draftEdit.salescommission == undefined ? 0 : draftEdit.salescommission),
                date: String(draftEdit.date),
                goods: [...tableData],
                totalitems: Number(tableData.length),
                totalproducts: Number(totalQuantityCalc()),
                totalnettax: Number(totalTaxValCal().toFixed(2)),
                taxcgst: Number(CGST ? CGST : 0),
                taxigst: Number(IGST ? IGST : 0),
                taxsgst: Number(GST ? GST : 0),
                grandtotal: Number(totalNetCostCalcSub()),
                totalbillamt: Number(totalNetCostCalcSub()),
                userbyadd: String(isUserRoleAccess.staffname),
                signature: String(setngs.signature),
            });

            toast.success(draftreq.data.message, {
                position: toast.POSITION.TOP_CENTER
            });

            backLPage('/sell/draft/list');
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    const handleSubmitDraft = (e) => {
        e.preventDefault();
        if (tableData.length == 0) {
            setShowAlert("Please select any one of product details!");
            alertOpen();
        }
        else {
            updateDraft();
        }
    }

    let clearvalall = [];

    const handleSubmitclear = (e) => {
        setDraftEdit({
            company: "", companyaddress: "", companycontactpersonname: "", companycontactpersonnumber: "", referenceno: "", location: "", date: "",
            salesman: "", salescommission: "", salesmannumber: "", totalitems: "", totalproducts: 0, grandtotal: 0, totalbillamt: 0, userbyadd: "", gstno: "", bankname: "",
            accountnumber: "", ifsccode: "", deliveryaddress: "", deliverygstn: "", deliverycontactpersonname: "", deliverycontactpersonnumber: "", drivername: "", drivernumber: "", drivernphonenumber: "",
        });
        setTableData(clearvalall);
    };

    // Fetching datas for image to table
    const fetchtable = (e) => {

        let getTaxRateData = taxrates?.filter((data) => {
            if (e.applicabletax == data.taxname) {
                return data
            }
        })
        let isAlreadyAdded = false;
        let addQuantity = tableData.map((item) => {

            if (e.sku == item.productid) {
                isAlreadyAdded = true
                return { ...item, quantity: item.quantity + 1, afterdiscount: ((Number(item.quantity + 1) * Number(item.sellingvalue))), netrate: ((Number(item.quantity + 1) * Number(item.sellingvalue))), subtotal: ((Number(item.quantity + 1) * Number(item.sellingvalue) * Number(e.applicabletax == "" || e.applicabletax == undefined ? 0 : getTaxRateData[0]?.taxtotal) / 100)) + ((Number(item.quantity + 1) * Number(item.sellingvalue))) }
            } else {
                return item
            }
        })

        if (isAlreadyAdded) {
            setTableData(addQuantity)
        } else {
            setTableData((tableData) => {
                return [...tableData, {
                    ...productInputs,
                    companyrate: e.companyrate,
                    superstockrate: e.superstockrate,
                    dealerrate: e.dealerrate,
                    mrp: e.mrp,
                    ratetype: "",
                    sellingvalue: e.mrp,
                    category: e.category,
                    subcategory: e.subcategory,
                    productid: e.sku,
                    productname: e.productname,
                    quantity: 1,
                    netrate: e.mrp,
                    discountcheck: false,
                    afterdiscount: e.mrp,
                    discountamt: 0,
                    subtax: getTaxRateData,
                    hsn: e.hsn == "" || e.hsn == undefined ? "" : e.hsn,
                    applicabletax: e.applicabletax == "" || e.applicabletax == undefined ? "" : e.applicabletax,
                    taxtareval: e.applicabletax == "" || e.applicabletax == undefined ? "" : getTaxRateData[0]?.taxtotal,
                    subtotal: e.mrp * 1 * Number(e.applicabletax == "" || e.applicabletax == undefined ? 0 : getTaxRateData[0]?.taxtotal) / 100 + e.mrp,
                    expirydate: e.expirydate,
                }]
            });

        }
    }

    useEffect(() => {
        fetchProductsall();
        taxrateRequest();
        fetchHandleStock();
        fetchPos();
    }, []);

    // Number field
    const exceptThisSymbols = ["e", "E", "+", "-", "."];

    return (
        <Box id="fullScreen"
            sx={{
                backgroundColor: 'white',
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Headtitle title={'Draft Edit'} />
            <form >
                {/* Navbar Start */}
                <Box sx={{ padding: "5px", backgroundColor: "#f0f2ff", '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7 !important' } }}>
                    <Grid container spacing={1} >
                        <Grid item lg={2} md={2} sm={6} xs={12}>
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
                        <Grid item md={2} sm={6} xs={12} lg={2} sx={{ marginTop: "5px" }}>
                            <InputLabel>Company</InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                    <SearchOutlinedIcon />
                                </Grid>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        sx={{ '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7 !important' } }}
                                        options={company}
                                        placeholder="Company"
                                        value={{ value: draftEdit.company, label: draftEdit.company }}
                                        onChange={(e) => {
                                            setDraftEdit({ ...draftEdit, company: e.companyname, companyaddress: e.companyaddress, gstno: e.gstno, bankname: e.bankname, accountnumber: e.accountnumber, ifsccode: e.ifsccode });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={3} sm={6} xs={12} lg={3} sx={{ marginTop: "5px" }}>
                            <InputLabel>Business Location</InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                    <SearchOutlinedIcon />
                                </Grid>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={busioptions}
                                        value={{ value: draftEdit.location, label: draftEdit.location }}
                                        placeholder="Business Location"
                                        onChange={(e) => { setDraftEdit({ ...draftEdit, location: e.value, deliveryaddress: e.address, deliverygstn: e.gstnno, deliverycontactpersonname: e.contactpersonname, deliverycontactpersonnumber: e.contactpersonnum }); }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} lg={2} sx={{ marginTop: "5px" }}>
                            <InputLabel>Salesman</InputLabel>
                            <Grid sx={{ display: "flex" }}>
                                <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                    <SearchOutlinedIcon />
                                </Grid>
                                <FormControl size="small" fullWidth>
                                    <Selects
                                        options={salesmans}
                                        value={{ value: draftEdit.salesman, label: draftEdit.salesman }}
                                        placeholder="Salesman"
                                        onChange={(e) => { setDraftEdit({ ...draftEdit, salesman: e.value, salescommission: e.salescommission, salesmannumber: e.phonenum }); }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item md={1} sm={1} xs={1} sx={{ marginTop: "20px" }}>
                            <Button onClick={(e) => { openFullscreen() }}><FullscreenOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                        </Grid>
                        <Grid item md={2} sm={6} xs={12} sx={{ marginTop: "5px" }}>
                            <InputLabel>Date</InputLabel>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs} >
                                    <DateTimePicker
                                        renderInput={(props) => <TextField size='small' {...props} />}
                                        sx={userStyle.posNavbarInput}
                                        value={draftEdit.date}
                                        onChange={(newValue) => {
                                            setDraftEdit({ ...draftEdit, date: newValue });
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
                {/* Navbar Ends */}
                <Grid container sx={{ backgroundColor: "#f0f2ff", '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7 !important' } }} >
                    <Grid item xs={12} sm={12} md={7} lg={7} sx={{ paddingRight: '3px', backgroundColor: '#fff' }} >
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
                                                <TableCell style={{ width: '55px' }}>Rate Type</TableCell>
                                                <TableCell style={{ width: '55px' }}>Qty</TableCell>
                                                <TableCell style={{ width: '95px' }}>MRP</TableCell>
                                                <TableCell style={{ width: '95px' }}>Net Rate</TableCell>
                                                <TableCell style={{ width: '175px' }}>Discount
                                                    <Tooltip arrow
                                                        title="Click checkbox to discount calculate as percentage">
                                                        <IconButton size="small">
                                                            <FcInfo />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell style={{ width: '155px' }}>After Discount </TableCell>
                                                <TableCell style={{ width: '55px' }}>GST</TableCell>
                                                <TableCell style={{ width: '155px' }}>Subtotal</TableCell>
                                                <TableCell sx={{ paddingTop: "5px", width: '55px' }} ><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tableData.length > 0 &&
                                                tableData.map((data, i) => {
                                                    return (
                                                        <>
                                                            <TableRow >
                                                                <TableCell sx={{ fontSize: '12px', }} key={i}>{data?.productname}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>
                                                                    <Select
                                                                        isClearable
                                                                        labelId="demo-select-small"
                                                                        variant="standard"
                                                                        id="demo-select-small"
                                                                        value={data?.ratetype}
                                                                        sx={{ fontSize: '12px', }}
                                                                        onChange={(e) => handleProductchange(i, 'rateamount', 'ratetype', e.target.value)}
                                                                        fullWidth
                                                                    >
                                                                        <MenuItem value="companyrate" >Company rate</MenuItem>
                                                                        <MenuItem value="superstockrate" >Super stocky rate</MenuItem>
                                                                        <MenuItem value="dealarrate" >Dealar rate</MenuItem>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell ><Typography sx={{ fontSize: '12px' }}>{data?.quantity}</Typography></TableCell>
                                                                <TableCell ><Typography sx={{ fontSize: '12px' }}> {data?.mrp}</Typography></TableCell>
                                                                <TableCell><Typography sx={{ fontSize: '12px' }}>{data?.netrate}</Typography></TableCell>
                                                                <TableCell>
                                                                    <Grid sx={{ display: 'flex', margin: '1px', width: 'auto' }}>
                                                                        <FormControl size="small">
                                                                            <OutlinedInput
                                                                                style={{ height: '25px', marginTop: '8px', fontSize: '15px' }}
                                                                                sx={userStyle.input}
                                                                                size="small"
                                                                                type="number"
                                                                                value={data?.discountamt}
                                                                                onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                                                                onChange={(e) => {
                                                                                    handleProductchange(i, 'amount', 'discountamt', e.target.value);
                                                                                    data.valdis = e.target.value
                                                                                }}

                                                                            />
                                                                        </FormControl>
                                                                        <Grid>
                                                                            <FormGroup >
                                                                                <FormControlLabel size="small" sx={{ marginLeft: "1em", }} control={<Checkbox checked={data?.discountcheck}
                                                                                    onClick={(e) => { data.discountcheck = !data.discountcheck; handleProductchange(i, 'percentage', 'discountcheck', e.target.checked) }}
                                                                                />}
                                                                                />
                                                                            </FormGroup>
                                                                        </Grid>
                                                                    </Grid>
                                                                </TableCell>
                                                                <TableCell ><Typography sx={{ fontSize: '12px' }}>{data?.afterdiscount}</Typography></TableCell>
                                                                <TableCell><Typography sx={{ fontSize: '12px' }}>{data?.taxtareval}</Typography></TableCell>
                                                                <TableCell><Typography sx={{ fontSize: '12px' }}><b>{data?.subtotal.toFixed(2)}</b></Typography></TableCell>
                                                                <TableCell sx={{ color: 'red', fontWeight: '900', cursor: 'pointer', fontSize: '15px !important' }}><AiOutlineClose onClick={(e) => { deleteRow(i, e); }} /></TableCell>
                                                            </TableRow>
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
                                            <b> Total Items:</b>&ensp;{tableData.length}
                                        </Typography>
                                        <Typography sx={{ marginLeft: '15px', }}>
                                            <b>Total Quantity:</b>&ensp;{totalQuantityCalc()}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={5} sm={6} xs={12} sx={{ paddingLeft: '4px', paddingRight: '1px', marginTop: '-4px' }}>
                                        <Button fullWidth variant="text" sx={{ marginTop: "5px", boxShadow: "inset 0px 0px 10px #1976d2", }}>
                                            <b>GRAND TOTAL:</b>&ensp;{totalNetCostCalcSub()}
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>CGST:</b>&ensp;{CGST ? CGST : 0}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>SGST:</b>&ensp;{GST ? GST : 0}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                            <b>IGST:</b>&ensp;{IGST ? IGST : 0}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={5} lg={5} sx={{ p: 1, backgroundColor: '#fff', }}>
                        <Grid container spacing={1}>
                            <Grid item md={4} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button fullWidth sx={userStyle.posselecbtn} style={{ boxShadow: "inset 0px 0px 5px green", }}
                                    onClick={(e) => { fetchProd(e); }}
                                >
                                    All
                                </Button>
                            </Grid>
                            <Grid item md={4} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button
                                    fullWidth
                                    sx={userStyle.posselecbtn}
                                    style={{ boxShadow: "inset 0px 0px 5px green", }}
                                    onClick={(e) => { handleDrawerOpen(); fetchcategory() }}
                                >
                                    Category
                                </Button>
                                <Drawer
                                    className={classes.drawer}
                                    variant="persistent"
                                    anchor="right"
                                    open={open1}
                                    classes={{
                                        paper: classes.drawerPaper
                                    }}
                                >
                                    {/* Navbar sub-category */}
                                    <div className={classes.closeicon}>
                                        <IconButton sx={userStyle.closeicon} onClick={handleDrawerClose}>
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography style={{ fontSize: '20px', marginLeft: '0.5em', marginBottom: '1em', fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif", color: '#5CB85C', fontWeight: 'bolder' }}>List of Category</Typography>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Grid style={{ marginLeft: '3em', "&:hover": { backgroundColor: 'red' } }}>
                                                <img src={noimage} onClick={(e) => { fetchProd(e); }} style={{ width: '110px', height: '130px', cursor: 'pointer' }} />
                                                <Typography style={{}}><b>All Category</b></Typography>
                                            </Grid>
                                            {category && (
                                                category.map((row, index) => (
                                                    <>
                                                        <br />
                                                        <div key={index} style={{ curser: 'pointer' }}>
                                                            <img src={row.productimage ? row.productimage : noimage} alt={row.category} onClick={(e) => { singleId(row.categoryname) }} style={{ width: '100px', height: '100px', marginLeft: '3em', border: 'none' }} />
                                                            <Typography style={{ marginLeft: '3em' }}>{row.categoryname}</Typography>
                                                        </div>
                                                    </>
                                                ))
                                            )}
                                        </Grid>
                                    </div>
                                </Drawer>
                            </Grid>
                            <Grid item md={4} sm={3} xs={6} sx={{ padding: '3px' }}>
                                <Button
                                    fullWidth
                                    sx={userStyle.posselecbtn}
                                    style={{ boxShadow: "inset 0px 0px 5px green", p: '5px' }}
                                    onClick={(e) => { handleDrawerOpen1(); fetchSubcategory(); }}
                                >
                                    SubCategory
                                </Button>
                                <Drawer
                                    className={classes.drawer}
                                    variant="persistent"
                                    anchor="right"
                                    open={open2}
                                    classes={{
                                        paper: classes.drawerPaper
                                    }}
                                >
                                    {/* Navbar sub-category */}

                                    <div className={classes.closeicon}>
                                        <IconButton onClick={handleDrawerClose1}>
                                            <CloseIcon />
                                        </IconButton>
                                        <Typography style={{ fontSize: '16px', marginLeft: '0.5em', marginBottom: '1em', fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif", color: '#5CB85C', fontWeight: 'bolder' }}>List of Sub-Category</Typography>
                                        <Grid item md={12} sm={12} xs={12}>
                                            <Grid style={{ marginLeft: '3em', "&:hover": { backgroundColor: 'red' } }}>
                                                <img src={noimage} onClick={(e) => { fetchProd(e) }} style={{ width: '110px', height: '130px', cursor: 'pointer' }} />
                                                <Typography style={{}}><b>All Subcategory</b></Typography>
                                            </Grid>
                                            {subcategory && (
                                                subcategory?.map((row, index) => (
                                                    row.subcategories.map(((meta, i) => {
                                                        subitems.push(meta);
                                                    }))
                                                ))
                                            )}
                                            {subitems.map((item, i) => {
                                                return (
                                                    <>
                                                        <br />
                                                        <div key={i} style={{ curser: 'pointer' }}>
                                                            <img src={noimage} alt="image" onClick={(e) => { singlesub(item.subcategryname) }} style={{ width: '100px', height: '100px', marginLeft: '3em', border: 'none' }} />
                                                            <Typography style={{ marginLeft: '3em' }}>{item.subcategryname}</Typography>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                </Drawer>
                            </Grid>

                            <br /><br /><br />
                            <Grid item md={12} sm={12} xs={12} sx={{ marginLeft: '25px' }}>
                                <Grid sx={{ display: "flex" }}>
                                    <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                        <SearchOutlinedIcon />
                                    </Grid>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={productsList}
                                            placeholder="Products"
                                            onChange={(e) => {
                                                fetchDataProd(e);
                                                totalQuantityCalc();
                                                setDraftEdit({ ...draftEdit, grandtotal: Number(totalNetCostCalcSub()) })
                                                totalNetRate();

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item md={12} sm={12} xs={12}>
                                <br />
                                <Grid container spacing={2} sx={{ display: 'flex' }}>
                                    <br />
                                    <>
                                        <Grid container>
                                            {comparecate && (
                                                comparecate.map((row, index) => (
                                                    <Grid item md={3} key={index} sx={{ justifyContent: 'space-between', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', height: 150, margin: '5px' }}>
                                                        <Grid >
                                                            <p style={{ fontSize: '14px', marginLeft: '3em', color: 'black' }}><b>{row.sku + "/" + row.currentstock}</b></p>
                                                            <img src={row.productimage ? row.productimage : noimage} alt={row.category} onClick={(e) => { rowData(row._id); }} width="100px" height="100px" style={{ margin: '0px  17px' }} />
                                                            <p style={{ fontSize: '14px', marginLeft: '4em', color: '#5CB85C' }}><b>{row.category}</b></p>
                                                        </Grid>

                                                    </Grid>
                                                )))}
                                        </Grid>
                                    </>

                                    <>
                                        <Grid container>
                                            {comparesub && (
                                                comparesub.map((row, index) => (
                                                    <Grid item md={3} key={index} sx={{ justifyContent: 'space-between', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', height: 150, margin: '5px' }}>
                                                        <Grid >
                                                            <p style={{ fontSize: '14px', marginLeft: '3em', color: 'black' }}><b>Qty: {row.currentstock}</b></p>
                                                            <img src={row.productimage ? row.productimage : noimage} alt={row.category} onClick={(e) => { rowData(row._id); }} width="100px" height="100px" style={{ margin: '0px  17px', '@media (maxWidth: 400px)': { width: "70px", height: "100px", margin: '0px  0px', } }} />
                                                        </Grid>
                                                        <p style={{ fontSize: '14px', marginLeft: '4em', color: '#5CB85C' }}><b>₹ {row.mrp}</b></p>
                                                    </Grid>
                                                )))}
                                        </Grid>
                                    </>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <br />
                <br />
                <Grid container sx={userStyle.btnGrid}>
                    <Grid item md={8} sm={8} xs={12} sx={{ display: "flex", color: 'black' }}>
                        <Button disableRipple sx={userStyle.btnBack} type="submit" onClick={handleSubmitDraft}>
                            <EditOutlinedIcon style={{ fontSize: "large" }} />
                            &ensp;Draft
                        </Button>
                        <Button disableRipple sx={userStyle.btnCash} onClick={handleClickOpenpay} >
                            <FaMoneyBillAlt />
                            &ensp;Cash
                        </Button>
                        <Button disableRipple sx={userStyle.btnCancel} onClick={handleSubmitclear}>
                            <FaRegWindowClose />
                            &ensp;Cancel
                        </Button>
                        <Typography value={draftEdit.totalbillamt}
                            sx={{ marginLeft: '15px', color: 'grey', fontSize: "20px" }}>
                            <b>Total:</b> <span style={{ color: 'green' }}>{totalNetCostCalcSub()}</span>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
            {/*  card details*/}

            {/* Cash dialog box */}
            <Dialog
                open={isPay}
                onClose={handleClosepay}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogTitle sx={{ padding: '10px', width: "500px" }}>
                    <Typography sx={userStyle.HeaderText}>Company Details</Typography>
                </DialogTitle>
                <DialogContent sx={{ padding: '0px', width: "500px" }}>
                    {/* Company details  */}
                    <Grid container sx={{ padding: '10px' }} spacing={3}>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ paddingLeft: '20px' }}>
                            <Card sx={{ padding: '30px', boxShadow: '0 0 10px -2px #444444', }}>
                                <Box>
                                    <Typography ><b>Company Name:</b> {draftEdit.company}</Typography><br />
                                    <Grid sx={{ display: 'flex' }}>
                                        <Grid>
                                            <InputLabel id="demo-select-small"><b>Contact person name</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={draftEdit.companycontactpersonname}
                                                    onChange={(e) => { setDraftEdit({ ...draftEdit, companycontactpersonname: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel id="demo-select-small"><b>Contact person number</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    value={draftEdit.companycontactpersonnumber}
                                                    onChange={(e) => { setDraftEdit({ ...draftEdit, companycontactpersonnumber: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                    {/* //Deliver Company details */}
                    <Grid container sx={{ padding: '10px' }} spacing={3}>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ paddingLeft: '20px' }}>
                            <Card sx={{ padding: '30px', boxShadow: '0 0 10px -2px #444444', }}>
                                <Box>
                                    <Typography ><b>Delivery Name:</b> {draftEdit.location}</Typography><br />
                                    <Grid sx={{ display: 'flex' }}>
                                        <Grid>
                                            <InputLabel id="demo-select-small"><b>Contact person name</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={draftEdit.deliverycontactpersonname}
                                                    onChange={(e) => { setDraftEdit({ ...draftEdit, deliverycontactpersonname: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel id="demo-select-small"><b>Contact person number</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    value={draftEdit.deliverycontactpersonnumber}
                                                    onChange={(e) => { setDraftEdit({ ...draftEdit, deliverycontactpersonnumber: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                    {/* Transport details */}
                    <Grid container sx={{ padding: '10px' }} spacing={3}>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ paddingLeft: '20px' }}>
                            <Card sx={{ padding: '30px', boxShadow: '0 0 10px -2px #444444', }}>
                                <Box>
                                    <Typography><b>Transport Details</b></Typography><br />
                                    <Grid sx={{ display: 'flex' }}>
                                        <Grid>
                                            <InputLabel id="demo-select-small"><b>Driver Name</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={draftEdit.drivername}
                                                    onChange={(e) => { setDraftEdit({ ...draftEdit, drivername: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel id="demo-select-small"><b>Driver Number</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={draftEdit.drivernumber}
                                                    onChange={(e) => { setDraftEdit({ ...draftEdit, drivernumber: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel id="demo-select-small"><b>Driver Contact No</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    value={draftEdit.drivernphonenumber}
                                                    onChange={(e) => { setDraftEdit({ ...draftEdit, drivernphonenumber: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosepay} variant="outlined">Cancel</Button>
                    <Button autoFocus variant="contained" color='primary' type="submit" onClick={(e) => handlePosSubmit(e)}> Print </Button>
                </DialogActions>
            </Dialog>
            {/* Cash Dialog Ends */}
            {/* Error model */}
            <Dialog
                open={isErrorOpen}
                onClose={alertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                    <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={alertClose}>ok</Button>
                </DialogActions>
            </Dialog>
            {/* invoice print layout     */}

            <>
                <Box sx={userStyle.printcls} ref={componentRef}>
                    <Box sx={{ padding: '20px' }}>
                        {setngs.businesslogo ? (
                            <>
                                <img src={setngs?.businesslogo} alt="Aranya Herbals" width="150px" height="70px" /><br />
                            </>
                        ) : (
                            <></>
                        )}
                        <Grid container >
                            <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'left', }}>
                                <Typography><b>COMPANY DETAILS</b><br /></Typography>
                                <Grid container>
                                    <Grid item md={4} sm={4} xs={4}>
                                        <Typography><b>Name:</b></Typography>
                                        <Typography><b>Address:</b></Typography>
                                        <Typography><b>GSTN:</b></Typography>
                                        <Typography><b>Contact person:</b></Typography>
                                    </Grid>
                                    <Grid item md={8} sm={8} xs={8} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                                        <Typography>{draftEdit.company}</Typography>
                                        <Typography>{draftEdit.companyaddress}</Typography>
                                        <Typography>{draftEdit.gstno}</Typography>
                                        <Typography>{draftEdit.companycontactpersonname + '/' + draftEdit.companycontactpersonnumber}</Typography>
                                    </Grid>
                                </Grid><br /><br /><br /><br />
                                <Grid container>
                                    <Grid item md={4} sm={4} xs={4}>
                                        <Typography><b>Order Number:</b></Typography>
                                        <Typography><b>Order Date:</b></Typography>
                                        <Typography><b>Salesman:</b></Typography>
                                    </Grid>
                                    <Grid item md={8} sm={8} xs={8} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                                        <Typography>{newvalpos}</Typography>
                                        <Typography>{moment(draftEdit.date).format('DD-MM-YYYY')}</Typography>
                                        <Typography>{draftEdit.salesman + '/' + draftEdit.salesmannumber}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'right', }}>
                                <Typography><b>DELIVERY DETAILS:</b> <br /></Typography>
                                <Grid container>
                                    <Grid item md={4} sm={4} xs={4}>
                                        <Typography><b>Name:</b></Typography>
                                        <Typography><b>Address:</b></Typography>
                                        <Typography><b>GSTN:</b></Typography>
                                        <Typography><b>Contact person:</b></Typography>
                                    </Grid>
                                    <Grid item md={8} sm={8} xs={8} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                                        <Typography>{draftEdit.location}</Typography>
                                        <Typography>{draftEdit.deliveryaddress}</Typography>
                                        <Typography>{draftEdit.deliverygstn}</Typography>
                                        <Typography>{draftEdit.deliverycontactpersonname + '/' + draftEdit.deliverycontactpersonnumber}</Typography>
                                    </Grid>
                                </Grid><br /><br />
                                <Typography><b>TRANSPORT DETAILS:</b> <br /></Typography>
                                <Grid container>
                                    <Grid item md={4} sm={4} xs={4}>
                                        <Typography><b>Driver Name:</b></Typography>
                                        <Typography><b>No:</b></Typography>
                                        <Typography><b>Contact No:</b></Typography>
                                    </Grid>
                                    <Grid item md={8} sm={8} xs={8} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                                        <Typography>{draftEdit.drivername}</Typography>
                                        <Typography>{draftEdit.drivernumber}</Typography>
                                        <Typography>{draftEdit.drivernphonenumber}</Typography>
                                    </Grid>
                                </Grid><br /><br />
                                <Grid container>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Typography><b>Invoice Number:</b></Typography>
                                        <Typography><b>Invoice Date:</b></Typography>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                                        <Typography>{newvalpos}</Typography>
                                        <Typography>{moment(draftEdit.date).format('DD-MM-YYYY')}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box>
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none' }}>
                            <Table aria-label="simple table" >
                                <TableHead >
                                    <TableRow sx={{ borderBottom: 'none' }}>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>ITEM</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>MRP</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>UNIT PRICE</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>QUANTITY</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>NET PRICE</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>GST</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>HSN</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}>TOTAL</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody >
                                    {tableData.length > 0 &&
                                        tableData.map((data, i) => {
                                            return (
                                                <>
                                                    <TableRow sx={{ paddingTop: '5px' }}>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '0px', borderBottom: "none" }} key={i}>{data?.productname}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '0px', borderBottom: "none" }}>{data?.mrp}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '0px', borderBottom: "none" }}>{data?.sellingvalue}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '0px', borderBottom: "none" }}>{data?.quantity}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '0px', borderBottom: "none" }}>{data?.netrate}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '0px', borderBottom: "none" }}>{data?.taxtareval}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '0px', borderBottom: "none" }}>{data?.hsn}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '0px', borderBottom: "none" }}>{Number(data?.subtotal).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                </>
                                            );
                                        })}
                                </TableBody>
                                <TableFooter >
                                    <TableRow >
                                        <TableCell align="center" colSpan={7} sx={{ borderBottom: 'none !important' }}><Typography><b>Net Total</b></Typography></TableCell>
                                        <TableCell sx={{ borderBottom: 'none !important' }}><Typography><b>{Number(totalNetCostCalcSub()).toFixed(2)}</b></Typography></TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br /><br /><br />
                        <Grid container>
                            <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'left', }}>
                                <Grid container>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography><b>Net Tax</b></Typography>
                                        <Typography><b>No. Of Items</b></Typography>
                                        <Typography><b>Total Items</b></Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography>{Number(totalTaxValCal()).toFixed(2)}</Typography>
                                        <Typography>{totalQuantityCalc()}</Typography>
                                        <Typography>{totalQuantityCalc()}</Typography>
                                    </Grid>
                                </Grid><br /><br />
                                <Grid container>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography><b>Bank Name:</b></Typography>
                                        <Typography><b>Acc No:</b></Typography>
                                        <Typography><b>IFSC Code:</b></Typography>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={6}>
                                        <Typography>{draftEdit.bankname}</Typography>
                                        <Typography>{draftEdit.accountnumber}</Typography>
                                        <Typography>{draftEdit.ifsccode}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'right' }}>
                                <br /><br /><br /><br /><br /><br /><br />
                                {setngs.signature ? (
                                    <>
                                        <Typography align='right'><img src={setngs.signature} width="80px" height="45px" /></Typography>
                                    </>
                                ) : (
                                    <></>
                                )}
                                <Typography align='right'><b>Authorized Signatory</b></Typography>
                            </Grid>
                        </Grid>
                    </Box><br /><br /><br /><br />
                </Box><br /><br />
            </>
        </Box>
    );
};
export default Draftedit;