<template>
    <v-container>
        <v-row v-for="entry in getEntryList" :key="entry.twitter_handle">
            <v-col>
            {{entry.user}}
            </v-col>
            <v-col>
            {{entry.nft_1}}
            </v-col>
            <v-col>
            {{entry.nft_2}}
            </v-col>
            <v-col>
            {{entry.nft_3}}
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
    computed: {
        getEntryList() {
            return this.$store.state.entryList;
        }
    },
    methods: {
        fetchAirtableEntries() {
            this.$store.dispatch("fetchAirtableData");
        }
    },
    mounted() {
    this.$nextTick(async () => {
      this.fetchAirtableEntries();
    });
  },
}
    

</script>
