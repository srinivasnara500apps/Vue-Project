<template>
    <div :class="['sticky w-full z-10 flex  p-3 justify-between items-center h-fit top-0', theme[props.networkName]['color-bg']]">
        <!-- Start of displaying search input -->
        <div class="flex justify-between items-center w-full gap-2">
            <input
                v-model="query"
                class="w-full border-none outline-none ring-0 bg-transparent text-white placeholder:text-gray-100 selection:bg-white selection:text-black font-semibold"
                placeholder="Search..."
            />
            <i class="fa-solid fa-xmark fa-lg text-white" @click="emits('close')"></i>
        </div>
        <!-- End of displaying search input -->
    </div>
    <!-- Start of displaying posts -->
    <div id="style-3" class="flex flex-col gap-4 px-4 overflow-auto">
        <SocialStreamsStreamPost
            v-for="item in filteredPosts"
            :key="item.id"
            :hide-media="props.hideMedia"
            :network-name="props.networkName"
            :network="props.network"
            :post="item.item"
            :stream-id="props.streamId"
        />
    </div>
    <!-- End of displaying posts -->

    <!-- Start of empty state for search -->
    <div v-if="filteredPosts.length === 0 && query.length > 0" class="text-xl font-light text-center flex flex-col items-center mt-10 gap-5 w-full h-full">
        <div>
            <i class="fa-duotone fa-2xl fa-file-magnifying-glass"></i>
        </div>
        <div>No match found</div>
    </div>
    <!-- End of empty state for search -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import theme from '../../data/theme.json'

const props = defineProps<{
    posts: object[]
    networkName: string
    network: object
    streamId: string
    hideMedia: boolean
}>()

// Query for search
const query = ref('')

const emits = defineEmits<{
    /**
     * Close search view
     */
    (event: 'close'): void
}>()

const keys = ref(['message']) // Where to search in postInfo
const resultLimit = ref<number | undefined>(undefined) // No of results to be returned by search

const getPostText = (message: string) => {
    return message.replace(/(<([^>]+)>)/gi, '').trim()
}

const options = computed<UseFuseOptions<object>>(() => ({
    fuseOptions: {
        keys: keys.value,
        isCaseSensitive: false,
        threshold: 0.4,
    },
    resultLimit: resultLimit.value,
    matchAllWhenSearchEmpty: true,
}))

// Computed property that searches for matched objects as we type in the search input field.
const filteredPosts = computed(() => {
    const { results } = useFuse(
        query,
        props.posts.map((item) => ({ ...item, message: getPostText(item.message) })),
        options,
    )
    return results.value
})
</script>
<style>
/* Hide scrollbar for Chrome, Safari, and Opera */
#style-3::-webkit-scrollbar {
    width: 7px !important;
}

#style-3::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    background-color: #f5f5f5;
}

#style-3::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #d1d5db;
}
</style>
