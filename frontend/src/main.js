import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import * as VueCookies from 'vue-cookies';
import router from './router'


Vue.config.productionTip = false;

Vue.use(VueCookies);

new Vue({
	vuetify,
	VueCookies,
	// vuecookies,
	router,
	render: h => h(App)
}).$mount('#app');

Vue.$cookies.config('7d');

// global variables
// Vue.prototype.$token = '';

// Vue.prototype.$logged = false;

// Vue.prototype.$user = null;

Vue.prototype.$getOptionsParams = function(p){
	return {
		crossdomain: true,
		headers: { Authorization: `Bearer ${Vue.$cookies.get('token')}` },
		params: p
	};
};

Vue.prototype.$login = function(t, u) {
	Vue.$cookies.set('token', t);
	Vue.$cookies.set('user', u);
	const options = {
		crossdomain: true,
		headers: { Authorization: `Bearer ${Vue.$cookies.get('token')}` },
	}
	Vue.$cookies.set('options', options);
	this.$router.push('/home');
};

Vue.prototype.$logout = function() {
	this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
	// Vue.prototype.$token = '';
	// Vue.prototype.$logged = false;
	this.$router.push('/');
};

Vue.prototype.$goTo = function(route) {
	
	// if (this.$logged)
	if (this.$cookies.isKey('token'))
	{
		this.$router.push(route);
	}
	else {
		if (route != '/') {
			this.$router.push('/');
		}
		else {
			this.$router.push(route);
		}
	}
}