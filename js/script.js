let currentPage = 1;
const itemsPerPage = 29;
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const imageGrid = document.getElementById('image-grid');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');
const orient = document.getElementById('orientation');

searchBtn.addEventListener('click', () => {
    currentPage = 1;  // Reset to the first page on a new search
    fetchImages(searchInput.value, currentPage);
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchImages(searchInput.value, currentPage);
    }
    updatePaginationButtons();
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchImages(searchInput.value, currentPage);
    updatePaginationButtons();
});

const rippleLoader = document.getElementById('ripple-loader');

function showRippleLoader() {
    rippleLoader.style.display = 'inline-block';
}

function hideRippleLoader() {
    rippleLoader.style.display = 'none';
}

function fetchImages(query, page) {
    showRippleLoader();  // Show ripple loader before starting fetch
    fetch(`https://uns.vpms.xyz/v1/search?query=${query}&per_page=${itemsPerPage}&page=${page}&orientation=${orient.value}`)
        .then(response => response.json())
        .then(data => {
            displayImages(data);
            currentPageSpan.textContent = currentPage;
            totalPagesSpan.textContent = 100;  // Adjust as needed
            updatePaginationButtons();
            hideRippleLoader();  // Hide ripple loader after images are loaded
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            hideRippleLoader();  // Also hide ripple loader on error
        });
}


function displayImages(images) {
    imageGrid.innerHTML = '';  // Clear existing images

    const generateImageHtml = (image) => {
        const imageUrl = image.urls.regular;
        const rawUrl = image.urls.raw;
        return `
            <div class=" container mx-auto image-container rounded-lg">
                <img src="${imageUrl}" alt="${image.alt_description || 'No Description'}">
                <div class="overlay">
                    <a href="${rawUrl}" target="_blank" download>
                        <i class="fa-light fa-download" style="color: #ffffff;"></i>
                    </a>
                </div>
            </div>
        `;
    }
    
    

    // Generate HTML for all images and append to the imageGrid
    imageGrid.innerHTML = images.map(generateImageHtml).join('');
}

function updatePaginationButtons() {
    // Disabling the 'prev' button if on the first page
    prevBtn.disabled = (currentPage <= 1);
    
    // Disabling the 'next' button if on the last page. 
    // This assumes that the total pages are updated in the totalPagesSpan
    nextBtn.disabled = (currentPage >= parseInt(totalPagesSpan.textContent));
}
