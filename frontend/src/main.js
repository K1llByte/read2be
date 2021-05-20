import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

// global variable
Vue.prototype.$token = '';
Vue.prototype.$options = null;
Vue.prototype.$logged = false;

Vue.prototype.$getOptions = function(){
	return {
		crossdomain: true,
		headers: { Authorization: `Bearer ${Vue.prototype.$token}` }
	};
};

Vue.prototype.$getToken = function() {
	return Vue.prototype.$token;
};

Vue.prototype.$setToken = function(t) {
	Vue.prototype.$token = t;
};

Vue.prototype.$login = function() {
	Vue.prototype.$logged = true;
};

Vue.prototype.$logout = function() {
	Vue.prototype.$logged = false;
	this.$router.push('/');
};

Vue.prototype.$goTo = function(route) {
	
	if (this.$logged)
	{
		this.$router.push(route);
	}
	else {
		if (route != '/' && route != '/login' && route != '/register') {
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
