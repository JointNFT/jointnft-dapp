import Vue from "vue";
import Vuex from "vuex";
import fetch from "cross-fetch";
import Web3 from 'web3';
import createPersistedState from "vuex-persistedstate";
import Web3Modal from "web3modal";



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
    nftFunds: {
      "1234": {
        name: "Fund#1", img: 'https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600', contractId: "1234", returns: 20.3,
        nfts: [
          { img: "https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600", name: 'NFT1', days_held: '5', bought_at: 5, contractId: '123' },
          { img: "https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600", name: 'NFT2', days_held: '10', bought_at: 10, contractId: '1234' }
        ]
      },
      "1243": {
        name: "Fund#2", img: 'https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600', contractId: "1243", returns: 33.3,
        nfts: [
          { img: "https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600", name: 'NFT1', days_held: '5', bought_at: 5, contractId: '123' },
          { img: "https://lh3.googleusercontent.com/ptC7Bh0BqSapSCDFBqKEuJE6P4d0l8rc-RR39H3gX9qBPh4htvKapZUpcC70WoF7lKKcjCXrwQgZBdMN8gd_qzPnpWNvdR1M2AtUjA=w600", name: 'NFT2', days_held: '10', bought_at: 10, contractId: '1234' }
        ]
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
      commit("setAccount", accounts);
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
      console.log('1234')
      console.log(accounts)
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
