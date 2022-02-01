import Vue from "vue";
import Vuex from "vuex";
import fetch from "cross-fetch";
import Web3 from "web3";
import Web3Modal from "web3modal";
import Moralis from "../plugins/moralis";
import axios from "axios";

const collectionABI = require("../contractDetails/collection.json")["abi"];
const fundFactoryABI = require("../contractDetails/FundFactory.json")["abi"];
const nftFundVotingJson = require("../contractDetails/nftFundVoting.json");
const iAuctionHouseAbi = require("../contractDetails/IAuctionHouse.json")["abi"];
const ethAddress = "0x0000000000000000000000000000000000000000";

Vue.use(Vuex);

const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

//gets lowest sale amount from opensea API //NOT IN USE ANYMORE
function findLowestSaleAmount(orders) {
  var lowest_sale_price = 999999;
  for (var i of orders) {
    if (i["side"] == 1) {
      var wei = i["current_price"].split(".")[0];
      var listing_price = Web3.utils.fromWei(wei, "ether");
      if (listing_price < lowest_sale_price) {
        lowest_sale_price = listing_price;
      }
    }
  }
  console.log(lowest_sale_price);
  return roundToTwo(lowest_sale_price);
}

export default new Vuex.Store({
  state: {
    web3: null,
    provider: null,
    accounts: null,
    networkId: null,
    chainId: 0,
    active: false,
    account: null,
    web3Modal: null,
    maticBalance: 0,
    nftListInFund: {},
    collectionList: [],
    collectionDetails: {ownerAddress:"",contractBalance:0,tokenStartPrice:0,tokenPrice:0,userTokenBalance:0},
  },
  getters: {
    getFunds(state) {
      return state.nftFunds;
    },
    getNoOfFunds(state) {
      return state.nftFunds.length;
    },
  },
  mutations: {
    setWeb3(state, web3) {
      state.web3 = web3;
    },
    setWeb3Modal(state, web3Modal) {
      state.web3Modal = web3Modal;
    },
    setProvider(state, provider) {
      state.provider = provider;
    },
    setAccounts(state, accounts) {
      state.accounts = accounts;
    },
    setAccount(state, account) {
      state.account = account;
      state.web3.eth.defaultAccount = account;
    },
    setActive(state, isActive) {
      state.active = isActive;
    },
    setNetworkId(state, networkId) {
      state.networkId = networkId;
    },
    setChainId(state, chainId) {
      state.chainId = chainId;
    },
    setMaticBalance(state, maticBalance) {
      state.maticBalance = maticBalance;
    },
    setNftListInAddress(state, { nftList, fundAddress }) {
      Vue.set(state.nftListInFund, fundAddress, nftList);
    },
    setCollectionList(state,collectionList){
      state.collectionList=collectionList;
    },
    setCollectionDetails(state, collectionDetails) {
      state.collectionDetails = collectionDetails;
      // Vue.set(state.collectionDetails, ownerAddress, collectionDetails.ownerAddress);
      // Vue.set(state.collectionDetails, tokenStartPrice, collectionDetails.tokenStartPrice);
      // Vue.set(state.collectionDetails, tokenPrice, collectionDetails.tokenPrice);
      // Vue.set(state.collectionDetails, name, collectionDetails.name);
      // Vue.set(state.collectionDetails, symbol, collectionDetails.symbol);
      // Vue.set(state.collectionDetails, userTokenBalance, collectionDetails.userTokenBalance);
      // Vue.set(state.collectionDetails, contractBalance, collectionDetails.contractBalance);
    },
  },
  actions: {
    async connectToWallet({ commit }) {
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      commit("setWeb3", web3);
      commit("setProvider", provider);

      //  Get Accounts
      const accounts = await web3.eth.getAccounts();
      commit("setAccounts", accounts);
      if (accounts.length > 0) {
        commit("setAccount", accounts[0]);
      }

      const networkId = await web3.eth.net.getId();
      commit("setNetworkId", networkId);

      commit("setActive", true);

      provider.on("connect", async (info) => {
        let chainId = parseInt(info.chainId);
        commit("setChainId", chainId);
        console.log("connect", info);
      });

      provider.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          commit("setAccount", accounts[0]);
        } else {
          await dispatch("resetApp");
        }
        console.log("accountsChanged");
      });

      provider.on("chainChanged", async (chainId) => {
        chainId = parseInt(chainId);
        commit("setChainId", chainId);
        console.log("chainChanged", chainId);
      });
    },
    
    async loadCollections({commit,state}){
      
      const collectList=[
        {
          image_url:
            "https://lh3.googleusercontent.com/F40quZ70BK_sefr3Np4seV9k-83tE5KpZ1gs-RxuQzWNYUDMPe-DOnLRdg3cZ_BxbJxa-mPBrq2FvC2YaxsCnlEhBGSZsScSdz1k=w286",
          name: "GENESIS_FUND",
          price: 50,
          members: 50,
          verified: true,
          est_value: {
            amount:50, currency:'$'},
          symbol: 'GFUND',
          chain: 'POLYGON',
          items: "2",
          contractId: "0xcB8D80AfDd6da10f77Fa7C1546250fe5e95279b5",
        },
        {
          imageUrl:
            "https://lh3.googleusercontent.com/cqPy7mep0-LuTeiRBrrhYpZhNy60b8tiWnyzjx0aQ5kbAdrWYLpoieWzdcvSm8oNMV6c15gVMRQdDkJeDccHPQQP76rosXgOgDZJfM8=w286",
          name: "FUND2",
          price: 50,
          members: 50,
          verified: true,
          est_value: {
            amount:50, currency:'$'},
          symbol: 'GFUND',
          chain: 'POLYGON',
          items: "2",
          contractId: "0x99609Da05611A544DC918B0cC9e89b31D1e55BF1",
        },
      ];
      commit("setCollectionList",collectList);
    },

    async getFundContract({ commit, state }, fundAddress) {
      try {
        var fundChecksumAddress = Web3.utils.toChecksumAddress(fundAddress);
        var fundContract = new state.web3.eth.Contract(collectionABI, fundChecksumAddress);
        return fundContract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },

    async buyFundTokens({ commit }, { maticAmount, contractId }) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      var weiAmount = parseFloat(maticAmount) * 10 ** 18;
      await fundContract.methods.buyTokens().send({
        value: weiAmount.toString(),
        from: this.state.account,
      });
      this.dispatch("refreshBalance", contractId);
    },

    async sellFundTokens({ commit }, { tokenAmount, contractId }) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      console.log(tokenAmount);
      tokenAmount = parseFloat(tokenAmount) * (10 ** 18);
      // todo: multiple tokenAmount by 10^18 before sending
      await fundContract.methods.sellTokens(parseInt(tokenAmount)).send({
        from: this.state.account,
      });
      console.log(contractId);
      this.dispatch("refreshBalance", contractId);
    },
    
    async pauseBuyAndSell({ commit }, { contractId }) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      
      await fundContract.methods.toggleTokenConversion().send({
        from: this.state.account,
      });
      this.dispatch("refreshBalance", contractId);
    },

    async transferFunds({ commit }, { contractId, toAddress, value}) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      var to = Web3.utils.toChecksumAddress(toAddress);
      var ethAmount = parseFloat(value) * (10 ** 18);
      await fundContract.methods.transferFunds(to, parseInt(ethAmount)).send({
        from: this.state.account
      });
    },


    async pauseBuyAndSell({ commit }, { contractId }) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      
      await fundContract.methods.toggleTokenConversion().send({
        from: this.state.account,
      });
      this.dispatch("refreshBalance", contractId);
    },

    async transferFunds({ commit }, { contractId, toAddress, value}) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      var to = Web3.utils.toChecksumAddress(toAddress);
      var ethAmount = parseFloat(value) * (10 ** 18);
      await fundContract.methods.transferFunds(to, parseInt(ethAmount)).send({
        from: this.state.account
      });
    },



    async toggleBuy({ commit }, { contractId }) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      
      await fundContract.methods.toggleBuying().send({
        from: this.state.account,
      });
      this.dispatch("refreshBalance", contractId);
    },

    async toggleSell({ commit }, { contractId }) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      
      await fundContract.methods.toggleSelling().send({
        from: this.state.account,
      });
      this.dispatch("refreshBalance", contractId);
    },

    async transferFunds({ commit }, { contractId, toAddress, value}) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      var to = Web3.utils.toChecksumAddress(toAddress);
      var ethAmount = parseFloat(value) * (10 ** 18);
      await fundContract.methods.transferFunds(to, parseInt(ethAmount)).send({
        from: this.state.account
      });
    },



    async refreshBalance({}, fundAddress) {
      await this.dispatch("getMaticBalance");
      await this.dispatch("getCollectionDetails", fundAddress);
    },


    async getMaticBalance({ commit, state }) {
      var maticBalance = await state.web3.eth.getBalance(state.account);
      commit("setMaticBalance",Number( Web3.utils.fromWei(maticBalance, "ether")).toFixed(3));
     
    },

    async getCollectionDetails({ commit, state }, { collectionContractId }) {
      var collectionDetails = {};
      console.log("test", collectionContractId);
      var fundContract = await this.dispatch("getFundContract", collectionContractId);
      collectionDetails.ownerAddress = await fundContract.methods.ownerAddress().call();
      var tokenStartPrice = await fundContract.methods.tokenStartPrice().call();
      collectionDetails.tokenStartPrice=Number( Web3.utils.fromWei(tokenStartPrice,"ether")).toFixed(3);
      var tokenPrice = await fundContract.methods.tokenPrice().call();
      collectionDetails.tokenPrice =Number( Web3.utils.fromWei(tokenPrice,"ether")).toFixed(3);
      collectionDetails.name = await fundContract.methods.name().call();
      collectionDetails.symbol = await fundContract.methods.symbol().call();
      var userTokenBalance = await fundContract.methods.balanceOf(state.account).call();
      collectionDetails.userTokenBalance =Number( Web3.utils.fromWei(userTokenBalance,"ether")).toFixed(3);
      var contractBalance = await state.web3.eth.getBalance(collectionContractId);
      collectionDetails.contractBalance =Number( Web3.utils.fromWei(contractBalance,"ether")).toFixed(3);
      // collectionDetails.conversionStatus = await fundContract.methods._isTokenConversionEnabled().call();
      collectionDetails.buyingEnabled = await fundContract.methods.buyingEnabled().call();
      collectionDetails.sellingEnabled = await fundContract.methods.sellingEnabled().call();

      commit("setCollectionDetails", collectionDetails);
    },

    async modifyTokenPrice({}, { tokenPrice, contractId }) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      var res = await fundContract.methods.setTokenPrice(tokenPrice).send({
        from: this.state.account,
      });
      console.log(res);
      await this.dispatch("refreshBalance", contractId);
    },

    async createFund({ commit, state }, { fundName, fundSymbl, tokenPrice, depositAmt, imgUrl }) {
      var depositAmtInWei = parseFloat(depositAmt) * 10 ** 18;
      var fundFactoryContract = await this.dispatch("getFundFactoryContract");
      var res = await fundFactoryContract.methods.createFund(fundName, fundSymbl, tokenPrice, imgUrl).send({
        from: this.state.account,
        value: depositAmtInWei,
      });
      console.log(res);
      await this.dispatch("loadFundData");
    },

    async getNFTsInAddress({ commit, state }, { address }) {
      console.log(address);
      const options = { chain: "rinkeby", address: address };
      const nftsInAddress = await Moralis.Web3API.account.getNFTs(options);
      console.log(nftsInAddress);
      commit("setNftListInAddress", { nftList: nftsInAddress["result"], fundAddress: address });
      return nftsInAddress;
    },
  },
});
