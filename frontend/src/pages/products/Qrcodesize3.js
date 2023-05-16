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
      {/* label size 25mm*20mm */}
      <Box sx={{ margin:0,position : "relative", padding:0, overflow:'hidden'}}>
        <Grid xs={12} md={12} lg={12} sx={12}>
          {productLabel.isProductLocation && <p className="BusinessLocation" style={{fontSize:'13px',color:"black" ,fontWeight:1200,textAlign:'center'}}><b>{setngs.businessname}</b></p>}
        </Grid>
      <Grid container>
            <Grid xs={2} md={2} lg={2} sm={2} sx={{textAlign:'center'}}>
           {/* {productLabel.isProductSizeAlphaRate && <p style = {{marginTop:'15px',fontSize:'15px',marginLeft:'-14px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',textTransform:'uppercase'}}>{getProductData.no + "#" + getProductData.alpharate} </p>}  */}

            </Grid>
            <Grid xs={1} md={1} lg={1} sm={1} sx={{textAlign:'center'}}>
            <Typography>{productLabel.isProductCode && <p style = {{fontSize:'11px',marginTop:'45px',marginLeft:'-2px', transform:'rotate(-90deg)',fontWeight:'bolder',textAlign:'center',color:'black',textTransform:'uppercase'}}>{getProductData.sku }</p>}</Typography>

            </Grid>
              <Grid xs={8} md={8} lg={8} sm={8} sx={{textAlign:'center'}}>
                <Typography>{productLabel.isProductCategory && <p style={{fontSize:'9px',fontWeight:1200,color:'black',marginLeft:'-5px', marginTop:'-5px'}}><b style={{textTransform:'uppercase'}}>{getProductData.category}</b></p> }</Typography>
              {/* <Typography> {productLabel.isProductSizeAlphaRate &&<p className="Alpharate" style={{fontSize:'12px',left:'2px', marginTop:'-4px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{getProductData.size + '/' + getProductData.brand}</b></p>}</Typography> */}
              <Grid container>
              <Grid xs={7} md={7} lg={7} sm={7} sx={{textAlign:'center'}}>
               <Typography> {productLabel.isProductMrp && <p className="productSellingPrice" style={{fontSize:'23px',color:'black', fontWeight:1200,textAlign:'center'}}><b>{'₹' + getProductData.mrp}</b></p>} </Typography>
               {/* <Typography>  {productLabel.isProductDiscPrice && <p className="ProductDiscoutPrice" style={{fontSize:'17px', color:'black',fontWeight:'bolder', textAlign:'center'}}><b>{'₹ ' + getProductData.}  </Typography> */}
              </Grid>
              <Grid xs={4} md={4} lg={4} sm={4} >
                <Box sx={{marginLeft:'4px'}}>
                  {imageUrl ? (
                    <a href={imageUrl} download >
                        <img src={imageUrl} alt="img" width={50} height={50} style={{marginTop:'-8px'}} />
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