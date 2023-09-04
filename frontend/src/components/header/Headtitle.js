import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { SERVICE } from '../../services/Baseservice';
import { AuthContext } from '../../context/Appcontext';
import { toast } from 'react-toastify';

const Headtitle = ({ title }) => {

    const { auth, setngs } = useContext(AuthContext);


    let bnname = setngs ? setngs.businessname : "";


    return (
        <Helmet>
            <title>{`${title} - ${bnname}`}</title>
        </Helmet>
    )
}

export default Headtitle;