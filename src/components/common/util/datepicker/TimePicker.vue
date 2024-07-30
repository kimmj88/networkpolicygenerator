<template>
    <div class="custom-time-picker-component flex justify-around" :class="range ? 'mb-2' : ''">
        <div class="flex justify-around items-center" v-if="!range">
            <div class="mx-1"></div>
            <div class="dropdown">
                <a
                    class="btn btn-secondary dropdown-toggle w-16"
                    href="#"
                    role="button"
                    id="hoursDropDown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    @click="scrollMove('timePickerHours_' + setText(hours))"
                >
                    {{ setText(hours) }}
                </a>
                <ul class="dropdown-menu w-16" aria-labelledby="hoursDropDown">
                    <li v-for="h in hoursArray" :key="h.value" :value="h.value">
                        <a
                            :id="'timePickerHours_' + h.text"
                            class="dropdown-item"
                            :class="hours === h.value ? 'active' : ''"
                            @click="
                                $emit('update:hours', +h.value);
                                close('timePickerHours_' + h.text);
                            "
                            >{{ h.text }}</a
                        >
                    </li>
                </ul>
            </div>
            <div class="mx-1">:</div>
            <div class="dropdown">
                <a
                    class="btn btn-secondary dropdown-toggle w-16"
                    herf="#"
                    role="button"
                    id="minutesDropDown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    @click="scrollMove('timePickerMinutes_' + setText(minutes))"
                >
                    {{ setText(minutes) }}
                </a>
                <ul class="dropdown-menu w-16 m-10px" aria-labelledby="minutesDropDown">
                    <li v-for="m in minutesArray" :key="m.value" :value="m.value">
                        <a
                            :id="'timePickerMinutes_' + m.text"
                            class="dropdown-item"
                            :class="minutes === m.value ? 'active' : ''"
                            @click="
                                $emit('update:minutes', +m.value);
                                close('timePickerMinutes_' + m.text);
                            "
                            >{{ m.text }}</a
                        >
                    </li>
                </ul>
            </div>
            <div class="mx-1">:</div>
            <div class="dropdown">
                <a
                    class="btn btn-secondary dropdown-toggle w-16"
                    href="#"
                    role="button"
                    id="secondsDropDown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    @click="scrollMove('timePickerSeconds_' + setText(seconds))"
                >
                    {{ setText(seconds) }}
                </a>
                <ul class="dropdown-menu w-16" aria-labelledby="secondsDropDown">
                    <li v-for="s in secondsArray" :key="s.value" :value="s.value">
                        <a
                            :id="'timePickerSeconds_' + s.text"
                            class="dropdown-item"
                            :class="seconds === s.value ? 'active' : ''"
                            @click="
                                $emit('update:seconds', +s.value);
                                close('timePickerSeconds_' + s.text);
                            "
                            >{{ s.text }}</a
                        >
                    </li>
                </ul>
            </div>
            <div class="mx-1"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
    emits: ['update:hours', 'update:minutes', 'update:seconds'],
    props: {
        hoursIncrement: { type: [Number, String], default: 1 },
        minutesIncrement: { type: [Number, String], default: 1 },
        secondsIncrement: { type: [Number, String], default: 1 },
        is24: { type: Boolean, default: true },
        hoursGridIncrement: { type: [String, Number], default: 1 },
        minutesGridIncrement: { type: [String, Number], default: 5 },
        secondsGridIncrement: { type: [String, Number], default: 1 },
        range: { type: Boolean, default: false },
        filters: { type: Object, default: () => ({}) },
        minTime: { type: Object, default: () => ({}) },
        maxTime: { type: Object, default: () => ({}) },
        timePicker: { type: Boolean, default: false },
        hours: { type: [Number, Array], default: 0 },
        minutes: { type: [Number, Array], default: 0 },
        seconds: { type: [Number, Array], default: 0 },
        customProps: { type: Object, default: null },
        enableSeconds: { type: Boolean, default: false }
    },
    setup() {
        // Generate array of hours
        const hoursArray = computed(() => {
            const arr: Array<{ [x: string]: string | number }> = [];
            for (let i = 0; i < 24; i++) {
                arr.push({ text: i < 10 ? `0${i}` : i, value: i });
            }
            return arr;
        });

        // Generate array of minutes
        const minutesArray = computed(() => {
            const arr: Array<{ [x: string]: string | number }> = [];
            for (let i = 0; i < 60; i++) {
                arr.push({ text: i < 10 ? `0${i}` : i, value: i });
            }
            return arr;
        });

        // Generate array of minutes
        const secondsArray = computed(() => {
            const arr: Array<{ [x: string]: string | number }> = [];
            for (let i = 0; i < 60; i++) {
                arr.push({ text: i < 10 ? `0${i}` : i, value: i });
            }
            return arr;
        });

        const setText = (data: any) => {
            return data < 10 ? `0${data}` : data;
        };

        const scrollMove = (targetId: string) => {
            document?.querySelector('#' + targetId)?.scrollIntoView();
        };

        const close = (targetId: string) => {
            let target = document?.querySelector('#' + targetId)?.closest('div');
            if (target !== null && target !== undefined) {
                target?.querySelector('a')?.classList.remove('show');
                target?.querySelector('ul')?.classList.remove('show');
            }
        };

        return {
            hoursArray,
            minutesArray,
            secondsArray,
            setText,
            scrollMove,
            close
        };
    }
});
</script>

<style lang="scss" scoped>
.custom-time-picker-component {
    display: flex;
    align-items: center;
    justify-content: center;
}

.select-input {
    margin: 5px 3px;
    padding: 5px;
    width: 80px;
    height: 30px;
    border: 1px solid;
    border-radius: 4px;
    border-color: var(--dp-border-color);
    outline: none;
}

.dropdown-menu {
    min-width: 4rem;
}

// bootstrap dropdown-menu show 처리시
// transform: translate(-10px, 41.25px); 계산값이 -10로 계산되어 처리
.m-10px {
    margin-left: 10px !important;
}
</style>
