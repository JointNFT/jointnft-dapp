<template>
<a :href="`/Funds?contractId=${fund.contractId}`">
  <v-card>
    
      <v-container>
        <v-row align="center">
          <v-img :src="getImg" />
        </v-row>

        <v-row>
          <v-card-title>{{ fund.name }}</v-card-title>
        </v-row>

        <v-row>
          <v-divider></v-divider>
        </v-row>

        <v-row>
          <v-col class="left-col"> Returns </v-col>
          <v-col class="right-col"> Items </v-col>
        </v-row>

        <v-row>
          <v-col class="left-col"> {{ fund.returns }}% </v-col>
          <v-col class="right-col"> {{ fund.nftList.length }} </v-col>
        </v-row>
      </v-container>
    
  </v-card>
  </a>
</template>

<style scoped>
.right-col {
  text-align: right;
}

.left-col {
  text-align: left;
}
</style>

<script>
export default {
  props: { fund: Object },
  computed: {
    getImg() {
      return this.$props.fund.img;
    },
  },
};
</script>
