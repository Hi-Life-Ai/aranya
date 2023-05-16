// SELECT DROPDOWN STYLES
export const colourStyles = {
  menuList: styles => ({
      ...styles,
      background: 'white'
  }),
  option: (styles, { isFocused, isSelected }) => ({
      ...styles,

      // color:'black',
      color: isFocused
          ? 'rgb(255 255 255, 0.5)'
          : isSelected
              ? 'white'
              : 'black',
      background: isFocused
          ? 'rgb(25 118 210, 0.7)'
          : isSelected
              ? 'rgb(25 118 210, 0.5)'
              : null,
      zIndex: 1
  }),
  menu: base => ({
      ...base,
      zIndex: 100
  }),
  control: (base, state) => ({
      ...base,
      border: state.isFocused ? "1px solid #4a7bf7" : "1px solid #4a7bf7",
      boxShadow: state.isFocused ? "1px solid rgb(185,125,240)" : "1px solid rgb(185,125,240)",
      "&:hover": {
          border: state.isFocused ? "1px solid #4a7bf7" : "1px solid #4a7bf7"
      }
  })
}
export const dashboardstyle = {
    grid: {
        flexGrow: 1,
        padding: '30px',
        marginLeft: '10px',
        marginRight: '10px',
    },
    headlocation:{
        display: 'flex',
    }, 
    btngenerate: {
      backgroundColor: '#339d3a !important',
      border: '1px solid #339d3a',
      marginTop: '1em',
      height: '35px !important',
      borderRadius: '5px !important',
      color: 'white',
      '&:hover': { 
          backgroundColor: 'white !important',
          border:'1px solid #339d3a',
          color: '#339d3a',
       }
  },
      containerOne:{
        height: '180px',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        border: 'none rgba(144, 202, 249, 0.46)',
        backgroundColor:'#02de97',
        backgroundSize: 'cover !important',
        color: 'white',
        fontSize: '15px',
        borderRadius: '13px',
        fontWeight: '800',
        overflow: 'hidden',
        position: 'relative',
        '&:hover':{
            backgroundColor: '#0d6342',
            boxShadow: '10px 10px #d8d3d3',
        },
        '@media (max-width: 780px)' : {
            fontSize: '10px',
          }
      },
      
      containerFour:{
        height: '180px',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        border: 'none rgba(144, 202, 249, 0.46)',
        backgroundColor:'#49f586b0',
        backgroundSize: 'cover !important',
        color: 'white',
        fontSize: '15px',
        borderRadius: '13px',
        fontWeight: '800',
        overflow: 'hidden',
        position: 'relative',
        '&:hover':{
            backgroundColor: '#0d6342',
            boxShadow: '10px 10px #d8d3d3',
        },
        '@media (max-width: 780px)' : {
            fontSize: '10px',
          }
      },
      conetntbox:{
        height: '20%',
        margin: '15px 20px',
        justifyContent: 'space-around',
      },
      contentboxicon:{
        marginTop: '2px'
      },
      containerTable: {
        backgroundColor: 'rgb(255, 255, 255)',
        color: 'rgb(97, 97, 97)',
        boxShadow: 'none',
        borderRadius: '12px',
        overflow: 'hidden',
        height: 'max-content',
        padding: '30px',
        '& .MuiTable-root': {
          borderBottom: 'none !important',
          paddingTop: '20px',
          paddingBottom: '20px',
        },
        '& .MuiTableCell-root': {
          fontSize: '20px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: '1px solid #B97DF0',
        },
      },
      HeaderText: {
        fontFamily: "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif",
        fontSize: "23px",
        fontWeight: "400",
        margin: "10px 0px 10px 0px",
        color: 'rgb(94, 53, 177) !important',
      },
      importheadtext: {
        fontSize: '20px !important',
        color: 'rgb(94, 53, 177) !important',
      },
      buttongrp: {
        backgroundColor: 'rgb(245 243 246) !important',
        color: '#7009AB !important',
        borderColor: '#ddd !important',
        margin: '1px !important',
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: '12px !important',
      },
   
}
