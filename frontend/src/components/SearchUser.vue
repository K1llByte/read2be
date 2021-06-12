<template>
   <div>
      <v-card
         class="mx-auto d-flex justify-space-around mt-4"
         color="rgba(255,0,0,0.1)"
         height="95"
         width="400"
      >
         <v-text-field
            v-model="search"
            class="my-auto mx-12"
            color="#f07977"
            background-color="#f9f2f2"
            hide-details
            label="Search"
            solo
            single-line
            append-icon="mdi-magnify"
            @click:append="sendSearch"
            @keydown.enter="sendSearch"
            @keydown.esc="search = ''"
         ></v-text-field>
      </v-card>
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

export default {
   name: 'SearchUser',
   
   data: function() {
      return {
         search: '',
         text: '',
         snackbar: false,
      };
   },

   methods: {
		sendSearch: function() {
			// check if user exists
			axios
				.get('/read2be/api/users/' + this.search, this.$getOptions())
				.then(res => {
					this.$goTo('/users/' + this.search);
               console.log(res);
				})
				.catch(e => {
               if (e.response.status == 404) {
                  this.text = "User doesn't exist!";
                  this.snackbar = true;
               } else {
                  console.log('Erro na procura do user: ' + e);
               }
            });
		},
   }
}
</script>