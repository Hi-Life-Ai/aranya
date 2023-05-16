import React, {useState,useEffect, useContext} from 'react';
import {Grid, Paper , Box,Typography} from '@mui/material';
import QRCode from 'qrcode';
import { AuthContext } from '../../context/Appcontext';


function Qrcodegenerate({getProductData, productLabel, id}) { 
  const [imageUrl, setImageUrl] = useState('');

  const {setngs} = useContext(AuthContext)

  useEffect(()=> {
    generateQrCode();

  },[])

  const generateQrCode = async () => {
    try {
          const response = await QRCode.toDataURL(`${getProductData.sku}`);
          setImageUrl(response);
    }catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Box sx={{ margin:0,position : "relative", padding:0, overflow:'hidden'}}>
      <Grid xs={12} md={12} lg={12} sx={12}>
        {productLabel.isProductLocation && <p className="BusinessLocation" style={{fontSize:'13px',color:"black" ,fontWeight:'bolder',textAlign:'center'}}><b>{setngs.businessname}</b></p>}

          </Grid>
   
      <Grid container>
            <Grid xs={2} md={2} lg={2} sm={2} sx={{textAlign:'center'}}>
           {productLabel.isProductCode && <p style = {{marginTop:'22px',fontSize:'14px',left:'-10px',fontWeight:"bolder",transform:'rotate(-90deg)',color:'black',position:'absolute',fontWeight:"bold",textAlign:'center',textTransform:'uppercase'}}>{"1 # TAR"}</p>} 

            </Grid>
            <Grid xs={1} md={1} lg={1} sm={1} sx={{textAlign:'center'}}>
            <Typography>{productLabel.isProductCode && <p style = {{fontSize:'12px',marginTop:'49px', transform:'rotate(-90deg)',fontWeight:"bold",textAlign:'center',color:'black',textTransform:'uppercase'}}>{getProductData.sku + id}</p>}</Typography>

            </Grid>
              <Grid xs={8} md={8} lg={8} sm={8} sx={{textAlign:'center'}}>
                <Typography>{productLabel.isProductCategory && <p style={{fontSize:'11px',fontWeight:'bolder',color:'black'}}><b style={{textTransform:'uppercase'}}>{getProductData.category}</b></p> }</Typography>
              {/* <Typography> {productLabel.isProductSizeAlphaRate &&<p className="Alpharate" style={{fontSize:'11px', textAlign:'center',fontWeight:'bolder', color:'black'}}><b>{"18/AIRTEL"}</b></p>}</Typography> */}
              <Grid container>
              <Grid xs={8} md={8} lg={8} sm={8} sx={{textAlign:'center'}}>
               <Typography> {productLabel.isProductMrp && <p className="productSellingPrice" style={{fontSize:'17px', color:'black', fontWeight:'bolder',textAlign:'center'}}><b>{ '₹ ' + getProductData.mrp.toFixed(2)}</b></p>} </Typography>
               {/* <Typography>  {productLabel.isProductDiscPrice && <p className="ProductDiscoutPrice" style={{fontSize:'17px', color:'black',fontWeight:'bolder', textAlign:'center'}}><b>{'₹ ' +getProductData.pruchaseincludetax.toFixed(2)}</b></p>}  </Typography> */}
              </Grid>
              <Grid xs={3} md={3} lg={3} sm={3} >
                <Box>
                  {imageUrl ? (
                    <a href={imageUrl} download >
                        <img src={imageUrl} alt="img" width={50} height={50} />
                    </a>) : null
                  }
                  </Box>
                </Grid>
              </Grid>
            </Grid>
      </Grid>
    </Box>
      
    </>
    
  );
}


export default Qrcodegenerate;