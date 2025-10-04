import { useState } from 'react'

function Recieve() {
  const [source, setSource] = useState<String>('John');
  const [amount, setAmount] = useState<Number>(200);

  function handleAccept(): void {
    console.log("bruh");
  };

  function handleReject(): void {
    console.log("bruh but reject");
  }

  return(
    <div className='text-center'>
      <div className="box mt-16 p-4">
        <h2 className=''>You received some money!</h2>
        <p className=''>
          ${amount.toString()} from {source}
        </p>
      </div>
      <div className="mt-4 flex flex-row">
        <div className="box bg-green-500 border-green-500 w-1/2 mr-2 p-2">
          <button onClick={handleAccept}>Accept</button>
        </div>
        <div className="box bg-red-500 border-red-500 w-1/2 ml-2 p-2">
          <button onClick={handleReject}>Reject</button>
        </div>
      </div>
    </div>
  );
}

export default Recieve;