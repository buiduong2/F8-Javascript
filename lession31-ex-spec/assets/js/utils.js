export function debounce(fn, delay) {
    var isReady = true;
    return function (...args) {
        if (isReady) {
            isReady = false;
            setTimeout(function () {
                isReady = true;
            }, delay);
            return fn(...args);
        }
    };
}
