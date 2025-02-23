import { defineNuxtPlugin } from '#app'
import { getItem, updateStorage, defaultStorage } from './stores/plugin'
import type { PersistStrategy } from './stores/plugin'

export default defineNuxtPlugin((nuxtApp) => {
    // @ts-ignore
    nuxtApp.$pinia?.use(({ options, store }) => {
        // Turn on storage
        if (options.persist?.enabled) {
            const defaultStrat: PersistStrategy[] = [
                {
                    key: store.$id,
                    storage: defaultStorage,
                },
            ]

            const strategies = options.persist?.strategies?.length ? options.persist?.strategies : defaultStrat

            strategies.forEach((strategy: PersistStrategy) => {
                const storage = strategy.storage || defaultStorage
                const storeKey = strategy.key || store.$id
                const storageResult = getItem(storage, storeKey)

                if (storageResult) {
                    // If there is a stored state, update the store state and persist it
                    store.$patch(JSON.parse(storageResult))
                    updateStorage(strategy, store)
                    store.$state = JSON.parse(storageResult)
                }
            })

            // Subscribe to store changes to update the storage
            store.$subscribe(() => {
                // React to store changes
                strategies.forEach((strategy: PersistStrategy) => {
                    updateStorage(strategy, store)
                })
            })
        }
    })
})
