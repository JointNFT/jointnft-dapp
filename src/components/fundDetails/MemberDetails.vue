<template>
    <v-container>
       <v-card style="background-color: Lavender">
           <v-card-title>
               <v-row>
                   <v-col class="left-col" align="center"> Members </v-col>
                   <v-col class="right-col" align="center"> Amt. Invested </v-col>
               </v-row>
           </v-card-title>
           <v-card-text style="font-family: PT Sans Caption ; font-weight:bold; ">
               <v-row v-for="details in getMemberDetails" :key="details.address" >
                   <v-col class="left-col" align="center"> {{ details.address.substring(0,8) + "..." }}</v-col>
                   <v-col class="right-col" align="center"> {{ details.value }}</v-col>
               </v-row>
               
           </v-card-text>    
       </v-card>
   </v-container>
</template>

<script>
export default {
    data: ()=>({
        getMemberDetails:
       [
               {address: "0xe95C4707Ecf588dfd8ab3b253e00f45339aC3054",  value: 50},
               {address: "0xe95C4707Ecf588dfd8ab3b253e00f45339aC3054",  value: 50},
               {address: "0xe95C4707Ecf588dfd8ab3b253e00f45339aC3054",  value: 50},
               {address: "0xe95C4707Ecf588dfd8ab3b253e00f45339aC3054",  value: 50},
             ],
    }),

};
</script>