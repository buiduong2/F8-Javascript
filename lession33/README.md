## Blob - Binary Large Object 

- là một đối tượng đại diện cho dữ liệu nhị phân lớn. `blob` thường được sử dụng để xử lý dữ liệu dạng tệp, các dữ liệu mà định dạng gốc ko giống của Javascript nguyên thủy, chẳng hạn như dữ liệu dạng file , như khi ta cần tải lên hoặc tải xuống các tệp từ trang chủ hoặc là các thao tác tương ự

- interface `Blob`  biểu diễn một blob, là một object giống như file , bất biến , dữ liệu thô; chúng có thể đọc như là text hoặc binary Data, hoặc chuyển đổi thành một `ReadableStream`, vì vạy các method của nó có thể được sử dụng để xử lý dữ liệu
- Blob có thể đại diện cho các dữ liệu mà nó ko nhất thiết phải theo format của javascript nguyên bản. Interface `File` được dựa trên `Blob` kế thừa các chức năng của BLob và mở rộng nó để hỗ trợ các file trên hệ thống người dùng 

### Tạo một blob

- Ta có thể tạo một `blob` bằng cách sử dụng construtor `Blob()`

```js
const blob = new Blob(["hello World"], {type:"text/plain"});
console.log(blob)
```

- Các tham số của `Blob`
  - `Array: BufferSource | Blob | string`   : Mảng các phần tử mà ta muốn đưa vào `Blob`, Các phần tử này có thể là chuỗi, ArrayBuffer, hoặc blob khác 
  - `Options`: đối tượng tùy chọn có thể bao gồm `type` (Loại MIME của Blob) và `endings` (giá trị có thể là transperan hoặc navtive) để xác định cách xử lý kết thúc các dòng

### Properties

- `Blob.size` Readonly
  - Kích thước của blob, tình bằng byte
- `Blob.type` Readonly
  - Một String chỉ thị loại MIME typec ủa dữ liệu  được chứa trong `BLob`
  
### Method

- `Blob.slice([start],[end],[contentType])`: Method này trả về một `blob` mới chứa dữ liệu từ `start` đến `end`


### Sử dụng BLob

- 1. Tạo Blob từ dữ liệu văn bản

```js
const text = "Đây là nội dung của tôi"
const textBlob = new Blob([text],{type:"text/plain"})

console.log(textBlob)
```

- 2. Tạo Blob từ dữ liệu nhị phân

```js
const binaryData = new Unit8Array([0x00, 0xff, 0xba, 0xad])
const binaryBlob = new Blob([binaryData], {type:"application/octet-stream"});

console.log(binaryBlob);
```


### Sử dụng BLob với URL

- Ta có thể tạo ra URL từ Blob để hiển thị hoặc tải xuống dữ liệu

```js
const url = URL.createObjectURL(blob);
console.log(url)

// Ví dụ hiển thị BLob trong thẻ img
// Tất cả các thẻ đặc biệt sử dụng href, hay yrl để lấy dữ liệu đều là lấy ra từ blob chuyển đổi thành urrl để tiến hành tải 
const url = URL.createObject(blob);
console.log(url);// Trả về một đường dẫn chứa Blob tương ứng]

// VÍ dụ: hiển thị Blob trong thẻ img
const img = document.createElement("img");
// khi mà url = với url được tạo ra từ blob. Client sẽ tiến hành tải blob từ máy chủ (dạng nhị phân hay đại loại vậy. để tạo ra một igm tương ứng sau khi có dữ liệu)
img.src = url;
document.body.appendChild(img);
```

- Hoắc có thể sử dụng `FileReader`

```js
const reader = new FileReader();
reader.onload = function(event) {
  console.log(event.target.result);
};

reader.readAsText(textBlob);
```