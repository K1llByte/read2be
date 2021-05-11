<template>
	<v-container grid-list-md text-xs-center>
		<v-card width="600px" class="mx-auto mt-5">
			<v-card-title>
				<h1>Register</h1>
			</v-card-title>
			<v-spacer></v-spacer>
			<v-card-text>
				<v-form
					ref="form"
					v-model="valid"
					lazy-validation
				>
					<v-layout row wrap>
						<v-flex xs5.1>
							<v-text-field
								v-model="firstName"
								:rules="nameRules"
								label="First Name"
								required
								solo
							></v-text-field>
						</v-flex>
						<v-spacer></v-spacer>
						<v-flex xs6>
							<v-text-field
								v-model="lastName"
								:rules="nameRules"
								label="Last Name"
								required
								solo
							></v-text-field>
						</v-flex>
						<v-flex xs5.1>
							<v-text-field
								v-model="user"
								:counter="20"
								:rules="userRules"
								label="Username"
								required
								solo
							></v-text-field>
						</v-flex>
						<v-spacer></v-spacer>
						<v-flex xs5.1>
							<v-text-field
								v-model="password"
								:counter="30"
								:rules="passwordRules"
								label="Password"
								:type="showPassword ? 'text' : 'password'"
								:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
								@click:append="showPassword = !showPassword"
								required
								solo
							></v-text-field>
						</v-flex>
					</v-layout>
					
					<v-text-field
						v-model="email"
						:rules="emailRules"
						label="Email"
						required
						solo
					></v-text-field>
					
					<v-btn
						:disabled="!valid"
						color="success"
						class="mr-4"
						@click="validate"
					>
						Validate
					</v-btn>

					<v-btn
						color="error"
						class="mr-4"
						@click="reset"
					>
						Reset Form
					</v-btn>
				</v-form>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>
import axios from "axios";
import { token, options } from '../variables.js';

export default {
	name: 'register',

	data: () => ({
		showPassword: false,
		valid: true,
      firstName: '',
      lastName: '',
		nameRules: [
			v => !!v || 'Name is required',
			v => (v && v.length <= 15) || 'Name must be less than 15 characters',
		],
		user: '',
		userRules: [
			v => !!v || 'Username is required',
			v => (v && v.length >= 6) || 'Username must be more than 8 characters',
			v => (v && v.length <= 20) || 'Username must be less than 20 characters',
		],
		password: '',
		passwordRules: [
			v => !!v || 'Password is required',
			v => (v && v.length >= 10) || 'Password must be more than 10 characters',
			v => (v && v.length <= 20) || 'Password must be less than 30 characters',
		],
		email: '',
		emailRules: [
			v => !!v || 'E-mail is required',
			v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
		],
	}),

	methods: {

		validate () {
			this.$refs.form.validate()
		},

		reset () {
			this.$refs.form.reset()
			this.$refs.form.resetValidation()
		},

      submit(){

         if (this.$refs.form.validate()) {

            var form = {
               nickname: this.firstName + ' ' + this.lastName,
               username: this.user,
               email: this.email,
               password: this.password
            };
            
            axios
               .post('/read2be/register', form)
               .then(res => {
                  token = res.data.token;
                  alert("Success!");
               })
               .catch(e => console.log('Erro no register do user: ' + e));
         } else {
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
         }
      }
	},

   created: function() {

      // get author's books' name and image
      axios
         .get('/read2be/api/users/' + this.idu, options)
         .then(res => {
            this.user = res.data;
         })
         .catch(e => console.log('Erro no GET dos books do user: ' + e));

      // TEMPORARIO
      axios
         .get('/read2be/api/authors/Jane Austen?inline_books=1', options)
         .then(res => {
            this.books = res.data.books;
         })
         .catch(e => console.log('Erro no GET dos books do user: ' + e));

   },
};
</script>
