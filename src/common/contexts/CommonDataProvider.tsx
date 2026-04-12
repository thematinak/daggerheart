import React, { createContext, useContext, useEffect, useState } from "react";
import { CharacterClass } from "../types/CharacterClass";
import { Ancestries } from "../types/Ancestries";
import { CommunityItem } from "../types/Community";
import { Domain } from "../types/Domain";
import { SpecializationsItem } from "../types/Specializations";
import { BackpackItem } from "../types/BackpackItem";
import { WeaponItem } from "../types/Weapon";
import { ArmorItem } from "../types/Armor";
import { fetchAncestries, fetchArmor, fetchBackpackItems, fetchCharacterClasses, fetchCommunities, fetchDomainCards, fetchSpecializations, fetchWeapons } from "../endponts/common";
import { reduceListById } from "../utils/funks";
import NotificationCenter from "../components/NotificationCenter";

export type CommonData = {
  list: {
    ancestries: Ancestries[],
    characterClasses: CharacterClass[],
    communities: CommunityItem[],
    domainCards: Domain[],
    specializations: SpecializationsItem[],
    backpackItems: BackpackItem[],
    weapons: WeaponItem[],
    armor: ArmorItem[]
  },
  byId: {
    ancestries: {[key: string]: Ancestries};
    characterClasses: {[key: string]: CharacterClass};
    communities: {[key: string]: CommunityItem};
    domainCards: {[key: string]: Domain};
    specializations: {[key: string]: SpecializationsItem};
    backpackItems: {[key: string]: BackpackItem};
    weapons: {[key: string]: WeaponItem};
    armor: {[key: string]: ArmorItem};
  }
};

export type NotificationType = "info" | "warning" | "error";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  durationMs: number;
};

export type ShowNotificationInput = {
  type?: NotificationType;
  title?: string;
  message: string;
  durationMs?: number;
};

type CommonDataContextType = {
  commonData: CommonData;
  refreshCommonData: () => Promise<void>;
  notifications: NotificationItem[];
  showNotification: (notification: ShowNotificationInput) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};

const COMMON_DATA_DEFAULT: CommonData = {
  list: {
      ancestries: [],
      characterClasses: [],
      communities: [],
      domainCards: [],
      specializations: [],
      backpackItems: [],
      weapons: [],
      armor: []
    },
    byId: {
      ancestries: {},
      characterClasses: {},
      communities: {},
      domainCards: {},
      specializations: {},
      backpackItems: {},
      weapons: {},
      armor: {}
    }
}

const CommonDataContext = createContext<CommonDataContextType>({
  commonData: {...COMMON_DATA_DEFAULT},
    refreshCommonData: async () => {},
    notifications: [],
    showNotification: () => "",
    removeNotification: () => {},
    clearNotifications: () => {},
});

const DEFAULT_NOTIFICATION_DURATION_MS = 15000;

export const CommonDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [commonData, setCommonData] = useState<CommonData>(() => ({...COMMON_DATA_DEFAULT}));
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshCommonData = React.useCallback(async () => {
    try {
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
        fetchAncestries(),
        fetchCharacterClasses(),
        fetchCommunities(),
        fetchDomainCards(),
        fetchSpecializations(),
        fetchBackpackItems(),
        fetchWeapons(),
        fetchArmor()
      ]);

      setCommonData({ 
        list: {
          ancestries: ancestries,
          characterClasses: classes,
          communities: communities,
          domainCards: domainCards,
          specializations: specializations,
          backpackItems: backpackItems,
          weapons: weapons,
          armor: armor
        },
        byId: {
          ancestries: reduceListById(ancestries),
          characterClasses: reduceListById(classes),
          communities: reduceListById(communities),
          domainCards: reduceListById(domainCards),
          specializations: reduceListById(specializations),
          backpackItems: reduceListById(backpackItems),
          weapons: reduceListById(weapons),
          armor: reduceListById(armor)
        }
      });

    } catch (error) {
      console.error("Failed to fetch common data:", error);
    }
  }, []);

  useEffect(() => {
    refreshCommonData();
  }, [refreshCommonData]);

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  }, []);

  const clearNotifications = React.useCallback(() => {
    setNotifications([]);
  }, []);

  const showNotification = React.useCallback((notification: ShowNotificationInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    setNotifications((current) => [
      ...current,
      {
        id,
        type: notification.type || "info",
        title: notification.title,
        message: notification.message,
        durationMs: notification.durationMs ?? DEFAULT_NOTIFICATION_DURATION_MS,
      },
    ]);

    return id;
  }, []);


  return (
    <CommonDataContext.Provider
      value={{
        commonData,
        refreshCommonData,
        notifications,
        showNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
      <NotificationCenter notifications={notifications} onClose={removeNotification} />
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

export const useNotifications = () => {
  const { notifications, showNotification, removeNotification, clearNotifications } = useCommonData();

  return {
    notifications,
    showNotification,
    removeNotification,
    clearNotifications,
    showInfo: (message: string, title?: string) =>
      showNotification({ type: "info", message, title }),
    showWarning: (message: string, title?: string) =>
      showNotification({ type: "warning", message, title }),
    showError: (message: string, title?: string) =>
      showNotification({ type: "error", message, title }),
  };
};
