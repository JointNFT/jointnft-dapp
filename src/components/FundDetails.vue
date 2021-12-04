<template>
  <v-container>
    <v-row>
      <v-col> Eth in Wallet: {{ $store.state.ethBalance }} </v-col>
      <v-col> tokenBalance: {{ getNFTDetails.userTokenBalance }} </v-col>
    </v-row>
    <v-row>
      <v-col> TokenPrice: {{ getNFTDetails.tokenPrice || 0 }} </v-col>
      <v-col>
        Token Starting Price: {{ getNFTDetails.tokenStartPrice || 0 }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Ether Balance in Fund: {{ getNFTDetails.weiBalance || 0 }}
      </v-col>
      <v-col> owner: {{ getNFTDetails.ownerAddress || 0 }} </v-col>
    </v-row>
    <v-row
      ><v-col> <v-divider /></v-col>
    </v-row>
    <v-row>
      <v-btn v-on:click="refreshBalances"> refresh balance </v-btn>
    </v-row>
    <v-row>
      <v-text-field
        v-model="ethAmount"
        :rules="[numberRule]"
        label="Enter amount of ETH"
      ></v-text-field>
      <v-btn v-on:click="buyFundTokens"> Buy Tokens </v-btn>
    </v-row>
    <v-row>
      <v-text-field
        v-model="tokenAmount"
        :rules="[numberRule]"
        label="Enter amount of Tokens to sell"
      ></v-text-field>
      <v-btn v-on:click="sellFundTokens"> Sell Tokens </v-btn>
    </v-row>
    <v-row v-if="owner == connectedAccount">
      <v-text-field
        v-model="tokenPrice"
        :rules="[numberRule]"
        label="Enter the new tokenPrice(In Wei) 1 ETH = 10^18 wei"
      ></v-text-field>
      <v-btn v-on:click="modifyTokenPrice"> Modify Token Price </v-btn>
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
      this.$store.dispatch("refreshBalance", this.$route.query.contractId);
    },
    buyFundTokens() {
      this.$store
        .dispatch("buyFundTokens", {
          ethAmount: this.ethAmount,
          contractId: this.$route.query.contractId,
        })
        .then(() => {
          this.$vToastify.success("Tokens bought!");
        });
    },
    sellFundTokens() {
      this.$store
        .dispatch("sellFundTokens", {
          tokenAmount: this.tokenAmount,
          contractId: this.$route.query.contractId,
        })
        .then(() => {
          this.$vToastify.success("Tokens sold!");
        });
    },
    modifyTokenPrice() {
      this.$store
        .dispatch("modifyTokenPrice", {
          tokenPrice: this.tokenPrice,
          contractId: this.$route.query.contractId,
        })
        .then(() => {
          this.$vToastify.success("Tokens Price modified!");
        });
    },
  },
  data: () => ({
    numberRule: (v) => {
      if (v != null && v != "" && !v.trim()) return true;
      if (!isNaN(parseFloat(v))) return true;
      return "Enter a number";
    },
    ethAmount: 0,
    tokenAmount: 0,
    tokenPrice: 0,
  }),
  props: ["owner", "connectedAccount"],
};
</script>
