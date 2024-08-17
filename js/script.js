let currentPage = 1;
const itemsPerPage = 29;
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const imageGrid = document.getElementById('image-grid');
const orient = document.getElementById('orientation');

searchBtn.addEventListener('click', () => {
    currentPage = 1;  // Reset to the first page on a new search
    imageGrid.innerHTML = '';  // Clear existing images for new search
    fetchImages(searchInput.value, currentPage);
});

const rippleLoader = document.getElementById('ripple-loader');

function showRippleLoader() {
    rippleLoader.classList.remove('hidden');
}

function hideRippleLoader() {
    rippleLoader.classList.add('hidden');
}

function fetchImages(query, page) {
    showRippleLoader();  // Show ripple loader before starting fetch
    fetch(`https://uns.vpms.xyz/v1/search?query=${query}&per_page=${itemsPerPage}&page=${page}&orientation=${orient.value}`)
        .then(response => response.json())
        .then(data => {
            displayImages(data);
            currentPage++;  // Increment page number after loading images
            hideRippleLoader();  // Hide ripple loader after images are loaded
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            hideRippleLoader();  // Also hide ripple loader on error
        });
}

function displayImages(images) {
    const generateImageHtml = (image) => {
        const imageUrl = image.urls.regular;
        const downloadUrl = image.links.download;
        const aspectRatio = image.height / image.width * 100;
        return `
            <div class="relative group mb-4 break-inside-avoid">
                <div style="padding-bottom: ${aspectRatio}%;" class="relative overflow-hidden rounded-t-lg shadow-lg">
                    <img src="${imageUrl}" alt="${image.alt_description || 'No Description'}" class="absolute top-0 left-0 w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <a href="${downloadUrl}" target="_blank" download class="text-white bg-google-blue hover:bg-blue-600 transition-colors duration-300 rounded-full p-3">
                            <i class="fa-regular fa-cloud-arrow-down"></i>
                        </a>
                    </div>
                </div>
                <div class="p-2 bg-white rounded-b-lg shadow">
                    <h3 class="font-semibold text-lg truncate">${image.description || image.alt_description || 'Untitled'}</h3>
                    <p class="text-sm text-gray-600">By: ${image.user.name}</p>
                    <div class="flex justify-between items-center mt-2 text-sm text-gray-700">
                        <span class="flex items-center">
                            <i class="fa-thin fa-image mr-1"></i>
                            ${image.width} x ${image.height}
                        </span>
                        <span class="flex items-center">
                            <i class="fa-sharp fa-solid fa-heart mr-1" style="color: #d9421c;"></i>
                            ${image.likes}
                        </span>
                    </div>
                    <div class="flex items-center mt-2">
                        <span class="mr-2 text-sm text-gray-700">Color:</span>
                        <div style="background-color: ${image.color};" class="w-6 h-6 rounded-full border border-gray-300"></div>
                    </div>
                </div>
            </div>
        `;
    }

    imageGrid.innerHTML += images.map(generateImageHtml).join('');

    // Apply masonry layout
    masonryLayout();
}

function masonryLayout() {
    // Force reflow to apply masonry layout
    imageGrid.style.columnCount = window.innerWidth < 640 ? 1 : window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4;
    imageGrid.style.columnGap = "1rem";
}

window.addEventListener('resize', masonryLayout);

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        fetchImages(searchInput.value, currentPage);
    }
});
