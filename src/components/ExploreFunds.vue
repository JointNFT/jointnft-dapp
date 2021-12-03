<template>
  <v-app id="inspire">
    <v-main>
      <v-container>
        <v-row>
          <v-col
            v-for="(fund, contractId) in nftFunds"
            :key="fund.contractId"
            cols="3"
          >
            <FundCard :fund="fund" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import FundCard from "./FundCard.vue";
import { mapState } from "vuex";

export default {
  components: {
    FundCard,
  },
  computed: mapState(["nftFunds"]),
  watch: {
    nftFunds: {
      deep: true,
      handler() {
        console.log("nftFunds changed");
      },
    },
  },
};
</script>
