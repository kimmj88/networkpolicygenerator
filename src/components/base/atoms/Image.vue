<template>
    <div class="atom">
        <img :class="classText" :src="source" :alt="alt" />
    </div>
</template>

<script setup lang="ts">
defineProps({
    classText: {
        type: String,
        default: ''
    },
    source: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        default: 'image'
    }
});
</script>
