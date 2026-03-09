import React from "react";
import { Character } from "../create_character_page";

type SummaryCardProps = {
  character: Character;
  onBack?: () => void;
  onCreate?: () => void;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ character, onBack, onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-5xl flex flex-col gap-6">

        <h1 className="text-2xl font-bold text-center mb-4">
          Character Summary
        </h1>

        <div className="flex flex-wrap gap-4">

          {/* BASIC INFO */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Basic Info</h2>
            <p><strong>Name:</strong> {character.name}</p>
            <p><strong>Description:</strong> {character.description}</p>
          </div>

          {/* CLASS */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Class & Specialization</h2>

            <p><strong>Class:</strong> {character.class?.name || "-"}</p>
            {character.class?.description && (
              <p className="text-sm text-gray-600">
                {character.class.description}
              </p>
            )}

            <p className="mt-2">
              <strong>Specialization:</strong> {character.specialization?.name || "-"}
            </p>

            {character.specialization?.description && (
              <p className="text-sm text-gray-600">
                {character.specialization.description}
              </p>
            )}
          </div>

          {/* BACKGROUND */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Background</h2>

            <p><strong>Ancestry:</strong> {character.ancestry?.name || "-"}</p>
            {character.ancestry?.description && (
              <p className="text-sm text-gray-600">
                {character.ancestry.description}
              </p>
            )}

            <p className="mt-2">
              <strong>Community:</strong> {character.community?.name || "-"}
            </p>

            {character.community?.description && (
              <p className="text-sm text-gray-600">
                {character.community.description}
              </p>
            )}
          </div>

          {/* DOMAINS */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Domains</h2>

            {character.domainCards.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {character.domainCards.map((d) => (
                  <li
                    key={d.id}
                    className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md"
                  >
                    <strong>{d.name}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p>-</p>
            )}
          </div>

          {/* ATTRIBUTES */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Attributes</h2>

            <ul className="grid grid-cols-2 gap-2">
              {Object.entries(character.attributes).map(([key, value]) => (
                <li
                  key={key}
                  className="bg-gray-100 px-2 py-1 rounded-md"
                >
                  <strong>{key}:</strong> {value?.value}
                </li>
              ))}
            </ul>
          </div>

          {/* GEAR */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Gear</h2>

            <p>
              <strong>Primary Weapon:</strong>{" "}
              {character.weapons?.primary?.name || "-"}
            </p>

            {character.weapons?.secondary && (
              <p>
                <strong>Secondary Weapon:</strong>{" "}
                {character.weapons.secondary.name}
              </p>
            )}

            <p className="mt-2">
              <strong>Armor:</strong>{" "}
              {character.armor?.name || "-"}
            </p>

            {character.armor?.abilityDescription && (
              <p className="text-sm text-gray-600">
                {character.armor.abilityDescription}
              </p>
            )}
          </div>

          {/* EXPERIENCE */}
          <div className="flex-1 min-w-[250px] border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold mb-2">Experience</h2>

            <p>
              <strong>Primary:</strong>{" "}
              {character.primaryExperience?.name || "-"}
            </p>

            {character.primaryExperience?.description && (
              <p className="text-sm text-gray-600">
                {character.primaryExperience.description}
              </p>
            )}

            <p className="mt-2">
              <strong>Secondary:</strong>{" "}
              {character.secondaryExperience?.name || "-"}
            </p>

            {character.secondaryExperience?.description && (
              <p className="text-sm text-gray-600">
                {character.secondaryExperience.description}
              </p>
            )}
          </div>

        </div>

        {/* BUTTONS */}
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