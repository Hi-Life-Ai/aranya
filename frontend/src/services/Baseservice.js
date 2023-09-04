import {
    BASE_URL
} from './Authservice';

export const SERVICE = {

    FEATURE: `${BASE_URL}/api`,
    //user
    USER: `${BASE_URL}/api/users`,
    USER_CREATE: `${BASE_URL}/api/user/new`,
    USER_SINGLE: `${BASE_URL}/api/auth`,
    USER_TERMSTRUE: `${BASE_URL}/api/userstermstrue`,
    USER_TERMSFALSE: `${BASE_URL}/api/userstermsfalse`,
    USER_SINGLEPW: `${BASE_URL}/api/userpw`,
    //role
    ROLE: `${BASE_URL}/api/roles`,
    ROLE_CREATE: `${BASE_URL}/api/role/new`,
    ROLE_SINGLE: `${BASE_URL}/api/role`,

    //departments
    DEPARTMENT: `${BASE_URL}/api/departments`,
    DEPARTMENT_CREATE: `${BASE_URL}/api/department/new`,
    DEPARTMENT_SINGLE: `${BASE_URL}/api/department`,
    //product
    PRODUCT: `${BASE_URL}/api/products`,
    PRODUCT_CREATE: `${BASE_URL}/api/product/new`,
    PRODUCT_SINGLE: `${BASE_URL}/api/product`,
    PRODUCT_ID_FILTER: `${BASE_URL}/api/getallproductsid`,
    //unit
    UNIT: `${BASE_URL}/api/units`,
    UNIT_CREATE: `${BASE_URL}/api/unit/new`,
    UNIT_SINGLE: `${BASE_URL}/api/unit`,
    //category
    CATEGORIES: `${BASE_URL}/api/categories`,
    CATEGORIES_CREATE: `${BASE_URL}/api/category/new`,
    CATEGORIES_SINGLE: `${BASE_URL}/api/category`,
    //expense
    EXPENSE: `${BASE_URL}/api/expenses`,
    EXPENSE_CREATE: `${BASE_URL}/api/expense/new`,
    EXPENSE_SINGLE: `${BASE_URL}/api/expense`,
    EXPENSE_LASTINDEX: `${BASE_URL}/api/expenselastindex`,
    EXPENSE_CATEGORY_BYID: `${BASE_URL}/api/expcategoriesbyid`,
    EXPENSE_BYID: `${BASE_URL}/api/expensesbuid`,
    EXPENSE_DATEFILTER: `${BASE_URL}/api/expensedatefilter`,
    EXPENSE_TODAY: `${BASE_URL}/api/expenseToday`,
    //expense category
    EXPENSE_CATEGORY: `${BASE_URL}/api/expcategories`,
    EXPENSE_CATEGORY_CREATE: `${BASE_URL}/api/expcategory/new`,
    EXPENSE_CATEGORY_SINGLE: `${BASE_URL}/api/expcategory`,
    EXPENSE_CATEGORY_LASTINDEX: `${BASE_URL}/api/expcategorylastindex`,
    //sell
    SALES: `${BASE_URL}/api/sales`,
    SALES_CREATE: `${BASE_URL}/api/sale/new`,
    //draft
    DRAFT: `${BASE_URL}/api/drafts`,
    DRAFT_SINGLE: `${BASE_URL}/api/draft`,
    DRAFT_CREATE: `${BASE_URL}/api/draft/new`,
    //quotation
    QUOTATION: `${BASE_URL}/api/quotations`,
    QUOTATION_SINGLE: `${BASE_URL}/api/quotation`,
    QUOTATION_CREATE: `${BASE_URL}/api/quotation/new`,
    //pos
    POS: `${BASE_URL}/api/pos`,
    POS_CREATE: `${BASE_URL}/api/pos/new`,
    POS_SINGLE: `${BASE_URL}/api/pos`,
    POS_CATEFILTER: `${BASE_URL}/api/poscatefilter`,
    POS_DATEFILTER: `${BASE_URL}/api/posdatefilter`,
    POS_TODAY: `${BASE_URL}/api/postoday`,
    //settings
    SETTINGS: `${BASE_URL}/api/busisetngs`,
    SETTING_CREATE: `${BASE_URL}/api/busisetng/new`,
    SETTING_SINGLE: `${BASE_URL}/api/busisetng`,
    //business location
    BUSINESS_LOCATION: `${BASE_URL}/api/businesslocations`,
    BUSINESS_LOCATION_CREATE: `${BASE_URL}/api/businesslocation/new`,
    BUSINESS_LOCATION_SINGLE: `${BASE_URL}/api/businesslocation`,
    BUSINESS_LOCATION_LASTINDEX: `${BASE_URL}/api/busilocationlastindex`,
    //taxrate
    TAXRATE: `${BASE_URL}/api/taxrates`,
    TAXRATE_CREATE: `${BASE_URL}/api/taxrate/new`,
    TAXRATE_SINGLE: `${BASE_URL}/api/taxrate`,

    //stock
    STOCK: `${BASE_URL}/api/stocks`,
    STOCK_CREATE: `${BASE_URL}/api/stock/new`,
    STOCK_SINGLE: `${BASE_URL}/api/stock`,
    //stock transfer
    TRANSFERS: `${BASE_URL}/api/transfers`,
    TRANSFER_CREATE: `${BASE_URL}/api/transfer/new`,
    TRANSFER_SINGLE: `${BASE_URL}/api/transfer`,
    TRANSFERS_LOCATION: `${BASE_URL}/api/transferlocationwise`,
    ALLTRANSFERS: `${BASE_URL}/api/alltransfers`,
    ALLADJUSTS: `${BASE_URL}/api/alladjusts`,

    //reports
    DAYWISE_REPORTS: `${BASE_URL}/api/daywiseprofit`,
    MONTHWISE_PROFIT: `${BASE_URL}/api/monthwiseprofit`,
    WEEKWISE_PROFIT: `${BASE_URL}/api/weekwiseprofit`,
    YEARWISE_PROFIT: `${BASE_URL}/api/yearwiseprofit`,
    CURRENT_YEAR_PROFIT: `${BASE_URL}/api/currentyearprofit`,
    CATE_WISE_PROFIT: `${BASE_URL}/api/catewiseprofit`,
    SUBCATE_PROFIT: `${BASE_URL}/api/subcateprofit`,
    LOCATION_WISE_INDIVIDUAL: `${BASE_URL}/api/locindiprofit`,
    PRODUCTS_ALL: `${BASE_URL}/api/productsall`,
    ITEM_SEARCH: `${BASE_URL}/api/itemsearch`,
    ITEMWISWE_LOCATION: `${BASE_URL}/api/itemwiselocation`,
    ITEMWISE_PRODUCT: `${BASE_URL}/api/itemproduct`,
    TRANSFER_REPORTS: `${BASE_URL}/api/transeferreport`,
    ADJUST_REPORTS: `${BASE_URL}/api/adjustreport`,
    REJECT_REPORT: `${BASE_URL}/api/rejectreport`,
    TODAY_REJECT: `${BASE_URL}/api/todayreject`,
    TODAY_ADJUST: `${BASE_URL}/api/todayadjust`,
    TODAY_TRANSFERS: `${BASE_URL}/api/todaytransfers`,
}