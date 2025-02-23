export default defineNuxtConfig({
    modules: ['../src/module', '@nuxtjs/tailwindcss'],
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    tailwindcss: {
        content: ['./components/**/*.{js,vue,ts}', './pages/**/*.vue'],
    },
})
