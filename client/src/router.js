// Routes
export var router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', component: Hello },
		{ path: '/users', component: Users, meta: { requiresAuth: true, requiresAdmin: true } },
		{ path: '/register', component: Register, meta: { checksAuth: true } },
		{ path: '/login', component: Login, meta: { checksAuth: true } },
		{ path: '/Main', component: Main },
		{ path: '/verify', component: Verify },
		{ path: '/search', component: Search },
		{ path: '/verify/:id/:token', component: Verify },
		{ name: 'noteSingle', path: '/notes/:id', component: NoteSingle },
    { name: 'userSingle', path: '/users/:id', component: UserSingle, meta: { checksAuth: true } },
		{ path: '/userskills/:id', component: UserSingle, meta: { checksAuth: true }},
    { name: 'skills', path: '/users/skills/:id', component: Skills, meta: { checksAuth: true } },
    { path: '/bands', component: Bands, meta: { requiresAuth: true }},
    { path: '/bands/new', component: BandNew, meta: { requiresAuth: true }},
    { name: 'bandSingle', path: '/bands/:id', component: BandSingle, meta: { checksAuth: true } },
    { path: '/bandtracks/:id', component: BandSingle, meta: { checksAuth: true }},
    { path: '/tracks', component: Tracks, meta: { requiresAuth: true }},
    { path: '/tracks/new', component: TrackNew, meta: { requiresAuth: true }},
    { name: 'trackSingle', path: '/tracks/:id', component: TrackSingle, meta: { checksAuth: true } }
	]
});

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
