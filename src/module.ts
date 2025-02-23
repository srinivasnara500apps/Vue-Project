import { fileURLToPath } from 'url'
import { addComponentsDir, addPlugin, defineNuxtModule, createResolver, installModule, resolvePath, addImportsDir, ResolvePathOptions } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'fav-plugin-socialstreams', // Replace 'name' with plugin name
        configKey: 'FavPluginSocialStreams', // Replace 'Name' with plugin name
    },
    // Default configuration options of the Nuxt module
    defaults: {},
    setup: async (_options, nuxt: any) => {
        // Get the directory path for the runtime files
        const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
        // Get the directory path for installed plugins to apply tailwind
        const bubDir = fileURLToPath(new URL('../node_modules/@bub-io/', import.meta.url))
        const mantraTechDir = fileURLToPath(new URL('../node_modules/@mantra-tech/', import.meta.url))
        // Create a resolver for importing files

        const { resolve } = createResolver(import.meta.url)

        // Add the runtime directory to the transpile option in Nuxt build configuration
        nuxt.options.build.transpile.push(runtimeDir)

        // Data will be extented
        addImportsDir(resolve(runtimeDir, 'data'))

        // Utils will be extended
        addImportsDir(resolve(runtimeDir, 'utils'))

        // Used to setup pinia store to plugin
        // Install pinia for store management
        await installModule(await resolvePath('@pinia/nuxt'), {
            autoImports: ['defineStore'],
        })
        await installModule('@pinia/nuxt', { disableVuex: true })

        // Components will be extended
        addComponentsDir({
            path: resolve(runtimeDir, 'components'),
            prefix: 'SocialStreams', // Prefix to components if needed
        })

        // Plugins will be extented
        addPlugin(resolve(runtimeDir, 'plugin'))

        // Add content paths of plugin files to tailwind config
        // @ts-expect-error nocheck
        nuxt.hook('tailwindcss:config', (tailwindConfig) => {
            const resourcePaths = (srcDir: string) => [`${srcDir}/components/**/*.{js,vue,ts}`, `${srcDir}/data/**/*.{js,ts,json}`]
            const contentPaths = resourcePaths(runtimeDir)
            const bubPaths = [`${bubDir}/**/*.{vue,js,ts,mjs}`]
            const mantraTechPaths = [`${mantraTechDir}/**/*.{vue,js,ts,mjs}`]
            tailwindConfig.content.push(...[...contentPaths, ...bubPaths, ...mantraTechPaths])
        })

        const modules = ['@bub-io/frontend-plugin-auth', '@bub-io/frontend-plugin-modal', '@bub-io/frontend-plugin-composables', '@bub-io/frontend-plugin-loaders', '@bub-io/frontend-plugin-toaster']
        const nuxtConfigModules = nuxt.options.modules
        modules.forEach(async (module) => {
            if (!nuxtConfigModules.includes(module)) {
                installModule(await resolvePath(module, { autoImports: true } as ResolvePathOptions))
            }
        })

        nuxt.options.app.head.link?.push(
            ...[
                {
                    rel: 'stylesheet',
                    href: 'https://kit.fontawesome.com/16d7faf68e.css',
                },
            ],
        )
    },
})
