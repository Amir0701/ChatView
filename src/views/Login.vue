<template>
  <v-container fluid fill-height class="indigo lighten-3">
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary" class="d-flex justify-center">
            <v-toolbar-title>{{ isRegister ? stateObj.register.name : stateObj.login.name }}</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <form ref="form" @submit.prevent="isRegister ? register() : login()">
              <v-text-field
                  v-model="name"
                  name="name"
                  label="Name"
                  type="text"
                  placeholder="Name"
                  minlength="1"
                  maxlength="50"
                  required
              ></v-text-field>

              <v-text-field
                  v-model="nickname"
                  name="nickname"
                  label="Nickname"
                  type="text"
                  placeholder="Nickname"
                  minlength="1"
                  maxlength="50"
                  required
              ></v-text-field>

              <v-text-field
                  v-model="email"
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  minlength="5"
                  maxlength="50"
                  required
              ></v-text-field>

              <v-text-field
                  v-model="password"
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Password"
                  minlength="6"
                  maxlength="50"
                  required
              ></v-text-field>

              <v-text-field
                  v-if="isRegister"
                  v-model="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                  required
              ></v-text-field>
              <div class="red--text"> {{ errorMessage }}</div>
              <div class="d-flex justify-start mt-2">
                <v-btn type="submit" color="primary" value="log in">
                  {{ isRegister ? stateObj.register.name : stateObj.login.name }}
                </v-btn>
              </div>
              <div class="d-flex justify-center mt-2">
                <v-btn
                    @click="isRegister = !isRegister;"
                >
                  {{ toggleMessage }}
                </v-btn>
              </div>
            </form>
          </v-card-text>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as AUTH_CONSTANTS from "@/store/modules/auth/constants";
import store from "@/store";
import {UserAuthDto} from "@/dto/UserAuth.dto";

export default {
  name: 'auth',
  data() {
    return {
      name: '',
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      isRegister: false,
      errorMessage: '',
      stateObj: {
        register: {
          name: 'Register',
          message: 'Already have an Account? login.'
        },
        login: {
          name: 'Login',
          message: 'Register'
        }
      }
    };
  },
  methods: {
    login: async function() {
      const userAuth = new UserAuthDto(this.name, this.nickname, this.email, this.password);

      await store.dispatch(`auth/${AUTH_CONSTANTS.ACTIONS.LOGIN}`, userAuth);
    },
    register: async function() {
      if (this.password === this.confirmPassword) {
        this.isRegister = false;
        this.errorMessage = "";
        this.$refs.form.reset();

        const userAuth = new UserAuthDto(this.name, this.nickname, this.email, this.password);

        await store.dispatch(`auth/${AUTH_CONSTANTS.ACTIONS.REGISTER}`, userAuth);
      } else {
        this.errorMessage = "Password did not match"
      }
    }
  },
  computed: {
    toggleMessage: function () {
      return this.isRegister ? this.stateObj.register.message : this.stateObj.login.message
    }
  }
}
</script>