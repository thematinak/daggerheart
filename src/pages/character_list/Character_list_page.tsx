import React from "react";
import { useNavigate } from "react-router-dom";
import { Swords, Castle, Star } from "lucide-react";
import { GiTrashCan } from "react-icons/gi";
import { useAuth } from "../../common/contexts/AuthProvider";
import { CommonData, useCommonData } from "../../common/contexts/CommonDataProvider";
import { GridSelector } from "../../common/components/GridSelector";
import { Badge } from "../../common/components/Badge";
import GameCard from "../../common/components/GameCard";
import styles from "../../common/types/cssColor";
import H2 from "../../common/components/H2";
import Eyebrow from "../../common/components/Eyebrow";
import { deleteCharacter } from "../../common/endponts/common";
import DetailRow from "../../common/components/DetailRow";
import SplitBar from "../../common/components/SplitBar";
import Section from "../../common/components/Section";

type CharacterListItem = {
  id: string;
  name: string;
  level: number;
  proficiency: number;
  classId: string;
  specializationId: string;
  ancestryId: string;
  communityId: string;
};

const CharacterListPage: React.FC = () => {
  const { user } = useAuth();
  const { commonData: { byId } } = useCommonData();
  const navigate = useNavigate();
  const userId = user.id;

  return (
    <Section eyebrow="Campaign Hub" title="Your Characters">
      <div className="gap-3">
        <GridSelector<CharacterListItem>
        endpoint={`http://pecen.eu/daggerheart/api1/character.php?user_id=${userId}`}
        onSelect={(character) => navigate(`/character/${character.id}`)}
        renderItem={(character) => (
          <CharacterCard character={character} commonData={byId} onDelete={deleteCharacter} />
        )}
        />
      </div>
    </Section>
  );
};

const CharacterCard: React.FC<{
  character: CharacterListItem;
  commonData: CommonData["byId"];
  onDelete: (id: string) => void;
}> = ({ character, commonData: { characterClasses, specializations, ancestries, communities }, onDelete }) => {
  const ancestryName = ancestries[character.ancestryId]?.name || "Unknown";
  const className = characterClasses[character.classId]?.name || "Unknown";
  const specializationName = specializations[character.specializationId]?.name || "Unknown";
  const communityName = communities[character.communityId]?.name || "Unknown";

  return (
    <GameCard>
      <div className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <H2>{character.name}</H2>
          <Badge color="blue" label={`Level ${character.level}`} />
        </div>
        <Eyebrow eyebrow={`${className} / ${specializationName}`} />

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailRow icon={<Castle size={14} />} label="Ancestry" value={ancestryName} />
          <DetailRow icon={<Castle size={14} />} label="Community" value={communityName} />
          <DetailRow icon={<Swords size={14} />} label="Specialization" value={specializationName} />
          <DetailRow icon={<Star size={14} />} label="Proficiency" value={String(character.proficiency)} />
        </div>

        <SplitBar />
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm text-[var(--color-gray-text)]">Click card to open character</span>
          <button
            className={`${styles.tokens.button.base} ${styles.tokens.button.danger} px-3 py-2`}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(character.id);
            }}
          >
            <GiTrashCan className="h-5 w-5" />
          </button>
        </div>
      </div>
    </GameCard>
  );
};

export default CharacterListPage;
