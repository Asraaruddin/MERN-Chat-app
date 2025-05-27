import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Homepage } from './Pages/home';
import { ChatPage } from './Pages/Chatpage';

function App() {
  return (
    <div className='App'>
      <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/chats' element={<ChatPage />} />
    </Routes>
    </div>
  );
}

export default App;
