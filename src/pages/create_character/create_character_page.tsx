import React, { useCallback, useState } from "react";
import ClassCard, { ClassItem } from "./components/ClassCard";
import SpecializationsCard, { SpecializationsItem } from "./components/SpecializationsCard";
import AncestriesCard, { AncestriesItem } from "./components/AncestriesCard";
import CommunityCard, { CommunityItem } from "./components/CommunityCard";
import InfoCard from "./components/InfoCard";
import ExperienceCard, { Experience } from "./components/ExperiencesCard";
import DomainCard, { DomainCardItem } from "./components/DomainCard";
import GearCard, { SelectedWeapons } from "./components/GearCard";
import { GridSelector } from "../../common/components/GridSelector";
import { AttributeItem, Attributes, AttributesGrid } from "./components/AttributeGrid";
import StepIndicator from "./components/StepIndicator";
import SummaryCard from "./components/SummaryCard";
import { WeaponItem } from "../../common/components/WeaponCard";
import { ArmorItem } from "../../common/components/ArmorCard";

/* ---------- TYPES ---------- */

type CardItem = {
  id: string;
  name: string;
  description?: string;
};



export type Character = {
  class: ClassItem | null;
  specialization: SpecializationsItem | null;
  ancestry: AncestriesItem | null;
  community: CommunityItem | null;
  attributes: Attributes;
  weapons: SelectedWeapons;
  armor: ArmorItem | null;
  name: string;
  description: string;
  primaryExperience: Experience;
  secondaryExperience: Experience;
  domainCards: DomainCardItem[];
};

/* ---------- SAMPLE DATA ---------- */

const classes: ClassItem[] = [
  { id: "guardian", name: "Guardian", description: "A stalwart protector who stands between allies and danger, using defensive magic and martial prowess to shield others.", baseHp: 7, baseEvasion: 9, domains: ["blade", "valor"] },
  { id: "ranger", name: "Ranger", description: "A skilled tracker and hunter who excels in wilderness survival and can form bonds with animal companions.", baseHp: 6, baseEvasion: 12, domains: ["bone", "sage"] },
  { id: "sorcerer", name: "Sorcerer", description: "A wielder of innate magical power who shapes reality through pure will and channels raw arcane energy.", baseHp: 6, baseEvasion: 10, domains: ["arcana", "midnight"]  },
];

const specializations: SpecializationsItem[] = [
  { id: "stalwart", 
    name: "Stalwart", 
    description: "Unwavering defenders who excel at protecting allies, using their presence and determination to shield others from harm.",
    modifications: [
        {id: "Unwavering", name: "Unwavering", description: "Gain a permanent +1 bonus to your damage thresholds."},
        {id: "Iron Will", name: "Iron Will", description: "When you take physical damage, you can mark an additional Armor Slot to reduce the severity."}]
 },
  { id: "vengeance", 
    name: "Vengeance", 
    description: "Fierce protectors driven by righteous fury, pursuing those who would harm the innocent with relentless determination.",
    modifications: [
        {id: "At Ease", name: "At Ease", description: "Gain an additional Stress slot."},
        {id: "Revenge", name: "Revenge", description: "When an adversary within Melee range succeeds on an attack against you, you can mark 2 Stress to force the attacker to mark a Hit Point."}]
 }
];

const ancestries: AncestriesItem[] = [
  { id: "human", name: "Human", description: "Humans are most easily recognized by their dexterous hands, rounded ears, and bodies built for endurance. Their average height ranges from just under 5 feet to about 6 ½ feet. They have a wide variety of builds and are physically adaptable, adjusting to harsh climates with relative ease.",
    modifications: [{id: "High Stamina" ,name: "High Stamina", description: "Gain an additional Stress slot at character creation." },{id: "Adaptability" ,name: "Adaptability", description: "When you fail a roll that utilized one of your Experiences, you can mark a Stress to reroll." }] },
  { id: "elf", name: "Elf", description: "Elves are typically tall humanoids with pointed ears and acutely attuned senses. Their ears vary in size and pointed shape, and as they age, the tips begin to droop. While elves come in a wide range of body types, they are all fairly tall, with heights ranging from about 6 to 6 ½ feet.",
    modifications: [{id: "Quick Reactions" ,name: "Quick Reactions", description: "Mark a Stress to gain advantage on a reaction roll." },{id: "Celestial Trance" ,name: "Celestial Trance", description: "During a rest, you can drop into a trance to choose an additional downtime move." }] },
  { id: "dwarf", name: "Dwarf", description: "Dwarves are most easily recognized as short humanoids with square frames, dense musculature, and thick hair. Their average height ranges from 4 to 5 ½ feet, and they are often broad in proportion to their stature. Their skin and nails contain a high amount of keratin, making them naturally resilient.",
    modifications: [{id: "Thick Skin" ,name: "Thick Skin", description: "When you take Minor damage, you can mark 2 Stress instead of marking a Hit Point." },{id: "Increased Fortitude" ,name: "Thick Skin", description: "Spend 3 Hope to halve incoming physical damage." }] },
];

const communities: CommunityItem[] = [
  { id: "highborn", name: "Highborn", description: "Being part of a highborne community means you're accustomed to a life of elegance, opulence, and prestige within the upper echelons of society. Traditionally, members of a highborne community possess incredible material wealth. While this can take a variety of forms depending on the community—including gold and other minerals, land, or controlling the means of production—this status always comes with power and influence", 
    modifications: { id: "Privilege", name:"Privilege", description: "You have advantage on rolls to consort with nobles, negotiate prices, or leverage your reputation to get what you want."}, traits: ["amiable", "candid", "conniving", "enterprising", "ostentatious", "unflappable"] },
  { id: "Wildborne", name: "Wildborne", description: "Being part of a wildborne community means you lived deep within the forest. Wildborne communities are defined by their dedication to the conservation of their homelands, and many have strong religious or cultural ties to the fauna they live among. This results in unique architectural and technological advancements that favor sustainability over short-term, high-yield results.", 
    modifications: { id: "Lightfoot", name:"Lightfoot", description: "Your movement is naturally silent. You have advantage on rolls to move without being heard."}, traits: ["hardy","loyal","nurturing","reclusive","sagacious","vibrant"]  },
  { id: "Wanderborne", name: "Wanderborne", description: "Being part of a wanderborne community means you've lived as a nomad, forgoing a permanent home and experiencing a wide variety of cultures. Unlike many communities that are defined by their locale, wanderborne are defined by their traveling lifestyle. Because of their frequent migration, wanderborne put less value on the accumulation of material possessions in favor of acquiring information, skills, and connections.", 
    modifications: { id: "Nomadic Pack", name:"Nomadic Pack", description: "Add a Nomadic Pack to your inventory. Once per session, you can spend a Hope to reach into this pack and pull out a mundane item that's useful to your situation. Work with the GM to figure out what item you take out."}, traits: ["inscrutable","magnanimous","mirthful","reliable","savvy","unorthodox"]  },
];

const attributes: AttributeItem[] = [
  { id: "Agility", name: "agility", skills: ["Leap", "Maneuver"] },
  { id: "Strength", name: "strength", skills: ["Smash", "Grapple"] },
  { id: "Finesse", name: "finesse", skills: ["Sneak", "Steal"] },
  { id: "Instinct", name: "instinct", skills: ["Sense", "Track"] },
  { id: "Presence", name: "presence", skills: ["Charm", "Intimidate"] },
  { id: "Knowledge", name: "knowledge", skills: ["Recall", "Analyze"] },
]

const weapons: WeaponItem[] = [
  { id: "Returning Blade", name: "Returning Blade", attribute: "Finesse", range: "Close", damage: {6: 2, flat: 4}, burden: "one-handed", tier: 1, slot: "primary", ability: "Returning", abilityDescription: "When this weapon is thrown within its range, it appears in your hand immediately after the attack"  }
  ,{ id: "Returning Blade2", name: "Returning Blade2", attribute: "Finesse", range: "Close", damage: {6: 2, 8: 5, 12:1, flat: 4}, burden: "one-handed", tier: 2, slot: "primary", ability: "Returning", abilityDescription: "When this weapon is thrown within its range, it appears in your hand immediately after the attack"  }
  ,{ id: "Returning Blade3", name: "Returning Blade3", attribute: "Finesse", range: "Close", damage: {6: 2, flat: 4}, burden: "one-handed", tier: 3, slot: "primary", ability: "Returning", abilityDescription: "When this weapon is thrown within its range, it appears in your hand immediately after the attack"  }
];

const armors: ArmorItem[] = [
  { id: "light", name: "Light Armor", tier: 1, baseScore: 1, threshold1: 5, threshold2: 9, modifiers: {evasion: 1, agility: 1}, ability: "Flexible", abilityDescription: "+1 to Evasion" },
  { id: "heavy", name: "Heavy Armor", tier: 3, baseScore: 5, threshold1: 5, threshold2: 9, modifiers: {strength: 1}, ability: "Flexible", abilityDescription: "+1 to Evasion"  },
];


const domainCards: CardItem[] = [
  { id: "valor", name: "Valor" },
  { id: "midnight", name: "Midnight" },
  { id: "grace", name: "Grace" },
];

/* ---------- MAIN COMPONENT ---------- */

const CharacterCreatorPage: React.FC = () => {
  const [step, setStep] = useState(1);

  const [character, setCharacter] = useState<Character>({
    class: null,
    ancestry: null,
    community: null,
    specialization: null,
    attributes: {
      agility: null,
      strength: null,
      finesse: null,
      instinct: null,
      presence: null,
      knowledge: null,
    },
    name: "",
    description: "",
    primaryExperience: { name: "", description: "" },
    secondaryExperience: { name: "", description: "" },
    domainCards: [],
    weapons: {primary: null, secondary: null},
    armor: null,
  });

  const next = () => setStep((s) => Math.min(10, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const select = useCallback((field: keyof Character, value: any) => setCharacter((stateCharacter) => ({ ...stateCharacter, [field]: value })), []);

  /* ---------- ATTRIBUTE STEP ---------- */

  const attributeValues = [
    {value: 2, id: 0}, 
    {value: 1, id:  1},
    {value: 1, id: 2},
    {value: 0, id:  3},
    {value: 0, id:  4},
    {value: -1, id: 5}
  ];

  /* ---------- DOMAIN CARD TOGGLE ---------- */

  const toggleDomain = (card: CardItem) => {
    const exists = character.domainCards.find((c) => c.id === card.id);

    if (exists) {
      setCharacter({
        ...character,
        domainCards: character.domainCards.filter((c) => c.id !== card.id),
      });
    } else if (character.domainCards.length < 2) {
      setCharacter({
        ...character,
        domainCards: [...character.domainCards, card],
      });
    }
  };

  /* ---------- RENDER ---------- */

  return (
    <div style={{ padding: 40 }}>
      <StepIndicator currentStep={step-1} steps={["Class", "Specialization", "Ancestry", "Community", "Attributes", "Gear", "Info", "Experience", "Domain", "Summary"]} />
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <GridSelector
            title="Select Class"
            items={classes}
            selectedId={character.class?.id}
            onSelect={(id, pos) => select("class", classes[pos])}
            renderItem={(cls, selected) => <ClassCard item={cls} selected={selected} />}
            showNext={character.class !== null}
            onNext={next}
          />
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <GridSelector
            title="Select Specialization"
            items={specializations}
            selectedId={character.specialization?.id}
            onSelect={(id, pos) => select("specialization", specializations[pos])}
            renderItem={(spec, selected) => <SpecializationsCard item={spec} selected={selected} />}
            showBack={true}
            showNext={character.specialization !== null}
            onBack={back}
            onNext={next}
          />
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <GridSelector
            title="Select Ancestry"
            items={ancestries}
            selectedId={character.ancestry?.id}
            onSelect={(id, pos) => select("ancestry", ancestries[pos])}
            renderItem={(ans, selected) => <AncestriesCard item={ans} selected={selected} />}
            showBack={true}
            onBack={back}
            showNext={character.ancestry !== null}
            onNext={next}
            
          />
        </>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <>
          <GridSelector
            title="Select Community"
            items={communities}
            selectedId={character.community?.id}
            onSelect={(id, pos) => select("community", communities[pos])}
            renderItem={(ans, selected) => <CommunityCard item={ans} selected={selected} />}
            showBack={true}
            onBack={back}
            showNext={character.community !== null}
            onNext={next}
            
          />
        </>
      )}

      {/* STEP 5 ATTRIBUTES */}
      {step === 5 && (
        <>
          <AttributesGrid 
            attributes={attributes}
            attributeOptions={attributeValues}
            selected={character.attributes}
            onSelect={(attrs) => {select("attributes", attrs);}}
            showBack={true}
            onBack={back}
            showNext={Object.values(character.attributes).every((v) => v !== null)}
            onNext={next}
          />
        </>
      )}

      {/* STEP 6 */}
      {step === 6 && (
        <>
          <GearCard 
            selected={{weapons: character.weapons, armor: character.armor}}
            showBack={true}
            onBack={back}
            showNext={!!character.weapons?.primary && character.armor !== null}
            onNext={next}
            onSelect={item => {
              setCharacter({...character, ...item });
            }} />
        </>
      )}

      {/* STEP 7 */}
      {step === 7 && (
        <>
          <InfoCard 
            item={{name: character.name, description: character.description}} 
            onSelect={item => {
              setCharacter({...character, ...item });
            }}
            showBack={true}
            onBack={back}
            showNext={character.name !== '' && character.description !== ''}
            onNext={next}
          />
        </>
      )}

      {/* STEP 8 */}
      {step === 8 && (
        <>
          <ExperienceCard 
            item={{primaryExperience: character.primaryExperience, secondaryExperience: character.secondaryExperience}} 
            onSelect={item => setCharacter({...character, ...item })}
            showBack={true}
            onBack={back}
            showNext={character.primaryExperience.name !== '' && character.secondaryExperience.name !== ''}
            onNext={next}
            />
        </>
      )}

      {/* STEP 9 */}
      {step === 9 && (
        <>
          <GridSelector
            title="Select 2 Domain Cards"
            items={domainCards}
            onSelect={(id, pos) => select("community", communities[pos])}
            renderItem={(domain, selected) => <DomainCard
                key={domain.id}
                item={domain}
                selected={character.domainCards.some((c) => c.id === domain.id)}
                onSelect={() => toggleDomain(domain)}
              />}
            showBack={true}
            onBack={back}
            showNext={character.community !== null}
            onNext={next}
          />

          <button onClick={next}>Continue</button>
        </>
      )}

      {/* STEP 10 SUMMARY */}
      {step === 10 && (
        <>
          <SummaryCard character={character} onBack={back} />
        </>
      )}
    </div>
  );
};

export default CharacterCreatorPage;