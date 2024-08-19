export function counterUp(callback, start, end, duration) {
    let startTime = null;
    let stop = false;
    function startCount() {
        return new Promise(resolve => {
            function step(timestamp) {
                if (!startTime) {
                    startTime = timestamp;
                }
                const progress = Math.min((timestamp - startTime) / duration, 1);
                callback(progress * (end - start) + start);
                if (progress < 1 && !stop) {
                    window.requestAnimationFrame(step);
                }
                else {
                    callback(end);
                    resolve();
                }
            }
            window.requestAnimationFrame(step);
        });
    }
    function stopCount() {
        stop = true;
        callback(end);
    }
    return {
        start: startCount,
        stop: stopCount
    };
}
export function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}
export function checkArrayStringEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    const set = new Set(arr1);
    if (set.size !== arr1.length)
        return false;
    for (const str of arr2) {
        if (!set.has(str)) {
            return false;
        }
    }
    return true;
}
export function shuffleArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        const randIndex = Math.floor(Math.random() * (arr.length));
        const temp = arr[i];
        arr[i] = arr[randIndex];
        arr[randIndex] = temp;
    }
}
