import { fileURLToPath } from 'url'
import { addComponentsDir, addPlugin, defineNuxtModule, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'bubio-plugin-name', // Replace 'name' with plugin name
        configKey: 'PluginName', // Replace 'Name' with plugin name
    },
    // Default configuration options of the Nuxt module
    defaults: {},
    setup: (_options, nuxt: any) => {
        // Get the directory path for the runtime files
        const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

        // Create a resolver for importing files

        const { resolve } = createResolver(import.meta.url)

        // Add the runtime directory to the transpile option in Nuxt build configuration
        nuxt.options.build.transpile.push(runtimeDir)

        // Components will be extended
        addComponentsDir({
            path: resolve(runtimeDir, 'components'),
            prefix: '', // Prefix to components if needed
        })

        // Plugins will be extented
        addPlugin(resolve(runtimeDir, 'plugin'))
    },
})
