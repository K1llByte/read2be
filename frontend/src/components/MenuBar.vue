<template>
   <div>
      <v-app-bar
         color="teal lighten-1"
         app
         dark
      >
         <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

         <v-spacer></v-spacer>

         <h3>{{currentDateFormatted()}}</h3>
         
         <v-spacer></v-spacer>

         <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
         </v-btn>
      </v-app-bar>

      <v-navigation-drawer
         v-model="drawer"
         app
         left
         temporary
      >
         <v-list
            nav
         >
            <v-list-item-group>
               <v-list-item @click="goTo('/')">
                  Home
               </v-list-item>

               <v-list-item @click="goTo('/authors')">
                  Authors
               </v-list-item>

               <v-list-item @click="goTo('/books')">
                  Books
               </v-list-item>

               <v-list-item @click="goTo('/users')">
                  Users
               </v-list-item>

            </v-list-item-group>
         </v-list>
      </v-navigation-drawer>
   </div>
</template>

<script>
export default {
   name: 'MenuBar',

   data: () => ({
      drawer: false,
   }),

   methods: {
      currentDateFormatted: function() {
         var date = new Date();
         var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
         
         return monthNames[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear();
      },

      goTo: function(route){
         this.$router.push(route);
      }
   }

};
</script>

