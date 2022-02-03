<template>
  <v-container>
    <v-row align="center">
      <v-card width="400">
       <!-- <v-img :src="nft.token_uri" />-->
        <!-- <SellNFTCard :token_id="nft.token_id" :token_address="nft.token_address" :owner="owner" :index="index" v-if="owner==connectedAccount"/> -->
        <v-container>
          <v-row align="center">
            <v-img :src="getImg" >
              <v-btn small :href="nft.openseaUrl" target="_blank" class= "chain" elevation="2" fab>
                <img width = "28" style="border-radius: 29;" src="../../assets/Logomark-Blue.svg"/>
              </v-btn>
            </v-img>
          </v-row>

          <v-row class="justify-center">
            <v-card-title class="card-title">{{ nft.collection }}</v-card-title>
          </v-row>
          <v-row class="justify-center">
            <v-card-subtitle>{{nft.name}}</v-card-subtitle>
          </v-row> 

          <v-row>
            <v-divider></v-divider>
          </v-row>

          <v-row class="text-row">
            <v-col class="left-col"> In Collection :</v-col>
            <v-col class="right-col"> {{nft.in_collection}} </v-col>
          </v-row>
          

          <v-row class="text-row">
            <v-col class="left-col"> Purchase Price : </v-col>
            <v-col class="right-col"> {{ nft.purchase_price.amount }} {{nft.purchase_price.currency}} (${{nft.floor_price_dollars.amount}}) </v-col>
          </v-row>

          <v-row class="text-row">
            <v-col class="left-col"> Floor Price : </v-col>
            <v-col class="right-col"> {{ nft.floor_price.amount }} {{nft.floor_price.currency}} (${{nft.floor_price_dollars.amount}}) </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-row>
    <v-row>
      <!-- <v-card width="400">
        <v-row id="image-row">
          <v-col class="pa-2 key top-row"> Days held </v-col>
          <v-col class="pa-2 value top-row"> {{ nft.days_held }}</v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="pa-2 key bottom-row"> Bought At </v-col>
          <v-col class="pa-2 value bottom-row"> {{ nft.value }}ETH </v-col>
        </v-row>
      </v-card> -->
    </v-row>
  </v-container>
</template>

<style scoped>
.row {
  margin-bottom: 10px;
}
.card-title {
  padding: 0px !important;
  font-size: 1rem;
}
.text-row {
  margin-bottom: -15px !important;
  margin-top: -15px !important;
}
.value {
  text-align: right;
  margin-right: 25px;
}
.key {
  text-align: left;
  margin-left: 25px;
}
.top-row {
  margin-top: 5px;
}
.bottom-row {
  margin-top: 5px;
}
.float {
  position: fixed;
  width: 60px;
  height: 60px;
  bottom: 40px;
  right: 40px;
  background-color: #0c9;
  color: #fff;
  border-radius: 50px;
  text-align: center;
  box-shadow: 2px 2px 3px #999;
}
</style>

<script>
import SellNFTCard from "./SellNFTCard.vue";
export default {
  components: {
    SellNFTCard,
  },
  props: ["nft", "index", "owner", "connectedAccount", {nft : Object}],
  computed: {
    getImg(){
      return this.$props.nft.imageUrl;
    },
  },
  data: () => ({}),
};
</script>
