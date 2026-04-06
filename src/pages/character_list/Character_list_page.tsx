import React from "react";
import { useNavigate } from "react-router-dom";
import { Swords, Castle, BadgeCheck } from "lucide-react";
import { GiTrashCan } from "react-icons/gi";
import { useAuth } from "../../common/contexts/AuthProvider";
import { CommonData, useCommonData } from "../../common/contexts/CommonDataProvider";
import { GridSelector } from "../../common/components/GridSelector";
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
  const queryString = new URLSearchParams({ user_id: String(userId) }).toString();

  const handleDelete = async (id: string) => {
    const deleteQueryString = new URLSearchParams({ id }).toString();
    const response = await fetch(`http://pecen.eu/daggerheart/api1/character.php?${deleteQueryString}`, {
      method: "DELETE",
    });
    const resJson = await response.json();
    if (!resJson.success) {
      alert("Failed to delete character: " + (resJson.error || "Unknown error"));
    }
  };

  return (
    <GridSelector<CharacterListItem>
      title="Your Characters"
      eyebrow="Campaign Hub"
      description="Review your adventurers, jump back into a build, or clear out retired heroes."
      endpoint={`http://pecen.eu/daggerheart/api1/character.php?${queryString}`}
      onSelect={(character) => navigate(`/character/${character.id}`)}
      renderItem={(character) => (
        <CharacterCard character={character} commonData={commonData} onDelete={handleDelete} />
      )}
    />
  );
};

const CharacterCard: React.FC<{
  character: CharacterListItem;
  commonData: CommonData;
  onDelete: (id: string) => void;
}> = ({ character, commonData, onDelete }) => {
  const ancestryName = commonData.ancestries[character.ancestryId]?.name || "Unknown";
  const className = commonData.characterClasses[character.classId]?.name || "Unknown";
  const specializationName =
    commonData.specializations[character.specializationId]?.name || "Unknown";
  const communityName = commonData.communities[character.communityId]?.name || "Unknown";

  return (
    <GameCard>
      <div className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
              Adventurer
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              {character.name}
            </h2>
          </div>
          <Badge color="blue" label={`Lv. ${character.level}`} />
        </div>

        <div className="rounded-[1.25rem] border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 text-sm font-semibold text-amber-900">
          {className} / {specializationName}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailPill icon={<Castle size={14} />} label="Ancestry" value={ancestryName} />
          <DetailPill icon={<Castle size={14} />} label="Community" value={communityName} />
          <DetailPill icon={<BadgeCheck size={14} />} label="Class" value={className} />
          <DetailPill
            icon={<Swords size={14} />}
            label="Specialization"
            value={specializationName}
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
          <span className="text-sm text-slate-500">Click card to open character</span>
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

const DetailPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
    <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
      {icon}
      {label}
    </div>
    <div className="text-sm font-semibold text-slate-900">{value}</div>
  </div>
);

export default CharacterListPage;
