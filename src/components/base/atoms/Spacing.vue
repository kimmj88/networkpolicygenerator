<template>
    <div class="spacing"></div>
</template>

<script setup lang="ts">
const props = defineProps({
    size: {
        type: String,
        default: '1rem'
    }
});
</script>

<style scoped>
.spacing {
    height: v-bind('props.size');
}
</style>
