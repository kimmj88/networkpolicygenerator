<template>
    <div>
        <!-- textara의 사이즈에 대한 부분은 common.css에 세팅되어 있다.-->
        <textarea
            :class="textareaClass"
            :placeholder="placeHolder"
            :id="id"
            :name="name"
            autocomplete="off"
            :value="modelValue"
            @input="updateValue"
            :readonly="readonly"
            :min="min"
            :max="max"
            :rows="rows"
            :tabindex="tabindex"
        >
        </textarea>
    </div>
</template>
<script setup lang="ts">
interface TextAreaProps {
    id?: string;
    modelValue: string;
    name?: string;
    placeHolder?: string;
    textareaClass?: string;
    readonly?: boolean;
    min?: number;
    max?: number;
    rows?: number;
    tabindex?: number;
}

const { id, name, placeHolder, textareaClass } = defineProps<TextAreaProps>();
const emit = defineEmits(['update:modelValue']);
function updateValue(e: Event) {
    emit('update:modelValue', (e.target as HTMLTextAreaElement).value);
}
</script>
