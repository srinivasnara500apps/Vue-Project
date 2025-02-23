<template>
    <!-- Start of comment input -->
    <input
        v-model="commentInput"
        type="text"
        :class="[
            ' border border-gray-300 focus:outline-0 peer focus:ring-0 text-gray-900 text-sm rounded-l-full h-10 border-r-0 flex transition-all w-full p-2.5 px-5',
            isLoading ? 'bg-zinc-200' : 'bg-gray-50',
        ]"
        placeholder="Write a comment..."
        :disabled="isLoading"
    />

    <!-- End of comment input -->

    <!--  Start of comment submit button -->
    <div :class="['border border-gray-300 transition-all peer-focus:border-blue-600 rounded-r-full border-l-0 h-10 pr-2 flex items-center cursor-pointer', isLoading ? 'bg-zinc-200' : 'bg-gray-50']">
        <i v-if="!isLoading" class="fa-duotone fa-paper-plane-top fa-lg" @click="add"></i>
        <Loading v-else :custom-class="`border-zinc-300 border-t-zinc-900 w-6 h-6`" class="relative w-6 h-6" />
    </div>
    <!-- End of comment submit button -->
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useBusEmit, useShowWarningNoty } from '#imports'

const props = defineProps<{
    network: object
    post: object
    postId: string
    streamId: string
}>()

// Variable holding value of comment input field
const commentInput = ref('')

// Variable indicating whether publishing of comment is in progress
const isLoading = ref(false)

// Input field validation
const validate = () => {
    // If the length of input is greater than zero after omitting leading and trailing spaces
    // Then comment is posted (validation successful)
    if (commentInput.value.trim().length > 0) {
        return true
    }
    // Show notification
    useShowWarningNoty('Please enter some text to post comment', 'Social+')
    commentInput.value = ''
    return false
}

// Add comment to facebook post
const add = () => {
    // If validate() returns true, then the comment is posted
    // Function validate() contains validation logic for comment input field
    if (validate()) {
        // Set loading to true
        isLoading.value = true

        useBusEmit(`${props.streamId}-comment`, {
            postId: props.postId,
            comment: commentInput.value,
            network: props.network,
            post: props.post,
        })

        setTimeout(() => {
            isLoading.value = false
            commentInput.value = ''
        }, 1000)
    }
}
</script>
