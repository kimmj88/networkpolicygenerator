<template>
    <div class="border"></div>
</template>

<script setup lang="ts">
const props = defineProps({
    color: {
        type: String,
        default: '#E5E7EB'
    },
    width: {
        type: String,
        default: '1px'
    }
});
</script>

<style lang="scss" scoped>
.border {
    width: 100%;
    border-top: v-bind('props.width') solid v-bind('props.color');
}
</style>
