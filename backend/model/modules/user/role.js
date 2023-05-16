const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({

    assignbusinessid: {
        type: String,
        required: false
    },

    // User
    rolename: {
        type: String,
        required: false
    },
    usermanagement: {
        type: Boolean,
        required: false
    },
    alluser: {
        type: Boolean,
        required: false
    },
    checkalluser: {
        type: Boolean,
        required: false
    },
    auser: {
        type: Boolean,
        required: false
    },
    euser: {
        type: Boolean,
        required: false
    },
    duser: {
        type: Boolean,
        required: false
    },
    vuser: {
        type: Boolean,
        required: false
    },
    exceluser: {
        type: Boolean,
        required: false
    },
    csvuser: {
        type: Boolean,
        required: false
    },
    printuser: {
        type: Boolean,
        required: false
    },
    pdfuser: {
        type: Boolean,
        required: false
    },

    // Role
    allrole: {
        type: Boolean,
        required: false
    },
    checkallrole: {
        type: Boolean,
        required: false
    },
    arole: {
        type: Boolean,
        required: false
    },
    erole: {
        type: Boolean,
        required: false
    },
    drole: {
        type: Boolean,
        required: false
    },
    excelrole: {
        type: Boolean,
        required: false
    },
    csvrole: {
        type: Boolean,
        required: false
    },
    printrole: {
        type: Boolean,
        required: false
    },
    pdfrole: {
        type: Boolean,
        required: false
    },

    //  Department
    alldepartment: {
        type: Boolean,
        required: false
    },
    checkalldepartment: {
        type: Boolean,
        required: false
    },
    adepartment: {
        type: Boolean,
        required: false
    },
    exceldepartment: {
        type: Boolean,
        required: false
    },
    csvdepartment: {
        type: Boolean,
        required: false
    },
    printdepartment: {
        type: Boolean,
        required: false
    },
    pdfdepartment: {
        type: Boolean,
        required: false
    },
    edepartment: {
        type: Boolean,
        required: false
    },
    ddepartment: {
        type: Boolean,
        required: false
    },

    // Product Module
    productmanagement: {
        type: Boolean,
        required: false
    },

    // Category
    allcategory: {
        type: Boolean,
        required: false
    },
    checkallcategory: {
        type: Boolean,
        required: false
    },
    acategory: {
        type: Boolean,
        required: false
    },
    ecategory: {
        type: Boolean,
        required: false
    },
    dcategory: {
        type: Boolean,
        required: false
    },
    printcategory: {
        type: Boolean,
        required: false
    },
    pdfcategory: {
        type: Boolean,
        required: false
    },

    // Unit
    allunit: {
        type: Boolean,
        required: false
    },
    checkallunit: {
        type: Boolean,
        required: false
    },
    aunit: {
        type: Boolean,
        required: false
    },
    eunit: {
        type: Boolean,
        required: false
    },
    dunit: {
        type: Boolean,
        required: false
    },
    excelunit: {
        type: Boolean,
        required: false
    },
    csvunit: {
        type: Boolean,
        required: false
    },
    printunit: {
        type: Boolean,
        required: false
    },
    pdfunit: {
        type: Boolean,
        required: false
    },

    // Product
    allproduct: {
        type: Boolean,
        required: false
    },
    checkallproduct: {
        type: Boolean,
        required: false
    },
    vproduct: {
        type: Boolean,
        required: false
    },
    iproduct: {
        type: Boolean,
        required: false
    },
    aproduct: {
        type: Boolean,
        required: false
    },
    eproduct: {
        type: Boolean,
        required: false
    },
    dproduct: {
        type: Boolean,
        required: false
    },
    excelproduct: {
        type: Boolean,
        required: false
    },
    csvproduct: {
        type: Boolean,
        required: false
    },
    printproduct: {
        type: Boolean,
        required: false
    },
    pdfproduct: {
        type: Boolean,
        required: false
    },

    // Category wise report 
    allcatwisereport: {
        type: Boolean,
        required: false
    },
    checkallcatwisereport: {
        type: Boolean,
        required: false
    },
    csvcatwisereport: {
        type: Boolean,
        required: false
    },
    excelcatwisereport: {
        type: Boolean,
        required: false
    },
    printcatwisereport: {
        type: Boolean,
        required: false
    },
    pdfcatwisereport: {
        type: Boolean,
        required: false
    },

    // Sub category wise report
    allsubcatwisereport: {
        type: Boolean,
        required: false
    },
    checkallsubcatwisereport: {
        type: Boolean,
        required: false
    },
    csvsubcatwisereport: {
        type: Boolean,
        required: false
    },
    excelsubcatwisereport: {
        type: Boolean,
        required: false
    },
    printsubcatwisereport: {
        type: Boolean,
        required: false
    },
    pdfsubcatwisereport: {
        type: Boolean,
        required: false
    },

    //Unit wise report
    allunitwisereport: {
        type: Boolean,
        required: false
    },
    checkallunitwisereport: {
        type: Boolean,
        required: false
    },
    csvunitwisereport: {
        type: Boolean,
        required: false
    },
    excelunitwisereport: {
        type: Boolean,
        required: false
    },
    printunitwisereport: {
        type: Boolean,
        required: false
    },
    pdfunitwisereport: {
        type: Boolean,
        required: false
    },

    // Print lable
    allproductlabel: {
        type: Boolean,
        required: false
    },

    // Product Ends

    // Stock Management
    stockmanagement: {
        type: Boolean,
        required: false
    },

    // Currentstock master
    allstockreport: {
        type: Boolean,
        required: false
    },
    checkallstockreport: {
        type: Boolean,
        required: false
    },
    acurrentstock: {
        type: Boolean,
        required: false
    },
    excelstockreport: {
        type: Boolean,
        required: false
    },
    csvstockreport: {
        type: Boolean,
        required: false
    },
    printstockreport: {
        type: Boolean,
        required: false
    },
    pdftockreport: {
        type: Boolean,
        required: false
    },

    // Expiry Report
    allexpiryreport: {
        type: Boolean,
        required: false
    },
    checkallexpiryreport: {
        type: Boolean,
        required: false
    },
    excelexpiryreport: {
        type: Boolean,
        required: false
    },
    csvexpiryreport: {
        type: Boolean,
        required: false
    },
    printexpiryreport: {
        type: Boolean,
        required: false
    },
    pdfexpiryreport: {
        type: Boolean,
        required: false
    },

    // Location Wise Stock
    alllocationwisestockreport: {
        type: Boolean,
        required: false
    },
    checkalllocationwisestockreport: {
        type: Boolean,
        required: false
    },
    excellocationwisestockreport: {
        type: Boolean,
        required: false
    },
    csvlocationwisestockreport: {
        type: Boolean,
        required: false
    },
    printlocationwisestockreport: {
        type: Boolean,
        required: false
    },
    pdflocationwisestockreport: {
        type: Boolean,
        required: false
    },

    // Location Wise Expire Report
    alllocationwiseexpreport: {
        type: Boolean,
        required: false
    },
    checkalllocationwiseexpreport: {
        type: Boolean,
        required: false
    },
    csvlocationwiseexpreport: {
        type: Boolean,
        required: false
    },
    excellocationwiseexpreport: {
        type: Boolean,
        required: false
    },
    printlocationwiseexpreport: {
        type: Boolean,
        required: false
    },
    pdflocationwiseexpreport: {
        type: Boolean,
        required: false
    },

    //stock transfer
    stocktransferlistmanagement: {
        type: Boolean,
        required: false
    },
    allcurrentstocktransferlist: {
        type: Boolean,
        required: false
    },
    checkallcurrentstocktransferlist: {
        type: Boolean,
        required: false
    },
    vstocktransferlist: {
        type: Boolean,
        required: false
    },
    acurrentstocktransferlist: {
        type: Boolean,
        required: false
    },
    vcurrentstocktransferlist: {
        type: Boolean,
        required: false
    },
    excelcurrentstocktransferlist: {
        type: Boolean,
        required: false
    },
    csvcurrentstocktransferlist: {
        type: Boolean,
        required: false
    },
    pdfcurrentstocktransferlist: {
        type: Boolean,
        required: false
    },
    printcurrentstocktransferlist: {
        type: Boolean,
        required: false
    },

    // Stock Adjust 
    stockadjustmanagement: {
        type: Boolean,
        required: false
    },
    allcurrentstockadjust: {
        type: Boolean,
        required: false
    },
    checkallcurrentstockadjust: {
        type: Boolean,
        required: false
    },
    vcurrentstockadjust: {
        type: Boolean,
        required: false
    },
    excelcurrentstockadjust: {
        type: Boolean,
        required: false
    },
    csvcurrentstockadjust: {
        type: Boolean,
        required: false
    },
    printcurrentstockadjust: {
        type: Boolean,
        required: false
    },
    pdfcurrentstockadjust: {
        type: Boolean,
        required: false
    },
    vstockadjust: {
        type: Boolean,
        required: false
    },

    sellmanagement: {
        type: Boolean,
        required: false
    },
    // Pos
    allpos: {
        type: Boolean,
        required: false
    },
    checkallpos: {
        type: Boolean,
        required: false
    },
    apos: {
        type: Boolean,
        required: false
    },
    epos: {
        type: Boolean,
        required: false
    },
    dpos: {
        type: Boolean,
        required: false
    },
    vpos: {
        type: Boolean,
        required: false
    },
    excelpos: {
        type: Boolean,
        required: false
    },
    csvpos: {
        type: Boolean,
        required: false
    },
    printpos: {
        type: Boolean,
        required: false
    },
    pdfpos: {
        type: Boolean,
        required: false
    },

    // Draft
    alldraft: {
        type: Boolean,
        required: false
    },
    checkalldraft: {
        type: Boolean,
        required: false
    },
    adraft: {
        type: Boolean,
        required: false
    },
    edraft: {
        type: Boolean,
        required: false
    },
    ddraft: {
        type: Boolean,
        required: false
    },
    vdraft: {
        type: Boolean,
        required: false
    },
    exceldraft: {
        type: Boolean,
        required: false
    },
    csvdraft: {
        type: Boolean,
        required: false
    },
    printdraft: {
        type: Boolean,
        required: false
    },
    pdfdraft: {
        type: Boolean,
        required: false
    },

    // Quotation
    allquotation: {
        type: Boolean,
        required: false
    },
    checkallquotation: {
        type: Boolean,
        required: false
    },
    aquotation: {
        type: Boolean,
        required: false
    },
    equotation: {
        type: Boolean,
        required: false
    },
    dquotation: {
        type: Boolean,
        required: false
    },
    vquotation: {
        type: Boolean,
        required: false
    },
    excelquotation: {
        type: Boolean,
        required: false
    },
    csvquotation: {
        type: Boolean,
        required: false
    },
    printquotation: {
        type: Boolean,
        required: false
    },
    pdfquotation: {
        type: Boolean,
        required: false
    },

    // Expense
    expensemanagement: {
        type: Boolean,
        required: false
    },
    allexpense: {
        type: Boolean,
        required: false
    },
    checkallexpense: {
        type: Boolean,
        required: false
    },
    aexpense: {
        type: Boolean,
        required: false
    },
    eexpense: {
        type: Boolean,
        required: false
    },
    dexpense: {
        type: Boolean,
        required: false
    },
    excelexpense: {
        type: Boolean,
        required: false
    },
    csvexpense: {
        type: Boolean,
        required: false
    },
    printexpense: {
        type: Boolean,
        required: false
    },
    pdfexpense: {
        type: Boolean,
        required: false
    },

    // Expense category
    dallexpensecategoryuser: {
        type: Boolean,
        required: false
    },
    allexpensecategory: {
        type: Boolean,
        required: false
    },
    checkallexpensecategory: {
        type: Boolean,
        required: false
    },
    aexpensecategory: {
        type: Boolean,
        required: false
    },
    eexpensecategory: {
        type: Boolean,
        required: false
    },
    dexpensecategory: {
        type: Boolean,
        required: false
    },
    excelexpensecategory: {
        type: Boolean,
        required: false
    },
    csvexpensecategory: {
        type: Boolean,
        required: false
    },
    printexpensecategory: {
        type: Boolean,
        required: false
    },
    pdfexpensecategory: {
        type: Boolean,
        required: false
    },


    // report module

    reportmanagenent: {
        type: Boolean,
        required: false
    },

    // Category Wise Profit
    allcategorywiseprofit: {
        type: Boolean,
        required: false
    },
    checkallcategorywiseprofit: {
        type: Boolean,
        required: false
    },
    csvcategorywiseprofit: {
        type: Boolean,
        required: false
    },
    excelcategorywiseprofit: {
        type: Boolean,
        required: false
    },
    printcategorywiseprofit: {
        type: Boolean,
        required: false
    },
    pdfcategorywiseprofit: {
        type: Boolean,
        required: false
    },

    // Day Wise Profit
    alldaywiseprofit: {
        type: Boolean,
        required: false
    },
    checkalldaywiseprofit: {
        type: Boolean,
        required: false
    },
    csvdaywiseprofit: {
        type: Boolean,
        required: false
    },
    exceldaywiseprofit: {
        type: Boolean,
        required: false
    },
    printdaywiseprofit: {
        type: Boolean,
        required: false
    },
    pdfdaywiseprofit: {
        type: Boolean,
        required: false
    },

    //  Location Wise Profit Individual
    alllocationwiseprofit: {
        type: Boolean,
        required: false
    },
    checkalllocationwiseprofit: {
        type: Boolean,
        required: false
    },
    csvlocationwiseprofit: {
        type: Boolean,
        required: false
    },
    excellocationwiseprofit: {
        type: Boolean,
        required: false
    },
    printlocationwiseprofit: {
        type: Boolean,
        required: false
    },
    pdflocationwiseprofit: {
        type: Boolean,
        required: false
    },

    //  Location Wise Profit Total
    alllocationwisetotalprofit: {
        type: Boolean,
        required: false
    },
    checkalllocationwisetotalprofit: {
        type: Boolean,
        required: false
    },
    excellocationwisetotalprofit: {
        type: Boolean,
        required: false
    },
    csvlocationwisetotalprofit: {
        type: Boolean,
        required: false
    },
    printlocationwisetotalprofit: {
        type: Boolean,
        required: false
    },
    pdflocationwisetotalprofit: {
        type: Boolean,
        required: false
    },

    // Month Wise Profit
    allmonthwiseprofit: {
        type: Boolean,
        required: false
    },
    checkallmonthwiseprofit: {
        type: Boolean,
        required: false
    },
    csvmonthwiseprofit: {
        type: Boolean,
        required: false
    },
    excelmonthwiseprofit: {
        type: Boolean,
        required: false
    },
    printmonthwiseprofit: {
        type: Boolean,
        required: false
    },
    pdfmonthwiseprofit: {
        type: Boolean,
        required: false
    },

    // Sub Category Wise Profit
    allsubcategorywiseprofit: {
        type: Boolean,
        required: false
    },
    checkallsubcategorywiseprofit: {
        type: Boolean,
        required: false
    },
    csvsubcategorywiseprofit: {
        type: Boolean,
        required: false
    },
    excelsubcategorywiseprofit: {
        type: Boolean,
        required: false
    },
    printsubcategorywiseprofit: {
        type: Boolean,
        required: false
    },
    pdfsubcategorywiseprofit: {
        type: Boolean,
        required: false
    },

    // Week Wise Profit
    allweekwiseprofit: {
        type: Boolean,
        required: false
    },
    checkallweekwiseprofit: {
        type: Boolean,
        required: false
    },
    csvweekwiseprofit: {
        type: Boolean,
        required: false
    },
    excelweekwiseprofit: {
        type: Boolean,
        required: false
    },
    printweekwiseprofit: {
        type: Boolean,
        required: false
    },
    pdfweekwiseprofit: {
        type: Boolean,
        required: false
    },

    // Year Wise Profit
    allyearwiseprofit: {
        type: Boolean,
        required: false
    },
    checkallyearwiseprofit: {
        type: Boolean,
        required: false
    },
    csvyearwiseprofit: {
        type: Boolean,
        required: false
    },
    excelyearwiseprofit: {
        type: Boolean,
        required: false
    },
    printyearwiseprofit: {
        type: Boolean,
        required: false
    },
    pdfyearwiseprofit: {
        type: Boolean,
        required: false
    },

    // Item Wise Report
    allitemwisereport: {
        type: Boolean,
        required: false
    },
    checkallitemwisereport: {
        type: Boolean,
        required: false
    },
    csvitemwisereport: {
        type: Boolean,
        required: false
    },
    excelitemwisereport: {
        type: Boolean,
        required: false
    },
    printitemwisereport: {
        type: Boolean,
        required: false
    },
    pdfitemwisereport: {
        type: Boolean,
        required: false
    },

    // Item Search
    allitemsearch: {
        type: Boolean,
        required: false
    },
    checkallitemsearch: {
        type: Boolean,
        required: false
    },
    excelitemsearch: {
        type: Boolean,
        required: false
    },
    csvitemsearch: {
        type: Boolean,
        required: false
    },
    printitemsearch: {
        type: Boolean,
        required: false
    },
    pdfitemsearch: {
        type: Boolean,
        required: false
    },

    // Stock Adjust Report
    allstockadjustreport: {
        type: Boolean,
        required: false
    },
    checkallstockadjustreport: {
        type: Boolean,
        required: false
    },
    csvstockadjustreport: {
        type: Boolean,
        required: false
    },
    excelstockadjustreport: {
        type: Boolean,
        required: false
    },
    printstockadjustreport: {
        type: Boolean,
        required: false
    },
    pdfstockadjustreport: {
        type: Boolean,
        required: false
    },

    // Stock Transfer Report
    allstocktransferreport: {
        type: Boolean,
        required: false
    },
    checkallstocktransferreport: {
        type: Boolean,
        required: false
    },
    csvstocktransferreport: {
        type: Boolean,
        required: false
    },
    excelstocktransferreport: {
        type: Boolean,
        required: false
    },
    printstocktransferreport: {
        type: Boolean,
        required: false
    },
    pdfstocktransferreport: {
        type: Boolean,
        required: false
    },

    // Stock Rejected Report
    allstockrejectedreport: {
        type: Boolean,
        required: false
    },
    checkallstockrejectedreport: {
        type: Boolean,
        required: false
    },
    csvstockrejectedreport: {
        type: Boolean,
        required: false
    },
    excelstockrejectedreport: {
        type: Boolean,
        required: false
    },
    printstockrejectedreport: {
        type: Boolean,
        required: false
    },
    pdfstockrejectedreport: {
        type: Boolean,
        required: false
    },

    // Settings
    settingsmanagement: {
        type: Boolean,
        required: false
    },

    // Location
    allbusinesslocation: {
        type: Boolean,
        required: false
    },
    checkallbusinesslocation: {
        type: Boolean,
        required: false
    },
    activatebusinesslocation: {
        type: Boolean,
        required: false
    },
    abusinesslocation: {
        type: Boolean,
        required: false
    },
    ebusinesslocation: {
        type: Boolean,
        required: false
    },
    dbusinesslocation: {
        type: Boolean,
        required: false
    },
    excelbusinesslocation: {
        type: Boolean,
        required: false
    },
    csvbusinesslocation: {
        type: Boolean,
        required: false
    },
    printbusinesslocation: {
        type: Boolean,
        required: false
    },
    pdfbusinesslocation: {
        type: Boolean,
        required: false
    },

    // Taxrate
    alltaxrate: {
        type: Boolean,
        required: false
    },
    checkalltaxrate: {
        type: Boolean,
        required: false
    },
    ataxrate: {
        type: Boolean,
        required: false
    },
    etaxrate: {
        type: Boolean,
        required: false
    },
    dtaxrate: {
        type: Boolean,
        required: false
    },
    exceltaxrate: {
        type: Boolean,
        required: false
    },
    csvtaxrate: {
        type: Boolean,
        required: false
    },
    printtaxrate: {
        type: Boolean,
        required: false
    },
    pdftaxrate: {
        type: Boolean,
        required: false
    },

    // Business Settings
    businesssettings: {
        type: Boolean,
        required: false
    },

    // Dashboard
    home: {
        type: Boolean,
        required: false
    },
    selectlocation: {
        type: Boolean,
        required: false
    },
    from: {
        type: Boolean,
        required: false
    },
    to: {
        type: Boolean,
        required: false
    },
    totalpurchase: {
        type: Boolean,
        required: false
    },
    totalsales: {
        type: Boolean,
        required: false
    },
    purchasedue: {
        type: Boolean,
        required: false
    },
    salesdue: {
        type: Boolean,
        required: false
    },
    totalsalesreturn: {
        type: Boolean,
        required: false
    },
    totalpurchasereturn: {
        type: Boolean,
        required: false
    },
    expenses: {
        type: Boolean,
        required: false
    },
    barchart: {
        type: Boolean,
        required: false
    },
    topproductspiechart: {
        type: Boolean,
        required: false
    },
    topcustomerspiechart: {
        type: Boolean,
        required: false
    },
    stockalerttable: {
        type: Boolean,
        required: false
    },
    recentsalestable: {
        type: Boolean,
        required: false
    },
    topsellproductstable: {
        type: Boolean,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Role', roleSchema);