import React, { createContext, useContext, useEffect, useState } from "react";
import { CharacterClass } from "../types/CharacterClass";
import { Ancestries } from "../types/Ancestries";
import { CommunityItem } from "../types/Community";
import { Domain } from "../types/Domain";
import { SpecializationsItem } from "../types/Specializations";

export type CommonData = {
    ancestries: {[key: string]: Ancestries};
    characterClasses: {[key: string]: CharacterClass};
    communities: {[key: string]: CommunityItem};
    domainCards: Domain[];
    specializations: {[key: string]: SpecializationsItem};
};

const reduceListById = (l: any[]) => l.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

type CommonDataContextType = {
  commonData: CommonData;
};

const CommonDataContext = createContext<CommonDataContextType>({
    commonData: {
      ancestries: {},
      characterClasses: {},
      communities: {},
      domainCards: [],
      specializations: {}
    }
});

export const CommonDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [commonData, setCommonData] = useState<CommonData>(() => {
    return {
      ancestries: {},
      characterClasses: {},
      communities: {},
      domainCards: [],
      specializations: {}
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ancestriesRes, classesRes, communitiesRes, domainCardsRes, specializationsRes] = await Promise.all([
          fetch("http://pecen.eu/daggerheart/api1/ancestries.php"),
          fetch("http://pecen.eu/daggerheart/api1/classes.php"),
          fetch("http://pecen.eu/daggerheart/api1/communities.php"),
          fetch("http://pecen.eu/daggerheart/api1/domain_cards.php"),
          fetch("http://pecen.eu/daggerheart/api1/specializations.php")
        ]);

        const [ancestries, classes, communities, domainCards, specializations] = await Promise.all([
          ancestriesRes.json(),
          classesRes.json(),
          communitiesRes.json(),
          domainCardsRes.json(),
          specializationsRes.json()
        ]);

        setCommonData({
          ancestries: reduceListById(ancestries),
          characterClasses: reduceListById(classes),
          communities: reduceListById(communities),
          domainCards: domainCards,
          specializations: reduceListById(specializations)
        });

      } catch (error) {
        console.error("Failed to fetch common data:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <CommonDataContext.Provider value={{commonData}}>
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