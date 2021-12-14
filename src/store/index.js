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
const NFTSurveyInput = Moralis.Object.extend("NFTCollectionSurveyInput");
const Forum = Moralis.Object.extend("Forum");

async function getNFTCollectionRankingFromMoralisQuery(queryResults) {
  var nftCollectionCount = {};
  var totalVotes = 0;
  for (var index = 0; index < queryResults.length; index += 1) {
    var result = queryResults[index];
    var nftCollectionsFromResult = result.get("nftCollections");

    for (var nftColIndex = 0; nftColIndex < nftCollectionsFromResult.length; nftColIndex += 1) {
      var nftCollection = nftCollectionsFromResult[nftColIndex];
      if (nftCollection == "null" || nftCollection == "" || nftCollection == null) {
        continue;
      }
      totalVotes += 1;

      if (nftCollection in nftCollectionCount) {
        nftCollectionCount[nftCollection] += 1;
      } else {
        nftCollectionCount[nftCollection] = 1;
      }
    }
  }

  var nftCollectionList = [];
  for (var nftCollection in nftCollectionCount) {
    var percentageFloat = nftCollectionCount[nftCollection] / totalVotes;
    nftCollectionList.push({
      handle: nftCollection,
      count: nftCollectionCount[nftCollection],
      percentageVotes: percentageFloat.toFixed(2),
    });
  }

  nftCollectionList.sort((a, b) => (a.count < b.count ? 1 : -1));
  console.log(totalVotes);
  console.log(nftCollectionList);
  return nftCollectionList;
}

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
    fundFactoryAddress: "0x1E7E4c6aE711C738EC322606F31D3DD97970a257", //mumbai
    fundList: [],
    nftFunds: {},
    isCurator: false,
    nftCollectionList: [],
    postList: {},
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
    addFund(state, newFund) {
      state.nftFunds[newFund.contractId] = newFund;
    },
    removeFund(state, fundAddress) {
      if (state.nftFunds.hasOwnProperty(fundAddress)) {
        delete state.nftFunds[fundAddress];
      }
    },
    addNFT(state, { fundAddress, jsonDetails }) {
      console.log("123");
      state.nftFunds[fundAddress].nftList.push(jsonDetails);
      console.log(state.nftFunds);
    },
    toggleCuratorStatus(state) {
      state.isCurator = !state.isCurator;
    },
    setMaticBalance(state, maticBalance) {
      state.maticBalance = maticBalance;
    },
    setFundTokenBalance(state, { fundAddress, fundTokenBalance }) {
      state.nftFunds[fundAddress].userTokenBalance = fundTokenBalance;
    },
    setFundDetails(state, payload) {
      var fund = {
        contractId: payload.fundAddress,
        tokenPrice: Web3.utils.fromWei(payload.tokenPrice),
        fundTokenBalance: payload.fundTokenBalance,
        ownerAddress: payload.ownerAddress,
        weiBalance: Web3.utils.fromWei(payload.weiBalance),
        tokenStartPrice: Web3.utils.fromWei(payload.tokenStartPrice, "ether"),
        name: payload.name,
        symbol: payload.symbol,
        noOfAssets: payload.noOfAssets,
        nftList: payload.nftList,
        img: payload.img,
        returns: Math.floor(Math.random() * 100),
        userTokenBalance: payload.userTokenBalance,
      };
      Vue.set(state.nftFunds, payload.fundAddress, fund);
    },
    setFundList(state, fundList) {
      state.fundList = fundList;
    },
    addFundToList(state, fund) {
      state.fundList.push(fund);
    },
    commitNFTCollectionListToState(state, nftCollectionList) {
      state.nftCollectionList = nftCollectionList;
    },
    setPosts(state, {fundAddress, postList}) {
      Vue.set(state.postList, fundAddress, postList);
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

      // commit("setChainId", chainId);
      //  Get Network Id
      const networkId = await web3.eth.net.getId();
      commit("setNetworkId", networkId);

      commit("setActive", true);
      await this.dispatch("loadFundData");

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

    async getVotingContract({ commit, state }, voteAddress) {
      try {
        var checksumAddress = Web3.utils.toChecksumAddress(voteAddress);
        var contract = new state.web3.eth.Contract(nftFundVotingJson["abi"], checksumAddress);
        return contract;
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
      var fundFactoryContract = await this.dispatch("getFundFactoryContract");
      var noOfFunds = await fundFactoryContract.methods.getNoOfFundsCreated().call();
      var fundList = [];
      for (var i = 0; i < noOfFunds; i++) {
        var res = await fundFactoryContract.methods.funds(i).call();
        fundList.push(res);
      }
      return fundList;
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
      console.log("...");
      console.log(contractId);
      this.dispatch("refreshBalance", contractId);
    },

    async refreshBalance({}, fundAddress) {
      await this.dispatch("getMaticBalance");
      await this.dispatch("getFundDetails", fundAddress);
    },

    async loadFundData({}) {
      var fundList = await this.dispatch("getFunds");
      await this.dispatch("getMaticBalance");
      for (var fundAddress of fundList) {
        await this.dispatch("getFundDetails", fundAddress);
        await this.dispatch("fetchPosts", fundAddress);
      }
      
    },

    async getMaticBalance({ commit, state }) {
      var maticBalance = await state.web3.eth.getBalance(state.account);
      commit("setMaticBalance", Web3.utils.fromWei(maticBalance, "ether"));
    },

    async getFundDetails({ commit, state }, fundAddress) {
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
      var userTokenBalance = await fundContract.methods.balanceOf(state.account).call();

      var nftList = [];
      for (var i = 0; i < noOfAssets; i++) {
        var nftDetailsArray = await fundContract.methods.getAsset(i).call();
        var nftDetails = {
          openseaUrl: nftDetailsArray[0],
          imageUrl: nftDetailsArray[1],
          nftAddress: nftDetailsArray[3],
          value: Web3.utils.fromWei(nftDetailsArray[2], "ether"),
        };
        nftList.push(nftDetails);
      }

      commit("setFundDetails", {
        fundAddress,
        fundTokenBalance,
        ownerAddress,
        weiBalance,
        tokenStartPrice,
        tokenPrice,
        name,
        symbol,
        noOfAssets,
        img,
        nftList,
        userTokenBalance,
      });
    },

    async addNFTToFund({ commit }, { openseaUrl, fundAddress }) {
      var assetUrl = openseaUrl.replace("https://opensea.io/assets/", "https://api.opensea.io/api/v1/asset/");
      const response = await fetch(assetUrl);
      var jsonRes = await response.json();

      var nftValueInWei = Web3.utils.toWei(findLowestSaleAmount(jsonRes["orders"]).toString(), "ether").toString();

      var fundContract = await this.dispatch("getFundContract", fundAddress);
      console.log(jsonRes["asset_contract"]["address"], openseaUrl, jsonRes["image_url"], nftValueInWei);
      var res = await fundContract.methods
        .buyNFT(jsonRes["asset_contract"]["address"], openseaUrl, jsonRes["image_url"], nftValueInWei)
        .send({
          from: this.state.account,
        });
      console.log(res);
      await this.dispatch("getFundDetails", fundAddress);
    },

    async sellNFTfromFund({ commit, state }, { index, sellPrice, fundAddress }) {
      console.log("here!");
      var sellPriceInWei = parseFloat(sellPrice) * 10 ** 18;
      var fundContract = await this.dispatch("getFundContract", fundAddress);
      var res = await fundContract.methods.sellNFT(index, sellPriceInWei.toString()).send({
        from: this.state.account,
      });
      console.log(res);
      await this.dispatch("getFundDetails", fundAddress);
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

    async fetchNFTCollectionList({ commit, state }) {
      var NFTSurveyQuery = new Moralis.Query(NFTSurveyInput);
      var NFTSurveyResults = await NFTSurveyQuery.find();
      var nftCollectionList = await getNFTCollectionRankingFromMoralisQuery(NFTSurveyResults);

      commit("commitNFTCollectionListToState", nftCollectionList);
    },

    async postNFTCollections({}, { twitterHandle, nftCollection1, nftCollection2, nftCollection3 }) {

      var res = await axios.post('/api/isTwitterHandler', {handle:twitterHandle});
      console.log(res.data);
      if(!res.data.isTwitterHandle) {
        return {error:true, message:'Users twitter handle is incorrect'};
      }

      var res = await axios.post('/api/isTwitterHandler', {handle:nftCollection1});
      if(!res.data.isTwitterHandle && nftCollection2 != '') {
        return {error:true, message:'Collection 1 is not a twitter handle'};
      }
      
      var res = await axios.post('/api/isTwitterHandler', {handle:nftCollection2});
      if(!res.data.isTwitterHandle && nftCollection2 != '') {
        return {error:true, message:'Collection 2 is not a twitter handle'};
      }

      var res = await axios.post('/api/isTwitterHandler', {handle:nftCollection3});
      if(!res.data.isTwitterHandle && nftCollection2 != '') {
        return {error:true, message:'Collection 3 is not a twiiter handle'};
      }

      var data = {
        twitterHandle: twitterHandle,
        nftCollections: [nftCollection1, nftCollection2, nftCollection3],
      };

      

      const input = new NFTSurveyInput();
      input.set("twitterHandle", twitterHandle);
      input.set("nftCollections", [nftCollection1, nftCollection2, nftCollection3]);
      input.save();

      // console.log(res);
      this.dispatch("fetchNFTCollectionList");

      return {error: false};
    },

    async login() {
      let user = Moralis.User.current();
      if (!user) {
        user = await Moralis.authenticate();
      }
      console.log("logged in user:", user);
    },

    async logOut() {
      await Moralis.User.logOut();
      console.log("logged out");
    },

    async createPost({ state }, { PostDesc, fundAddress }) {
      const newPost = new Forum();

      var jointnftvoteContract = new state.web3.eth.Contract(nftFundVotingJson["abi"]);

      var jointnftvote = await jointnftvoteContract
        .deploy({
          data: nftFundVotingJson["data"],
          arguments: [Web3.utils.toChecksumAddress(fundAddress), PostDesc],
        })
        .send({
          from: state.account,
          gas: "4700000",
        });

      console.log(jointnftvote);
      if (typeof jointnftvote.address !== "undefined") {
        console.log("Contract mined! address: " + jointnftvote.contractAddress + " transactionHash: " + jointnftvote.transactionHash);
      }

      newPost.set("postDesc", PostDesc);
      newPost.set("fundAddress", fundAddress);
      newPost.set("voteContractAddress", jointnftvote._address);
      newPost.save();
      this.dispatch("fetchPosts", fundAddress);
    },

    async fetchPosts({ commit, state }, { fundAddress }) {
      var postsQuery = new Moralis.Query(Forum);
      // postsQuery.equalTo("fundAddress", fundAddress);
      var queryResults = await postsQuery.find();

      var postList = [];
      for (var index = 0; index < queryResults.length; index += 1) {
        var result = queryResults[index];
        var voteAddress = result.get("voteContractAddress");
        var desc = result.get("postDesc");
        postList.push({ voteAddress, desc });
      }

      commit("setPosts", {fundAddress, postList});
      this.dispatch("loadVotingDetails", postList);
    },

    async loadVotingDetails({ commit, state }, postList) {
      var postContract;
      for (var index = 0; index < postList.length; index += 1) {
        var post = postList[index];
        var postContract = await this.dispatch("getVotingContract", post.voteAddress);
        post['yesVotesByUser'] = await postContract.methods.getYesVotesByUser().call();
        post['noVotesByUser'] = await postContract.methods.getNoVotesByUser().call();
        post['totalVotesPossibleByUser'] = await postContract.methods.totalVotesPossible().call();
        post['associatedFundAddress'] = await postContract.methods.getAssociatedFund().call();
        post['totalYesVotes'] = await postContract.methods.getTotalYesVotes().call();
        post['totalNoVotes'] = await postContract.methods.getTotalNoVotes().call();
        var fundContract = await this.dispatch("getFundContract", post['associatedFundAddress']);
        post['totalVotesPossible'] = await fundContract.methods.totalSupply().call();
        commit("setPosts", {fundAddress:post['associatedFundAddress'], postList});
      }
      
    },
  },
});
