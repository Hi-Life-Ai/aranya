export const SidebarItems = [
    {
        id: 1,
        label: 'Home',
        dbname: 'home',
        route: '/',
    },
    {
        id: 2,
        label: 'User Management',
        dbname: 'usermanagement',
        name: 'user',
        children: [
            {
                id: 1,
                label: 'User',
                dbname: 'alluser',
                route: '/user/user/list',
            },
            {
                id: 2,
                label: 'Role',
                dbname: 'allrole',
                route: '/user/role/list',
            },
            {
                id: 3,
                label: 'Department',
                dbname: 'alldepartment',
                route: '/user/department/list',
            }
        ]
    },

    {
        id: 3,
        label: 'Products',
        dbname: 'productmanagement',
        name: 'product',
        children: [
            {
                id: 1,
                label: 'Category',
                dbname: 'allcategory',
                route: '/product/category/list',
            },
            {
                id: 2,
                label: 'Schedule',
                dbname: 'allschedule',
                route: '/product/schedule',
            },
            {
                id: 3,
                label: 'Unit',
                dbname: 'allunit',
                route: '/product/unit/list',
            },
            {
                id: 4,
                label: 'Add Products',
                dbname: 'aproduct',
                route: '/product/product/create',
            },
            {
                id: 5,
                label: 'Import Products',
                dbname: 'iproduct',
                route: '/product/importproducts',
            },
            {
                id: 6,
                label: 'List products',
                dbname: 'allproduct',
                route: '/product/product/list',
            },
            {
                id: 7,
                label: 'Category Wise Report',
                dbname: 'allcatwisereport',
                route: '/product/categorywisereport',
            },
            {
                id: 8,
                label: 'Subcategory Wise Report',
                dbname: 'allsubcatwisereport',
                route: '/product/subcategorywisereport',
            },
            {
                id: 9,
                label: 'Unit Wise Report',
                dbname: 'allunitwisereport',
                route: '/product/unitwisereport',
            },
            {
                id: 10,
                label: 'Print Labels',
                dbname: 'allproductlabel',
                route: '/product/printlabel',
            },
        ]
    },
    {
        id: 4,
        label: 'Sell',
        dbname: 'sellmanagement',
        name: 'sell',
        children: [
            {
                id: 1,
                label: 'POS',
                dbname: 'apos',
                route: '/sell/pos/create',
            },
            {
                id: 2,
                label: 'List POS',
                dbname: 'allpos',
                route: '/sell/pos/list',
            },
            {
                id: 3,
                label: 'Draft',
                dbname: 'alldraft',
                route: '/sell/draft/list',
            },
            {
                id: 4,
                label: 'Quotation',
                dbname: 'allquotation',
                route: '/sell/quotation/list',
            },
        ]
    },

    {
        id: 5,
        label: 'Stock',
        dbname: 'stockmanagement',
        name: 'stock',
        children: [
            {
                id: 1,
                label: 'Current Stock Master',
                dbname: 'acurrentstock',
                route: '/stock/currentstockmaster',
            },
            {
                id: 2,
                label: 'Expiry Report',
                dbname: 'allexpiryreport',
                route: '/stock/expiryreport',
            },
            {
                id: 3,
                label: 'Location Wise Expiry Report',
                dbname: 'alllocationwiseexpreport',
                route: '/stock/locationwiseexpreport',
            },
            {
                id: 4,
                label: 'Stock Report',
                dbname: 'allstockreport', //missing
                route: '/stock/stockreport',
            },
            {
                id: 5,
                label: 'Location Wise Stock Report',
                dbname: 'alllocationwisestockreport',
                route: '/stock/locationwisereport',
            },
        ]
    },
    {
        id: 6,
        label: 'Stock Transfer',
        dbname: 'allcurrentstocktransferlist',
        route: '/stocktransfer/list',
    },
    {
        id: 7,
        label: 'Stock Adjust',
        dbname: 'allcurrentstockadjust',
        route: '/stockadjust/list',
    },
    {
        id: 8,
        label: 'Expenses',
        dbname: 'allexpense',
        name: 'expenses',
        children: [
            {
                id: 1,
                label: 'Add Expenses',
                dbname: 'aexpense',
                route: '/expense/expense/create',
            },
            {
                id: 2,
                label: 'List Expenses',
                dbname: 'allexpense',
                route: '/expense/expense/list',
            },
            {
                id: 3,
                label: 'Expenses Categories',
                dbname: 'allexpensecategory',
                route: '/expense/expensecategory/list',
            }
        ]
    },
    {
        id: 9,
        label: 'Reports',
        dbname: 'reportmanagenent',
        name: 'report',
        children: [
            {
                id: 1,
                label: 'Day Wise Profit',
                dbname: 'alldaywiseprofit',
                route: '/report/daywiseprofit',
            },
            {
                id: 2,
                label: 'Month Wise Profit',
                dbname: 'allmonthwiseprofit',
                route: '/report/monthwiseprofit',
            },
            {
                id: 3,
                label: 'Week Wise Profit',
                dbname: 'allweekwiseprofit',
                route: '/report/weekwiseprofit',
            },
            {
                id: 4,
                label: 'Year Wise Profit',
                dbname: 'allyearwiseprofit',
                route: '/report/yearwiseprofit',
            },
            {
                id: 5,
                label: "Category Wise Profit",
                dbname: 'allcategorywiseprofit',
                route: '/report/categorywiaeprofit'
            },
            {
                id: 6,
                label: 'Subcategory Wise Profit',
                dbname: 'allsubcategorywiseprofit',
                route: '/report/subcategorywiseprofit'
            },
            {
                id: 7,
                label: 'Location Wise Profit (Individula)',
                dbname: 'alllocationwiseprofit',
                route: '/report/locationprofitindidual'
            },
            {
                id: 8,
                label: 'Location Wise Profit (Total)',
                dbname: 'alllocationwisetotalprofit',
                route: '/report/locationtotal'
            },
            {
                id: 9,
                label: "Item Search",
                dbname: 'allitemsearch',
                route: '/report/itemslistsearch'
            },
            {
                id: 10,
                label: "Item Wise Profit Report",
                dbname: 'allitemwisereport',
                route: '/report/itemwiseprofitreport'
            },
            {
                id: 11,
                label: "Stock Transfer Report",
                dbname: 'allstocktransferreport',
                route: '/report/stocktransferreport'
            },
            {
                id: 12,
                label: "Stock Adjust Report",
                dbname: 'allstockadjustreport',
                route: '/report/stockadjustreport'
            },
            {
                id: 13,
                label: "Stock Reject Report",
                dbname: 'allstockrejectedreport',
                route: '/report/stockrejectedreport'
            },

        ],
    },
    {
        id: 10,
        label: 'Settings',
        dbname: 'settingsmanagement',
        name: 'setting',
        children: [
            {
                id: 1,
                label: 'Business Settings',
                dbname: 'businesssettings',
                route: '/settings/business/list',
            },
            {
                id: 2,
                label: 'Business Location',
                dbname: 'allbusinesslocation',
                route: '/settings/location/list',
            },
            {
                id: 3,
                label: 'Tax Rates',
                dbname: 'alltaxrate',
                route: '/settings/taxrate/list',
            },
        ]
    },
]