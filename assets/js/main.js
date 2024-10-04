(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    
    // Ensure header exists and has certain classes before manipulating
    if (selectHeader && (selectHeader.classList.contains('scroll-up-sticky') || 
                         selectHeader.classList.contains('sticky-top') || 
                         selectHeader.classList.contains('fixed-top'))) {
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    }
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  // Only add event listener if the button exists
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  // const preloader = document.querySelector('#preloader');
  // if (preloader) {
  //   window.addEventListener('load', () => {
  //     preloader.remove();
  //   });
  // }
  const preloader = document.querySelector('#preloader');
if (preloader) {
  window.addEventListener('load', () => {
    preloader.remove();
  });

  // Fallback: Remove preloader after a set timeout in case page load is delayed
  setTimeout(() => {
    if (preloader) preloader.remove();
  }, 5000); // 5 seconds fallback
}

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.addEventListener('DOMContentLoaded', function () {
    // Initialize Isotope for the container
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
        let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
        let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
        let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

        let initIsotope;

        imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
            initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
                itemSelector: '.isotope-item',
                layoutMode: layout,
                filter: filter,
                sortBy: sort,
                transitionDuration: '0.4s' // Set the duration for transitions
            });

            // Check for the filter parameter in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const filterValue = urlParams.get('filter');

            // Apply the filter if it exists in the URL
            if (filterValue) {
                // Trigger filtering
                initIsotope.arrange({ filter: filterValue });

                // Set the active filter in the UI
                isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
                const activeFilter = isotopeItem.querySelector(`.isotope-filters li[data-filter="${filterValue}"]`);
                if (activeFilter) {
                    activeFilter.classList.add('filter-active');
                }
                // Scroll to the top of the isotope container with an offset
                scrollToIsotopeContainer(isotopeItem);
            }
        });

        // Debounce timer for filtering and sorting
        let debounceTimer;

        // Event listeners for filter items
        isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
            filters.addEventListener('click', function() {
                // Clear the previous debounce timer
                clearTimeout(debounceTimer);

                // Debounce the filtering process
                debounceTimer = setTimeout(() => {
                    // Remove the active class from the previously active filter
                    isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');

                    // Add the active class to the clicked filter
                    this.classList.add('filter-active');

                    // Apply the filter
                    const filterValue = this.getAttribute('data-filter');
                    initIsotope.arrange({
                        filter: filterValue,
                        sortBy: this.getAttribute('data-sort') || sort // Optionally sort by attribute
                    });

                    // Update the URL to reflect the current filter
                    const currentUrl = new URL(window.location.href);
                    currentUrl.searchParams.set('filter', filterValue);
                    history.pushState(null, '', currentUrl); // Update the URL without reloading the page

                    // Scroll to the top of the isotope container with an offset
                    scrollToIsotopeContainer(isotopeItem);

                    // Initialize AOS if applicable
                    if (typeof aosInit === 'function') {
                        aosInit();
                    }
                }, 200); // Adjust debounce time as necessary
            }, false);
        });
    });
});

// Function to scroll to the isotope container with the correct offset
function scrollToIsotopeContainer(isotopeItem) {
    const container = isotopeItem.querySelector('.isotope-container');
    const pageTitle = document.querySelector('.page-title');

    if (container && pageTitle) {
        const pageTitleHeight = pageTitle.offsetHeight; // Get the height of the page title
        const offsetTop = container.getBoundingClientRect().top + window.scrollY - (pageTitleHeight + 20); // Use page title height + an additional offset
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}



  
})();

// Image Slide Show logic
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

// console.log(slides.length); 
// console.log(dots.length);  

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    dots[i].classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
      dots[i].classList.add('active');
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

// Auto-slide functionality
setInterval(nextSlide, 5000); // Change slide every 5 seconds


