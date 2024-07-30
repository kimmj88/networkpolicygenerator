<template>
    <div :id="id" tabindex="-1" aria-hidden="true"
        class="popup_container fixed top-0 left-0 right-0 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        :class="[isShow ? 'show' : '', `z-[${props.index}]`]" ref="containerRef">
        <!-- Modal content -->
        <div class="relative w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" :class="addClass">
            <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600"
                v-if="$slots.title">
                <h5 class="modal-title text-black dark:text-white font-medium">
                    <slot name="title"></slot>
                </h5>
                <AtomButton :type="'custom'"
                    :class-text="'text-gray-400 bg-transparent hover:bg-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'"
                    @click="close">
                    <template v-slot:msg>
                        <em class="bx bx-x text-2xl"></em>
                        <span class="sr-only">Close Modal</span>
                    </template>
                </AtomButton>
            </div>
            <!-- Modal body -->
            <div class="space-y-6 text-black dark:text-white"
                :class="addBodyClass + ($slots.mFooter ? '' : ' rounded-b')">
                <slot v-if="isShow" name="msg"></slot>
            </div>
            <!-- Modal footer -->
            <div class="flex items-center space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
                v-if="$slots.mFooter">
                <slot name="mFooter"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import AtomButton from '@a/Button.vue';
import { onMounted, toRefs, watch, ref, onBeforeUnmount } from 'vue';

const props = defineProps({
    id: {
        type: String,
        default: 'popupBase'
    },
    addClass: {
        type: String,
        default: ''
    },
    addBodyClass: {
        type: String,
        default: ''
    },
    cbFunc: {
        type: Function,
        required: false
    },
    isShow: {
        type: Boolean
    },
    index: {
        type: String
    }
});

const { id, addClass, addBodyClass } = toRefs(props);

const emit = defineEmits(['close']);

const { commonts } = base();

const containerRef = ref();

function close() {
    if (props.cbFunc !== undefined && typeof props.cbFunc === 'function') {
        props.cbFunc();
    }
    emit('close');
}

onMounted(() => {
    document.body.appendChild(containerRef.value);
});

onBeforeUnmount(() => {
    document.body.removeChild(containerRef.value);
});

watch(
    () => props.isShow,
    () => {
        if (props.isShow) {
            commonts.showModalBg(props.index);
        } else {
            // query all popup list
            const $popups = document.querySelectorAll('.popup_container.show');
            const indexs: number[] = [];
            $popups.forEach((el) => {
                // except target id
                if (el.id === props.id) {
                    return;
                }
                // get css value by css name
                const cssValue = getCssProperty(el, 'z-index');
                if (cssValue) {
                    indexs.push(parseInt(cssValue));
                }
            });

            if (indexs.length > 0) {
                commonts.showModalBg(Math.max(...indexs));
            } else {
                commonts.hideModalBg();
            }
        }
    }
);

function getCssProperty(el: Element, prop: string) {
    // Return the computed value of the css property prop for the element el
    return document?.defaultView?.getComputedStyle(el, null).getPropertyValue(prop);
}

</script>

<style scoped>
.popup_container {
    visibility: hidden;

    display: none;
}

.show {
    visibility: visible;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
