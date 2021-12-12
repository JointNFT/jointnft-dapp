<template>
  <v-container>
    <v-row justify="center" style="text-align:center; margin-top:25px;">
      <CreateNewVote />
    </v-row>
    <v-row class="flex-nowrap" style="margin-top:50px;" v-for="index in getPosts.length" :key="index" cols="4">
      <Post :postIndex="index - 1" />
    </v-row>
  </v-container>
</template>

<script>
import CreateNewVote from "./voting/CreateNewVote.vue";
import Post from "./voting/Post.vue";

export default {
  data: () => ({
    dialog: false,
  }),
  components: {
    CreateNewVote,
    Post,
  },
  computed: {
    getPosts() {
      console.log(this.$store.state.postList);
      if (this.$route.query.contractId in this.$store.state.postList) {
        console.log(this.$store.state.postList[this.$route.query.contractId]);
        return this.$store.state.postList[this.$route.query.contractId];
      }
      return [];
    },
    
  },
};
</script>
