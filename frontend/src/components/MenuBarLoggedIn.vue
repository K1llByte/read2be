<template>
   <div>
      <v-app-bar
         color="teal lighten-1"
         app
         dark
      >
         <v-app-bar-nav-icon
            class="ml-n2"
            large
            color="#fff7f6"
            @click.stop="drawer = !drawer"
         ></v-app-bar-nav-icon>

         <v-spacer></v-spacer>

         <div>
            <h2 class="armwrestler">{{currentDateFormatted()}}</h2>
         </div>
         
         <v-spacer></v-spacer>

         <v-btn
            icon right
            class="mr-n2"
            @click="messages=0"
         >
            <v-badge
               :value="messages"
               color="red lighten-3"
               dot
               left
            >
               <v-icon
                  large
                  color="#fff7f6"
               >
                  mdi-bell-outline
               </v-icon>
            </v-badge>
         </v-btn>
      </v-app-bar>

      <v-navigation-drawer
         v-model="drawer"
         dark
         src="../assets/bg.png"
         app
         left
         temporary
      >
         <v-list>
            <v-list-item class="d-flex justify-center mt-2">
               <v-list-item-avatar
                  size=80
               >
                  <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
               </v-list-item-avatar>
            </v-list-item>

            <v-list-item class="mt-n1 mb-n3">
               <v-list-item-content>
                  <v-list-item-title class="title">
                     Sandra Adams
                  </v-list-item-title>
                  <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
               </v-list-item-content>
            </v-list-item>

         </v-list>

         <v-divider></v-divider>

         <v-list
            nav
         >
            <v-list-item-group>
               <v-list-item link class="d-flex justify-center" @click="goTo('/home')">
                  <strong>Home</strong>
               </v-list-item>

               <v-list-item link class="d-flex justify-center" @click="goTo('/authors')">
                  <strong>Authors</strong>
               </v-list-item>

               <v-list-item link class="d-flex justify-center" @click="goTo('/books')">
                  <strong>Books</strong>
               </v-list-item>

               <v-list-item link class="d-flex justify-center" @click="goTo('/users')">
                  <strong>Users</strong>
               </v-list-item>

               <v-list-item link class="d-flex justify-center" @click="goTo('/reviews')">
                  <strong>Reviews</strong>
               </v-list-item>

               <v-list-item link class="d-flex justify-center" @click="goTo('/friends')">
                  <strong>Friends</strong>
               </v-list-item>

            </v-list-item-group>
         </v-list>
         <template v-slot:append>
            <div>
               <v-btn
                  block
                  class="px-3 red accent-1"
                  height=50
                  @click="goTo('/account')"
               >
                  My Account
               </v-btn>
            </div>
            <div>
               <v-btn
                  block
                  class="px-3 red lighten-2"
                  height=52
                  @click="logout"
               >
                  <strong>Logout</strong>
               </v-btn>
            </div>
         </template>
      </v-navigation-drawer>
   </div>
</template>

<script>
import axios from 'axios'

export default {
   name: 'MenuBar',

   data: () => ({
      drawer: false,
      messages: 1,
   }),

   methods: {
      currentDateFormatted: function() {
         var date = new Date();
         var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
         
         return monthNames[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear();
      },
      goTo: function(route) {
         this.$goTo(route);
      },
      logout: function() {
         axios
            .post('/read2be/api/logout', {} , this.$getOptions())
            .then(this.$logout())
            .catch(e => {
               console.log('Erro no login do user: ' + e);
            });
      }
   }

};
</script>