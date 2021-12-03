<template>
  <v-container width="500">
    <v-form @submit.prevent="submit">
      <v-row> Create Fund </v-row>

      <v-row align="center">
        <v-text-field
          v-model="fundName"
          label="Fund Name"
          required
        ></v-text-field>
      </v-row>
      <v-row align="center">
        <v-text-field
          v-model="fundSymbl"
          label="Token Symbol"
          :rules="[symbolRule]"
          required
        ></v-text-field>
      </v-row>
      <v-row align="center">
        <v-text-field
          v-model="imgUrl"
          label="Image Url"
          required
        ></v-text-field>
      </v-row>
      <v-row align="center">
        <v-text-field
          v-model="tokenPrice"
          label="Price of the token"
          :rules="[numberRule]"
          required
        ></v-text-field>
      </v-row>
      <v-row align="center">
        <v-text-field
          v-model="depositAmt"
          :rules="[numberRule]"
          label="Deposit Amount (ETH)"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-btn class="mr-4" type="submit"> submit </v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
export default {
  methods: {
    submit() {
      console.log(this.FundName);
      this.$store
        .dispatch("createFund", {
          fundName: this.fundName,
          fundSymbl: this.fundSymbl,
          tokenPrice: this.tokenPrice,
          depositAmt: this.depositAmt,
          imgUrl: this.imgUrl,
        })
        .then(() => {
          this.$router.redirect("/");
        });
    },
  },
  data: () => ({
    fundName: "",
    fundSymbl: "",
    tokenPrice: "",
    depositAmt: "",
    imgUrl: "",
    numberRule: (v) => {
      if (v != null && v != "" && !v.trim()) return true;
      if (!isNaN(parseFloat(v))) return true;
      return "Input has to be a number";
    },
    symbolRule: (v) => {
      if (v != null && v != "" && v.length < 7) return true;
      return "Token symbol can be at max 6 characters!"
    }
  }),
};
</script>
