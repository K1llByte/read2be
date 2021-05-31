// {
//    "user_id": "609a4be18395e31ec50f0778",
//    "username": "a83840",
//    "nickname": "Maria Silva",
//    "avatar_url": ""
// },
//template @click="goTo('/users/' + info.username)">

<template>
   <v-card color="#f9f2f2" class="mx-auto w3-hover-pale-red" width="100%" height="65">
      <v-container>
         <v-row>
            <v-col
               cols="6"
               md="4"
            >
               <v-avatar color="teal" size=40 alt="Hello">
                  <span class="white--text headline">?</span>
               </v-avatar>
            </v-col>

            <v-divider vertical></v-divider>
            
            <v-col
               cols="12"
               sm="6"
               md="8"
            >
               <strong v-if="info.nickname">{{info.nickname}}</strong>
               <strong class="grey--text" v-else>[No name]</strong>
               
               <router-link :to="`/users/${info.username}`" exact reload><p class="blue--text">{{info.username}}</p></router-link>
            </v-col>
         </v-row>
      </v-container>
   </v-card>
</template>

<script>
export default {
   name: 'Notification',

   props: ["info"],
}
</script>

<style scoped>
   .v-divider--vertical {
      max-height: 65px !important
   }
</style>