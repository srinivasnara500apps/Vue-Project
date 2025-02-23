import { defineStore } from "pinia"; // Install pinia if store is using

export const useSampleStore = defineStore({
  id: "sample-store", // Replace this id with proper name for store
  state: () => {
    return {
      sample: "hello",
    };
  },
  actions: {
    asyncFunctionSample: async () => {
      const response = await setTimeout(() => {
        console.log("hello");
      }, 1500);
      return response;
    },
  },
  getters: {
    getSample() {
      return this.sample;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: "localStorage",
      },
    ],
  },
});
