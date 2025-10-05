import React from 'react';
import RegisterForm from '../components/RegisterForm'

function Register() {
  return (
    <>
      <h2 className='text-center text-lg font-bold m-4'>Create your MoJo account</h2>
      <div className='flex justify-center'>
        <RegisterForm/>
      </div>
    </>
  );
}

export default Register;