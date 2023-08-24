import React, { useState, useContext, useEffect} from 'react';
import { Box } from '@mui/material';
import { SidebarItems } from './SidebarListItem';
import MenuItems from './Menuitem';
import { UserRoleAccessContext } from '../../context/Appcontext';
import Header from './Header';

const Navbar = () => {

  const [filterSidebar,setFilterSidebar] = useState([]);

  const {isUserRoleCompare} = useContext(UserRoleAccessContext);

  let [roleAccess] = isUserRoleCompare;

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
