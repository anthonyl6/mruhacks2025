import { useAuth } from '../providers/AuthProvider'
import { useState } from 'react'

function RegisterForm() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const {login} = useAuth();  
  async function handleLogin(e) {
    e.preventDefault();
    const res = await login(username, password);
    console.log(res)
  }

  return (
    <div className='box p-4 w-3/4'>
      <div className='text-left mb-4 box p-2'>
        <label htmlFor="username">Username:</label><br/>
        <input 
          id='username' 
          placeholder='Enter Username'
          className='w-max'
          value={username} 
          onChange={(e) => {setUsername(e.target.value)}} 
        />
      </div>
      <div className='text-left my-4 box p-2'>
        <label htmlFor="password">Password:</label><br/>
        <input 
          id='password' 
          type='password' 
          className='w-max'
          placeholder='Enter Password'
          value={password} 
          onChange={(e) => {setPassword(e.target.value)}} 
        />
      </div>
      <button 
        onClick={handleLogin}
        className='text-center box p-2 my-2 w-full border-blue-500 bg-blue-500 hover:cursor-pointer hover:underline '
      >
        Login
      </button>
      <p className='text-left text-sm mt-2 opacity-75'>Never used MoJo? <a className='text-blue-500 hover:underline' href="/register">Register</a></p>
    </div>
  );
}

export default RegisterForm;