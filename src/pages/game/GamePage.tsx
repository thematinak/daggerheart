import React from "react";

type Attributes = {
  agility: number;
  strength: number;
  finesse: number;
  instinct: number;
  presence: number;
  knowledge: number;
};

type Character = {
  name: string;
  level: number;
  className: string;
  attributes: Attributes;
};

type GamePageProps = {
};



const GamePage: React.FC<GamePageProps> = () => {

    let character: Character = {
    name: "Arthos",
    level: 2,
    className: "Warrior",
    attributes: {
      agility: 1,
      strength: 2,
      finesse: 0,
      instinct: 1,
      presence: 0,
      knowledge: -1,
    }
}

    
    
  return (
    <div className="flex flex-col gap-6">

      {/* Title */}
      <h1 className="text-2xl font-bold">Game Session</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Character Info */}
        <div className="bg-white rounded-xl shadow border p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Character</h2>

          <p>
            <strong>Name:</strong> {character.name}
          </p>

          <p>
            <strong>Class:</strong> {character.className}
          </p>

          <p>
            <strong>Level:</strong> {character.level}
          </p>
        </div>

        {/* Attributes */}
        <div className="bg-white rounded-xl shadow border p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Attributes</h2>

          <div className="grid grid-cols-2 gap-2">

            <div className="bg-gray-100 p-2 rounded">
              Agility: {character.attributes.agility}
            </div>

            <div className="bg-gray-100 p-2 rounded">
              Strength: {character.attributes.strength}
            </div>

            <div className="bg-gray-100 p-2 rounded">
              Finesse: {character.attributes.finesse}
            </div>

            <div className="bg-gray-100 p-2 rounded">
              Instinct: {character.attributes.instinct}
            </div>

            <div className="bg-gray-100 p-2 rounded">
              Presence: {character.attributes.presence}
            </div>

            <div className="bg-gray-100 p-2 rounded">
              Knowledge: {character.attributes.knowledge}
            </div>

          </div>
        </div>

      </div>

      {/* Placeholder for future systems */}
      <div className="bg-white rounded-xl shadow border p-6 text-gray-500">
        Future gameplay features will appear here:
        <ul className="list-disc ml-6 mt-2">
          <li>Hope / Fear dice</li>
          <li>HP & Stress</li>
          <li>Abilities</li>
          <li>Inventory</li>
          <li>Combat actions</li>
        </ul>
      </div>

    </div>
  );
};

export default GamePage;