import React, { useState, useContext, useEffect} from 'react';
import { Box } from '@mui/material';
import { SidebarItems } from './SidebarListItem';
import axios from 'axios';
import MenuItems from './Menuitem';
import { UserRoleAccessContext } from '../../context/Appcontext';
import { SERVICE } from '../../services/Baseservice';
import Header from './Header';

const Navbar = () => {

  const [filterSidebar,setFilterSidebar] = useState([]);

  const {isUserRoleCompare} = useContext(UserRoleAccessContext);
  const [roleAccess, setRoleAccess] = useState([]);

  const [users, setUsers] = useState([]);
  // let [roleAccess] = isUserRoleCompare;

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${SERVICE.USER_SINGLE}/${localStorage.LoginUserId}`); // replace this with the actual API endpoint to fetch the user role access data
      setUsers(response.data.suser.role);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserRoleAccess = async () => {
    try {

    let Roles = await axios.get(`${SERVICE.ROLE}`);
    let Result = Roles.data.roles.filter((data) => {
      if (users == data.rolename) {
        setRoleAccess(data)
      }
    })
 
    }
     catch (err) {
      console.error(err);
  };
}

  useEffect(() => {
 
    fetchUsers();
   
    fetchUserRoleAccess();
  },[users]);

  useEffect(
    ()=>{
      let roleSidebar = SidebarItems.filter((item)=> {
        return item.dbname && roleAccess[item.dbname]; 
      });

      let roleBasedSidebar = roleSidebar.map((item)=> {
        if (item.children) {
          let roleBasedChild = item.children.filter((item)=> {
            return item.dbname && roleAccess[item.dbname];
          });
          return {...item,children : roleBasedChild};
        }
        else {
          return item;
        }
      });
      setFilterSidebar(roleBasedSidebar);


    },[roleAccess]
  )

  return (
   
    <Box sx={{backgroundColor:'#3b3f3b'}}>
      <Header />
       <nav>
      <ul className="menus">
        {filterSidebar.map((menu, index) => {
          const depthLevel = 0;
          return (
            <MenuItems
              items={menu}
              key={index}
              depthLevel={depthLevel}
            />
          );
        })}
      </ul>   
     
    </nav>
    </Box>
  );
};

export default Navbar;
