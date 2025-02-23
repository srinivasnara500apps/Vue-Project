<template>
    <!-- Start of displaying stream -->
    <div
        v-if="!searchView"
        :class="'flex flex-col my-0 gap-5 shrink-0 h-[calc(100vh-180px)]  py-5 pt-0 bg-[#f1f1f157] rounded-md w-full'"
        :style="{
            width: cardSize,
        }"
    >
        <div :class="['sticky w-full z-[5] flex lg:p-3 p-2 justify-between items-center h-fit top-0', theme[props.networkName]['color-bg']]">
            <!--  Start of displaying stream type and name -->
            <div class="flex items-center lg:gap-2 gap-1">
                <div class="flex w-7 h-7 items-center justify-center"><i :class="[theme[props.networkName].icon, 'text-xl']" style="color: #ffffff"></i></div>
                <abbr class="no-underline" :title="profile?.name">
                    <div class="text-sm text-white w-32 text-ellipsis overflow-hidden whitespace-nowrap font-medium">{{ profile?.name }}</div>
                </abbr>
            </div>
            <!--  End of displaying stream type and name -->

            <!-- Start of displaying buttons -->
            <div class="flex items-center gap-2.5">
                <!-- Start of refresh button -->
                <div class="border border-white w-6 h-6 flex justify-center items-center rounded-full cursor-pointer" @click="refreshStream">
                    <i :class="['fa-regular fa-arrows-rotate fa-lg text-white text-sm', isLoading ? 'animate-spin' : '']"></i>
                </div>
                <!-- End of refresh button -->

                <!-- Start of search button -->
                <div class="border border-white w-6 h-6 flex justify-center items-center rounded-full cursor-pointer" @click="openSearch">
                    <i class="fa-solid fa-magnifying-glass text-white text-sm"></i>
                </div>
                <!-- End of search button -->

                <!-- Start of stream menu -->
                <Menu as="div" class="relative inline-block text-left">
                    <div>
                        <MenuButton>
                            <div class="border border-white w-6 h-6 flex justify-center items-center rounded-full">
                                <i class="fa-solid fa-ellipsis-vertical text-white text-sm"></i>
                            </div>
                        </MenuButton>
                    </div>

                    <transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="transform scale-95 opacity-0"
                        enter-to-class="transform scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="transform scale-100 opacity-100"
                        leave-to-class="transform scale-95 opacity-0"
                    >
                        <MenuItems class="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg focus:outline-none">
                            <div class="px-1 py-1">
                                <!--  Start of delete stream button -->
                                <MenuItem>
                                    <button :class="['text-gray-900 hover:text-red-600', 'group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm']" @click="deleteStream">
                                        <i class="fa-solid fa-trash-can fa-lg"></i>
                                        Delete
                                    </button>
                                </MenuItem>
                                <!-- End of delete stream button -->

                                <!--  Start of text-only/default-view button -->
                                <MenuItem>
                                    <button :class="['text-gray-900 hover:text-orange-600', 'group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm']" @click="showHideMedia">
                                        <div v-if="!hideMedia"><i class="fa-regular fa-image fa-lg"></i> Default</div>
                                        <div v-else><i class="fa-regular fa-image-slash fa-lg"></i> Text only</div>
                                    </button>
                                </MenuItem>
                                <!-- End of text-only/default-view button -->
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
                <!-- End of stream menu -->
            </div>
            <!-- End of displaying buttons -->
        </div>

        <!-- Start of loading for posts -->
        <!--  End of loading for posts -->

        <!-- Start of displaying posts -->
        <div v-if="posts.length > 0" id="style-3" ref="scrollableElement" class="flex flex-col h-screen overflow-auto gap-4 sm:px-2">
            <SocialStreamsStreamPost v-for="post in posts" :key="post.id" v-model:hide-media="hideMedia" :post="post" :network-name="props.networkName" :network="props.network" :stream-id="id" />
        </div>
        <!-- End of displaying posts -->

        <!-- Start of displaying posts -->
        <div v-else class="flex flex-col items-center gap-4">
            <div v-if="!isLoading" class="font-semibold text-zinc-400 text-lg">No posts</div>
        </div>
        <!-- End of displaying posts -->
    </div>
    <div
        v-else
        class="flex flex-col my-0 gap-5 shrink-0 h-full py-5 pt-0"
        :style="{
            width: cardSize,
        }"
    >
        <!-- Start of search -->
        <SocialStreamsStreamSearch
            v-model:hide-media="hideMedia"
            :posts="props.posts"
            :card-size="props.cardSize"
            :network-name="props.networkName"
            :network="props.network"
            :stream-id="id"
            @close="closeSearch"
        />
        <!-- End of search -->
    </div>
    <!-- End of displaying stream -->
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useInfiniteScroll } from '@vueuse/core'
import theme from '../../data/theme.json'
import { useBusEmit } from '#imports'

const props = defineProps<{
    id: string // For identifying stream
    networkName: string // For applying icon and theme according to network
    type: string // For fetching appropriate data according to type
    posts: object[] // Post information to display in cards
    profile: object // Profile information for streams
    isLoading: boolean // Whether to show loading state for stream
    cardSize: number
    network: object
}>()

const cardSize = computed(() => {
    return `${props.cardSize}rem`
})

const emits = defineEmits<{
    /**
     * Refresh stream
     */
    (event: 'refresh'): void

    /**
     * Delete stream
     */
    (event: 'delete', id: string): void
}>()

// Definition of scrollable element to track and trigger events for infinite scrolling feature
const scrollableElement = ref<HTMLElement | null>(null)

// Show or hide search view
const searchView = ref(false)

// Show or hide images in a stream
const hideMedia = ref(false)

// Open search view
const openSearch = () => {
    searchView.value = true
}

// Close search view
const closeSearch = () => {
    searchView.value = false
}

// Function to switch between show or hide images in a stream
const showHideMedia = () => {
    hideMedia.value = !hideMedia.value
}

// Refresh stream
const refreshStream = () => {
    emits('refresh')
}

// Delete stream
const deleteStream = () => {
    emits('delete', props.id)
}
// Initialize infinite scroll
useInfiniteScroll(scrollableElement, () => {
    if (!props.isLoading) {
        useBusEmit(`${props.id}--scroll-end`)
    }
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
