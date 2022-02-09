<template>
  <v-container>
    <v-card style="background-color: Lavender">
      <v-card-title>
          <h1 style ="font-size: 1.5rem; font-family: PT Sans Caption; font-weight:bold" >{{ getCollectionDetails.name }}</h1>
      </v-card-title>
          <v-card-text>
              
              <v-img :src="getImg" height="30" width="30" style="padding:1px"></v-img><h1>{{ getCollectionDetails.symbol }}</h1>
              <br>
            <v-container>
       <v-row>
        </v-row>
        <v-row>
          <v-col style="font-family: PT Sans Caption ; font-weight:bold; padding:1px">Tokens in Circulation: {{ getCollectionDetails.totalSupply || 0 }} {{ getCurrency }}</v-col>
        </v-row>
        <v-row>
          <v-col style="font-family: PT Sans Caption ; font-weight:bold; padding:1px"> Tokens Owned: {{ getCollectionDetails.userTokenBalance }} {{ getCollectionDetails.symbol }}</v-col>
        </v-row>
    
        <v-row>
           <v-col style="font-family: PT Sans Caption; font-weight:bold; padding:1px"> Token Buy Price: {{ getCollectionDetails.tokenBuyPrice || 0 }} {{ getCurrency }}</v-col>
        </v-row>
        <v-row>
           <v-col style="font-family: PT Sans Caption; font-weight:bold; padding:1px">Token Sell Price: {{ getCollectionDetails.tokenSellPrice || 0 }} {{ getCurrency }}</v-col>
        </v-row>
        <v-row>
           <v-col style="font-family: PT Sans Caption; font-weight:bold; padding:1px">Funding Goal: {{ getCollectionDetails.fundingGoal || 0 }} {{ getCurrency }}</v-col>
        </v-row>
        <v-row>
           <v-col style="font-family: PT Sans Caption; font-weight:bold; padding:1px">To reach Goal: {{ getAmountLeftForGoal || 0 }} {{ getCurrency }}</v-col>
        </v-row>
       </v-container>
     </v-card-text>
    </v-card>
    <v-row
      ><v-col> <v-divider /></v-col>
    </v-row>
    <v-row>
      <v-text-field
        v-model="maticAmount"
        :rules="[numberRule]"
        label="Enter amount of eth"
      ></v-text-field>
      <v-btn :disabled="isBuyingEnabled" v-on:click="buyFundTokens"> Buy Tokens
        <div v-if="loading_buy" v-cloak>
            <v-icon class="fa fa-spinner fa-spin"></v-icon>
        </div>
      </v-btn>
      </v-row><v-row>
      <v-text-field
        v-model="tokenAmount"
        :rules="[numberRule]"
        label="Enter amount of Tokens to sell"
      ></v-text-field>
      <v-btn :disabled="isSellingEnabled" v-on:click="sellFundTokens"> Sell Tokens
        <div v-if="loading_sell" v-cloak>
            <v-icon class="fa fa-spinner fa-spin"></v-icon>
        </div>
      </v-btn>
      
    </v-row>
    <v-row v-if="owner == connectedAccount">
      <v-text-field
        v-model="tokenBuyPrice"
        :rules="[numberRule]"
        label="Enter the new tokenPrice(In Wei) 1 ETH = 10^18 wei"
      ></v-text-field>
      <v-btn :disabled="isSendingModify" v-on:click="setTokenPrice(true)"> setTokenBuyPrice 
        <div v-if="loading_modify" v-cloak>
            <v-icon class="fa fa-spinner fa-spin"></v-icon>
        </div>
      </v-btn>
    </v-row>
    <v-row v-if="owner == connectedAccount">
      <v-text-field
        v-model="tokenSellPrice"
        :rules="[numberRule]"
        label="Enter the new tokenPrice(In Wei) 1 ETH = 10^18 wei"
      ></v-text-field>
      <v-btn :disabled="isSendingModify" v-on:click="setTokenPrice(false)"> setTokenSellPrice 
        <div v-if="loading_modify" v-cloak>
            <v-icon class="fa fa-spinner fa-spin"></v-icon>
        </div>
      </v-btn>
    </v-row>
    <v-row v-if="owner == connectedAccount">
      <v-col>
        <v-btn :disabled="isSending_Buy" v-on:click="toggleBuyButton"> Toggle Buy 
           <div v-if="loadingToggleBuy" v-cloak>
            <v-icon class="fa fa-spinner fa-spin"></v-icon>
           </div>
        </v-btn>
      </v-col>
      <v-col>
        <v-btn :disabled="isSending_Sell" v-on:click="toggleSellButton"> Toggle Sell 
           <div v-if="loadingToggleSell" v-cloak>
             <v-icon class="fa fa-spinner fa-spin"></v-icon>
           </div>
        </v-btn>
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
import constants from "../../const";
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
    getCurrency() {
      var details = this.$props.collections;
      if ("chain" in details && details.chain != null && details.chain != "") {
        return constants[details["chain"]].currency;
      } 
    },
    isBuyingEnabled() {
      var details = this.$props.collections;
      var buyingEnabled = true;
      var diff = 1;
      if ("buyingEnabled" in details && details.buyingEnabled != null) {
        diff = parseFloat(details.fundingGoal) - parseFloat(details.totalDeposited); 
        console.log(diff)
        if (diff == 0) return true; // if more funds cant be put into the fnd , disable buy tokens
        buyingEnabled = !(!this.isSendingBuyTokens && details.buyingEnabled);
      } else {
        buyingEnabled = !this.isSendingBuyTokens;
      }
      return buyingEnabled;
    },
    isSellingEnabled() {
      var details = this.$props.collections;
      if ("sellingEnabled" in details && details.sellingEnabled != null) {
        console.log(details.sellingEnabled);
        return !(!this.isSendingSellTokens && details.sellingEnabled);
      }
      return !this.isSendingSellTokens;
    },
    getConstants(){
      return constants;
    },
    getImg(){
      var details = this.$props.collections;
      if ("chain" in details && details.chain != null && details.chain != "") {
        return require("../assets/" + constants[details["chain"]].ICONS);
      } 
    },
    getAmountLeftForGoal() {
      var details = this.$props.collections;
      var diff = 0;
      if ("contractBalance" in details && details["contractBalance"] != null) {
        diff = parseFloat(details.fundingGoal) - parseFloat(details.totalDeposited); 
      }
      return diff;
    }
  },
  methods: {
    
    refreshBalances() {
      this.$store.dispatch("refreshBalance", this.$route.query.contractId);
      
    },
    buyFundTokens() {

      this.loading_buy=true;
      this.isSendingBuyTokens=true;
      this.$store
        .dispatch("buyFundTokens", {
          maticAmount: this.maticAmount,
          contractId: this.$route.query.contractId,
        })
        .then(() => {
          this.loading_buy=false;
         // console.log(this.$store.state.isError);
          this.isSendingBuyTokens=false;
          if(this.$store.state.isError==0){
            this.$vToastify.success("Tokens bought!");
            this.$store.dispatch("refreshBalances");
          }
        });
    },
    sellFundTokens() {
      this.loading_sell=true;
      this.isSendingSellTokens=true;
       this.$store
        .dispatch("sellFundTokens", {
          tokenAmount: this.tokenAmount,
          contractId: this.$route.query.contractId,
        })
        .then(() => {
          this.loading_sell=false;
          this.isSendingSellTokens=false;
          if(this.$store.state.isError==0){
            this.$vToastify.success("Tokens sold!"); 
            this.dispatch("refreshBalances");   
          }     
        });
    },
    setTokenPrice(isBuyBeingModified) {
      var tokenPrice = isBuyBeingModified ? this.tokenBuyPrice : this.tokenSellPrice;
      this.loading_modify=true;
      this.isSendingModify=true;
      this.$store
        .dispatch("setTokenPrice", {
          tokenPrice: tokenPrice,
          isBuyBeingModified: isBuyBeingModified,
          contractId: this.$route.query.contractId,

        })
        .then(() => {
          this.loading_modify=false;
          this.isSendingModify=false;
          if(this.$store.state.isError==0){
          this.$vToastify.success("Tokens Price modified!");
          }
        });
    },

   toggleBuyButton(){

     this.loadingToggleBuy=true;
     this.isSending_Buy=true;
     this.$store.dispatch("toggleBuy",{
       contractId: this.$route.query.contractId,
       }).then(()=>{
         if(this.getCollectionDetails.buyingEnabled){
            
            if(this.$store.state.isError==0){
              this.isSendingBuyTokens=true;
              this.$vToastify.success("Disabled Buy");
            }
         }
         else{
            
            if(this.$store.state.isError==0){
              this.isSendingBuyTokens=false;
              this.$vToastify.success("Enabled Buy");
            }
           }
          this.isSending_Buy=false;
          this.loadingToggleBuy=false;
       });

   },
   toggleSellButton(){

     this.loadingToggleSell=true;
     this.isSending_Sell=true;
     this.$store.dispatch("toggleSell",{
       contractId: this.$route.query.contractId,
       }).then(()=>{
         if(this.getCollectionDetails.sellingEnabled){
            
            if(this.$store.state.isError==0){
              this.isSendingSellTokens=true;
              this.$vToastify.success("Disabled Sell");
            }
         }
         else{
            
            if(this.$store.state.isError==0){
              this.isSendingSellTokens=false;
              this.$vToastify.success("Enabled Sell");
            }
           }
          this.isSending_Sell=false;
          this.loadingToggleSell=false;
       });

   },
  
    getNFTsInContract() {
      this.$store.dispatch("getNFTsInContract", {address: this.$route.query.contractId, collection_id: this.$route.query.collectionId});
    },

    transferFunds(){
      this.loadTransferFund=true;
      this.$store.dispatch("transferFunds",{
        contractId: this.$route.query.contractId,
        toAddress: this.toAddress,
        value: this.value
      }).then(()=>{
        //this.dispatch("refreshBalances");
        this.loadTransferFund=false;
        this.dialog=false;
        if(this.$store.state.isError==0){
        this.$vToastify.success("Funds successfully transferred");
        }
        else 
          this.$vToastify.error("Some error occured");
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
    tokenBuyPrice: 0,
    tokenSellPrice: 0,
    value: 0,
    toAddress:"",
    loading_buy:false,
    loading_sell:false,
    loading_modify:false,
    loadTransferFund:false,
    isSending_Buy:false,
    isSending_Sell:false,
    isSendingBuyTokens:false,
    isSendingSellTokens:false,
    isSending_ModifyPrice:false,
    isSendingModify:false,
    loadingToggleBuy:false,
    loadingToggleSell:false,
  }),
  props: ["owner", "connectedAccount", "collections"],
};
</script>
