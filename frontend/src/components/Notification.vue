<template>
   <!-- <div> -->
      <v-card v-if="!this.done" color="#f9f2f2" class="mx-auto w3-hover-pale-red" width="100%" height="65">
         <v-container>
            <v-row>
               <v-col
                  md="3"
               >
                  <v-avatar color="teal" size=40 alt="Hello">
                     <span class="white--text headline">?</span>
                  </v-avatar>
               </v-col>

               <v-divider vertical></v-divider>

               <v-col
                  md="5"
                  class="ml-5 mr-n6 d-flex flex-column justify-center"
               >
                  <router-link :to="`/users/${info.username}`" exact reload><p class="blue--text">{{info.username}}<br></p></router-link>
                  
                  <p class="grey--text mt-n4 mx-n1" v-if="info.nickname">{{info.nickname}}</p>
               </v-col>
               <v-col
                  md="4"
                  class="mt-n1 mr-n2 d-flex flex-column align-end"
               >
                  <v-btn
                     color="teal"
                     x-small
                     icon
                     min-width="15"
                     width="16"
                     height="26"
                     @click="accept('true')"
                  >
                     <v-icon>
                        mdi-check
                     </v-icon>
                  </v-btn>
                  <v-btn
                     color="red"
                     x-small
                     icon
                     min-width="15"
                     width="16"
                     height="26"
                     @click="accept('false')"
                  >
                     <v-icon>
                        mdi-close
                     </v-icon>
                  </v-btn>
               </v-col>
            </v-row>
         </v-container>
      </v-card>
   
      <!-- Snackbar for alerts -->
      <!-- <v-snackbar
         v-model="snackbar"
         timeout="2500"
         color="#221D45"
         right
         class="ml-10"
      >
         <strong>{{ text }}</strong>

         <template v-slot:action="{ attrs }">
         <v-btn
            color="#f7a8a8"
            text
            v-bind="attrs"
            @click="snackbar = false"
         >
            Close
         </v-btn>
         </template>
      </v-snackbar> -->
   <!-- </div> -->
</template>

<script>
import axios from 'axios';

export default {
   name: 'Notification',

   props: ["info"],

   data: () => ({
      done: false,
		// snackbar: false,
		// text: '',
   }),

   methods: {
      accept: function(accepted) {
         var form = {
            accept: accepted
         };
         axios
            .patch('/read2be/api/users/' + this.$cookies.get('user') + '/requests/' + this.info.user_id, form, this.$cookies.get('options'))
            .then(res => {
               console.log(res);
               // if (accepted) {
               //    this.text = 'Accepted friend request!';
               //    this.snackbar = true;
               // }
               // else {
               //    this.text = 'Declined friend request!';
               //    this.snackbar = true;
               // }
               this.done = true;
               this.$forceUpdate();
            })
            .catch(e => {
               if (e.response.status == 400) {
                  this.text = 'No pending request for this user!';
                  this.snackbar = true;
               } else if (e.response.status == 401) {
                  this.text = 'Forbidden!';
                  this.snackbar = true;
               } else {
                  console.log('Erro na resposta ao friend request: ' + e);
               }
            });
      },
   }
}
</script>

<style scoped>
   .v-divider--vertical {
      max-height: 65px !important;
      margin-left: 5px !important;
   }
</style>