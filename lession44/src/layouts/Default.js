export const DefaultLayout = () => {
	return `
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
    `
}
