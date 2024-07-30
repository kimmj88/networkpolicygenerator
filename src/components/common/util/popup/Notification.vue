<template>
    <div class="flex flex-col justify-center min-h-screen bg-gray-200 align-center fixed z-[10000]">
        <NotificationGroup group="top">
            <div class="fixed inset-0 flex items-start justify-end p-16 px-4 py-16 pointer-events-none">
                <div class="w-full max-w-xl">
                    <Notification
                        v-slot="{ notifications, close }"
                        enter="transform ease-out duration-300 transition"
                        enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
                        enter-to="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-500"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                        move="transition duration-500"
                        move-delay="delay-300"
                    >
                        <div
                            v-for="notification in notifications"
                            :key="notification.id"
                            class="flex w-full justify-between max-w-xl mx-auto mt-4 overflow-hidden bg-white rounded-lg shadow-md"
                        >
                            <div class="flex items-center justify-start">
                                <div
                                    v-if="notification.type == 'success'"
                                    class="flex items-center justify-center w-12 h-full bg-green-500"
                                >
                                    <em class="bx bx-check-circle bx-flashing text-white text-xl"></em>
                                </div>

                                <div
                                    v-if="notification.type != 'success'"
                                    class="flex items-center justify-center w-12 h-full bg-yellow-500"
                                >
                                    <em class="bx bx-error-alt bx-flashing text-white text-xl"></em>
                                </div>

                                <div class="px-4 py-2 -mx-3">
                                    <div class="mx-3">
                                        <span class="font-semibold">{{ notification.title }}</span>
                                        <p class="text-sm text-gray-600">
                                            {{ notification.text }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center justify-center w-20 pointer-events-auto cursor-pointer m-1">
                                <button
                                    class="inline-flex text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                    @click="close(notification.id)"
                                >
                                    <span class="sr-only">Close</span>
                                    <em class="bx bx-x text-black text-xl"></em>
                                </button>
                            </div>
                        </div>
                    </Notification>
                </div>
            </div>
        </NotificationGroup>

        <NotificationGroup group="bottom" position="bottom">
            <div class="fixed inset-x-0 bottom-0 flex items-start justify-end p-24 px-4 py-24 pointer-events-none">
                <div class="w-full max-w-xl">
                    <Notification
                        v-slot="{ notifications }"
                        enter="transform ease-out duration-300 transition"
                        enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
                        enter-to="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-500"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                        move="transition duration-500"
                        move-delay="delay-300"
                    >
                        <div
                            v-for="notification in notifications"
                            :key="notification.id"
                            class="flex w-full max-w-xl mx-auto mt-4 overflow-hidden bg-white rounded-lg shadow-md"
                        >
                            <div class="flex items-center justify-center w-12 bg-red-500">
                                <em class="bx bx-error bx-flashing text-white text-xl"></em>
                            </div>

                            <div class="px-4 py-2 -mx-3">
                                <div class="mx-3">
                                    <span class="font-semibold text-red-500">{{ notification.title }}</span>
                                    <p class="text-sm text-gray-600">
                                        {{ notification.text }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Notification>
                </div>
            </div>
        </NotificationGroup>
    </div>
</template>
