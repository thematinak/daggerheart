import React, { useCallback, useEffect, useState } from "react";
import ClassCard from "./components/ClassCard";
import SpecializationsCard from "./components/SpecializationsCard";
import AncestriesCard from "./components/AncestriesCard";
import CommunityCard from "./components/CommunityCard";
import InfoCard from "./components/InfoCard";
import ExperienceCard from "./components/ExperiencesCard";
import DomainCard from "./components/DomainCard";
import GearCard from "./components/GearCard";
import { GridSelector } from "../../common/components/GridSelector";
import { AttributeItem, AttributesGrid } from "./components/AttributeGrid";
import StepIndicator from "./components/StepIndicator";
import SummaryCard from "./components/SummaryCard";
import { Character } from "../../common/types/Character";
import { CharacterClass } from "../../common/types/CharacterClass";
import { SpecializationsItem } from "../../common/types/Specializations";
import { Ancestries } from "../../common/types/Ancestries";
import { CommunityItem } from "../../common/types/Community";
import { WeaponItem } from "../../common/types/Weapon";
import { ArmorItem } from "../../common/types/Armor";
import { Domain } from "../../common/types/Domain";

/* ---------- TYPES ---------- */

type CardItem = {
  id: string;
  name: string;
  description?: string;
};


/* ---------- SAMPLE DATA ---------- */

const specializations: SpecializationsItem[] = [
  { id: "stalwart", 
    name: "Stalwart", 
    description: "Unwavering defenders who excel at protecting allies, using their presence and determination to shield others from harm.",
    modifications: [
        {id: "Unwavering", name: "Unwavering", description: "Gain a permanent +1 bonus to your damage thresholds.", modifiers:{}},
        {id: "Iron Will", name: "Iron Will", description: "When you take physical damage, you can mark an additional Armor Slot to reduce the severity.", modifiers:{}}]
 },
  { id: "vengeance", 
    name: "Vengeance", 
    description: "Fierce protectors driven by righteous fury, pursuing those who would harm the innocent with relentless determination.",
    modifications: [
        {id: "At Ease", name: "At Ease", description: "Gain an additional Stress slot.", modifiers:{}},
        {id: "Revenge", name: "Revenge", description: "When an adversary within Melee range succeeds on an attack against you, you can mark 2 Stress to force the attacker to mark a Hit Point.", modifiers:{}}]
 }
];

const ancestries: Ancestries[] = [
  { id: "human", name: "Human", description: "Humans are most easily recognized by their dexterous hands, rounded ears, and bodies built for endurance. Their average height ranges from just under 5 feet to about 6 ½ feet. They have a wide variety of builds and are physically adaptable, adjusting to harsh climates with relative ease.", modifiers:{},
    modifications: [{id: "High Stamina" ,name: "High Stamina", description: "Gain an additional Stress slot at character creation." },{id: "Adaptability" ,name: "Adaptability", description: "When you fail a roll that utilized one of your Experiences, you can mark a Stress to reroll." }] },
  { id: "elf", name: "Elf", description: "Elves are typically tall humanoids with pointed ears and acutely attuned senses. Their ears vary in size and pointed shape, and as they age, the tips begin to droop. While elves come in a wide range of body types, they are all fairly tall, with heights ranging from about 6 to 6 ½ feet.", modifiers:{},
    modifications: [{id: "Quick Reactions" ,name: "Quick Reactions", description: "Mark a Stress to gain advantage on a reaction roll." },{id: "Celestial Trance" ,name: "Celestial Trance", description: "During a rest, you can drop into a trance to choose an additional downtime move." }] },
  { id: "dwarf", name: "Dwarf", description: "Dwarves are most easily recognized as short humanoids with square frames, dense musculature, and thick hair. Their average height ranges from 4 to 5 ½ feet, and they are often broad in proportion to their stature. Their skin and nails contain a high amount of keratin, making them naturally resilient.", modifiers:{},
    modifications: [{id: "Thick Skin" ,name: "Thick Skin", description: "When you take Minor damage, you can mark 2 Stress instead of marking a Hit Point." },{id: "Increased Fortitude" ,name: "Thick Skin", description: "Spend 3 Hope to halve incoming physical damage." }] },
];

const communities: CommunityItem[] = [
  { id: "highborn", name: "Highborn", description: "Being part of a highborne community means you're accustomed to a life of elegance, opulence, and prestige within the upper echelons of society. Traditionally, members of a highborne community possess incredible material wealth. While this can take a variety of forms depending on the community—including gold and other minerals, land, or controlling the means of production—this status always comes with power and influence", modifiers:{}, 
    modifications: { id: "Privilege", name:"Privilege", description: "You have advantage on rolls to consort with nobles, negotiate prices, or leverage your reputation to get what you want."}, traits: ["amiable", "candid", "conniving", "enterprising", "ostentatious", "unflappable"] },
  { id: "Wildborne", name: "Wildborne", description: "Being part of a wildborne community means you lived deep within the forest. Wildborne communities are defined by their dedication to the conservation of their homelands, and many have strong religious or cultural ties to the fauna they live among. This results in unique architectural and technological advancements that favor sustainability over short-term, high-yield results.", modifiers:{}, 
    modifications: { id: "Lightfoot", name:"Lightfoot", description: "Your movement is naturally silent. You have advantage on rolls to move without being heard."}, traits: ["hardy","loyal","nurturing","reclusive","sagacious","vibrant"]  },
  { id: "Wanderborne", name: "Wanderborne", description: "Being part of a wanderborne community means you've lived as a nomad, forgoing a permanent home and experiencing a wide variety of cultures. Unlike many communities that are defined by their locale, wanderborne are defined by their traveling lifestyle. Because of their frequent migration, wanderborne put less value on the accumulation of material possessions in favor of acquiring information, skills, and connections.", modifiers:{}, 
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
  { id: "Returning Blade", name: "Returning Blade", attribute: "Finesse", range: "Close", damage: {6: 2, flat: 4}, burden: "one-handed", tier: 1, slot: "primary", ability: "Returning", abilityDescription: "When this weapon is thrown within its range, it appears in your hand immediately after the attack", modifiers:{}  }
  ,{ id: "Returning Blade2", name: "Returning Blade2", attribute: "Finesse", range: "Close", damage: {6: 2, 8: 5, 12:1, flat: 4}, burden: "one-handed", tier: 2, slot: "primary", ability: "Returning", abilityDescription: "When this weapon is thrown within its range, it appears in your hand immediately after the attack", modifiers:{}  }
  ,{ id: "Returning Blade3", name: "Returning Blade3", attribute: "Finesse", range: "Close", damage: {6: 2, flat: 4}, burden: "one-handed", tier: 3, slot: "primary", ability: "Returning", abilityDescription: "When this weapon is thrown within its range, it appears in your hand immediately after the attack", modifiers:{}  }
];

const armors: ArmorItem[] = [
  { id: "light", name: "Light Armor", tier: 1, baseScore: 1, threshold1: 5, threshold2: 9, modifiers: {evasion: 1, agility: 1}, ability: "Flexible", abilityDescription: "+1 to Evasion" },
  { id: "heavy", name: "Heavy Armor", tier: 3, baseScore: 5, threshold1: 5, threshold2: 9, modifiers: {strength: 1}, ability: "Flexible", abilityDescription: "+1 to Evasion"  },
];


const domainCards: Domain[] = [
  { id: "valor", name: "Valor", description: "", modifiers: {} },
  { id: "midnight", name: "Midnight", description: "", modifiers: {} },
  { id: "grace", name: "Grace", description: "", modifiers: {} },
];

/* ---------- MAIN COMPONENT ---------- */

const CharacterCreatorPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [classes, setSetClasses] = useState<CharacterClass[]>([]);

  const [character, setCharacter] = useState<Character>({
    level: 1,
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
    customAttributes: {},
    countedStats: {
      evasion: 0,
      maxArmor: 0,
      armor: 0,

      agility: 0,
      strength: 0,
      finesse: 0,
      instinct: 0,
      presence: 0,
      knowledge: 0,

      threshold1: 0,
      threshold2: 0,

      maxHp: 0,
      hp: 0,
      maxStress: 0,
      stress: 0
    }
  });

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch("http://pecen.eu/daggerheart/api1/classes.php");
          if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
          const data: CharacterClass[] = await res.json();
          setSetClasses(data);
        } catch (err: any) {
          console.error(err.message || "Unknown error");
        }
      };
  
      fetchData();
    }, []);

  const next = () => setStep((s) => Math.min(10, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const select = useCallback((field: keyof Character, value: any) => setCharacter((stateCharacter) => ({ ...stateCharacter, [field]: value })), []);

  /* ---------- DOMAIN CARD TOGGLE ---------- */

  const toggleDomain = (card: Domain) => {
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
          <GridSelector<CharacterClass>
            title="Select Class"
            endpoint="http://pecen.eu/daggerheart/api1/classes.php"
            // items={classes}
            selectedId={character.class?.id}
            onSelect={(selected, pos) => select("class", selected)}
            renderItem={(cls, selected) => <ClassCard item={cls} selected={selected} />}
            showNext={character.class !== null}
            onNext={next}
          />
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <GridSelector<SpecializationsItem>
            title="Select Specialization"
            endpoint={`http://pecen.eu/daggerheart/api1/specializations.php?class_id=${character.class?.id}`}
            selectedId={character.specialization?.id}
            onSelect={(id, pos) => select("specialization", id)}
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
          <GridSelector<Ancestries>
            title="Select Ancestry"
            endpoint="http://pecen.eu/daggerheart/api1/ancestries.php"
            selectedId={character.ancestry?.id}
            onSelect={(selected, pos) => select("ancestry", selected)}
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
          <GridSelector<CommunityItem>
            title="Select Community"
            endpoint="http://pecen.eu/daggerheart/api1/communities.php"
            selectedId={character.community?.id}
            onSelect={(selected, pos) => select("community", selected)}
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
      { step === 8 && (
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
      { step === 9 && (
        <>
          <GridSelector<Domain>
            title="Select 2 Domain Cards"
            endpoint=""
            // items={domainCards}
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