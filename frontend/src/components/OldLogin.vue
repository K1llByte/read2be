<template>
	<v-container grid-list-md text-xs-center>
		<v-card width="400px" class="mx-auto mt-5" color="#f8d4d4">
			<v-card-title class="ml-16 mb-n2 pt-5">
				<h1><strong class="ml-10">Login</strong></h1>
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
						color="success"
						class="mr-3 mb-2"
						width=100
						@click="submit"
					>
						Validate
					</v-btn>
					
					<v-btn
						class=" mb-2"
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
import axios from 'axios'

export default {
	
	name: 'OldLogin',

	data: () => ({
		showPassword: false,
		valid: true,
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
	}),

	methods: {

      submit(){

         if (this.$refs.form.validate()) {

            var form = {
               username: this.user,
               password: this.password
            };
            
            axios
               .post('/read2be/api/login', form, this.$getOptions())
               .then(res => {
                  this.$setToken(res.data.TOKEN);
						this.$login();
						this.$goTo('/home');
               })
               .catch(e => {
						console.log('Erro no login do user: ' + e);
						console.log('user:' + form.username + ', pass: ' + form.password);
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