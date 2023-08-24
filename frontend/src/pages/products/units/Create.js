import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, FormControl, OutlinedInput, InputLabel,Typography, Dialog, DialogContent, DialogActions, Grid } from '@mui/material';
import { userStyle } from '../../PageStyle';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { toast } from 'react-toastify';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Unitcreate() {

  const [unitForm, setUnitForm] = useState({ unit: "", shortname: "", });
  const { auth, setngs } = useContext(AuthContext);
  const[unitData , setUnitData]= useState([])

  //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpen = () => {  setIsErrorOpen(true);  };
  const handleClose = () => {  setIsErrorOpen(false); };

  const backLPage = useNavigate();

  // Add Datas
  const sendRequest = async () => {
    try {
      let response = await axios.post(SERVICE.UNIT_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        unit: String(unitForm.unit),
        shortname: String(unitForm.shortname),
        assignbusinessid:String(setngs.businessid),
      });
      setUnitForm(response.data);
      toast.success(response.data.message,{
        position: toast.POSITION.TOP_CENTER
    });
    backLPage('/product/unit/list');
    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            setShowAlert(messages);
            handleClickOpen();
        }else{
            setShowAlert("Something went wrong!");
            handleClickOpen();
        }
    }
  };

  const fetchData = async () => {
    try {
        let res = await axios.get(SERVICE.UNIT, {
            headers: {
                'Authorization': `Bearer ${auth.APIToken}`
            },
        });   
        let result = res.data.units.map((data, index)=>{
            if(data.assignbusinessid == setngs.businessid) {
               return data.unit
            }
        })
        setUnitData(result);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
};

useEffect(()=>{
  fetchData()
},[unitData])


  const addUnitSubmit = (e) => {
    e.preventDefault();
    if(unitData.includes(unitForm.unit)){
      setShowAlert("unit Already Exists");
      handleClickOpen();
  }
 else if(unitForm.unit == ""){
      setShowAlert("Please enter unit name!");
      handleClickOpen();
    }else{
      sendRequest();
    }
    
  };

  return (
    <Box>
      <Headtitle title={'Add unit'} />
      <Typography sx={userStyle.HeaderText}>Add Unit</Typography>
      <Box sx={userStyle.container}>
        <Grid container spacing={3} sx={userStyle.textInput}>
          <Grid item md={6} sm={12} xs={12}>
          <InputLabel htmlFor="component-outlined">Name <b style={{color:'red',}}>*</b></InputLabel>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                value={unitForm.unit}
                onChange={(e) => { setUnitForm({ ...unitForm, unit: e.target.value }) }}
                type="text"
                name="unit"
              />
            </FormControl>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
          <InputLabel htmlFor="component-outlined">Short Name </InputLabel>
            <FormControl size="small" fullWidth>
              <OutlinedInput
                id="component-outlined"
                type="text"
                value={unitForm.shortname}
                onChange={(e) => { setUnitForm({ ...unitForm, shortname: e.target.value }) }}
                name="shortname"
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container sx={userStyle.gridcontainer}>
          <Grid >
            <Link to="/product/unit/list"><Button sx={userStyle.buttoncancel} type='button'>CANCEL</Button></Link>
            <Button sx={userStyle.buttonadd} type="submit" color="success" onClick={addUnitSubmit}>Save </Button>
          </Grid>
        </Grid>
      </Box>
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
function Unitcreatelist() {
  return (

    <Box>
      <Navbar />
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        <Box component="main" sx={{ paddingRight: '60px',paddingLeft: '60px',paddingTop: '20px', '@media (max-width: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
          <Unitcreate /><br /><br /><br /><br />
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}

export default Unitcreatelist;