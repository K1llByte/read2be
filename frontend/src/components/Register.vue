<template>
	<v-container grid-list-md text-xs-center>
		<v-card width="600px" class="mx-auto mt-5 pb-2" color="#f8d4d4">
			<v-card-title class="pt-6">
				<h1 class="armwrestler">Register</h1>
			</v-card-title>
			<v-spacer></v-spacer>
			<v-card-text>
				<v-form
					ref="form"
					v-model="valid"
					lazy-validation
				>					
					<v-text-field
                  background-color="#F6EAEA"
						v-model="user"
						:counter="20"
						:rules="userRules"
						label="Username"
						required
						solo
					></v-text-field>

					<v-spacer></v-spacer>
					
					<v-text-field
                  background-color="#F6EAEA"
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
                  background-color="#F6EAEA"
						v-model="email"
						:rules="emailRules"
						label="Email"
						required
						solo
					></v-text-field>
					
					<v-btn
						v-if="valid"
						dark
						color="#f07977"
						class="mr-3 mb-2"
						@click="submit"
					>
						Register
					</v-btn>
					<v-btn
						v-else
						disabled
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
		user: '',
		userRules: [
			v => !!v || 'Username is required',
			v => /^(\w|-){1,32}$/.test(v) || 'Username is not valid',
		],
		password: '',
		passwordRules: [
			v => !!v || 'Password is required',
			v => (v && v.length >= 8) || 'Password must be more than 8 characters',
			v => (v && v.length <= 32) || 'Password must be less than 32 characters',
		],
		email: '',
		emailRules: [
			v => !!v || 'E-mail is required',
			v => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v) || 'E-mail must be valid',
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
               username: this.user,
               password: this.password,
               email: this.email
            };
            
            axios
               .post('/read2be/api/register', form)
               .then(aux => {
						aux.data = null; // tem de se usar o aux senão dá erro
						// se nao existir aux de todo, tanto o then como o cath correm
						axios
							.post('/read2be/api/login', form)
							.then(res => {
								this.$login(res.data.TOKEN, form.username);
								alert("Success!\nRegistered and Logged In! :)");
							})
							.catch(e => {
								console.log('Erro no login do user: ' + e);
								if (e.response.status == 400) {
									alert("Error: Not Logged In");
								} else if (e.response.status == 401) {
									alert("Incorrect Credentials");
								} else {
									alert(e.response.data.error);
								}
							})
					})
               .catch(e => {
						console.log('Erro no register do user: ' + e);
						if (e.response.status == 400) {
							alert("Invalid Input");
						} else if (e.response.status == 406) {
							alert("User Already Exists");
						} else {
							alert(e.response.data.error);
						}
					});
         } else {
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
         }
      }
	},
};
</script>
