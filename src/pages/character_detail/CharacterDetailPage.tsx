import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUp, Backpack, Clock3, Moon, ScrollText, Swords } from "lucide-react";
import SummaryCard from "../create_character/components/SummaryCard";
import { useCommonData } from "../../common/contexts/CommonDataProvider";
import { Character, CurrentStats } from "../../common/types/Character";
import { CharacterClass } from "../../common/types/CharacterClass";
import { SpecializationsItem } from "../../common/types/Specializations";
import { Ancestries } from "../../common/types/Ancestries";
import { CommunityItem } from "../../common/types/Community";
import { Domain } from "../../common/types/Domain";
import { WeaponItem } from "../../common/types/Weapon";
import { ArmorItem } from "../../common/types/Armor";
import { BackpackItem } from "../../common/types/BackpackItem";
import { Attributes } from "../create_character/components/AttributeGrid";
import { Experience } from "../../common/types/Experience";
import { StatModifiers } from "../../common/types/StatModifiers";
import styles from "../../common/types/cssColor";
import { buildStatsFromCharacter } from "../../common/components/StatsBar";
import CombatTab from "./components/CombatTab";
import BackpackTab from "./components/BackpackTab";
import LevelUpModal from "./components/LevelUpModal";
import LongRestModal from "./components/LongRestModal";
import ShortRestModal from "./components/ShortRestModal";
import Eyebrow from "../../common/components/Eyebrow";
import H2 from "../../common/components/H2";

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
  experiences: Experience[];
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
  currentStats: CurrentStats;
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

const normalizeExperiences = (experiences?: Experience[]): Experience[] => {
  const normalized = Array.isArray(experiences)
    ? experiences.filter((experience) => experience && typeof experience === "object")
    : [];

  return normalized.map(item => ({
    name: item.name || "",
    description: item.description || "",
    bonus: typeof item.bonus === "number" ? item.bonus : 2,
  }));
};

type DetailTab = "overview" | "combat" | "backpack";
type CharacterActionModal = "longRest" | "shortRest" | "levelUp" | null;

const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { commonData } = useCommonData();
  const [characterResponse, setCharacterResponse] = useState<CharacterDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [isAdjustingStat, setIsAdjustingStat] = useState(false);
  const [activeModal, setActiveModal] = useState<CharacterActionModal>(null);

  const loadCharacter = useCallback(async () => {
    if (!id) {
      setError("Character id is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://pecen.eu/daggerheart/api1/character_detail.php?id=${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load character");
      }

      setCharacterResponse(data);
    } catch (err: any) {
      setError(err.message || "Failed to load character");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError("Character id is missing.");
      setLoading(false);
      return;
    }

    loadCharacter();
  }, [id, loadCharacter]);

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
      id: characterResponse.id,
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
      experiences: normalizeExperiences(characterResponse.experiences),
      domainCards: resolvedDomains,
      countedStats: {
        evasion: 0,
        maxArmor: 0,
        maxHope: 6,
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
      currentStats: characterResponse.currentStats || {},
    };
  }, [characterResponse, commonData]);

  const stats = useMemo(() => (character ? buildStatsFromCharacter(character) : null), [character]);

  const handleAdjustCurrentStat = useCallback(
    async (stat: "health" | "stress" | "armor" | "hope", action: "add" | "remove") => {
      if (!character) {
        return;
      }

      const maxValue =
        stat === "health"
          ? stats?.maxHp ?? 0
          : stat === "stress"
            ? stats?.maxStress ?? 0
            : stat === "hope"
              ? stats?.maxHope ?? 6
              : stats?.maxArmor ?? 0;

      const currentValue =
        stat === "health"
          ? character.currentStats.hp
          : stat === "stress"
            ? character.currentStats.stress
            : stat === "hope"
              ? character.currentStats.hope
              : character.currentStats.armor;

      if ((action === "remove" && currentValue <= 0) || (action === "add" && currentValue >= maxValue)) {
        return;
      }

      try {
        setIsAdjustingStat(true);

        const response = await fetch("http://pecen.eu/daggerheart/api1/character.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            character_id: character.id,
            commands: [
              {
                action,
                target: stat,
                value: 1,
              },
            ],
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update current stat");
        }

        await loadCharacter();
      } catch (err: any) {
        setError(err.message || "Failed to update current stat");
      } finally {
        setIsAdjustingStat(false);
      }
    },
    [character, stats, loadCharacter]
  );

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
            <Eyebrow eyebrow="Character Detail" />
            <H2>{character.name}</H2>
          </div>

          <div className="flex flex-col gap-3 lg:w-56 lg:items-stretch">
            <CharacterActionButton
              label="Long Rest"
              icon={<Moon size={16} />}
              onClick={() => setActiveModal("longRest")}
            />
            <CharacterActionButton
              label="Short Rest"
              icon={<Clock3 size={16} />}
              onClick={() => setActiveModal("shortRest")}
            />
            <CharacterActionButton
              label="Level Up"
              icon={<ArrowUp size={16} />}
              onClick={() => setActiveModal("levelUp")}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <TabButton
            label="Overview"
            icon={<ScrollText size={16} />}
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <TabButton
            label="Combat"
            icon={<Swords size={16} />}
            active={activeTab === "combat"}
            onClick={() => setActiveTab("combat")}
          />
          <TabButton
            label="Backpack"
            icon={<Backpack size={16} />}
            active={activeTab === "backpack"}
            onClick={() => setActiveTab("backpack")}
          />
        </div>
      </div>

      {activeTab === "overview" && <SummaryCard character={character}  />}
      {activeTab === "combat" && stats && (
        <CombatTab
          character={character}
          stats={stats}
          onAdjustCurrentStat={handleAdjustCurrentStat}
          isAdjustingStat={isAdjustingStat}
        />
      )}
      {activeTab === "backpack" && (
        <BackpackTab
          character={character}
          onCharacterUpdated={loadCharacter}
        />
      )}

      {stats && (
        <LongRestModal
          isOpen={activeModal === "longRest"}
          onClose={() => setActiveModal(null)}
          character={character}
          stats={stats}
          onCharacterUpdated={loadCharacter}
        />
      )}
      {stats && (
        <ShortRestModal
          isOpen={activeModal === "shortRest"}
          onClose={() => setActiveModal(null)}
          character={character}
          stats={stats}
          onCharacterUpdated={loadCharacter}
        />
      )}
      <LevelUpModal isOpen={activeModal === "levelUp"} onClose={() => setActiveModal(null)} />
    </div>
  );
};

const CharacterActionButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ label, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} w-full justify-start gap-2`}
  >
    {icon}
    {label}
  </button>
);

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
