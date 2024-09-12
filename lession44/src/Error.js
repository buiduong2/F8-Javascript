export const ErrorPage = (match, error) => {
	return `
        <div class="mx-auto my-auto flex flex-col justify-center items-center">
            <h1 class="mb-8 text-9xl font-bold">${error.code}</h1>
            <p class="text-2xl">${error.message}</p>
        </div>
    `
}
