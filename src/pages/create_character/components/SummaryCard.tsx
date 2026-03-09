import React from "react";
import { ClassItem } from "./ClassCard";
import { SpecializationsItem } from "./SpecializationsCard";
import { AncestriesItem } from "./AncestriesCard";
import { CommunityItem } from "./CommunityCard";
import { DomainCardItem } from "./DomainCard";
import { Attributes } from "./AttributeGrid";
import { Experience } from "./ExperiencesCard";
import { WeaponItem } from "../../../common/components/WeaponCard";
import { ArmorItem } from "../../../common/components/ArmorCard";

export type Character = {
  class: ClassItem | null;
  specialization: SpecializationsItem | null;
  ancestry: AncestriesItem | null;
  community: CommunityItem | null;
  attributes: Attributes;
  weapon: WeaponItem | null;
  armor: ArmorItem | null;
  name: string;
  description: string;
  primaryExperience: Experience;
  secondaryExperience: Experience;
  domainCards: DomainCardItem[];
};

type SummaryCardProps = {
  character: Character;
  onBack?: () => void;
  onCreate?: () => void;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ character, onBack, onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-4">Character Summary</h1>

        {/* Sekcie rozdelené do mini kariet */}
        <div className="flex flex-wrap gap-4">
          
          {/* Basic Info */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Basic Info</h2>
            <p><strong>Name:</strong> {character.name}</p>
            <p><strong>Description:</strong> {character.description}</p>
          </div>

          {/* Class & Specialization */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Class & Specialization</h2>
            <p><strong>Class:</strong> {character.class?.name || "-"}</p>
            {character.class?.description && <p className="text-sm text-gray-600">{character.class.description}</p>}
            <p><strong>Specialization:</strong> {character.specialization?.name || "-"}</p>
            {character.specialization?.description && <p className="text-sm text-gray-600">{character.specialization.description}</p>}
          </div>

          {/* Ancestry & Community */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Background</h2>
            <p><strong>Ancestry:</strong> {character.ancestry?.name || "-"}</p>
            {character.ancestry?.description && <p className="text-sm text-gray-600">{character.ancestry.description}</p>}
            <p><strong>Community:</strong> {character.community?.name || "-"}</p>
            {character.community?.description && <p className="text-sm text-gray-600">{character.community.description}</p>}
          </div>

          {/* Domains */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Domains</h2>
            {character.domainCards.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {character.domainCards.map((d) => (
                  <li key={d.id} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md">
                    <strong>{d.name}</strong>
                    {d.description && <span className="block text-sm text-gray-600">{d.description}</span>}
                  </li>
                ))}
              </ul>
            ) : <p>-</p>}
          </div>

          {/* Attributes */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Attributes</h2>
            <ul className="grid grid-cols-2 gap-2">
              {Object.entries(character.attributes).map(([key, value]) => (
                <li key={key} className="bg-gray-100 px-2 py-1 rounded-md">
                  <strong>{key}:</strong> {value?.value}
                </li>
              ))}
            </ul>
          </div>

          {/* Gear */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Gear</h2>
            <p><strong>Weapon:</strong> {character.weapon?.name || "-"}</p>
            {character.weapon?.description && <p className="text-sm text-gray-600">{character.weapon.description}</p>}
            <p><strong>Armor:</strong> {character.armor?.name || "-"}</p>
            {character.armor?.abilityDescription && <p className="text-sm text-gray-600">{character.armor?.abilityDescription}</p>}
          </div>

          {/* Experience */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Experience</h2>
            <p><strong>Primary:</strong> {character.primaryExperience.name}</p>
            {character.primaryExperience.description && <p className="text-sm text-gray-600">{character.primaryExperience.description}</p>}
            <p><strong>Secondary:</strong> {character.secondaryExperience.name}</p>
            {character.secondaryExperience.description && <p className="text-sm text-gray-600">{character.secondaryExperience.description}</p>}
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
          >
            Back
          </button>

          <button
            onClick={onCreate}
            className="px-4 py-2 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 font-semibold"
          >
            Create Character
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;