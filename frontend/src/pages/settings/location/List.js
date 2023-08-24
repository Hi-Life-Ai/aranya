import React, { useState, useEffect, useContext, useRef } from 'react';
import { Button, Select, MenuItem, FormControl, OutlinedInput, Grid, Box, Typography, Table, TableHead, TableContainer, FormControlLabel, TableBody, DialogContentText, DialogTitle, Checkbox, Paper, DialogContent, DialogActions, Dialog } from '@mui/material';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { userStyle } from '../../PageStyle';
import Navbar from '../../../components/header/Navbar';
import Footer from '../../../components/footer/Footer';
import { StyledTableRow, StyledTableCell } from '../../../components/Table';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ExportXL, ExportCSV } from '../../Export';
import jsPDF from "jspdf";
import { useReactToPrint } from 'react-to-print';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { toast } from 'react-toastify';
import Headtitle from '../../../components/header/Headtitle';
import { SERVICE } from '../../../services/Baseservice';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';

const Locationtable = () => {

    const { auth, setngs } = useContext(AuthContext);
    const [busilocations, setBusilocations] = useState([]);
    const [exceldata, setExceldata] = useState([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Datatable 
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [sorting, setSorting] = useState({ column: '', direction: '' });
    const [searchQuery, setSearchQuery] = useState("");
    const [isActive, setIsActive] = useState("");

    // User Access
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);

    const [isPdfData, setIsPdfData] = useState({
        isBusiId: false, isBusiName: false, isBusiLandmark: false, isCountry: false, isLandline:false,
        isState: false, isCity: false, isZipcode: false, ismobile: false, ismobileone: false, ismobiletwo: false,
        ismobilethree: false, isWhatsapp: false, isEmail: false, isWebsite: false, isGstn: false, isAddress: false, isContactperson: false,
    })
    const [busilocationses, setBusilocationses] = useState({});

    const [isOpen, setIsOpen] = useState(false);
    const handlePdfOpen = () => { setIsOpen(true); };
    const handlePdfClose = () => { setIsOpen(false); };

    //delete model
    const handleClickOpen = (id) => { setIsDeleteOpen(true); };
    const handleClose = () => { setIsDeleteOpen(false); };

    // Alert popup
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpener = () => { setIsErrorOpen(true); };
    const handleCloser = () => { setIsErrorOpen(false); };

    // get particular columns for export excel
    const getexcelDatas = async () => {
        var data = busilocations.map(t => ({
            Name: t.name, 'Location ID': t.locationid, Landmark: t.landmark, Country: t.country, State: t.state, City: t.city, Zipcode: t.zipcde,
            Mobile: t.phonenumber,'Mobile 1': t.onephonenumber, 'Mobile 2': t.twophonenumber, 'Mobile 3': t.threephonenumber,
            'Landline Number': t.landlinenumber, 'WhatsApp No': t.whatsappno, Email: t.email, Website: t.website,
            'GSTN No': t.gstnno, 'Address': t.address, 'Contact Person Name': t.contactpersonname,'Contact Person No': t.contactpersonnum,
        }));
        setExceldata(data);
    }

    // Business Locations
    const fetchLocation = async () => {
        try {
            let response = await axios.get(SERVICE.BUSINESS_LOCATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = response.data.busilocations.filter((data, index) => {
                if (isUserRoleAccess.role == 'Admin') {
                    return data.assignbusinessid == setngs.businessid
                } else {
                    if (isUserRoleAccess.businesslocation.includes(data.name)) {
                        return data.assignbusinessid == setngs.businessid
                    }
                }
            })
            setBusilocations(result);
        } catch (err) {
            const messages = err?.response?.data?.message;
        if(messages) {
            toast.error(messages);
        }else{
            toast.error("Something went wrong!")
        }
        }
    };

    const getrow = async (id) => {
        try {
            let response = await axios.get(`${SERVICE.BUSINESS_LOCATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let getdata = response.data.sbusilocation.activate;
            await axios.put(`${SERVICE.BUSINESS_LOCATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                activate: !getdata,
            }).then(res => res.data);
            setIsActive("None");
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // Excel
    const fileName = 'Business Locations';

    const rowData = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.BUSINESS_LOCATION_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            })
            setBusilocationses(res.data.sbusilocation);//set function to get particular row
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    }

    //alert delete popup
    let busiid = busilocationses._id;
    const deleteLocation = async (busiid) => {
        try {
            let res = await axios.delete(`${SERVICE.BUSINESS_LOCATION_SINGLE}/${busiid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchLocation();
            handleClose();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if(messages) {
                toast.error(messages);
            }else{
                toast.error("Something went wrong!")
            }
        }
    };

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'HIPOS | BUSINESS LOCATIONS',
        pageStyle: 'print'
    });

    // PDF
    const downloadPdf = () => {
        const newData = busilocations.map(row => {
            delete row._id;
            delete row.createdAt;
            delete row.activate;
            delete row.assignbusinessid;
            delete row.__v

            { !isPdfData.isBusiId && delete row.locationid };
            { !isPdfData.isBusiName && delete row.name };
            { !isPdfData.isBusiLandmark && delete row.landmark };
            { !isPdfData.isCountry && delete row.country };
            { !isPdfData.isState && delete row.state };
            { !isPdfData.isCity && delete row.city };
            { !isPdfData.isZipcode && delete row.zipcde };
            { !isPdfData.ismobile && delete row.phonenumber };
            { !isPdfData.ismobileone && delete row.onephonenumber };
            { !isPdfData.ismobiletwo && delete row.twophonenumber };
            { !isPdfData.ismobilethree && delete row.threephonenumber };
            { !isPdfData.isLandline && delete row.landlinenumber };
            { !isPdfData.isWhatsapp && delete row.whatsappno };
            { !isPdfData.isEmail && delete row.email };
            { !isPdfData.isWebsite && delete row.website };
            { !isPdfData.isGstn && delete row.gstn };
            { !isPdfData.isAddress && delete row.address };
            { !isPdfData.isContactperson && delete row.contactpersonname };
            { !isPdfData.isContactperson && delete row.contactpersonnum };
            setIsPdfData(row);
            handlePdfClose();
        })

        const doc = new jsPDF()
        doc.autoTable({
            theme: "grid",
            body: busilocations
        })
        doc.save('Business Locations.pdf')
    }

    useEffect(
        () => {
            fetchLocation();
        }, [isActive, isOpen]
    );

    useEffect(
        () => {
            getexcelDatas();
        }, [busilocations]
    );

    // Sorting
    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };

    const sortedData = busilocations.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return a[sorting.column] > b[sorting.column] ? 1 : -1;
        } else if (sorting.direction === 'desc') {
            return a[sorting.column] < b[sorting.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIcon = (column) => {
        if (sorting.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sorting.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };

    // Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const filteredDatas = busilocations?.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(busilocations.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Box>
            <Headtitle title={'Business Locations'} />
            <Typography sx={userStyle.HeaderText}>Business Locations <Typography sx={userStyle.SubHeaderText}>Manage your business locations</Typography></Typography>
            <Box sx={userStyle.container}>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Typography sx={userStyle.importheadtext}>All your business locations</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        {isUserRoleCompare[0].abusinesslocation && (
                            <>
                                <Link to={'/settings/location/create'} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonadd}>ADD</Button></Link>
                            </>
                        )}
                    </Grid>
                </Grid><br /><br />
                <Grid style={userStyle.dataTablestyle}>
                    <Box>
                        <label htmlFor="pageSizeSelect">Show&ensp;</label>
                        <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                            <MenuItem value={(busilocations.length)}>All</MenuItem>
                        </Select>
                        <label htmlFor="pageSizeSelect">&ensp;entries</label>
                    </Box>
                    <Box>
                        <Grid sx={{ display: 'flex' }}>
                            <Grid><Typography sx={{ marginTop: '6px' }}>Search:&ensp;</Typography></Grid>
                            <FormControl fullWidth size="small" >
                                <OutlinedInput
                                    id="component-outlined"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </FormControl>
                        </Grid>
                    </Box>
                </Grid><br /><br />
                {/* EXPORT BUTTONS START */}
                <Grid container sx={userStyle.gridcontainer}>
                    <Grid >
                        {isUserRoleCompare[0].csvbusinesslocation && (
                            <>
                                <ExportCSV csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0].excelbusinesslocation && (
                            <>
                                <ExportXL csvData={exceldata} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare[0].printbusinesslocation && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                            </>
                        )}
                        {isUserRoleCompare[0].pdfbusinesslocation && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={() => handlePdfOpen()}><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                            </>
                        )}
                    </Grid>
                </Grid><br /><br />
                {/* EXPORT BUTTONS END */}
                {/* TABLE START */}
                <Box>
                    <TableContainer component={Paper} >
                        <Table aria-label="customized table" id="businessLocation" sx={{ minWidth: 700 }}>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell align="left">Action</StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('name')}><Box sx={userStyle.tableheadstyle}><Box>Name</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('name')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('locationid')}><Box sx={userStyle.tableheadstyle}><Box>Location ID</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('locationid')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('gstnno')}><Box sx={userStyle.tableheadstyle}><Box>GSTN No</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('gstnno')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('address')}><Box sx={userStyle.tableheadstyle}><Box>Address</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('address')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('landmark')}><Box sx={userStyle.tableheadstyle}><Box>Landmark</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('landmark')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('country')}><Box sx={userStyle.tableheadstyle}><Box>Country</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('country')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('state')}><Box sx={userStyle.tableheadstyle}><Box>State</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('state')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('city')}><Box sx={userStyle.tableheadstyle}><Box>City</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('city')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('zipcde')}><Box sx={userStyle.tableheadstyle}><Box>Zip Code</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('zipcde')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('phonenumber')}><Box sx={userStyle.tableheadstyle}><Box>Mobile</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('phonenumber')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('onephonenumber')}><Box sx={userStyle.tableheadstyle}><Box>Mobile 1</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('onephonenumber')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('twophonenumber')}><Box sx={userStyle.tableheadstyle}><Box>Mobile 2</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('twophonenumber')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('threephonenumber')}><Box sx={userStyle.tableheadstyle}><Box>Mobile 3</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('threephonenumber')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('whatsappno')}><Box sx={userStyle.tableheadstyle}><Box>WhatsApp</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('whatsappno')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('website')}><Box sx={userStyle.tableheadstyle}><Box>Website</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('website')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('email')}><Box sx={userStyle.tableheadstyle}><Box>Email</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('email')}</Box></Box></StyledTableCell>
                                    <StyledTableCell onClick={() => handleSorting('contactpersonname')}><Box sx={userStyle.tableheadstyle}><Box>Contact Person</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('contactpersonname')}</Box></Box></StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length > 0 ?
                                    (filteredData.map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell align="left">
                                                <Grid sx={{ display: 'flex' }}>
                                                    {isUserRoleCompare[0].ebusinesslocation && (
                                                        <>
                                                            <Link to={`/settings/location/edit/${row._id}`} style={{ textDecoration: 'none', color: '#fff', minWidth: '0px' }}><Button sx={userStyle.buttonedit}><EditOutlinedIcon style={{ fontSize: "large" }} /></Button></Link>
                                                        </>
                                                    )}
                                                    {isUserRoleCompare[0].dbusinesslocation && (
                                                        <>
                                                            <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(row._id) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
                                                        </>
                                                    )}
                                                    {isUserRoleCompare[0].activatebusinesslocation && (
                                                        <>
                                                            <Button variant="contained" color={row.activate == true ? 'success' : 'warning'} sx={{ minWidth: '0px', padding: '0 7px' }} onClick={(e) => { handleClickOpener((setShowAlert(row.activate == true ? 'Do you want to Deactivate?' : 'Do you want to Activate?'))); rowData(row._id) }}><PowerSettingsNewOutlinedIcon style={{ fontSize: 'large' }} /></Button>
                                                        </>
                                                    )}

                                                </Grid>
                                            </StyledTableCell>
                                            <StyledTableCell component="th" scope="row"> {row.name} </StyledTableCell>
                                            <StyledTableCell align="left">{row.locationid}</StyledTableCell>
                                            <StyledTableCell align="left">{row.gstnno}</StyledTableCell>
                                            <StyledTableCell align="left">{row.address}</StyledTableCell>
                                            <StyledTableCell align="left">{row.landmark}</StyledTableCell>
                                            <StyledTableCell align="left">{row.country}</StyledTableCell>
                                            <StyledTableCell align="left">{row.state}</StyledTableCell>
                                            <StyledTableCell align="left">{row.city}</StyledTableCell>
                                            <StyledTableCell align="left">{row.zipcde}</StyledTableCell>
                                            <StyledTableCell align="left">{row.phonenumber}</StyledTableCell>
                                            <StyledTableCell align="left">{row.onephonenumber}</StyledTableCell>
                                            <StyledTableCell align="left">{row.twophonenumber}</StyledTableCell>
                                            <StyledTableCell align="left">{row.threephonenumber}</StyledTableCell>
                                            <StyledTableCell align="left">{row.whatsappno}</StyledTableCell>
                                            <StyledTableCell align="left">{row.website}</StyledTableCell>
                                            <StyledTableCell align='left'>{row.email}</StyledTableCell>
                                            <StyledTableCell align="left">{row.contactpersonname}</StyledTableCell>
                                        </StyledTableRow>
                                    )))
                                    : <StyledTableRow><StyledTableCell colSpan={15} sx={{ textAlign: "center" }}>No data Available</StyledTableCell></StyledTableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer><br /><br />
                    <Box style={userStyle.dataTablestyle}>
                        <Box>
                            Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, busilocations.length)} of {busilocations.length} entries
                        </Box>
                        <Box>
                            <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={{ textTransform: 'capitalize', color: 'black' }}>
                                Prev
                            </Button>
                            {pageNumbers?.map((pageNumber) => (
                                <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                                    {pageNumber}
                                </Button>
                            ))}
                            {lastVisiblePage < totalPages && <span>...</span>}
                            <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={{ textTransform: 'capitalize', color: 'black' }}>
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Dialog
                    open={isDeleteOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                        <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="outlined">Cancel</Button>
                        <Button onClick={(e) => deleteLocation(busiid)} autoFocus variant="contained" color='error'> OK </Button>
                    </DialogActions>
                </Dialog>
                {/* PDF Model */}
                <Box>
                    <Dialog
                        open={isOpen}
                        onClose={handlePdfClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        maxWidth="md"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Select Option to Print PDF
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography variant="subtitle1">Choose any 6</Typography>
                                <Grid container spacing={2}>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isBusiName} onClick={(e) => { setIsPdfData({ ...isPdfData, isBusiName: !isPdfData.isBusiName }) }} />} label="Name" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isBusiId} onClick={(e) => setIsPdfData({ ...isPdfData, isBusiId: !isPdfData.isBusiId })} />} label="Location id" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isBusiLandmark} onClick={(e) => setIsPdfData({ ...isPdfData, isBusiLandmark: !isPdfData.isBusiLandmark })} />} label="Landmark" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isCountry} onClick={(e) => setIsPdfData({ ...isPdfData, isCountry: !isPdfData.isCountry })} />} label="Country" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isState} onClick={(e) => setIsPdfData({ ...isPdfData, isState: !isPdfData.isState })} />} label="State" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isCity} onClick={(e) => setIsPdfData({ ...isPdfData, isCity: !isPdfData.isCity })} />} label="City" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isZipcode} onClick={(e) => setIsPdfData({ ...isPdfData, isZipcode: !isPdfData.isZipcode })} />} label="Zipcode" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.ismobile} onClick={(e) => setIsPdfData({ ...isPdfData, ismobile: !isPdfData.ismobile })} />} label="Mobile" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.ismobileone} onClick={(e) => setIsPdfData({ ...isPdfData, ismobileone: !isPdfData.ismobileone })} />} label="Mobile 1" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.ismobiletwo} onClick={(e) => setIsPdfData({ ...isPdfData, ismobiletwo: !isPdfData.ismobiletwo })} />} label="Mobile 2" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.ismobilethree} onClick={(e) => setIsPdfData({ ...isPdfData, ismobilethree: !isPdfData.ismobilethree })} />} label="Mobile 3" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isWhatsapp} onClick={(e) => setIsPdfData({ ...isPdfData, isWhatsapp: !isPdfData.isWhatsapp })} />} label="WhatsApp" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isEmail} onClick={(e) => setIsPdfData({ ...isPdfData, isEmail: !isPdfData.isEmail })} />} label="Email" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isLandline} onClick={(e) => setIsPdfData({ ...isPdfData, isLandline: !isPdfData.isLandline })} />} label="Landline" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isWebsite} onClick={(e) => setIsPdfData({ ...isPdfData, isWebsite: !isPdfData.isWebsite })} />} label="Website" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isGstn} onClick={(e) => setIsPdfData({ ...isPdfData, isGstn: !isPdfData.isGstn })} />} label="GSTN No" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isAddress} onClick={(e) => setIsPdfData({ ...isPdfData, isAddress: !isPdfData.isAddress })} />} label="Address" />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <FormControlLabel control={<Checkbox checked={isPdfData.isContactperson} onClick={(e) => setIsPdfData({ ...isPdfData, isContactperson: !isPdfData.isContactperson })} />} label="Contact Person" />
                                    </Grid>
                                </Grid>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant='contained' color='primary' onClick={() => downloadPdf()} autoFocus>PDF</Button>
                            <Button variant='contained' color='error' onClick={handlePdfClose}>Close</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={isErrorOpen}
                        onClose={handleCloser}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                            <Typography variant="h6">{showAlert}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloser} variant="outlined">Cancel</Button>
                            <Button variant="contained" color="error" onClick={(e) => { getrow(busiid); handleCloser() }}>ok</Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
            {/* Print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="customized table" id="businessLocation" sx={{ minWidth: 700 }} ref={componentRef}>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="left">Location ID</StyledTableCell>
                            <StyledTableCell align="left">GSTN No</StyledTableCell>
                            <StyledTableCell align="left">Address</StyledTableCell>
                            <StyledTableCell align="left">Landmark</StyledTableCell>
                            <StyledTableCell align="left">Country</StyledTableCell>
                            <StyledTableCell align="left">State</StyledTableCell>
                            <StyledTableCell align="left">City</StyledTableCell>
                            <StyledTableCell align="left">Zip Code</StyledTableCell>
                            <StyledTableCell align="left">Mobile</StyledTableCell>
                            <StyledTableCell align="left">Mobile 1</StyledTableCell>
                            <StyledTableCell align="left">Mobile 2</StyledTableCell>
                            <StyledTableCell align="left">Mobile 3</StyledTableCell>
                            <StyledTableCell align="left">WhatsApp</StyledTableCell>
                            <StyledTableCell align="left">Website</StyledTableCell>
                            <StyledTableCell align="left">Email</StyledTableCell>
                            <StyledTableCell align="left">Contact Person</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {busilocations &&
                            (busilocations.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row"> {row.name} </StyledTableCell>
                                    <StyledTableCell align="left">{row.locationid}</StyledTableCell>
                                    <StyledTableCell align="left">{row.gstnno}</StyledTableCell>
                                    <StyledTableCell align="left">{row.address}</StyledTableCell>
                                    <StyledTableCell align="left">{row.landmark}</StyledTableCell>
                                    <StyledTableCell align="left">{row.country}</StyledTableCell>
                                    <StyledTableCell align="left">{row.state}</StyledTableCell>
                                    <StyledTableCell align="left">{row.city}</StyledTableCell>
                                    <StyledTableCell align="left">{row.zipcde}</StyledTableCell>
                                    <StyledTableCell align="left">{row.phonenumber}</StyledTableCell>
                                    <StyledTableCell align="left">{row.onephonenumber}</StyledTableCell>
                                    <StyledTableCell align="left">{row.twophonenumber}</StyledTableCell>
                                    <StyledTableCell align="left">{row.threephonenumber}</StyledTableCell>
                                    <StyledTableCell align="left">{row.whatsappno}</StyledTableCell>
                                    <StyledTableCell align="left">{row.website}</StyledTableCell>
                                    <StyledTableCell align='left'>{row.email}</StyledTableCell>
                                    <StyledTableCell align="left">{row.contactpersonname}</StyledTableCell>
                                </StyledTableRow>
                            ))
                            )}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* printlayout ends */}
        </Box>
    );
}
function Locationlist() {
    return (
        <Box>
            <Navbar />
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box component="main" sx={{ paddingRight: '60px', paddingLeft: '60px', paddingTop: '20px', '@media (maxWidth: 600px)': { paddingLeft: '30px', paddingRight: '30px' } }}>
                    <Locationtable /><br /><br /><br /><br />
                    <Footer />
                </Box>
            </Box>
        </Box>
    );
}
export default Locationlist;