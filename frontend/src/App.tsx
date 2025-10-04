import { BrowserRouter, Routes, Route } from "react-router";
import Header from '../components/Header';
import NoPage from '../pages/NoPage';
import Receive from '../pages/Receive';

function App() {
  return (
    <div className='min-h-screen bg-global'>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/receive' element={<Receive/>}/>
          <Route path='*' element={<NoPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;