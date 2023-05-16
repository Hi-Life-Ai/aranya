import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Grid, FormControl, OutlinedInput, InputLabel, Typography, Dialog,DialogContent, DialogActions, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import Headtitle from '../../../components/header/Headtitle';
import {SERVICE} from '../../../services/Baseservice';
import { toast } from 'react-toastify';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { AuthContext } from '../../../context/Appcontext';

function Departmentcreate() {

  const [departmentAdd, setdepartmentAdd] = useState({ departmentid: "", departmentname: ""});
  const { auth,setngs } = useContext(AuthContext);
  const [department, setdepartments] = useState([]);
  const [isDepartmentCode, setIsDepartmentCode] = useState([]);
  const [isDepartmentName, setIsDepartmentName] = useState([]);

  //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenc = () => {
    setIsErrorOpen(true);
  };
  const handleClose = () => {
    setIsErrorOpen(false);
  };


   //  Fetch department Data
   const fetchDepartments = async () => {
    try {
      let res = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      let result = res.data.departments.filter((data, index)=>{
        return data.assignbusinessid == setngs.businessid
    })
    let departmentcode = result.map((data,index)=>{
      return data.departmentid
    })

    let departmentname = result.map((data,index)=>{
      return data.departmentname
    })
    setIsDepartmentCode(departmentcode);
    setIsDepartmentName(departmentname);
      setdepartments(result);
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  };

  useEffect(
    ()=>{
      fetchDepartments();
    },[]
  )

  const backLPage = useNavigate();
  //autogenerate....
  let newval = setngs ? setngs.departmentsku == undefined ? "DP0001" : setngs.departmentsku + "0001" : "DP0001";
  // store department data to db
  const sendRequest = async () => {
    
    try {
      let res = await axios.post(SERVICE.DEPARTMENT_CREATE, {
        headers: {
          'Authorization':`Bearer ${auth.APIToken}`
        },
        departmentid: String(newval),
        departmentname: String(departmentAdd.departmentname),
        assignbusinessid: String(setngs.businessid),
      });
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      setdepartmentAdd(res.data);
      backLPage('/user/department/list');
    } catch (err) {
      const messages = err.response.data.errorMessage;
        setShowAlert(messages);
      handleClickOpenc();
    } 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(departmentAdd.departmentname ==""){
      setShowAlert("Please enter department name!");
        handleClickOpenc();
    }
    else if(isDepartmentCode.includes(newval)){
      setShowAlert("Code already exits!");
        handleClickOpenc();
    }
    else if(isDepartmentName.includes(departmentAdd.departmentname)){
      setShowAlert("Name already exits!");
        handleClickOpenc();
    }else{
      sendRequest();
    }
 
  }

  return (
    <Box>
      <Headtitle title={'Add Department'} />
      <Typography sx={userStyle.HeaderText}>Add Department</Typography>
      {/* content start */}
     <form onSubmit={handleSubmit}>
     <Box sx={userStyle.container}>
        <Grid container spacing={3} sx={userStyle.textInput}>
        {department && (
                                department.map(
                                    () => {
                                        let strings = setngs ? setngs.departmentsku : "DP";
                                        let refNo = department[department.length - 1].departmentid;
                                        let digits = (department.length + 1).toString();
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
                                    }))}
          <Grid item md={8} sm={12} xs={12}>
            <InputLabel htmlFor="component-outlined">Department Id<b style={{color:'red'}}>*</b></InputLabel>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                value={newval}
              />
            </FormControl>
          </Grid>
          <Grid item md={8} sm={12} xs={12}>
            <InputLabel htmlFor="component-outlined">Department Name<b style={{color:'red'}}>*</b></InputLabel>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                value={departmentAdd.departmentname}
                onChange={(e) => { setdepartmentAdd({ ...departmentAdd, departmentname: e.target.value }) }}
                type="text"
              />
            </FormControl>
          </Grid>
        </Grid><br />
        <br />
        <Grid container sx={userStyle.gridcontainer}>
          <Grid sx={{display:'flex'}}>
            <Button sx={userStyle.buttonadd} type="submit">SAVE</Button>
            <Link to="/user/department/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
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
    </Box>
  );
}

function Departmentscreate() {
  return (
    <Box  >
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main"sx={{ paddingRight: '60px',paddingLeft: '60px',paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <Departmentcreate /><br /><br /><br />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

export default Departmentscreate;