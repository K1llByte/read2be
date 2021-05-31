<template>
   <div>
      <!-- Teal App Bar -->
      <v-app-bar
         color="teal lighten-1"
         app
         dark
      >
         <!-- Navigation Drawer Icon -->
         <v-app-bar-nav-icon
            class="ml-n2"
            large
            color="#fff7f6"
            @click.stop="drawer=!drawer"
         ></v-app-bar-nav-icon>

         <v-spacer></v-spacer>

         <!-- Today's Date -->
         <div>
            <h2 class="armwrestler">{{currentDateFormatted()}}</h2>
         </div>
         
         <v-spacer></v-spacer>

         <!-- Notifications button/menu -->
         <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="220"
            :nudge-bottom="20"
            offset-x
            offset-y
            bottom
            left
         >
            <template v-slot:activator="{ on, attrs }">
               <v-btn
                  dark
                  icon
                  right
                  v-bind="attrs"
                  v-on="on"
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
            </template>

            <v-list
               v-if="user.pending.length"
            >
               <v-list-item
                  v-for="u in user.pending"
                  class="pt-2 mb-2"
                  :key="u"
               >
                  <!-- <Notification :idu=u /> -->

                  <Notification :info="u" />

               </v-list-item>
            </v-list>
            <v-list v-else>
               <p class="armwrestler cadet">Nothing new...</p>
            </v-list>
         </v-menu>
         
      </v-app-bar>

      <!-- Navigation Drawer -->
      <v-navigation-drawer
         v-model="drawer"
         dark
         src="../assets/bg.png"
         app
         left
         temporary
      >

         <!-- User Basic Info -->
         <v-list>
            <v-list-item class="d-flex justify-center mt-2">
               <v-list-item-avatar
                  size=80
               >
                  <v-img v-if="user" :src=user.avatar_url></v-img>
               </v-list-item-avatar>
            </v-list-item>

            <v-list-item class="mt-n1 mb-n3">
               <v-list-item-content>
                  <v-list-item-title v-if="user" class="title">
                     {{user.username}}
                  </v-list-item-title>

                  <p v-else> Loading...</p>
                  
                  <v-list-item-subtitle v-if="user">
                     {{user.email}}
                  </v-list-item-subtitle>
               </v-list-item-content>
            </v-list-item>
         </v-list>

         <v-divider></v-divider>

         <!-- Menu Buttons -->
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

         <!-- Menu Bottom Buttons -->
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
import Notification from "@/components/Notification.vue"

export default {
   name: 'MenuBarLoggedIn',

   data: () => ({
      drawer: false,
      pending: null,
      messages: 0,
      user: null,
      items: [
         { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
      menu: false,
   }),

   components: {
      Notification,
   },

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
               console.log('Erro no logout do user: ' + e);
            });
      },
   },

   created: function() {
      axios
         .get('/read2be/api/users/' + this.$user, this.$getOptions())
         .then(res => {
            this.user = res.data;
            this.pending = this.user.pending;
            this.messages = this.user.pending.length;
         })
         .catch(e => {
            if (e.response.status == 400) {
					alert("Error: Not Logged Out");
				} else if (e.response.status == 401) {
					alert("Token Already Revoked");
				} else {
               console.log('Erro no GET da info do user (MenuBar): ' + e);
            }
         });
   },

   
};
</script>