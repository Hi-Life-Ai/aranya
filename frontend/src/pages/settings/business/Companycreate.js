import React from 'react';
import { Box, Grid, FormControl, InputLabel, OutlinedInput,Button } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

export default function Countercreate({isSetngs, setIsSetngs, companys, setCompanys}) {
  
  function addCompany(){
    let uniqueid = Math.random().toFixed(5);
    setCompanys([...companys, {companyaddress:"",companyname:"",gstno:"",bankname:"",accountnumber:"",ifsccode:"",_id: uniqueid, newAdded:true}])
  }

  function multiCompanyInputs(referenceId,reference,inputvalue) {
    if (reference == "companyName") {
     let companyNameInput = companys.map((value,index)=> {
      if (referenceId == value._id) {
        return {...value,companyname:inputvalue}
      }
      else {
        return value;
      }
     });
     return setCompanys(companyNameInput);
    }
    else if (reference == "companyAddress") {
      let companyAddressInput = companys.map((value,index)=> {
        if (referenceId == value._id) {
          return {...value,companyaddress:inputvalue}
        }
        else {
          return value;
        }
       });
      return setCompanys(companyAddressInput);
    }
    else if (reference == "gstnCode") {
        let gstnoInput = companys.map((value,index)=> {
          if (referenceId == value._id) {
            return {...value,gstno:inputvalue}
          }
          else {
            return value;
          }
         });
        return setCompanys(gstnoInput);
      }
      else if (reference == "bankName") {
        let banknameInput = companys.map((value,index)=> {
          if (referenceId == value._id) {
            return {...value,bankname:inputvalue}
          }
          else {
            return value;
          }
         });
        return setCompanys(banknameInput);
      }
      else if (reference == "accountNo") {
        let accountnumberInput = companys.map((value,index)=> {
          if (referenceId == value._id) {
            return {...value,accountnumber:inputvalue}
          }
          else {
            return value;
          }
         });
        return setCompanys(accountnumberInput);
      }
      else if (reference == "ifscCode") {
        let ifsccodeInput = companys.map((value,index)=> {
          if (referenceId == value._id) {
            return {...value,ifsccode:inputvalue}
          }
          else {
            return value;
          }
         });
        return setCompanys(ifsccodeInput);
      }
  }

 

  const deleteCompany =(referenceId)=>{
    let counterdata = companys.filter((value,index)=> {
      if (referenceId != value._id) {
        return value;
      }
    });
    setCompanys(counterdata);
  }

    return (
        <Box>
          {companys.length >= 0 && ( 
              <ul type="none" className="todoLlistUl" style={{paddingLeft : '0px',marginLeft: '0px'}}>
            {companys.map((item, index) => {
              return(
              <li key={index}>
                <br />
                  <Grid container spacing={3}>
                    <Grid item sm={12} xs={12} md={3} lg={3}>
                    <InputLabel htmlFor="component-outlined">Company Name</InputLabel>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          value={item.companyname} 
                          onChange={(e) => multiCompanyInputs(item._id,"companyName",e.target.value)}
                          type="text"
                          name="companyname"
                          placeholder="Company Name"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item sm={12} xs={12} md={3} lg={3}>
                    <InputLabel htmlFor="component-outlined">Company Address</InputLabel>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          value={item.companyaddress} 
                          onChange={(e) => multiCompanyInputs(item._id,"companyAddress",e.target.value)}
                          type="text"
                          name="companyaddress"
                          placeholder="Company Address"
                        />
                      </FormControl>
                    </Grid> 
                    <Grid item sm={12} xs={12} md={3} lg={3}>
                    <InputLabel htmlFor="component-outlined">GSTN</InputLabel>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          value={item.gstno} 
                          onChange={(e) => multiCompanyInputs(item._id,"gstnCode",e.target.value)}
                          type="text"
                          name="gstno"
                          placeholder="GSTN No"
                        />
                      </FormControl>
                    </Grid> 
                    <Grid item sm={12} xs={12} md={3} lg={3}></Grid>  
                    <Grid item sm={12} xs={12} md={3} lg={3}>
                    <InputLabel htmlFor="component-outlined">Bank Name</InputLabel>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          value={item.bankname} 
                          onChange={(e) => multiCompanyInputs(item._id,"bankName",e.target.value)}
                          type="text"
                          name="bankname"
                          placeholder="Bank Name"
                        />
                      </FormControl>
                    </Grid>  
                    <Grid item sm={12} xs={12} md={3} lg={3}>
                    <InputLabel htmlFor="component-outlined">Account No</InputLabel>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          value={item.accountnumber} 
                          onChange={(e) => multiCompanyInputs(item._id,"accountNo",e.target.value)}
                          type="text"
                          name="accountnumber"
                          placeholder="Account No"
                        />
                      </FormControl>
                    </Grid> 
                    <Grid item sm={12} xs={12} md={3} lg={3}>
                    <InputLabel htmlFor="component-outlined">IFSC Code</InputLabel>
                      <FormControl size="small" fullWidth>
                        <OutlinedInput
                          id="component-outlined"
                          value={item.ifsccode} 
                          onChange={(e) => multiCompanyInputs(item._id,"ifscCode",e.target.value)}
                          type="text"
                          name="ifsccode"
                          placeholder="IFSC Code"
                        />
                      </FormControl>
                    </Grid>   
                    <Grid item sm={1} xs={1} md={1} lg={1} sx={{display:'flex'}}>
                      <Button variant="contained" color="success" type="button" onClick={() => addCompany()} sx={userStyle.categoryadd}><FaPlus /></Button>&nbsp;
                      <Button variant="contained" color="error" type="button" onClick={(e) => deleteCompany(item._id)} sx={userStyle.categoryadd}><AiOutlineClose sx={{fontSize: 'large', fontWeight: '900'}}/></Button>
                    </Grid>              
            </Grid>
            </li>
              ) 
            })}
          </ul>
            )
          } 
        </Box>
    );
}