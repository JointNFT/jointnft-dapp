<template>
<a :href="`/Funds?contractId=${collection.contractId}`">
  <v-card>
    
      <v-container>
        <v-row align="center">
          <v-img :src="getImg" height="80%">
            <span class="sym">${{ collection.symbol }}</span>
            <v-btn small class= "chain" elevation="2" fab>
              <v-img width = "20" style="border-radius=20px;" src="./assets/ethereum.png"/> 
            </v-btn>
          </v-img>

        </v-row>

        <v-row class="justify-center">
          <v-card-title>{{ collection.name }}</v-card-title>
          <v-btn x-small elevation="2" fab>
              <!-- <v-img src="./assets/ethereum.png"/>  -->
            </v-btn>
        </v-row>

        <v-row>
          <v-divider></v-divider>
        </v-row>

        <v-row>
          <v-col class="next-r"> Price </v-col>
          <v-col class="next-r"> Member </v-col>
          <v-col class="next-r"> Items </v-col>
          <v-col class="next-r"> Est. Value </v-col>
        </v-row>

        <v-row>
          <v-col class="next-r"> {{ collection.price }} </v-col>
          <v-col class="next-r"> {{ collection.members }} </v-col>
          <v-col class="next-r"> {{ collection.items }} </v-col>
          <v-col class="next-r"> {{ collection.est_value.currency + collection.est_value.amount }} </v-col>
        </v-row>
      </v-container>
    
  </v-card>
  </a>
</template>

<style scoped>
.next-r  { left: 0%; position: relative; text-align: center;}

.logo {

}
.sym {
   position: absolute;
   top: 8%;
   right: 4%;
}
.chain {
   position: absolute;
   top: 5%;
   left: 5%;
}

.right-col {
  text-align: center;
}

.left-col {
  text-align: center;
}
</style>

<script>
export default {
  props: { collection: Object },
  computed: {
    getImg() {
      return this.$props.collection.image_url;
    },
  },
};
</script>
