import axios from 'axios'
import { useAuth } from '../providers/AuthProvider'

const apiURL = import.meta.env.VITE_API_URL

function Bank() {
  const { authToken } = useAuth();

  async function handleBank() {
    console.log(authToken)
    await axios.post(`${apiURL}/payments/bank`,
        {}, {headers: { Authorization: `Bearer ${authToken}` }}
    )
  }
  return (
    <button className='box p-4'onClick={handleBank}>
        bruh
    </button>
  );
}

export default Bank;