<template>
    
  <v-btn text v-if="!$store.state.accounts" class="connect-wallet-btn" color="#6733e2">
    Connect wallet {{$store.state.accounts}}
  </v-btn>
  <v-btn text v-else class="connect-wallet-btn" color="#6733e2">
    {{$store.state.accounts[0]}}
  </v-btn>
  
</template>

<style scoped>
.connect-wallet-btn {
  border: 2px solid #6733e2;
  background-color: white;
}
</style>

<script>
import Web3ModalVue from "web3modal-vue";

export default {
    components: {
        Web3ModalVue
    },
    methods: {
        async connectWallet() {
            await this.$store.dispatch("connectToWallet");
            this.$vToastify.success("Wallet connected !");
        }
    }
};
</script>