<template>
  <v-app id="inspire">
    <v-main>
      <v-container>
        <v-row>
          <v-col v-for="n in 12" :key="n" cols="3"> <FundCard /> </v-col>
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
};
</script>