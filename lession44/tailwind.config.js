/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html','./detail.html', './src/**/*.{js,ts,jsx,tsx}'],

	theme: {
		container: {
			center: true, // Giúp căn giữa container
			padding: '1rem', // Padding cho container
			screens: {
				sm: '100%', // Kích thước max cho màn hình nhỏ
				md: '100%', // Tương tự với các breakpoints khác
				lg: '1024px', // Kích thước lớn nhất cho màn hình lớn
				xl: '1280px', // Kích thước lớn nhất cho màn hình rất lớn
				'2xl': '1280px' // Điều chỉnh kích thước max tại 2xl
			}
		}
	},
	plugins: []
}
