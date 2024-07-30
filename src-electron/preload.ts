import { contextBridge, ipcRenderer } from 'electron';

console.log('electron api', process.contextIsolated);
// --------- Expose some API to the Renderer process ---------
const cbex = {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args;
        ipcRenderer.on(channel, listener);
        return () => {
            ipcRenderer.removeListener(channel, listener);
        };
    },
    once(...args: Parameters<typeof ipcRenderer.once>) {
        const [channel, listener] = args;
        ipcRenderer.once(channel, listener);
        return () => {
            ipcRenderer.removeListener(channel, listener);
        };
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args;
        return ipcRenderer.off(channel, ...omit);
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args;
        return ipcRenderer.send(channel, ...omit);
    },
    sendSync(...args: Parameters<typeof ipcRenderer.sendSync>) {
        const [channel, ...omit] = args;
        return ipcRenderer.sendSync(channel, ...omit);
    },
    postMessage(...args: Parameters<typeof ipcRenderer.postMessage>) {
        const [channel, message, transfer] = args;
        ipcRenderer.postMessage(channel, message, transfer);
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args;
        return ipcRenderer.invoke(channel, ...omit);
    },
    removeListener(...args: Parameters<typeof ipcRenderer.removeListener>) {
        const [channel, listener] = args;
        ipcRenderer.removeListener(channel, listener);
        return this;
    },
    removeAllListeners(...args: Parameters<typeof ipcRenderer.removeAllListeners>) {
        const [channel] = args;
        ipcRenderer.removeAllListeners(channel);
    }

    // You can expose other APTs you need here.
    // ...
};

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('ipcRenderer', cbex);
    } catch (error) {
        console.error(error);
    }
} else {
    // @ts-ignore (define in dts)
    window.ipcRenderer = ipcRenderer;
}

contextBridge.exposeInMainWorld('electron', {
    selectDirectory: () => ipcRenderer.invoke('select-dirs')
});

// import { electronAPI } from '@electron-toolkit/preload';
// import { contextBridge } from 'electron';

// console.log('electron api', process.contextIsolated);
// // Use `contextBridge` APIs to expose Electron APIs to
// // renderer only if context isolation is enabled, otherwise
// // just add to the DOM global.

// if (process.contextIsolated) {
//     try {
//         contextBridge.exposeInMainWorld('electron', electronAPI);
//     } catch (error) {
//         console.error(error);
//     }
// } else {
//     // @ts-ignore (define in dts)
//     window.electron = electronAPI;
// }
