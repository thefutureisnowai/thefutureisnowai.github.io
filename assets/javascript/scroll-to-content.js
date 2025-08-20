class ScrollToContent {
	constructor() {
		this.button = document.getElementById('scrollNextBtn');
		this.setScrollToContent();
	}
	scrollToContent() {
		this.mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	setScrollToContent() {
		const headerGrad = document.querySelector('.header-grad');
		const contentBtn = document.getElementById('scrollNextBtn');

		function updateButtonPosition() {
			const rect = headerGrad.getBoundingClientRect();
			if (rect.bottom >= window.innerHeight) {
				contentBtn.classList.add('fixed-bottom');
			} else {
				contentBtn.classList.remove('fixed-bottom');
			}
		}

		window.addEventListener('scroll', updateButtonPosition);
		window.addEventListener('resize', updateButtonPosition);

		// Initialize on load
		updateButtonPosition();

		// Initialize again after full page load (images/styles)
		window.addEventListener('load', updateButtonPosition);
		const scroll = this;
		this.button.addEventListener('click', function() {
				scroll.scrollToContent();
				});

		this.mainContent = document.getElementById('main-content');
	}
}
document.addEventListener("DOMContentLoaded", function() {
		scroller = new ScrollToContent();

		// keep Content button on-screen
		const header = document.querySelector('.top-menu');
		const scrollTopBtn = document.getElementById('scrollToTopBtn');

		function headerOutOfView() {
		if (!header) return false;
		const rect = header.getBoundingClientRect();
		// Hide if bottom not below fixed offset (20px, possibly adjust for your UI)
		return rect.bottom < 20;
		}

		function updateScrollTopButton() {
		if (headerOutOfView()) {
		scrollTopBtn.style.display = '';
		setTimeout(() => scrollTopBtn.classList.remove('hide'), 10);
		} else {
		scrollTopBtn.classList.add('hide');
		// If using display:none for transition, hide after fade-out:
		setTimeout(() => { if (scrollTopBtn.classList.contains('hide')) scrollTopBtn.style.display = 'none'; }, 300);
		}
		}

		window.addEventListener('scroll', updateScrollTopButton, { passive: true });
		window.addEventListener('resize', updateScrollTopButton);

		// Initial state
		updateScrollTopButton();

		scrollTopBtn.addEventListener('click', function () {
				window.scrollTo({ top: 0, behavior: 'smooth' });
				});

		const params = new URLSearchParams(window.location.search);
		if (params.get('doscroll') === 'true') {
			console.log("do scroll");
			scroller.scrollToContent();
		}
	}
);
