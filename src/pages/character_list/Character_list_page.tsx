import React from "react";
import { useAuth } from "../../common/contexts/AuthProvider";
import { GridSelector } from "../../common/components/GridSelector";
import { useNavigate } from "react-router-dom";
import { CommonData, useCommonData } from "../../common/contexts/CommonDataProvider"
import { GiTrashCan } from "react-icons/gi";
import { Badge } from "../../common/components/Badge";
import GameCard from "../../common/components/GameCard";
import styles from "../../common/types/cssColor";


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

const CharacterCard: React.FC<{
  character: CharacterListItem;
  commonData: CommonData;
  onDelete: (id: string) => void;
}> = ({ character, commonData, onDelete }) => {
  return (
    <GameCard hover={false}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {character.name}
        </h2>
        <Badge color="purple" label={`Lv. ${character.level}`} />
      </div>

      {/* Info */}
      <div className={`space-y-2 ${styles.gray.text} text-sm`}>
        <p>
          <span className="font-semibold">Heritage:</span>{" "}
          {commonData.ancestries[character.ancestryId]?.name || "Unknown"}
        </p>

        <p>
          <span className="font-semibold">Level:</span>{" "}
          {character.level}
        </p>

        <p>
          <span className="font-semibold">Class:</span>{" "}
          {commonData.characterClasses[character.classId]?.name || "Unknown"}
          {" - "}
          {commonData.specializations[character.specializationId]?.name || "Unknown"}
        </p>

        <p>
          <span className="font-semibold">Community:</span>{" "}
          {commonData.communities[character.communityId]?.name || "Unknown"}
        </p>
      </div>

      {/* Divider */}
      <hr className="my-4" />

      {/* Delete button */}
      <div className="mb-4">
        <div className="mb-3"></div>
        <button className={`${styles.tokens.button.base} ${styles.tokens.button.danger} px-3 py-2`}
          onClick={() => onDelete(character.id)}
        >
          <GiTrashCan className="w-5 h-5" />
        </button>
      </div>
    </GameCard>
  );
};

export default CharacterListPage;
