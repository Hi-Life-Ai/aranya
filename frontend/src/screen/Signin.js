import { Grid, TextField, Typography, Button, Divider, Box, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { Container } from '@mui/system';
import { FavoriteSharp } from '@mui/icons-material';
import React, { useEffect, useState, useContext } from 'react';
import logo from '../assets/images/mainlogo.png';
import { loginSignIn } from './Loginstyle';
import './Signin.css';
import { BsThreeDots } from 'react-icons/bs';
import CarouselComponent from "./CarousalSignin";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/Appcontext';
import { AUTH } from '../services/Authservice';
const Signin = () => {
  useEffect(
    () => {
      document.body.classList.add('signinbackground');
      return () => {
        document.body.classList.remove('signinbackground');
      }
    }, []
  );

  const [isActive, setActive] = useState("false");
  const handleToggle = () => {

    if (signin.email == "") {
      toast.warning("Enter your email address");
    } else {
      setActive(!isActive);
    }

  };

  const [hiddenCont, setHiddencont] = useState(true);
  const handleMorelogo = () => {
    setHiddencont(!hiddenCont);
  };

  const [fade, setFade] = useState(true);
  const [hidden, setHiiden] = useState(true);
  const [signin, setSignin] = useState({ email: "", password: "", });

  const { auth, setAuth } = useContext(AuthContext);

  const triggerFade = () => {
    setFade(false);
    setHiiden(!hidden);
  };

  const responseGoogle = (response) => {
    return response
  }

  const backPage = useNavigate();

  const fetchHandler = async () => {
    try {
      const response = await axios.post(`${AUTH.LOGIN}`, {
        email: String(signin.email),
        password: String(signin.password)
      });
      if(response.data.user.useractive == true){
        // set login data to local storage
      localStorage.setItem('APIToken', response.data.token);
      localStorage.setItem('LoginUserId', response.data.user._id)
      localStorage.setItem('LoginUseruniqid', response.data.user.userid)
      localStorage.setItem('LoginUserlocation', response.data.user.businesslocation)
      localStorage.setItem('LoginUsersettings', response.data.user.assignbusinessid)
      //change login state
      setAuth({ ...auth, loginState: true, APIToken: response.data.token, loginuserid: response.data.user._id, loginuseruniqid: response.data.user.userid, loginuserlocation: response.data.user.businesslocation, loginusersettings: response.data.user.assignbusinessid});
      backPage('/');
      setSignin(response);
      }else{
        toast.error("This user didn't has login access");
        backPage('/signin');
      }
    }
    catch (err) {
      const messages = err.response.data.message;
      toast.error(messages);
      backPage('/signin');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchHandler();
  }

  return (
    <>
      <Container maxWidth="md" sx={{ marginTop: '100px', boxShadow: '0px 0px 10px #d6d3d363', backgroundColor: 'white', '@media (max-width: 750px)': { boxShadow: 'none !important', marginTop: '0px' }, '@media (max-width: 1050px)': { maxWidth: 'md' } }}>
        <Grid container sx={{ marginBottom: '10px' }} className="signInContainer">
          <Grid item xs={12} sm={12} md={7} className="signInContainer">
            <Grid sx={{ textAlign: 'center', marginTop: '40px', }}>
              <img src={logo} alt="HILIFEAILOGO" />
            </Grid>

            <Grid>
                <Grid sx={loginSignIn.container}>
                  <form onSubmit={handleSubmit}>
                    <Typography variant="h5" sx={loginSignIn.signInheadtxt} >Sign IN</Typography>
                    <Typography variant="h5" sx={loginSignIn.signInheadtxt}>to access HIPOS</Typography>
                    <TextField fullWidth
                      id="outlined-basic"
                      label="Email address"
                      name="email"
                      variant="outlined" sx={{ maxWidth: '90%' }}
                      value={signin.email}
                      onChange={(e) => setSignin({ ...signin, email: e.target.value })}
                    />

                    {/* PASSWORD CONTAINER START */}
                    <div className={fade ? 'fadedClass' : 'visibleClass'}>
                      <br />
                      <FormControl variant="outlined" fullWidth sx={{ maxWidth: '90%' }} >
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                          label="password *"
                          type="password"
                          name="password"
                          value={signin.password}
                          onChange={(e) => setSignin({ ...signin, password: e.target.value })}
                        />
                      </FormControl>
                      <Button variant="contained" type="submit" sx={loginSignIn.signinBtn}>Signin</Button>
                      <Box sx={loginSignIn.otplinks}>
                        <Link to="/forgetpwd" style={{ color: '#159AFF', textDecoration: 'none', textAlign: 'right', float: 'right' }} sx={loginSignIn.signInForgptpassword}>Forgot Password?</Link>
                      </Box>
                    </div><br />
                  </form>
                  {/* PASSWORD CONTAINER END */}

                  {/* NEXT BUTTON START */}
                  <div className={!hidden ? "hiddenbtn" : "showbtn"}>
                    <Button variant="contained" onAnimationEnd={triggerFade} className={isActive ? "btncontainer" : "btncontainer active"} onClick={() => { handleToggle() }} style={{ maxWidth: '90%' }}>  <Typography className={isActive ? "text" : "text active"} style={{ fontWeight: 'bolder', fontSize: '20px' }}>Next</Typography> <Typography className={isActive ? "loader" : "loader active"}></Typography></Button><br />
                    <br /><Typography variant="subtitle1"><Link to="/forgetpwd" style={{ color: '#0b0b0b', textDecoration: 'none' }}>Forgot Password</Link></Typography>
                  </div><br />
                  {/* NEXT BUTTON END */}

                </Grid>

                <Divider /><br />
            </Grid>
            <Grid>

            </Grid>
          </Grid>

          {/* CAROUSEL CONTAIENR START*/}
          <Grid item md={5} sx={loginSignIn.carouselcomp} className="carouselContainer">
            <CarouselComponent></CarouselComponent>
          </Grid>
          {/* CAROUSEL CONTAIENR END*/}

        </Grid>
      </Container><br /><br />
      <Box>
        {/* Sign In Footer Start  */}
        <Box sx={loginSignIn.singinfooter}>
          <Typography sx={loginSignIn.hearts}>Made with <FavoriteSharp sx={loginSignIn.heart} />&ensp;&ensp;&ensp;in TRICHY <b>&ensp;| &ensp;</b> திருச்சியில் உருவாக்கப்பட்டது &ensp;<FavoriteSharp sx={loginSignIn.heart} /> </Typography>
        </Box><br />
        {/* Sign In Footer End  */}
      </Box>
    </>
  )

}

export default Signin;