import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./common/components/AppLayout";
import CharacterCreatorPage from "./pages/create_character/create_character_page";
import LoginPage from "./pages/login/LoginPage";
import CharacterListPage from "./pages/character_list/Character_list_page";
import GamePage from "./pages/game/GamePage";
import { AuthProvider } from "./common/contexts/AuthProvider";
import ProtectedRoute from "./common/components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

              <Route path="/" element={<CharacterListPage />} />
              <Route path="/create" element={<CharacterCreatorPage />} />
              <Route path="/game" element={<GamePage />} />

            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );



}

export default App;