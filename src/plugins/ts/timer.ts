function secProc(delay: number) {
    if (delay > 0) {
        delay -= 1000;
    } else {
        self.postMessage({ status: 'RUN' });
    }
    return delay;
}

self.onmessage = async (e: MessageEvent<any>) => {
    let delay = e.data;
    delay = secProc(delay);
    setInterval(() => {
        delay = secProc(delay);
    }, 1000);
};
