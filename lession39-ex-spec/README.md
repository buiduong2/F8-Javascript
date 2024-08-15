## Cố gắng triển khai theo cách giống VueJS

## Các hành vi tương tứng với Array của Javascript

## Khi gọi POP()

- Nó sẽ gọi `arr.length--`

## KHi gọi Pop();

- Nó sẽ gọi `arr[length] = 'new-value'`

## Khi nó gọi shift()

- Dịch chuyển tất cả các phần tử về index - 1. Sau đó gọi `length` để giảm phần tử

## Unshift(item)
- DỊch chuyển tất cả các phần tử lên `index + 1`. và sau đó  thêm một phần tử vào `index = 0` rồi gọi `length`

## Push(item)

- Thêm phần tử vào `index = length`. sau đó tăng length lên + 1

## Splice() 

- Dịch chuyển tất cả các phần tử sang bên trái. Và sau đó gọi length để giảm kích thước array


## Mặc dù khi ta xóa phần tử

- Array. tự động cập nhật lại index (các phần tử bên phải cũng sẽ bị xóa)

## Nhưng khi ta thêm phần tử

- nếu thêm bên phải thì không sao
- Nhưng nếu thêm bên trái thì lại có vấn đề
- Lúc này các index bị đẩy sang bên phải. Thì sẽ có các person bị nhảy ra ngoài Phần tử index khi array chưa được cạp nhật 