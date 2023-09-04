export const BASE_URL = "http://localhost:8003";


export const AUTH = {

    LOGIN: `${BASE_URL}/api/authlog`,
    GETUSER: `${BASE_URL}/api/auth`,
    GETROLE: `${BASE_URL}/api/roles`,
    GETAUTHROLE: `${BASE_URL}/api/authrole`,
    GETSETTING: `${BASE_URL}/api/busisetngs`,
    LOGOUT: `${BASE_URL}/api/authout`,
    USER_AUTH_SIGNIN: `${BASE_URL}/api/users`,
    REG_AUTH: `${BASE_URL}/api/auth/new`,
    FORGOT_OTP: `${BASE_URL}/api/password/forgot`,
    PRODUCT: `${BASE_URL}/api/products`,
    POS: `${BASE_URL}/api/pos`,
    BUSINESS_LOCATION: `${BASE_URL}/api/businesslocations`,
    GETSINGLESETTINGS: `${BASE_URL}/api/authbusisetng`,
}