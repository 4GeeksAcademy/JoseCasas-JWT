const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			loginMessage: null,
			signUpMessage: null,
			isLoginSuccessful: false,
			isSignupSuccessful: false
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},

			// handle the process requesting a token
			// if succesful, it will put the token string
			// in the store to allow for future use
			login: async (email, password) => {
				const options = {
					method: 'POST',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: email,
						password: password
					})
				}

				const response = await fetch('https://didactic-doodle-q79xr994p6x4hxvqj-3001.app.github.dev/api/token', options)

				if (!response.ok) {
					console.log("Error: ", response.statusText, response.status)
					return false;
				}

				const data = await response.json();
				sessionStorage.setItem("token", data.access_token)
				setStore({
					token: data.access_token,
					loginMessage: data.msg,
					isLoginSuccessful: true
				})
				return true;
			},

			signUp: async(email, password) => {
				const options = {
					method: 'POST',
					mode: 'cors',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: email,
						password: password
					})
				}

				const response = await fetch('https://didactic-doodle-q79xr994p6x4hxvqj-3001.app.github.dev/api/signup', options)

				if(!response.ok) {
					const data = await response.json()
					return {
						error: {
							status: response.status,
							statusText: response.statusText,
							signUpMessage: data.msg
						}
					}
				}

				const data = await response.json()
				setStore({
					signUpMessage: data.msg,
					isSignupSuccessful: true
				})
				return data;
			},

			// validatio/persistence action	
			syncSessionTokenFromStore: () => {
				const sessionToken = sessionStorage.getItem('token');
				if(sessionToken && sessionToken != '' && sessionToken != undefined) {
					setStore({token: sessionToken})
				}
			},

			// logout action
			logout: () => {
				sessionStorage.removeItem('token')
				setStore({
					token: null,
					loginMessage: null,
					signUpMessage: null,
					isLoginSuccessful: false
				})
			}
			
		}
	};
};

export default getState;
