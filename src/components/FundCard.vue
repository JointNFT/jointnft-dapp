<template>
  <v-card>
    <v-container>
      <v-row align="center">
        <v-img src="../assets/BYAC_2.png" />
      </v-row>

      <v-row>
        <v-card-title>Fund 1</v-card-title>
      </v-row>

      <v-row>
          <v-divider></v-divider>
      </v-row>

      <v-row>
        <v-col class="left-col"> Returns </v-col>
        <v-col class="right-col"> Items </v-col>
      </v-row>

      <v-row>
        <v-col class="left-col"> 30% </v-col>
        <v-col class="right-col"> 200 </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
.right-col {
  text-align: right;
}

.left-col {
  text-align: left;
}
</style>