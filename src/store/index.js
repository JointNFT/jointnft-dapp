import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    nftFunds: {
      "1234": { name: "Fund#1", img: 'BYAC_2.png', address: "1234", returns: 20.3, 
          nfts: [
            {img: "BYAC_2.png", name: 'NFT1', days_held: '5', bought_at: 5, address:'123' },
            {img: "BYAC_2.png", name: 'NFT2', days_held: '10', bought_at: 10, address:'1234' }
          ]          
    },
      "1243": { name: "Fund#2", img: 'BYAC_2.png', address: "1243", returns: 33.3,  
      nfts: [
        {img: "BYAC_2.png", name: 'NFT1', days_held: '5', bought_at: 5, address:'123' },
        {img: "BYAC_2.png", name: 'NFT2', days_held: '10', bought_at: 10, address:'1234' }
      ]  
    }
    },
    isCurator: true,
  },
  getters: {
  },
  mutations: {
    addFund(state, newFund) {
      state.nftFunds[newFund.address] = newFund;
    },
    removeFund(state, fundAddress) {
      if (state.nftFunds.hasOwnProperty(fundAddress)) {
        delete state.nftFunds[fundAddress];
      }
    },
    toggleCuratorStatus(state) {
      state.isCurator = !state.isCurator;
    }
  },
  actions: {

  }

});
