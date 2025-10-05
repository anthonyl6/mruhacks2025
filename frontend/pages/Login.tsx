import LoginForm from '../components/LoginForm'

function Login() {
  return (
    <>
      <h2 className='text-center text-lg font-bold m-4'>Log in to your MoJo account</h2>
      <div className='flex justify-center'>
        <LoginForm/>
      </div>
    </>
  );
}

export default Login;