import React, { useState, useEffect, useRef, useContext, } from "react";
import ReactDOM from 'react-dom';
import { userStyle } from "../../PageStyle";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Tabs, Tab, DialogTitle, InputLabel, FormControl, OutlinedInput, FormControlLabel, Card, Select, MenuItem, Checkbox, FormGroup, Paper, TextField, TableCell, Typography, Drawer, Button, Table, Tooltip, IconButton, TableContainer, TableHead, TableRow, TableBody, DialogActions, DialogContent, Dialog, TableFooter, } from "@mui/material";
import { FaClock, FaMoneyBillAlt, FaRegWindowClose, } from "react-icons/fa";
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
import { Link } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from 'prop-types';
import autoTable from 'jspdf-autotable';
import jsPDF from "jspdf";
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import noimage from "../../../assets/images/dashboardbg/no-image.png";
import { UserRoleAccessContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import moment from 'moment';
import InvoiceComponent from './InvoiceComponent';
import InvoiceHeader from './InvoiceHeader';
import LogoSection from "./LogoSection";
import ContentSection from "./ContentSection";
import SignatureSection from "./SignatureSection";

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

// recent transction popup tab
// Tabpanel
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}




const Poscreate = () => {

    // const componentRef = useRef();
    const componentRef = useRef(null);
    const [copiesRendered, setCopiesRendered] = useState(false);
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
    const [posAdd, setPosAdd] = useState({
        company: "", companyaddress: "", companycontactpersonname: "", companycontactpersonnumber: "", referenceno: "", location: "", date: "",
        salesman: "", salescommission: "", salesmannumber: "", totalitems: "", totalproducts: 0, grandtotal: 0, totalbillamt: 0, userbyadd: "", gstno: "", bankname: "",
        accountnumber: "", ifsccode: "", deliveryaddress: "", deliverygstn: "", deliverycontactpersonname: "", deliverycontactpersonnumber: "", deliverycontactpersonemail: "", deliverycontactpersondistrict: "", deliverycontactpersonpincode: "",
        drivername: "", drivernumber: "", drivernphonenumber: "",

    });

    const [productsList, setProductsList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [products, setProducts] = useState([]);
    const [taxrates, setTaxrates] = useState();
    const [pos, setPos] = useState([]);
    const [singleprod, setSingleprod] = useState({});
    const [mergeprod, setMergeprod] = useState();
    const [drafts, setDrafts] = useState([]);
    const [quotations, setQuotations] = useState();
    const [locationData, setLocationData] = useState([])
    const [busioptions, setBusiOptions] = useState([])
    const [salesmans, setSalesmans] = useState([])
    const [company, setCompany] = useState();
    const [draftRecent, setDraftRecent] = useState([])
    const [quotationRecent, setQuotationRecent] = useState([]);
    const [posRecent, setPosRecent] = useState([]);

    // pos date
    const [purchaseDateTime, setPurchaseDateTime] = useState(dayjs());
    //collapse Navbar drawer open for category
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [category, setCategory] = useState([])
    const [subcategory, setSubCategory] = useState([])
    const [comparecate, setComparecate] = useState()
    const [comparesub, setComparesub] = useState()
    const handleDrawerOpen = () => { setOpen1(true); };
    const handleDrawerClose = () => { setOpen1(false); };

    // const isMobile = window.innerWidth <= 600; // Set the breakpoint for mobile view
    const [isMobile, setIsMobile] = useState(false);

    //Navbarsub drawer open for sub category
    const handleDrawerOpen1 = () => { setOpen2(true); };
    const handleDrawerClose1 = () => { setOpen2(false); };

    const backLPage = useNavigate();

    // paynow button popup
    const [isPay, setIsPay] = useState(false);
    const handleClickOpenpay = () => {
        {
            if (locationData.includes(posAdd.referenceno)) {
                setShowAlert("ID Already Exists");
                alertOpen();
            }
            else if (posAdd.company == "") {
                setShowAlert("Please select any one of company!");
                alertOpen();
            }
            else if (posAdd.location == "") {
                setShowAlert("Please select any one of location!");
                alertOpen();
            } else if (tableData.length == 0) {
                setShowAlert("Please select any one of product details!");
                alertOpen();
            } else {
                setIsPay(true);
            }
        };
    }
    const handleClosepay = () => { setIsPay(false); };


    // // Print

    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    //     documentTitle: 'ARANYA HEALTH CARE | INVOICE',
    //     pageStyle: 'print'
    // });

    // Show Ledger Alert
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const alertOpen = () => { setIsErrorOpen(true); };
    const alertClose = () => { setIsErrorOpen(false); };

    //  Recent Transactions Modal
    const [recentTranMod, setRecentTranMod] = useState(false);
    const recentTranModOpen = () => { setRecentTranMod(true) }
    const recentTranModClose = () => { setRecentTranMod(false) }

    // TABS
    const [valueMod, setValueMod] = useState(0);
    const handleChangeMod = (event, newValue) => { setValueMod(newValue); };

    let tempTotal = 0;
    let subitems = [];

    let cgst = 0;
    let gst = 0;
    let igst = 0;
    let CGST = 0;
    let GST = 0;
    let IGST = 0;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 899);
        };

        handleResize(); // Call the handleResize function once to set the initial state

        window.addEventListener('resize', handleResize); // Listen for window resize events

        return () => {
            window.removeEventListener('resize', handleResize); // Clean up the event listener on component unmount
        };
    }, []);

    //fetch settings company 
    const fetchCompany = () => {
        setCompany(setngs?.company?.map((t) => ({
            ...t,
            label: t.companyname,
            value: t.companyname
        })))
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

            });
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

            });
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
            });
            let reqdata = req?.data?.categories?.filter(item => {
                return item.subcategories
            })
            setSubCategory(reqdata);
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
            setSingleprod(res.data.sproduct)
            fetchtable(res.data.sproduct)
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
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });

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
            });

            let result = res.data.usersterms.filter((data, index) => {
                return data.role == "Salesman"
            })
            setSalesmans(result?.map((d) => ({
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

    let newval = setngs ? setngs.draftsku == undefined ? "DR0001" : setngs.draftsku + "0001" : "DR0001";

    let newvalquot = setngs ? setngs.quotationsku == undefined ? "QA0001" : setngs.quotationsku + "0001" : "QA0001";

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
                    let afterdisval = Number(value?.netrate) - (Number(value?.netrate) * (Number(inputvalue) / 100));
                    return { ...value, [productInputName]: inputvalue, afterdiscount: afterdisval, subtotal: (Number(afterdisval) * Number(value.taxtareval) / 100 + Number(afterdisval)) }
                }
                else if (reference == "amount" && value?.discountcheck == false) {
                    let afterdisval = Number(value?.netrate) - Number(inputvalue);
                    return { ...value, [productInputName]: inputvalue, afterdiscount: afterdisval, subtotal: (Number(afterdisval) * Number(value.taxtareval) / 100 + Number(afterdisval)) }
                }
                else if (reference == "percentage" && inputvalue == true) {
                    let afterdisval = (Number(value?.netrate) - (Number(value?.netrate) * (Number(value.discountamt) / 100)));
                    return { ...value, [productInputName]: inputvalue, afterdiscount: afterdisval, subtotal: (Number(afterdisval) * Number(value.taxtareval) / 100 + Number(afterdisval)) }

                }
                else if (reference == "percentage" && inputvalue == false) {
                    let afterdisval = Number(value?.netrate) - Number(value.discountamt)
                    return { ...value, [productInputName]: inputvalue, afterdiscount: afterdisval, subtotal: (Number(afterdisval) * Number(value.taxtareval) / 100 + Number(afterdisval)) }

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
                totalvalue += Number(value.subtotal)
            })
            return totalvalue.toFixed(0);
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

    const totalNetCost = Number(totalNetCostCalcSub()).toFixed(2);
    const totalNetCostInWords = numberToWords(Number(totalNetCost)) + ' Rupees Only';

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
        setPosAdd({ ...posAdd, grandtotal: (totalNetCostCalcSub()) })

    }, [])



    // tableData?.map((item) => {
    //     item?.subtax?.filter((data) => {
    //         cgst += Number(data.taxratecgst == undefined ? 0 : data.taxratecgst);
    //         gst += Number(data.taxrategst == undefined ? 0 : data.taxrategst);
    //         igst += Number(data.taxrateigst == undefined ? 0 : data.taxrateigst);
    //     })
    // })

    // CGST = cgst
    // GST = gst
    // IGST = igst

    // Initialize tax variables
    let cgstTotal = 0;
    let gstTotal = 0;
    let igstTotal = 0;

    // Iterate through tableData to calculate tax values
    tableData?.forEach((item) => {
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
            let posresult = req?.data?.pos1?.map((data, index) => {
                return data.referenceno
            })
            let getrecent = req?.data?.pos1?.filter((data) => {
                let dataDate = moment(data.date).utc().format('DD-MM-YYYY')
                let today = moment(new Date()).utc().format('DD-MM-YYYY')
                if (dataDate == today) {
                    return data
                }
            })
            setLocationData(posresult);
            setPos(req?.data?.pos1);
            setPosRecent(getrecent)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    // fetch quotation for recent quotation
    const fetchQot = async () => {
        try {
            let req = await axios.post(SERVICE.QUOTATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            let getrecent = req?.data?.quotations.filter((data) => {
                let dataDate = moment(data.date).utc().format('DD-MM-YYYY')
                let today = moment(new Date()).utc().format('DD-MM-YYYY')
                if (dataDate == today) {
                    return data
                }
            })
            setQuotations(req?.data?.quotations);
            setQuotationRecent(getrecent)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };


    //auto id for draft

    {
        drafts && (
            drafts?.map(
                () => {
                    let strings = setngs ? setngs.draftsku : "DR";
                    let refNo = drafts[drafts.length - 1].referenceno;
                    let digits = (drafts.length + 1).toString();
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
                }))
    }

    //auto id for quotation
    {
        quotations && (
            quotations.map(
                () => {
                    let strings = setngs ? setngs.quotationsku : "QA";
                    let refNo = quotations[quotations.length - 1].referenceno;
                    let digits = (quotations.length + 1).toString();
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
                        newvalquot = strings + refNOINC;
                    } else if (digits.length < 4 && getlastBeforeChar > 0 && getlastThreeChar == 0) {
                        refNOINC = ("00" + refLstTwo);
                        newvalquot = strings + refNOINC;
                    } else if (digits.length < 4 && getlastThreeChar > 0) {
                        refNOINC = ("0" + refLstThree);
                        newvalquot = strings + refNOINC;
                    } else {
                        refNOINC = (refLstDigit);
                        newvalquot = strings + refNOINC;
                    }
                }))
    }

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
    const sendRequest = async () => {

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
                company: String(posAdd.company),
                companyaddress: String(posAdd.companyaddress == undefined || null ? "" : posAdd.companyaddress),
                gstn: String(posAdd.gstno),
                bankname: String(posAdd.bankname),
                accountnumber: String(posAdd.accountnumber),
                ifsccode: String(posAdd.ifsccode),
                companycontactpersonname: String(posAdd.companycontactpersonname == undefined || null ? "" : posAdd.companycontactpersonname),
                companycontactpersonnumber: Number(posAdd.companycontactpersonnumber == undefined || null ? 0 : posAdd.companycontactpersonnumber),
                location: String(posAdd.location),
                deliveryaddress: String(posAdd.deliveryaddress == undefined || null ? "" : posAdd.deliveryaddress),
                deliverygstn: String(posAdd.deliverygstn == undefined || null ? "" : posAdd.deliverygstn),
                deliverycontactpersonname: String(posAdd.deliverycontactpersonname == undefined || null ? "" : posAdd.deliverycontactpersonname),
                deliverycontactpersonnumber: Number(posAdd.deliverycontactpersonnumber == undefined || null ? 0 : posAdd.deliverycontactpersonnumber),
                deliverycontactpersonemail: String(posAdd.deliverycontactpersonemail == undefined || null ? "" : posAdd.deliverycontactpersonemail),
                deliverycontactpersondistrict: String(posAdd.deliverycontactpersondistrict == undefined || null ? "" : posAdd.deliverycontactpersondistrict),
                deliverycontactpersonpincode: String(posAdd.deliverycontactpersonpincode == undefined || null ? "" : posAdd.deliverycontactpersonpincode),
                drivernumber: String(posAdd.drivernumber == undefined || null ? "" : posAdd.drivernumber),
                drivername: String(posAdd.drivername == undefined || null ? "" : posAdd.drivername),
                drivernphonenumber: Number(posAdd.drivernphonenumber == undefined || null ? 0 : posAdd.drivernphonenumber),
                salesman: String(posAdd.salesman == undefined || null ? "" : posAdd.salesman),
                salesmannumber: Number(posAdd.salesmannumber == undefined || null ? 0 : posAdd.salesmannumber),
                salescommission: Number(posAdd.salescommission == undefined ? 0 : posAdd.salescommission),
                date: String(purchaseDateTime),
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
            // handlePrint();           
            handleSubmitclear();
            handleClosepay();
            await fetchQot();
            await fetchDraft();
            await fetchPos();
            // let PRODUCT_REQ = await axios.post(SERVICE.TRANSFER_CREATE, {
            //     headers: {
            //         'Authorization': `Bearer ${auth.APIToken}`
            //     },

            //     assignbusinessid: String(setngs.businessid),
            //     referenceno: String(newvalpos),
            //     company: String(posAdd.company),
            //     companyaddress: String(posAdd.companyaddress),
            //     gstn: Number(posAdd.gstn),
            //     location: String(posAdd.location),
            //     salesman: String(posAdd.salesman),
            //     date: String(purchaseDateTime),
            //     goods: [...tableData],
            //     totalitems: Number(tableData.length),
            //     totalproducts: Number(totalQuantityCalc()),
            //     taxcgst: Number(CGST ? CGST : 0),
            //     taxigst: Number(IGST ? IGST : 0),
            //     taxsgst: Number(GST ? GST : 0),
            //     bankname: String(posAdd.bankname),
            //     accountnumber: String(posAdd.accountnumber),
            //     ifsccode: String(posAdd.ifsccode),
            //     grandtotal: Number(totalNetCostCalcSub()),
            //     totalbillamt: Number(totalNetCostCalcSub()),
            //     userbyadd: String(isUserRoleAccess.staffname),
            // });
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

    // store quotation data
    const sendQuotation = async () => {

        try {
            let PRODUCT_REQ = await axios.post(SERVICE.QUOTATION_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

                assignbusinessid: String(setngs.businessid),
                referenceno: String(newvalquot),
                company: String(posAdd.company),
                companyaddress: String(posAdd.companyaddress == undefined || null ? "" : posAdd.companyaddress),
                gstn: String(posAdd.gstno),
                bankname: String(posAdd.bankname),
                accountnumber: String(posAdd.accountnumber),
                ifsccode: String(posAdd.ifsccode),
                companycontactpersonname: String(posAdd.companycontactpersonname == undefined || null ? "" : posAdd.companycontactpersonname),
                companycontactpersonnumber: Number(posAdd.companycontactpersonnumber == undefined || null ? 0 : posAdd.companycontactpersonnumber),
                location: String(posAdd.location),
                deliveryaddress: String(posAdd.deliveryaddress == undefined || null ? "" : posAdd.deliveryaddress),
                deliverygstn: String(posAdd.deliverygstn == undefined | null ? "" : posAdd.deliverygstn),
                deliverycontactpersonname: String(posAdd.deliverycontactpersonname == undefined || null ? "" : posAdd.deliverycontactpersonname),
                deliverycontactpersonnumber: Number(posAdd.deliverycontactpersonnumber == undefined || null ? 0 : posAdd.deliverycontactpersonnumber),
                deliverycontactpersonemail: String(posAdd.deliverycontactpersonemail == undefined || null ? "" : posAdd.deliverycontactpersonemail),
                deliverycontactpersondistrict: String(posAdd.deliverycontactpersondistrict == undefined || null ? "" : posAdd.deliverycontactpersondistrict),
                deliverycontactpersonpincode: String(posAdd.deliverycontactpersonpincode == undefined || null ? "" : posAdd.deliverycontactpersonpincode),
                drivernumber: String(posAdd.drivernumber == undefined || null ? "" : posAdd.drivernumber),
                drivername: String(posAdd.drivername == undefined || null ? "" : posAdd.drivername),
                drivernphonenumber: Number(posAdd.drivernphonenumber == undefined || null ? 0 : posAdd.drivernphonenumber),
                salesman: String(posAdd.salesman == undefined || null ? "" : posAdd.salesman),
                salesmannumber: Number(posAdd.salesmannumber == undefined || null ? 0 : posAdd.salesmannumber),
                salescommission: Number(posAdd.salescommission == undefined ? 0 : posAdd.salescommission),
                date: String(purchaseDateTime),
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
            await fetchQot();
            await fetchDraft();
            await fetchPos();
            toast.success(PRODUCT_REQ.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
            setPosAdd({
                company: "", companyaddress: "", companycontactpersonname: "", companycontactpersonnumber: "", referenceno: "", location: "", date: "",
                salesman: "", salescommission: "", salesmannumber: "", totalitems: "", totalproducts: 0, grandtotal: 0, totalbillamt: 0, userbyadd: "", gstno: "", bankname: "",
                accountnumber: "", ifsccode: "", deliveryaddress: "", deliverygstn: "", deliverycontactpersonname: "", deliverycontactpersonnumber: "", drivername: "", drivernumber: "", drivernphonenumber: "",
            });
            setTableData(clearvalall);
            backLPage('/sell/pos/create');

        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };



    // Fetch and prepare your invoice data
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
        invoiceTableData: tableData,
    };

    const renderAndAppendInvoiceCopy = (invoiceData, copyTitle) => {
        console.log(copyTitle);
        const copyContainer = document.createElement('div');
        copyContainer.style.pageBreakAfter = 'always';

        // Render the copy title
        const copyTitleElement = document.createElement('h2');
        copyTitleElement.innerText = copyTitle;
        copyContainer.appendChild(copyTitleElement);

        // Render the invoice layout of InvoiceComponent
        ReactDOM.render(
            <InvoiceComponent data={invoiceData} title={copyTitle} />,
            copyContainer
        );

        // Append the copy to the print container
        componentRef.current.appendChild(copyContainer);
    }

    function paginateTableData(data, itemsPerPage) {
        const pages = [];
        for (let i = 0; i < data.length; i += itemsPerPage) {
            pages.push(data.slice(i, i + itemsPerPage));
        }
        return pages;
    }

    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    //     documentTitle: '',
    //     pageStyle: 'print'
    // });

    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    //     documentTitle: '',
    //     pageStyle: 'print',
    //     onAfterPrint: () => {
    //         if (!copiesRendered) {
    //             const paginatedData = paginateTableData(tableData, 10); // Change '10' to the desired number of products per page

    //             for (const pageData of paginatedData) {
    //                 const copyTitle = `ARANYA HEALTH CARE | DUPLICATE`;
    //                 renderAndAppendInvoiceCopy({ ...invoiceData, tableData: pageData }, copyTitle);
    //             }

    //             setCopiesRendered(true);
    //         }
    //     }
    // });


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: '',
        pageStyle: 'print',
        onBeforeGetContent: () => {
            const copies = [
                { title: 'ARANYA HEALTH CARE | DUPLICATE', data: invoiceData },
                { title: 'ARANYA HEALTH CARE | CUSTOMER', data: invoiceData }
            ];

            for (const copy of copies) {
                const copyContainer = document.createElement('div');
                copyContainer.style.pageBreakAfter = 'always';

                ReactDOM.render(
                    <InvoiceComponent data={copy.data} title={copy.title} />,
                    copyContainer
                );

                componentRef.current.appendChild(copyContainer);
            }
        }
    });




    const handlePosSubmit = (e) => {
        e.preventDefault();

        setPosAdd({ ...posAdd, referenceno: newvalpos })

        if (tableData.length == 0) {
            setShowAlert("Please select any one of product details!");
            alertOpen();
        }
        else if (posAdd.company == "") {
            setShowAlert("Please select company");
            alertOpen();
        }
        else if (posAdd.location == "") {
            setShowAlert("Please select location");
            alertOpen();
        }
        else if (posAdd.companycontactpersonname == "") {
            setShowAlert("Please enter company contact person name");
            alertOpen();
        }
        else if (posAdd.companycontactpersonnumber == "") {
            setShowAlert("Please enter company contact person number");
            alertOpen();
        }
        else if (posAdd.deliverycontactpersonname == "") {
            setShowAlert("Please enter delivery contact person name");
            alertOpen();
        }
        else if (posAdd.deliveryaddress == "") {
            setShowAlert("Please enter delivery contact person address");
            alertOpen();
        }
        else if (posAdd.deliverycontactpersonnumber == "") {
            setShowAlert("Please enter delivery contact person number");
            alertOpen();
        }
        else if (posAdd.deliverycontactpersonemail == "") {
            setShowAlert("Please enter delivery contact person email");
            alertOpen();
        }
        else if (posAdd.deliverycontactpersondistrict == "") {
            setShowAlert("Please enter delivery contact person district");
            alertOpen();
        }
        else if (posAdd.deliverycontactpersonpincode == "") {
            setShowAlert("Please enter delivery contact person pincode");
            alertOpen();
        }
        else if (posAdd.drivername == "") {
            setShowAlert("Please enter driver name");
            alertOpen();
        }
        else if (posAdd.drivernumber == "") {
            setShowAlert("Please enter driver number");
            alertOpen();
        }
        else if (posAdd.drivernphonenumber == "") {
            setShowAlert("Please enter driver contact number");
            alertOpen();
        }
        else {
            // sendRequest();
            // // Render and append invoice copies
            // renderAndAppendInvoiceCopies(invoiceData);

            // // Trigger the print functionality after appending all copies
            // handlePrint();


            // second
            // if (!copiesRendered) {
            //     sendRequest();
            //     // Render and append invoice copies
            //     renderAndAppendInvoiceCopies(invoiceData);
            //     setCopiesRendered(true); // Set the flag to true to avoid rendering more copies
            //     // Trigger the print functionality after appending all copies
            //     handlePrint();
            // }

            // if (!copiesRendered) {
            //     // sendRequest();
            //     // Render and append the second copy (InvoiceComponent layout)
            //     renderAndAppendInvoiceCopy(invoiceData, 'ARANYA HEALTH CARE | DUPLICATE');

            //     // Render and append the third copy (InvoiceComponent layout)
            //     renderAndAppendInvoiceCopy(invoiceData, 'ARANYA HEALTH CARE | CUSTOMER');

            //     setCopiesRendered(true); // Set the flag to true to avoid rendering more copies
            // Trigger the print functionality after appending all copies
            handlePrint();
            // }

            // if (!copiesRendered) {
            //     sendRequest();

            //     // Render and append the copies using the copyTitles array
            //     copyTitles.forEach(title => {
            //         renderAndAppendInvoiceCopy(invoiceData, title);
            //     });

            //     setCopiesRendered(true);
            //     handlePrint();
            // }
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setPosAdd({ ...posAdd, referenceno: newval })
        if (tableData.length == 0) {
            setShowAlert("Please select any one of product details!");
            alertOpen();
        } else {

            try {
                let PRODUCT_REQ = await axios.post(SERVICE.DRAFT_CREATE, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },

                    assignbusinessid: String(setngs.businessid),
                    referenceno: String(newval),
                    company: String(posAdd.company),
                    companyaddress: String(posAdd.companyaddress == undefined || null ? "" : posAdd.companyaddress),
                    gstn: String(posAdd.gstno),
                    bankname: String(posAdd.bankname),
                    accountnumber: String(posAdd.accountnumber),
                    ifsccode: String(posAdd.ifsccode),
                    companycontactpersonname: String(posAdd.companycontactpersonname == undefined || null ? "" : posAdd.companycontactpersonname),
                    companycontactpersonnumber: Number(posAdd.companycontactpersonnumber == undefined || null ? 0 : posAdd.companycontactpersonnumber),
                    location: String(posAdd.location),
                    deliveryaddress: String(posAdd.deliveryaddress == undefined || null ? "" : posAdd.deliveryaddress),
                    deliverygstn: String(posAdd.deliverygstn == undefined | null ? "" : posAdd.deliverygstn),
                    deliverycontactpersonname: String(posAdd.deliverycontactpersonname == undefined || null ? "" : posAdd.deliverycontactpersonname),
                    deliverycontactpersonnumber: Number(posAdd.deliverycontactpersonnumber == undefined || null ? 0 : posAdd.deliverycontactpersonnumber),
                    deliverycontactpersonemail: String(posAdd.deliverycontactpersonemail == undefined || null ? "" : posAdd.deliverycontactpersonemail),
                    deliverycontactpersondistrict: String(posAdd.deliverycontactpersondistrict == undefined || null ? "" : posAdd.deliverycontactpersondistrict),
                    deliverycontactpersonpincode: String(posAdd.deliverycontactpersonpincode == undefined || null ? "" : posAdd.deliverycontactpersonpincode),
                    drivernumber: String(posAdd.drivernumber == undefined || null ? "" : posAdd.drivernumber),
                    drivername: String(posAdd.drivername == undefined || null ? "" : posAdd.drivername),
                    drivernphonenumber: Number(posAdd.drivernphonenumber == undefined || null ? 0 : posAdd.drivernphonenumber),
                    salesman: String(posAdd.salesman == undefined || null ? "" : posAdd.salesman),
                    salesmannumber: Number(posAdd.salesmannumber == undefined || null ? 0 : posAdd.salesmannumber),
                    salescommission: Number(posAdd.salescommission == undefined ? 0 : posAdd.salescommission),
                    date: String(purchaseDateTime),
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
                await fetchQot();
                await fetchDraft();
                await fetchPos();
                toast.success(PRODUCT_REQ.data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
                setPosAdd({
                    company: "", companyaddress: "", companycontactpersonname: "", companycontactpersonnumber: "", referenceno: "", location: "", date: "",
                    salesman: "", salescommission: "", salesmannumber: "", totalitems: "", totalproducts: 0, grandtotal: 0, totalbillamt: 0, userbyadd: "", gstno: "", bankname: "",
                    accountnumber: "", ifsccode: "", deliveryaddress: "", deliverygstn: "", deliverycontactpersonname: "", deliverycontactpersonnumber: "", drivername: "", drivernumber: "", drivernphonenumber: "",
                });
                setTableData(clearvalall);
                backLPage('/sell/pos/create');
            } catch (err) {
                const messages = err?.response?.data?.message;
                if (messages) {
                    toast.error(messages);
                } else {
                    toast.error("Something went wrong!")
                }
            }
        }

    };

    const handleSubmitquotation = (e) => {
        setPosAdd({ ...posAdd, referenceno: newvalquot })
        e.preventDefault();
        if (tableData.length == 0) {
            setShowAlert("Please select any one of product details!");
            alertOpen();
        } else {
            sendQuotation();
        }
    };
    let clearvalall = [];

    const handleSubmitclear = (e) => {
        setPosAdd({
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
    };

    // fetch draft for recent draft
    const fetchDraft = async () => {
        try {
            let response = await axios.post(SERVICE.DRAFT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessid: String(setngs.businessid),
                role: String(isUserRoleAccess.role),
                userassignedlocation: [isUserRoleAccess.businesslocation]
            });
            let getrecent = response?.data?.drafts.filter((data) => {
                let dataDate = moment(data.date).utc().format('DD-MM-YYYY')
                let today = moment(new Date()).utc().format('DD-MM-YYYY')
                if (dataDate == today) {
                    return data
                }
            })
            setDrafts(response?.data?.drafts);
            setDraftRecent(getrecent)
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                toast.error(messages);
            } else {
                toast.error("Something went wrong!")
            }
        }
    };

    useEffect(() => {
        fetchProductsall();
        taxrateRequest();
        fetchHandleStock();
    }, []);

    useEffect(() => {
        fetchDraft();
        fetchPos();
        fetchQot();
    }, [])

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
            <Headtitle title={'Pos Add'} />
            <form >
                {isMobile ? (
                    <>
                        <Box sx={{ padding: "5px", '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7 !important' } }}>
                            <Grid container spacing={1} >
                                <Grid item lg={2} md={2} sm={12} xs={12}>
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
                                <Grid item md={2.5} sm={12} xs={12} lg={2} >
                                    <InputLabel >Company Name <b style={{ color: "red" }}> *</b></InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                            <SearchOutlinedIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <Selects
                                                sx={{ '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7 !important' } }}
                                                options={company}
                                                placeholder="Select"
                                                onChange={(e) => {
                                                    setPosAdd({ ...posAdd, company: e.companyname, companyaddress: e.companyaddress, gstno: e.gstno, bankname: e.bankname, accountnumber: e.accountnumber, ifsccode: e.ifsccode });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item md={2.5} sm={12} xs={12} lg={3} >
                                    <InputLabel >Business Location <b style={{ color: "red" }}> *</b></InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                            <SearchOutlinedIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <Selects
                                                options={busioptions}
                                                placeholder="Select"
                                                onChange={(e) => { setPosAdd({ ...posAdd, location: e.value, deliveryaddress: e.address, deliverygstn: e.gstnno, deliverycontactpersonname: e.contactpersonname, deliverycontactpersonnumber: e.contactpersonnum, deliverycontactpersonemail: e.email, deliverycontactpersondistrict: e.city, deliverycontactpersonpincode: e.zipcde }); }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item md={2.5} sm={12} xs={12} lg={2}>
                                    <InputLabel >Salesman<b style={{ color: "red" }}> *</b></InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                            <SearchOutlinedIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <Selects
                                                options={salesmans}
                                                placeholder="Select"
                                                onChange={(e) => { setPosAdd({ ...posAdd, salesman: e.value, salescommission: e.salescommission, salesmannumber: e.phonenum }); }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item md={0.5} sm={1} xs={1} sx={{ marginTop: "25px" }}>
                                    <Button onClick={(e) => { openFullscreen() }}><FullscreenOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                </Grid>
                                <Grid item md={2} sm={11} xs={11} >
                                    <InputLabel >Date</InputLabel>
                                    <FormControl>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DateTimePicker
                                                renderInput={(props) => <TextField size='small' {...props} />}
                                                sx={userStyle.posNavbarInput}
                                                value={purchaseDateTime}
                                                onChange={(newValue) => {
                                                    setPurchaseDateTime(newValue);
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                        {/* Navbar Ends */}
                        <Grid container sx={{ backgroundColor: "#f0f2ff", '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7 !important' } }} >
                            <Grid item xs={12} sm={12} md={5} lg={5} sx={{ p: 1, backgroundColor: '#fff', }}>
                                <Grid container spacing={1} >
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
                                                        <Typography ><b>All Subcategory</b></Typography>
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
                                                        setPosAdd({ ...posAdd, grandtotal: Number(totalNetCostCalcSub()) })
                                                        totalNetRate();

                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <br />
                                        <Grid container sx={{ display: 'flex' }}>
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
                            <Grid item xs={12} sm={12} md={7} lg={7} sx={{ paddingRight: '3px', backgroundColor: '#fff' }} >
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
                                                                                        onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                                                                        onChange={(e) => {
                                                                                            handleProductchange(i, 'amount', 'discountamt', e.target.value);
                                                                                            data.valdis = e.target.value
                                                                                        }}

                                                                                    />
                                                                                </FormControl>
                                                                                <Grid>
                                                                                    <FormGroup>
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
                                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: '50px' }}>
                                        <Grid container spacing={1}>
                                            <Grid item md={7} sm={6} xs={12} sx={{ display: 'flex' }}>
                                                <Typography sx={{ marginLeft: '15px' }}>
                                                    <b> Total Items :</b>&ensp;{tableData.length}
                                                </Typography>
                                                <Typography sx={{ marginLeft: '15px', }}>
                                                    <b>Total Quantity:</b>&ensp;{totalQuantityCalc()}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={5} sm={6} xs={12} sx={{ paddingLeft: '4px', paddingRight: '1px', marginTop: '-4px' }}>
                                                <Button fullWidth variant="text" sx={{ marginTop: "5px", boxShadow: "inset 0px 0px 10px #1976d2", }}>
                                                    <b>GRAND TOTAL :</b>&ensp;{totalNetCostCalcSub()}
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
                        </Grid>
                        <br />
                        <br />
                        <Grid container sx={userStyle.btnGrid}>
                            <Grid item md={8} sm={8} xs={12} sx={{ display: "flex", color: 'black' }}>
                                <Button disableRipple sx={userStyle.btnBack} type="submit" onClick={handleSubmit}>
                                    <EditOutlinedIcon style={{ fontSize: "large" }} />
                                    &ensp;Draft
                                </Button>
                                <Button disableRipple sx={userStyle.btnPause} type="submit" onClick={handleSubmitquotation}>
                                    <EditOutlinedIcon style={{ fontSize: "large" }} />
                                    &ensp;Quotation
                                </Button>

                                <Button disableRipple sx={userStyle.btnCash} onClick={handleClickOpenpay} >
                                    <FaMoneyBillAlt />
                                    &ensp;Cash
                                </Button>
                                <Button disableRipple sx={userStyle.btnCancel} onClick={handleSubmitclear}>
                                    <FaRegWindowClose />
                                    &ensp;Cancel
                                </Button>
                                <Typography value={posAdd.totalbillamt}
                                    sx={{ marginLeft: '15px', color: 'grey', fontSize: "20px" }}>
                                    <b>Total:</b> <span style={{ color: 'green' }}>{totalNetCostCalcSub()}</span>
                                </Typography>
                            </Grid>
                            <Grid item md={4} sm={4} xs={12}>
                                <Box sx={{ float: "right" }}>
                                    <Button disableRipple sx={userStyle.btnRec} onClick={recentTranModOpen}>
                                        <FaClock />
                                        &ensp;Recent Transactions
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>
                        {/* Navbar Start */}
                        <Box sx={{ padding: "5px", '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7 !important' } }}>
                            <Grid container spacing={1} >
                                <Grid item lg={2} md={2} sm={12} xs={12}>
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
                                <Grid item md={2.5} sm={12} xs={12} lg={2} >
                                    <InputLabel >Company Name <b style={{ color: "red" }}> *</b></InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                            <SearchOutlinedIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <Selects
                                                sx={{ '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7 !important' } }}
                                                options={company}
                                                placeholder="Select"
                                                onChange={(e) => {
                                                    setPosAdd({ ...posAdd, company: e.companyname, companyaddress: e.companyaddress, gstno: e.gstno, bankname: e.bankname, accountnumber: e.accountnumber, ifsccode: e.ifsccode });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item md={2.5} sm={12} xs={12} lg={3} >
                                    <InputLabel >Business Location <b style={{ color: "red" }}> *</b></InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                            <SearchOutlinedIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <Selects
                                                options={busioptions}
                                                placeholder="Select"
                                                onChange={(e) => { setPosAdd({ ...posAdd, location: e.value, deliveryaddress: e.address, deliverygstn: e.gstnno, deliverycontactpersonname: e.contactpersonname, deliverycontactpersonnumber: e.contactpersonnum, deliverycontactpersonemail: e.email, deliverycontactpersondistrict: e.city, deliverycontactpersonpincode: e.zipcde }); }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item md={2.5} sm={12} xs={12} lg={2}>
                                    <InputLabel >Salesman<b style={{ color: "red" }}> *</b></InputLabel>
                                    <Grid sx={{ display: "flex" }}>
                                        <Grid sx={userStyle.spanIcons} style={{ height: "38px" }}>
                                            <SearchOutlinedIcon />
                                        </Grid>
                                        <FormControl size="small" fullWidth>
                                            <Selects
                                                options={salesmans}
                                                placeholder="Select"
                                                onChange={(e) => { setPosAdd({ ...posAdd, salesman: e.value, salescommission: e.salescommission, salesmannumber: e.phonenum }); }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item md={0.5} sm={1} xs={1} sx={{ marginTop: "25px" }}>
                                    <Button onClick={(e) => { openFullscreen() }}><FullscreenOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                </Grid>
                                <Grid item md={2} sm={11} xs={11} >
                                    <InputLabel >Date</InputLabel>
                                    <FormControl>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DateTimePicker
                                                renderInput={(props) => <TextField size='small' {...props} />}
                                                sx={userStyle.posNavbarInput}
                                                value={purchaseDateTime}
                                                onChange={(newValue) => {
                                                    setPurchaseDateTime(newValue);
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
                                                                                        onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                                                                                        onChange={(e) => {
                                                                                            handleProductchange(i, 'amount', 'discountamt', e.target.value);
                                                                                            data.valdis = e.target.value
                                                                                        }}

                                                                                    />
                                                                                </FormControl>
                                                                                <Grid>
                                                                                    <FormGroup>
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
                                    <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: '50px' }}>
                                        <Grid container spacing={1}>
                                            <Grid item md={7} sm={6} xs={12} sx={{ display: 'flex' }}>
                                                <Typography sx={{ marginLeft: '15px' }}>
                                                    <b> Total Items :</b>&ensp;{tableData.length}
                                                </Typography>
                                                <Typography sx={{ marginLeft: '15px', }}>
                                                    <b>Total Quantity:</b>&ensp;{totalQuantityCalc()}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={5} sm={6} xs={12} sx={{ paddingLeft: '4px', paddingRight: '1px', marginTop: '-4px' }}>
                                                <Button fullWidth variant="text" sx={{ marginTop: "5px", boxShadow: "inset 0px 0px 10px #1976d2", }}>
                                                    <b>GRAND TOTAL :</b>&ensp;{totalNetCostCalcSub()}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item md={2} sm={6} xs={12}>
                                                <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                                    <b>CGST:</b>&ensp;{cgstTotal}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={2} sm={6} xs={12}>
                                                <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                                    <b>SGST:</b>&ensp;{gstTotal}
                                                </Typography>
                                            </Grid>
                                            <Grid item md={2} sm={6} xs={12}>
                                                <Typography sx={{ marginTop: "5px", marginLeft: '15px' }}>
                                                    <b>IGST:</b>&ensp;{igstTotal}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={5} lg={5} sx={{ p: 1, backgroundColor: '#fff', }}>
                                <Grid container spacing={1} >
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
                                                        <Typography ><b>All Subcategory</b></Typography>
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
                                                        setPosAdd({ ...posAdd, grandtotal: Number(totalNetCostCalcSub()) })
                                                        totalNetRate();

                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <br />
                                        <Grid container sx={{ display: 'flex' }}>
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
                                <Button disableRipple sx={userStyle.btnBack} type="submit" onClick={handleSubmit}>
                                    <EditOutlinedIcon style={{ fontSize: "large" }} />
                                    &ensp;Draft
                                </Button>
                                <Button disableRipple sx={userStyle.btnPause} type="submit" onClick={handleSubmitquotation}>
                                    <EditOutlinedIcon style={{ fontSize: "large" }} />
                                    &ensp;Quotation
                                </Button>

                                <Button disableRipple sx={userStyle.btnCash} onClick={handleClickOpenpay} >
                                    <FaMoneyBillAlt />
                                    &ensp;Cash
                                </Button>
                                <Button disableRipple sx={userStyle.btnCancel} onClick={handleSubmitclear}>
                                    <FaRegWindowClose />
                                    &ensp;Cancel
                                </Button>
                                <Typography value={posAdd.totalbillamt}
                                    sx={{ marginLeft: '15px', color: 'grey', fontSize: "20px" }}>
                                    <b>Total:</b> <span style={{ color: 'green' }}>{totalNetCostCalcSub()}</span>
                                </Typography>
                            </Grid>
                            <Grid item md={4} sm={4} xs={12}>
                                <Box sx={{ float: "right" }}>
                                    <Button disableRipple sx={userStyle.btnRec} onClick={recentTranModOpen}>
                                        <FaClock />
                                        &ensp;Recent Transactions
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                )}
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
                <DialogContent sx={{ padding: '0px', minWidth: '750px', height: 'auto', }}>
                    {/* Company details  */}
                    <Grid container sx={{ padding: '10px' }} spacing={3}>
                        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ paddingLeft: '20px' }}>
                            <Card sx={{ padding: '30px', boxShadow: '0 0 10px -2px #444444', }}>
                                <Box>
                                    <Typography ><b>Company Name:</b> {posAdd.company}</Typography><br />
                                    <Grid sx={{ display: 'flex' }}>
                                        <Grid>
                                            <InputLabel ><b>Contact Person Name</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={posAdd.companycontactpersonname}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, companycontactpersonname: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel ><b>Contact Person Number</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    value={posAdd.companycontactpersonnumber}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, companycontactpersonnumber: e.target.value }) }}
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
                                    <Typography ><b>Delivery Name:</b> {posAdd.location}</Typography><br />
                                    <Grid sx={{ display: 'flex' }}>
                                        <Grid>
                                            <InputLabel ><b>Contact Person Name</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={posAdd.deliverycontactpersonname}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, deliverycontactpersonname: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel ><b>Contact Person Address</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput required
                                                    id="component-outlined"
                                                    type="text"
                                                    value={posAdd.deliveryaddress}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, deliveryaddress: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel ><b>Contact Person Number</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    value={posAdd.deliverycontactpersonnumber}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, deliverycontactpersonnumber: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid><br />
                                    <Grid sx={{ display: 'flex' }}>
                                        <Grid>
                                            <InputLabel ><b>Contact Person Email</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="email"
                                                    value={posAdd.deliverycontactpersonemail}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, deliverycontactpersonemail: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel ><b>Contact Person District</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={posAdd.deliverycontactpersondistrict}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, deliverycontactpersondistrict: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel ><b>Contact Person Pincode</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    value={posAdd.deliverycontactpersonpincode}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, deliverycontactpersonpincode: e.target.value }) }}
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
                                            <InputLabel ><b>Driver Name</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={posAdd.drivername}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, drivername: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel ><b>Driver Number</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    value={posAdd.drivernumber}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, drivernumber: e.target.value }) }}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid>
                                            <InputLabel ><b>Driver Contact No</b></InputLabel>
                                            <FormControl size="small" sx={{ display: "flex" }} >
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="number"
                                                    value={posAdd.drivernphonenumber}
                                                    onChange={(e) => { setPosAdd({ ...posAdd, drivernphonenumber: e.target.value }) }}
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

            {/* Recent Transactions Modal Start */}
            <Dialog
                open={recentTranMod}
                onClose={recentTranModClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <DialogContent sx={{ minWidth: '750px', height: '500px' }}>
                    <Typography sx={userStyle.importheadtext}>Recent Transactions</Typography>
                    <br /><br />
                    <Grid container >
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', textTransform: 'CAPITALIZE', }}>
                                <Tabs value={valueMod} onChange={handleChangeMod} TabIndicatorProps={{
                                    style: {
                                        background: 'none',
                                        borderTop: '5px solid #7009ab', borderLeft: '2px solid black', top: '0', borderRadius: '5px !important'
                                    }
                                }}
                                    aria-label="basic tabs example" scrollButtons variant="scrollable"  >
                                    <Tab iconPosition="start" label={<><div><CheckOutlinedIcon />&ensp;Final</div></>} {...a11yProps(0)}></Tab>
                                    <Tab iconPosition="start" label={<><div><ChevronRightOutlinedIcon />&ensp;Quotation</div></>} {...a11yProps(1)}></Tab>
                                    <Tab iconPosition="start" label={<><div><ChevronRightOutlinedIcon />&ensp;Draft</div></>} {...a11yProps(2)}></Tab>
                                </Tabs>
                            </Box>

                            {/* Pos Panel */}
                            <TabPanel value={valueMod} index={0}>
                                <Grid container >
                                    <Grid item xs={12} sm={12} md={12} lg={12} >
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    {posRecent &&
                                                        (posRecent?.map((item, i) => (
                                                            <StyledTableRow key={i}>
                                                                <StyledTableCell>{item.referenceno}</StyledTableCell>
                                                                <StyledTableCell>{item.location}</StyledTableCell>
                                                                <StyledTableCell>{item.grandtotal}</StyledTableCell>
                                                            </StyledTableRow>
                                                        )))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            {/* Quotation Panel */}
                            <TabPanel value={valueMod} index={1}>
                                <Grid container >
                                    <Grid item xs={12} sm={12} md={12} lg={12} >
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    {quotationRecent &&
                                                        (quotationRecent?.map((item, i) => (
                                                            <StyledTableRow key={i}>
                                                                <StyledTableCell>{item.referenceno}</StyledTableCell>
                                                                <StyledTableCell>{item.location}</StyledTableCell>
                                                                <StyledTableCell>{item.grandtotal}</StyledTableCell>
                                                            </StyledTableRow>
                                                        )))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            {/* Draft Panel */}
                            <TabPanel value={valueMod} index={2}>
                                <Grid container  >
                                    <Grid item xs={12} sm={12} md={12} lg={12} >
                                        <TableContainer>
                                            <Table>
                                                <TableBody>
                                                    {draftRecent &&
                                                        (draftRecent?.map((item, i) => (
                                                            <StyledTableRow key={i}>
                                                                <StyledTableCell>{item.referenceno}</StyledTableCell>
                                                                <StyledTableCell>{item.location}</StyledTableCell>
                                                                <StyledTableCell>{item.grandtotal}</StyledTableCell>
                                                            </StyledTableRow>
                                                        )))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        </Box>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button disableRipple onClick={recentTranModClose} variant="outlined">Close</Button>
                </DialogActions>
            </Dialog>
            {/* Recent Transactions Modal Ends */}
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
                {/* sx={userStyle.printcls} */}
                <Box ref={componentRef} id="aranysinvoice">
                    <Box sx={{ padding: '20px' }}>
                        <Grid container >
                            <Grid item lg={6} md={6} sm={6} xs={6} sx={{ textAlign: 'left', }}>
                                {setngs.businesslogo ? (
                                    <>
                                        <img src={setngs?.businesslogo} alt="Aranya Herbals" width="100px" height="50px" /><br />
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
                                        <Typography sx={{ fontSize: '10px', }} >{newvalpos}</Typography>
                                        <Typography sx={{ fontSize: '10px', }} >{moment(purchaseDateTime).format('DD-MM-YYYY')}</Typography>
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
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.location}</Typography>
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.deliveryaddress}</Typography>
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.deliverygstn}</Typography>
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.deliverycontactpersonname + '/' + posAdd.deliverycontactpersonnumber}</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container>
                                    <Grid item md={4} sm={4} xs={4}>
                                        <Typography sx={{ fontSize: '10px', }}><b>Order Number:</b></Typography>
                                        <Typography sx={{ fontSize: '10px', }}><b>Order Date:</b></Typography>
                                        <Typography sx={{ fontSize: '10px', }}><b>Salesman:</b></Typography>
                                    </Grid>
                                    <Grid item md={8} sm={8} xs={8} sx={{ textAlign: 'left', paddingLeft: '10px' }}>
                                        <Typography sx={{ fontSize: '10px', }}>{newvalpos}</Typography>
                                        <Typography sx={{ fontSize: '10px', }}>{moment(purchaseDateTime).format('DD-MM-YYYY')}</Typography>
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.salesman + '/' + posAdd.salesmannumber}</Typography>
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
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.company}</Typography>
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.companyaddress}</Typography>
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.gstno}</Typography>
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.companycontactpersonname + '/' + posAdd.companycontactpersonnumber}</Typography>
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
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.drivername}</Typography>
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.drivernumber}</Typography>
                                        <Typography sx={{ fontSize: '10px', }}>{posAdd.drivernphonenumber}</Typography>
                                    </Grid>
                                </Grid><br />
                            </Grid>
                        </Grid>
                        <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box>
                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: 'none' }}>
                            <Table aria-label="simple table" >
                                <TableHead >
                                    <TableRow sx={{ borderBottom: 'none' }}>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: 'auto' }}>ITEM</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: 'auto' }}>HSN</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: 'auto' }}>UNIT PRICE</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: 'auto' }}>QUANTITY</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: 'auto' }}>NET PRICE</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: 'auto' }}>GST</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: 'auto' }}>MRP</TableCell>
                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", padding: '5px', borderTop: '0px', borderLeft: '0px', borderRight: '0px', borderBottomWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black', width: 'auto' }}>TOTAL</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody >
                                    {tableData.length > 0 &&
                                        tableData.map((data, i) => {
                                            return (
                                                <>
                                                    <TableRow sx={{ paddingTop: '5px' }}>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", width: 'auto' }} key={i}>{data?.productname}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", width: 'auto' }}>{data?.hsn}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", width: 'auto' }}>{data?.sellingvalue}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", width: 'auto' }}>{data?.quantity}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", width: 'auto' }}>{data?.netrate}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", width: 'auto' }}>{data?.taxtareval + "%"}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", width: 'auto' }}>{data?.mrp}</TableCell>
                                                        <TableCell align="left" sx={{ fontSize: '10px', fontWeight: "1000", paddingLeft: '5px', paddingRight: "5px", paddingTop: '0px', paddingBottom: '0px', borderBottom: "none", width: 'auto' }}>{Number(data?.subtotal).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                </>
                                            );
                                        })}
                                </TableBody>
                                <TableFooter >
                                    <TableRow >
                                        <TableCell align="center" colSpan={7} sx={{ borderBottom: 'none !important' }}><Typography sx={{ fontSize: '15px', fontWeight: 'bold' }}><b>Net Total</b></Typography></TableCell>
                                        <TableCell sx={{ borderBottom: 'none !important' }}><Typography sx={{ fontSize: '15px', fontWeight: 'bold' }}><b>{Number(totalNetCostCalcSub()).toFixed(2)}</b></Typography></TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer><br /><br /><br /><br />
                        {/* <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box> */}
                        <Box sx={{ bottom: '0px', }}>
                            <Grid container>
                                <Grid item md={6} sm={6} xs={6} sx={{ textAlign: 'left' }}>
                                    <Table >
                                        <TableHead>
                                            <TableRow >
                                                <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', width: '10px' }}><b>Cgst</b></TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', width: '10px' }}><b>Sgst</b></TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', width: '10px' }}><b>Igst</b></TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', width: '30px' }}><b>Taxable Value</b></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', }}><b>{cgstTotal + "%"}</b></TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', }}><b>{gstTotal + "%"}</b></TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', }}><b>{igstTotal + "%"}</b></TableCell>
                                                <TableCell align="center" sx={{ border: '1px solid black', fontSize: '10px', fontWeight: '1000', }}><b>{Number(totalTaxValCal()).toFixed(2)}</b></TableCell>
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
                                            <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{Number(totalNetCostCalcSub()).toFixed(2)}</b></Typography>
                                            <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{tableData.length}</b></Typography>
                                            <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{totalQuantityCalc()}</b></Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* <Box style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1, borderColor: 'black' }}></Box><br /> */}
                            <Grid item md={12} sm={12} xs={12}>
                                <Typography align="left" sx={{ fontSize: '10px', fontWeight: '400' }}>Amount Chargeable (in words)</Typography>
                                <Typography align="left" sx={{ fontSize: '14px', fontWeight: 'bold' }}>{totalNetCostInWords}</Typography>
                            </Grid><br />
                            <Grid container spacing={1} sx={{ border: '1px solid black' }}>
                                <Grid item md={5.5} sm={5.5} xs={5.5} sx={{ textAlign: 'left' }}>
                                    <Typography sx={{ textDecoration: "underline", paddingLeft: '10px', fontSize: '10px', fontWeight: '1000' }}><b>Declaration</b></Typography>
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
                                                    <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{posAdd.bankname}</b></Typography>
                                                    <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{posAdd.accountnumber}</b></Typography>
                                                    <Typography sx={{ fontSize: '10px', fontWeight: '1000' }}><b>{posAdd.ifsccode}</b></Typography>
                                                </Grid>
                                            </Grid><br />
                                        </Grid>
                                        <Grid item md={12} sm={12} xs={12} sx={{ textAlign: 'right', borderTop: '1px solid black', paddingRight: '10px' }}>
                                            <br />
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
                                </Grid>
                            </Grid>
                        </Box>
                    </Box><br /><br /><br /><br />
                </Box><br /><br />
            </>
        </Box >
    );
};

export default Poscreate;