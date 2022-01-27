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
    <v-row v-if="owner == connectedAccount">
      <v-col>
        <v-btn v-on:click="pauseBuySell"> Pause Buy/Sell </v-btn>
      </v-col>
      <v-col>
        <v-dialog v-model="dialog" persistent width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on"> Transfer Funds </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5"> Transfer Funds </span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                     <v-text-field v-model="toAddress" label="Enter the reciever's address" required></v-text-field>
                     <v-text-field v-model="value" :rules="[numberRule]" label=" Value " required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" text @click="transferFunds()"> Continue 
                  <div v-if="loadTransferFund" v-cloak>
                    <v-icon class="fa fa-spinner fa-spin"></v-icon>
                  </div>
                </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
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
          this.refreshBalances();
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
          this.refreshBalances();
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
    pauseBuySell(){
      this.$store.dispatch("pauseBuyAndSell",{contractId: this.$route.query.contractId})
    },

    getNFTsInContract() {
      this.$store.dispatch("getNFTsInContract", {address: this.$route.query.contractId});
    },
    transferFunds(){
      this.loadTransferFund=true;
      this.$store.dispatch("transferFunds",{
        contractId: this.$route.query.contractId,
        toAddress: this.toAddress,
        value: this.value
      }).then(()=>{
        this.refreshBalances();
        this.loadTransferFund=false;
        this.dialog=false;
        this.$vToastify.success("Funds successfully transferred");
      });
    },
  },
  data: () => ({
    numberRule: (v) => {
      if (v != null && v != "" && !v.trim()) return true;
      if (!isNaN(parseFloat(v))) return true;
      return "Enter a number";
    },
    dialog: false,
    maticAmount: 0,
    tokenAmount: 0,
    tokenPrice: 0,
    value: 0,
    toAddress:"",
    loading_buy:false,
    loading_sell:false,
    loadTransferFund:false,
  }),
  props: ["owner", "connectedAccount"],
};
</script>
