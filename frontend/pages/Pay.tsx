import { useState } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider'
import Loading from '../components/Loading'
import Bank from '../components/Bank';


function Pay() {
  const { user, loading } = useAuth();

  // both of these should probably be a parameter in send, but this for now
  const [target] = useState<string>('John');
  const [amount] = useState<number>(100.50);

  function handleSend(): void {
    console.log(user);
  }   

  if(loading) {
    return <Loading/>;
  }

  if (!!user) {
    return (
       <div className="text-center">
        <div className="box mt-16 p-4">
          <h2 className="">{target} has requested ${amount.toFixed(2)}</h2>
        </div>
        <div className="mt-4 flex flex-row">
          <div className="box bg-green-500 border-green-500 w-full p-2">
            <button type="button" onClick={handleSend}>Send Money</button>
          </div>
        </div>
        <Bank/>
      </div>
    );
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default Pay;