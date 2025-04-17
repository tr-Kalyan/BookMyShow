import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Admin from "./pages/Admin";
import Partner from "./pages/Partner";
import User from "./pages/User";
import ProtectedRoute from "./components/ProtectedRoute";
import {Provider} from "react-redux"
import store from "./redux/store";



function App() {
  return (
    <Provider store={store}>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/partner" element={<Partner/>} />
          <Route path="/profile" element={<User/>} />
        </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
