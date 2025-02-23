<template>
    <!-- Start of displaying stream -->
    <SocialStreamsStreamMain
        :id="props.streamId"
        :card-size="props.cardSize"
        :network-name="props.network.domain"
        :network="props.network"
        :type="props.streamType.label"
        :posts="posts"
        :profile="profile"
        :is-loading="isLoading"
        @refresh="refreshStream"
        @delete="deleteStream"
    />
    <!-- End of displaying stream -->
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import fields from '../../data/fields.json'
import { useNuxtApp, useAuthLazyFetch, useAuthLazyFetchPost, useAppConfig } from '#imports'

const props = defineProps<{
    network: object // Network related information
    streamType: object // Stream type information
    streamId: string
    cardSize: number
}>()

const { $bus } = useNuxtApp()
const emits = defineEmits<{
    /**
     * Delete stream
     */
    (event: 'delete', id: string): void
}>()

onMounted(() => {
    setTimeout(async () => {
        await refreshStream()
    }, 500)

    // On like button click event -- publish like to facebook
    $bus.$on(`${props.streamId}-like`, async ({ postId }) => {
        // Publish like to a facebook post
        await useAuthLazyFetchPost(useAppConfig().api.facebook.like, {
            body: {
                access_token: props.network.access_token,
                id: postId,
            },
        })
    })

    // On comment submit button click event -- publish comment to facebook
    $bus.$on(`${props.streamId}-comment`, async (post: { postId: string; comment: string }) => {
        // Add comment to facebook post
        await useAuthLazyFetchPost(`${useAppConfig().api.facebook.comment}/${post.postId}`, {
            body: {
                access_token: props.network.access_token,
                message: post.comment,
            },
        })

        // Refresh stream after comment action
        refreshStream()
    })

    // Refresh stream on 'social-stream-refresh' event
    $bus.$on('social-stream-refresh', () => {
        refreshStream()
    })

    profile.value = { name: props.network.name, picture: props.network.picture.data.url, id: props.network.id }
})

const posts = ref<object[]>([])
const isLoading = ref(false)

// Profile information for stream
const profile = ref()

// A Helper function to convert all comments to a format compatible with our common stream component
const formatComments = (comments: object[]) => {
    const commentData: object[] = []

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

            comment.id = item.id
            comment.from = item.from ? item.from.name : ''
            comment.picture = item.from ? item.from.picture.data.url : ''
            comment.message = item.message

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
        })
    }
    return commentData
}

// Format data compatible with our common stream component
const formatPostInfo = (data: object[]) => {
    // For every post information, convert into a standard format
    const postDataMap = data.map((item) => {
        const media = []

        if ('attachments' in item) {
            if ('subattachments' in item.attachments?.data[0]) {
                item.attachments?.data[0].subattachments.data.forEach((image) => {
                    media.push([image.description || '', image.media.image.src])
                })
            } else {
                item.attachments?.data.forEach((image) => {
                    media.push(['', image.media.image.src])
                })
            }
        }
        const postData = {
            id: item.id,
            from: {
                name: item.from.name,
                picture: item.from.picture.data.url,
            },
            lastUpdated: item.updated_time,
            message: item.message ? item.message : '',
            media: media || item.full_picture ? [['', item.full_picture]] : [],
            likes: {
                enabled: item.likes !== undefined,
                count: item.likes ? item.likes.summary.total_count : 0,
                hasLiked: item.likes ? item.likes.summary.has_liked : false,
                canLike: item.likes ? item.likes.summary.can_like : false,
            },
            comments: {
                enabled: item.comments !== undefined,
                type: 'has-comments',
                count: item.comments ? item.comments.summary.total_count : 0,
                canComment: item.comments ? item.comments.summary.can_comment : false,
                data: item.comments ? formatComments(item.comments.data) : [],
            },
        }
        return postData
    })
    return postDataMap
}

// Load stream based on stream type
const refreshStream = async () => {
    isLoading.value = true

    // Fetch stream data
    const response = await useAuthLazyFetch(`${useAppConfig().api.facebook.posts}/${props.streamType.value.toLowerCase()}`, {
        params: { access_token: props.network.access_token, fields: fields.facebook[props.streamType.value.toLowerCase()] },
    })
    posts.value = formatPostInfo(response.data.value.data)
    isLoading.value = false
}

// Delete stream
const deleteStream = (id: string) => {
    emits('delete', id)
}
</script>
