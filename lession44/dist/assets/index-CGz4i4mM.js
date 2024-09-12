(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(r){if(r.ep)return;r.ep=!0;const i=n(r);fetch(r.href,i)}})();var qn=/([:*])(\w+)/g,Wn="([^/]+)",Xn=/\*/g,Bn="?(?:.*)",Vn=/\/\?/g,Kn="/?([^/]+|)",Jn="(?:/^|^)",Qn="";function Ke(t){return t===void 0&&(t="/"),ee()?location.pathname+location.search+location.hash:t}function A(t){return t.replace(/\/+$/,"").replace(/^\/+/,"")}function At(t){return typeof t=="string"}function Zn(t){return typeof t=="function"}function kt(t){return t&&t.indexOf("#")>=0&&t.split("#").pop()||""}function ta(t,e){return e.length===0||!t?null:t.slice(1,t.length).reduce(function(n,a,r){return n===null&&(n={}),n[e[r]]=decodeURIComponent(a),n},null)}function wt(t){var e=A(t).split(/\?(.*)?$/);return[A(e[0]),e.slice(1).join("")]}function te(t){for(var e={},n=t.split("&"),a=0;a<n.length;a++){var r=n[a].split("=");if(r[0]!==""){var i=decodeURIComponent(r[0]);e[i]?(Array.isArray(e[i])||(e[i]=[e[i]]),e[i].push(decodeURIComponent(r[1]||""))):e[i]=decodeURIComponent(r[1]||"")}}return e}function Je(t,e){var n=wt(A(t.currentLocationPath)),a=n[0],r=n[1],i=r===""?null:te(r),o=[],s;if(At(e.path)){if(s=Jn+A(e.path).replace(qn,function(g,p,k){return o.push(k),Wn}).replace(Xn,Bn).replace(Vn,Kn)+"$",A(e.path)===""&&A(a)==="")return{url:a,queryString:r,hashString:kt(t.to),route:e,data:null,params:i}}else s=e.path;var l=new RegExp(s,Qn),f=a.match(l);if(f){var m=At(e.path)?ta(f,o):f.groups?f.groups:f.slice(1);return{url:A(a.replace(new RegExp("^"+t.instance.root),"")),queryString:r,hashString:kt(t.to),route:e,data:m,params:i}}return!1}function Qe(){return!!(typeof window<"u"&&window.history&&window.history.pushState)}function Z(t,e){return typeof t[e]>"u"||t[e]===!0}function ea(t){if(!t)return{};var e=t.split(","),n={},a;return e.forEach(function(r){var i=r.split(":").map(function(o){return o.replace(/(^ +| +$)/g,"")});switch(i[0]){case"historyAPIMethod":n.historyAPIMethod=i[1];break;case"resolveOptionsStrategy":a||(a={}),a.strategy=i[1];break;case"resolveOptionsHash":a||(a={}),a.hash=i[1]==="true";break;case"updateBrowserURL":case"callHandler":case"updateState":case"force":n[i[0]]=i[1]==="true";break}}),a&&(n.resolveOptions=a),n}function ee(){return typeof window<"u"}function na(t,e){return t===void 0&&(t=[]),e===void 0&&(e={}),t.filter(function(n){return n}).forEach(function(n){["before","after","already","leave"].forEach(function(a){n[a]&&(e[a]||(e[a]=[]),e[a].push(n[a]))})}),e}function F(t,e,n){var a=e||{},r=0;(function i(){if(!t[r]){n&&n(a);return}Array.isArray(t[r])?(t.splice.apply(t,[r,1].concat(t[r][0](a)?t[r][1]:t[r][2])),i()):t[r](a,function(o){typeof o>"u"||o===!0?(r+=1,i()):n&&n(a)})})()}F.if=function(t,e,n){return Array.isArray(e)||(e=[e]),Array.isArray(n)||(n=[n]),[t,e,n]};function ye(t,e){typeof t.currentLocationPath>"u"&&(t.currentLocationPath=t.to=Ke(t.instance.root)),t.currentLocationPath=t.instance._checkForAHash(t.currentLocationPath),e()}function Ct(t,e){for(var n=0;n<t.instance.routes.length;n++){var a=t.instance.routes[n],r=Je(t,a);if(r&&(t.matches||(t.matches=[]),t.matches.push(r),t.resolveOptions.strategy==="ONE")){e();return}}e()}function aa(t,e){t.navigateOptions&&(typeof t.navigateOptions.shouldResolve<"u"&&console.warn('"shouldResolve" is deprecated. Please check the documentation.'),typeof t.navigateOptions.silent<"u"&&console.warn('"silent" is deprecated. Please check the documentation.')),e()}function ra(t,e){t.navigateOptions.force===!0?(t.instance._setCurrent([t.instance._pathToMatchObject(t.to)]),e(!1)):e()}var xe=ee(),ia=Qe();function oa(t,e){if(Z(t.navigateOptions,"updateBrowserURL")){var n=("/"+t.to).replace(/\/\//g,"/"),a=xe&&t.resolveOptions&&t.resolveOptions.hash===!0;ia?(history[t.navigateOptions.historyAPIMethod||"pushState"](t.navigateOptions.stateObj||{},t.navigateOptions.title||"",a?"#"+n:n),location&&location.hash&&(t.instance.__freezeListening=!0,setTimeout(function(){if(!a){var r=location.hash;location.hash="",location.hash=r}t.instance.__freezeListening=!1},1))):xe&&(window.location.href=t.to)}e()}function Ze(t,e){var n=t.instance;if(!n.lastResolved()){e();return}F(n.lastResolved().map(function(a){return function(r,i){if(!a.route.hooks||!a.route.hooks.leave){i();return}var o=!1,s=t.instance.matchLocation(a.route.path,t.currentLocationPath,!1);if(a.route.path!=="*")o=!s;else{var l=t.matches?t.matches.find(function(f){return a.route.path===f.route.path}):!1;o=!l}if(Z(t.navigateOptions,"callHooks")&&o){F(a.route.hooks.leave.map(function(f){return function(m,g){return f(function(p){p===!1?t.instance.__markAsClean(t):g()},t.matches&&t.matches.length>0?t.matches.length===1?t.matches[0]:t.matches:void 0)}}).concat([function(){return i()}]));return}else i()}}),{},function(){return e()})}function sa(t,e){t.match.route.hooks&&t.match.route.hooks.before&&Z(t.navigateOptions,"callHooks")?F(t.match.route.hooks.before.map(function(n){return function(r,i){return n(function(o){o===!1?t.instance.__markAsClean(t):i()},t.match)}}).concat([function(){return e()}])):e()}function ca(t,e){Z(t.navigateOptions,"callHandler")&&t.match.route.handler(t.match),t.instance.updatePageLinks(),e()}function la(t,e){t.match.route.hooks&&t.match.route.hooks.after&&Z(t.navigateOptions,"callHooks")&&t.match.route.hooks.after.forEach(function(n){return n(t.match)}),e()}function fa(t,e){var n=t.instance.lastResolved();if(n&&n[0]&&n[0].route===t.match.route&&n[0].url===t.match.url&&n[0].queryString===t.match.queryString){n.forEach(function(a){a.route.hooks&&a.route.hooks.already&&Z(t.navigateOptions,"callHooks")&&a.route.hooks.already.forEach(function(r){return r(t.match)})}),e(!1);return}e()}function ua(t,e){var n=t.instance._notFoundRoute;if(n){t.notFoundHandled=!0;var a=wt(t.currentLocationPath),r=a[0],i=a[1],o=kt(t.to);n.path=A(r);var s={url:n.path,queryString:i,hashString:o,data:null,route:n,params:i!==""?te(i):null};t.matches=[s],t.match=s}e()}function da(t,e){(!t.resolveOptions||t.resolveOptions.noMatchWarning===!1||typeof t.resolveOptions.noMatchWarning>"u")&&console.warn('Navigo: "'+t.currentLocationPath+`" didn't match any of the registered routes.`),e()}function ma(t,e){t.instance._setCurrent(null),e()}function tn(t,e){Z(t.navigateOptions,"updateState")&&t.instance._setCurrent(t.matches),e()}var en=[fa,sa,ca,la],Ae=[Ze,ua,F.if(function(t){var e=t.notFoundHandled;return e},en.concat([tn]),[da,ma])];function zt(){return zt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},zt.apply(this,arguments)}function ke(t,e){var n=0;function a(){if(n===t.matches.length){tn(t,e);return}F(en,zt({},t,{match:t.matches[n]}),function(){n+=1,a()})}Ze(t,a)}function Tt(t){t.instance.__markAsClean(t)}function Dt(){return Dt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},Dt.apply(this,arguments)}var we="[data-navigo]";function pa(t,e){var n=e||{strategy:"ONE",hash:!1,noMatchWarning:!1,linksSelector:we},a=this,r="/",i=null,o=[],s=!1,l,f=Qe(),m=ee();t?r=A(t):console.warn('Navigo requires a root path in its constructor. If not provided will use "/" as default.');function g(c){return c.indexOf("#")>=0&&(n.hash===!0?c=c.split("#")[1]||"/":c=c.split("#")[0]),c}function p(c){return A(r+"/"+A(c))}function k(c,d,h,b){return c=At(c)?p(c):c,{name:b||A(String(c)),path:c,handler:d,hooks:na(h)}}function C(c,d,h){var b=this;return typeof c=="object"&&!(c instanceof RegExp)?(Object.keys(c).forEach(function(v){if(typeof c[v]=="function")b.on(v,c[v]);else{var I=c[v],ot=I.uses,Yn=I.as,$n=I.hooks;o.push(k(v,ot,[l,$n],Yn))}}),this):(typeof c=="function"&&(h=d,d=c,c=r),o.push(k(c,d,[l,h])),this)}function T(c,d){if(a.__dirty){a.__waiting.push(function(){return a.resolve(c,d)});return}else a.__dirty=!0;c=c?A(r)+"/"+A(c):void 0;var h={instance:a,to:c,currentLocationPath:c,navigateOptions:{},resolveOptions:Dt({},n,d)};return F([ye,Ct,F.if(function(b){var v=b.matches;return v&&v.length>0},ke,Ae)],h,Tt),h.matches?h.matches:!1}function E(c,d){if(a.__dirty){a.__waiting.push(function(){return a.navigate(c,d)});return}else a.__dirty=!0;c=A(r)+"/"+A(c);var h={instance:a,to:c,navigateOptions:d||{},resolveOptions:d&&d.resolveOptions?d.resolveOptions:n,currentLocationPath:g(c)};F([aa,ra,Ct,F.if(function(b){var v=b.matches;return v&&v.length>0},ke,Ae),oa,Tt],h,Tt)}function N(c,d,h){var b=ge(c,d);return b!==null?(E(b.replace(new RegExp("^/?"+r),""),h),!0):!1}function w(c){return this.routes=o=o.filter(function(d){return At(c)?A(d.path)!==A(c):Zn(c)?c!==d.handler:String(d.path)!==String(c)}),this}function S(){f&&(this.__popstateListener=function(){a.__freezeListening||T()},window.addEventListener("popstate",this.__popstateListener))}function U(){this.routes=o=[],f&&window.removeEventListener("popstate",this.__popstateListener),this.destroyed=s=!0}function G(c,d){return a._notFoundRoute=k("*",c,[l,d],"__NOT_FOUND__"),this}function ht(){if(m)return it().forEach(function(c){if(c.getAttribute("data-navigo")==="false"||c.getAttribute("target")==="_blank"){c.hasListenerAttached&&c.removeEventListener("click",c.navigoHandler);return}c.hasListenerAttached||(c.hasListenerAttached=!0,c.navigoHandler=function(d){if((d.ctrlKey||d.metaKey)&&d.target.tagName.toLowerCase()==="a")return!1;var h=c.getAttribute("href");if(typeof h>"u"||h===null)return!1;if(h.match(/^(http|https)/)&&typeof URL<"u")try{var b=new URL(h);h=b.pathname+b.search}catch{}var v=ea(c.getAttribute("data-navigo-options"));s||(d.preventDefault(),d.stopPropagation(),a.navigate(A(h),v))},c.addEventListener("click",c.navigoHandler))}),a}function it(){return m?[].slice.call(document.querySelectorAll(n.linksSelector||we)):[]}function Nt(c){return"/"+r+"/"+A(c)}function Mn(c){return l=c,this}function jn(){return i}function ge(c,d,h){var b=o.find(function(ot){return ot.name===c}),v=null;if(b){if(v=b.path,d)for(var I in d)v=v.replace(":"+I,d[I]);v=v.match(/^\//)?v:"/"+v}return v&&h&&!h.includeRoot&&(v=v.replace(new RegExp("^/"+r),"")),v}function zn(c){return c.getAttribute("href")}function ve(c){var d=wt(A(c)),h=d[0],b=d[1],v=b===""?null:te(b),I=kt(c),ot=k(h,function(){},[l],h);return{url:h,queryString:b,hashString:I,route:ot,data:null,params:v}}function Dn(){return ve(A(Ke(r)).replace(new RegExp("^"+r),""))}function Hn(c){var d={instance:a,currentLocationPath:c,to:c,navigateOptions:{},resolveOptions:n};return Ct(d,function(){}),d.matches?d.matches:!1}function Un(c,d,h){typeof d<"u"&&(typeof h>"u"||h)&&(d=p(d));var b={instance:a,to:d,currentLocationPath:d};ye(b,function(){}),typeof c=="string"&&(c=typeof h>"u"||h?p(c):c);var v=Je(b,{name:String(c),path:c,handler:function(){},hooks:{}});return v||!1}function gt(c,d,h){return typeof d=="string"&&(d=be(d)),d?(d.hooks[c]||(d.hooks[c]=[]),d.hooks[c].push(h),function(){d.hooks[c]=d.hooks[c].filter(function(b){return b!==h})}):(console.warn("Route doesn't exists: "+d),function(){})}function be(c){return typeof c=="string"?o.find(function(d){return d.name===p(c)}):o.find(function(d){return d.handler===c})}function Gn(c){c.instance.__dirty=!1,c.instance.__waiting.length>0&&c.instance.__waiting.shift()()}this.root=r,this.routes=o,this.destroyed=s,this.current=i,this.__freezeListening=!1,this.__waiting=[],this.__dirty=!1,this.__markAsClean=Gn,this.on=C,this.off=w,this.resolve=T,this.navigate=E,this.navigateByName=N,this.destroy=U,this.notFound=G,this.updatePageLinks=ht,this.link=Nt,this.hooks=Mn,this.extractGETParameters=function(c){return wt(g(c))},this.lastResolved=jn,this.generate=ge,this.getLinkPath=zn,this.match=Hn,this.matchLocation=Un,this.getCurrentLocation=Dn,this.addBeforeHook=gt.bind(this,"before"),this.addAfterHook=gt.bind(this,"after"),this.addAlreadyHook=gt.bind(this,"already"),this.addLeaveHook=gt.bind(this,"leave"),this.getRoute=be,this._pathToMatchObject=ve,this._clean=A,this._checkForAHash=g,this._setCurrent=function(c){return i=a.current=c},S.call(this),ht.call(this)}const bt=(t,e)=>`
        <div class="mx-auto my-auto flex flex-col justify-center items-center">
            <h1 class="mb-8 text-9xl font-bold">${e.code}</h1>
            <p class="text-2xl">${e.message}</p>
        </div>
    `;function ne(t,e){const n=Object.entries(e).map(([a,r])=>typeof r=="string"?a+"="+r:r.map(i=>a+"="+i).join("&")).join("&");n?O.navigate(t+"?"+n):O.navigate(t)}function ha(t){let e=[];typeof t.f=="string"?e.push(t.f):Array.isArray(t.f)&&e.push(...t.f),t.q&&e.push(t.q);const n={between(a,r,i){return a>=Number(r)&&a<=Number(i)},equal(a,r){return a===r},like(a,r){return a.toUpperCase().includes(r.toUpperCase())}};if(e.length){e=e.filter(xa);const a=va(e,i=>i.split("_")[0],i=>i.split("_")[1]);return Object.entries(a).map(([i,o])=>o.map(s=>s.split("-")).map(s=>[s[0],...s[1].split(",")]).map(([s,...l])=>f=>n[s](f[i],...l)).reduce(ba,()=>!1)).reduce(ya,()=>!0)}else return()=>!0}function ga(t){let e=t.s;if(e){const[n,a]=e.split(","),r=a==="desc";return(i,o)=>typeof o[n]=="string"?ka(o[n],i[n],r):Aa(o[n],i[n],r)}else return()=>0}function va(t,e,n,a){const r={};return t.reduce((i,o)=>{const s=e(o),l=n(o);return s in i||(i[s]=[]),i[s].push(l),i},r)}function ba(t,e){return n=>t(n)||e(n)}function ya(t,e){return n=>t(n)&&e(n)}function xa(t){return t}function Aa(t,e,n){return n?e-t:t-e}function ka(t,e,n){const a=t.localeCompare(e);return n?a*-1:a}const ae=[{id:1,imgUrl:"item1.jpg",title:"Đĩa game Spider-Man: Miles Morales",price:55e4,category:"rpg",discount:31},{id:2,imgUrl:"item2.jpg",title:"Đĩa game Jackboy",price:65e4,category:"action",discount:31},{id:3,imgUrl:"item3.jpg",title:"Đĩa game Crash Bandicoot 4",category:"fps",price:75e4,discount:31},{id:4,imgUrl:"item4.jpg",title:"Đĩa game Dreams",category:"sport",price:85e4,discount:31},{id:5,imgUrl:"item5.jpg",title:"Đĩa game Samurai Showdown",category:"action",price:95e4,discount:31},{id:6,imgUrl:"item6.jpg",title:"Đĩa game Nioh2",category:"rpg",price:1e6,discount:31}],wa="https://buiduong2.github.io/F8-Javascript/lession44/dist/";ae.forEach(t=>t.imgUrl=wa+t.imgUrl);const Ea=[{title:"GIÁ GỐC",options:[{value:"price_between-500000,600000",label:"500.000 - 600.000"},{value:"price_between-600000,700000",label:"600.000 - 700.000"},{value:"price_between-700000,800000",label:"700.000 - 800.000"},{value:"price_between-800000,1000000",label:"800.000 - 1.000.000"}]},{title:"THỂ LOẠI",options:[{value:"category_equal-rpg",label:"RPG"},{value:"category_equal-action",label:"Action"},{value:"category_equal-fps",label:"FPS"},{value:"category_equal-sport",label:"Sport"}]}];function Sa(){return JSON.parse(JSON.stringify(Ea))}function nn(t){let e=[...ae];if(t){const n=ha(t);e=e.filter(n);const a=ga(t);e=e.sort(a)}return JSON.parse(JSON.stringify(e))}function Oa(t){const e=ae.find(n=>n.id===t);return e&&JSON.parse(JSON.stringify(e))}const Pa=t=>{const e=Sa(),n=nn();return`
    ${_a(t,e)}
    <div class="product-section w-4/5 shadow-lg bg-white rounded-sm ">
        <div class="product-seciton-action flex justify-between items-center p-3">
          <p>Trang 1-34 </p>
          <div class="flex gap-5 items-center">
            <p>Sắp xếp</p>
            <select class='sort-product border border-black p-1 rounded' name="sort" class="border-black border p-1">
              <option value="" active> Sắp xếp theo</option>
              <option value="price,desc"> Giá: Thấp đến cao</option>
              <option value="price,asc"> Giá: cao đến thấp</option>
              <option value="title,asc"> Tên: A-Z</option>
              <option value="title,desc"> Tên: Z-A</option>
            </select>
          </div>
        </div>

        <div class="product-list flex flex-wrap gap-y-1 mt-5">
            ${n.map(a=>an(a)).join("")}
        </div>
    </div>

    `},_a=(t,e)=>`
    <aside class="filter bg-gray-300 w-1/5">
        ${e.map(n=>`
        <div class="filter-item">
            <h2 class="p-3 bg-gray-800 text-white">${n.title}</h2>
            <ul class="filter-list p-4 mb-3">
            ${n.options.map(a=>`
                <li class="filter-item">
                        <label class="cursor-pointer hover:text-blue-400">
                            <input class="mr-2 cursor-pointer" type="checkbox" value="${a.value}">
                            ${a.label}
                        </label>
                </li>
                    `).join("")}
            </ul>
        </div>
        `).join()}
        <div class="filter-item">
            <h2 class="p-3 bg-gray-800 text-white">TÌM KIẾM</h2>
            <div class="search-wrapper p-4 mb-3">
                <input class="search-input w-full p-2" placeholder="Nhập vào để tìm kiếm" type="text">
            </div>
        </div>
    </aside>
`,an=t=>{const e={...t,url:"/san-pham/"+t.id,newPrice:(t.price-t.price*t.discount/100).toLocaleString("en"),price:t.price.toLocaleString("en")};return`
		<article class="product w-1/4 flex flex-col justify-between hover:bg-white hover:shadow-lg p-3 relative">
			<div class="sale bg-red-600 text-white absolute right-0 top-0 text-center p-2
				after:block after:border-[30px] after:h-1/2 after:border-transparent after:border-t-red-600 after:absolute 
				after:top-full after:left-0 after:right-0"
			>
				<p class="text-xs">Giảm Giá</p>
				<p class="quantity font-bold">${e.discount}%</p>
			</div>
			<div class="product-header">
				<a class="cursor-pointer" href="${e.url}" data-navigo>
					<img src="${e.imgUrl}" alt="">
				</a>
			</div>
			<div class="product-body text-center">
				<a class="cursor-pointer hover:text-blue-500" href="${e.url}" data-navigo>
					<h3 class="title p-4 text-lg">${e.title}</h3>
				</a>
				<div class="price flex justify-center items-center gap-1">
				<div class="current text-orange-600 font-bold text-xl">${e.newPrice}đ</div>
				<div class="old line-through">${e.price}đ</div>
				</div>
			</div>

			<div class="product-footer mt-3 text-center">
				<button class="bg-orange-600 text-white p-4 hover:bg-orange-700">Thêm vào giỏ hàng</button>
			</div>
		</article>
    `};let re=!0;function La(t){re&&(Na(t),Ca(t),Ta(t))}function Na(t){const e=t.params||{},n=[...document.querySelectorAll(".filter input")];e.f&&n.filter(a=>e.f.includes(a.value)).forEach(a=>a.checked=!0),n.forEach(a=>{a.onchange=()=>{var o;let r=n.filter(s=>s.checked).map(s=>`${s.value}`);const i=((o=O.lastResolved())==null?void 0:o[0].params)||{};r.length?i.f=r:delete i.f,ne("/san-pham",i)}})}function Ca(t){var n;const e=document.querySelector(".search-input");(n=t.params)!=null&&n.q&&(e.value=t.params.q.split("-")[1]),e.oninput=a=>{var i;const r=((i=O.lastResolved())==null?void 0:i[0].params)||{};if(e.value){const o=`title_like-${e.value}`;r.q=o}else delete r.q;ne("/san-pham",r)}}function Ta(t){var n;const e=document.querySelector(".sort-product");if((n=t.params)!=null&&n.s){const a=t.params.s;e.value=a}e.onchange=a=>{var i;const r=((i=O.lastResolved())==null?void 0:i[0].params)||{};e.value?r.s=e.value:delete r.s,ne("/san-pham",r)}}function Ia(t){const e=document.querySelector(".product-list"),n=nn(t.params);e.innerHTML=n.map(a=>an(a)).join(""),O.updatePageLinks()}function Fa(){re=!1}function Ra(t){re=!0,t()}const Ma={after:[La,Ia,Fa],leave:[Ra]},Ee="The Page you are Looking for may have been moved, deleted, or possibly nerver exists",ja="The Server encounterd an internal Error",Se=document.querySelector("#app"),O=new pa("/",{hash:!0});function za(t,e){let n=e();n=n.replace("{body}",'<span class="js-page-view"></span>'),Se.innerHTML=n;let a=Se.querySelector(".js-page-view");if(a.parentElement.children.length>1)throw new Error("{body} must be only child of it's parent ");const r=a.parentElement;t.forEach(i=>{O.on(i.path,o=>{var s;try{if(((s=O.lastResolved())==null?void 0:s[0].url)===o.url)return;r.innerHTML=i.component(o)}catch(l){console.warn(l),O.navigateByName("500")}})}),O.getRoute("/san-pham").hooks=Ma,O.on({"/not-found/":{as:"404",uses:i=>{r.innerHTML=bt(i,{code:404,message:Ee})}},"/error":{as:"500",uses:i=>{r.innerHTML=bt(i,{code:500,message:ja})}}}),O.notFound(i=>{r.innerHTML=bt(i,{code:404,message:Ee})}),O.resolve()}const Da=()=>`
        <h1 class="text-bold text-8xl m-auto">Home</h1>
	`,Ha=()=>`
        <h1 class="text-bold text-8xl m-auto">Page About</h1>
    `,Ua=t=>{const e=Oa(Number(t.data.id));if(!e)return bt(void 0,{code:404,message:"Product Not found"});const n={...e,url:"/san-pham/"+e.id,newPrice:(e.price-e.price*e.discount/100).toLocaleString("en"),price:e.price.toLocaleString("en")};return`
        <div class="img-list w-3/5 flex justify-center">
            <img src="${n.imgUrl}" class="max-w-[400px]">
        </div>
        <div class="detail w-2/5 min-h-[400px] bg-white rounded-sm p-5">
            <h2 class="product-title text-xl font-semibold">${n.title}</h2>
            <p class="price my-5 text-2xl font-bold">${n.newPrice} đ</p>
            <div class="quantity">
                <div class="flex border w-fit font-semibold">
                    <span class="p-1 px-3 hover:border-r cursor-pointer">+</span>
                    <input
                        class="text-center w-20 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        type="number" value="1">
                    <span class="p-1 px-3 hover:border-l cursor-pointer">-</span>
                </div>
            </div>
            <p class="action">
                <a href="/san-pham" data-navigo class=" text-center inline-block bg-orange-500 p-3 w-4/5 mt-5 text-white hover:bg-orange-600">Quay về</a>
            </p>
        </div>
    `},Ga=()=>`
    <header class="bg-slate-950 text-gray-400  flex justify-between px-5 mb-10">
      <ul class="flex gap-2 ">
        <li><a class="hover:text-blue-600 text-lg px-3 py-3 block" href="/" data-navigo>Home</a></li>
        <li><a class="hover:text-blue-600 text-lg px-3 py-3 block" href="/san-pham" data-navigo>Sản phẩm</a></li>
        <li><a class="hover:text-blue-600 text-lg px-3 py-3 block" href="/gioi-thieu" data-navigo>About</a></li>
      </ul>
      <div class="cart p-3 pl-5 hover:text-blue-600 cursor-pointer relative border-l-gray-400 border-l">
        <div
          class="quantity bg-blue-500 text-white text-center rounded absolute px-0.5 top-0 right-0 -translate-x-1/2  font-bold text-sm">
          0</div>
        <i class="fa-solid fa-cart-shopping text-lg align-middle"></i>
      </div>

    </header>

    <main class="container flex gap-5 grow items-start">
        {body}
    </main>
    <footer class="bg-slate-950 p-3 mt-10">
      <h2 class="text-white text-lg">Footer</h2>
    </footer>
    `,Oe=()=>{};let ie={},rn={},on=null,sn={mark:Oe,measure:Oe};try{typeof window<"u"&&(ie=window),typeof document<"u"&&(rn=document),typeof MutationObserver<"u"&&(on=MutationObserver),typeof performance<"u"&&(sn=performance)}catch{}const{userAgent:Pe=""}=ie.navigator||{},q=ie,y=rn,_e=on,vt=sn;q.document;const H=!!y.documentElement&&!!y.head&&typeof y.addEventListener=="function"&&typeof y.createElement=="function",cn=~Pe.indexOf("MSIE")||~Pe.indexOf("Trident/");var x="classic",ln="duotone",P="sharp",_="sharp-duotone",Ya=[x,ln,P,_],$a={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds"}},Le={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},qa=["kit"],Wa=/fa(s|r|l|t|d|b|k|kd|ss|sr|sl|st|sds)?[\-\ ]/,Xa=/Font ?Awesome ?([56 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit)?.*/i,Ba={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},Va={"Font Awesome 6 Free":{900:"fas",400:"far"},"Font Awesome 6 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 6 Brands":{400:"fab",normal:"fab"},"Font Awesome 6 Duotone":{900:"fad"},"Font Awesome 6 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 6 Sharp Duotone":{900:"fasds"}},Ka={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds"}},Ja={classic:["fas","far","fal","fat"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds"]},Qa={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid"}},Za={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds"}},fn={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid"}},tr=["solid","regular","light","thin","duotone","brands"],un=[1,2,3,4,5,6,7,8,9,10],er=un.concat([11,12,13,14,15,16,17,18,19,20]),st={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},nr=[...Object.keys(Ja),...tr,"2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","fw","inverse","layers-counter","layers-text","layers","li","pull-left","pull-right","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul",st.GROUP,st.SWAP_OPACITY,st.PRIMARY,st.SECONDARY].concat(un.map(t=>"".concat(t,"x"))).concat(er.map(t=>"w-".concat(t))),ar={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},rr={kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}},ir={kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}},Ne={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}};const z="___FONT_AWESOME___",Ht=16,dn="fa",mn="svg-inline--fa",J="data-fa-i2svg",Ut="data-fa-pseudo-element",or="data-fa-pseudo-element-pending",oe="data-prefix",se="data-icon",Ce="fontawesome-i2svg",sr="async",cr=["HTML","HEAD","STYLE","SCRIPT"],pn=(()=>{try{return!0}catch{return!1}})(),hn=[x,P,_];function mt(t){return new Proxy(t,{get(e,n){return n in e?e[n]:e[x]}})}const gn={...fn};gn[x]={...fn[x],...Le.kit,...Le["kit-duotone"]};const V=mt(gn),Gt={...Za};Gt[x]={...Gt[x],...Ne.kit,...Ne["kit-duotone"]};const ut=mt(Gt),Yt={...Qa};Yt[x]={...Yt[x],...ir.kit};const K=mt(Yt),$t={...Ka};$t[x]={...$t[x],...rr.kit};const lr=mt($t),fr=Wa,vn="fa-layers-text",ur=Xa,dr={...$a};mt(dr);const mr=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],It=st,nt=new Set;Object.keys(ut[x]).map(nt.add.bind(nt));Object.keys(ut[P]).map(nt.add.bind(nt));Object.keys(ut[_]).map(nt.add.bind(nt));const pr=[...qa,...nr],lt=q.FontAwesomeConfig||{};function hr(t){var e=y.querySelector("script["+t+"]");if(e)return e.getAttribute(t)}function gr(t){return t===""?!0:t==="false"?!1:t==="true"?!0:t}y&&typeof y.querySelector=="function"&&[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]].forEach(e=>{let[n,a]=e;const r=gr(hr(n));r!=null&&(lt[a]=r)});const bn={styleDefault:"solid",familyDefault:"classic",cssPrefix:dn,replacementClass:mn,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};lt.familyPrefix&&(lt.cssPrefix=lt.familyPrefix);const at={...bn,...lt};at.autoReplaceSvg||(at.observeMutations=!1);const u={};Object.keys(bn).forEach(t=>{Object.defineProperty(u,t,{enumerable:!0,set:function(e){at[t]=e,ft.forEach(n=>n(u))},get:function(){return at[t]}})});Object.defineProperty(u,"familyPrefix",{enumerable:!0,set:function(t){at.cssPrefix=t,ft.forEach(e=>e(u))},get:function(){return at.cssPrefix}});q.FontAwesomeConfig=u;const ft=[];function vr(t){return ft.push(t),()=>{ft.splice(ft.indexOf(t),1)}}const Y=Ht,R={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function br(t){if(!t||!H)return;const e=y.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=t;const n=y.head.childNodes;let a=null;for(let r=n.length-1;r>-1;r--){const i=n[r],o=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(a=i)}return y.head.insertBefore(e,a),t}const yr="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function dt(){let t=12,e="";for(;t-- >0;)e+=yr[Math.random()*62|0];return e}function rt(t){const e=[];for(let n=(t||[]).length>>>0;n--;)e[n]=t[n];return e}function ce(t){return t.classList?rt(t.classList):(t.getAttribute("class")||"").split(" ").filter(e=>e)}function yn(t){return"".concat(t).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function xr(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,'="').concat(yn(t[n]),'" '),"").trim()}function Ot(t){return Object.keys(t||{}).reduce((e,n)=>e+"".concat(n,": ").concat(t[n].trim(),";"),"")}function le(t){return t.size!==R.size||t.x!==R.x||t.y!==R.y||t.rotate!==R.rotate||t.flipX||t.flipY}function Ar(t){let{transform:e,containerWidth:n,iconWidth:a}=t;const r={transform:"translate(".concat(n/2," 256)")},i="translate(".concat(e.x*32,", ").concat(e.y*32,") "),o="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),s="rotate(".concat(e.rotate," 0 0)"),l={transform:"".concat(i," ").concat(o," ").concat(s)},f={transform:"translate(".concat(a/2*-1," -256)")};return{outer:r,inner:l,path:f}}function kr(t){let{transform:e,width:n=Ht,height:a=Ht,startCentered:r=!1}=t,i="";return r&&cn?i+="translate(".concat(e.x/Y-n/2,"em, ").concat(e.y/Y-a/2,"em) "):r?i+="translate(calc(-50% + ".concat(e.x/Y,"em), calc(-50% + ").concat(e.y/Y,"em)) "):i+="translate(".concat(e.x/Y,"em, ").concat(e.y/Y,"em) "),i+="scale(".concat(e.size/Y*(e.flipX?-1:1),", ").concat(e.size/Y*(e.flipY?-1:1),") "),i+="rotate(".concat(e.rotate,"deg) "),i}var wr=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 6 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 6 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 6 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 6 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 6 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 6 Sharp Duotone";
}

svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
  overflow: visible;
  box-sizing: content-box;
}

.svg-inline--fa {
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285705em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: var(--fa-pull-margin, 0.3em);
  width: auto;
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  top: 0.25em;
}
.svg-inline--fa.fa-fw {
  width: var(--fa-fw-width, 1.25em);
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: 0.625em;
  line-height: 0.1em;
  vertical-align: 0.225em;
}

.fa-xs {
  font-size: 0.75em;
  line-height: 0.0833333337em;
  vertical-align: 0.125em;
}

.fa-sm {
  font-size: 0.875em;
  line-height: 0.0714285718em;
  vertical-align: 0.0535714295em;
}

.fa-lg {
  font-size: 1.25em;
  line-height: 0.05em;
  vertical-align: -0.075em;
}

.fa-xl {
  font-size: 1.5em;
  line-height: 0.0416666682em;
  vertical-align: -0.125em;
}

.fa-2xl {
  font-size: 2em;
  line-height: 0.03125em;
  vertical-align: -0.1875em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: var(--fa-li-margin, 2.5em);
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.08em);
  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);
}

.fa-pull-left {
  float: left;
  margin-right: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right {
  float: right;
  margin-left: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
.fa-bounce,
.fa-fade,
.fa-beat-fade,
.fa-flip,
.fa-pulse,
.fa-shake,
.fa-spin,
.fa-spin-pulse {
    animation-delay: -1ms;
    animation-duration: 1ms;
    animation-iteration-count: 1;
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.fa-stack {
  display: inline-block;
  vertical-align: middle;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: var(--fa-stack-z-index, auto);
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.sr-only,
.fa-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:not(:focus),
.fa-sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.fad.fa-inverse,
.fa-duotone.fa-inverse {
  color: var(--fa-inverse, #fff);
}`;function xn(){const t=dn,e=mn,n=u.cssPrefix,a=u.replacementClass;let r=wr;if(n!==t||a!==e){const i=new RegExp("\\.".concat(t,"\\-"),"g"),o=new RegExp("\\--".concat(t,"\\-"),"g"),s=new RegExp("\\.".concat(e),"g");r=r.replace(i,".".concat(n,"-")).replace(o,"--".concat(n,"-")).replace(s,".".concat(a))}return r}let Te=!1;function Ft(){u.autoAddCss&&!Te&&(br(xn()),Te=!0)}var Er={mixout(){return{dom:{css:xn,insertCss:Ft}}},hooks(){return{beforeDOMElementCreation(){Ft()},beforeI2svg(){Ft()}}}};const D=q||{};D[z]||(D[z]={});D[z].styles||(D[z].styles={});D[z].hooks||(D[z].hooks={});D[z].shims||(D[z].shims=[]);var M=D[z];const An=[],kn=function(){y.removeEventListener("DOMContentLoaded",kn),Et=1,An.map(t=>t())};let Et=!1;H&&(Et=(y.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(y.readyState),Et||y.addEventListener("DOMContentLoaded",kn));function Sr(t){H&&(Et?setTimeout(t,0):An.push(t))}function pt(t){const{tag:e,attributes:n={},children:a=[]}=t;return typeof t=="string"?yn(t):"<".concat(e," ").concat(xr(n),">").concat(a.map(pt).join(""),"</").concat(e,">")}function Ie(t,e,n){if(t&&t[e]&&t[e][n])return{prefix:e,iconName:n,icon:t[e][n]}}var Rt=function(e,n,a,r){var i=Object.keys(e),o=i.length,s=n,l,f,m;for(a===void 0?(l=1,m=e[i[0]]):(l=0,m=a);l<o;l++)f=i[l],m=s(m,e[f],f,e);return m};function Or(t){const e=[];let n=0;const a=t.length;for(;n<a;){const r=t.charCodeAt(n++);if(r>=55296&&r<=56319&&n<a){const i=t.charCodeAt(n++);(i&64512)==56320?e.push(((r&1023)<<10)+(i&1023)+65536):(e.push(r),n--)}else e.push(r)}return e}function qt(t){const e=Or(t);return e.length===1?e[0].toString(16):null}function Pr(t,e){const n=t.length;let a=t.charCodeAt(e),r;return a>=55296&&a<=56319&&n>e+1&&(r=t.charCodeAt(e+1),r>=56320&&r<=57343)?(a-55296)*1024+r-56320+65536:a}function Fe(t){return Object.keys(t).reduce((e,n)=>{const a=t[n];return!!a.icon?e[a.iconName]=a.icon:e[n]=a,e},{})}function Wt(t,e){let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};const{skipHooks:a=!1}=n,r=Fe(e);typeof M.hooks.addPack=="function"&&!a?M.hooks.addPack(t,Fe(e)):M.styles[t]={...M.styles[t]||{},...r},t==="fas"&&Wt("fa",e)}const{styles:B,shims:_r}=M,Lr={[x]:Object.values(K[x]),[P]:Object.values(K[P]),[_]:Object.values(K[_])};let fe=null,wn={},En={},Sn={},On={},Pn={};const Nr={[x]:Object.keys(V[x]),[P]:Object.keys(V[P]),[_]:Object.keys(V[_])};function Cr(t){return~pr.indexOf(t)}function Tr(t,e){const n=e.split("-"),a=n[0],r=n.slice(1).join("-");return a===t&&r!==""&&!Cr(r)?r:null}const _n=()=>{const t=a=>Rt(B,(r,i,o)=>(r[o]=Rt(i,a,{}),r),{});wn=t((a,r,i)=>(r[3]&&(a[r[3]]=i),r[2]&&r[2].filter(s=>typeof s=="number").forEach(s=>{a[s.toString(16)]=i}),a)),En=t((a,r,i)=>(a[i]=i,r[2]&&r[2].filter(s=>typeof s=="string").forEach(s=>{a[s]=i}),a)),Pn=t((a,r,i)=>{const o=r[2];return a[i]=i,o.forEach(s=>{a[s]=i}),a});const e="far"in B||u.autoFetchSvg,n=Rt(_r,(a,r)=>{const i=r[0];let o=r[1];const s=r[2];return o==="far"&&!e&&(o="fas"),typeof i=="string"&&(a.names[i]={prefix:o,iconName:s}),typeof i=="number"&&(a.unicodes[i.toString(16)]={prefix:o,iconName:s}),a},{names:{},unicodes:{}});Sn=n.names,On=n.unicodes,fe=Pt(u.styleDefault,{family:u.familyDefault})};vr(t=>{fe=Pt(t.styleDefault,{family:u.familyDefault})});_n();function ue(t,e){return(wn[t]||{})[e]}function Ir(t,e){return(En[t]||{})[e]}function $(t,e){return(Pn[t]||{})[e]}function Ln(t){return Sn[t]||{prefix:null,iconName:null}}function Fr(t){const e=On[t],n=ue("fas",t);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function W(){return fe}const de=()=>({prefix:null,iconName:null,rest:[]});function Pt(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{family:n=x}=e,a=V[n][t],r=ut[n][t]||ut[n][a],i=t in M.styles?t:null;return r||i||null}const Rr={[x]:Object.keys(K[x]),[P]:Object.keys(K[P]),[_]:Object.keys(K[_])};function _t(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{skipLookups:n=!1}=e,a={[x]:"".concat(u.cssPrefix,"-").concat(x),[P]:"".concat(u.cssPrefix,"-").concat(P),[_]:"".concat(u.cssPrefix,"-").concat(_)};let r=null,i=x;const o=Ya.filter(l=>l!==ln);o.forEach(l=>{(t.includes(a[l])||t.some(f=>Rr[l].includes(f)))&&(i=l)});const s=t.reduce((l,f)=>{const m=Tr(u.cssPrefix,f);if(B[f]?(f=Lr[i].includes(f)?lr[i][f]:f,r=f,l.prefix=f):Nr[i].indexOf(f)>-1?(r=f,l.prefix=Pt(f,{family:i})):m?l.iconName=m:f!==u.replacementClass&&!o.some(g=>f===a[g])&&l.rest.push(f),!n&&l.prefix&&l.iconName){const g=r==="fa"?Ln(l.iconName):{},p=$(l.prefix,l.iconName);g.prefix&&(r=null),l.iconName=g.iconName||p||l.iconName,l.prefix=g.prefix||l.prefix,l.prefix==="far"&&!B.far&&B.fas&&!u.autoFetchSvg&&(l.prefix="fas")}return l},de());return(t.includes("fa-brands")||t.includes("fab"))&&(s.prefix="fab"),(t.includes("fa-duotone")||t.includes("fad"))&&(s.prefix="fad"),!s.prefix&&i===P&&(B.fass||u.autoFetchSvg)&&(s.prefix="fass",s.iconName=$(s.prefix,s.iconName)||s.iconName),!s.prefix&&i===_&&(B.fasds||u.autoFetchSvg)&&(s.prefix="fasds",s.iconName=$(s.prefix,s.iconName)||s.iconName),(s.prefix==="fa"||r==="fa")&&(s.prefix=W()||"fas"),s}class Mr{constructor(){this.definitions={}}add(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];const r=n.reduce(this._pullDefinitions,{});Object.keys(r).forEach(i=>{this.definitions[i]={...this.definitions[i]||{},...r[i]},Wt(i,r[i]);const o=K[x][i];o&&Wt(o,r[i]),_n()})}reset(){this.definitions={}}_pullDefinitions(e,n){const a=n.prefix&&n.iconName&&n.icon?{0:n}:n;return Object.keys(a).map(r=>{const{prefix:i,iconName:o,icon:s}=a[r],l=s[2];e[i]||(e[i]={}),l.length>0&&l.forEach(f=>{typeof f=="string"&&(e[i][f]=s)}),e[i][o]=s}),e}}let Re=[],tt={};const et={},jr=Object.keys(et);function zr(t,e){let{mixoutsTo:n}=e;return Re=t,tt={},Object.keys(et).forEach(a=>{jr.indexOf(a)===-1&&delete et[a]}),Re.forEach(a=>{const r=a.mixout?a.mixout():{};if(Object.keys(r).forEach(i=>{typeof r[i]=="function"&&(n[i]=r[i]),typeof r[i]=="object"&&Object.keys(r[i]).forEach(o=>{n[i]||(n[i]={}),n[i][o]=r[i][o]})}),a.hooks){const i=a.hooks();Object.keys(i).forEach(o=>{tt[o]||(tt[o]=[]),tt[o].push(i[o])})}a.provides&&a.provides(et)}),n}function Xt(t,e){for(var n=arguments.length,a=new Array(n>2?n-2:0),r=2;r<n;r++)a[r-2]=arguments[r];return(tt[t]||[]).forEach(o=>{e=o.apply(null,[e,...a])}),e}function Q(t){for(var e=arguments.length,n=new Array(e>1?e-1:0),a=1;a<e;a++)n[a-1]=arguments[a];(tt[t]||[]).forEach(i=>{i.apply(null,n)})}function X(){const t=arguments[0],e=Array.prototype.slice.call(arguments,1);return et[t]?et[t].apply(null,e):void 0}function Bt(t){t.prefix==="fa"&&(t.prefix="fas");let{iconName:e}=t;const n=t.prefix||W();if(e)return e=$(n,e)||e,Ie(Nn.definitions,n,e)||Ie(M.styles,n,e)}const Nn=new Mr,Dr=()=>{u.autoReplaceSvg=!1,u.observeMutations=!1,Q("noAuto")},Hr={i2svg:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return H?(Q("beforeI2svg",t),X("pseudoElements2svg",t),X("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e}=t;u.autoReplaceSvg===!1&&(u.autoReplaceSvg=!0),u.observeMutations=!0,Sr(()=>{Gr({autoReplaceSvgRoot:e}),Q("watch",t)})}},Ur={icon:t=>{if(t===null)return null;if(typeof t=="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:$(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){const e=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],n=Pt(t[0]);return{prefix:n,iconName:$(n,e)||e}}if(typeof t=="string"&&(t.indexOf("".concat(u.cssPrefix,"-"))>-1||t.match(fr))){const e=_t(t.split(" "),{skipLookups:!0});return{prefix:e.prefix||W(),iconName:$(e.prefix,e.iconName)||e.iconName}}if(typeof t=="string"){const e=W();return{prefix:e,iconName:$(e,t)||t}}}},L={noAuto:Dr,config:u,dom:Hr,parse:Ur,library:Nn,findIconDefinition:Bt,toHtml:pt},Gr=function(){let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const{autoReplaceSvgRoot:e=y}=t;(Object.keys(M.styles).length>0||u.autoFetchSvg)&&H&&u.autoReplaceSvg&&L.dom.i2svg({node:e})};function Lt(t,e){return Object.defineProperty(t,"abstract",{get:e}),Object.defineProperty(t,"html",{get:function(){return t.abstract.map(n=>pt(n))}}),Object.defineProperty(t,"node",{get:function(){if(!H)return;const n=y.createElement("div");return n.innerHTML=t.html,n.children}}),t}function Yr(t){let{children:e,main:n,mask:a,attributes:r,styles:i,transform:o}=t;if(le(o)&&n.found&&!a.found){const{width:s,height:l}=n,f={x:s/l/2,y:.5};r.style=Ot({...i,"transform-origin":"".concat(f.x+o.x/16,"em ").concat(f.y+o.y/16,"em")})}return[{tag:"svg",attributes:r,children:e}]}function $r(t){let{prefix:e,iconName:n,children:a,attributes:r,symbol:i}=t;const o=i===!0?"".concat(e,"-").concat(u.cssPrefix,"-").concat(n):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:{...r,id:o},children:a}]}]}function me(t){const{icons:{main:e,mask:n},prefix:a,iconName:r,transform:i,symbol:o,title:s,maskId:l,titleId:f,extra:m,watchable:g=!1}=t,{width:p,height:k}=n.found?n:e,C=a==="fak",T=[u.replacementClass,r?"".concat(u.cssPrefix,"-").concat(r):""].filter(G=>m.classes.indexOf(G)===-1).filter(G=>G!==""||!!G).concat(m.classes).join(" ");let E={children:[],attributes:{...m.attributes,"data-prefix":a,"data-icon":r,class:T,role:m.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(p," ").concat(k)}};const N=C&&!~m.classes.indexOf("fa-fw")?{width:"".concat(p/k*16*.0625,"em")}:{};g&&(E.attributes[J]=""),s&&(E.children.push({tag:"title",attributes:{id:E.attributes["aria-labelledby"]||"title-".concat(f||dt())},children:[s]}),delete E.attributes.title);const w={...E,prefix:a,iconName:r,main:e,mask:n,maskId:l,transform:i,symbol:o,styles:{...N,...m.styles}},{children:S,attributes:U}=n.found&&e.found?X("generateAbstractMask",w)||{children:[],attributes:{}}:X("generateAbstractIcon",w)||{children:[],attributes:{}};return w.children=S,w.attributes=U,o?$r(w):Yr(w)}function Me(t){const{content:e,width:n,height:a,transform:r,title:i,extra:o,watchable:s=!1}=t,l={...o.attributes,...i?{title:i}:{},class:o.classes.join(" ")};s&&(l[J]="");const f={...o.styles};le(r)&&(f.transform=kr({transform:r,startCentered:!0,width:n,height:a}),f["-webkit-transform"]=f.transform);const m=Ot(f);m.length>0&&(l.style=m);const g=[];return g.push({tag:"span",attributes:l,children:[e]}),i&&g.push({tag:"span",attributes:{class:"sr-only"},children:[i]}),g}function qr(t){const{content:e,title:n,extra:a}=t,r={...a.attributes,...n?{title:n}:{},class:a.classes.join(" ")},i=Ot(a.styles);i.length>0&&(r.style=i);const o=[];return o.push({tag:"span",attributes:r,children:[e]}),n&&o.push({tag:"span",attributes:{class:"sr-only"},children:[n]}),o}const{styles:Mt}=M;function Vt(t){const e=t[0],n=t[1],[a]=t.slice(4);let r=null;return Array.isArray(a)?r={tag:"g",attributes:{class:"".concat(u.cssPrefix,"-").concat(It.GROUP)},children:[{tag:"path",attributes:{class:"".concat(u.cssPrefix,"-").concat(It.SECONDARY),fill:"currentColor",d:a[0]}},{tag:"path",attributes:{class:"".concat(u.cssPrefix,"-").concat(It.PRIMARY),fill:"currentColor",d:a[1]}}]}:r={tag:"path",attributes:{fill:"currentColor",d:a}},{found:!0,width:e,height:n,icon:r}}const Wr={found:!1,width:512,height:512};function Xr(t,e){!pn&&!u.showMissingIcons&&t&&console.error('Icon with name "'.concat(t,'" and prefix "').concat(e,'" is missing.'))}function Kt(t,e){let n=e;return e==="fa"&&u.styleDefault!==null&&(e=W()),new Promise((a,r)=>{if(n==="fa"){const i=Ln(t)||{};t=i.iconName||t,e=i.prefix||e}if(t&&e&&Mt[e]&&Mt[e][t]){const i=Mt[e][t];return a(Vt(i))}Xr(t,e),a({...Wr,icon:u.showMissingIcons&&t?X("missingIconAbstract")||{}:{}})})}const je=()=>{},Jt=u.measurePerformance&&vt&&vt.mark&&vt.measure?vt:{mark:je,measure:je},ct='FA "6.6.0"',Br=t=>(Jt.mark("".concat(ct," ").concat(t," begins")),()=>Cn(t)),Cn=t=>{Jt.mark("".concat(ct," ").concat(t," ends")),Jt.measure("".concat(ct," ").concat(t),"".concat(ct," ").concat(t," begins"),"".concat(ct," ").concat(t," ends"))};var pe={begin:Br,end:Cn};const yt=()=>{};function ze(t){return typeof(t.getAttribute?t.getAttribute(J):null)=="string"}function Vr(t){const e=t.getAttribute?t.getAttribute(oe):null,n=t.getAttribute?t.getAttribute(se):null;return e&&n}function Kr(t){return t&&t.classList&&t.classList.contains&&t.classList.contains(u.replacementClass)}function Jr(){return u.autoReplaceSvg===!0?xt.replace:xt[u.autoReplaceSvg]||xt.replace}function Qr(t){return y.createElementNS("http://www.w3.org/2000/svg",t)}function Zr(t){return y.createElement(t)}function Tn(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{ceFn:n=t.tag==="svg"?Qr:Zr}=e;if(typeof t=="string")return y.createTextNode(t);const a=n(t.tag);return Object.keys(t.attributes||[]).forEach(function(i){a.setAttribute(i,t.attributes[i])}),(t.children||[]).forEach(function(i){a.appendChild(Tn(i,{ceFn:n}))}),a}function ti(t){let e=" ".concat(t.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}const xt={replace:function(t){const e=t[0];if(e.parentNode)if(t[1].forEach(n=>{e.parentNode.insertBefore(Tn(n),e)}),e.getAttribute(J)===null&&u.keepOriginalSource){let n=y.createComment(ti(e));e.parentNode.replaceChild(n,e)}else e.remove()},nest:function(t){const e=t[0],n=t[1];if(~ce(e).indexOf(u.replacementClass))return xt.replace(t);const a=new RegExp("".concat(u.cssPrefix,"-.*"));if(delete n[0].attributes.id,n[0].attributes.class){const i=n[0].attributes.class.split(" ").reduce((o,s)=>(s===u.replacementClass||s.match(a)?o.toSvg.push(s):o.toNode.push(s),o),{toNode:[],toSvg:[]});n[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?e.removeAttribute("class"):e.setAttribute("class",i.toNode.join(" "))}const r=n.map(i=>pt(i)).join(`
`);e.setAttribute(J,""),e.innerHTML=r}};function De(t){t()}function In(t,e){const n=typeof e=="function"?e:yt;if(t.length===0)n();else{let a=De;u.mutateApproach===sr&&(a=q.requestAnimationFrame||De),a(()=>{const r=Jr(),i=pe.begin("mutate");t.map(r),i(),n()})}}let he=!1;function Fn(){he=!0}function Qt(){he=!1}let St=null;function He(t){if(!_e||!u.observeMutations)return;const{treeCallback:e=yt,nodeCallback:n=yt,pseudoElementsCallback:a=yt,observeMutationsRoot:r=y}=t;St=new _e(i=>{if(he)return;const o=W();rt(i).forEach(s=>{if(s.type==="childList"&&s.addedNodes.length>0&&!ze(s.addedNodes[0])&&(u.searchPseudoElements&&a(s.target),e(s.target)),s.type==="attributes"&&s.target.parentNode&&u.searchPseudoElements&&a(s.target.parentNode),s.type==="attributes"&&ze(s.target)&&~mr.indexOf(s.attributeName))if(s.attributeName==="class"&&Vr(s.target)){const{prefix:l,iconName:f}=_t(ce(s.target));s.target.setAttribute(oe,l||o),f&&s.target.setAttribute(se,f)}else Kr(s.target)&&n(s.target)})}),H&&St.observe(r,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}function ei(){St&&St.disconnect()}function ni(t){const e=t.getAttribute("style");let n=[];return e&&(n=e.split(";").reduce((a,r)=>{const i=r.split(":"),o=i[0],s=i.slice(1);return o&&s.length>0&&(a[o]=s.join(":").trim()),a},{})),n}function ai(t){const e=t.getAttribute("data-prefix"),n=t.getAttribute("data-icon"),a=t.innerText!==void 0?t.innerText.trim():"";let r=_t(ce(t));return r.prefix||(r.prefix=W()),e&&n&&(r.prefix=e,r.iconName=n),r.iconName&&r.prefix||(r.prefix&&a.length>0&&(r.iconName=Ir(r.prefix,t.innerText)||ue(r.prefix,qt(t.innerText))),!r.iconName&&u.autoFetchSvg&&t.firstChild&&t.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=t.firstChild.data)),r}function ri(t){const e=rt(t.attributes).reduce((r,i)=>(r.name!=="class"&&r.name!=="style"&&(r[i.name]=i.value),r),{}),n=t.getAttribute("title"),a=t.getAttribute("data-fa-title-id");return u.autoA11y&&(n?e["aria-labelledby"]="".concat(u.replacementClass,"-title-").concat(a||dt()):(e["aria-hidden"]="true",e.focusable="false")),e}function ii(){return{iconName:null,title:null,titleId:null,prefix:null,transform:R,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Ue(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0};const{iconName:n,prefix:a,rest:r}=ai(t),i=ri(t),o=Xt("parseNodeAttributes",{},t);let s=e.styleParser?ni(t):[];return{iconName:n,title:t.getAttribute("title"),titleId:t.getAttribute("data-fa-title-id"),prefix:a,transform:R,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:r,styles:s,attributes:i},...o}}const{styles:oi}=M;function Rn(t){const e=u.autoReplaceSvg==="nest"?Ue(t,{styleParser:!1}):Ue(t);return~e.extra.classes.indexOf(vn)?X("generateLayersText",t,e):X("generateSvgReplacementMutation",t,e)}let j=new Set;hn.map(t=>{j.add("fa-".concat(t))});Object.keys(V[x]).map(j.add.bind(j));Object.keys(V[P]).map(j.add.bind(j));Object.keys(V[_]).map(j.add.bind(j));j=[...j];function Ge(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!H)return Promise.resolve();const n=y.documentElement.classList,a=m=>n.add("".concat(Ce,"-").concat(m)),r=m=>n.remove("".concat(Ce,"-").concat(m)),i=u.autoFetchSvg?j:hn.map(m=>"fa-".concat(m)).concat(Object.keys(oi));i.includes("fa")||i.push("fa");const o=[".".concat(vn,":not([").concat(J,"])")].concat(i.map(m=>".".concat(m,":not([").concat(J,"])"))).join(", ");if(o.length===0)return Promise.resolve();let s=[];try{s=rt(t.querySelectorAll(o))}catch{}if(s.length>0)a("pending"),r("complete");else return Promise.resolve();const l=pe.begin("onTree"),f=s.reduce((m,g)=>{try{const p=Rn(g);p&&m.push(p)}catch(p){pn||p.name==="MissingIcon"&&console.error(p)}return m},[]);return new Promise((m,g)=>{Promise.all(f).then(p=>{In(p,()=>{a("active"),a("complete"),r("pending"),typeof e=="function"&&e(),l(),m()})}).catch(p=>{l(),g(p)})})}function si(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Rn(t).then(n=>{n&&In([n],e)})}function ci(t){return function(e){let n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const a=(e||{}).icon?e:Bt(e||{});let{mask:r}=n;return r&&(r=(r||{}).icon?r:Bt(r||{})),t(a,{...n,mask:r})}}const li=function(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=R,symbol:a=!1,mask:r=null,maskId:i=null,title:o=null,titleId:s=null,classes:l=[],attributes:f={},styles:m={}}=e;if(!t)return;const{prefix:g,iconName:p,icon:k}=t;return Lt({type:"icon",...t},()=>(Q("beforeDOMElementCreation",{iconDefinition:t,params:e}),u.autoA11y&&(o?f["aria-labelledby"]="".concat(u.replacementClass,"-title-").concat(s||dt()):(f["aria-hidden"]="true",f.focusable="false")),me({icons:{main:Vt(k),mask:r?Vt(r.icon):{found:!1,width:null,height:null,icon:{}}},prefix:g,iconName:p,transform:{...R,...n},symbol:a,title:o,maskId:i,titleId:s,extra:{attributes:f,styles:m,classes:l}})))};var fi={mixout(){return{icon:ci(li)}},hooks(){return{mutationObserverCallbacks(t){return t.treeCallback=Ge,t.nodeCallback=si,t}}},provides(t){t.i2svg=function(e){const{node:n=y,callback:a=()=>{}}=e;return Ge(n,a)},t.generateSvgReplacementMutation=function(e,n){const{iconName:a,title:r,titleId:i,prefix:o,transform:s,symbol:l,mask:f,maskId:m,extra:g}=n;return new Promise((p,k)=>{Promise.all([Kt(a,o),f.iconName?Kt(f.iconName,f.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(C=>{let[T,E]=C;p([e,me({icons:{main:T,mask:E},prefix:o,iconName:a,transform:s,symbol:l,maskId:m,title:r,titleId:i,extra:g,watchable:!0})])}).catch(k)})},t.generateAbstractIcon=function(e){let{children:n,attributes:a,main:r,transform:i,styles:o}=e;const s=Ot(o);s.length>0&&(a.style=s);let l;return le(i)&&(l=X("generateAbstractTransformGrouping",{main:r,transform:i,containerWidth:r.width,iconWidth:r.width})),n.push(l||r.icon),{children:n,attributes:a}}}},ui={mixout(){return{layer(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{classes:n=[]}=e;return Lt({type:"layer"},()=>{Q("beforeDOMElementCreation",{assembler:t,params:e});let a=[];return t(r=>{Array.isArray(r)?r.map(i=>{a=a.concat(i.abstract)}):a=a.concat(r.abstract)}),[{tag:"span",attributes:{class:["".concat(u.cssPrefix,"-layers"),...n].join(" ")},children:a}]})}}}},di={mixout(){return{counter(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{title:n=null,classes:a=[],attributes:r={},styles:i={}}=e;return Lt({type:"counter",content:t},()=>(Q("beforeDOMElementCreation",{content:t,params:e}),qr({content:t.toString(),title:n,extra:{attributes:r,styles:i,classes:["".concat(u.cssPrefix,"-layers-counter"),...a]}})))}}}},mi={mixout(){return{text(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};const{transform:n=R,title:a=null,classes:r=[],attributes:i={},styles:o={}}=e;return Lt({type:"text",content:t},()=>(Q("beforeDOMElementCreation",{content:t,params:e}),Me({content:t,transform:{...R,...n},title:a,extra:{attributes:i,styles:o,classes:["".concat(u.cssPrefix,"-layers-text"),...r]}})))}}},provides(t){t.generateLayersText=function(e,n){const{title:a,transform:r,extra:i}=n;let o=null,s=null;if(cn){const l=parseInt(getComputedStyle(e).fontSize,10),f=e.getBoundingClientRect();o=f.width/l,s=f.height/l}return u.autoA11y&&!a&&(i.attributes["aria-hidden"]="true"),Promise.resolve([e,Me({content:e.innerHTML,width:o,height:s,transform:r,title:a,extra:i,watchable:!0})])}}};const pi=new RegExp('"',"ug"),Ye=[1105920,1112319],$e={FontAwesome:{normal:"fas",400:"fas"},...Va,...Ba,...ar},Zt=Object.keys($e).reduce((t,e)=>(t[e.toLowerCase()]=$e[e],t),{}),hi=Object.keys(Zt).reduce((t,e)=>{const n=Zt[e];return t[e]=n[900]||[...Object.entries(n)][0][1],t},{});function gi(t){const e=t.replace(pi,""),n=Pr(e,0),a=n>=Ye[0]&&n<=Ye[1],r=e.length===2?e[0]===e[1]:!1;return{value:qt(r?e[0]:e),isSecondary:a||r}}function vi(t,e){const n=t.replace(/^['"]|['"]$/g,"").toLowerCase(),a=parseInt(e),r=isNaN(a)?"normal":a;return(Zt[n]||{})[r]||hi[n]}function qe(t,e){const n="".concat(or).concat(e.replace(":","-"));return new Promise((a,r)=>{if(t.getAttribute(n)!==null)return a();const o=rt(t.children).filter(p=>p.getAttribute(Ut)===e)[0],s=q.getComputedStyle(t,e),l=s.getPropertyValue("font-family"),f=l.match(ur),m=s.getPropertyValue("font-weight"),g=s.getPropertyValue("content");if(o&&!f)return t.removeChild(o),a();if(f&&g!=="none"&&g!==""){const p=s.getPropertyValue("content");let k=vi(l,m);const{value:C,isSecondary:T}=gi(p),E=f[0].startsWith("FontAwesome");let N=ue(k,C),w=N;if(E){const S=Fr(C);S.iconName&&S.prefix&&(N=S.iconName,k=S.prefix)}if(N&&!T&&(!o||o.getAttribute(oe)!==k||o.getAttribute(se)!==w)){t.setAttribute(n,w),o&&t.removeChild(o);const S=ii(),{extra:U}=S;U.attributes[Ut]=e,Kt(N,k).then(G=>{const ht=me({...S,icons:{main:G,mask:de()},prefix:k,iconName:w,extra:U,watchable:!0}),it=y.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?t.insertBefore(it,t.firstChild):t.appendChild(it),it.outerHTML=ht.map(Nt=>pt(Nt)).join(`
`),t.removeAttribute(n),a()}).catch(r)}else a()}else a()})}function bi(t){return Promise.all([qe(t,"::before"),qe(t,"::after")])}function yi(t){return t.parentNode!==document.head&&!~cr.indexOf(t.tagName.toUpperCase())&&!t.getAttribute(Ut)&&(!t.parentNode||t.parentNode.tagName!=="svg")}function We(t){if(H)return new Promise((e,n)=>{const a=rt(t.querySelectorAll("*")).filter(yi).map(bi),r=pe.begin("searchPseudoElements");Fn(),Promise.all(a).then(()=>{r(),Qt(),e()}).catch(()=>{r(),Qt(),n()})})}var xi={hooks(){return{mutationObserverCallbacks(t){return t.pseudoElementsCallback=We,t}}},provides(t){t.pseudoElements2svg=function(e){const{node:n=y}=e;u.searchPseudoElements&&We(n)}}};let Xe=!1;var Ai={mixout(){return{dom:{unwatch(){Fn(),Xe=!0}}}},hooks(){return{bootstrap(){He(Xt("mutationObserverCallbacks",{}))},noAuto(){ei()},watch(t){const{observeMutationsRoot:e}=t;Xe?Qt():He(Xt("mutationObserverCallbacks",{observeMutationsRoot:e}))}}}};const Be=t=>{let e={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce((n,a)=>{const r=a.toLowerCase().split("-"),i=r[0];let o=r.slice(1).join("-");if(i&&o==="h")return n.flipX=!0,n;if(i&&o==="v")return n.flipY=!0,n;if(o=parseFloat(o),isNaN(o))return n;switch(i){case"grow":n.size=n.size+o;break;case"shrink":n.size=n.size-o;break;case"left":n.x=n.x-o;break;case"right":n.x=n.x+o;break;case"up":n.y=n.y-o;break;case"down":n.y=n.y+o;break;case"rotate":n.rotate=n.rotate+o;break}return n},e)};var ki={mixout(){return{parse:{transform:t=>Be(t)}}},hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-transform");return n&&(t.transform=Be(n)),t}}},provides(t){t.generateAbstractTransformGrouping=function(e){let{main:n,transform:a,containerWidth:r,iconWidth:i}=e;const o={transform:"translate(".concat(r/2," 256)")},s="translate(".concat(a.x*32,", ").concat(a.y*32,") "),l="scale(".concat(a.size/16*(a.flipX?-1:1),", ").concat(a.size/16*(a.flipY?-1:1),") "),f="rotate(".concat(a.rotate," 0 0)"),m={transform:"".concat(s," ").concat(l," ").concat(f)},g={transform:"translate(".concat(i/2*-1," -256)")},p={outer:o,inner:m,path:g};return{tag:"g",attributes:{...p.outer},children:[{tag:"g",attributes:{...p.inner},children:[{tag:n.icon.tag,children:n.icon.children,attributes:{...n.icon.attributes,...p.path}}]}]}}}};const jt={x:0,y:0,width:"100%",height:"100%"};function Ve(t){let e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.attributes&&(t.attributes.fill||e)&&(t.attributes.fill="black"),t}function wi(t){return t.tag==="g"?t.children:[t]}var Ei={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-mask"),a=n?_t(n.split(" ").map(r=>r.trim())):de();return a.prefix||(a.prefix=W()),t.mask=a,t.maskId=e.getAttribute("data-fa-mask-id"),t}}},provides(t){t.generateAbstractMask=function(e){let{children:n,attributes:a,main:r,mask:i,maskId:o,transform:s}=e;const{width:l,icon:f}=r,{width:m,icon:g}=i,p=Ar({transform:s,containerWidth:m,iconWidth:l}),k={tag:"rect",attributes:{...jt,fill:"white"}},C=f.children?{children:f.children.map(Ve)}:{},T={tag:"g",attributes:{...p.inner},children:[Ve({tag:f.tag,attributes:{...f.attributes,...p.path},...C})]},E={tag:"g",attributes:{...p.outer},children:[T]},N="mask-".concat(o||dt()),w="clip-".concat(o||dt()),S={tag:"mask",attributes:{...jt,id:N,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"},children:[k,E]},U={tag:"defs",children:[{tag:"clipPath",attributes:{id:w},children:wi(g)},S]};return n.push(U,{tag:"rect",attributes:{fill:"currentColor","clip-path":"url(#".concat(w,")"),mask:"url(#".concat(N,")"),...jt}}),{children:n,attributes:a}}}},Si={provides(t){let e=!1;q.matchMedia&&(e=q.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){const n=[],a={fill:"currentColor"},r={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};n.push({tag:"path",attributes:{...a,d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"}});const i={...r,attributeName:"opacity"},o={tag:"circle",attributes:{...a,cx:"256",cy:"364",r:"28"},children:[]};return e||o.children.push({tag:"animate",attributes:{...r,attributeName:"r",values:"28;14;28;28;14;28;"}},{tag:"animate",attributes:{...i,values:"1;0;1;1;0;1;"}}),n.push(o),n.push({tag:"path",attributes:{...a,opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"},children:e?[]:[{tag:"animate",attributes:{...i,values:"1;0;0;0;0;1;"}}]}),e||n.push({tag:"path",attributes:{...a,opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"},children:[{tag:"animate",attributes:{...i,values:"0;0;1;1;0;0;"}}]}),{tag:"g",attributes:{class:"missing"},children:n}}}},Oi={hooks(){return{parseNodeAttributes(t,e){const n=e.getAttribute("data-fa-symbol"),a=n===null?!1:n===""?!0:n;return t.symbol=a,t}}}},Pi=[Er,fi,ui,di,mi,xi,Ai,ki,Ei,Si,Oi];zr(Pi,{mixoutsTo:L});L.noAuto;L.config;const _i=L.library,Li=L.dom;L.parse;L.findIconDefinition;L.toHtml;L.icon;L.layer;L.text;L.counter;const Ni={prefix:"fas",iconName:"cart-shopping",icon:[576,512,[128722,"shopping-cart"],"f07a","M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"]};_i.add(Ni);Li.watch();const Ci=()=>za([{path:"/",component:Da},{path:"/gioi-thieu",component:Ha},{path:"/san-pham",component:Pa},{path:"/san-pham/:id",component:Ua}],Ga);Ci();
