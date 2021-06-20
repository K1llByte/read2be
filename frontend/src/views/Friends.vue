<template>
   <div>
      <h1 class="armwrestler x-large dark my-5">My Friends</h1>

      <!-- Search user -->
      <SearchUser />
      
      <!-- List of friends -->
      <ConsultFriends v-if="friends.length" :friends="friends" />
      <v-card v-else class="mx-auto mt-8 py-16" color="rgb(255, 0, 0, 0.2)"  width="1300px"  height="180px">
         <p class="armwrestler main-color">You have no friends yet</p>
      </v-card>
   </div>
</template>


<script>
import axios from "axios";
import ConsultFriends from "@/components/ConsultFriends.vue";
import SearchUser from "@/components/SearchUser.vue";

export default {
    
   name: 'Friends',

   components: {
      ConsultFriends,
      SearchUser,
   },

   data() {
      return {
         friends: [],
      };
   },

   created: function() {

      // get user's friends
      axios
         .get('/read2be/api/users/' + this.$cookies.get('user'), this.$cookies.get('options'))
         .then(res => {
            this.friends = res.data.friends;
         })
         .catch(e => console.log('Erro no GET dos friends do user: ' + e));
   },

}
</script>