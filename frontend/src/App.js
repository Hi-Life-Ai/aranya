import React, { useState, useMemo, useEffect, } from 'react';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import axios from 'axios';
import Applicationstack from './routes/Applicationstack';
import { AUTH } from './services/Authservice';
import Authstack from './routes/Authstack';
import { AuthContext, UserRoleAccessContext } from './context/Appcontext';
import { toast } from 'react-toastify';

function App() {

  // Auth login state for access user to dashboard
  const [auth, setAuth] = useState({ loader: true, loginState: false, APIToken: "", loginuserid: "", loginuseruniqid: "", loginuserlocation: [], loginusersettings: "" })
  const [forgotAuth, setForgotAuth] = useState({ email: "", password: "", cpassword: "" })
  const [setngs, setSetngs] = useState();
  const [isSetngs, setIsSetngs] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [allPos, setAllPos] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [isActiveLocations, setIsActiveLocations] = useState([]);
  const [isUserRoleAccess, setIsUserRoleAccess] = useState({});
  const [isUserRoleCompare, setIsUserRoleCompare] = useState();

  const authContextData = useMemo(() => {
    return { auth, setAuth, forgotAuth, setForgotAuth, setngs, setSetngs, isSetngs, setIsSetngs }
  })
  const applicationContextData = useMemo(() => {
    return { isUserRoleAccess, setIsUserRoleAccess, isUserRoleCompare, setIsUserRoleCompare, allProducts, setAllProducts, allLocations, setAllLocations, isActiveLocations, setIsActiveLocations, allPos, setAllPos, }
  }, [isUserRoleAccess, isUserRoleCompare, allPos, allProducts, allLocations, isActiveLocations])

  useEffect(() => {
    isCheckUserLogin();
  }, []);
  const isCheckUserLogin = async () => {
    let getApiToken = localStorage.getItem('APIToken');
    let getLoginUserid = localStorage.getItem('LoginUserId');
    let getLoginUseruniqid = localStorage.getItem('LoginUseruniqid');
    let getLoginUserlocation = localStorage.getItem('LoginUserlocation');
    let getLoginUserSettings = localStorage.getItem('LoginUsersettings');
    let getLoginUserRole = localStorage.getItem('LoginUserrole');

    if (getApiToken) {

      try {
        const [
          loginuserdata,
          userrole,
          usersettings,
          location,
        ] = await Promise.all([
          axios.get(`${AUTH.GETUSER}/${getLoginUserid}`,
            {
              headers: {
                'Authorization': `Bearer ${getApiToken}`
              }
            }),

          // axios.post(AUTH.GETROLE, {
          //   headers: {
          //     'Authorization': `Bearer ${getApiToken}`
          //   }
          // }),
          // axios.get(AUTH.GETSETTING, {
          //   headers: {
          //     'Authorization': `Bearer ${getApiToken}`
          //   }
          // }),
          axios.post(AUTH.GETAUTHROLE, {
            userloginbusinessid: String(getLoginUserSettings),
            userrole: String(getLoginUserRole)
          }),
          axios.post(AUTH.GETSINGLESETTINGS, {
            userloginbusinessid: String(getLoginUserSettings)
          }),
          axios.post(AUTH.BUSINESS_LOCATION, {
            businessid: String(getLoginUserSettings),
            role: String(getLoginUserRole),
            userassignedlocation: [getLoginUserlocation]
          }),
        ]);

        // let result = usersettings.data.busisetngs.filter((data, index) => {
        //   return loginuserdata.data.suser.assignbusinessid == data.businessid
        // })
        // setSetngs(result[0]);
        // setIsUserRoleAccess(loginuserdata.data.suser);
        // userRoleCompare(userrole.data.roles, loginuserdata.data.suser);
        // setAuth((prevAuth) => {
        //   return { ...prevAuth, loader: false, loginState: true, APIToken: getApiToken, loginuserid: getLoginUserid, loginuseruniqid: getLoginUseruniqid, loginuserlocation: getLoginUserlocation, loginusersettings: getLoginUserSettings }
        // });

        setSetngs(usersettings?.data?.result[0]);
        setIsUserRoleAccess(loginuserdata?.data?.suser);
        setIsUserRoleCompare(userrole?.data?.result);
        setAllLocations(location?.data?.businesslocations);
        setIsActiveLocations(location?.data?.businesslocationsactive);

        setAuth((prevAuth) => {
          return {
            ...prevAuth, loader: false, loginState: true, APIToken: getApiToken, loginuserid: getLoginUserid, loginuseruniqid: getLoginUseruniqid, loginuserlocation: getLoginUserlocation, loginusersettings: getLoginUserSettings, loginuserrole: getLoginUserRole
          }
        });

        //products
        axios.post(AUTH.PRODUCT, {
          businessid: String(getLoginUserSettings),
          role: String(getLoginUserRole),
          userassignedlocation: [getLoginUserlocation]
        }).then((response) => setAllProducts(response?.data?.products))



        //sales
        axios.post(AUTH.POS, {
          businessid: String(getLoginUserSettings),
          role: String(getLoginUserRole),
          userassignedlocation: [getLoginUserlocation]
        }).then((response) => setAllPos(response?.data?.pos1))

      } catch (err) {
        // console.log(err.response.data.message);
        const messages = err?.response?.data?.message;
        if (messages) {
          if (messages == "User not found") {
          } else {
            toast.error(messages);
          }
        } else {
          toast.error("Something went wrong, check connection!");
        }
      }
    } else {
      setAuth({ ...auth, loader: false, loginState: false })
    }
  }

  // const userRoleCompare = (roledata, userroledata) => {
  //   let getuserrolecomparedata = roledata.filter((item, i) => {
  //     if (userroledata.role == item.rolename) {
  //       return item
  //     }
  //   })
  //   setIsUserRoleCompare(getuserrolecomparedata);
  // }

  return (
    <>
      <div>
        <AuthContext.Provider value={authContextData}>
          <UserRoleAccessContext.Provider value={applicationContextData}>
            {!auth.loginState ? <Authstack /> : <Applicationstack />}
          </UserRoleAccessContext.Provider>
        </AuthContext.Provider>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;