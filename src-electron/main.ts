import 'reflect-metadata';
import { app, BrowserWindow, ipcMain, session, dialog } from 'electron';
// import { createRequire } from 'node:module'
import { mngCodeIpcSetter } from '@be/controller/mng/code/MngCodeController';
import { mngGrpCodeIpcSetter } from '@be/controller/mng/code/MngGrpCodeController';
import { mngMenuIpcSetter } from '@be/controller/mng/menu/MngMenuController';
import { startServer } from '@be/express/startServer';
import { Server } from 'http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'os';

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..');

process.env.BROWSER = 'none';

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

const setCookieName = 'Set-Cookie';
const sameSiteStrict = 'SameSite=Strict';
const sameSiteLax = 'SameSite=Lax';
const sameSiteNone = 'SameSite=None';
const addSameSiteNone = sameSiteNone + '; secure';

let win: BrowserWindow | null;

let server: Server | null;

function viewSetCookie(setCookieInfo: string) {
    if (setCookieInfo) {
        // Extract individual cookie strings from the header
        const cookies = setCookieInfo.split(';');

        // Process each cookie string
        cookies.forEach((cookie) => {
            const [key, value] = cookie.split('=');
            // Store the cookie key-value pair in your application's state or storage
            win?.webContents.send('main-process-message', 'Cookie:' + key + ' - ' + value);
            // Use the cookie information as needed for your application's logic
        });
    }
}

// var jarPath = app.getAppPath() + '\\student-portal-api.jar';
// var child = require('child_process').spawn( 'java', ['-jar', jarPath, ''] );

// var kill = require('tree-kill');
// kill(child.pid);

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process?.env?.VITE_PUBLIC, 'favicon/favicon_512x512.png'),
        width: VITE_DEV_SERVER_URL ? 2000 : 1600,
        height: 1200,
        useContentSize: true,
        webPreferences: {
            // nodeIntegration: true,
            // nodeIntegrationInWorker: true,
            preload: path.join(__dirname, 'preload.mjs'),
            // webSecurity: false,
            // allowRunningInsecureContent: true,
            devTools: !!VITE_DEV_SERVER_URL // electron devTools
        }
    });

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        if (details.responseHeaders) {
            // const cookies = (details.responseHeaders[setCookieName] || []).map(cookie => cookie.replace('SameSite=Lax', 'SameSite=None')).map(cookie => cookie += cookie.matchAll(/SameSite=None/g).length > 0 ? 'SameSite=None' : '');
            let cookies = (details.responseHeaders[setCookieName] || []).map((cookie) =>
                cookie.replace('SameSite=Lax', 'SameSite=None')
            );
            if (cookies.length > 0) {
                win?.webContents.send(
                    'main-process-message',
                    'responseHeaders => ' +
                        details.responseHeaders +
                        ', set-cookie => ' +
                        details.responseHeaders[setCookieName]
                );
                win?.webContents.send(
                    'main-process-message',
                    'cookie include ' +
                        cookies.includes(sameSiteStrict) +
                        ', ' +
                        cookies.includes(sameSiteLax) +
                        ', ' +
                        cookies.includes(sameSiteNone) +
                        ' => ' +
                        (!cookies.includes(sameSiteStrict) &&
                            !cookies.includes(sameSiteLax) &&
                            !cookies.includes(sameSiteNone))
                );
                let modCookies: string[] = [];
                if (
                    !cookies.includes(sameSiteStrict) &&
                    !cookies.includes(sameSiteLax) &&
                    !cookies.includes(sameSiteNone)
                ) {
                    cookies.push(addSameSiteNone);
                    modCookies[0] = cookies.join('; ');
                }
                viewSetCookie(cookies.join(';'));
                details.responseHeaders[setCookieName] = modCookies;
                win?.webContents.send(
                    'main-process-message',
                    'set-cookie custom => ' + details.responseHeaders[setCookieName]
                );
            }
        }

        callback({
            cancel: false,
            responseHeaders: Object.assign(
                {
                    ...details.responseHeaders,
                    'Access-Control-Allow-Origin': ['*'],
                    // We use this to bypass headers
                    'Access-Control-Allow-Headers': ['GET', 'POST', 'OPTION'],
                    'Sec-Fetch-Mode': 'no-cors',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-Dest': 'document',
                    // 'Content-Security-Policy': [
                    //     "default-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob:",
                    //     "connect-src 'self' https://keylink.autocrypt.io"
                    // ]
                    // 'Content-Security-Policy': [
                    //     "default-src 'self' connect-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob: https://keylink.autocrypt.io"
                    // ]
                    // 'Content-Security-Policy': [
                    //     "default-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src * data: blob: 'unsafe-inline'"
                    // ]
                    'Content-Security-Policy': [
                        "default-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob: ; connect-src 'self' data: blob: 'unsafe-inline' http://localhost:9000"
                    ]
                },
                details.responseHeaders
            )
        });
    });

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send(
            'main-process-message',
            process.env.DATABASE_URL + '-' + 'file:' + path.join(process.resourcesPath, 'prisma', 'npg.db')
        );
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
        win.webContents.openDevTools();
    } else {
        win.webContents.closeDevTools();
        win.loadFile(path.join(RENDERER_DIST, 'index.html'));
    }

    win.on('closed', () => {
        win = null;
        // close db server
        if (server != null) server.close();
    });
}

function setIpc() {
    console.log('setIpc start', ipcMain.eventNames());
    win?.webContents.send('main-process-message', ipcMain.eventNames());
    mngMenuIpcSetter(ipcMain);
    mngCodeIpcSetter(ipcMain);
    mngGrpCodeIpcSetter(ipcMain);
    console.log('setIpc end', ipcMain.eventNames());
}

app.whenReady().then(() => {
    try {
        server = startServer();
    } catch (e: any) {
        console.log(e);
    }

    ipcMain.on('ping', () => {
        console.log('pong');
        win?.webContents.send('main-process-message', 'pong');
    });

    setIpc();

    createWindow();

    win?.webContents.send('main-process-message', ipcMain.eventNames());

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('before-quit', () => {
    console.log('=================================');
    console.log('before-quit', win);
    console.log('=================================');
    // fe 삭제 필요 정보 삭제
    win?.webContents.send('quit-remove-data', new Date().toLocaleString());
});

// Mac의 경우 종료를 해도 최소화 상태가 된 것처럼 만들 수 있다.
// Mac에서 종료 버튼으로 앱을 죽이지 않고 살려두려면 app.quit으로 죽이지 않고 activate 이벤트가 발생 했을때 윈도우만 새로 만든다
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }

    if (server != null) server.close();

    if (platform !== 'darwin') {
        win = null;
    }
});

ipcMain.handle('select-dirs', async () => {
    if (win != null) {
        const result = await dialog.showOpenDialog(win, {
            properties: ['openDirectory']
        });
        return result.filePaths;
    }
});
