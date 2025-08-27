async function updateButtonPositions(scroll) {
	// scrollToTopBtn
	if (scroll.topMenu.getBoundingClientRect().bottom < 20) { // is out of view
		console.log("scroll.topMenu.getBoundingClientRect() < 20");
		scroll.scrollToTopBtn.style.display = '';
		setTimeout(() => scroll.scrollToTopBtn.classList.remove('hide'), 10);
	} else {	
		console.log("scroll.topMenu.getBoundingClientRect() >= 20");
		scroll.scrollToTopBtn.classList.add('hide');
		setTimeout(() => { if (scroll.scrollToTopBtn.classList.contains('hide')) scroll.scrollToTopBtn.style.display = 'none'; }, 300);
	}
	// scrollToContentBtn
	const rect = scroll.headerGrad.getBoundingClientRect();
	if (rect.bottom >= window.innerHeight) {
		scroll.scrollToContentBtn.classList.add('fixed-bottom');
	} else {
		scroll.scrollToContentBtn.classList.remove('fixed-bottom');
	}
}
class ScrollToContent {
	constructor() {}
	async setUp(contentAnchor) {
		console.log("ScrollToContent", contentAnchor);
		this.scrollToTopBtn 		= document.getElementById('scrollToTopBtn');
		this.scrollToContentBtn 	= document.getElementById('scrollNextBtn');

		this.topMenu 		= document.querySelector('.top-menu');
		this.headerGrad 	= document.querySelector('.header-grad');
		this.contentAnchor 	= contentAnchor || document.getElementById('scroll-to');
		await updateButtonPositions(this);
	}
}
