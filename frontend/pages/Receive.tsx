import { useState } from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider'
import Loading from '../components/Loading'

function Recieve() {
  const { isAuthenticated, loading } = useAuth();
  const [source] = useState<string>('John');
  const [amount] = useState<number>(200);

  if(loading) {
    return <Loading/> 
  }

  function handleAccept(): void {
    console.log("bruh");
  };

  function handleReject(): void {
    console.log("bruh but reject");
  }


  if (isAuthenticated) {
    return(
      <div className='text-center'>
        <div className="box mt-16 p-4">
          <h2 className=''>You received some money!</h2>
          <p className=''>
            ${amount.toFixed(2)} from {source}
          </p>
        </div>
        <div className="mt-4 flex flex-row">
          <div className="box bg-green-500 border-green-500 w-1/2 mr-2 p-2">
            <button type="button" onClick={handleAccept}>Accept</button>
          </div>
          <div className="box bg-red-500 border-red-500 w-1/2 ml-2 p-2">
            <button type="button" onClick={handleReject}>Reject</button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default Recieve;