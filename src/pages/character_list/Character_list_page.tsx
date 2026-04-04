import React from "react";
import { useAuth } from "../../common/contexts/AuthProvider";
import { GridSelector } from "../../common/components/GridSelector";
import { useNavigate } from "react-router-dom";
import { CommonData, useCommonData } from "../../common/contexts/CommonDataProvider";


type CharacterListItem = {
  id: string;
  name: string;
  level: number;
  classId: string;
  specializationId: string;
  ancestryId: string;
  communityId: string;
};

const CharacterListPage: React.FC = () => {
  const { user } = useAuth();
  const { commonData } = useCommonData();
  const navigate = useNavigate();
  const userId = user?.id ?? -1;
  const queryString = new URLSearchParams({user_id: String(userId)}).toString();

  const handleDelete = async (id: string) => {
    const queryString = new URLSearchParams({id: id}).toString();
    const response = await fetch(`http://pecen.eu/daggerheart/api1/character.php?${queryString}`, { method: "DELETE" });
    const resJson = await response.json();
    if (resJson.success) {
    } else {
      alert("Failed to delete character: " + (resJson.error || "Unknown error"));
    }
  };

  return (<GridSelector<CharacterListItem> title="Select character"
            endpoint={`http://pecen.eu/daggerheart/api1/character.php?${queryString}`}
            onSelect={(char, pos) => navigate(`/character/${char.id}`)}
            renderItem={(char, selected) => <CharacterCard character={char} commonData={commonData} onDelete={handleDelete} />}
    
     />);
};

const CharacterCard: React.FC<{ character: CharacterListItem, commonData: CommonData, onDelete: (id: string) => void }> = ({ character, commonData, onDelete }) => {
  console.log(character, commonData);
  
  return (<div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-semibold">{character.name}</h2>
      <p>Heritage: {commonData.ancestries[character.ancestryId]?.name || "Unknown"}</p>
      <p>Level: {character.level}</p>
      <p>Class: {commonData.characterClasses[character.classId]?.name || "Unknown"} - {commonData.specializations[character.specializationId]?.name || "Unknown"}</p>
      <p>Community: {commonData.communities[character.communityId]?.name || "Unknown"}</p>
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