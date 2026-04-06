import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Backpack, ScrollText, Swords } from "lucide-react";
import SummaryCard from "../create_character/components/SummaryCard";
import { useCommonData } from "../../common/contexts/CommonDataProvider";
import { Character } from "../../common/types/Character";
import { CharacterClass } from "../../common/types/CharacterClass";
import { SpecializationsItem } from "../../common/types/Specializations";
import { Ancestries } from "../../common/types/Ancestries";
import { CommunityItem } from "../../common/types/Community";
import { Domain } from "../../common/types/Domain";
import { WeaponItem } from "../../common/types/Weapon";
import { ArmorItem } from "../../common/types/Armor";
import { BackpackItem } from "../../common/types/BackpackItem";
import { Attributes } from "../create_character/components/AttributeGrid";
import { StatModifiers } from "../../common/types/StatModifiers";
import styles from "../../common/types/cssColor";
import { buildStatsFromCharacter } from "../../common/components/StatsBar";
import CombatTab from "./components/CombatTab";
import BackpackTab from "./components/BackpackTab";

type CharacterDetailResponse = {
  id: string;
  userId: number;
  level: number;
  bank: number;
  name: string;
  description: string;
  class: {
    id: string;
    name: string;
    description: string;
    baseHp: number;
    baseEvasion: number;
    modifiers: StatModifiers;
    hopeFeature: string;
    hopeFeatureDescription: string;
    classItem: string;
  };
  specialization: {
    id: string;
    name: string;
    description: string;
  };
  ancestry: {
    id: string;
    name: string;
    description: string;
    modifiers: StatModifiers;
  };
  community: {
    id: string;
    name: string;
    description: string;
    modifiers: StatModifiers;
  };
  attributes: Partial<Attributes>;
  customAttributes: StatModifiers;
  primaryExperience: {
    name: string;
    description: string;
  };
  secondaryExperience: {
    name: string;
    description: string;
  };
  weapons: {
    primary: WeaponItem | null;
    secondary: WeaponItem | null;
  };
  armor: ArmorItem | null;
  weaponInventory: WeaponItem[];
  armorInventory: ArmorItem[];
  domainCards: Array<{
    id: string | number;
    level: number;
    name: string;
    description: string;
    domainId: string;
  }>;
  backpack: BackpackItem[];
};

const emptyCharacterClass = (data: NonNullable<CharacterDetailResponse["class"]>): CharacterClass => ({
  id: data.id,
  name: data.name,
  description: data.description,
  baseHp: data.baseHp,
  baseEvasion: data.baseEvasion,
  domains: [],
  modifiers: data.modifiers || {},
  classItem: {
    id: "class-item",
    name: data.classItem || "Class Item",
    description: "",
    modifiers: {},
    roll: 0,
  },
  hopeFeature: data.hopeFeature,
  hopeFeatureDescription: data.hopeFeatureDescription,
});

const emptySpecialization = (
  data: NonNullable<CharacterDetailResponse["specialization"]>
): SpecializationsItem => ({
  id: data.id,
  name: data.name,
  description: data.description,
  classId: "",
  modifications: [],
});

const emptyAncestry = (data: NonNullable<CharacterDetailResponse["ancestry"]>): Ancestries => ({
  id: data.id,
  name: data.name,
  description: data.description,
  modifications: [],
  modifiers: data.modifiers || {},
});

const emptyCommunity = (
  data: NonNullable<CharacterDetailResponse["community"]>
): CommunityItem => ({
  id: data.id,
  name: data.name,
  description: data.description,
  modifications: { id: "", name: "", description: "" },
  traits: [],
  modifiers: data.modifiers || {},
});

const emptyDomain = (data: CharacterDetailResponse["domainCards"][number]): Domain => ({
  id: String(data.id),
  level: data.level,
  name: data.name,
  description: data.description,
  domainId: data.domainId,
  modifiers: {},
});

const normalizeAttributes = (attributes?: Partial<Attributes>): Attributes => ({
  agility: attributes?.agility ?? null,
  strength: attributes?.strength ?? null,
  finesse: attributes?.finesse ?? null,
  instinct: attributes?.instinct ?? null,
  presence: attributes?.presence ?? null,
  knowledge: attributes?.knowledge ?? null,
});

type DetailTab = "overview" | "actions" | "backpack";

const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { commonData } = useCommonData();
  const [characterResponse, setCharacterResponse] = useState<CharacterDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  useEffect(() => {
    if (!id) {
      setError("Character id is missing.");
      setLoading(false);
      return;
    }

    let active = true;

    const loadCharacter = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://pecen.eu/daggerheart/api1/character_detail.php?id=${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load character");
        }

        if (active) {
          setCharacterResponse(data);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "Failed to load character");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCharacter();

    return () => {
      active = false;
    };
  }, [id]);

  const character = useMemo<Character | null>(() => {
    if (!characterResponse) {
      return null;
    }

    const resolvedClass =
      (characterResponse.class?.id && commonData.characterClasses[characterResponse.class.id]) ||
      (characterResponse.class ? emptyCharacterClass(characterResponse.class) : null);

    const resolvedSpecialization =
      (characterResponse.specialization?.id &&
        commonData.specializations[characterResponse.specialization.id]) ||
      (characterResponse.specialization ? emptySpecialization(characterResponse.specialization) : null);

    const resolvedAncestry =
      (characterResponse.ancestry?.id && commonData.ancestries[characterResponse.ancestry.id]) ||
      (characterResponse.ancestry ? emptyAncestry(characterResponse.ancestry) : null);

    const resolvedCommunity =
      (characterResponse.community?.id && commonData.communities[characterResponse.community.id]) ||
      (characterResponse.community ? emptyCommunity(characterResponse.community) : null);

    const resolvedDomains = characterResponse.domainCards.map((domainCard) => {
      const fromCommonData = commonData.domainCards.find(
        (commonDomain) => String(commonDomain.id) === String(domainCard.id)
      );
      return fromCommonData || emptyDomain(domainCard);
    });

    return {
      user_id: characterResponse.userId,
      level: characterResponse.level,
      bank: characterResponse.bank,
      name: characterResponse.name,
      description: characterResponse.description || "",
      class: resolvedClass,
      backpack: characterResponse.backpack || [],
      specialization: resolvedSpecialization,
      ancestry: resolvedAncestry,
      community: resolvedCommunity,
      attributes: normalizeAttributes(characterResponse.attributes),
      customAttributes: characterResponse.customAttributes || {},
      weapons: {
        primary: characterResponse.weapons?.primary || null,
        secondary: characterResponse.weapons?.secondary || null,
      },
      weaponInventory: characterResponse.weaponInventory || [],
      armor: characterResponse.armor || null,
      armorInventory: characterResponse.armorInventory || [],
      primaryExperience: characterResponse.primaryExperience || { name: "", description: "" },
      secondaryExperience: characterResponse.secondaryExperience || { name: "", description: "" },
      domainCards: resolvedDomains,
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
        stress: 0,
      },
    };
  }, [characterResponse, commonData]);

  const stats = useMemo(() => (character ? buildStatsFromCharacter(character) : null), [character]);

  if (loading) {
    return (
      <div className={`${styles.tokens.page.section} p-8 text-center`}>
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
          Loading
        </div>
        <p className={`mt-2 ${styles.semantic.muted.text}`}>Preparing character detail...</p>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className={`${styles.tokens.page.section} p-8 text-center`}>
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600">
          Unable To Load
        </div>
        <p className="mt-2 text-sm text-slate-600">{error || "Character not found."}</p>
        <div className="mt-5">
          <button
            onClick={() => navigate("/")}
            className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}
          >
            Back To Characters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={`${styles.tokens.page.section} flex flex-col gap-5 p-5 sm:p-6 lg:p-8`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
              Character Detail
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {character.name}
            </h1>
            <p className={`mt-3 max-w-2xl ${styles.tokens.page.subtitle}`}>
              Switch between overview, combat-ready information, and backpack contents.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}
          >
            Back To Characters
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <TabButton
            label="Overview"
            icon={<ScrollText size={16} />}
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <TabButton
            label="Actions"
            icon={<Swords size={16} />}
            active={activeTab === "actions"}
            onClick={() => setActiveTab("actions")}
          />
          <TabButton
            label="Backpack"
            icon={<Backpack size={16} />}
            active={activeTab === "backpack"}
            onClick={() => setActiveTab("backpack")}
          />
        </div>
      </div>

      {activeTab === "overview" && <SummaryCard character={character} onBack={() => navigate("/")} />}
      {activeTab === "actions" && stats && <CombatTab character={character} stats={stats} />}
      {activeTab === "backpack" && <BackpackTab character={character} />}
    </div>
  );
};

const TabButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}> = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={[
      styles.tokens.button.base,
      active ? styles.tokens.button.primary : styles.tokens.button.secondary,
      "gap-2",
    ].join(" ")}
  >
    {icon}
    {label}
  </button>
);

export default CharacterDetailPage;
