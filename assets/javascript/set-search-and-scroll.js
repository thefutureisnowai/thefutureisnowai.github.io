async function setUp() {
	console.log("setUp");
	const screenWrapper = new ScreenWrapper();
	await screenWrapper.checkAndResposition();
	const scrollSearch = new ScrollSearch();
	await scrollSearch.setUp();
	console.log("scrollSearch.currentAnchor 1", scrollSearch.currentAnchor);

	scrollSearch.pageDict = scrollSearch.getPageDict();

	const params = new URLSearchParams(window.location.search);
	// arange titlescreen, insert items, set up scroll
	// event handlers
	['load', 'resize'].forEach(eventType => {
			window.addEventListener(eventType, async () => {
					await screenWrapper.checkAndResposition();
					updateButtonPositions(scrollSearch);
					});
			});

	['scroll', 'resize'].forEach(eventType => {
			window.addEventListener(eventType, () => {
					updateButtonPositions(scrollSearch)},
					{ passive: true });
			});

	scrollSearch.scrollToTopBtn.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			});

	scrollSearch.scrollToContentBtn.addEventListener('click', function() {
			scrollSearch.currentAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
			});

	// query loops
	// set up search feature
	const searchBar = document.getElementById('search-bar');
	if(searchBar) {
		searchBar.focus();
		searchBar.addEventListener('keydown', function(e) {
				if (e.key === "Enter") {
				e.preventDefault();
				this.value='';
				if (scrollSearch && scrollSearch.currentAnchor) {
					scrollSearch.currentAnchor.scrollIntoView({behavior:'smooth',block:'start'});
				}
				}
				});
	}
	document.querySelectorAll('.nav-keyboard img, .nav-mouse img').forEach(img => {
			img.style.pointerEvents = 'auto';     // Allow clicking these images now!
			img.style.cursor = 'pointer';
			img.addEventListener('click', () => {
					if(searchBar) searchBar.focus();
					});
			});
	console.log("scrollSearch.currentAnchor 2", scrollSearch.currentAnchor);

	if (params.get('doscroll') === 'true') {
		scrollSearch.currentAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	scrollSearch.pageDict = await scrollSearch.pageDict;
}
document.addEventListener('DOMContentLoaded', setUp);
