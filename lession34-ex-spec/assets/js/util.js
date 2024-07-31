// Tạo ra một Function với return là một Object
// Object này chứa sự khác biệt giữa o1 và o2
// theo sự khác nhau sẽ là 
export function objDiff(o1, o2) {
    if (typeof o1 !== typeof o2) {
        return [o1, o2];
    }
    if (o1 === null || o2 === null) {
        return o2 === o1 ? undefined : [o1, o2];
    }
    if (typeof o1 !== 'object') {
        return o1 === o2 ? undefined : [o1, o2];
    }
    if (Array.isArray(o1) !== Array.isArray(o2)) {
        return [o1, o2];
    }
    var res = {};
    if (Array.isArray(o1)) {
        let n = Math.max(o1.length, o2.length);
        for (let i = 0; i < n; i++) {
            var diff = objDiff(o1[i], o2[i]);
            if (diff === undefined) {
                continue;
            }
            res[i] = diff;
        }
    }
    else {
        for (const key in o1) {
            res[key] = undefined;
        }
        for (const key in o2) {
            res[key] = undefined;
        }
        for (const key in res) {
            if (key in o1 && key in o2) {
                var diff = objDiff(o1[key], o2[key]);
                if (diff) {
                    res[key] = diff;
                }
                else {
                    delete res[key];
                }
            }
            else {
                res[key] = [o1[key], o2[key]];
            }
        }
    }
    for (const key in res) {
        return res;
    }
    return undefined;
}
