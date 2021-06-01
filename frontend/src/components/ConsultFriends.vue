<template>   
   <v-card class="mx-auto mt-12" color="rgb(255, 0, 0, 0.2)"  width="1300px">
      <v-row
         class="d-flex justify-space-around"
      >
         <v-col
            v-for="f in friends"
            :key="f.username"
            cols="1"
            class="my-3"
            @click="goUser(f.username)"
         >

            <v-hover v-slot="{ hover }">
               <v-card
                  height="80px"
                  width="80px"
                  :class="hover ? 'aux on-hover rounded-circle' : 'aux rounded-circle'"
               >
                  <v-avatar
                     size="80"
                  >
                     <img
                        :src=f.avatar_url
                     >
                  </v-avatar>
               </v-card>
            </v-hover>
            <p class="mt-3 mb-n1" style="color: white;font-size: 16;"><strong>{{f.username}}</strong></p>
         </v-col>
      </v-row>
   </v-card>
</template>

<script>
// import axios from 'axios'

export default {
   name: 'Friends',

   props: ["friends"],

   methods: {
      goUser: function(name){
         this.$goTo('/users/' + name);
      }
   }
}
</script>

<style scoped>
   .v-overlay {
      height: 80px;
      width: 80px;
   }
   .aux:not(.on-hover) {
      opacity: 0.7;
   }
</style>