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
    fundFactoryAddress: "0xF637ef095B45b93B1319C9e7c4c945aC8f99B87F",
    nftFunds: {
      "0x07c2344503B74b957292a75798C0dE969ab2F1cB": {
        name: "Fund1", img: 'https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600', contractId: "0x07c2344503B74b957292a75798C0dE969ab2F1cB", returns: 20.3,
        nfts: [
          { img: "https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600", name: 'NFT1', days_held: '5', bought_at: 5, contractId: '123' },
          { img: "https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600", name: 'NFT2', days_held: '10', bought_at: 10, contractId: '1234' }
        ],
        userTokenBalance: 0,
        tokenPrice: -1
      },
      "0x1ebe416265F2b3f33eA65A825636308b06D0DF12": {
        name: "Fund2", img: 'https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600', contractId: "0x1ebe416265F2b3f33eA65A825636308b06D0DF12", returns: 33.3,
        nfts: [
          { img: "https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600", name: 'NFT1', days_held: '5', bought_at: 5, contractId: '123' },
          { img: "https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600", name: 'NFT2', days_held: '10', bought_at: 10, contractId: '1234' }
        ],
        userTokenBalance: 0,
        tokenPrice: -1
      }
    },
    isCurator: false,
  },
  getters: {
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
      state.nftFunds[fundAddress].nfts.push(jsonDetails)
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
    setFundTokenPrice(state, { fundAddress, tokenPrice }) {
      state.nftFunds[fundAddress].tokenPrice = tokenPrice;
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
        var fundFacotryContractABI = state.web3.eth.contract(fundFactoryABI, state.fundFactoryAddress);
        return fundFactoryContract;
      } catch (error) {
        console.log(error);
        console.log("connected contract not found");
        return null;
      }
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
      await this.dispatch("getFundTokenBalance", fundAddress);
    },
    async getEthBalance({ commit, state }) {
      var ethBalance = await state.web3.eth.getBalance(state.account);
      commit("setEthBalance", Web3.utils.fromWei(ethBalance, 'ether'));
    },
    async getFundTokenBalance({ commit, state }, fundAddress) {

      var fundContract = await this.dispatch("getFundContract", fundAddress);
      var fundTokenBalance = await fundContract.methods.balanceOf(Web3.utils.toChecksumAddress(state.account)).call();
      console.log(fundTokenBalance)
      commit("setFundTokenBalance", { fundAddress, fundTokenBalance })
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
