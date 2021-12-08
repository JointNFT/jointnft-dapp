<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            v-bind="attrs"
            v-on="on"
            color="pink"
            dark
            absolute
            bottom
            right
            fab
            ><v-icon>mdi-minus</v-icon></v-btn
          >
        </v-fab-transition>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5"
            >At what price(MATIC) do you want to sell the NFT ? </span
          >
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="sellPrice"
                  :rules="[numberRule]"
                  label="Add sell price (MATIC)"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="sellNFT"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
.row {
  margin-bottom: 10px;
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

<script>
export default {
  props:["index", "owner"],
  data: () => ({
    dialog: false,
    sellPrice: "",
    numberRule: (v) => {
      if (v != null && v != "" && !v.trim()) return true;
      if (!isNaN(parseFloat(v)) && v >= 0 && v <= 999) return true;
      return "Number has to be between 0 and 999";
    },
  }),

  methods: {
    async sellNFT() {
      var fundAddress = this.$route.query.contractId;
      console.log(fundAddress)
      await this.$store.dispatch("sellNFTfromFund", {
        index: this.index,
        sellPrice: this.sellPrice,
        fundAddress: fundAddress,
      }).then(() => {
        this.dialog = false;
        this.$vToastify.success("NFT sold for "+this.sellPrice+" !");
      });
      
    }
  },
};
</script>
