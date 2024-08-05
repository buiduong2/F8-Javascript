"use strict";
var SpeechRecognition = (window.webkitSpeechRecognition);
const recognition = new SpeechRecognition();

recognition.lang = 'vi-VN';
recognition.continuous = false;
recognition.interimResults = true;

const speechContentDetailEl = document.querySelector(".search-content-detail");
const msgWrapperEl = document.querySelector(".msg-wrapper");
const speechContentWrapperEl = document.querySelector(".search-content-wrapper");
const btnEl = document.querySelector(".btn");

let speechContent = "";

function changeClassState(newState) {
    const els = [msgWrapperEl,speechContentDetailEl];
    const classes = ["idle", "failure", "pending", "success"]
    for (const el of els) {
        for (const className of classes) {
            el.classList.remove(className);
        }
        el.classList.add(newState);
    }
}

btnEl.onclick = function () {
    changeClassState("pending");
    recognition.start();
};

recognition.onspeechend = function () {
    recognition.stop();
};

recognition.onresult = function (e) {
    let msg = Array.from(e.results)
        .map(result => result[0])
        .map(alter => alter.transcript)
        .join("");
    speechContentDetailEl.innerHTML = msg;
    speechContent = msg;
};

recognition.onend = function () {
    proccessSpeechContent(speechContent)
        .then((url) => {
            changeClassState("success");
            setTimeout(() => {
                goUrl(url);
            }, 1000);
        })
        .catch(() => {
            changeClassState("failure");
        })
        .finally(() => {
            setTimeout(() => {
                changeClassState("idle");
                speechContentDetailEl.textContent = "";
            }, 2000);
        });
};

// di chuyển đến link tương ứng
function goUrl(url) {
    const aEl = document.createElement("a");
    aEl.href = url;
    aEl.target = "_blank";
    document.body.append(aEl);
    aEl.click();
    aEl.remove();
}

const services = [
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
        searchQuery:true,
        encodeChars: {
            ' ': '%20'
        }
    },
    {
        keywords: ['bài hát', 'mở bài hát', ' nghe bài hát'],
        url: 'https://zingmp3.vn/tim-kiem/tat-ca?q=',
        searchQuery:true,
        encodeChars: {
            ' ': "+"
        }
    },
    {
        keywords: ['xem video', 'mở video', 'video', 'phim', 'xem'],
        url: "https://www.youtube.com/results?search_query=",
        searchQuery:true,
        encodeChars: {
            ' ': '+'
        }
    }
];
// Xử lý nội dung giọng nói vừa được nhận diện
function proccessSpeechContent(speechContent) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const serviceMatch = getService(speechContent);
            if (serviceMatch == null) {
                reject("Error");
                return;
            }
            const { service, keyword } = serviceMatch;
            let url = service.url;
            if(service.searchQuery) {
                let orderDetail = getOrderDetail(keyword, speechContent);
                Object.entries(service.encodeChars || {})
                    .forEach(([key, value]) => orderDetail = orderDetail.replace(key, value));
                url = url + orderDetail;
            }   
            resolve(url);
        }, 1500);
    });
}

// lấy ra service có độ khớp cao nhất
function getService(speechContent) {
    speechContent = speechContent.toLowerCase();
    const serviceMatches = [];
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
    });
    return bestMatch;
}

// lấy ra thông tin về nội dung của yêu cầu
function getOrderDetail(keyword, speechContent) {
    const index = speechContent.toLocaleLowerCase().indexOf(keyword);
    if (index == -1)
        return "";
    if (index + keyword.length < speechContent.length) {
        return speechContent.substring(index + keyword.length).trim();
    }
    return speechContent.substring(0, index).trim();
}


