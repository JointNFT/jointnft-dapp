import Vue from "vue";
import Vuex from "vuex";
import fetch from "cross-fetch";
import Web3 from 'web3';
import Web3Modal from "web3modal";

const erc20FundABI = require("../contractDetails/erc20fund.json")['abi']
const fundFactoryABI = require("../contractDetails/FundFactory.json")['abi']

Vue.use(Vuex);

const providerOptions = {
  /* See Provider Options Section */
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});




function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}

function findLowestSaleAmount(orders) {
  var lowest_sale_price = 999999
  for (var i of orders) {
    if (i['side'] == 1) {
      var wei = i['current_price'].split(".")[0]
      var listing_price = Web3.utils.fromWei(wei, 'ether');
      if (listing_price < lowest_sale_price) {
        lowest_sale_price = listing_price
      }
    }
  }
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
    ethBalance: 0,
    fundFactoryAddress: "0x7d7D9b335fec284c650D126DcbF5D50218CeD342",
    fundList: [],
    nftFunds: {},
    isCurator: false,
  },
  getters: {
    getFunds(state){
      console.log('gere')
      return state.nftFunds;
    },
    getNoOfFunds(state){
      console.log('here')
      return state.nftFunds.length;
    }
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
    addFund(state, newFund) {
      state.nftFunds[newFund.contractId] = newFund;
    },
    removeFund(state, fundAddress) {
      if (state.nftFunds.hasOwnProperty(fundAddress)) {
        delete state.nftFunds[fundAddress];
      }
    },
    addNFT(state, { fundAddress, jsonDetails }) {
      console.log('123')
      state.nftFunds[fundAddress].nftList.push(jsonDetails)
      console.log(state.nftFunds)
    },
    toggleCuratorStatus(state) {
      state.isCurator = !state.isCurator;
    },
    setEthBalance(state, ethBalance) {
      state.ethBalance = ethBalance;
    },
    setFundTokenBalance(state, { fundAddress, fundTokenBalance }) {
      state.nftFunds[fundAddress].userTokenBalance = fundTokenBalance;
    },
    setFundDetails(state, { fundAddress, fundTokenBalance, ownerAddress, weiBalance, tokenStartPrice, tokenPrice, name, symbol, noOfAssets, img, nftList }) {
      var fund = {
        contractId: fundAddress,
        tokenPrice,
        fundTokenBalance,
        ownerAddress,
        weiBalance,
        tokenStartPrice,
        name,
        symbol,
        noOfAssets,
        nftList,
        img,
        returns: Math.floor(Math.random() * 100)
      };
      Vue.set(state.nftFunds, fundAddress, fund)
    },
    setFundList(state, fundList) {
      state.fundList = fundList;
    },
    addFundToList(state, fund) {
      state.fundList.push(fund);
    }
  },
  actions: {
    async connectToWallet({ commit }) {
      console.log('1234')
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      commit("setWeb3", web3);
      commit("setProvider", provider);

      //  Get Accounts
      const accounts = await web3.eth.getAccounts();
      commit("setAccounts", accounts);
      if (accounts.length > 0) {
        commit('setAccount', accounts[0])
      }

      // commit("setChainId", chainId);
      //  Get Network Id
      const networkId = await web3.eth.net.getId();
      commit("setNetworkId", networkId)

      commit('setActive', true)
      await this.dispatch("loadFundData");

      provider.on("connect", async (info) => {
        let chainId = parseInt(info.chainId)
        commit('setChainId', chainId)
        console.log("connect", info)
      });

      provider.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          commit('setAccount', accounts[0])
        } else {
          await dispatch('resetApp')
        }
        console.log("accountsChanged")
      });

      provider.on("chainChanged", async (chainId) => {
        chainId = parseInt(chainId)
        commit('setChainId', chainId)
        console.log("chainChanged", chainId)
      });
    },

    async getFundContract({ commit, state }, fundAddress) {
      try {
        var fundChecksumAddress = Web3.utils.toChecksumAddress(fundAddress)
        var fundContract = new state.web3.eth.Contract(erc20FundABI, fundChecksumAddress);
        console.log(fundContract)
        return fundContract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },

    async getFundFactoryContract({ commit, state }) {
      try {
        var fundFactoryAddressChecksum = Web3.utils.toChecksumAddress(state.fundFactoryAddress);
        var fundFacotryContract = new state.web3.eth.Contract(fundFactoryABI, fundFactoryAddressChecksum);
        return fundFacotryContract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
    },

    async getFunds({ commit, state }) {
      var fundFactoryContract = await this.dispatch("getFundFactoryContract")
      var noOfFunds = await fundFactoryContract.methods.getNoOfFundsCreated().call();
      var fundList = [];
      for (var i = 0; i < noOfFunds; i++) {
        var res = await fundFactoryContract.methods.funds(i).call()
        fundList.push(res);
      }
      return fundList;
    },

    async buyFundTokens({ commit }, { ethAmount, contractId }) {
      var fundContract = await this.dispatch("getFundContract", contractId);
      await fundContract.methods.addFunds().send({
        value: Web3.utils.toWei(ethAmount, 'ether'),
        from: this.state.account
      })
      this.dispatch('refreshBalance', contractId)
    },

    async refreshBalance({ }, fundAddress) {
      await this.dispatch("getEthBalance");
      await this.dispatch("getFundDetails", fundAddress);
    },

    async loadFundData({ }) {
      var fundList = await this.dispatch("getFunds");
      for (var fundAddress of fundList) {
        await this.dispatch('getFundDetails', fundAddress);
      }
    },

    async getEthBalance({ commit, state }) {
      var ethBalance = await state.web3.eth.getBalance(state.account);
      commit("setEthBalance", Web3.utils.fromWei(ethBalance, 'ether'));
    },

    async getFundDetails({ commit, state }, fundAddress) {
      console.log('test');
      var fundContract = await this.dispatch("getFundContract", fundAddress);
      var fundTokenBalance = await fundContract.methods.balanceOf(Web3.utils.toChecksumAddress(state.account)).call();
      var ownerAddress = await fundContract.methods.ownerAddress().call();
      var weiBalance = await fundContract.methods.weiBalance().call();
      var tokenStartPrice = await fundContract.methods.tokenStartPrice().call();
      var tokenPrice = await fundContract.methods.tokenPrice().call();
      var name = await fundContract.methods.name().call();
      var symbol = await fundContract.methods.symbol().call();
      var noOfAssets = await fundContract.methods.noOfAssets().call();
      var img = await fundContract.methods.fundImgUrl().call();

      var nftList = []
      for (var i = 1; i <= noOfAssets; i++) {
        console.log('here!!')
        var nftDetailsArray = await fundContract.methods.getAsset(i).call();
        console.log(nftDetailsArray)
        var nftDetails = {
          openseaUrl: nftDetailsArray[0],
          imageUrl: nftDetailsArray[1],
          nftAddress: nftDetailsArray[3],
          value: Web3.utils.fromWei(nftDetailsArray[2], 'ether')
        } 
        console.log(nftDetailsArray[3])
        nftList.push(nftDetails);
      }

      console.log({ fundAddress, fundTokenBalance, ownerAddress, weiBalance, tokenStartPrice, tokenPrice, name, symbol, noOfAssets })

      commit("setFundDetails", { fundAddress, fundTokenBalance, ownerAddress, weiBalance, tokenStartPrice, tokenPrice, name, symbol, noOfAssets, img, nftList })
    },

    async addNFTToFund({ commit }, { openseaUrl, fundAddress }) {
      console.log(openseaUrl)
      console.log(fundAddress)
      var assetUrl = openseaUrl.replace('https://opensea.io/assets/', 'https://api.opensea.io/api/v1/asset/')
      const response = await fetch(assetUrl);
      var jsonRes = await response.json();
      console.log(jsonRes)
      var jsonDetails = {
        tokenId: jsonRes['token_id'],
        contractId: jsonRes['asset_contract']['address'],
        img: jsonRes['image_url'],
        name: jsonRes['name'],
        days_held: 0,
        bought_at: findLowestSaleAmount(jsonRes['orders'])
      }
      console.log(fundAddress)
      commit("addNFT", { fundAddress, jsonDetails })
    }
  }

});
