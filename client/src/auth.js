export default {
	user: {
		authenticated: false,
		role: null
	},
	login(context, creds, redirect) {
		context.$http.post('auth/login', {
				email: creds.email,
				password: creds.password
			})
			.then(response => {
				localStorage.setItem('id_token', response.data.token);
				this.user.authenticated = true;
				this.user.role = response.data.role;
				if (redirect) {
					location.reload();
					this.router.push(redirect);
				};
			})
			.catch(function(error) {
				this.error = error.body.error;
			});
	},
	signup(context, creds, redirect) {
		context.$http.post('auth/register', {
				email: creds.email,
				firstName: creds.firstName,
				lastName: creds.lastName,
				password: creds.password
			})
			.then(response => {
				if (response.data.success == true) {
					this.router.push('/verify');
				};
			})
			.catch(function(error) {
				this.error = error.body.data;
			});
	},
	logout() {
		localStorage.removeItem('id_token')
		this.user.authenticated = false;
		this.router.push('/login');
	},
	checkAuth() {
		var jwt = localStorage.getItem('id_token');
		if (jwt) {
			this.user.authenticated = true;
		} else {
			this.user.authenticated = false;
		}
	},
	getAuthHeader() {
		return {
			'Authorization': localStorage.getItem('id_token')
		}
	}
}
