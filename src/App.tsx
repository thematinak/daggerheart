import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./common/components/AppLayout";
import CharacterCreatorPage from "./pages/create_character/create_character_page";
import LoginPage from "./pages/login/LoginPage";
import CharacterListPage from "./pages/character_list/Character_list_page";
import CharacterDetailPage from "./pages/character_detail/CharacterDetailPage";
import { AuthProvider } from "./common/contexts/AuthProvider";
import ProtectedRoute from "./common/components/ProtectedRoute";
import RegisterPage from "./pages/register/RegisterPage";
import { CommonDataProvider } from "./common/contexts/CommonDataProvider";
import CreateItemPage from "./pages/content_tools/CreateItemPage";
import CreateWeaponPage from "./pages/content_tools/CreateWeaponPage";
import CreateArmorPage from "./pages/content_tools/CreateArmorPage";

function App() {
  return (
    <AuthProvider>
      <CommonDataProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

              <Route path="/" element={<CharacterListPage />} />
              <Route path="/character/:id" element={<CharacterDetailPage />} />
              <Route path="/create" element={<CharacterCreatorPage />} />
              <Route path="/tools/items/new" element={<CreateItemPage />} />
              <Route path="/tools/weapons/new" element={<CreateWeaponPage />} />
              <Route path="/tools/armor/new" element={<CreateArmorPage />} />

            </Route>

          </Routes>
        </BrowserRouter>
        </CommonDataProvider>
      </AuthProvider>
  );



}

export default App;
