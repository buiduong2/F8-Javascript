## Bài 1 :

```js
var errors = {
    name: {
        required: "Vui lòng nhập họ tên",
        min: "Họ tên phải từ 5 ký tự"
    },
    email: {
        email: "Định dạng email không hợp lệ",
        unique: "Email đã có người sử dụng",
        required: "Vui lòng nhập địa chỉ email"
    },
    password: {
        required: "Vui lòng nhập mật khẩu",
        same: "Mật khẩu phải khớp với mật khẩu nhập lại"
    }
}

getError('name')//Vui lòng nhập họ tên
getError('name.min')//Họ tên phải từ 5 ký tự
```


## Bài 2

```js

const customers = [
  { name: "Nguyễn Văn A", age: 11, address: "Ha Noi" },
  { name: "Nguyễn Văn B", age: 2, address: "Hai Phong" },
  { name: "Nguyễn Văn C", age: 12, address: "TP.HCM" },
];

const result = createCustomers(customers);

console.log(result)

// [
//   {
//     name: 'Nguyễn Văn B',
//     age: 2,
//     address: 'Hai Phong',
//     shortName: 'Nguyễn B'
//   },
//   {
//     name: 'Nguyễn Văn A',
//     age: 11,
//     address: 'Ha Noi',
//     shortName: 'Nguyễn A'
//   },
//   {
//     name: 'Nguyễn Văn C',
//     age: 12,
//     address: 'TP.HCM',
//     shortName: 'Nguyễn C'
//   }
// ]
```


## Bài 3

```js
var result;
var authResponse = handleRegister("Duong", "123", "123@gmail.com")
if (authResponse.type === 'Accept') {
    result = authResponse.data
} else {
    result = authResponse.data.join('\n')
}

console.log(result)

// {
//   name: 'Duong',
//   password: '123',
//   email: '123@gmail.com',
//   role: 'user'
// }

var result;
var authResult = handleRegister("Duo", "123", "123@gmail.com")
if (authResult.type === 'Accept') {
    result = authResult.data
} else {
    result = authResult.data.join('\n')
}

console.log(result)
//Họ tên phải từ 5 ký tự

```

- Login
```js
var authResult = handleLogin(email, password)
if (authResult.type === 'Accept') {
	var user = authResult.data
    console.log(data)
} else {
	var message = authResult.data.join('\n')
    console.log(message)
}
```