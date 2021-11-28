import Vue from "vue";
import Vuex from "vuex";
import fetch from "cross-fetch";
import Web3 from 'web3';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);


function roundToTwo(num) {    
  return +(Math.round(num + "e+2")  + "e-2");
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
  plugins: [createPersistedState()],
  state: {
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
