import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import pkg from './package.json';

const aliasArr = [
    { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    {
        find: '@a',
        replacement: fileURLToPath(new URL('./src/components/base/atoms', import.meta.url))
    },
    {
        find: '@m',
        replacement: fileURLToPath(new URL('./src/components/base/molecules', import.meta.url))
    },
    {
        find: '@o',
        replacement: fileURLToPath(new URL('./src/components/base/organisms', import.meta.url))
    },
    {
        find: '@cm',
        replacement: fileURLToPath(new URL('./src-common', import.meta.url))
    },
    {
        find: '@be',
        replacement: fileURLToPath(new URL('./src-electron/backend', import.meta.url))
    }
] as any[];

// https://vitejs.dev/config/
export default defineConfig(() => {
    fs.rmSync('dist-electron', { recursive: true, force: true });
    return {
        plugins: [
            vue(),
            vueI18n({
                runtimeOnly: false
            }),
            electron({
                main: {
                    // Shortcut of `build.lib.entry`.
                    entry: 'src-electron/main.ts',
                    vite: {
                        build: {
                            sourcemap: true,
                            outDir: 'dist-electron',
                            rollupOptions: {
                                // Some third-party Node.js libraries may not be built correctly by Vite, especially `C/C++` addons,
                                // we can use `external` to exclude them to ensure they work correctly.
                                // Others need to put them in `dependencies` to ensure they are collected into `app.asar` after the app is built.
                                // Of course, this is not absolute, just this way is relatively simple. :)
                                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {})
                            }
                        },
                        resolve: {
                            alias: [...aliasArr]
                        }
                    }
                },
                preload: {
                    // Shortcut of `build.rollupOptions.input`.
                    // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
                    input: path.join(__dirname, '', 'src-electron/preload.ts'),
                    vite: {
                        resolve: {
                            alias: [...aliasArr]
                        }
                    }
                },
                // Ployfill the Electron and Node.js API for Renderer process.
                // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
                // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
                renderer:
                    process.env.NODE_ENV === 'test'
                        ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
                          undefined
                        : {}
            })
        ],
        resolve: {
            alias: [...aliasArr]
        },
        css: {
            preprocessorOptions: {
                css: {
                    charset: false
                },
                scss: {
                    charset: false
                }
            }
        },
        build: {
            // outDir: path.resolve(__dirname, "../main/resources/static"),
            emptyOutDir: false,
            chunkSizeWarningLimit: 2000
            // rollupOptions: {
            //     output: {
            //         manualChunks(id) {
            //             if (id.includes("node_modules")) {
            //                 return id.toString().split("node_modules/")[1].split("/")[0].toString();
            //             }
            //         },
            //     },
            // },
        },
        server: {
            watch: {
                usePolling: true
            },
            proxy: {
                '/api': {
                    target: 'https://keylink.autocrypt.io', // 사용할 요청 도메인을 설정한다.
                    changeOrigin: true, // HTTP 요청 헤더의 Host 값을 서버의 호스트와 일치하도록 변경한다. 이를 통해 클라이언트의 요청을 target에 설정된 도메인에서 온 것 처럼 변경할 수 있다.
                    rewrite: (path) => path.replace(/\/api/, '')
                    // secure: true,
                }
            }
        }
    };
});
