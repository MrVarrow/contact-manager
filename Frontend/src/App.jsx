import {Routes, Route} from 'react-router-dom'
import Home from "./components/Pages/Home.jsx";
import ContactsList from "./components/Pages/ContactsList.jsx";
import Navbar from "./components/Navbars/Navbar.jsx";
import FavoriteContacts from "./components/Pages/Favorites.jsx";

function App() {
    const myWidth = 220
  return (
      <div className="App">
          <Navbar
              drawerWidth={myWidth}
              content = {
                <Routes>
                    <Route path="" element={<Home/>}/>
                    <Route path="/contacts-list" element={<ContactsList/>}/>
                    <Route path="/favorites" element={<FavoriteContacts/>}/>
                </Routes>
              }
          />
      </div>
  )
}

export default App
