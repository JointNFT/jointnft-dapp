<template>
  <v-app>
    <v-app-bar app color="white" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/jointnft_logo.png"
          transition="scale-transition"
          width="150"
          height="148"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn href="/DiscoverNFTs" color="#6733e2"> Discover !</v-btn>
      <v-btn href="/" text color="#6733e2"> Funds </v-btn>
      <v-btn href="/CreateFund" text color="#6733e2"> Create </v-btn>
      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
        color="#6733e2"
      >
        Whitepaper
      </v-btn>
      <!-- <ConnectWallet/> -->
      <v-btn
        @click="connect"
        v-if="!$store.state.account"
        text
        id="connect-wallet-btn"
        color="#6733e2"
        >Connect wallet</v-btn
      >
      <v-btn v-else id="connect-wallet-btn" color="#6733e2">{{
        $store.state.account.substring(0, 5) + "..."
      }}</v-btn>
      <div id="app">
        <Web3ModalVue ref="web3modal" :theme="theme" cache-provider />
      </div>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped>
.connect-wallet-btn {
  border: 2px solid #6733e2;
  background-color: white;
}
</style>

<script>
import ExploreFunds from "./components/ExploreFunds.vue";
import ConnectWallet from "./components/ConnectWallet.vue";
import Web3ModalVue from "web3modal-vue";
import { web3Modal } from "./config/mixins";

export default {
  name: "App",

  components: {
    ExploreFunds,
    ConnectWallet,
    Web3ModalVue,
  },
  methods: {
    getCuratorStatus() {
      return this.$store.state.isCurator;
    },
    toggleCuratorStatus() {
      console.log(this.$store.state.isCurator);

      return this.$store.commit("toggleCuratorStatus");
    },
    connect(fundAddress) {
      console.log(this.$moralis);
      console.log('fundAddress', fundAddress);
      if(fundAddress!= null && fundAddress != '') {
        this.$store.dispatch("connectToWallet").then(()=> {
          console.log('fundAddress',fundAddress)
          this.$store.dispatch("fetchPosts", { fundAddress });
        });
      } else {
        this.$store.dispatch("connectToWallet");
      }
    }
  },
  data: () => ({
    theme: "light",
    providerOptions: {},
  }),
  mounted() {
    this.$nextTick(async () => {
      const web3modal = this.$refs.web3modal;
      this.$store.commit("setWeb3Modal", web3modal);
      if (web3modal.cachedProvider) {
        this.connect(this.$route.query.contractId);
      }
    });
  },
};
</script>
