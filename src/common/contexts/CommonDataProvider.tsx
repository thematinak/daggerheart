import React, { createContext, useContext, useEffect, useState } from "react";
import { CharacterClass } from "../types/CharacterClass";
import { Ancestries } from "../types/Ancestries";
import { CommunityItem } from "../types/Community";
import { Domain } from "../types/Domain";
import { SpecializationsItem } from "../types/Specializations";

type CommonData = {
    ancestries: Ancestries[];
    characterClasses: CharacterClass[];
    communities: CommunityItem[];
    domainCards: Domain[];
    specializations: SpecializationsItem[];
};

type CommonDataContextType = {
  commonData: CommonData;
};

const CommonDataContext = createContext<CommonDataContextType>({
    commonData: {
      ancestries: [],
      characterClasses: [],
      communities: [],
      domainCards: [],
      specializations: []
    }
});

export const CommonDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [commonData, setCommonData] = useState<CommonData>(() => {
    return {
      ancestries: [],
      characterClasses: [],
      communities: [],
      domainCards: [],
      specializations: []
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
          ancestries,
          characterClasses: classes,
          communities,
          domainCards,
          specializations
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