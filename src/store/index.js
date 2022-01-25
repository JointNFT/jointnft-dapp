import Vue from "vue";
import Vuex from "vuex";
import fetch from "cross-fetch";
import Web3 from "web3";
import Web3Modal from "web3modal";
import Moralis from "../plugins/moralis";
import axios from "axios";

const erc20FundABI = require("../contractDetails/erc20fund.json")["abi"];
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
    // fundFactoryAddress: "0x1DAE25904fa53995D6E562825Aba17E90Eb4b5D3", // rinkeby address
    fundFactoryAddress: "0xc9797Fa0Fe604c7Cc92A3852872227dE14C936b6",
    // fundFactoryAddress: "0x1E7E4c6aE711C738EC322606F31D3DD97970a257", //mumbai
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
      /*const collectList=[
        {
          imageUrl:
            "https://lh3.googleusercontent.com/OqiOy-QRhwqXeKyj6cYpuvSx9YT3zBiDiLPJxdoAlS4sYXriWgCtxGOeovQ2syR6tgE0-pf5VUJxxJ1NhVL8iqshj2X3MsRXoltq0Vg=w335",
          name: "GENESIS_FUND",
          returns: 15,
          items: "2",
          contractId: "0x818dD650959D5cA4d913C371Bad55AF83a1fbC9F",
        },
        {
          imageUrl:
            "https://lh3.googleusercontent.com/qWv2wdlKQbUycrLjTbWSrhPVJ9l2fnbhJt--FTBpIbMgu9hToGcXO07dhawjhG5_dffWQv9Ve0Soxpxp8rB2bNr_7rc3IYNRSKuoLA=w335",
          name: "FUND2",
          returns: 15,
          items: "2",
          contractId: "0xc4fB8Ada53C21b789BE46d4f1CC08bCd57E3759c",
        },
        {
          imageUrl:
            "https://lh3.googleusercontent.com/ATf2ilspCu_YDHjazW-dcQYsueMzvKHdYfe_kIF0vpBc_6lL33-coQUutyDmN_B-mo5EPL7T90kSL5vxmp1VLsSs6qDXH79buF4oFA=w600",
          name: "FUND3",
          returns: 15,
          items: "2",
          contractId: "0xc32d34833b2e932FfAE8828de2a213B599c331eD",
        },
        {
          imageUrl:
            "https://lh3.googleusercontent.com/bItzS6f9RMjP50SsMaIfVSLzD1YgHCUQUMlv6r2BTdy7BUFTZgdS8A9P7lwMPa33PzcfOuSscHJlFrhyAnTwLezwUS46kePJlk0hCA=w335",
          name: "FUND4",
          returns: 15,
          items: "2",
          contractId: "0x7Cf21A7084ED1d675956D8E11b7848bFEf2Ff65E",
        },        
      ];*/
      const collectList=[
        {
          imageUrl:
            "https://lh3.googleusercontent.com/F40quZ70BK_sefr3Np4seV9k-83tE5KpZ1gs-RxuQzWNYUDMPe-DOnLRdg3cZ_BxbJxa-mPBrq2FvC2YaxsCnlEhBGSZsScSdz1k=w286",
          name: "GENESIS_FUND",
          returns: 15,
          items: "2",
          contractId: "0xaDCa7feFA9b5e33B20094250D2D60e53eD909656",
        },
        {
          imageUrl:
            "https://lh3.googleusercontent.com/cqPy7mep0-LuTeiRBrrhYpZhNy60b8tiWnyzjx0aQ5kbAdrWYLpoieWzdcvSm8oNMV6c15gVMRQdDkJeDccHPQQP76rosXgOgDZJfM8=w286",
          name: "FUND2",
          returns: 15,
          items: "2",
          contractId: "0x36A88cCB5AC5d833f208530959BE826F2bEc4Ccc",
        },
      ];
      commit("setCollectionList",collectList);
    },

    async getFundContract({ commit, state }, fundAddress) {
      try {
        var fundChecksumAddress = Web3.utils.toChecksumAddress(fundAddress);
        var fundContract = new state.web3.eth.Contract(erc20FundABI, fundChecksumAddress);
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
      await fundContract.methods.addFunds().send({
        value: weiAmount.toString(),
        from: this.state.account,
      });
      this.dispatch("refreshBalance", contractId);
    },

    async sellFundTokens({ commit }, { tokenAmount, contractId }) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      console.log(tokenAmount);
      await fundContract.methods.removeFunds(parseInt(tokenAmount)).send({
        from: this.state.account,
      });
      console.log(contractId);
      this.dispatch("refreshBalance", contractId);
    },

    async refreshBalance({}, fundAddress) {
      await this.dispatch("getMaticBalance");
      await this.dispatch("getFundDetails", fundAddress);
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
