/**
 * Delete this file if no store is used.
 * This is used to connect nuxt store with browser storage.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import Cookies from "js-cookie";
import { useCookie } from "#app";
import { PiniaPluginContext } from "pinia";

/**
 * Interface for defining a persist strategy.
 */
export interface PersistStrategy {
  key?: string;
  storage?: string;
  paths?: string[];
}

/**
 * Interface for persist options.
 */
export interface PersistOptions {
  enabled: true;
  strategies?: PersistStrategy[];
}

// Type aliases
type Store = PiniaPluginContext["store"];
type PartialState = Partial<Store["$state"]>;

// Augment the DefineStoreOptionsBase interface in "pinia" module
declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: PersistOptions;
  }
}

// Default storage method
export const defaultStorage = "localStorage";

/**
 * Update the storage based on the persist strategy.
 * @param {PersistStrategy} strategy - The persist strategy.
 * @param {Store} store - The Pinia store.
 */
export const updateStorage = (strategy: PersistStrategy, store: Store) => {
  // Determine the storage method
  const storage = strategy.storage || defaultStorage;
  // Determine the key for storing the state
  const storeKey = strategy.key || store.$id;

  if (strategy.paths) {
    // If specific paths are defined in the strategy, extract the partial state for those paths
    const partialState = strategy.paths.reduce((finalObj, key) => {
      finalObj[key] = store.$state[key];
      return finalObj;
    }, {} as PartialState);
    // Store the partial state in the storage
    setItem(storage, storeKey, JSON.stringify(partialState));
  } else {
    // If no specific paths are defined, store the entire state of the store
    setItem(storage, storeKey, JSON.stringify(store.$state));
  }
};

/**
 * Set an item in the specified storage.
 * @param {string} strategy - The storage strategy ("cookie", "localStorage", or "sessionStorage").
 * @param {string} key - The key to set.
 * @param {any} value - The value to set.
 */
export const setItem = (strategy: string, key: string, value: any) => {
  if (strategy === "cookie") {
    // If the storage strategy is "cookie", set the value using Cookies.set()
    return Cookies.set(key, value);
  } else if (strategy === "localStorage") {
    // If the storage strategy is "localStorage", set the value using localStorage.setItem()
    return localStorage.setItem(key, value);
  } else if (strategy === "sessionStorage") {
    // If the storage strategy is "sessionStorage", set the value using sessionStorage.setItem()
    return sessionStorage.setItem(key, value);
  }
};

/**
 * Get an item from the specified storage.
 * @param {string} strategy - The storage strategy ("cookie", "localStorage", or "sessionStorage").
 * @param {string} key - The key to get.
 * @returns {any} - The retrieved item.
 */
export const getItem = (strategy: string, key: string) => {
  if (process.server) {
    // If running on the server-side
    if (strategy === "cookie") {
      // If the storage strategy is "cookie", retrieve the value from the cookie using useCookie()
      const cookie = useCookie(key);
      return JSON.stringify(cookie.value);
    }
  } else {
    // If running on the client-side
    if (strategy === "localStorage") {
      // If the storage strategy is "localStorage", retrieve the value from localStorage
      return localStorage.getItem(key);
    }
    if (strategy === "sessionStorage") {
      // If the storage strategy is "sessionStorage", retrieve the value from sessionStorage
      return sessionStorage.getItem(key);
    }
  }
  // If the storage strategy is not applicable or the item is not found, return undefined
  return undefined;
};
