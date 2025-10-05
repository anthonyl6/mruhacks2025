import { useState } from 'react'
import { useAuth } from '../providers/AuthProvider'


function Pay() {
  // both of these should probably be a parameter in send, but this for now
  const [target, setTarget] = useState<String>('John');
  const [amount, setAmount] = useState<Number>(100.50);


  // testing useAuth
  const {user, isAuthenticated, key, login, register} = useAuth();   

  function handleSend(): void {
    console.log("-1 credit score");
  }

  async function handleLogin(e) {
    e.preventDefault();
    await login("john", "johnPassword");  
  }

  

  return(
   <div className="text-center">
      <div className="box mt-16 p-4">
        <h2 className="">{target} has requested ${amount.toFixed(2)}</h2>
      </div>
      <div className="mt-4 flex flex-row">
        <div className="box bg-green-500 border-green-500 w-full p-2">
          <button onClick={handleSend}>Send Money</button>
        </div>
      </div>
      <div className="mt-4 flex flex-row">
        <div className="box bg-green-500 border-green-500 w-full p-2">
          <button onClick={handleRegister}>Test Login</button>
        </div>
      </div>
    </div>
  );
}

export default Pay;