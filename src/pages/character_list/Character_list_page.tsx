import React, { useState } from "react";

type CharacterListItem = {
  id: string;
  name: string;
  level: number;
  className: string;
};

const CharacterListPage: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterListItem[]>([
    { id: "1", name: "Arthos", level: 3, className: "Warrior" },
    { id: "2", name: "Lyra", level: 5, className: "Mage" },
    { id: "3", name: "Kael", level: 2, className: "Rogue" },
  ]);

  const handleDelete = (id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
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
            {characters.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 py-6"
                >
                  No characters yet
                </td>
              </tr>
            )}

            {characters.map((character) => (
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