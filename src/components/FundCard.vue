<template>
  <a :href="`/Funds?contractId=${collection.contract_id}&collectionId=${collection.collection_id}`">
    <v-card width="400">
      <v-container>
        <v-row align="center">
          <v-img :src="getImg" height="300" width="auto">
            <span class="sym">${{ collection.symbol }}</span>
            <v-btn small class="chain" elevation="2" fab>
              <!-- hardcoded for now, need to check blockchain before chosing image, switch case?-->
              <img width="50" style="border-radius: 25px;" :src="getImgUrl()" />
            </v-btn>
          </v-img>
        </v-row>

        <v-row elevation="5" justify="center">
          <v-card-title>{{ collection.name }}</v-card-title>
          <v-btn v-if="collection.verified" v-show="true" x-small elevation="2" fab class="logo">
            <img width="24" style="border-radius: 25;" src="./assets/verified.png" />
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
          <v-col class="next-r"> {{ collection.price.amount }} {{ collection.price.type }} </v-col>
          <v-col class="next-r"> {{ collection.members }} </v-col>
          <v-col class="next-r"> {{ collection.items }} </v-col>
          <v-col class="next-r"> {{ collection.est_value.currency + collection.est_value.amount }} </v-col>
        </v-row>
      </v-container>
    </v-card>
  </a>
</template>

<style scoped>
.next-r {
  left: 0%;
  position: relative;
  text-align: center;
}
.next-l {
  right: 0%;
  position: relative;
  text-align: center;
}

.npdg {
  position: relative;
  top: -37px;
}
.logo {
  position: relative;
  top: 13px;
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
import constants from "../const.js";

export default {
  props: { collection: Object },
  computed: {
    getImg() {
      return this.$props.collection.image_url;
    },
  },
  methods: {
    getImgUrl() {
      //return require("./assets/" + constants.ICONS[this.$props.collection.chain]);
      return require("./assets/" + constants[this.$props.collection.chain].ICONS);
    },
  },
};
</script>
