<template>
    <!-- Start of add streams modal -->
    <Modal class="bg-white" type="slideout" size="md" :close="true" :show-form="false" :open="props.open" @hide="close">
        <template #title>
            <!--  Start of displaying title -->
            <div class="flex items-center gap-10 px-3">
                <div class="text-white">Add Stream</div>
                <!-- <div class="flex items-end"><button type="button" class="text-skin-invert hover:text-skin-accent outline-none"><span class="sr-only">Close</span><i class="fa-duotone fa-xmark-large text-skin-invert/80 hover:text-skin-invert text-sm pr-2 modal-close"></i></button></div> -->
            </div>
            <!-- End of displaying title -->
        </template>
        <template #body>
            <!-- Start of displaying button beside title  -->
            <button
                :class="[
                    ' bg-skin-primary hover:bg-skin-primary/90 rounded-md px-4 py-2 lg:text-sm text-xs text-skin-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ease-in duration-300 transition font-medium flex justify-content items-center mb-5 ml-auto',
                    ' right-10',
                ]"
                @click="navigateTo(props.addNetworksRoute)"
            >
                <i class="fa fa-plus"></i>
                <div class="ml-1">Add Network</div>
            </button>
            <!-- End of displaing button beside title -->

            <!-- Start of display of networks -->
            <div v-if="props.networks.length > 0" class="flex-col gap-4 items-center pb-3">
                <!-- Start of displaying networks -->
                <div v-for="item in props.networks" :key="item.uid" :class="['w-full border-2  flex-col p-0.5 rounded-md border-zinc-200 mb-2']">
                    <div class="bg-white rounded-md">
                        <!-- Start of displaying name & picture -->
                        <div class="flex justify-between items-center p-2">
                            <div class="flex relative gap-2 rounded-t-md items-center">
                                <div v-if="'picture' in item">
                                    <img :src="item.picture.data.url" class="object-fill w-12 h-12 rounded-full" />
                                </div>
                                <div v-else>
                                    <span class="w-10 h-10 rounded-full flex justify-center items-center bg-[rgb(201,204,209)]">
                                        <i class="fa-duotone fa-user fa-xl w-12 h-12 text-neutral-500 flex items-center justify-center rounded-full"></i>
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <div class="text-sm font-semibold">{{ item.name }}</div>
                                    <!-- <div class="text-xs">{{ item.domain }}</div> -->
                                </div>
                            </div>
                            <i :class="[theme[item.domain].icon, theme[item.domain]['color-bg'], 'text-lg text-transparent bg-clip-text']"></i>
                        </div>
                        <!-- End of displaying name & picture -->
                        <!-- Start of displaying buttons for network -->
                        <div class="flex flex-wrap p-2 gap-3 h-fit rounded-b-md items-center bg-zinc-200 sm:gap-0">
                            <button
                                v-for="(action, actionIndex) in actions[item.domain]"
                                :key="actionIndex"
                                :class="[
                                    'w-fit h-7 text-zinc-900 flex items-center gap-2 bg-white lg:mr-2  hover:bg-zinc-100 border border-zinc-300 active:bg-zinc-300 text-[13px] font-medium rounded-lg px-5 py-2.5 transition-all',
                                ]"
                                @click="emits('add-stream', { network: item, stream: action })"
                            >
                                {{ action.label }}
                            </button>
                        </div>
                        <!-- End of displaying buttons for network -->
                    </div>
                </div>
                <!-- End of displaying networks -->
            </div>
            <div v-else class="w-full flex flex-col gap-5 items-center justify-center pt-32">
                <img class="lg:w-[250px] w-[200px]" :src="`${useAppConfig().assetsURL}favai/empty-state/add-network.svg`" />
                <p class="leading-7 lg:text-md text-sm tracking-wide mb-2 mt-10">
                    Stay connected with your audience across multiple social networks. <br />
                    Add Facebook, LinkedIn, Instagram, and Twitter to view their streams.
                </p>
            </div>
            <!-- End of display of networks -->
        </template>
        <!-- <template #ok>Ok</template> -->
    </Modal>
    <!-- End of add streams modal -->
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import theme from '../data/theme.json'
import { navigateTo, useAppConfig } from '#imports'

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

const props = defineProps<{
    open: boolean // Show modal when this prop is true
    networks: object
    addNetworksRoute: string
}>()

const emits = defineEmits<{
    /**
     * Close modal
     */
    (event: 'close'): void

    /**
     * Add stream event
     */
    (event: 'add-stream', payload: streamType): void
}>()

// Emit to close modal
const close = () => {
    emits('close')
}

// Action buttons for different networks
const actions = ref({
    Facebook: [
        { label: 'Posts', value: 'posts' },
        { label: 'Mentions', value: 'tagged' },
        { label: 'Timeline', value: 'feed' },
    ],
    Instagram: [{ label: 'Posts', value: 'posts' }],
    LinkedIn: [{ label: 'Posts', value: 'posts' }],
})

onMounted(() => {
    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            emits('close')
        }
    })
})

onUnmounted(() => {
    document.body.removeEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            emits('close')
        }
    })
})
</script>
