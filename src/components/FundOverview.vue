<template>
    <v-row>
      <v-col cols="12" sm="6" md="8">
        <v-row no-gutters >
          <h1
          >
            Fund #1 </h1
          >
          <v-spacer></v-spacer>
          <v-btn
            href="https://github.com/vuetifyjs/vuetify/releases/latest"
            target="_blank"
            text="Whitepaper"
            color="#6733e2"
          >
            Create </v-btn
          ><v-btn
            href="https://github.com/vuetifyjs/vuetify/releases/latest"
            target="_blank"
            text="Whitepaper"
            color="#6733e2"
          >
            Create
          </v-btn>
        </v-row>
        <v-divider id="divider"></v-divider>
        <v-row>
          <v-col v-for="n in 12" :key="n" cols="4">
            <NFTCard />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" md="4" >
        
        <BidNFTs />
      </v-col>
    </v-row>
</template>

<style scoped>
#divider {
  padding-bottom: 20px;
}
</style>

<script>
import FundCard from "./FundCard.vue";
import NFTCard from "./NFTCard.vue";
import BidNFTs from "./BidNFTs.vue";

export default {
  components: {
    BidNFTs,
    NFTCard,
  },
};
</script>