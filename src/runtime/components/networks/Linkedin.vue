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
import { useNuxtApp, useAuthLazyFetch, useAppConfig, useAuthLazyFetchPost } from '#imports'

const props = defineProps<{
    network: object // Network related information
    streamType: object // Stream type information
    streamId: string
}>()

const emits = defineEmits<{
    /**
     * Delete stream
     */
    (event: 'delete', id: string): void
}>()

const currentLimit = ref(10)
const currentOffset = ref(currentLimit.value)
const isRunning = ref(false)
const lastResponseEmpty = ref(false)

const { $bus } = useNuxtApp()

onMounted(() => {
    setTimeout(async () => {
        await refreshStream()
    }, 500)

    $bus.$on(`${props.streamId}--scroll-end`, async () => {
        if (isRunning.value === false && lastResponseEmpty.value !== true) {
            isLoading.value = true
            isRunning.value = true

            // Fetch stream data
            const response = await useAuthLazyFetch(`${useAppConfig().api.linkedin.posts}/${props.network.id}/posts`, {
                params: {
                    access_token: props.network.access_token,
                    organization_id: props.network.organization_id,
                    limit: currentLimit.value,
                    offset: currentOffset.value,
                },
            })

            lastResponseEmpty.value = !response.data.value?.length > 0

            if (response.data.value?.length > 0) {
                currentOffset.value += currentLimit.value
            }

            posts.value.push(...formatPostInfo(response.data.value))
            isLoading.value = false
            isRunning.value = false
        }
    })

    // On comment submit button click event -- publish comment to facebook
    $bus.$on(`${props.streamId}-comment`, async (payload: { postId: string; comment: string }) => {
        // Add comment to facebook post
        await useAuthLazyFetchPost(`${useAppConfig().api.linkedin.comments.add}/${payload.network.id}/comment`, {
            body: {
                urn: payload.post.meta.urn,
                organization_id: payload.post.meta.organization,
                actor: payload.post.meta.actor,
                object: payload.post.meta.object,
                text: payload.comment,
                media: '',
            },
        })

        // Refresh stream after comment action
        refreshStream()
    })

    // On like button click event -- publish like to facebook
    $bus.$on(`${props.streamId}-like`, async (payload: string) => {
        // Publish like to a facebook post
        await useAuthLazyFetchPost(`${useAppConfig().api.linkedin.like}/${payload.network.id}/like`, {
            body: {
                urn: payload.post.meta.urn,
                actor: payload.post.meta.actor,
                object: payload.post.meta.object,
            },
        })
    })

    // Refresh stream on 'social-stream-refresh' event
    $bus.$on('social-stream-refresh', () => {
        refreshStream()
    })

    profile.value = { name: props.network.name, id: props.network.id }
})

// Profile information for stream
const profile = ref()

const posts = ref<object[]>([])
const isLoading = ref(false)

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
            comment.message = item
            commentData.push(comment)
        })
    }
    return commentData
}

// Format data compatible with our common streams component
const formatPostInfo = (data: object[]) => {
    const postDataMap = data.map((item) => {
        const postData = {
            id: item.id,
            meta: {
                organization: item.owner,
                urn: item.activity,
                actor: item.created.actor,
                object: item.activity.replace('activity', 'share'),
            },
            from: {
                name: profile.value.name,
            },
            lastUpdated: item.lastModified.time,
            message: item.text.text,
            media: [['', item.content ? item.content.contentEntities[0].entityLocation : '']],
            likes: {
                enabled: item !== undefined,
                count: item ? item.likes_count : 0,
                hasLiked: item ? item.liked_by_current_user : false,
                canLike: item ? item.liked_by_current_user : true,
            },
            comments: {
                enabled: item.comments !== undefined,
                type: 'has-comments',
                count: item ? item.comments_count : 0,
                canComment: true,
                data: item.comments ? formatComments(item.comments) : [],
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
    const response = await useAuthLazyFetch(`${useAppConfig().api.linkedin.posts}/${props.network.id}/posts`, {
        params: {
            access_token: props.network.access_token,
            organization_id: props.network.organization_id,
            limit: currentOffset.value,
            offset: 0,
        },
    })
    posts.value = formatPostInfo(response.data.value)
    isLoading.value = false
}

// Delete stream
const deleteStream = (id: string) => {
    emits('delete', id)
}
</script>
