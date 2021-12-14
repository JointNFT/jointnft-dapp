<template>
  <v-container>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark style="margin-top: 50px;" v-bind="attrs" v-on="on">
            Recommend Collections !
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Enter Recommendations</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-text-field v-model="twitterHandle" label="Enter your twitter handle" required></v-text-field>
              </v-row>
              <v-row>
                Please Enter Project's Twitter Handle (upto 3)
              </v-row>
              <v-row>
                <v-text-field v-model="nftCollection1" label="Collection 1" required></v-text-field>
              </v-row>
              <v-row>
                <v-text-field v-model="nftCollection2" label="Collection 2" required></v-text-field>
              </v-row>
              <v-row>
                <v-text-field v-model="nftCollection3" label="Collection 3" required></v-text-field>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="submitNFTCollection()">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="getEntryList" :items-per-page="10" class="elevation-1">
          <template #item.handle="{ item }">
            <a target="_blank" :href="`https://twitter.com/${item.handle}`">
              {{ item.handle }}
            </a>
          </template>
          <template #item.percentageVotes="{ item }"> {{ parseInt(item.percentageVotes * 100) }}% </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    headers: [
      {
        text: "Twitter handles to NFT collections",
        align: "start",
        sortable: false,
        value: "handle",
      },
      { text: "Votes", value: "percentageVotes", sortable: true },
    ],
    dialog: false,
    twitterHandle: "",
    nftCollection1: "",
    nftCollection2: "",
    nftCollection3: "",
  }),
  computed: {
    getEntryList() {
      var nftCollectionList = this.$store.state.nftCollectionList;
      return nftCollectionList.filter((nftCollection) => {
        return nftCollection.handle != "null" && nftCollection != "";
      });
    },
  },
  methods: {
    fetchNFTCollectionList() {
      this.$store.dispatch("fetchNFTCollectionList");
    },
    submitNFTCollection() {
      if (this.twitterHandle == "" || (this.nftCollection1 == "" && this.nftCollection2 == "" && this.nftCollection3 == "")) {
        this.$vToastify.error("Please enter atleast one collection and your twitter handle !", "Error! ");
        return;
      }
      this.$store
        .dispatch("postNFTCollections", {
          twitterHandle: this.twitterHandle,
          nftCollection1: this.nftCollection1,
          nftCollection2: this.nftCollection2,
          nftCollection3: this.nftCollection3,
        })
        .then((res) => {
          console.log(res);
          if (res.error) {
            this.$vToastify.error(res.message, "Error! ");
            return;
          }
          this.dialog = false;
          this.$vToastify.success("Collections submitted, will be updated to the leaderboard !");
        });
    },
    login() {
      this.$store.dispatch("login");
    },

    logOut() {
      this.$store.dispatch("logOut");
    },
  },
  mounted() {
    this.$nextTick(async () => {
      this.fetchNFTCollectionList();
    });
  },
};
</script>
