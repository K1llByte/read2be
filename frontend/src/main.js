import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

// global variables
Vue.prototype.$token = '';
Vue.prototype.$logged = false;
Vue.prototype.$user = null;

Vue.prototype.$getOptions = function(){
	return {
		crossdomain: true,
		headers: { Authorization: `Bearer ${Vue.prototype.$token}` }
	};
};

Vue.prototype.$login = function(t, u) {
	Vue.prototype.$token = t;
	Vue.prototype.$logged = true;
	Vue.prototype.$user = u;
	this.$router.push('/home');
};

Vue.prototype.$logout = function() {
	Vue.prototype.$token = '';
	Vue.prototype.$logged = false;
	this.$router.push('/');
};

Vue.prototype.$goTo = function(route) {
	
	if (this.$logged)
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

Vue.config.productionTip = false;

new Vue({
	vuetify,
	router,
	render: h => h(App)
}).$mount('#app')
