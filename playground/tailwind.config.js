/** @type {import('tailwindcss').Config} */
// Use withOpacity to dilute the original color
const withOpacity = (variableName) => {
    return ({ opacityValue }) => {
        if (opacityValue !== undefined) {
            return `rgba(var(${variableName}), ${opacityValue})`
        }
        return `rgb(var(${variableName}))`
    }
}
module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './data/**/*.{js,ts,json}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './utils/**/*.{js,ts,json}',
        './app.vue',
    ],
    theme: {
        extend: {
            backgroundImage: {
                logo: 'var(--logo-image)',
            },
            textColor: {
                // Text Colors
                skin: {
                    base: withOpacity('--color-base'),
                    muted: withOpacity('--color-muted'),
                    white: withOpacity('--color-white'),
                    primary: withOpacity('--color-primary'),
                    secondary: withOpacity('--color-secondary'),
                    accent: withOpacity('--color-accent'),
                    invert: withOpacity('--color-invert'),
                    active: withOpacity('--color-active-text'),
                },
            },
            backgroundColor: {
                // Background Colors
                skin: {
                    base: withOpacity('--color-base'),
                    primary: withOpacity('--color-primary'),
                    secondary: withOpacity('--color-secondary'),
                    accent: withOpacity('--color-accent'),
                    lhs: withOpacity('--color-bg-lhs'),
                    rhs: withOpacity('--color-bg-rhs'),
                    input: withOpacity('--color-input-bg'),
                    white: withOpacity('--color-white'),
                    muted: withOpacity('--color-muted'),
                    invert: withOpacity('--color-invert'),
                    active: withOpacity('--color-active-bg'),
                },
            },
            borderColor: {
                // Border Colors
                skin: {
                    lhs: withOpacity('--color-bg-lhs'),
                    base: withOpacity('--color-base'),
                    primary: withOpacity('--color-primary'),
                    secondary: withOpacity('--color-secondary'),
                    invert: withOpacity('--color-invert'),
                    accent: withOpacity('--color-accent'),
                },
            },
            gradientColorStops: {
                // Gradient Colors
                skin: {
                    form: withOpacity('--color-from'),
                    to: withOpacity('--color-to'),
                },
            },
            fontFamily: {
                sans: ['Inter var, sans-serif', { fontFeatureSettings: '"cv03", "cv04", "cv11"' }],
            },
        },
    },
    plugins: [],
}
