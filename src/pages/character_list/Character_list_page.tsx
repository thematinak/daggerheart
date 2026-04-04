import React, { useEffect, useState } from "react";
import { useAuth } from "../../common/contexts/AuthProvider";

type CharacterListItem = {
  id: string;
  name: string;
  level: number;
  className: string;
};

const CharacterListPage: React.FC = () => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<CharacterListItem[]>([]);
  const [loading, setLoading] = useState({isLoading: false, error: null as string | null});

  const fetchCharacters = async (userId: number) => {
        try {
          setLoading({ isLoading: true, error: null });
    
          const queryString = new URLSearchParams({user_id: userId.toString()}).toString();
          const response = await fetch(`http://pecen.eu/daggerheart/api1/character.php?${queryString}`);
          const data: CharacterListItem[] = await response.json();
          setCharacters(data);
        } catch (err: any) {
          console.error(err);
          setCharacters([]);
          setLoading({ isLoading: false, error: err.message || "Unknown error" });
        } finally {
          setLoading(old => ({...old, isLoading: false }));
        }
  };

  useEffect(() => {
    fetchCharacters(user?.id ?? -1);
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    const queryString = new URLSearchParams({id: id}).toString();
    const response = await fetch(`http://pecen.eu/daggerheart/api1/character.php?${queryString}`, {
      method: "DELETE"
    });
    const resJson = await response.json();
    if (resJson.success) {
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert("Failed to delete character: " + (resJson.error || "Unknown error"));
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Title */}
      <h1 className="text-2xl font-bold">Your Characters</h1>

      {/* List */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading.isLoading && (<tr><td colSpan={4}>Loading...</td></tr>)}
            {!loading.isLoading && characters.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 py-6"
                >
                  No characters yet
                </td>
              </tr>
            )}

            {!loading.isLoading && characters.map((character) => (
              <tr
                key={character.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-semibold">
                  {character.name}
                </td>

                <td className="px-4 py-3">
                  {character.level}
                </td>

                <td className="px-4 py-3">
                  {character.className}
                </td>

                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(character.id)}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
};

export default CharacterListPage;