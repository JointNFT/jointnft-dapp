<template>
  <v-app>
    <v-app-bar app color="#403561" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/icon.png"
          transition="scale-transition"
          width="50"
          height="50"
        />
        <v-toolbar-title style="positon: relative; right=20px;">Collections</v-toolbar-title>
      </div>

      <v-spacer></v-spacer>
      <v-btn href="/" text color="white"> Funds </v-btn>
      <!-- <ConnectWallet/> -->
      <v-btn @click="connect" v-if="!$store.state.account" text id="connect-wallet-btn" color="white">Connect wallet</v-btn>
      <v-btn v-else id="connect-wallet-btn" color="#6733e2">{{ $store.state.account.substring(0, 5) + "..." }}</v-btn>
      <div id="app">
        <Web3ModalVue ref="web3modal" :theme="theme" cache-provider />
      </div>
    </v-app-bar>

     <v-main id = "main-tag"> <!--class="ma-0 pa-0" -->
      <div v-if="isMountNeeded">
        <router-view></router-view>
      </div>
    </v-main>

    <v-footer color="#403561">
      <v-card flat tile color="#403561" class="lighten-1 white--text flex">
        <v-card-title style="display: contents;">
          <strong class="subheading">Get connected with us on social networks!</strong>

          <v-spacer></v-spacer>
          <v-btn v-for="(icon, idx) in icons" :key="idx" class="mx-4" dark icon :href="icon.target" target="_blank" style="float:right;">
            <v-icon size="24px">
              {{ icon.icon }}
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
/* #main-tag */
#main-tag {
  background: #c3bdcb;
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
  computed: {
    isMountNeeded() {
      if(this.$route.fullPath == "/") return true;
      return this.mounted;
    }
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
      });
    },
  },
  data: () => ({
    icons: [
      { icon: "fab fa-discord", target: "https://discord.gg/NrdeYC454x" },
      { icon: "mdi-twitter", target: "https://twitter.com/the_joint_nft" },
      { icon: "mdi-linkedin", target: "https://www.linkedin.com/company/joint-nft/about/" },
      { icon: "mdi-instagram", target: "https://www.instagram.com/joint_nft/" },
    ],
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
