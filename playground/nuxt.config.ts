export default defineNuxtConfig({
    modules: ['../src/module', '@nuxtjs/tailwindcss'],
    devtools: { enabled: true },
    tailwindcss: {
        content: ['./components/**/*.{js,vue,ts}', './pages/**/*.vue'],
    },
})
