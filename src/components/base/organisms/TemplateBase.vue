<template>
    <div class="template__wrapper">
        <div class="header__wrapper" v-if="$slots.header">
            <slot name="header"></slot>
        </div>
        <div class="body__wrapper" v-if="$slots.body">
            <slot name="body"></slot>
        </div>
        <div class="footer__wrapper" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
