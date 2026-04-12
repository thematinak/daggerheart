import React, { createContext, useContext, useEffect, useState } from "react";
import { CharacterClass } from "../types/CharacterClass";
import { Ancestries } from "../types/Ancestries";
import { CommunityItem } from "../types/Community";
import { Domain } from "../types/Domain";
import { SpecializationsItem } from "../types/Specializations";
import { BackpackItem } from "../types/BackpackItem";
import { WeaponItem } from "../types/Weapon";
import { ArmorItem } from "../types/Armor";

export type CommonData = {
    ancestries: {[key: string]: Ancestries};
    characterClasses: {[key: string]: CharacterClass};
    communities: {[key: string]: CommunityItem};
    domainCards: Domain[];
    specializations: {[key: string]: SpecializationsItem};
    backpackItems: {[key: string]: BackpackItem};
    weapons: {[key: string]: WeaponItem};
    armor: {[key: string]: ArmorItem};
};

const reduceListById = (l: any[]) => l.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

type CommonDataContextType = {
  commonData: CommonData;
  refreshCommonData: () => Promise<void>;
};

const CommonDataContext = createContext<CommonDataContextType>({
    commonData: {
      ancestries: {},
      characterClasses: {},
      communities: {},
      domainCards: [],
      specializations: {},
      backpackItems: {},
      weapons: {},
      armor: {}
    },
    refreshCommonData: async () => {},
});

export const CommonDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [commonData, setCommonData] = useState<CommonData>(() => {
    return {
      ancestries: {},
      characterClasses: {},
      communities: {},
      domainCards: [],
      specializations: {},
      backpackItems: {},
      weapons: {},
      armor: {}
    };
  });

  const refreshCommonData = React.useCallback(async () => {
    try {
      const [
        ancestriesRes,
        classesRes,
        communitiesRes,
        domainCardsRes,
        specializationsRes,
        backpackItemsRes,
        weaponsRes,
        armorRes
      ] = await Promise.all([
        fetch("http://pecen.eu/daggerheart/api1/ancestries.php"),
        fetch("http://pecen.eu/daggerheart/api1/classes.php"),
        fetch("http://pecen.eu/daggerheart/api1/communities.php"),
        fetch("http://pecen.eu/daggerheart/api1/domain_cards.php"),
        fetch("http://pecen.eu/daggerheart/api1/specializations.php"),
        fetch("http://pecen.eu/daggerheart/api1/backpack_items.php"),
        fetch("http://pecen.eu/daggerheart/api1/weapons.php"),
        fetch("http://pecen.eu/daggerheart/api1/armor.php")
      ]);

      const [
        ancestries,
        classes,
        communities,
        domainCards,
        specializations,
        backpackItems,
        weapons,
        armor
      ] = await Promise.all([
        ancestriesRes.json(),
        classesRes.json(),
        communitiesRes.json(),
        domainCardsRes.json(),
        specializationsRes.json(),
        backpackItemsRes.json(),
        weaponsRes.json(),
        armorRes.json()
      ]);

      setCommonData({
        ancestries: reduceListById(ancestries),
        characterClasses: reduceListById(classes),
        communities: reduceListById(communities),
        domainCards: domainCards,
        specializations: reduceListById(specializations),
        backpackItems: reduceListById(backpackItems),
        weapons: reduceListById(weapons),
        armor: reduceListById(armor)
      });

    } catch (error) {
      console.error("Failed to fetch common data:", error);
    }
  }, []);

  useEffect(() => {
    refreshCommonData();
  }, [refreshCommonData]);


  return (
    <CommonDataContext.Provider value={{commonData, refreshCommonData}}>
      {children}
    </CommonDataContext.Provider>
  );
};

export const useCommonData = () => {
  const context = useContext(CommonDataContext);

  if (!context) {
    throw new Error("useCommonData must be used inside CommonDataProvider");
  }

  return context;
};
