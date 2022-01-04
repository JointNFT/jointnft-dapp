import ExploreFunds from './components/ExploreFunds';
import FundOverview from './components/fundDetails/FundOverview';
import CreateFund from './components/CreateFund';
import DiscoverNFTs from './components/DiscoverNFTs.vue';
import Forum from './components/voting/Forum.vue';

export default [
    {path: "/", component: ExploreFunds},
    {path: "/Funds", component: FundOverview},
    {path: "/CreateFund", component: CreateFund},
    {path: "/DiscoverNFTs", component: DiscoverNFTs},
    {path: "/Forum", component: Forum}
]