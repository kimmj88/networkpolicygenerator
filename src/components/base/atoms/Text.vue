<template>
    <div :class="fontWeight" :style="{ 'font-size': props.size, color: props.color, fontWeight: props.fontWeight }">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
type FontSizeType = `${string}rem` | `${string}px` | `${string}em`;
type FontWeightType = 'lighter' | 'normal' | 'semibold' | 'bold' | 'bolder';

interface TextProps {
    size?: FontSizeType;
    color?: string;
    fontWeight?: FontWeightType;
}

const props = withDefaults(defineProps<TextProps>(), {
    size: '1rem',
    color: 'black',
    fontWeight: 'normal'
});
</script>

<style lang="scss" scoped></style>
