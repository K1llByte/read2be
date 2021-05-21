<template>
   <div class="mt-6">
      <v-row>
      <v-col
         id="start"
      >
         <v-btn id="button"
            outlined
            color="white"
            class="ml-16"
            large
            @click="register=true;login=false"
         >
            Register
         </v-btn>
         <v-btn id="button"
            outlined
            color="white"
            class="ml-16"
            large
            @click="login=true;register=false"
         >
            Login
         </v-btn>
      </v-col>

      <v-col id="aux">
         <Login v-if="login" class="mt-16"/>
         <Register v-if="register" />
      </v-col>
      </v-row>
   </div>
</template>

<script>
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';

export default {
   data: () => ({
      login: false,
      register: true,
   }),

   components: {
      Login,
      Register,
   }
}
</script>

<style scoped>
   #start {
      background-image: url(../assets/start1.png);
      background-color: #f6eaea;
      background-repeat:no-repeat;
      height:700px;
      width:1250px;
      padding-left:470px;
   }
   #aux {
      height:700px;
      width:350px;
      margin-top:80px;
      margin-bottom:-80px;
      margin-right:130px;
   }
   #button {
      margin-top:390px;
   }
   .col {
      flex-basis: initial;
      flex-grow: 1;
   }
</style>