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
          label="Image Url ( URL should point to an image )"
          required
        ></v-text-field>
      </v-row>
      <v-row align="center">
        <v-text-field
          v-model="tokenPrice"
          label="Price of the token(In Wei) 1ETH = 10^18 wei"
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

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}


export default {
  methods: {
    submit() {
      if (
        !(
          this.numberRule(this.tokenPrice) == true &&
          this.numberRule(this.depositAmt) == true &&
          this.fundSymbl != null &&
          this.fundSymbl.length > 0 &&
          this.fundName != null &&
          this.fundName.length > 0
        )
      ) {
        this.$vToastify.error("Please fill the fields properly !", "Error! ");
        return;
      }

      if (parseFloat(this.depositAmt) * 10 ** 18 < this.tokenPrice) {
        this.$vToastify.error(
          "Deposit eth should be a multiple of tokenPrice !",
          "Error! "
        );
        return;
      }

      

      this.$store
        .dispatch("createFund", {
          fundName: this.fundName,
          fundSymbl: this.fundSymbl,
          tokenPrice: this.tokenPrice,
          depositAmt: this.depositAmt,
          imgUrl: this.imgUrl,
        })
        .then(() => {
          this.$vToastify.success("Fund Created!");
          this.$router.push({ path: "/" });
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
      if (!isNaN(parseFloat(v)) && parseFloat(v) > 0) return true;
      return "Input has to be a number";
    },
    symbolRule: (v) => {
      if (v != null && v != "" && v.length < 7) return true;
      return "Token symbol can be at max 6 characters!";
    },
  }),
};
</script>
