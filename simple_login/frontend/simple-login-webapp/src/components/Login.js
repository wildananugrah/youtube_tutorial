import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, TextField } from '@material-ui/core'

const Login = () => {

    const[username, setUsername] = useState();
    const[password, setPassword] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`username: ${username} password ${password}`);
    
        const data = {
            'username': username,
            'password': password
        }
    
        axios.post('http://localhost:3001/users/login', data).then((response) => {
            console.log(response.data);

            if(response.status == 200)
            {
                window.localStorage.setItem('token', response.data.token);
                window.location.href = "/dashboard";
            }

        }).catch((error) => {
            console.log(error.response.data);
            alert(error.response.data.data)
        });
    }

    return (<Container maxWidth="sm">
        <form noValidate autoComplete="off">
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={e => setUsername(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
            >Sign In</Button>
        </form>
    </Container>);
}

export default Login;