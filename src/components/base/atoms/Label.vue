<template>
    <div class="atom">
        <span :id="id" :class="classText" :title="labelText">
            {{ labelText }}
            <slot name="msg"></slot>
        </span>
    </div>
</template>

<script setup lang="ts">
// import
import { v4 as uuidv4 } from 'uuid';
import { computed, toRefs } from 'vue';

// props
const props = defineProps({
    id: {
        type: String,
        default: undefined
    },
    classText: {
        type: String,
        default: 'text-white w-full h-12 text-base px-4 py-2.5 mr-2 mb-2'
    },
    labelText: {
        type: String,
        required: true
    }
});

// props to variable
const { classText, labelText } = toRefs(props);
const id = computed(() => props.id ?? uuidv4());

// library

// function
</script>
