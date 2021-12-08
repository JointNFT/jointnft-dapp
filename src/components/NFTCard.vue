<template>
  <v-container>
    <v-row align="center">
      <v-card width="400">
        <v-img :src="nft.imageUrl" />
        <SellNFTCard :index="index" v-if="owner==connectedAccount"/>
      </v-card>
    </v-row>
    <v-row>
      <v-card width="400">
        <v-row id="image-row">
          <v-col class="pa-2 key top-row"> Days held </v-col>
          <v-col class="pa-2 value top-row"> {{ nft.days_held }}</v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="pa-2 key bottom-row"> Bought At </v-col>
          <v-col class="pa-2 value bottom-row"> {{ nft.value }}MATIC </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<style scoped>
.row {
  margin-bottom: 10px;
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
  margin-top: 10px;
}
.bottom-row {
  margin-top: 10px;
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
  props: ["nft", "index", "owner", "connectedAccount"],
  data: () => ({}),
};
</script>
