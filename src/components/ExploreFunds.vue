<template>
  <v-app id="inspire">
    <v-main v-if="account">
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
    <v-main v-else style="text-align:center;">
      Connect to metamask wallet. The button is in the top right of the page !
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
  computed: mapState(["nftFunds","account"]),
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
