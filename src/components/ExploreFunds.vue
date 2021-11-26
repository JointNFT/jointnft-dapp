<template>
  <v-app id="inspire">
    <v-main>
      <v-container>
        <v-row>
          <v-col
            v-for="(fund, address) in getFunds"
            :key="fund.address"
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

export default {
  components: {
    FundCard,
  },
  computed: {
    getFunds() {
      console.log(this.$store.state.nftFunds);
      return this.$store.state.nftFunds;
    },
  },
};
</script>