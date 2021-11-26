<template>
  <v-container>
    <v-row align="center">
      <v-card width="400">
        <v-img :src="require('../assets/' + nft.img)" />
      </v-card>
    </v-row>
    <v-row>
      <v-card width="400">
        <v-row id="image-row">
          <v-col class="pa-2 key top-row"> Days held </v-col>
          <v-col class="pa-2 value top-row"> {{nft.days_held}} </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="pa-2 key bottom-row"> Bought At </v-col>
          <v-col class="pa-2 value bottom-row"> {{nft.bought_at}}ETH </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<style scoped>
  .row {
    margin-bottom:10px;
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
</style>

<script>

export default {
  props: ['nft'],
  data:() => ({}),
  
}
</script>
