import React, { useState, useMemo, useEffect, } from 'react';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import axios from 'axios';
import Applicationstack from './routes/Applicationstack';
import { AUTH } from './services/Authservice';
import Authstack from './routes/Authstack';
import { AuthContext, UserRoleAccessContext } from './context/Appcontext';

function App() {

  // Auth login state for access user to dashboard
  const [auth, setAuth] = useState({ loader: true, loginState: false, APIToken:"", loginuserid:"", loginuseruniqid:"", loginuserlocation:[], loginusersettings:"" })
  const [forgotAuth, setForgotAuth] = useState({ email: "", password: "", cpassword: "" })
  const [setngs, setSetngs] = useState();
  const [isUserRoleAccess, setIsUserRoleAccess] = useState({});
  const [isUserRoleCompare, setIsUserRoleCompare] = useState();
  const [isSetngs, setIsSetngs] = useState({});

  const authContextData = useMemo(() => {
    return { auth, setAuth, forgotAuth, setForgotAuth, setngs, setSetngs,isSetngs, setIsSetngs}
  },[])
  const applicationContextData = useMemo(() => {
    return {isUserRoleAccess, setIsUserRoleAccess, isUserRoleCompare, setIsUserRoleCompare}
  },[])

  useEffect(()=> {
    isCheckUserLogin();
  },[]);
  const isCheckUserLogin = async () => {
    let getApiToken = localStorage.getItem('APIToken');
    let getLoginUserid = localStorage.getItem('LoginUserId');
    let getLoginUseruniqid = localStorage.getItem('LoginUseruniqid');
    let getLoginUserlocation = localStorage.getItem('LoginUserlocation');
    let getLoginUserSettings = localStorage.getItem('LoginUsersettings');
    if(getApiToken){
      
        try{
          let loginuserdata = await axios.get(`${AUTH.GETUSER}/${getLoginUserid}`,
          {
            headers: {
              'Authorization':`Bearer ${getApiToken}`
            }
          })

          let userrole = await axios.get(AUTH.GETROLE,{
            headers: {
              'Authorization':`Bearer ${getApiToken}`
            }
          })
          let usersettings = await axios.get(AUTH.GETSETTING,{
            headers: {
              'Authorization':`Bearer ${getApiToken}`
            }
          })
          let result = usersettings.data.busisetngs.filter((data, index)=>{
              return loginuserdata.data.suser.assignbusinessid == data.businessid
          })
          setSetngs(result[0]);
          setIsUserRoleAccess(loginuserdata.data.suser);
          userRoleCompare(userrole.data.roles,loginuserdata.data.suser);
          setAuth((prevAuth)=> {
            return {...prevAuth,loader : false,loginState : true, APIToken : getApiToken, loginuserid: getLoginUserid, loginuseruniqid:getLoginUseruniqid, loginuserlocation: getLoginUserlocation, loginusersettings: getLoginUserSettings}
        });
        }catch(err){
          console.log(err.response.data.message);
        }
    }else{
      setAuth({...auth, loader:false, loginState: false})
    }  
}

const userRoleCompare = (roledata, userroledata) =>{
  let getuserrolecomparedata = roledata.filter((item, i)=>{
    if(userroledata.role == item.rolename){
      return item
    }
  })
  setIsUserRoleCompare(getuserrolecomparedata);
}
 
  return (
    <>
      <div>
        <AuthContext.Provider value={authContextData}>
          <UserRoleAccessContext.Provider value={applicationContextData}>
            {!auth.loginState ? <Authstack /> : <Applicationstack /> }
          </UserRoleAccessContext.Provider>
        </AuthContext.Provider>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;