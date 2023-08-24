import React, { useState, useContext, useEffect } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, InputLabel, OutlinedInput, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Createdepartmentmod({ setFetchsavedepartment }) {

  // department Modal
  const [designationmodal, setDesignationmodal] = useState(false);
  const departmentModOpen = () => { setDesignationmodal(true); };
  const departmentModClose = () => { setDesignationmodal(false); setDepartment({ ...department, departmentid: "", departmentname: "" }); setShowAlert("") };
  const { auth, setngs } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState("")
  const [isDepartment, setIsDepartments] = useState([]);
  const [isDepartmentCode, setIsDepartmentCode] = useState([]);
  const [isDepartmentName, setIsDepartmentName] = useState([]);
  // ******** Text field ******** //
  const [department, setDepartment] = useState({ departmentid: "", departmentname: "" });


  //  Fetch department Data
  const fetchDepartments = async () => {
    try {
      let res = await axios.get(SERVICE.DEPARTMENT, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      let result = res.data.departments.filter((data, index) => {
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
      setIsDepartments(result);
    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
    }
  };

  //autogenerate....

  let newval = setngs ? setngs.departmentsku == undefined ? "DP0001" : setngs.departmentsku + "0001" : "DP0001";
  useEffect(
    () => {
      fetchDepartments();
    }, []
  )
  // ******** Request to db ******** //
  // Add Datas
  const sendRequest = async () => {
    try {
      let response = await axios.post(SERVICE.DEPARTMENT_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        departmentid: String(newval),
        departmentname: String(department.departmentname),
        assignbusinessid: String(setngs.businessid),
      });
      setFetchsavedepartment("None")
      setDepartment(response.data);
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      
      departmentModClose();

      await fetchDepartments();
    } catch (err) {
      const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
    }
  };
  const addDepartmentSubmit = (e) => {
    e.preventDefault();
    if (department.departmentname == "") {
      setShowAlert("Please enter department name!");
    }else if(isDepartmentCode.includes(newval)){
      setShowAlert("Code already exits!");
    } else if(isDepartmentName.includes(department.departmentname)){
      setShowAlert("Name already exits!");
    }
    else {
      setShowAlert("");
      sendRequest();
    }

  };
  return (
    <Box>
      <Grid sx={userStyle.spanPlusIcons} onClick={departmentModOpen}  ><AddCircleOutlineOutlinedIcon /></Grid>
      <Dialog
        onClose={departmentModClose}
        aria-labelledby="customized-dialog-title1"
        open={designationmodal}
      >
        <form>
          <DialogTitle id="customized-dialog-title1" onClose={departmentModClose} sx={{ fontWeight: "700px" }}>
            Add Department
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3} >
              <Grid item md={12} sm={12} xs={12}>
                <p style={{ color: 'red' }}>{showAlert}</p> <br />
                {isDepartment && (
                  isDepartment.map(
                    () => {
                      let strings = setngs ? setngs.departmentsku : "DP";
                      let refNo = isDepartment[isDepartment.length - 1].departmentid;
                      let digits = (isDepartment.length + 1).toString();
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
                <FormControl size="small" fullWidth>
                  <InputLabel htmlFor="component-outlined">Department ID <b style={{ color: 'red' }}>*</b></InputLabel>
                  <OutlinedInput
                    sx={userStyle.alertOutline}
                    id="component-outlined"
                    value={newval}
                    label="Department ID *"
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <InputLabel htmlFor="component-outlined">Department Name</InputLabel>
                  <OutlinedInput
                    sx={userStyle.alertOutline}
                    id="component-outlined"
                    value={department.departmentname}
                    onChange={(e) => { setDepartment({ ...department, departmentname: e.target.value }); setShowAlert(""); }}
                    label="Department Name"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant='contained' onClick={addDepartmentSubmit} sx={userStyle.buttonadd}>Save</Button>
            <Button onClick={departmentModClose} variant='contained' color="error" sx={userStyle.buttoncancel} style={{ marginTop: "5px" }}>Close</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
export default Createdepartmentmod;