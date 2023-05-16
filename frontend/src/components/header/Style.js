export const drawerHead = {
    drawer:{
        border: 'none !mportant',
        '& ..MuiDrawer-root':{
            border: 'none !mportant',
        },
  
 }
}

export const navbarStyle = {

    topbar:{
        backgroundColor: 'white',
         color: 'black', 
         border: 'none', 
         boxShadow: 'none'
    },

    navbarrightbtn:{
       position: 'relative',
       display: 'flex',
       marginRight: '2px',
       alignItems: 'center',
       justifyContent: 'center',
       flexShrink: 0,
       fontFamily: 'Roboto, sans-serif',
       lineHeight: 1,
       overflow: 'hidden',
       userSelect: 'none',
       cursor: 'pointer',
       borderRadius: '8px',
       minWidth: '38px',
       height: '28px',
       fontSize: '15px',
       transition: 'all 0.2s ease-in-out 0s',
       background: '#076e46',
       color: 'white',
       '&:hover':{
           background: '#0ec17c',
          color: 'white',
        }
    },
    '& .MuiButtonBase-root-MuiListItemButton-root':{
        '&:hover':{
            background: '#0ec17c',
           color: 'white',
         }
    }

}


