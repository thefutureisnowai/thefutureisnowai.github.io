async function setUp() {
	console.log("setUp");
	const screenWrapper = new ScreenWrapper();
	await screenWrapper.checkAndResposition();
	const search = new Search();
	await search.setUp();
	const scroll = new ScrollToContent();
	await scroll.setUp(search.contentAnchor);

	search.pageDict = search.getPageDict();
	setupDeetsAnime();

	const params = new URLSearchParams(window.location.search);
	// arange titlescreen, insert items, set up scroll
	// event handlers
	['load', 'resize'].forEach(eventType => {
			window.addEventListener(eventType, async () => {
					await screenWrapper.checkAndResposition();
					updateButtonPositions(scroll);
					});
			});

	['scroll', 'resize'].forEach(eventType => {
			window.addEventListener(eventType, () => {
					updateButtonPositions(scroll)},
					{ passive: true });
			});

	scroll.scrollToTopBtn.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			});

	scroll.scrollToContentBtn.addEventListener('click', function() {
			scroll.contentAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
			});

	// query loops
	// set up search feature
	const searchBar = document.getElementById('search-bar');
	if(searchBar) searchBar.focus();
	document.querySelectorAll('.nav-keyboard img, .nav-mouse img').forEach(img => {
			img.style.pointerEvents = 'auto';     // Allow clicking these images now!
			img.style.cursor = 'pointer';
			img.addEventListener('click', () => {
					if(searchBar) searchBar.focus();
					});
			});

	if (params.get('doscroll') === 'true') {
		console.log("scroll to content", scroll.contentAnchor);
		scroll.contentAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	search.pageDict = await search.pageDict;
}
document.addEventListener('DOMContentLoaded', setUp);
