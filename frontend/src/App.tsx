import { AuthProvider } from '../providers/AuthProvider'
import { BrowserRouter, Routes, Route } from "react-router";
import Header from '../components/Header';
import NoPage from '../pages/NoPage';
import Receive from '../pages/Receive';
import Pay from '../pages/Pay';
import Login from '../pages/Login';
import Register from '../pages/Register';

function App() {
  return (
    <div className='min-h-screen bg-global p-4'>
      <AuthProvider>
        <BrowserRouter>
          <Header/>
          <Routes>
            <Route path='/receive' element={<Receive/>}/>
            <Route path='/pay' element={<Pay/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='*' element={<NoPage/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App;