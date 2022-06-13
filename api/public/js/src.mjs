let limit1 = 2;
let page2 = 1;

async function getPosts(limit, page) {
    page = page2;
    limit = limit1;
    let url = `http://localhost:3000/api/posts?page=${page}&limit=${limit}`;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

const nextPage = () => {
    page2++;
    
}

const previousPage = () => {
    page2--;
    
}

async function renderPosts(page, limit) {
    page = page2;
    limit = limit1;
    let posts = await getPosts(page,limit1);
    let html = '';
    posts.forEach(post => {
        
        let htmlSegment = `<article
        class="transition-colors duration-300 hover:bg-gray-100 border border-black border-opacity-0 hover:border-opacity-5 rounded-xl">
        <div class="py-6 px-5 lg:flex">
            <div class="flex-1 lg:mr-8">
                <img src="./images/illustration-1.png" alt="Blog Post illustration" class="rounded-xl">
            </div>

            <div class="flex-1 flex flex-col justify-between">
                <header class="mt-8 lg:mt-0">
                    <div class="space-x-2">
                        <a href="#"
                           class="px-3 py-1 border border-blue-300 rounded-full text-blue-300 text-xs uppercase font-semibold"
                           style="font-size: 10px">Techniques</a>

                        <a href="#"
                           class="px-3 py-1 border border-red-300 rounded-full text-red-300 text-xs uppercase font-semibold"
                           style="font-size: 10px">Updates</a>
                    </div>

                    <div class="mt-4">
                        <h1 class="text-3xl">
                            ${post.title}
                            ${post._id}
                        </h1>

                        <span class="mt-2 block text-gray-400 text-xs">
                                Published at <time>${post.publishDate}</time>
                            </span>
                    </div>
                </header>

                <div class="text-sm mt-2">
                    <p>
                        ${post.content}
                    </p>

                </div>

                <footer class="flex justify-between items-center mt-8">
                    <div class="flex items-center text-sm">
                        <img src="./images/lary-avatar.svg" alt="Lary avatar">
                        <div class="ml-3">
                            <h5 class="font-bold">shady</h5>
                            <h6>Mascot at Laracasts</h6>
                        </div>
                    </div>

                    <div class="hidden lg:block">
                        <a href="#"
                           class="transition-colors duration-300 text-xs font-semibold bg-gray-200 hover:bg-gray-300 rounded-full py-2 px-8"
                        >Read More</a>
                    </div>
                </footer>
            </div>
        </div>
    </article>
   
    `;

        html += htmlSegment;
    });

    let container = document.querySelector('.container');
    container.innerHTML = html;
}

renderPosts();