import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Button, Tabs, Tab, Typography } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Businesscreate from './Businesscreate';
import Companycreate from './Companycreate';
import Productcreate from './Productcreate';
import Prefixescreate from './Prefixescreate';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext} from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import Headtitle from '../../../components/header/Headtitle';

function TabPanel(props) {

    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`} {...other} >
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
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function Businesssettingstable() {

    const {auth, setngs,isSetngs, setIsSetngs} = useContext(AuthContext)
    const [value, setValue] = useState(0);
    const [isSettingUpdate, setIsSettingUpdate] = useState(false);
    const [companys, setCompanys] = useState([]);

    const backLPage = useNavigate();

      // get settings data
    const fetchSettings = () => {
    
      setIsSetngs(setngs);
      setCompanys(setngs.company);
    }
    useEffect(
        () => {
        fetchSettings();
        }, [isSettingUpdate]
    )

    // update settings data
    const updateRequest = async (idRemovedcompany) => {
        
        try {
            let req = await axios.put(`${SERVICE.SETTING_SINGLE}/${setngs._id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                businessname: String(isSetngs.businessname == undefined ? setngs.businessname == undefined ? "" : setngs.businessname : isSetngs.businessname),
                buniessaddress:String(isSetngs.buniessaddress == undefined ? setngs.buniessaddress== undefined ? "" : setngs.buniessaddress : isSetngs.buniessaddress),
                businesslocation:String(isSetngs.businesslocation == undefined ? setngs.businesslocation == undefined ? "" : setngs.businesslocation : isSetngs.businesslocation),
                startdate: String(isSetngs.startdate == undefined ? setngs.startdate == undefined ? "" : setngs.startdate : isSetngs.startdate),
                businesslogo: String(isSetngs.businesslogo == undefined ? setngs.businesslogo == undefined ? "" : setngs.businesslogo : isSetngs.businesslogo),
                skuprefix: String(isSetngs.skuprefix == undefined ? setngs.skuprefix == undefined ? "" : setngs.skuprefix : isSetngs.skuprefix),
                defaultunit: String(isSetngs.defaultunit == undefined ? setngs.defaultunit == undefined ? "" : setngs.defaultunit : isSetngs.defaultunit),
                expensesku: String(isSetngs.expensesku == undefined ? setngs.expensesku == undefined ? "" : setngs.expensesku : isSetngs.expensesku),
                businesslocationsku: String(isSetngs.businesslocationsku == undefined ? setngs.businesslocationsku == undefined ? "" : setngs.businesslocationsku: isSetngs.businesslocationsku) ,
                usersku: String(isSetngs.usersku == undefined ? setngs.usersku == undefined ? "" : setngs.usersku: isSetngs.usersku),
                departmentsku: String(isSetngs.departmentsku == undefined ? setngs.departmentsku == undefined ? "" : setngs.departmentsku: isSetngs.departmentsku),
                salesku: String(isSetngs.salesku == undefined ? setngs.salesku == undefined ? "" : setngs.salesku: isSetngs.salesku),
                draftsku: String(isSetngs.draftsku == undefined ? setngs.draftsku == undefined ? "" : setngs.draftsku : isSetngs.draftsku),
                quotationsku:String(isSetngs.quotationsku == undefined ? setngs.quotationsku == undefined ? "" : setngs.quotationsku : isSetngs.quotationsku),
                signature :String(isSetngs.signature == undefined ? setngs.signature == undefined ? "" : setngs.signature : isSetngs.signature),
                company:[...idRemovedcompany],
                applicabletax:String(isSetngs.applicabletax) == undefined ? setngs.applicabletax == undefined ? "" : setngs.applicabletax : isSetngs.applicabletax,
                sellingpricetax:String(isSetngs.sellingpricetax == undefined ? setngs.sellingpricetax == undefined ? "" : setngs.sellingpricetax : isSetngs.sellingpricetax),
                minquantity:Number(isSetngs.minquantity == undefined ? setngs.minquantity == undefined ? 0 : setngs.minquantity : isSetngs.minquantity),
                maxquantity:Number(isSetngs.maxquantity == undefined ? setngs.maxquantity == undefined ? 0 : setngs.maxquantity : isSetngs.maxquantity),
                expiryday: Number(isSetngs.expiryday == undefined ? setngs.expiryday == undefined ? 0 : setngs.expiryday : isSetngs.expiryday),
            });
            setIsSetngs(req.data);
            setIsSettingUpdate(true)
            backLPage('/settings/business/list');
            toast.success(req.data.message,{
                position: toast.POSITION.TOP_CENTER
            });
        }
        catch (err) {
            const messages = err.response.data.message;
            toast.error(messages);
        }
    };
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const idRemovedNew = ()=> {
        const idRemovedcompany = companys.map((value)=> {
          if (value.newAdded) {
            return {companyname : value.companyname, companyaddress: value.companyaddress,
                bankname: value.bankname, accountnumber: value.accountnumber, ifsccode: value.ifsccode, gstno: value.gstno}
          }
          else {
            return value;
          }
        });
        updateRequest(idRemovedcompany);
      }
    const sendRequest = (e) => {
        e.preventDefault();
        idRemovedNew();
    }
    return (
        <>
            <Headtitle title={'Business Settings'}/>
            <Typography sx={userStyle.HeaderText}>Business Settings</Typography>
            <form onSubmit={sendRequest}>
                <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider', minWidth: '15%', maxWidth: '15%' }}
                    >
                        <Tab label="Business" {...a11yProps(0)} />
                        <Tab label="Company" {...a11yProps(1)} />
                        <Tab label="Product" {...a11yProps(2)} />
                        <Tab label="Prefixes" {...a11yProps(3)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <Businesscreate isSetngs={isSetngs} setIsSetngs={setIsSetngs} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Companycreate isSetngs={isSetngs} setIsSetngs={setIsSetngs} companys={companys} setCompanys={setCompanys}  />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Productcreate isSetngs={isSetngs} setIsSetngs={setIsSetngs} />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Prefixescreate isSetngs={isSetngs} setIsSetngs={setIsSetngs} />
                    </TabPanel>
                </Box>
                <br />
                <Grid container sx={{ justifyContent: 'right !important', bottom: '0', }}>
                    <Box>
                        <Button type="submit" name="submit" sx={userStyle.buttonadd}>UPDATE SETTINGS</Button>
                    </Box>
                </Grid>
            </form>
        </>
    );
}

function Businesssettings() {
    return (
        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' }}}>
                    <Businesssettingstable /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}

export default Businesssettings;