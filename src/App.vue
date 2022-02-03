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
      <v-btn href="/" text color="#6733e2"> Funds </v-btn>
      <!-- <ConnectWallet/> -->
      <v-btn @click="connect" v-if="!$store.state.account" text id="connect-wallet-btn" color="#6733e2">Connect wallet</v-btn>
      <v-btn v-else id="connect-wallet-btn" color="#6733e2">{{ $store.state.account.substring(0, 5) + "..." }}</v-btn>
      <div id="app">
        <Web3ModalVue ref="web3modal" :theme="theme" cache-provider />
      </div>
    </v-app-bar>
    <!--
    <v-main>
      <div v-if="mounted">
        <router-view></router-view>
      </div>
    </v-main>-->

    <v-main>
      <div>
      <router-view></router-view>
      </div>
    </v-main>

    <v-footer color="#6733e2" padless>
      <v-card flat tile color="#6733e2" class="lighten-1 white--text flex">
        <v-card-title style="display: contents;">
          <strong class="subheading">Get connected with us on social networks!</strong>

          <v-spacer></v-spacer>
          <v-btn  v-for="icon in icons" :key="icon" class="mx-4" dark icon style="float:right;">
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>

        </v-card-title>
      </v-card>
    </v-footer>
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
    connect() {
      this.$store.dispatch("connectToWallet").then(() => {
        this.mounted = true;
        console.log("done");
      });
    },
  },
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
    theme: "light",
    providerOptions: {},
    mounted: false,
  }),
  mounted() {
    this.$nextTick(async () => {
      const web3modal = this.$refs.web3modal;
      this.$store.commit("setWeb3Modal", web3modal);
      if (web3modal.cachedProvider) {
        this.connect();
      }
    });
  },
};
</script>
