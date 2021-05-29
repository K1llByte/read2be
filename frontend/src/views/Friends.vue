<template>
   <div class="w3-container">
      <h1 class="armwrestler x-large dark my-5">My Friends</h1>

      <v-card class="mx-auto mt-12" color="rgb(255, 0, 0, 0.2)"  width="1200px">
         <v-row
            class="ml-5"
         >
            <v-col
               v-for="f in friends"
               :key="f.username"
               cols="1"
               class="ma-3"
            >
               <v-avatar
                  @click="goUser(f.username)"
                  class="w3-hover-pale-red"
                  size="80"
               >
                  <img
                     :src=f.avatar_url
                  >
               </v-avatar>
               <p class="mt-3 mb-n1"><strong>{{f.username}}</strong></p>
            </v-col>
         </v-row>
      </v-card>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Friends',
    
    data: function() {
        return {
            friends: null,
        };
    },

    created: function() {

        // get authors
        axios
            .get('/read2be/api/users/' + this.$user, this.$getOptions())
            .then(res => {
                this.friends = res.data.friends;
            })
            .catch(e => console.log('Erro no GET dos authors: ' + e))
    },

    methods: {
        goUser: function(name){
            this.$goTo('/users/' + name);
        }
    }
}
</script>