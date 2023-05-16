import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Dashboard
import Dashboard from '../dashboard/Dashboard';

// user module import 
import Usercreate from '../pages/user/users/Create';
import Useredit from '../pages/user/users/Edit';
import Userview from '../pages/user/users/View';
import Userslist from '../pages/user/users/List';
import Rolecreate from '../pages/user/roles/Create';
import Roleedit from '../pages/user/roles/Edit';
import Roleslist from '../pages/user/roles/List';
import Departmentscreate from '../pages/user/department/Create';
import Departmentsedit from '../pages/user/department/Edit';
import Departmentlist from '../pages/user/department/List';

// product module
import Productlist from '../pages/products/product/List';
import Productcreate from '../pages/products/product/Create';
import Productedit from '../pages/products/product/Edit';
import Productview from '../pages/products/product/View';
import Categorieslist from '../pages/products/category/List';
import Categorycreate from '../pages/products/category/Create';
import Categoriesedit from '../pages/products/category/Edit';
import ImportProducts from '../pages/products/ImportProducts';
import Unitlist from '../pages/products/units/List';
import Unitscreate from '../pages/products/units/Create';
import Unitedit from '../pages/products/units/Edit';
import Categorywisereport from '../pages/products/Categorywisereport';
import Subcategorywisereport from '../pages/products/Subcategorywisereport';
import Unitwisereport from '../pages/products/Unitwisereport';
import PrintLabel from '../pages/products/PrintLable';

// sell module
import Poslist from '../pages/sell/pos/List';
import Poscreate from '../pages/sell/pos/Create';
import Draftedit from '../pages/sell/draft/Edit';
import Draftlist from '../pages/sell/draft/List';
import Quotationedit from '../pages/sell/quation/Edit';
import Quotationlist from '../pages/sell/quation/List';
import DraftView from '../pages/sell/draft/View';
import QuotationView from '../pages/sell/quation/View';
import PosView from '../pages/sell/pos/View';

// Expenses
import Expenselist from '../pages/expenses/expense/List';
import Expensecreate from '../pages/expenses/expense/Create';
import Expenseedit from '../pages/expenses/expense/Edit';
import Expensecategorylist from '../pages/expenses/expensecategory/List';
import Expensecategoryedit from '../pages/expenses/expensecategory/Edit';
import ExpenseCategorycreate from '../pages/expenses/expensecategory/Create';

// Stock module
import Expiryreport from '../pages/stock/Expiryreport';
import Currentstockmaster from '../pages/stock/Currentstockmaster';
import Stockreport from '../pages/stock/Stockreport';
import Locationwisereport from '../pages/stock/Locationwisereport';
import Locationwiseexpiringreport from '../pages/stock/Locationwiseexpreport';

//stock transfer
import Transferlists from '../pages/stocktransfer/List';
import StockTransferCreatetable from '../pages/stocktransfer/Create';
import Stocktransferview from '../pages/stocktransfer/View';
import StocktransferandAdjust from '../pages/stockadjust/List';
import Stockadjustview from '../pages/stockadjust/View';

// Report
import Daywiseprofit from '../pages/report/Daywiseprofit';
import Monthwiseprofit from '../pages/report/Monthwiseprofit';
import Weekwiseprofit from '../pages/report/Weekwiseprofit';
import Yearwiseprofit from '../pages/report/Yearwiseprofit';
import CategoryProfitWise from '../pages/report/CategoryWiseProfit';
import SubCategoryProfitWise from '../pages/report/SubCategoryWiseProfit';
import LocationProfitIndidual from '../pages/report/LocationWiseIndidual';
import LocationTotal from '../pages/report/LocationWiseTotal';
import ItemsListSearch  from '../pages/report/ItemsSeacrh';
import ItemWiseProfitReport from '../pages/report/Itemwiseprofitreport';
import Stocktransferreport from '../pages/report/Stocktransferreport';
import Stockadjustreport from '../pages/report/Stockadjustreport';
import Stockrejectedreport from '../pages/report/Stockrejectedreport';

// Settings
import Businesssettings from '../pages/settings/business/List';
import Locationlist from '../pages/settings/location/List';
import Locationcreate from '../pages/settings/location/Create';
import Businesslocationedit from '../pages/settings/location/Edit';
import Taxratelist from '../pages/settings/taxrate/List';
import TaxrateCreate from '../pages/settings/taxrate/Create';
import Taxrateedit from '../pages/settings/taxrate/Edit';

function Applicationstack() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Dashboard routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="profile/edit/:id" element={<Profiles />} /> */}

          {/* user module */}
          <Route path="user/user/create" element={<Usercreate />} />
          <Route path="user/user/edit/:id" element={<Useredit />} />
          <Route path="user/user/view/:id" element={<Userview />} />
          <Route path="user/user/list" element={<Userslist />} />
          <Route path="user/role/create" element={<Rolecreate />} />
          <Route path="user/role/edit/:id" element={<Roleedit />} />
          <Route path="user/role/list" element={<Roleslist />} />
          <Route path="user/department/create" element={<Departmentscreate />} />
          <Route path="user/department/edit/:id" element={<Departmentsedit />} />
          <Route path="user/department/list" element={<Departmentlist />} />

          {/* products module */}
          <Route path="product/product/list" element={<Productlist />} />
          <Route path="product/product/create" element={<Productcreate />} />
          <Route path="product/product/edit/:id" element={<Productedit />} />
          <Route path="product/product/view/:id" element={<Productview />} />
          <Route path="product/importproducts" element={<ImportProducts />} />
          <Route path="product/category/list" element={<Categorieslist />} />
          <Route path="product/category/create" element={<Categorycreate />} />
          <Route path="product/category/edit/:id" element={<Categoriesedit />} />
          <Route path="product/unit/create" element={<Unitscreate />} />
          <Route path="product/unit/list" element={<Unitlist />} />
          <Route path="product/unit/edit/:id" element={<Unitedit />} />
          <Route path="product/categorywisereport" element={<Categorywisereport />} />
          <Route path="product/subcategorywisereport" element={<Subcategorywisereport />} />
          <Route path="product/unitwisereport" element={<Unitwisereport />} />
          <Route path="product/printlabel" element={<PrintLabel />} />

          { /* sell module */}
          <Route path="sell/pos/list" element={<Poslist />} />
          <Route path="sell/pos/create" element={<Poscreate />} />
          <Route path="sell/draft/edit/:id" element={<Draftedit />} />
          <Route path="sell/quotation/edit/:id" element={<Quotationedit />} />
          <Route path="sell/draft/list" element={<Draftlist />} />
          <Route path="sell/draft/view/:id" element={<DraftView />} />
          <Route path="sell/quotation/list" element={<Quotationlist />} />
          <Route path="sell/quotation/view/:id" element={<QuotationView />} />
          <Route path="sell/pos/view/:id" element={<PosView />} />

          { /* Expenses module */}
          <Route path="expense/expense/list" element={<Expenselist />} />
          <Route path="expense/expense/create" element={<Expensecreate />} />
          <Route path="expense/espense/edit/:id" element={<Expenseedit />} />
          <Route path="expense/expensecategory/list" element={<Expensecategorylist />} />
          <Route path="expense/expensecategory/create" element={<ExpenseCategorycreate />} />
          <Route path="expense/expensecategory/edit/:id" element={<Expensecategoryedit />} />

          { /* stock module */}
          <Route path="stock/expiryreport" element={<Expiryreport />} />
          <Route path="stock/currentstockmaster" element={<Currentstockmaster />} />
          <Route path="stock/stockreport" element={<Stockreport />} />
          <Route path="stock/locationwisereport" element={<Locationwisereport />} />
          <Route path="stock/locationwiseexpreport" element={<Locationwiseexpiringreport />} />

          {/* stock transfer and adjust */}
          <Route path="stocktransfer/list" element={<Transferlists />} />
          <Route path="stocktransfer/create" element={<StockTransferCreatetable />} />
          <Route path="stocktransfer/view/:id" element={<Stocktransferview />} />
          <Route path="stockadjust/list" element={<StocktransferandAdjust />} />
          <Route path="stockadjust/view/:id" element={<Stockadjustview />} />

          { /* Report module */}
          <Route path="report/categorywiaeprofit" element={<CategoryProfitWise />} />
          <Route path="report/subcategorywiseprofit" element={<SubCategoryProfitWise />} />
          <Route path="report/locationprofitindidual" element={<LocationProfitIndidual />} />
          <Route path="report/locationtotal" element={<LocationTotal />} />
          <Route path="report/daywiseprofit" element={<Daywiseprofit />} />
          <Route path="report/monthwiseprofit" element={<Monthwiseprofit />} />
          <Route path="report/yearwiseprofit" element={<Yearwiseprofit />} />
          <Route path="report/weekwiseprofit" element={<Weekwiseprofit />} />
          <Route path="report/itemslistsearch" element={<ItemsListSearch />} />
          <Route path="report/itemwiseprofitreport" element={<ItemWiseProfitReport />} />
          <Route path="report/stocktransferreport" element={<Stocktransferreport />} />
          <Route path="report/stockadjustreport" element={<Stockadjustreport />} />
          <Route path="report/stockrejectedreport" element={<Stockrejectedreport />} />

          { /* Settings module */}
          <Route path="settings/business/list" element={<Businesssettings />} />
          <Route path="settings/location/list" element={<Locationlist />} />
          <Route path="settings/location/create" element={<Locationcreate />} />
          <Route path="settings/location/edit/:id" element={<Businesslocationedit />} />
          <Route path="settings/taxrate/list" element={<Taxratelist />} />
          <Route path="settings/taxrate/create" element={<TaxrateCreate />} />
          <Route path="settings/taxrate/edit/:id" element={<Taxrateedit />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}
export default Applicationstack; 