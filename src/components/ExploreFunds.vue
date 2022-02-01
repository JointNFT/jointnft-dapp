<template>
  <v-app id="inspire">
    <v-main v-if="account">
      <v-container v-if="nftFunds != {}">
        <v-row>
          <v-col v-for="(collection, contractId) in collectionList" :key="collection.contractId" cols="4">
            <FundCard :collection="collection" />
          </v-col>
          {{ getTest() }}
        </v-row>
      </v-container>
      <v-container v-else style="text-align:center;">
        Loading avaible funds. 
      </v-container>
    </v-main>
    <v-main v-else style="text-align:center;">
      Connect to metamask wallet. The button is in the top right of the page !
    </v-main>
  </v-app>
</template>


<style scoped>

</style>

<script>
import FundCard from "./FundCard.vue";
import { mapState } from "vuex";

export default {
  components: {
    FundCard,
  },
  computed: mapState(["nftFunds", "account","collectionList"]),
  watch: {
    nftFunds: {
      deep: true,
      handler() {
        console.log("nftFunds changed");
      },
    },
  },
  methods: {
    getTest() {
      return process.env.TEST;
    }
  },
  mounted(){
    this.$store.dispatch("loadCollections");
  },
 
};
</script>
