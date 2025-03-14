import { useState } from 'react';

import blogService from '../services/blogs';

function Login({ setUser }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await blogService.login({ username, password });
			localStorage.setItem('loggedUser', JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);
		} catch(error) {
			console.error('Login failed:', error.response?.data?.error || error.message);
		}
	}

	return(
		<form onSubmit={handleLogin}>
			<div>
				Username:
				<input 
					type="text"
					name="Username"
					value={username}
					onChange={(event) => setUsername(event.target.value)} 
				/>
			</div>
			<div>
				Password:
				<input 
					type="text"
					name="Password"
					value={password}
					onChange={(event) => setPassword(event.target.value)} 
				/>
			</div>
			<br />
			<div>
				<input type="submit" name="Login" />
			</div>
		</form>
	);
}

export default Login;