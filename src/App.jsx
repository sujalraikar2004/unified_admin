import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Registrations from './pages/Registrations';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex">
        <nav className="w-64 h-screen bg-gray-800 text-white p-5 flex flex-col">
          <h1 className="text-2xl font-bold mb-10">Admin</h1>
          <ul className="flex-grow">
            <li className="mb-4">
              <Link to="/" className="hover:text-gray-300">Home</Link>
            </li>
            <li>
              <Link to="/registrations" className="hover:text-gray-300">Registrations</Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-10 bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registrations" element={<Registrations />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
