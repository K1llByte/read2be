<template>
	<v-container grid-list-md text-xs-center>
		<v-card width="600px" class="mx-auto mt-5 pb-2" color="#f8d4d4">
			<v-card-title class="mb-n2 pt-5">
				<h1 class="armwrestler">Register</h1>
			</v-card-title>
			<v-spacer></v-spacer>
			<v-card-text>
				<v-form
					ref="form"
					v-model="valid"
					lazy-validation
				>
					<v-layout row wrap>
						<v-flex xs6>
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
					</v-layout>
					
					<v-text-field
						v-model="user"
						:counter="20"
						:rules="userRules"
						label="Username"
						required
						solo
					></v-text-field>

					<v-spacer></v-spacer>
					
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
					
					<v-text-field
						v-model="email"
						:rules="emailRules"
						label="Email"
						required
						solo
					></v-text-field>
					
					<v-btn
						:disabled="!valid"
						dark
						color="#f07977"
						class="mr-3 mb-2"
						@click="submit"
					>
						Register
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
</template>

<script>
import axios from "axios";

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
               password: this.password,
               email: this.email
            };

				// CÓDIGO AINDA POR TESTAR
            
            axios
               .post('/read2be/api/register', form)
               .then(res => {
                  this.$token = res.data.token;
						axios
							.post('/read2be/api/login', form, this.$getOptions())
							.then(res => {
								this.$login(res.data.TOKEN);
							})
							.catch(e => {
								console.log('Erro no login do user: ' + e);
								if (e.response.status == 400) {
									alert("Error: Not Logged In");
								} else if (e.response.status == 401) {
									alert("Token Already Revoked");
								}
							});
                  alert("Success!\nRegistered and Logged In! :)");
               })
               .catch(e => {
						console.log('Erro no register do user: ' + e);
						if (e.response.status == 400) {
							alert("Invalid Input");
						} else if (e.response.status == 406) {
							alert("User Already Exists");
						}
						// console.log('user:' + form.username + ', pass: ' + form.password);
					});
            
            // axios
            //    .patch('/read2be/ mudar o nickname', form)
            //    .then(res => {
            //       this.$token = res.data.token;
            //       alert("Success!");
            //    })
            //    .catch(e => {
				// 		console.log('Erro no register do user: ' + e);
				// 		if (e.response.status == 400) {
				// 			alert("Invalid Input");
				// 		} else if (e.response.status == 406) {
				// 			alert("User Already Exists");
				// 		}
				// 	});
         } else {
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
         }
      }
	},
};
</script>
