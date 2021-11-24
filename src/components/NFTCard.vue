<template>
  <!-- <v-card height="350" width="200">
    <v-container>
      
      <v-card-title>Fund 1</v-card-title>
      <v-row>
        <v-column>
          <v-card>
            <v-row> Returns </v-row>
            <v-row> 30% </v-row>
          </v-card>
        </v-column>
        <v-spacer></v-spacer>
        <v-column>
          <v-card>
            <v-row> Items </v-row>
            <v-row> 200 </v-row>
          </v-card>
        </v-column>
      </v-row>
    </v-container>
  </v-card> -->
  <v-container>
    <v-row align="center">
      <v-card width="400">
        <v-img src="../assets/BYAC_2.png" />
      </v-card>
    </v-row>
    <v-row>
      <v-card width="400">
        <v-row id="image-row">
          <v-col class="pa-2 key top-row"> Days held </v-col>
          <v-col class="pa-2 value top-row"> 5D </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="pa-2 key bottom-row"> Bought At </v-col>
          <v-col class="pa-2 value bottom-row"> 0.01ETH </v-col>
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