
export function debounce(fn: Function, delay: number) {
    var isReady = true;
    return function (...args: any[]) {
        if (isReady) {
            isReady = false;
            setTimeout(function () {
                isReady = true;
            }, delay);
            return fn(...args);
        }
    }
}