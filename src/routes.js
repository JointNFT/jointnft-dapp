import ExploreFunds from './components/ExploreFunds';
import FundOverview from './components/FundOverview';
import CreateFund from './components/CreateFund';
import DiscoverNFTs from './components/DiscoverNFTs.vue'

export default [
    {path: "/", component: ExploreFunds},
    {path: "/Funds", component: FundOverview},
    {path: "/CreateFund", component: CreateFund},
    {path: "/DiscoverNFTs", component: DiscoverNFTs}
]