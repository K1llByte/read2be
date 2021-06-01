<template>
   <div>
      <h1 class="armwrestler x-large dark my-5">My Friends</h1>
      <ConsultFriends :friends="friends" />
   </div>
</template>


<script>
import axios from "axios";
import ConsultFriends from "@/components/ConsultFriends.vue";

export default {
    
   name: 'Friends',

   components: {
      ConsultFriends,
   },

   data() {
      return {
         friends: [],
      };
   },

   created: function() {

      // get author's books' name and image
      axios
         .get('/read2be/api/users/' + this.$user, this.$getOptions())
         .then(res => {
            this.friends = res.data.friends;
         })
         .catch(e => console.log('Erro no GET dos friends do user: ' + e));
   },

}
</script>