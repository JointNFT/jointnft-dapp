<template>
  <v-container>
    <v-row>
      <v-col> ETH in Wallet: {{ $store.state.maticBalance }} </v-col>
      <v-col> tokenBalance: {{ getCollectionDetails.userTokenBalance }} </v-col>
    </v-row>
    <v-row>
      <v-col> TokenPrice: {{ getCollectionDetails.tokenPrice || 0 }} </v-col>
      <v-col>
        Token Starting Price: {{ getCollectionDetails.tokenStartPrice || 0 }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        ETH in Fund: {{ getCollectionDetails.contractBalance || 0 }}
      </v-col>
      <v-col> owner: {{ getCollectionDetails.ownerAddress || 0 }} </v-col>
    </v-row>
    <v-row
      ><v-col> <v-divider /></v-col>
    </v-row>
    <v-row>
      <v-text-field
        v-model="maticAmount"
        :rules="[numberRule]"
        label="Enter amount of eth"
      ></v-text-field>
      <v-btn v-on:click="buyFundTokens"> Buy Tokens 
         <div v-if="loading_buy" v-cloak>
            <v-icon class="fa fa-spinner fa-spin"></v-icon>
         </div>
      </v-btn>
    </v-row>
    <v-row>
      <v-text-field
        v-model="tokenAmount"
        :rules="[numberRule]"
        label="Enter amount of Tokens to sell"
      ></v-text-field>
      <v-btn v-on:click="sellFundTokens"> Sell Tokens 
       <div v-if="loading_sell" v-cloak>
         <v-icon class="fa fa-spinner fa-spin"></v-icon>
       </div>  
      </v-btn>
    </v-row>
    <v-row v-if="owner == connectedAccount">
      <v-text-field
        v-model="tokenPrice"
        :rules="[numberRule]"
        label="Enter the new tokenPrice(In Wei) 1 ETH = 10^18 wei"
      ></v-text-field>
      <v-btn v-on:click="modifyTokenPrice"> Modify Token Price </v-btn>
    </v-row>
    <!-- <v-row> -->
      <!-- <v-col> -->
      <!-- <EndZoraAuction/></v-col> -->
    <!-- </v-row> -->
  </v-container>
</template>

<script>
import EndZoraAuction from "./endZoraAuction.vue";

export default {
  components: {
    EndZoraAuction
  },
  computed: {
    getCollectionDetails() {
      var details = this.$store.state.collectionDetails;
      if(details == null || details == {}) {
        return {};
      }
      return details;
    },
  },
  methods: {
    refreshBalances() {
      this.$store.dispatch("refreshBalance", this.$route.query.contractId);
      
    },
    buyFundTokens() {
      this.loading_buy=true;
      this.$store
        .dispatch("buyFundTokens", {
          maticAmount: this.maticAmount,
          contractId: this.$route.query.contractId,
        })
        .then(() => {
          this.loading_buy=false;
          this.$vToastify.success("Tokens bought!");
        });
    },
    sellFundTokens() {
      this.loading_sell=true;
      this.$store
        .dispatch("sellFundTokens", {
          tokenAmount: this.tokenAmount,
          contractId: this.$route.query.contractId,
        })
        .then(() => {
          this.loading_sell=false;
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

    getNFTsInContract() {
      this.$store.dispatch("getNFTsInContract", {address: this.$route.query.contractId});
    }
  },
  data: () => ({
    numberRule: (v) => {
      if (v != null && v != "" && !v.trim()) return true;
      if (!isNaN(parseFloat(v))) return true;
      return "Enter a number";
    },
    maticAmount: 0,
    tokenAmount: 0,
    tokenPrice: 0,
    loading_buy:false,
    loading_sell:false,
  }),
  props: ["owner", "connectedAccount"],
};
</script>
