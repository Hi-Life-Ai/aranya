import React, { useState, useEffect, useContext } from 'react';
import { userStyle } from '../../PageStyle';
import { Box, Grid, FormControl, Typography, InputLabel, OutlinedInput, TextareaAutosize, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

function CreatecateMod({ setFetchCate }) {

  const [catemodal, setCateModal] = useState(false);
  const cateModOpen = () => { setCateModal(true); };
  const cateModClose = () => { setCateModal(false); setCateForm({ ...cateForm, categoryname: "", categorycode: "", categorydescription: "" }); setShowAlert("") };
  const { auth, setngs } = useContext(AuthContext);
  const [isRemovefirstSubcategory, setIsRemovefirstSubcategory] = useState(false)
  const [firstSubCate, setFirstSubCate] = useState({ subcategryname: "", subcategrycode: "" });
  const [cateName, setCateName] = useState([]);
  const [cateCode, setCateCode] = useState([]);

  // ******** Text field ******** //
  const [cateForm, setCateForm] = useState({ categoryname: "", categorycode: "", categorydescription: "" });
  const [isSubCategory, setIsSubCategory] = useState([])
  const [isFirstSubCateView, setIsFirstSubCateView] = useState(false)

  //popup model
  const [showAlert, setShowAlert] = useState()

  const fetchData = async () => {
    try {
      let res = await axios.get(SERVICE.CATEGORIES, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      let resultcode = res.data.categories.map((data, index) => {
        if (data.assignbusinessid == setngs.businessid) {
          return data.categorycode
        }
      })
      let resultname = res.data.categories.map((data, index) => {
        if (data.assignbusinessid == setngs.businessid) {
          return data.categoryname
        }
      })
      setCateCode(resultcode);
      setCateName(resultname);
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  // ******** Request to db ******** //
  // Add Datas
  const sendRequest = async () => {
    // default value conditin for sub category
    let addDefaultValueSubCate;
    if (!isRemovefirstSubcategory) {
      let removefirstsubcategories = [firstSubCate, ...isSubCategory]
      addDefaultValueSubCate = removefirstsubcategories.map((value) => {
        let categryname = value.subcategryname.length == 0 ? "Default" : value.subcategryname;
        let categrycode = value.subcategrycode.length == 0 ? "Default" : value.subcategrycode;
        return { subcategryname: categryname, subcategrycode: categrycode }

      })
    } else {
      let removefirstsubcategories = [...isSubCategory]
      addDefaultValueSubCate = removefirstsubcategories.map((value) => {
        let categryname = value.subcategryname.length == 0 ? "Default" : value.subcategryname;
        let categrycode = value.subcategrycode.length == 0 ? "Default" : value.subcategrycode;
        return { subcategryname: categryname, subcategrycode: categrycode }

      })
    }
    try {
      let response = await axios.post(SERVICE.CATEGORIES_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        categoryname: String(cateForm.categoryname),
        categorycode: String(cateForm.categorycode),
        categorydescription: String(cateForm.categorydescription),
        subcategories: addDefaultValueSubCate,
        assignbusinessid: String(setngs.businessid),
      });
      setFetchCate("None")
      setCateForm(response.data);
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      cateModClose();
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages)
    }
  };

  const addHandleSubmit = (e) => {
    e.preventDefault();
    if (cateName.includes(cateForm.categoryname)) {
      setShowAlert("Name Already Exists");
    }
    else if (cateCode.includes(cateForm.categorycode)) {
      setShowAlert("ID Already Exists");
    }
    else if (cateForm.categoryname == "") {
      setShowAlert("Please enter Category name!");
    } else {
      sendRequest();
    }

  };
  // remove first sub category row
  const deleteFirstSubcate = () => {
    setIsFirstSubCateView(true);
    setIsRemovefirstSubcategory(true);
  }
  // sub category delete item of row
  const deleteSubCategory = (referenceIndex) => {
    let subCategoryData = isSubCategory.filter((value, index) => {
      if (referenceIndex != index) {
        return value;
      }
    });
    setIsSubCategory(subCategoryData);
  }

  //sub category add new item
  function addSubcategory() {
    setIsSubCategory([...isSubCategory, { subcategryname: "", subcategrycode: "" }]);
  }

  function multiSubCategoriesInputs(referenceIndex, reference, inputvalue) {
    if (reference == "subCategoryName") {
      let subCategoryNameInput = isSubCategory.map((value, index) => {
        if (referenceIndex == index) {
          return { ...value, subcategryname: inputvalue }
        }
        else {
          return value;
        }
      });
      return setIsSubCategory(subCategoryNameInput);
    }
    else if (reference == "subCategoryCode") {
      let subCategoryCodeInput = isSubCategory.map((value, index) => {
        if (referenceIndex == index) {
          return { ...value, subcategrycode: inputvalue }
        }
        else {
          return value;
        }
      });
      return setIsSubCategory(subCategoryCodeInput);
    }
  }

  return (
    <Box>
      <Grid sx={userStyle.spanPlusIcons} onClick={cateModOpen}><AddCircleOutlineOutlinedIcon /></Grid>
      <Dialog
        onClose={cateModClose}
        aria-labelledby="customized-dialog-title1"
        open={catemodal}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: '1px solid #b97df0',
          },
        }}
      >
        <form>
          <DialogTitle id="customized-dialog-title1" onClose={cateModClose}>
            Add Category
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item md={12} sm={12} xs={12}>
                <p style={{ color: 'red' }}>{showAlert}</p>
                <FormControl size="small" fullWidth>
                  <InputLabel htmlFor="component-outlined">Category Name <b style={{ color: 'red' }}>*</b></InputLabel>
                  <OutlinedInput
                    sx={userStyle.alertOutline}
                    id="component-outlined"
                    value={cateForm.categoryname}
                    onChange={(e) => { setCateForm({ ...cateForm, categoryname: e.target.value }) }}
                    label="Category Name"
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <InputLabel htmlFor="component-outlined">Category Code </InputLabel>
                  <OutlinedInput
                    sx={userStyle.alertOutline}
                    id="component-outlined"
                    value={cateForm.categorycode}
                    onChange={(e) => { setCateForm({ ...cateForm, categorycode: e.target.value }) }}
                    label="Category Code"
                  />
                </FormControl>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <InputLabel htmlFor="component-outlined">Description </InputLabel>
                <FormControl size="small" fullWidth>
                  <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid rgb(0 0 0 / 60%)' }}
                    value={cateForm.categorydescription}
                    onChange={(e) => { setCateForm({ ...cateForm, categorydescription: e.target.value }) }}
                    name="categorydescription"
                    sx={userStyle.alertOutline}
                  />
                </FormControl><br />
              </Grid>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              {!isFirstSubCateView &&
                (
                  <>
                    <Grid container columnSpacing={3}>
                      <Grid item sm={5} xs={12} md={5} lg={5}>
                        <InputLabel htmlFor="component-outlined">Sub Category Name</InputLabel>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            sx={userStyle.alertOutline}
                            id="component-outlined"
                            value={firstSubCate.subcategryname}
                            onChange={(e) => setFirstSubCate({ ...firstSubCate, subcategryname: e.target.value })}
                            type="text"
                            name="categoryname"
                            placeholder="Sub Category name"

                          />
                        </FormControl>
                      </Grid>
                      <Grid item sm={5} xs={12} md={5} lg={5}>
                        <InputLabel htmlFor="component-outlined">Sub Category Code</InputLabel>
                        <FormControl size="small" fullWidth>
                          <OutlinedInput
                            sx={userStyle.alertOutline}
                            id="component-outlined"
                            value={firstSubCate.subcategrycode}
                            onChange={(e) => setFirstSubCate({ ...firstSubCate, subcategrycode: e.target.value })}
                            type="text"
                            name="categoryname"
                            placeholder="Sub Category code"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item sm={1} xs={1} md={2} lg={2} sx={{ display: 'flex' }}>
                        <Button variant="contained" color="success" type="button" onClick={() => addSubcategory()} sx={userStyle.categoryadd}><FaPlus /></Button>&nbsp;
                        <Button variant="contained" color="error" type="button" onClick={deleteFirstSubcate} sx={userStyle.categoryadd}><AiOutlineClose /></Button>
                      </Grid>
                    </Grid>
                  </>
                )
              }
              {isSubCategory.length > 0 && (
                <ul type="none" className="todoLlistUl" style={{ paddingLeft: '0px', marginLeft: '0px' }}>
                  {isSubCategory.map((item, index) => {
                    return (
                      <li key={index}>
                        <br />
                        <Grid container columnSpacing={1}>
                          <Grid item sm={5} xs={12} md={5} lg={5}>
                            <FormControl size="small" fullWidth>
                              <OutlinedInput
                                sx={userStyle.alertOutline}
                                id="component-outlined"
                                value={item.subcategryname}
                                onChange={(e) => multiSubCategoriesInputs(index, "subCategoryName", e.target.value)}
                                type="text"
                                name="categoryname"
                                placeholder="Sub Category name"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={5} xs={12} md={5} lg={5}>
                            <FormControl size="small" fullWidth>
                              <OutlinedInput
                                sx={userStyle.alertOutline}
                                id="component-outlined"
                                value={item.subcategrycode}
                                onChange={(e) => multiSubCategoriesInputs(index, "subCategoryCode", e.target.value)}
                                type="text"
                                name="categoryname"
                                placeholder="Sub Category code"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={1} xs={1} md={2} lg={2} sx={{ display: 'flex' }}>
                            <Button variant="contained" color="success" type="button" onClick={() => addSubcategory()} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}><FaPlus /></Button>&nbsp;
                            <Button variant="contained" color="error" type="button" onClick={(e) => deleteSubCategory(index)} sx={{ height: '30px', minWidth: '30px', marginTop: '4px', padding: '6px 10px' }}><AiOutlineClose /></Button>
                          </Grid>
                        </Grid>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Grid>

          </DialogContent>
          <DialogActions>
            <Button autoFocus variant='contained' sx={userStyle.buttonadd} onClick={addHandleSubmit}>Save</Button>
            <Button onClick={cateModClose} variant='contained' color="error" sx={userStyle.buttoncancel}>Close</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default CreatecateMod;