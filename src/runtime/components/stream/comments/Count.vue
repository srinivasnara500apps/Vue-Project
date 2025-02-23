<template>
    <!--  Start of displaying comment count -->
    <div class="flex items-center gap-2 h-5">
        <i :class="[props.commentsCount > 0 ? 'text-zinc-500' : 'fa-light text-zinc-500', 'fa-message', 'fa fa-lg cursor-pointer']"></i>
        <div v-if="props.commentsCount > 0" :class="[props.commentsCount > 0 ? 'text-zinc-500' : 'text-zinc-500']">{{ props.commentsCount }}</div>
    </div>
    <!-- End of displaying comment count -->
</template>
<script setup lang="ts">
const props = defineProps<{
    commentsCount: number
    networkName: string
}>()
</script>
