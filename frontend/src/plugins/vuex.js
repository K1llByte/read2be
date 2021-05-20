import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
   state: {
      token: '',
      options: {
         crossdomain: true,
         headers: { Authorization: `Bearer ${this.state.token}` }
      },
   },
   mutations: {
      setToken(state, t){
         state.token = t;
      },
      resetToken(state) {
         state.token = '';
      }
   }
});