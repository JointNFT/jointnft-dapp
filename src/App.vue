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
      <v-btn v-if="$store.state.isCurator" text color="#6733e2" v-on:click="toggleCuratorStatus">
        Curator
      </v-btn>
      <v-btn v-else v-on:click="toggleCuratorStatus"> Investor </v-btn>
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
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import ExploreFunds from "./components/ExploreFunds.vue";

export default {
  name: "App",

  components: {
    ExploreFunds,
  },
  methods: {
    getCuratorStatus() {
      return this.$store.state.isCurator;
    },
    toggleCuratorStatus() {
      console.log(this.$store.state.isCurator);
      return this.$store.commit("toggleCuratorStatus");
    },
  },
  data: () => ({
    //
  }),
};
</script>
