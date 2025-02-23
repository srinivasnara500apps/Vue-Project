<template>
    <div v-if="!isLoading" class="lg:p-4 p-3">
        <!-- Start off header -->
        <h1 class="font-bold text-skin-secondary lg:text-[1.8rem] text-[1rem] leading-6 lg:pb-5 pb-3">Social Streams</h1>
        <!-- End off header -->
        <div class="lg:px-4 px-3 lg:pt-4 pt-3 lg:h-[calc(100vh-80px)] h-[calc(100vh-105px)] overflow-y-hidden bg-white">
            <div class="flex flex-col items-center w-full lg:h-full h-[calc(100vh - 128px)]">
                <div class="flex justify-end items-end w-full shrink-0 pt-1 lg:pb-2 pb-3">
                    <div class="flex items-center gap-2 relative">
                        <!-- Start of range -->
                        <Menu v-if="streams.length > 0" as="div" class="relative inline-block text-left">
                            <div>
                                <MenuButton>
                                    <button
                                        class="group bg-skin-secondary/10 hover:bg-skin-secondary/20 px-4 lg:text-sm text-xs text-skin-secondary font-medium hover:text-skin-secondary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ease-in duration-300 transition rounded-md lg:py-2 py-3 text-sm flex justify-content items-center"
                                    >
                                        <i class="fa-regular fa-magnifying-glass-plus"></i> <span class="lg:block hidden ml-1">Zoom In/Out</span>
                                        <p class="absolute top-[-1.5rem] text-neutral-700 font-medium text-[11px] group-hover:visible hidden invisible w-max">Zoom in / Zoom out</p>
                                    </button>
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
                                <MenuItems class="absolute left-0 mt-2 w-max origin-top-right divide-y divide-gray-100 rounded-md bg-neutral-50 shadow-lg focus:outline-none z-20 px-2">
                                    <div class="flex flex-col p-1">
                                        <label for="medium-range" class="block mb-2 text-sm text-gray-900">{{ cardSizeValue - cardSizeMin }}</label>
                                        <input
                                            id="medium-range"
                                            v-model="cardSizeValue"
                                            type="range"
                                            :min="cardSizeMin"
                                            :max="cardSizeMax"
                                            step="1"
                                            class="w-full h-2 mb-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </MenuItems>
                            </transition>
                        </Menu>
                        <!-- End of range -->
                        <!-- Start of refresh button -->
                        <button
                            v-if="streams.length > 0"
                            class="group bg-skin-secondary/10 hover:bg-skin-secondary/20 px-4 lg:text-sm text-xs text-skin-secondary font-medium hover:text-skin-secondary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ease-in duration-300 transition rounded-md lg:py-2 py-3 text-sm flex justify-content items-center"
                            @click="refreshStreams"
                        >
                            <i class="fa-regular fa-arrows-rotate"></i> <span class="lg:block hidden ml-1">Refresh</span>
                            <p class="absolute top-[-1.5rem] text-neutral-700 font-medium text-[11px] hidden group-hover:visible invisible w-max">Refresh</p>
                        </button>
                        <!-- End of refresh button -->
                        <!-- Start of add stream button -->
                        <button
                            class="bg-skin-primary hover:bg-skin-primary/90 rounded-md px-4 lg:py-2 py-3 lg:text-sm text-xs text-skin-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ease-in duration-300 transition font-medium flex justify-content items-center"
                            @click="openAddStreamsModal"
                        >
                            <i class="fa-sharp fa-solid fa-plus"></i> <span class="lg:block hidden ml-1">Add Stream</span>
                            <p class="absolute top-[-1.5rem] text-neutral-700 font-medium hidden text-[11px] group-hover:visible invisible w-max">Add Stream</p>
                        </button>
                        <!-- End of add stream button -->
                    </div>
                </div>

                <!-- Start of empty state for streams -->
                <div v-if="streams.length === 0" class="w-full flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                    <img class="lg:w-[400px] w-[250px] mx-auto" :src="`${useAppConfig().assetsURL}favai/empty-state/add-streams.svg`" />
                    <p class="leading-7 text-skin-base tracking-wide text-sm mt-4 text-center">
                        Aggregate your social media presence in one place.<br />
                        Add streams from your connected accounts to stay updated.
                    </p>
                </div>
                <!-- End of empty state for streams -->

                <!-- Start of displaying streams -->
                <div v-else class="w-full overflow-hidden">
                    <div class="w-full flex overflow-x-auto lg:pt-2 lg:h-[calc(100vh-120px)] h-full">
                        <div id="stream-custom-scroll" class="w-full h-[calc(100vh-175px)] flex overflow-x-auto gap-5 overflow-y-hidden">
                            <div v-for="item in streams" :key="item.id" class="border rounded-md lg:h-[calc(100vh-175px)] h-[calc(100vh - 220px)]">
                                <!-- Start of displaying facebook stream -->
                                <SocialStreamsNetworksFacebook
                                    v-if="item.network.domain === 'Facebook'"
                                    v-model:card-size="cardSizeValue"
                                    :network="item.network"
                                    :stream-type="item.stream"
                                    :stream-id="item.id"
                                    @delete="deleteStream"
                                />
                                <!-- End of displaying facebook stream -->

                                <!-- Start of displaying instagram stream -->
                                <SocialStreamsNetworksInstagram
                                    v-if="item.network.domain === 'Instagram'"
                                    v-model:card-size="cardSizeValue"
                                    :network="item.network"
                                    :stream-type="item.stream"
                                    :stream-id="item.id"
                                    @delete="deleteStream"
                                />
                                <!-- End of displaying instagram stream -->

                                <!-- Start of displaying linkedin stream -->
                                <SocialStreamsNetworksLinkedin
                                    v-if="item.network.domain === 'LinkedIn'"
                                    v-model:card-size="cardSizeValue"
                                    :network="item.network"
                                    :stream-type="item.stream"
                                    :stream-id="item.id"
                                    @delete="deleteStream"
                                />
                                <!-- End of displaying linkedin stream -->
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End of displaying streams -->
            </div>
        </div>

        <!-- Start of add streams modal component -->
        <SocialStreamsAddStream class="bg-white" :open="openAddStreams" :networks="networks" :add-networks-route="props.addNetworksRoute" @close="closeAddStreamsModal" @add-stream="addStream" />
        <!-- End of add streams modal component -->
    </div>
    <div v-else class="lg:p-5 p-3">
        <div class="bg-white rounded-lg shadow w-full items-center justify-center flex lg:h-[calc(100vh-105px)] h-[calc(100vh-74px)]">
            <Loading custom-class="relative w-10 h-10 border-t-zinc-600 border-zinc-300" />
        </div>
    </div>
    <!-- Start of media preview -->
    <div v-if="mediaPreview" class="w-screen h-screen fixed flex flex-col items-center justify-center text-center z-50 bg-black bg-opacity-75 top-0 left-0 overflow-hidden">
        <i class="fa-regular fa-xmark absolute right-14 top-10 cursor-pointer text-3xl text-white" @click="hidePreview"></i>
        <img :src="previewImageSrc" class="object-contain shadow-lg shadow-gray-900" />
        <br />
        <div class="w-3/4 text-white">{{ previewImageDesc }}</div>
    </div>
    <!-- End of media preview -->
</template>
<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { getAllNetworks, useBusEmit, useNuxtApp, useUserStore, useAppConfig, useShowWarningNoty } from '#imports'

const props = defineProps<{
    categoryId: string
    addNetworksRoute: string
}>()

// Type definition for network in every stream object in streams array
interface networkType {
    id: string
    name: string
    domain: string
    access_token: string
    picture: {
        data: {
            url: string
        }
    }
}

// Type definition for streams array
interface streamType {
    network: networkType
    stream: {
        label: string
        value: string
    }
    id: number
}

const networks = ref([])
const isLoading = ref(true)
const streams = ref<streamType[]>([]) // Variable for displaying streams in current category
const { $bus } = useNuxtApp()
const userStore = useUserStore()
const category = ref('')
const removeOrphanStreams = async () => {
    category.value = props.categoryId || 'category'

    const availableNetworkIDs = networks.value.map((item) => item.id)
    const streamsToKeep = []

    userStore?.user?.prefs?.categories[category.value].forEach((item) => {
        if (availableNetworkIDs.includes(item.network.id)) {
            streamsToKeep.push(item)
        }
    })

    await userStore.setPrefs({
        categories: {
            ...userStore.user.prefs.categories,
            [`${category.value}`]: streamsToKeep,
        },
    })
}

const handleWindowResize = (event: MediaQueryListEvent) => {
    if (event.matches) {
        // Window width is less than 474
        cardSizeValue.value = 17
    }
}

const mediaQueryList = ref()
onMounted(() => {
    // Fetch networks
    setTimeout(async () => {
        isLoading.value = true

        category.value = props.categoryId || 'category'

        // Check if category exists in collection
        if (userStore.user.prefs.categories) {
            if (!(`${category.value}` in userStore.user.prefs.categories)) {
                await userStore.setPrefs({
                    categories: {
                        ...userStore.user.prefs.categories,
                        [`${category.value}`]: [],
                    },
                })
            }
        } else {
            // If categories collection doesn't exists, create one with current category id
            await userStore.setPrefs({
                categories: {
                    [`${category.value}`]: [],
                },
            })
        }

        networks.value = await getAllNetworks()
        // Check added networks and remove orphan streams
        await removeOrphanStreams()

        isLoading.value = false

        // Update streams variable with saved data
        streams.value = userStore?.user?.prefs?.categories[category.value]

        $bus.$on('show-media-preview', (image) => {
            showPreview(...image)
        })

        mediaQueryList.value = window.matchMedia('(max-width: 474px)')

        if (mediaQueryList.value.matches) {
            // Window width is less than 474
            cardSizeValue.value = 17
        }

        mediaQueryList.value.addEventListener('change', handleWindowResize)
    }, 100)
})

onUnmounted(() => {
    mediaQueryList.value.removeEventListener('change', handleWindowResize)
})

// Variable used for opening/hiding 'add streams' modal.
const openAddStreams = ref(false)

// Opens 'add streams' modal
const openAddStreamsModal = () => {
    // Show loading icon only once when we select a category
    openAddStreams.value = true
}

// Close 'add streams' modal
const closeAddStreamsModal = () => {
    openAddStreams.value = false
}

// Adding selected stream to the streams collection
const addStream = (stream: streamType) => {
    const existing = streams.value.filter((item) => {
        return stream.network.domain === item.network.domain && stream.network.name === item.network.name && stream.stream.value === item.stream.value
    })

    if (existing.length > 0) {
        useShowWarningNoty('Selected stream already exists.')
        return
    }

    stream.id = uuidv4() // To create unique ID for a stream
    streams.value.push(stream)
    // Update category with current streams
    userStore.setPrefs({
        categories: {
            ...userStore?.user?.prefs?.categories,
            [category.value]: streams.value,
        },
    })
}

// Delete stream
const deleteStream = (streamIndex: number) => {
    const index = streams.value.map((item: streamType) => item.id).indexOf(streamIndex)
    streams.value.splice(index, 1)
    // Update category with current streams
    userStore.setPrefs({
        categories: {
            ...userStore?.user?.prefs?.categories,
            [category.value]: streams.value,
        },
    })
}

// Refresh streams
const refreshStreams = () => {
    useBusEmit('social-stream-refresh', {})
}

// Card size parameters
const cardSizeMin = 24
const cardSizeMax = 34
const cardSizeValue = ref(24)

// Variable to show/hide preview
const mediaPreview = ref(false)
const previewImageSrc = ref('')
const previewImageDesc = ref('')

// Show preview
const showPreview = (description: string, image: string) => {
    mediaPreview.value = true
    previewImageSrc.value = image
    previewImageDesc.value = description
}

// Hide preview
const hidePreview = () => {
    mediaPreview.value = false
}
</script>

<style>
#stream-custom-scroll::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    background-color: #f5f5f5;
}

#stream-custom-scroll::-webkit-scrollbar {
    width: 12px;
    /* height: 8px; */
    background-color: #f5f5f5;
}

#stream-custom-scroll::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #d1d5db;
}
#stream-custom-scroll::-webkit-scrollbar {
    height: 7px !important;
}
/* .bg-skin-primary.py-4.px-4.sm\:px-6.h-\[80px\].border.border-skin-secondary\/20.border-l-0.border-r-0.border-t-0.flex.items-center.justify-between.p-4 {
    background-color: #1e293b !important ;
} */
</style>
