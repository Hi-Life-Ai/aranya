import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, FormControl, InputLabel, DialogActions, DialogContent, Dialog, OutlinedInput, Typography, Button, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { AuthContext } from '../../../context/Appcontext';
import { SERVICE } from '../../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const Edit = () => {

  const { auth } = useContext(AuthContext);

  const [taxRate, setTaxRate] = useState({
    taxname: "", taxrategst: 0, taxratecgst: 0, taxrateigst: 0, taxtotal: 0,
  });

  //  popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenalert = () => { setIsErrorOpen(true); };
  const handleClosealert = () => { setIsErrorOpen(false); };

  const id = useParams().id;

  // Get Datas
  const fetchHandler = async () => {
    try {

      let req = await axios.get(`${SERVICE.TAXRATE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setTaxRate(req.data.staxrate);
    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }

    }
  };

  useEffect(() => {
    fetchHandler()
  }, [id]);

  const backLPage = useNavigate();

  // Edit Datas
  const sendRequest = async () => {
    try {
      let response = await axios.put(`${SERVICE.TAXRATE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        taxname: String(taxRate.taxname),
        taxrategst: Number(taxRate.taxrategst),
        taxratecgst: Number(taxRate.taxratecgst),
        taxrateigst: Number(taxRate.taxrateigst),
        taxtotal: Number(taxRate.taxtotal),
      });
      backLPage('/settings/taxrate/list')
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
    } catch (err) {
      const messages = err?.response?.data?.message;
      if(messages) {
          toast.error(messages);
      }else{
          toast.error("Something went wrong!")
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taxRate.taxname == "") {
      setShowAlert("Please enter name")
      handleClickOpenalert();

    } else if (taxRate.taxtotal == "" || taxRate.taxtotal == 0) {
      setShowAlert("Please enter any one of tax field")
      handleClickOpenalert();
    }
    else {
      sendRequest();
    }
  }

  const handleValidationGst = (e) => {
    let val = e.target.value;
    let alphabets = new RegExp('[a-zA-Z]')
    var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
    if (e.target.value.match(alphabets)) {
        setShowAlert("Please enter numbers only! (0-9)")
        handleClickOpenalert();
        let num = val.length;
        let value = val.slice(0, num - 1)
        setTaxRate({ ...taxRate, taxrategst: value })    
      }
    else if (regExSpecialChar.test(e.target.value)) {
        setShowAlert("Please enter numbers only! (0-9)")
        handleClickOpenalert();
        let num = val.length;
        let value = val.slice(0, num - 1)
        setTaxRate({ ...taxRate, taxrategst: value})
    }
  }

  const handleValidationCgst = (e) => {
    let val = e.target.value;
    let alphabets = new RegExp('[a-zA-Z]')
    var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
    if (e.target.value.match(alphabets)) {
        setShowAlert("Please enter numbers only! (0-9)")
        handleClickOpenalert();
        let num = val.length;
        let value = val.slice(0, num - 1)
        setTaxRate({ ...taxRate, taxratecgst: value })      
      }
    else if (regExSpecialChar.test(e.target.value)) {
        setShowAlert("Please enter numbers only! (0-9)")
        handleClickOpenalert();
        let num = val.length;
        let value = val.slice(0, num - 1)
        setTaxRate({ ...taxRate, taxratecgst: value })    
      }
  }

  const handleValidationIgst = (e) => {
    let val = e.target.value;
    let alphabets = new RegExp('[a-zA-Z]')
    var regExSpecialChar = /[ `₹!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
    if (e.target.value.match(alphabets)) {
        setShowAlert("Please enter numbers only! (0-9)")
        handleClickOpenalert();
        let num = val.length;
        let value = val.slice(0, num - 1)
        setTaxRate({ ...taxRate, taxrateigst: value })      
      }
    else if (regExSpecialChar.test(e.target.value)) {
        setShowAlert("Please enter numbers only! (0-9)")
        handleClickOpenalert();
        let num = val.length;
        let value = val.slice(0, num - 1)
        setTaxRate({ ...taxRate, taxrateigst: value })    
      }
  }

  return (
    <Box>
      <Headtitle title={'Taxrate Edit'} />
      <form onSubmit={handleSubmit}>
        <Typography sx={userStyle.HeaderText}>Edit Tax Rate </Typography>
        <Box sx={userStyle.container}>
          <Box sx={{ '& .MuiTextField-root': { maxWidth: '100%', minWidth: '100%', width: '400px' }, '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #4A7BF7', }, }} noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item sm={5} md={5}>
                <InputLabel htmlFor="component-outlined" > Name <b style={{ color: "red" }}> *</b></InputLabel>
                <FormControl size="small" fullWidth >
                  <OutlinedInput
                    id="component-outlined"
                    value={taxRate.taxname}
                    onChange={(e) => { setTaxRate({ ...taxRate, taxname: e.target.value }) }}
                    type='text'
                    name="taxname"
                    required
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item sm={3} md={3}>
                <InputLabel htmlFor="component-outlined" >GST %</InputLabel>
                <FormControl size="small" fullWidth >
                  <OutlinedInput
                    sx={userStyle.input}
                    id="component-outlined"
                    value={taxRate.taxrategst}
                    onChange={(e) => { setTaxRate({ ...taxRate, taxrategst: e.target.value, taxtotal: (Number(e.target.value) + Number(taxRate.taxratecgst) + Number(taxRate.taxrateigst)).toFixed(0) }); handleValidationGst(e) }}
                    type='text'
                    name="taxrategst"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item sm={3} md={3}>
                <InputLabel htmlFor="component-outlined" >CGST %</InputLabel>
                <FormControl size="small" fullWidth >
                  <OutlinedInput
                    sx={userStyle.input}
                    id="component-outlined"
                    value={taxRate.taxratecgst}
                    onChange={(e) => { setTaxRate({ ...taxRate, taxratecgst: e.target.value, taxtotal: (Number(taxRate.taxrategst) + Number(e.target.value) + Number(taxRate.taxrateigst)).toFixed(0) }); handleValidationCgst(e) }}
                    type='text'
                    name="taxratecgst"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item sm={3} md={3}>
                <InputLabel htmlFor="component-outlined" >IGST %</InputLabel>
                <FormControl size="small" fullWidth >
                  <OutlinedInput
                    sx={userStyle.input}
                    id="component-outlined"
                    value={taxRate.taxrateigst}
                    onChange={(e) => { setTaxRate({ ...taxRate, taxrateigst: e.target.value, taxtotal: (Number(taxRate.taxrategst) + Number(taxRate.taxratecgst) + Number(e.target.value)).toFixed(0) }); handleValidationIgst(e) }}
                    type='text'
                    name="taxrateigst"
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item sm={3} md={3}>
                <InputLabel htmlFor="component-outlined" >Total %</InputLabel>
                <FormControl size="small" fullWidth >
                  <OutlinedInput
                    sx={userStyle.input}
                    id="component-outlined"
                    value={taxRate.taxtotal}
                    type='number'
                    name="taxtotal"
                    required
                  />
                </FormControl>
              </Grid>
            </Grid>
            <br />
          </Box>
        </Box>
        <Grid container sx={userStyle.gridcontainer}>
          <Grid >
            <Link to={"/settings/taxrate/list"} ><Button sx={userStyle.buttoncancel} >Cancel</Button></Link>
            <Button sx={userStyle.buttonadd} type="submit">Update</Button>
          </Grid>
        </Grid>
      </form>
      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleClosealert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
            <Typography variant="h6" >{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClosealert}>ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

const Taxrateedit = () => {
  return (
    <>
      <Box>
        <Navbar />
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>
          <Box component="main"sx={{ paddingRight: '60px',paddingLeft: '60px',paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' }}}>
            <Edit /><br /><br /><br />
            <Footer />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Taxrateedit;