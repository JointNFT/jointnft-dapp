<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Create new vote
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">What would you like to vote on ?</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-text-field v-model="PostDesc" label="Text"></v-text-field>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="fetchPosts">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialog= false">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    contractAddress: "",
    dialog: false,
    PostDesc: "",
  }),
  methods: {
    CreatePost() {
      if (this.PostDesc == "") {
        this.$vToastify.error("Please enter a discription to vote on !", "Error! ");
      }
      console.log(this.$route.query.contractId);
      this.$store.dispatch("createPost", { PostDesc: this.PostDesc, fundAddress: this.$route.query.contractId }).then(() => {
        this.$vToastify.success("Post created, you can go ahead and vote now!");
      });
    },
    fetchPosts() {
      this.$store.dispatch("fetchPosts", { fundAddress: this.$route.query.contractId });
    },
  },
  mounted: function() {
        this.fetchPosts() // Calls the method before page loads
    },
};
</script>
