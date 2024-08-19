export function counterUp(callback: Function, start: number, end: number, duration: number) {
    let startTime: number | null = null;
    let stop = false;
    function startCount(): Promise<void> {
        return new Promise(resolve => {
            function step(timestamp: number) {
                if (!startTime) {
                    startTime = timestamp;
                }
                const progress = Math.min((timestamp - startTime) / duration, 1);
                callback(progress * (end - start) + start);
                if (progress < 1 && !stop) {
                    window.requestAnimationFrame(step);
                } else {
                    callback(end);
                    resolve();
                }
            }

            window.requestAnimationFrame(step);
        })
    }

    function stopCount() {
        stop = true
        callback(end);
    }

    return {
        start: startCount,
        stop: stopCount
    }
}


export function sleep(duration: number): Promise<void> {

    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, duration);
    })
}

export function checkArrayStringEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false;
    const set = new Set(arr1);

    if (set.size !== arr1.length) return false;

    for (const str of arr2) {
        if (!set.has(str)) {
            return false;
        }
    }
    return true;
}