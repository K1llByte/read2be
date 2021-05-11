<template>
  <v-container grid-list-md text-xs-center>
    <v-card width="400px" class="mx-auto mt-5">
      <v-card-title>
        <h1>Login</h1>
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
                    
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="validate"
          >
            Validate
          </v-btn>
          
          <v-spacer></v-spacer>
          
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
export default {
  name: 'login',

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
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
      this.$refs.form.resetValidation()
    },
  }
};
</script>
