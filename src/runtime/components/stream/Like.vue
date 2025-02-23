<template>
    <!-- Start of displaying likes -->
    <div v-if="!isLoading" class="flex items-center gap-2 h-5">
        <i
            v-if="props.networkName !== 'Instagram'"
            :class="[
                props.likes[theme[props.networkName]['like-condition']] ? `fa ${theme[props.networkName]['color-primary']}` : props.likes.count > 0 ? 'fa text-zinc-500' : 'fa-light text-zinc-500',
                theme[props.networkName]['like-icon'],
                'fa-lg cursor-pointer',
            ]"
            @click="add(props.likes)"
        ></i>
        <div v-if="props.likes.count > 0" :class="[props.likes[theme[props.networkName]['like-condition']] ? theme[props.networkName]['color-primary'] : 'text-zinc-500']">{{ props.likes.count }}</div>
    </div>
    <!-- End of displaying likes -->

    <!-- Start of displaying loading -->
    <div v-else><Loading :custom-class="`border-zinc-300 border-t-zinc-900 w-5 h-5`" class="relative w-5 h-5" /></div>
    <!-- End of displaying loading -->
</template>
<script setup lang="ts">
import { ref } from 'vue'
import theme from '../../data/theme.json'
import { useBusEmit } from '#imports'

const props = defineProps<{
    likes: object
    streamId: string
    networkName: string
    postId: string
    post: object
    network: object
}>()

// A flag to show/hide loading animation for like button
const isLoading = ref(false)

// Add like to a post
const add = (likesObj) => {
    if (props.likes.canLike || props.likes) {
        isLoading.value = true
        useBusEmit(`${props.streamId}-like`, { postId: props.postId, network: props.network, post: props.post })
        likesObj.count += likesObj.hasLiked ? 0 : 1
        likesObj.hasLiked = true
        isLoading.value = false
    }
}
</script>
