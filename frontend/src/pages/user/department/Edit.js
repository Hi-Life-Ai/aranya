import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Grid,  Typography, FormControl,  InputLabel,Dialog,DialogContent, DialogActions, OutlinedInput,  } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {SERVICE} from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Departmenteditlist() {

  const [isDepartment, setIsDepartment] = useState({});
  const { auth } = useContext(AuthContext);

  const id = useParams().id;

    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenc = () => {
      setIsErrorOpen(true);
    };
    const handleClose = () => {
      setIsErrorOpen(false);
    };

   // fetch particular id value
   const fetchDepartment = async () => {
    try {
      let req =  await axios.get(`${SERVICE.DEPARTMENT_SINGLE}/${id}`,{
        headers: {
          'Authorization':`Bearer ${auth.APIToken}`
        },
      });
      setIsDepartment(req.data.sdepartment); 
      toast.success(req.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  }

  let backPage = useNavigate();


  // store edited data to particular id update request
  const sendRequest = async () => {
    
    try {
      let res = await axios.put(`${SERVICE.DEPARTMENT_SINGLE}/${id}`, {
        headers: {
          'Authorization':`Bearer ${auth.APIToken}`
        },
        departmentid: String(isDepartment.departmentid),
        departmentname: String(isDepartment.departmentname),
      });
      setIsDepartment(res.data); 
      toast.success(res.data.message,{
        position: toast.POSITION.TOP_CENTER
    });
      backPage("/user/department/list");
    } catch (err) {
      const messages = err.response.data.message;
      setShowAlert(messages);
      handleClickOpenc();
    }
  };

  useEffect(
    ()=>{
      fetchDepartment();
    },[]
  )

  const handleSubmit = (e) =>{
    e.preventDefault();
    if(isDepartment.departmentname == ""){
        setShowAlert("Please enter department name!");
        handleClickOpenc();
    }else{
        sendRequest();
    }
  }

  return (
    <Box>
      <Headtitle title={'Edit Department'} />
      {/* Form Start */}
      <form onSubmit={handleSubmit}>
        <Typography sx={userStyle.HeaderText}>Edit Department</Typography>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputLabel htmlFor="component-outlined">Department ID</InputLabel>
            <FormControl size="small" fullWidth>
            <OutlinedInput
                id="component-outlined"
                value={isDepartment.departmentid}
                type="text"
              />
            </FormControl>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
          <InputLabel htmlFor="component-outlined">Department Name</InputLabel>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                value={isDepartment.departmentname}
                onChange={(e) => { setIsDepartment({ ...isDepartment, departmentname: e.target.value }) }}
                type="text"
              />
            </FormControl>
          </Grid>
          </Grid><br />
         
          <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
            <Button sx={userStyle.buttonadd} type="submit" autoFocus>UPDATE</Button>
            <Link to="/user/department/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
          </Grid>
        </Box>
      </form>
      {/* Form End */}
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

const Departmentsedit = () => {
  return (
    <>
      <Box>
        <Navbar />
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>
          <Box component="main"sx={{ paddingRight: '60px',paddingLeft: '60px',paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
            <Departmenteditlist /><br /><br /><br />
            <Footer />
          </Box>
        </Box>
      </Box>
    </>
  );
}
export default Departmentsedit;