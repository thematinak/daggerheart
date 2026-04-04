import React, { useEffect, useState } from "react";
import { useAuth } from "../../common/contexts/AuthProvider";
import { GridSelector } from "../../common/components/GridSelector";
import { useNavigate } from "react-router-dom";

type CharacterListItem = {
  id: string;
  name: string;
  level: number;
  className: string;
  specialization: string;
  ancestry: string;
  comunity: string;
};

const CharacterListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? -1;
  const queryString = new URLSearchParams({user_id: String(userId)}).toString();


  const handleDelete = async (id: string) => {
    const queryString = new URLSearchParams({id: id}).toString();
    const response = await fetch(`http://pecen.eu/daggerheart/api1/character.php?${queryString}`, {
      method: "DELETE"
    });
    const resJson = await response.json();
    if (resJson.success) {
    } else {
      alert("Failed to delete character: " + (resJson.error || "Unknown error"));
    }
  };

  return (<GridSelector<CharacterListItem> title="Select character"
            endpoint={`http://pecen.eu/daggerheart/api1/character.php?${queryString}`}
            onSelect={(char, pos) => navigate(`/character/${char.id}`)}
            renderItem={(char, selected) => <CharacterCard character={char} onDelete={handleDelete} />}
    
     />);
};

const CharacterCard: React.FC<{ character: CharacterListItem, onDelete: (id: string) => void }> = ({ character, onDelete }) => {
  return (<div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-semibold">{character.name}</h2>
      <p>Heritage: {character.ancestry}</p>
      <p>Class: {character.className} - {character.specialization}</p>
      <p>Community: {character.comunity}</p>
      <p>
        <button
            onClick={() => onDelete(character.id)}
            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
          Delete
        </button>
      </p>
    </div>
  );
}

export default CharacterListPage;