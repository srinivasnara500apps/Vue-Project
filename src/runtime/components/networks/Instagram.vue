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
import { useNuxtApp, useAuthLazyFetch, useAppConfig } from '#imports'

const props = defineProps<{
    network: object // Network related information
    streamType: object // Stream type information
    streamId: string
    cardSize: number
}>()

const emits = defineEmits<{
    /**
     * Delete stream
     */
    (event: 'delete', id: string): void
}>()

const { $bus } = useNuxtApp()

onMounted(() => {
    setTimeout(async () => {
        await refreshStream()
    }, 500)

    // Refresh stream on 'social-stream-refresh' event
    $bus.$on('social-stream-refresh', () => {
        refreshStream()
    })
    profile.value = { name: props.network?.name, picture: props.network?.picture?.data?.url, id: props.network?.id }
})

// Profile information for stream
const profile = ref()

const posts = ref<object[]>([])
const isLoading = ref(false)

// Format data compatible with our common streams component
const formatPostInfo = (data: object[]) => {
    const postDataMap = data.map((item) => {
        const postData = {
            id: item.id,
            from: {
                name: profile.value.name,
                picture: profile.value.picture ?? '',
            },
            lastUpdated: item.timestamp,
            message: item.caption,
            media: [['', item.media_url]],
            likes: {
                enabled: true,
                count: item.like_count,
                hasLiked: true,
                canLike: false,
            },
            comments: {
                enabled: true,
                type: 'load-comments',
                count: item.comments_count,
                canComment: false,
                data: [],
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
    const response = await useAuthLazyFetch(`${useAppConfig().api.instagram.posts}/${props.network.id}/${props.network.instagram_business_account.id}`, {
        params: { access_token: props.network.access_token, limit: 25 },
    })

    posts.value = formatPostInfo(response.data.value)
    isLoading.value = false
}

// Delete stream
const deleteStream = (id: string) => {
    emits('delete', id)
}
</script>
