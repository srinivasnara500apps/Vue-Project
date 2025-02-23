<!-- eslint-disable vue/no-v-html -->
<template>
    <div class="flex flex-col gap-2 shadow-lg border rounded-md p-3 bg-white">
        <!--  Start of displaying profile picture, name and last updated -->
        <div v-if="'from' in props.post" class="flex h-auto gap-2 items-center">
            <div class="flex">
                <img v-if="'picture' in props.post.from && props?.post?.from?.picture?.trim()" class="rounded-full flex shrink-0 w-10 h-10" :src="props.post.from.picture" />
                <div v-else class="w-10 h-10 rounded-fuprops.post.fromll flex justify-center items-center bg-[rgb(201,204,209)]">
                    <i class="fa-duotone fa-user fa-xl w-12 h-12 flex items-center justify-center rounded-full text-neutral-500"></i>
                </div>
            </div>
            <div>
                <div class="font-medium text-skin-secondary lg:text-[16px] text-md leading-6 truncate">{{ props.post.from.name }}</div>
                <div class="text-sm text-justify leading-6 text-skin-muted">
                    <!--Start of last updated time-->
                    <UseTimeAgo v-slot="{ timeAgo }" class="whitespace-nowrap text-skin-secondary" :time="props.post.lastUpdated">
                        {{ timeAgo }}
                    </UseTimeAgo>
                    <!--End of last updated time-->
                </div>
            </div>
        </div>
        <!--  End of displaying profile picture, name and last updated -->

        <!-- Start of displaying post content -->
        <div v-if="'message' in props.post" class="text-sm leading-6 text-skin-muted" v-html="props.post.message"></div>
        <!-- End of displaying post content -->
        <!-- Start of displaying post media -->
        <div :class="props.post.media.length > 0 && props.hideMedia === false ? '' : 'hidden'">
            <div v-if="'media' in props.post && props.hideMedia === false" class="flex">
                <carousel v-if="props.post.media.length > 1" :items-to-show="1">
                    <slide v-for="(slide, index) in props.post.media" :key="index">
                        <img class="w-full cursor-pointer flex shrink-0 rounded-md object-contain" :src="slide[1]" @click="showPreview(...slide)" />
                    </slide>

                    <template #addons>
                        <navigation />
                        <pagination />
                    </template>
                </carousel>
                <div v-for="(slide, index) in props.post.media" v-else :key="index">
                    <img class="w-full cursor-pointer flex shrink-0 rounded-md object-contain" :src="slide[1]" @click="showPreview(...slide)" />
                </div>
            </div>
        </div>
        <!-- End of displaying post media -->
        <hr v-if="'likes' in props.post && props.post.likes.enabled === true" :key="props.post.likes.count" />
        <div>
            <div class="flex justify-end gap-3">
                <div v-if="'likes' in props.post && props.post.likes.enabled === true" :key="props.post.likes.count">
                    <!-- Start of displaying likes -->
                    <abbr title="Like" class="no-underline">
                        <SocialStreamsStreamLike
                            :likes="props.post.likes"
                            :post="props.post"
                            :network="props.network"
                            :post-id="props.post.id"
                            :network-name="props.networkName"
                            :stream-id="props.streamId"
                        />
                    </abbr>
                    <!-- End of displaying likes -->
                </div>

                <div v-if="'comments' in props.post && props.post.comments.enabled === true" :key="props.post.comments.count">
                    <!-- Start of displaying comments count -->
                    <abbr title="Comments" class="no-underline">
                        <SocialStreamsStreamCommentsCount :comments-count="props.post.comments.count" :network-name="props.networkName" @click="showHideComments" />
                    </abbr>
                    <!-- End of displaying comments count -->
                </div>
            </div>
        </div>

        <!-- Start of displaying comments and input field -->
        <div v-if="'comments' in props.post && props.post.comments.enabled === true" :key="props.post.comments.count" class="flex flex-col gap-2 w-full">
            <SocialStreamsStreamCommentsList
                v-model:show="showComments"
                :network="props.network"
                :load-type="props.post.comments.type"
                :stream-id="props.streamId"
                :comments="props.post.comments"
                :post-id="props.post.id"
                :post="props.post"
            />
        </div>
        <!-- End of displaying comments and input field -->
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { UseTimeAgo } from '@vueuse/components' // UseTimeAgo to get the created time
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useBusEmit } from '#imports'

const props = defineProps<{
    post: object
    streamId: string
    hideMedia: boolean // If set to true, we will not render images inside post.
    networkName: string
    network: object
}>()

const showComments = ref(false)

// Show/hide display of comments when clicked on the comment icon
const showHideComments = () => {
    showComments.value = !showComments.value
}

// Preview image
const showPreview = (desc, image) => {
    useBusEmit('show-media-preview', [desc, image])
}
</script>
