## Ý tưởng

- Phần Block opacity Hover là cố định
- Phần Hiển thị cũng có kích thước cố định
- Kích thước ảnh cũng là cố định
-
- Mình có thể làm theo 2 hướng khác nhau
  - 1 là background position 
  - 2 là img translate + overflow:hidden;

- Vị trí của div overlay sẽ phụ thuộc vào chuột + nhưng đồng thời là các cạnh của Điv img
- Ta sẽ cho overlay ở bên trong div để có thể sử dụng absolute
- Kích thước của `zoom-cover` sẽ phụ thuộc vào `zoomed Img` hoặc có thể là