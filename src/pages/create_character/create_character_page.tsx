import React, { use, useCallback, useEffect, useState } from "react";
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
import { Domain } from "../../common/types/Domain";
import { BackpackItem } from "../../common/types/BackpackItem";
import { BackpackSelectorCard } from "./components/BackpackSelectorCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../common/contexts/AuthProvider";
import { useCommonData } from "../../common/contexts/CommonDataProvider";

/* ---------- TYPES ---------- */


/* ---------- SAMPLE DATA ---------- */


function generateQueryParams(level: number, domains: string[]): string {
  const cleaned: Record<string, string> = {};
  if (level) cleaned.level = String(level);
  if (domains.length > 0) cleaned.domain_id = domains.join(",");

  return new URLSearchParams(cleaned).toString();
}

const attributes: AttributeItem[] = [
  { id: "Agility", name: "agility", skills: ["Leap", "Maneuver"] },
  { id: "Strength", name: "strength", skills: ["Smash", "Grapple"] },
  { id: "Finesse", name: "finesse", skills: ["Sneak", "Steal"] },
  { id: "Instinct", name: "instinct", skills: ["Sense", "Track"] },
  { id: "Presence", name: "presence", skills: ["Charm", "Intimidate"] },
  { id: "Knowledge", name: "knowledge", skills: ["Recall", "Analyze"] },
]


/* ---------- MAIN COMPONENT ---------- */

const CharacterCreatorPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { commonData } = useCommonData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [character, setCharacter] = useState<Character>({
     user_id: user?.id || 0,
    level: 1,
    bank: 0,
    class: null,
    backpack: [],
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
    weaponInventory: [],
    armor: null,
    armorInventory: [],
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

  const next = () => setStep((s) => Math.min(11, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const select = useCallback((field: keyof Character, value: any) => setCharacter((stateCharacter) => ({ ...stateCharacter, [field]: value })), []);
  const createCharacter = useCallback(() => {
    async function postCharacter() {
      try {
        const res = await fetch("http://pecen.eu/daggerheart/api1/create_character.php", {
          method: "POST",
          body: JSON.stringify({
            ...character,
            user_id: user?.id,
          }),
        });
        const resBody = await res.json();
        if (resBody.success) {
          navigate("/");
        } else {
          throw new Error(resBody.error || "Failed to create character");
        }
      } catch (error) {
        console.error("Error creating character:", error);
      }
    }
    postCharacter();
    
  }, [character, navigate]);

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
      <StepIndicator onStepSelect={(stepIndex: number) => setStep(stepIndex + 1)} currentStep={step-1} steps={["Class", "Specialization", "Ancestry", "Community", "Attributes", "Gear", "Info", "Experience", "Domain", "Backpack", "Summary" ]} />
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <GridSelector<CharacterClass>
            title="Select Class"
            items={Object.keys(commonData.characterClasses).map((key) => commonData.characterClasses[key])}
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
            items={Object.keys(commonData.specializations).map((key) => commonData.specializations[key]).filter((spec) => spec.classId === character.class?.id)}
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
            items={Object.keys(commonData.ancestries).map((key) => commonData.ancestries[key])}
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
            items={Object.keys(commonData.communities).map((key) => commonData.communities[key])}
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
            items={commonData.domainCards.filter(card => card.level === 1 && character.class?.domains.includes(card.domainId))}
            onSelect={(selected, pos) => {}}
            renderItem={(domain, selected) => <DomainCard
                key={domain.id}
                item={domain}
                selected={character.domainCards.some((c) => c.id === domain.id)}
                onSelect={() => toggleDomain(domain)}
              />}
            showBack={true}
            onBack={back}
            showNext={character.domainCards.length === 2}
            onNext={next}
          />
        </>
      )}

      {/* STEP 10 BACKPACK */}
      {step === 10 && (
        <>
          <BackpackSelectorCard character={character} onBack={back} showNext={true} onNext={next} onSelect={(item: BackpackItem[], bank: number) => setCharacter({...character, backpack: item, bank })} />
        </>
      )}

      {/* STEP 11 SUMMARY */}
      {step === 11 && (
        <>
          <SummaryCard character={character} onBack={back} onCreate={createCharacter} />
        </>
      )}
    </div>
  );
};

export default CharacterCreatorPage;