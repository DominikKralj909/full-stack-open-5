import { useState } from 'react';

import blogService from '../services/blogs';

function Login({ setUser, showNotification }) {
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
			showNotification('Invalid credentials', 'error');
		}
	}

	return(
		<form onSubmit={handleLogin} id="login">
			<div>
				Username:
				<input 
					type="text"
					name="username"
					value={username}
					onChange={(event) => setUsername(event.target.value)} 
				/>
			</div>
			<div>
				Password:
				<input 
					type="text"
					name="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)} 
				/>
			</div>
			<br />
			<div>
				<input type="submit" name="login" value="Login" />
			</div>
		</form>
	);
}

export default Login;