import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/header/Navbar';
import { Grid, Typography, TextField, Box, FormControl, InputLabel, Button } from '@mui/material';
import { dashboardstyle, colourStyles } from './Dashboardstyle';
import {  DoDisturbOnSharp,  ShoppingCart } from '@mui/icons-material';
import Dashbrdchart from './Dashbrdchart';
import Dashpiechart from './Dashpiechart';
import Dashstockalert from './Dashstockalert';
import Dashtopselling from './Dashtopselling';
import Dashrecentsale from './Dashrecentsale';
import axios from 'axios';
import Headtitle from '../components/header/Headtitle';
import { SERVICE } from '../services/Baseservice';
import moment from "moment";
import { toast } from "react-toastify";
import { AuthContext, UserRoleAccessContext } from '../context/Appcontext';
import Selects from 'react-select';

const Dashboardlayout = () => {
  const [isLocationChange, setIsLocationChange] = useState(false)
  const [pos, setPos] = useState();
  const [expenses, setExpenses] = useState();
  const [busilocations, setBusilocations] = useState();
  const [isLocations, setIsLocations] = useState();

  const { isUserRoleAccess, isUserRoleCompare } = useContext(UserRoleAccessContext);
  const { auth, setngs } = useContext(AuthContext);
  let resultpos =[]
  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  const [dateFilter, setDateFilter] = useState({
    startdate: today, enddate: today,
  })

  const fetchPos = async () => {
    try {

      let res = await axios.get(SERVICE.POS, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
    
        let getDatawithFilter = res.data.pos1.filter((data) => {
          let dateTrim = moment(data.date).utc().format('YYYY-MM-DD')
          if(isLocationChange){
            if (data.location == isLocations && dateTrim == today) {
              return data
            }
            else if (data.location == isLocations && dateFilter.startdate <= dateTrim && dateFilter.enddate + 1 >= dateTrim) {
              return data
            }
            else if (data.location == isLocations && dateFilter.startdate <= dateTrim && dateFilter.enddate == "") {
              return data
            }
            else if (data.location == isLocations && dateFilter.startdate == "" && dateFilter.enddate + 1 >= dateTrim) {
              return data
            }else if (isLocations == data.location && dateFilter.startdate == "" && dateFilter.enddate == "") {
              return data
            }
          }else{
            if(dateTrim == today){
              return data
            }
            else if (dateFilter.startdate <= dateTrim && dateFilter.enddate + 1 >= dateTrim) {
              return data
            }
            else if (dateFilter.startdate <= dateTrim && dateFilter.enddate == "") {
              return data
            }
            else if (dateFilter.startdate == "" && dateFilter.enddate + 1 >= dateTrim) {
              return data
            }else if (dateFilter.startdate == "" && dateFilter.enddate == "") {
              return data
            }
          }
        })
      setPos(getDatawithFilter)
    } catch (err) {
      const messages = err.response.data.message;
      toast.err(messages);
    }
  };

  //expense
const fetchExpense = async () => {
  try {
    let res = await axios.get(SERVICE.EXPENSE, {
      headers: {
        'Authorization': `Bearer ${auth.APIToken}`
      },
    });
    let result = res.data.expenses.filter((data, index) => {
      if (isUserRoleAccess.role == 'Admin') {
        return data.assignbusinessid == setngs.businessid
      } else {
        if (isUserRoleAccess.businesslocation.includes(data.businesslocation)) {
          return data.assignbusinessid == setngs.businessid 
        }
      }
    })

    let getDatawithFilter = result.filter((data) => {
      let dateTrim = moment(data.expdate).utc().format('YYYY-MM-DD')
      if(isLocationChange){
        if (data.busilocation == isLocations && dateTrim == today) {
          return data
        }else if (data.busilocation == isLocations && dateFilter.startdate == dateTrim && dateFilter.enddate == dateTrim) {
          return data
        }
        else if (data.busilocation == isLocations && dateFilter.startdate <= dateTrim && dateFilter.enddate + 1 >= dateTrim) {
          return data
        }
        else if (data.busilocation == isLocations && dateFilter.startdate <= dateTrim && dateFilter.enddate == "") {
          return data
        }
        else if (data.busilocation == isLocations && dateFilter.startdate == "" && dateFilter.enddate + 1 >= dateTrim) {
          return data
        }else if (isLocations == data.busilocation && dateFilter.startdate == "" && dateFilter.enddate == "") {
          return data
        }
      }else{
        if(dateTrim == today){
          return data
        }else if (dateFilter.startdate == dateTrim && dateFilter.enddate == dateTrim) {
          return data
        }
        else if (dateFilter.startdate <= dateTrim && dateFilter.enddate + 1 >= dateTrim) {
          return data
        }
        else if (dateFilter.startdate <= dateTrim && dateFilter.enddate == "") {
          return data
        }
        else if (dateFilter.startdate == "" && dateFilter.enddate + 1 >= dateTrim) {
          return data
        }else if (dateFilter.startdate == "" && dateFilter.enddate == "") {
          return data
        }
      }
    })
    setExpenses(getDatawithFilter);
  } catch (err) {
    const messages = err.response.data.message;
    toast.err(messages);
  }
};


  const fetchLocation = async () => {
    try {
      let res = await axios.get(SERVICE.BUSINESS_LOCATION, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      let result = res.data.busilocations.filter((data, index) => {
        if (isUserRoleAccess.role == 'Admin') {
          return data.assignbusinessid == setngs.businessid && data.activate == true
        } else {
          if (isUserRoleAccess.businesslocation.includes(data.name)) {
            return data.assignbusinessid == setngs.businessid && data.activate == true
          }
        }
      })
      setBusilocations(result?.map((d) => (
        {
          ...d,
          label: d.name,
          value: d.name,
        }
      )));
    } catch (err) {
      const messages = err.response.data.message;
      toast.err(messages);
    }
  };

  let saletotal = 0;
  let expensetotal = 0;

  useEffect(
    () => {
     fetchLocation();
     fetchExpense();
     fetchPos()
    },[]);

  return (

    <Box sx={{ overflow: 'hidden' }}>
      <Headtitle title={'Home'} />
      <Typography variant="h5" sx={{ color: '#0d6342' }}>Welcome {isUserRoleAccess.staffname}</Typography><br />
      <Grid container sx={{ justifyContent: 'space-between' }} spacing={1}>
          {isUserRoleCompare[0].selectlocation && (
          <Grid item lg={6} md={6} sm={6} xs={12} sx={{ '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #B97DF0', borderRadius: '10px', } }}>
          <InputLabel htmlFor="component-outlined">Location</InputLabel>
              <FormControl size="small" sx={{width: '45%'}}>
                <Selects
                  options={busilocations}
                  placeholder={"Select Location"}
                  onChange={(e) => { setIsLocations(e.value); setIsLocationChange(true);}}
                  styles={colourStyles}
                />
              </FormControl>
              </Grid>
          )}
        {isUserRoleCompare[0].from && (
          <Grid item lg={2} md={2} sm={2} xs={12}>
            <InputLabel htmlFor="component-outlined">From</InputLabel>
            <FormControl size="small" fullwidth="true">
              <TextField
                variant="standard"
                type="date"
                value={dateFilter.startdate}
                onChange={(e) => { setDateFilter({ ...dateFilter, startdate: e.target.value }); }}
              />
            </FormControl>
          </Grid>
        )}
        {isUserRoleCompare[0].to && (
          <>
            <Grid item lg={2} md={2} sm={2} xs={12}>
            <InputLabel htmlFor="component-outlined">To</InputLabel>
            <FormControl size="small" fullwidth="true">
              <TextField
                variant="standard"
                type="date"
                value={dateFilter.enddate}
                onChange={(e) => { setDateFilter({ ...dateFilter, enddate: e.target.value }) }}
              />
            </FormControl>
          </Grid>
          <Grid item lg={2} md={2} sm={2} xs={12}>
            <Button variant='outlined' sx={dashboardstyle.btngenerate} onClick={(e) => {fetchPos();fetchExpense();}}>Generate</Button>
          </Grid>
          </>
        )}
      </Grid><br /><br />
      {/* Grid Layout for TOTAL  start*/}
      <Grid container spacing={{ xs: 3, sm: 3, md: 4, lg: 4 }}>
        {isUserRoleCompare[0].totalsales && (<Grid item xs={12} sm={6} md={4} lg={3} >
          <Grid sx={dashboardstyle.containerOne}>
            <Grid sx={dashboardstyle.conetntbox}>
              <Grid sx={dashboardstyle.contentboxicon}><ShoppingCart style={{ fontSize: '52px', padding: '5px', }} /></Grid>
              {pos && (
                pos.forEach(
                  (item => {
                    saletotal += +item.grandtotal;
                  })
                ))}
              <span>TOTAL SALES<br /><span style={{ fontSize: '35px' }}>₹ {saletotal.toFixed(0)}</span></span>
            </Grid>
          </Grid>
        </Grid>)}
        {isUserRoleCompare[0].expenses && (<Grid item xs={12} sm={6} md={4} lg={3} >
          <Grid sx={dashboardstyle.containerFour}>
            <Grid sx={dashboardstyle.conetntbox}>
              <Grid sx={dashboardstyle.contentboxicon}><DoDisturbOnSharp style={{ fontSize: '42px', padding: '5px', }} /></Grid>
              {expenses && (
                expenses.forEach(
                  (item => {
                    expensetotal += +item.totalamount;
                  })
                ))}
              <span>EXPENSES<br /><span style={{ fontSize: '35px' }}>₹ {expensetotal.toFixed(0)}</span></span>
            </Grid>
          </Grid>
        </Grid>)}
      </Grid><br /><br />
      {/* Grid Layout for TOTAL end */}
      {/* Table start */}

      <Grid container>
      {isUserRoleCompare[0].recentsalestable && (
        <Grid item lg={12} md={12} sm={12} xs={12} fullWidth>
          <Dashrecentsale isLocations={isLocations}   isLocationChange={isLocationChange}/>
        </Grid>
      )}
      </Grid><br /><br />

      <Grid container>
        {isUserRoleCompare[0].barchart && (<Grid item lg={7} md={7} sm={12} xs={12} fullWidth><Dashbrdchart isLocations={isLocations}   isLocationChange={isLocationChange}/></Grid>)}
        {isUserRoleCompare[0].topproductspiechart && (<Grid item lg={5} md={5} sm={12} xs={12} fullWidth><Dashpiechart isLocations={isLocations}  isLocationChange={isLocationChange}/></Grid>)}
      </Grid><br />

      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12} fullWidth>
          {isUserRoleCompare[0].stockalerttable && (<Dashstockalert />)}
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12} fullWidth>
          {isUserRoleCompare[0].topsellproductstable && (<Dashtopselling isLocations={isLocations}  isLocationChange={isLocationChange} />)}
        </Grid>
      </Grid>
      {/* Table end */}
    </Box>
  );
}

const Dashboard = () => {
  return (
    <>
      <Box>
        <Navbar />
        {/* Main Dashboard start */}
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>
          <Box component="main" sx={{ paddingRight: '20px', paddingLeft: '20px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
            <Dashboardlayout /><br /><br />
          </Box>
        </Box>
        {/* Main Dashboard end */}
      </Box>
    </>
  )
}

export default Dashboard;

