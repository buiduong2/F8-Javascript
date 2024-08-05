var SpeechRecognition = ((window as any).webkitSpeechRecognition) as any;

const recognition: SpeechRecognition = new SpeechRecognition();

recognition.lang = 'vi-VN'
recognition.continuous = false;
recognition.interimResults = true;

const speechContentDetailEl = document.querySelector(".search-content-detail") as HTMLElement;
const msgWrapperEl = document.querySelector(".msg-wrapper") as HTMLElement;
const speechContentWrapperEl = document.querySelector(".search-content-wrapper") as HTMLElement;
const btnEl = document.querySelector(".btn") as HTMLButtonElement;

let speechContent = "";

function changeClassState(newState: string, el: HTMLElement) {
    el.classList.remove("idle");
    el.classList.remove("failure");
    el.classList.remove("pending");
    el.classList.remove("success");
    el.classList.add(newState);
}

btnEl.onclick = function () {
    changeClassState("pending", msgWrapperEl);
    changeClassState("pending", speechContentWrapperEl);
    recognition.start();
}

recognition.onspeechend = function () {
    recognition.stop();
}

recognition.onresult = function (e: SpeechRecognitionEvent) {
    let msg: string = Array.from(e.results)
        .map(result => result[0])
        .map(alter => alter.transcript)
        .join("");

    speechContentDetailEl.innerHTML = msg;

    speechContent = msg;
}


recognition.onend = function () {

    proccessSpeechContent(speechContent)
        .then((url) => {
            changeClassState("success", msgWrapperEl);
            changeClassState("success", speechContentWrapperEl);
            setTimeout(() => {
                goUrl(url);
            }, 1000);
        })
        .catch(() => {
            changeClassState("failure", msgWrapperEl);
            changeClassState("failure", speechContentWrapperEl);
        })
        .finally(() => {
            setTimeout(() => {
                changeClassState("idle", msgWrapperEl);
                changeClassState("idle", speechContentWrapperEl);
                speechContentDetailEl.textContent = "";
            }, 2000);
        });

};


const services: Service[] = [
    {
        keywords: ['google maps', 'google map'],
        url: "https://www.google.com/maps"
    },
    {
        keywords: ['google drive'],
        url: "https://drive.google.com/"

    },
    {
        keywords: ['google'],
        url: "https://www.google.com.vn/",

    },
    {
        keywords: ['facebook'],
        url: 'https://www.facebook.com/'

    },
    {
        keywords: ['youtube'],
        url: 'https://www.youtube.com/'

    },
    {
        keywords: ['chỉ đường tới', 'chỉ đường', 'đường tới', 'tới'],
        url: "https://www.google.com/maps/search/",
        encodeChars: {
            ' ': '%20'
        }

    },
    {
        keywords: ['bài hát', 'mở bài hát', ' nghe bài hát'],
        url: 'https://zingmp3.vn/tim-kiem/tat-ca?q=',
        encodeChars: {
            ' ': "+"
        }

    },
    {
        keywords: ['xem video', 'mở video', 'video', 'phim', 'xem'],
        url: "https://www.youtube.com/results?search_query=",
        encodeChars: {
            ' ': '+'
        }
    }
]



function proccessSpeechContent(speechContent: string): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const serviceMatch = getService(speechContent);
            if (serviceMatch == null) {
                reject("Error");
                return;
            }

            const { service, keyword } = serviceMatch;
            let orderDetail = getOrderDetail(keyword, speechContent);
            Object.entries(service.encodeChars || {})
                .forEach(([key, value]) => {
                    orderDetail = orderDetail.replace(key, value);
                })
            const url = service.url + orderDetail;

            resolve(url);
        }, 1500);
    });
}

function getService(speechContent: string): ServiceMatch | null {
    speechContent = speechContent.toLowerCase();

    const serviceMatches: ServiceMatch[] = [];
    for (const service of services) {
        for (const keyword of service.keywords) {
            const index = speechContent.indexOf(keyword);
            if (index != -1) {
                serviceMatches.push({ service, keyword, index });
            }
        }
    }
    if (serviceMatches.length == 0) {
        return null;
    }

    const bestMatch = serviceMatches.reduce((bestMatch, current) => {
        if (bestMatch.index != current.index) {
            return bestMatch.index < current.index ? bestMatch : current;
        }
        return bestMatch.keyword.length > current.keyword.length ? bestMatch : current;
    })

    return bestMatch;

}

function getOrderDetail(keyword: string, speechContent: string): string {
    const index = speechContent.toLocaleLowerCase().indexOf(keyword);
    if (index == -1) return "";

    if (index + keyword.length < speechContent.length) {
        return speechContent.substring(index + keyword.length).trim();
    }
    return speechContent.substring(0, index).trim();
}

function goUrl(url: string): void {
    const aEl = document.createElement("a");
    aEl.href = url;
    aEl.target = "_blank"
    document.body.append(aEl);
    aEl.click();
    aEl.remove();
}

type Service = {
    keywords: string[],
    url: string,
    encodeChars?: { [char: string]: string }
}

type ServiceMatch = { service: Service, keyword: string, index: number };