import { useState, useEffect } from 'react'
import { useAuth } from '../providers/AuthProvider'
import axios from 'axios'

const apiURL = import.meta.env.VITE_API_URL;

function Pay() {
  const { authToken } = useAuth();

  // This is ai slop, sorta
  const [id, setId] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<string>('') // This might actually be user object
  const [amount, setAmount] = useState<Number>(0)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setId(queryParams.get('id'))

    // do stuff with order id
    const res = await axios.get(`${apiURL}/some endpoint`, { id })

    // Split res into the amount and target username
    setAmount(res.data.amount);
    setTargetUser(res.data.targetUser)
  }, []);

  // Dunno if we need res, w/e
  async function handleSend() {
    await axios.post(`${apiURL}/payments/send`, 
      {amount: amount, targetUser: targetUser},
      {headers: {Authorization: `Bearer ${authToken}`}}
    );
    // now maybe redirect to Close.tsx or maybe another confirmation page?
  }   

  return (
    <div className="text-center">
      <div className="box mt-16 p-4">
        <h2 className="">{targetUser} has requested ${amount.toFixed(2)}</h2>
      </div>
      <div className="mt-4 flex flex-row">
        <div className="box bg-green-500 border-green-500 w-full p-2">
          <button type="button" onClick={handleSend}>Send Money</button>
        </div>
      </div>
    </div>
  );
}

export default Pay;