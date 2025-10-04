import { BrowserRouter, Routes, Route } from "react-router";
import Header from '../components/Header';
import NoPage from '../pages/NoPage';

function App() {
  return (
    <div className='min-h-screen bg-global'>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='*' element={<NoPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
