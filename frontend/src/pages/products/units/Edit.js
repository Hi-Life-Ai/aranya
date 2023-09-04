import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Grid, FormControl, Dialog,DialogContent, DialogActions, OutlinedInput, InputLabel, Typography, } from "@mui/material";
import { userStyle } from "../../PageStyle";
import Navbar from "../../../components/header/Navbar";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Footer from "../../../components/footer/Footer";
import axios from "axios";
import { useNavigate, useParams ,Link} from "react-router-dom";
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import Headtitle from '../../../components/header/Headtitle';

function Uniteditlist() {

  const { auth } = useContext(AuthContext);
  const [unitForm, setUnitForm] = useState({});
    //popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpen = () => {
      setIsErrorOpen(true);
    };
    const handleClose = () => {
      setIsErrorOpen(false);
    };

  const id = useParams().id;

  // Get Datas
  const fetchHandler = async () => {
    try {
      let response = await axios.get(`${SERVICE.UNIT_SINGLE}/${id}`,{
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setUnitForm(response.data.sunit);
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  };

  const backLPage = useNavigate();

  // Edit Datas
  const sendRequest = async () => {
    try {
      let response = await axios.put(`${SERVICE.UNIT_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        unit: String(unitForm.unit),
        shortname: String(unitForm.shortname),
      });
      setUnitForm(response.data);
      toast.success(response.data.message,{
        position: toast.POSITION.TOP_CENTER
      });
      backLPage("/product/unit/list");
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  };

  useEffect(() => {
    fetchHandler();
  }, [id]);

  const editUnitSubmit = (e) => {
    e.preventDefault();
    if(unitForm.unit == ""){
      setShowAlert("Please enter unit name!");
      handleClickOpen();
    }else{
      sendRequest();
    }
  };

  return (
    <Box>
      <Headtitle title={'Edit Unit'} />
      <Typography sx={userStyle.HeaderText}>Edit Unit</Typography>
      <form onSubmit={editUnitSubmit}>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
            <Grid item md={6} lg={6} sm={12} xs={12}>
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
            <Grid item md={6} lg={6} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Short Name</InputLabel>
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
              <Grid>
                <Link to="/product/unit/list"><Button sx={userStyle.buttoncancel} type='button'>CANCEL</Button></Link>
                <Button sx={userStyle.buttonadd} type="submit">UPDATE</Button>
              </Grid>
            </Grid>
        </Box>
      </form>
      <Box>
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
    </Box>
  );
}

const Unitedit = () => {
  return (
    <>
      <Box>
        <Navbar />
        <Box sx={{ width: "100%", overflowX: "hidden" }}>
          <Box component="main" sx={{ paddingRight: '60px',paddingLeft: '60px',paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
            <Uniteditlist /><br /><br /><br /><br />
            <Footer />
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default Unitedit;

