import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider'
import axios from 'axios'

const apiURL = import.meta.env.VITE_API_URL;

function Pay() {
  const { authToken } = useAuth();

  const navigate = useNavigate()

  // This is ai slop, sorta (not anymore)
  const [id, setId] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<string>('') // This might actually be user object
  const [amount, setAmount] = useState<Number>(1)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setId(queryParams.get('id'))

    // do stuff with order id
    axios.get(`${apiURL}/account/details`,{
      params: { id }, 
      headers: {Authorization: `Bearer ${authToken}`}
    }
    ).then((res) => {
      setAmount(res.data.balance);
      setTargetUser(res.data.username)
    });
  }, []);

  // Dunno if we need res, w/e
  async function handleSend() {
    await axios.post(`${apiURL}/payments/confirm`, 
      {transaction_id: id, confirm: true},
      {headers: {Authorization: `Bearer ${authToken}`}}
    );
    // now maybe redirect to Close.tsx or maybe another confirmation page?
    navigate('/close')
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