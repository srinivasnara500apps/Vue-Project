<template>
    <div class="flex flex-col gap-2">
        <div v-if="props.show && !isLoading" class="w-full">
            <div v-for="comment in commentsList" :key="comment.id" class="flex flex-col">
                <!-- Start of displaying comment -->
                <SocialStreamsStreamCommentsBubble class="mb-2" :comment="comment" type="comment" />
                <!-- End of displaying comment -->

                <!-- Start of displaying replies -->
                <div class="ml-5 mb-2 flex flex-col gap-2">
                    <SocialStreamsStreamCommentsBubble v-for="reply in comment.replies" :key="reply.id" :comment="reply" type="reply" />
                </div>
                <!-- End of displaying replies -->
            </div>
        </div>
        <div v-if="isLoading" class="flex justify-center">
            <Loading :custom-class="`border-zinc-300 border-t-zinc-900`" class="relative w-16 h-16" />
        </div>

        <!-- Start of displaying comment input -->
        <div v-if="props.comments.canComment" class="flex items-center">
            <SocialStreamsStreamCommentsAdd :post-id="props.postId" :stream-id="props.streamId" :post="props.post" :network="props.network" />
        </div>
        <!-- End of displaying comment input -->
    </div>
</template>
<script setup lang="ts">
import { onMounted, watch, computed, ref } from 'vue'
import { useAuthLazyFetch, useHandlebars } from '#imports'

const props = defineProps<{
    postId: string
    show: boolean
    streamId: string
    loadType: string
    comments: object
    network: object
    post: object
}>()

const isLoading = ref(false)
const commentsList = ref([])

// A Helper function to convert all comments to a format compatible with our common stream component
const formatComments = (items: object[], domain: string) => {
    const commentData: object[] = []
    let comments = []

    if (domain === 'Instagram') {
        comments = items.comments.data
    } else if (domain === 'LinkedIn') {
        comments = items.elements
    }
    if (comments.length === 0) {
        return []
    } else {
        comments.forEach((item) => {
            const comment: object = {
                id: '',
                from: '',
                picture: '',
                message: '',
                replies: [],
            }

            if (domain === 'Instagram') {
                comment.id = item.id
                comment.from = item.from ? item.from.name : ''
                comment.picture = item.from ? item.from.picture.data.url : ''
                comment.message = item.text

                // If replies exist inside a comment
                if ('comments' in item) {
                    item.comments.data.forEach((reply) => {
                        comment.replies.push({
                            id: item.id,
                            from: reply.from.name,
                            picture: reply.from.picture.data.url,
                            message: reply.message,
                        })
                    })
                }
                commentData.push(comment)
            }

            if (domain === 'LinkedIn') {
                comment.id = item.id
                comment.from = item.profile ? item.profile.localizedFirstName + ' ' + item.profile.localizedLastName : ''
                comment.picture = item.profile ? item.profile.profilePicture : ''
                comment.message = item.message.text

                // If replies exist inside a comment
                if ('comments' in item) {
                    item.comments.data.forEach((reply) => {
                        comment.replies.push({
                            id: item.id,
                            from: reply.from.name,
                            picture: reply.from.picture.data.url,
                            message: reply.message,
                        })
                    })
                }
                commentData.push(comment)
            }
        })
    }
    return commentData
}

watch(
    computed(() => props.show),
    async (new_) => {
        if (new_ && props.loadType === 'load-comments') {
            isLoading.value = true

            let response
            if (props.network.domain.toLowerCase() === 'linkedin') {
                response = await useAuthLazyFetch(useHandlebars(`{{ api.${props.network.domain.toLowerCase()}.comments.get}}/${props.network.id}/comments`), {
                    params: { urn: props.post.meta.urn },
                })
            } else {
                response = await useAuthLazyFetch(useHandlebars(`{{ api.${props.network.domain.toLowerCase()}.comments.get}}/${props.network.id}/comments`), {
                    params: { post_id: props.postId },
                })
            }
            commentsList.value = formatComments(response.data.value, props.network.domain)
            isLoading.value = false
        }
    },
)

onMounted(() => {
    if (props.loadType !== 'load-comments') {
        commentsList.value = props.comments.data
    }
})
</script>
