<template>
  <v-container>
    <v-row>
      <v-col> Eth in Wallet: {{ $store.state.ethBalance }} </v-col>
      <v-col> tokenBalance: {{ getNFTDetails.userTokenBalance }} </v-col>
    </v-row>
    <v-row>
      <v-col> TokenPrice: {{ getNFTDetails.tokenPrice || 0}} </v-col>
      <v-col> Token Starting Price: {{ getNFTDetails.tokenStartPrice || 0}} </v-col>
    </v-row>
    <v-row>
      <v-col> Ether Balance in Fund: {{ getNFTDetails.weiBalance || 0}} </v-col>
      <v-col> owner: {{ getNFTDetails.ownerAddress || 0}} </v-col>
    </v-row>
    <v-row
      ><v-col> <v-divider /></v-col>
    </v-row>
    <v-row>
      <v-btn v-on:click="refreshBalances"> refresh balance </v-btn>
    </v-row>
    <v-row>
      <v-text-field v-model="ethAmount" :rules="[numberRule]"></v-text-field>
      <v-btn v-on:click="buyFundTokens"> Buy Tokens </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {},
  computed: {
    getNFTDetails() {
      return this.$store.state.nftFunds[this.$route.query.contractId];
    },
  },
  methods: {
    refreshBalances() {
      this.$store.dispatch("loadFundData");
    },
    buyFundTokens() {
      this.$store.dispatch("buyFundTokens", {
        ethAmount: this.ethAmount,
        contractId: this.$route.query.contractId,
      });
    },
  },
  data: () => ({
    numberRule: (v) => {
      if (!v.trim()) return true;
      if (!isNaN(parseFloat(v)) && v >= 0 && v <= 999) return true;
      return "Number has to be between 0 and 999";
    },
    ethAmount: 0,
  }),
  beforeUpdate: function() {
    return this.refreshBalances();
  }
};
</script>