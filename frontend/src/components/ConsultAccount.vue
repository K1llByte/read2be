<template>
    <div>
      <!-- Avatar -->
      <!-- :src=user.avatar_url -->
      <v-hover v-slot="{ hover }">
         <v-card
            height="150"
            width="150"
            class="mx-auto rounded-circle"
         >
               <!-- src="https://cdn.discordapp.com/attachments/630820905228173347/845052368545513553/Fotor-marble-ink-background-image-1.png" -->
            <v-img
               :src=user.avatar_url
               height="150"
               width="150"
               class="rounded-circle"
            >
            </v-img>

            <v-overlay
               v-if="hover"
               color="#036358"
               absolute
            >
               
               <!-- Change Avatar -->
               <v-file-input
                  v-model="file"
                  v-if="hover"
                  :rules="rules"
                  dark
                  hide-input
                  prepend-icon="mdi-camera"
                  accept="image/png, image/jpeg, image/bmp"
                  icon
               ></v-file-input>
            </v-overlay>
         </v-card>
      </v-hover>
      <v-btn
         v-if="file"
         class="mt-5 mb-n3"
         color="#f07977"
         @click="change"
      >
         Confirm
      </v-btn>

      <!-- Change User Info -->
      <v-card class="mx-auto mt-12 pr-16 py-6" color="rgb(255, 0, 0, 0.1)"  width="850px">
         <v-form
            ref="form"
            v-model="valid"
            lazy-validation
         >
            <v-row>
               <v-col>
                  <h2 class="main-color d-flex justify-end mr-3"><strong>Username:</strong></h2>
               </v-col>
               <v-col>
                  <v-text-field
                     background-color="#f9f2f2"
                     class="aux mr-16 mt-3 v-input__slot"
                     :value=user.username
                     disabled
                     filled
                  ></v-text-field>
               </v-col>
            </v-row>

            <!-- Change nickname -->
            <v-row>
               <v-col>
                  <h2 class="main-color d-flex justify-end mr-3"><strong>Name:</strong></h2>
               </v-col>
               <v-col>
                  <v-text-field
                     background-color="#f9f2f2"
                     class="aux mr-16 mt-3 v-input__slot"
                     v-model="nickname"
                     :counter="20"
                     :rules="nameRules"
                     :label=user.nickname
                     solo
                  ></v-text-field>
               </v-col>
            </v-row>

            <!-- Change password (primeiro é preciso haver forma de confirmar a atual) -->
            <!--  -->

            <!-- Change email -->
            <v-row>
               <v-col>
                  <h2 class="main-color d-flex justify-end mr-3"><strong>Email:</strong></h2>
               </v-col>
               <v-col>
                  <v-text-field
                     background-color="#f9f2f2"
                     class="aux mr-16 mt-3 v-input__slot"
                     v-model="email"
                     :rules="emailRules"
                     :label=user.email
                     solo
                  ></v-text-field>
               </v-col>
            </v-row>

            <div class="my-3 ml-16 mr-n5">
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
         file: null,
         valid: true,
         username: '',
         nickname: '',
         nameRules: [
            v => v.length <= 20 || v.length == 0 || 'Name must be less than 20 characters',
            v => v.length >= 8 || v.length == 0 || 'Name must be at least 8 characters',
         ],
         usernameRules: ['Username can\'t be changed'],
         email: '',
         emailRules: [
            v => /.+@.+\..+/.test(v) || v.length == 0 || 'E-mail must be valid',
         ],
         overlay: false,
         transparent: 'rgba(255, 255, 255, 0)',
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
      },
      change () {
         let formData = new FormData();
         formData.append('avatar', this.file);

         // change user's avatar
         axios
            .patch('/read2be/api/users/' + this.idu, formData, this.$getOptions())
            .then(this.file = null)
            .catch(e => console.log('Erro no PATCH do avatar do user: ' + e));
      }
   },

   created: function() {

      // get user's info
      axios
         .get('/read2be/api/users/' + this.$user, this.$getOptions())
         .then(res => {
            this.user = res.data;
            this.nickname = this.user.nickname;
            this.username = this.user.username;
            this.email = this.user.email;
         })
         .catch(e => console.log('Erro no GET das infos do user: ' + e));
   },

}
</script>

<style scoped>
   .aux {
      padding-right: 200px;
   }
   .v-input__slot {
      width: 450px;
   }
   .v-overlay {
      height: 150px;
      width: 150px;
   }
   .v-file-input {
      margin-left: 10px;
      margin-bottom: 8px;
   }
</style>