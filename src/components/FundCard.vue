<template>
<a :href="`/Funds?contractId=${collection.contractId}`">
  <v-card width = "500">
    
      <v-container>
        <v-row align="center">
          <v-img :src="getImg" height="300" width="auto">
            <span class="sym">${{ collection.symbol }}</span>
<<<<<<< HEAD
            <v-btn small class= "chain"  elevation="2" fab>
              <!-- hardcoded for now, need to check blockchain before chosing image, switch case?-->
              <img width = "28" style="border-radius: 29;" src="./assets/ethereum.png"/> 
=======
            <v-btn small class= "chain" elevation="2" fab>
              <v-img width = "20" style="border-radius: 29px;" src="./assets/ethereum.png"/> 
>>>>>>> 5e4e27f (Changes to fetch data from db)
            </v-btn>
          </v-img>

        </v-row>

        <v-row elevation="5">
          <v-card-title>{{ collection.name }}</v-card-title>
          <v-btn v-if="collection.verified" v-show = "true" x-small elevation="2" fab class="logo">
              <img width = "24" style="border-radius: 25;" src="./assets/verified.png"/> 
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
.next-l  { right: 0%; position: relative; text-align: center;}

.npdg {
    position: relative;
    top: -37px;
}
.logo {
  position: absolute;
   top: 68%;
   right: 8%;
}

.sym {
   font-weight: bold;
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
