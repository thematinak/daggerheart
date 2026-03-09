import React from "react";
import CharacterCreator from "../create_character/create_character_page";

const characters = [
  { name: "Lyra", heritage: "Elf", characterClass: "Ranger", level: 3 },
  { name: "Borin", heritage: "Dwarf", characterClass: "Guardian", level: 5 },
  { name: "Mira", heritage: "Human", characterClass: "Sorcerer", level: 2 },
];

function HomePage() {
  return (
    <div>
      <h1>Daggerheart Characters</h1>
      <CharacterCreator />
    </div>
  );
}

export default HomePage;