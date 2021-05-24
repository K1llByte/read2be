// "user_id":       "string",
// "username":      "string",
// "nickname":      "string",
// "password_hash": "string",
// "email":         "string",
// "role":          "string",
// "avatar_url":    "string",
// "books": [
//    {
//       "isbn":            "string",
//       "status":          "int",
//       "rate":            "int",
//       "date_registered": "string"
//    }
// ],
// "friends":["user_id:string"],
// "pending":["user_id:string"]

<template>
    <div>
      <h1 class="mt-5"><strong>{{user.nickname}}</strong></h1>
      <v-avatar
         size="150"
         color="black"
         class="mb-5"
      >
         <img
            :src=user.avatar_url
            :alt=user.nickname
         >
      </v-avatar>
      <v-card class="main-color mx-auto py-4 mt-5" color="rgb(255, 0, 0, 0.1)"  width="1000px">
         <div class="main-color">
            <v-form
               ref="form"
               class="mb-2 "
               v-model="valid"
               lazy-validation
            >
               <!-- Change username -->
               <v-row>
                  <v-col>
                     <h2 class="d-flex justify-end mr-3"><strong>Username: {{user.username}}</strong></h2>
                  </v-col>
                  <v-col>
                     <v-text-field
                        class="aux"
                        v-model="username"
                        :counter="20"
                        :rules="nameRules"
                        label="Username"
                        required
                     ></v-text-field>
                  </v-col>
               </v-row>

               <!-- Change nickname -->
               <v-row>
                  <v-col>
                     <h2 class="d-flex justify-end mr-3"><strong>Name: {{user.nickname}}</strong></h2>
                  </v-col>
                  <v-col>
                     <v-text-field
                        class="aux"
                        v-model="nickname"
                        :counter="20"
                        :rules="nameRules"
                        label="Nickname"
                        required
                     ></v-text-field>
                  </v-col>
               </v-row>

               <!-- Change email -->
               <v-row>
                  <v-col>
                     <h2 class="d-flex justify-end mr-3"><strong>Email: {{user.email}}</strong></h2>
                  </v-col>
                  <v-col>
                     <v-text-field
                        class="aux"
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                     ></v-text-field>
                  </v-col>
               </v-row>

               <div class="mt-4">
                  <v-btn
                     :disabled="!valid"
                     color="#f07977"
                     class="mr-4"
                     @click="submit"
                  >
                     Submit
                  </v-btn>

                  <v-btn
                     color="#bfaaaa"
                     dark
                     @click="reset"
                  >
                     Cancel
                  </v-btn>
               </div>
            </v-form>
         </div>
      </v-card>

    </div>
</template>

<script>
import axios from "axios";

export default {
    
   name: 'ConsultAccount',

   props: ["idu"],

   data() {
      return {
         user: [],
         valid: true,
         username: 'Era suposto',
         nickname: 'aparecer aqui',
         nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be less than 10 characters',
         ],
         email: 'as infos dos users..',
         emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
         ],
      };
   },

   methods: {
      submit () {
         if (this.$refs.form.validate()) {
            // Código para alterar as infos (patch)
            alert("Hello");
         }
      },
      reset () {
         this.$refs.form.reset();
         this.$refs.form.resetValidation();
      }
   },

   created: function() {

      // get user's info
      axios
         .get('/read2be/api/users/' + this.idu, this.$getOptions())
         .then(res => {
            this.user = res.data;
            this.nickname = this.user.nickname;
            this.username = this.user.username;
            this.email = this.user.email;
         })
         .catch(e => console.log('Erro no GET dos books do user: ' + e));
   },

}
</script>

<style scoped>
   .aux {
      padding-right: 200px;
   }
</style>