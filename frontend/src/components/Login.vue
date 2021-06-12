<template>
	<div>
		<v-container grid-list-md text-xs-center>
			<v-card width="400px" class="mx-auto mt-5" color="#f8d4d4">
				<v-card-title class="mb-n2 pt-5">
					<h1 class="armwrestler">Login</h1>
				</v-card-title>
				<v-spacer></v-spacer>
				<v-card-text>
					<v-form
						ref="form"
						v-model="valid"
						lazy-validation
					>
						<v-text-field
							v-model="user"
							:counter="20"
							:rules="userRules"
							background-color="#F6EAEA"
							label="Username"
							required
							solo
							clearable
						></v-text-field>
						<v-spacer></v-spacer>
						<v-text-field
							v-model="password"
							:counter="30"
							:rules="passwordRules"
							background-color="#F6EAEA"
							label="Password"
							:type="showPassword ? 'text' : 'password'"
							:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
							@click:append="showPassword = !showPassword"
							id="select"
							required
							solo
							clearable
						></v-text-field>
											
						<v-btn
							:disabled="!valid"
							dark
							color="#f07977"
							class="mr-3 mb-2"
							width=100
							@click="submit"
						>
							Login
						</v-btn>
						
						<v-btn
							class="mb-2"
							color="#bfaaaa"
							dark
							width=100
							@click="reset"
						>
							Cancel
						</v-btn>
					</v-form>
				</v-card-text>
			</v-card>
		</v-container>
	
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

export default {
	
	name: 'Login',

	data: () => ({
		showPassword: false,
		valid: true,
		user: '',
		userRules: [
			v => !!v || 'Username is required',
			v => /^[\w\- .]{1,32}$/.test(v) || 'Username is not valid',
		],
		password: '',
		passwordRules: [
			v => !!v || 'Password is required',
			v => (v && v.length >= 8) || 'Password must be more than 8 characters',
			v => (v && v.length <= 32) || 'Password must be less than 32 characters',
		],
		snackbar: false,
		text: '',
	}),

	methods: {

      submit(){

         if (this.$refs.form.validate()) {

            var form = {
               username: this.user,
               password: this.password
            };
            
            axios
               .post('/read2be/api/login', form, this.$cookies.get('options'))
               .then(res => {
						this.$login(res.data.TOKEN, form.username);
               })
               .catch(e => {
						console.log('Erro no login do user: ' + e);
						if (e.response.status == 400) {
							this.text = 'Error: Not Logged In';
							this.snackbar = true;
						} else if (e.response.status == 401) {
							this.text = 'Incorrect credentials!';
							this.snackbar = true;
						}
					});
         } else {
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
         }
      },

		reset(){
			this.$refs.form.reset();
			this.$refs.form.resetValidation();
		}
	},
};
</script>