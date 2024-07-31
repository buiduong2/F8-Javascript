## Lesssion 35

- Tạo ra một Component 
- Tạo ra một Class là `F8`. Có một method là `component`
- method `component(String componentName,Object options)`


```ts
options  = {
    data: () => {[key:string] => any},
    template: string
}
```

- Trong đó `key` một cái dữ liệu, thể hiện
  -

- `template: string`: bên trong sẽ  là các thẻ HTML.
- Xử lý làm sao mà ta có thể lấy được dữ liệu . Từ trong `data`
- Thêm sự kiện `v-on`

- ta muốn xây dựng một Componnet kiểu kiểu như thế 
- Có các ràng buộc. Và khi ta thay đổi data thì nó tự động cập nhật lại UI

## Các bước thực hiện


- Bóc tách template 
- Đầu tiên ta sẽ nội dung thẻ dứa dạng HTML
- Sau đó ta tạo ra một Element Template tương ứng (có thể tạo ben HTML. hoặc sử dụng `document.createElement("template")`)
- B3. Nên clone tất cả các cái Node ra 

## Yêu cầu 2:

- tạo ra một Component 

## Biểu thức chính quy


## Eval

### Tổng quan:

-  function `eval()`  đánh giá một javascript code được biểu diễn dưới dạng một String và nó return những tính toán value của nó
-  *Vậy là nó sẽ return ra dòng lệnh code cuối cùng (giống như khi ta làm việc với devtool) còn lại các câu lệnh khác thực hiện như code js bình thường. Các câu lệnh ko phải dưới dạng return no sẽ trả về '`undefined`'.VD như ta có câu lệnh let, var, function*

- 
### Cú pháp

```js
eval(script)
```

- `script`: là một string biểu diễn một biểu thức javascript. câu lệnh, hoặc một chuỗi các câu lệnh. Biểu thức có thể bao gồm một varaible, property của một Object đã tồn tại Nó sẽ được phân tích thành một script, vì vậy khai báo `import` (mà chỉ tồn tại trong module) sẽ ko được phép

- `return`: Giá trị hoàn thnahf của sự đánh giá của một code cụ thể. Nếu giá trị cuối cùng la empty `undefined` sẽ được return. nếu `script` không phải là một String nguyên thể ,`eval()` return agrument không được thay đổi *Tóm lại chỉ xử lý kiểu dữ leieuj typeof === 'string' còn lại nó trả về đúng cái nó được truyền vào*

- `exception`: Throw bất kì một excpetion nào xảy ra trong quá trình đánh giá code. bao gồm Syntax Error nếu `script` thất bại trong quá trình phân tích thành Script

### Direct  và indrect eval

- Có 2 kiểu gọi `eval()`: driect eval và indirect eval . Direct eval, như tên của nó ngụ ý . tham chiếu đến gọi trực tiếp `eval` function một cách global với `eval(...)`. Mọi thứ khác, bao gồm việc gọi nó  duwiois dạng một varabiel bị danh , hoặc thông qua quyền truy cập hoặc các biểu thức khác, hoặc thông qua optional chainnig operator gọi là indirect

```js
// Direct Call
eval("x + y");

// indrect
(0, eval)("x + y")

// indrect Call thông qua optional Chainning
eval?.("x + y");


// indirect call thông qua bí danh varaible
const geval = eval;
geval("x + y");

// gọi một cách dán tiếp thông qua member assceess (sử dụng toán tử dot)
const obj = {eval};
obj.eval("x + y");
```

- indirect eval có thể được xem như là mã đánh giá trong một phần riêng biệt  được chia cắt bởi tag `script`. Điều này có nghĩa là : 
  - Indirect Eval làm việc trong một global scope hơn là trong một localscope, và code mà sắp được đánh giá không thể truy cập vòa local variable  bên trong scope nơi nó được sắp được gọi 

```js
function test() {
    const x = 2;
    const y = 4;

    //direct Call, use localScope
    // nó sẽ thêm đoạn code vào ngay chỗ nó được gọi function
    console.log(eval("x + y")); // 6

    // indirect call use global scope
    // nó sẽ tạo ra một tag Script chứa code của riêng nó. ko va chạm với bất kì ai
    console.log(eval?.("x + y"));// Throws Error bởi vì x ko được defined trong global Scope
}
```

#### Inherit Strict Mode
- indirect `eval`  kế thừa sự nghiêm ngặt được bao quanh ngữ cảnh của nó,
- direct `eval` lại kế thừa strick mode trong ngữ cảnh local của nó luôn

```js
// indirect Eval
function strictContext() {
    "use strict"
    eval?.(`with (Math) console.log(PI);`)// 3.14
}

function strictContextStringEval() {
    eval?.("use strict; with (Math) console.log(PI)"); // throw Error
}

strictContext();//
```

- và ngược lại với kiểu direct eval 

```js
// indirect Eval
function strictContext() {
    "use strict"
    eval(`with (Math) console.log(PI);`)// throw Error
}

function strictContextStringEval() {
    eval("use strict; with (Math) console.log(PI)"); // throw Error
}

strictContext();//
```

#### Var

- Khai báo varaible và `function declarations` sẽ đi vào trong scope bao bọc nếu string không được thông dịch dưới dạng strict mode - với indriect eval. Chúng ta sẽ trở thành global varaible . Nếu nó là một direct eval trong một strict context , hoặc nếu `eval` source string bản thân nó đã khai báo strict mode, khi đó `var` và các khai báo function không bị rò rỉ bên trong surrounding scope\
- *Tóm lại là khi khai báo var thì môi trường bên ngoài lời gọi sẽ nhận được các khai báo function và var tương ứng nếu nó ko ở trong ngữ cảnh strict mode - được kế thừa hoặc tự khai báo*

#### let và const

- Khai báo `let` và `const` bên trong String được đánh giá sẽ luôn luôn có phạm vi bên trong script đó mà thôi


- `Direct` eval có thể truy cập vào các biểu thức bổ xung ngaoif context bao bọc nó. VD , trong một funciton's body của nó có thể sử dụng `new.target` để thận về `class`

#### không bao giờ sử dụng direct eval();

- Việc sử dụng direct `eval()` gặp phải nhiều vấn đề
  - `eval()` thực thi code được truyền vào với đặc quyền của người gọi. Nếu chúng ta chạy `eval()` với một String mà nó có thể ảnh hưởng bởi một bên độc hại, chúng ta có thể đãn tới kết cục chạy các code độc hại trên máy móc của user  với sự cho phép của webpack/ extends của chúng ta . Quan trọng hơn, việc cho phép bên thứ 3 code trực tiếp vào trong scope mà `eval()` được gọi  (nếu nó là một direct eval) có thể dẫn tới các cuộc tấn công có thể mà nó độc và thay đổi các local vairable 
  - `eval()` sẽ chậm hơn sự thay thế của nó . vì nó phải gọi trong trình thông dịch của javascript, trong khi đó nhiều cấu trúc khác được tối ưu hóa trong các động cơ hiện đại
  - javascript hiện đại thông dịch *quá trình phân tích và thực thi code tại thời điểm chạy cùng 1 lúc* chuyển đổi javascript thành mã máy. Điều này có nghĩa là bất kì khái niệm nào về tên biến sẽ được xóa bỏ. Do đó, bất kì việc sử dụng `eval()` sẽ ép buộc trình duyệt phải tạo ra một biểu thức varaible name dài  và tìm kiếm để hiểu ra nó lằm ở đâu trong mã máy và cài đặt giá trị cho nó. Thêm vào đó, Các thứ mới có thể được thêm vào đó thông qua `eval()` như là thay đổi kiểu dữ liệu của varaible đó, ép buộc trình duyệt phải đánh giá lại tất cả các mã máy để  đền bù
  - Các `Minifier` *quá trình tối ưu hóa mã ngườn bằng cách đặt lại tất cả các loại tên biến thành đơn giản và ngắn gọn hơn, bỏ các dấu xuống dòng dấu cách...* từ bỏ việc minification nếu phạm vi của `eval()` phụ thuộc vào nó. Để đảm bảo chính xác`eval()` tại runtime, đãn đến việc ko thể tối ưu hóa toàn hoàn đoạn mã

#### Tối ưu hóa  eval()
#### SỬ dụng Eval() một cách indirect 

- Hãy xem xet đoạn mã sau: 

```js
function looseJsonParse(obj) {
    return eval(`${obj}`);
}

console.log(looseJsonParse("{a: 4 - 1, b : function(){}, c: new Date()}"));
```

- Đơn giản chỉ cần sử dụng indirect eval và ép buộc strict mode có thể làm cho code tốt hơn: 

```js
function looseJsonParse(obj) {
    return eval?.(`use trict; (${obj})`);
}

console.log(looseJsonParse(`{a: 4 - 1, b : function(){}, c: new Date()}`))
```

- 2 đoạn code bên trên có thể làm việc cùng một cách .  nhưng ko phải như vậy; đoạn code đầu tiên sử dụng trực tiếp eval dẫn tới gặp nhiều vấn đề 
  - NDirect Eval chậm hơn rất nhiều, bởi vì có nhiều scope kiểm tra hơn. Lưu ý rằng `c: new Date()` trong String được đánh giá. Trong `Indirect` eval version , Object được đánh giá trong global Scope, vì vậy nó là  an toàn cho  trình thông dịch cho rằng `Date` tham chiếu đến constructgor `Date` global thay vì một local varaible gọi là `Date`. Tuy nhiên. Trong code sử dụng `direct Eval`, trình thông dịch không thể giả định điều này . VD trong đoạn code sau, `Date` trong String được đánh giá không tham chiếu đến `window.Date()`
```js
function looseJsonParse(obj) {
    function Date() {
        
    }

    return eval(`(${obj})`)
}

console.log(looseJsonParse(`{a: 4 - 1, b : function(){}, c: new Date()}`))
```

- Do đó, trong `eval()` của phiên bản code trên, trình duyệt bị bắt buộc phải tạo ra biểu thức tìm kiếm đắt tiềnđể kiểm tra xem có bất kì một local variable nào có tên là `Date()` hay không

- Nếu không sử dụng `strict mode` sự khai báo  `var`  bên trong `eval()` sẽ trở thành varaible trong  spoce bao bọc nó. Điều này đãn tới vấn đề khó để debug nếu String được  lấy từ các input  bên ngoài, đặc biệt nếu bát kì varaible nào đã tồn tại với cùng một name như vậy
- `Direct Eval` có thể đọc và sửa đổi các ràng buộc trong scope bao bọc nó. Điều này có thể dẫn tới các input bên ngoài có thể làm hỏng các dữ liệu cục bộ
- Khi sử dụng `direct eval`. Đặc biệt khi nguồn  của eval không được xác minh là ở chế độ strict mode trong các engine - và các built-tools- phải vô hiệu hóa tất cả các tối ưu dãn tới inline. bởi vì source code của `eval()` có thể phụ thuộc vòa bất kì varable name trong phạm vi xung quanh của nó

- Tuy nhiên việc sử dụng `indirect eval` không cho phép truyền vào các ràng buộc bổ xung hơn là các global variable cho việc đánh giá source để đọc . Nếu chúng ta cần các varaible bổ xung cụ thể mà source được đánh giá nên cần phải truy cập, cân nhắc sử dụng `Function()` constructor

#### Việc sử dụng Function() constructor

- `Function()` constructor rất đơn giản để `indirect eval` bên trên; nó cũng đánh giá jvascript source code được truyền vào trong nó cho phạm vị global mà ko đọc hoặc sửa đổi bất kì ràng buộc local nào. Và do đó cho phép engine làm việc tối ưu hơn `direct eval()`
- Sự khác biệt giữa `eval()` và `Function()` là source String được truyền vào trong `Function()` là được biên dịch ra như là một function body, mà ko phải như một `script`. Có một vài sắc thái - VD chúng ta có thể sử dụng `return` statement ở cấp cao nhất của nội dung hàm nhưng ko thể ở trong một script
- `Function()` constructor là rất hữu ích nếu chúng ta mong muốn tạo ra một local bindings bên trong evalSource, bằng cách truyền vào varaible như các ràng buộc paratmeter 

```js
// vừa khai báo mảng xong truy cập vào chỉ mục luôn dựa trên logic của n
function Date(n) {
    return  [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ][n % 7 || 0]
}

function runCodeWithDateFunction(obj) {
    return Function(`Date", "use strict; return (${obj})`)(Date);
}

console.log(runCodeWithDateFunction(Date(5)))// Saturday
```

- Cả `eval()` và `Function()` ngu ý đánh giá các code bất kì, và bị ngăn cấm trong setting CSP . Ngoài ra có nhiều bổ xung an toàn (và nhanh hơn) `eval direct`

#### Sử dụng Bracket Accessors -> truy cập qua dấu ngoặc

- Chúng ta ko nên sử dụng `eval()` để truy cập vào các property động.  cân nhắc các ví dụ sau khi mà property của một object được tủy cập  mà ko thể biét cho đến khi code được thực thi. Điều này có thẻ làm được với `eval()`

```js
const obj = { a: 20, b: 30 }
const propName = getPropName(); // return a hoặc b

const result = eval(`obj.${propName}`)
```

- Tuy nhiên `eval()` là không cần thiết ở đây - trong thực tế,  nó dẽ bị lỗi hơn,. bởi vì nếu `propName` không phải là một định danh hợp lệ, nó dãn tới Systax Error . Hơn nữa, nếu `getPropName` không phải là một function chúng ta có thể kiểm soát, điều này có thẻ dẫn tới thực thi các code bất kì. Thay vào đó  sử dụng `property asssecors` mà nó sẽ nhanh hơn và an toàn hơn.

```js
const obj = {a : 20, b: 30};
const propName = getPropName(); 
// ko hề sử dụng cái gì liên quan đến eval() mà chỉ đơn giản là JS thuần thúy
const result = obj[propName]; // obj["a"] là giống với obj.a
```

- Chúng ta thậm chí có thể sử dụng method này để truy cập vào các property con cháu (nested). Bằng cách sử dụng `eval()`,  điều này sẽ giống như sau: 

```js
const obj = { a: {b: { c : 0}}}
const propPath = getPropPath();// mong đợi nó sẽ là a.b.c
const result = eval(`obj.${propPath}`)//0
```

- Né tránh `eval()` ở đây có thể được hoàn thành bởi split property path và lặp qua tất cả các property khác nhau

```js
function getDescendantProp(obj, desc) {
    const arr = desc.split(".");
    while(arr.length) {
        obj = obj[arr.shift()]
    }

    return obj;
}

const obj = {a: { b: { c: 0}}};

const propPath = getPropPath();// a.b.c
const result = getDescendantProp(obj, propPath);//0
```

- Setting một property cũng có thể hoạt động tương tự

```js
function setDescendantProp(obj, desc, value) {
  const arr = desc.split(".");
  while (arr.length > 1) {
    obj = obj[arr.shift()];
  }
  return (obj[arr[0]] = value);
}

const obj = { a: { b: { c: 0 } } };
const propPath = getPropPath(); // suppose it returns "a.b.c"
const result = setDescendantProp(obj, propPath, 1); // obj.a.b.c is now 1
```

- Tuy nhiên, hãy cẩn thận khi sử dụng bracket accesors với các không bị giới hạn input là không an toàn - ó dân tới các Object injection attracks

### Sử dụng callback

### sử dụng JSON

- Nếu String chúng ta gọi `eval()` trên các ddataa chứa VD mọt arrayh `[1,2,3]`, chúng ta nên cân nhắc sử dụng `JSON` mà nó cho phép một String sử dụng một tập các cú pháp của javascritpt để biểu diễn một dữ liệu
- Lưu ý rằng JSON syntax bị giới hạn trong khi so sánh với cú pháp của Javascript, nhiều kiểu khai báo javascript hợp lệ không thể phân tích sang JSON. VD trailing comma không được phép tgrong JSON. và propertyName (key) trong Object khi khai báo phải được đặt trong dấu nháy. hãy đảm bảo sử dụng JSON tuần tự để sinh ra String mà nó sau đó sẽ được phân tích bởi JSON