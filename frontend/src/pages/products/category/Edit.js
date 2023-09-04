import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Grid, Typography, FormControl, InputLabel, OutlinedInput, TextareaAutosize, Dialog, DialogContent, DialogActions, } from '@mui/material';
import { userStyle } from '../../PageStyle';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import Headtitle from '../../../components/header/Headtitle';
import { toast } from 'react-toastify';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext } from '../../../context/Appcontext';

function Categoryeditlist() {

  const [isCategory, setIsCategory] = useState({});
  const [subCategories, setSubCategories] = useState([]);
  const { auth } = useContext(AuthContext);
  const id = useParams().id;

  //popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenc = () => { setIsErrorOpen(true); };
  const handleClosec = () => { setIsErrorOpen(false); };

  // fetch particular id value
  const fetchCategory = async () => {
    try {
      let req = await axios.get(`${SERVICE.CATEGORIES_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setIsCategory(req.data.scategory);
      setSubCategories(req.data.scategory.subcategories);
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  }

  //sub category add new item
  function addSubcategory() {
    let uniqueId = Math.random().toFixed(5)
    setSubCategories([...subCategories, { subcategryname: "", subcategrycode: "", _id: uniqueId, newAdded: true }]);
  }

  function multiSubCategoriesInputs(referenceId, reference, inputvalue) {
    if (reference == "subCategoryName") {
      let subCategoryNameInput = subCategories.map((value, index) => {
        if (referenceId == value._id) {
          return { ...value, subcategryname: inputvalue }
        }
        else {
          return value;
        }
      });
      return setSubCategories(subCategoryNameInput);
    }
    else if (reference == "subCategoryCode") {
      let subCategoryCodeInput = subCategories.map((value, index) => {
        if (referenceId == value._id) {
          return { ...value, subcategrycode: inputvalue }
        }
        else {
          return value;
        }
      });
      return setSubCategories(subCategoryCodeInput);
    }
  }

  // sub category delete item of row
  const deleteSubCategory = (referenceId) => {
    let subCategoryData = subCategories.filter((value, index) => {
      if (referenceId != value._id) {
        return value;
      }
    });
    setSubCategories(subCategoryData);
  }

  let backPage = useNavigate();

  //get all values in one row so that spread sub category
  const idRemovedNew = () => {
    const idRemovedSubCategory = subCategories.map((value) => {
      if (value.newAdded) {
        return { subcategryname: value.subcategryname, subcategrycode: value.subcategrycode }
      }
      else {
        return value;
      }
    });
    sendRequest(idRemovedSubCategory);
  }

  // store edited data to particular id update request
  const sendRequest = async (subcategories, brands) => {

    // default value conditin add in sub category
    let addDefaultValueSubCate;
    addDefaultValueSubCate = subcategories.map((value) => {
      let categryname = value.subcategryname.length == 0 ? "Default" : value.subcategryname;
      let categrycode = value.subcategrycode.length == 0 ? "Default" : value.subcategrycode;
      return { subcategryname: categryname, subcategrycode: categrycode }

    })

    try {
      let res = await axios.put(`${SERVICE.CATEGORIES_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        categoryname: String(isCategory.categoryname),
        categorycode: String(isCategory.categorycode),
        categorydescription: String(isCategory.categorydescription),
        subcategories: addDefaultValueSubCate,

      });
      setIsCategory(res.data);
      toast.success(res.data.message, {
        position: toast.POSITION.TOP_CENTER
      });
      backPage("/product/category/list");
    } catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
    }
  };

  useEffect(
    () => {
      fetchCategory();
    }, []
  )

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCategory.categoryname == "") {
      setShowAlert("Please enter category name!");
      handleClickOpenc();

    } else if (isCategory.categorycode == "") {
      setShowAlert("Please enter category code!");
      handleClickOpenc();

    } else {
      idRemovedNew();
    }

  }

  return (
    <Box>
      <Headtitle title={'Edit Category'} />
      {/* Form Start */}
      <form onSubmit={handleSubmit}>
        <Typography sx={userStyle.HeaderText}>Edit Category</Typography>
        <Box sx={userStyle.container}>
          <Grid container spacing={3} sx={userStyle.textInput}>
            <Grid item md={12} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Category name <b style={{ color: 'red', }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isCategory.categoryname}
                  onChange={(e) => { setIsCategory({ ...isCategory, categoryname: e.target.value }) }}
                  type="text"
                  name="categoryname"
                />
              </FormControl>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <InputLabel htmlFor="component-outlined">Category Code <b style={{ color: 'red', }}>*</b></InputLabel>
              <FormControl size="small" fullWidth>
                <OutlinedInput
                  id="component-outlined"
                  value={isCategory.categorycode}
                  onChange={(e) => { setIsCategory({ ...isCategory, categorycode: e.target.value }) }}
                  type="text"
                  name="categorycode"
                />
              </FormControl>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <InputLabel id="demo-select-small">Description</InputLabel>
              <FormControl size="small" fullWidth >
                <TextareaAutosize aria-label="minimum height" minRows={3} style={{ border: '1px solid rgb(0 0 0 / 60%)', color: 'rgb(0 0 0 / 60%)' }}
                  value={isCategory.categorydescription}
                  onChange={(e) => { setIsCategory({ ...isCategory, categorydescription: e.target.value }) }}
                  name="categorydescription"
                />
              </FormControl>
            </Grid>
          </Grid><br />
          {
            subCategories.length >= 0 && (
              <ul type="none" className="todoLlistUl" style={{ paddingLeft: '0px', marginLeft: '0px' }}>
                {subCategories.map((item, index) => {
                  return (
                    <li key={index}>
                      <br />
                      <Grid container columnSpacing={1}>
                        <Grid item sm={12} xs={12} md={5} lg={5}>
                          <InputLabel htmlFor="component-outlined">Sub Category Name</InputLabel>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput
                              id="component-outlined"
                              value={item.subcategryname}
                              onChange={(e) => multiSubCategoriesInputs(item._id, "subCategoryName", e.target.value)}
                              type="text"
                              name="categoryname"
                              placeholder="Sub Category name"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item sm={12} xs={12} md={5} lg={5}>
                          <InputLabel htmlFor="component-outlined">Sub Category Code</InputLabel>
                          <FormControl size="small" fullWidth>
                            <OutlinedInput
                              id="component-outlined"
                              value={item.subcategrycode}
                              onChange={(e) => multiSubCategoriesInputs(item._id, "subCategoryCode", e.target.value)}
                              type="text"
                              name="categoryname"
                              placeholder="Sub Category code"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item sm={1} xs={1} md={2} lg={2} sx={{ display: 'flex' }}>
                          <Button variant="contained" color="success" type="button" onClick={() => addSubcategory()} sx={userStyle.categoryadd}><FaPlus /></Button>&nbsp;
                          <Button variant="contained" color="error" type="button" onClick={(e) => deleteSubCategory(item._id)} sx={userStyle.categoryadd}><AiOutlineClose /></Button>
                        </Grid>
                      </Grid>
                    </li>
                  )
                })}
              </ul>
            )
          } <br />
          <Grid container sx={{ marginTop: '20px', marginBottom: '20px', justifyContent: 'center' }}>
            <Button sx={userStyle.buttonadd} type="submit" autoFocus>UPDATE</Button>
            <Link to="/product/category/list"><Button sx={userStyle.buttoncancel}>CANCEL</Button></Link>
          </Grid>
        </Box>
      </form>
      {/* Form End */}
      {/* ALERT DIALOG */}
      <Box>
        <Dialog
          open={isErrorOpen}
          onClose={handleClosec}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
            <Typography variant="h6" >{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClosec}>ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

const Catedit = () => {
  return (
    <>
      <Box>
        <Navbar />
        <Box sx={{ width: '100%', overflowX: 'hidden' }}>
          <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
            <Categoryeditlist /><br /><br /><br /><br />
            <Footer />
          </Box>
        </Box>
      </Box>
    </>
  );
}
export default Catedit;;