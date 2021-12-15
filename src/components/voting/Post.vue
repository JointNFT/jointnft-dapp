<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-banner single-line>
        {{ getPosts[postIndex].desc }}
        <v-spacer></v-spacer>
        <template v-slot:actions>
          <v-btn text color="primary" v-bind="attrs" v-on="on">
            See Details
          </v-btn>
        </template>
      </v-banner>
    </template>
    <v-card>
      <v-card-title class="text-h5">
        Vote Stats
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              Total Votes casted: {{(parseInt(getPosts[postIndex].totalYesVotes) + parseInt(getPosts[postIndex].totalNoVotes))}}
            </v-col>
            <v-col>
              Votes for the motion: {{parseInt(getPosts[postIndex].totalYesVotes * 100)/(parseInt(getPosts[postIndex].totalYesVotes) + parseInt(getPosts[postIndex].totalNoVotes))}}%
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              You Voted: For the motion
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="placeVote(true ,getPosts[postIndex])">
          Vote For
        </v-btn>
        <v-btn color="green darken-1" text @click="placeVote(false ,getPosts[postIndex])">
          Vote Against
        </v-btn>
        <v-btn color="green darken-1" text @click="dialog = false">
          Reset your votes
        </v-btn>
        <v-btn color="green darken-1" text @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["postIndex"],
  data: () => ({
    dialog: false,
  }),
  computed: {
    getPosts() {
      if (this.$route.query.contractId in this.$store.state.postList) {
        console.log('inside get Posts', this.$store.state.postList[this.$route.query.contractId]);
        return this.$store.state.postList[this.$route.query.contractId];
      }
      return [];
    }
  },
  methods: {
    placeVote(isVotingFor, voteDetails) {
      console.log(voteDetails);
      this.$store.dispatch("placeVote", {isVotingFor, voteAddress: voteDetails.voteAddress, fundAddress: this.$route.query.contractId});
      this.dialog = false;
    },
  }
};
</script>
