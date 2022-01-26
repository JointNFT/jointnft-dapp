import ExploreFunds from './components/ExploreFunds';
import FundOverview from './components/fundDetails/FundOverview';
import CreateFund from './components/CreateFund';

export default [
    {path: "/", component: ExploreFunds},
    {path: "/Funds", component: FundOverview},
    {path: "/CreateFund", component: CreateFund}
]