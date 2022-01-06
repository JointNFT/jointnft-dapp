<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">Auction Options</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Which auction would you like to end ? </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col><v-text-field
                  v-model="auctionId"
                  :rules="[numberRule]"
                  label="Enter the auction ID to end"
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
          <v-btn color="blue darken-1" text @click="enableAuction()"> Enable Auction </v-btn>
          <v-btn color="blue darken-1" text @click="endAuction()"> End Auction </v-btn>
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
  props: ["index", "owner", "token_id", "token_address"],
  data: () => ({
    dialog: false,
    auctionId: "",
    numberRule: (v) => {
      if (v != null && v != "" && !v.trim()) return true;
      if (!isNaN(parseFloat(v)) && v >= 0 ) return true;
      return "Number has to be between 0 and infinity";
    },
  }),

  methods: {
    async endAuction() {
      const fundAddress = this.$route.query.contractId;
      this.$store.dispatch("endZoraAuction", {
        auctionId: this.auctionId
      }).then(() => {
          this.dialog = false;
          this.$vToastify.success("Successfully ended the auction !");
      });
    },
    async enableAuction() {
      this.$store.dispatch("enableAuction", {auctionId: this.auctionId})
    }
  },
};
</script>
