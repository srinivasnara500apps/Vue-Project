<template>
    <h1>Hello {{ greeting }}</h1>
</template>
<script setup lang="ts">
withDefaults(
    defineProps<{
        /**
         * Meesage shown to greet the user
         */
        greeting?: string
        /**
         * Font size of the text
         * @values lg,sm,md,xl
         */
        fontSize?: 'lg' | 'sm' | 'md' | 'xl'
    }>(),
    {
        greeting: 'World',
        fontSize: 'md', // Set your default value here
    },
)

defineEmits<{
    /**
     * Cancels everything
     */
    (event: 'cancel'): void
    /**
     * Save the world
     * @arg {{ email: string, password: string }} payload - The payload
     */
    (
        event: 'save',
        payload: {
            email: string
            password: string
        },
    ): void
}>()
</script>
