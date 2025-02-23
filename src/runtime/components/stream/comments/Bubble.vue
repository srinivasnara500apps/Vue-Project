<template>
    <div :class="['flex flex-col w-full rounded-lg p-4 gap-2', props.type === 'comment' ? 'bg-gray-50' : 'bg-gray-50']">
        <!-- Start of displaying image -->
        <div class="flex items-center gap-2">
            <img v-if="'picture' in props.comment && props.comment?.picture?.trim()" class="h-6 w-6 flex shrink-0 rounded-full object-contain" :src="props.comment.picture" />
            <i v-else class="fa-duotone fa-user fa-xl w-12 h-12 flex items-center justify-center rounded-full"></i>
            <div class="font-semibold text-sm">{{ props.comment.from }}</div>
        </div>
        <!-- End of displaying image -->

        <!-- Start of displaying name and message -->
        <div class="text-sm">{{ props.comment.message }}</div>
        <!-- End of displaying name and message -->
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    comment: object
    type: String
}>()
</script>
