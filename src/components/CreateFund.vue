<template>
  <v-container width="500">
    <v-form @submit.prevent="submit">
      <v-row> Create Fund </v-row>
      <v-row align="center">
        <v-card>
          <v-img src="../assets/ProfilePic.png"></v-img>
          <v-card-title>Profile Pic</v-card-title>
        </v-card>
      </v-row>
      <v-row align="center">
        <v-text-field
          v-model="FundName"
          label="Fund Name"
          required
        ></v-text-field>
      </v-row>
      <v-row align="center">
        <v-text-field
          v-model="FundDesc"
          label="Fund Desc"
          required
        ></v-text-field>
      </v-row>
      <v-row align="center">
        <v-text-field
          v-model="TwitterHandle"
          label="Twitter Handle"
          required
        ></v-text-field>
      </v-row>
      <v-row align="center">
        <v-text-field
          v-model="DepositAmt"
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
       submit(t) {
          console.log('form submitted')
          console.log(this.FundName)
          this.$store.commit('addFund',{
              name: 'Fund3',
              img_url: 'BYAC_2.png',
              address: '4321'
          })
          console.log(this.$store.state.nftFunds)
       }
   },
   data: () => ({
      FundName: '',
      FundDesc: '',
      TwitterHandle: '',
      DepositAmt: '',
    })

};
</script>
