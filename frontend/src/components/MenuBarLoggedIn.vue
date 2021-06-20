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
            :nudge-width="340"
            :nudge-bottom="20"
            :nudge-left="15"
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

            <!-- Notifications List -->
            <v-list v-if="user.pending.length">
               <v-list-item
                  v-for="u in user.pending"
                  class="pt-2 mb-2"
                  :key="u.user_id"
               >
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
            <v-list-item
               class="d-flex justify-center ml-4 mt-2"
            >
               <v-hover v-slot="{ hover }">
                  <v-list-item-avatar
                     size=80
                     id="clickable"
                     @click="goTo(`/users/${user.username}`)"
                  >
                        <v-card
                           height="80px"
                           width="80px"
                           :class="hover ? 'aux rounded-circle' : 'rounded-circle'"
                        >
                           <v-img
                              v-if="user"
                              :src=user.avatar_url
                           ></v-img>
                        </v-card>
                  </v-list-item-avatar>
               </v-hover>
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
                  <strong><p style="font-size: 16px;"> Home</p></strong>
               </v-list-item>

               <v-list-item link class="d-flex justify-center" @click="goTo('/authors')">
                  <strong><p style="font-size: 16px;"> Authors</p></strong>
               </v-list-item>

               <v-list-item link class="d-flex justify-center" @click="goTo('/books')">
                  <strong><p style="font-size: 16px;"> Books</p></strong>
               </v-list-item>

               <v-list-item v-if="user.role == 128" link class="d-flex justify-center" @click="goTo('/users')">
                  <strong><p style="font-size: 16px;"> Users</p></strong>
               </v-list-item>

               <v-list-item link class="d-flex justify-center" @click="goTo('/genres')">
                  <strong><p style="font-size: 16px;"> Genres</p></strong>
               </v-list-item>

               <v-list-item link class="d-flex justify-center" @click="goTo('/friends')">
                  <strong><p style="font-size: 16px;"> Friends</p></strong>
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
	
      <!-- Snackbar for alerts -->
      <v-snackbar
         v-model="snackbar"
         timeout="2500"
         color="#221D45"
         right
         class="mb-16 mr-5"
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
      </v-snackbar>
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
		snackbar: false,
		text: '',
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
            .post('/read2be/api/logout', {} , this.$cookies.get('options'))
            .then(res => {
               console.log(res);
               this.$logout();
            })
            .catch(e => {
               console.log('Erro no logout do user: ' + e);
            });
      },
   },

   created: function() {
      axios
         .get('/read2be/api/users/' + this.$cookies.get('user'), this.$cookies.get('options'))
         .then(res => {
            this.user = res.data;
            this.pending = this.user.pending;
            this.messages = this.user.pending.length;
         })
         .catch(e => {
            if (e.response.status == 400) {
               this.text = 'Error: Not Logged Out';
               this.snackbar = true;
				} else if (e.response.status == 401) {
               this.text = 'Token Already Revoked';
               this.snackbar = true;
				} else {
               console.log('Erro no GET da info do user (MenuBar): ' + e);
            }
         });
   },

   
};
</script>

<style scoped>
   .aux {
      opacity: 0.6;
   }
   #clickable:hover {
      cursor: pointer;
   }
</style>