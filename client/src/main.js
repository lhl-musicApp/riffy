import Vue 							from 'vue';
import vSelect				 	from 'vue-select'
import Router 					from 'vue-router';
import Resource 				from 'vue-resource';
import App 							from './App';
import VeeValidate 			from 'vee-validate';
import vuefaker					from 'vue-faker';
import VueHowler 				from 'vue-howler';
// Import components
import Register 				from './components/pages/Register.vue';
import Hello 						from './components/pages/Hello.vue';
import Login 						from './components/pages/Login.vue';
import Users 						from './components/pages/Users.vue';
import DragDrop 				from './components/pages/DragDrop.vue';
import AudioDrop 				from './components/pages/AudioDrop.vue';
import Howler 					from './components/pages/Howler.vue';
import Radio 						from './components/pages/Radio.vue';
import Streaming 				from './components/pages/Stream.vue';
import VueYouTubeEmbed 	from 'vue-youtube-embed';
import Multiselect 			from 'vue-multiselect';
import Skills 					from './components/pages/Skills.vue';

// import UserEditor from './components/pages/UserEditor.vue';
import UserSingle 			from './components/pages/UserSingle.vue';
import Main 						from './components/pages/Main.vue';
import NoteSingle	 			from './components/pages/NoteSingle.vue';
import Verify 					from './components/pages/Verify.vue';
import Search 					from './components/pages/Search.vue';
import ForgotPassword 	from './components/pages/ForgotPassword.vue';
import ResetPassword 		from './components/pages/ResetPassword.vue';
import Bands 						from './components/pages/Bands.vue';
import BandNew 					from './components/pages/BandNew.vue';
import BandSingle 			from './components/pages/BandSingle.vue';
import Tracks 					from './components/pages/Tracks.vue';
import TrackNew 				from './components/pages/TrackNew.vue';
import TrackSingle 			from './components/pages/TrackSingle.vue';


//Auth Setup
// Check the user's auth status when the app starts
import auth from './auth'
auth.checkAuth();
Vue.use(VeeValidate);
Vue.use(Resource);
Vue.use(Router);
Vue.use(VueYouTubeEmbed);
Vue.use(vuefaker);
Vue.component(Multiselect);

// Vue.component(vSelect);

// Routes
export var router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', component: Hello },
		{ path: '/users', component: Users, meta: { requiresAuth: true, requiresAdmin: true } },
		{ path: '/register', component: Register, meta: { checksAuth: true } },
		{ path: '/login', component: Login, meta: { checksAuth: true } },
		{ path: '/main', component: Main },
		{ path: '/search', component: Search },
		{ path: '/verify', component: Verify },
    { path: '/drop', component: DragDrop },
		{ path: '/skills', component: Skills },
		// { path: '/users/skills/delete/:id', component: Skills },
		{ name: 'skills', path: '/users/skills/:id', component: Skills, meta: { requiresAuth: true } },
    { path: '/audiodrop', component: AudioDrop },
    { path: '/howler', component: Howler },
    { path: '/stream', component: Streaming },
    { path: '/radio', component: Radio },
		{ path: '/forgotpassword', component: ForgotPassword },
		{ path: '/reset/:token', component: ResetPassword },
		{ path: '/verify/:id/:token', component: Verify },
		{ name: 'noteSingle', path: '/notes/:id', component: NoteSingle },
    { name: 'userSingle', path: '/users/:id', component: UserSingle, meta: { requiresAuth: true } },
    // { path: '/userskills/:id', component: UserSingle, meta: { checksAuth: true }},

    { path: '/bands', component: Bands, meta: { requiresAuth: true } },
    { path: '/bands/new', component: BandNew, meta: { requiresAuth: true } },
    { name: 'bandSingle', path: '/bands/:id', component: BandSingle, meta: { requiresAuth: true } },
    { path: '/bandtracks/:id', component: BandSingle, meta: { checksAuth: true }},
    { path: '/tracks', component: Tracks, meta: { requiresAuth: true } },
    { path: '/tracks/new', component: TrackNew, meta: { requiresAuth: true } },
    { name: 'trackSingle', path: '/tracks/:id', component: TrackSingle, meta: { requiresAuth: true } }
	]
});

Vue.http.options.root = 'http://localhost:3000/api';
// console.log(auth.getAuthHeader());
Vue.http.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token');
Vue.http.headers.common['Access-Control-Allow-Origin'] = '*';

//Protect authenticated routes with Route Meta tags.
router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		// this route requires auth, check if logged in
		// if not, redirect to login page.
		if (!auth.user.authenticated) {
			next({
				path: '/login',
				query: { redirect: to.fullPath }
			})
		} else {
			next()
		}
	}
	if (to.matched.some(record => record.meta.requiresAdmin)) {
		console.log(auth.user);
		// this route requires auth, check if logged in
		// if not, redirect to login page.
		if (auth.user.role == 'admin') {
			next()
		} else {
			next({
				path: '/',
				query: { redirect: to.fullPath }
			})
		}
	}
	if (to.matched.some(record => record.meta.checksAuth)) {
		// this route requires auth, check if logged in
		// if not, redirect to login page.
		if (auth.user.authenticated) {
			next({
				path: '/',
				query: { redirect: to.fullPath }
			})
		} else {
			next()
		}
	} else {
		next() // make sure to always call next()!
	}
})

//Build app into #app div
const app = new Vue({
	router,
	render: (h) => h(App)
}).$mount('#app')
