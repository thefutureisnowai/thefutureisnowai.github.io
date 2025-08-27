async function setUp() {
console.log("setting up screen");
	const screenWrapper = new ScreenWrapper();
	await screenWrapper.checkAndResposition();
console.log("setting up search");
	const search = new Search();
	await search.setUp();
console.log("setting up scroll, anchor is",search.contentAnchor);
	const scroll = new ScrollToContent();
	await scroll.setUp(search.contentAnchor);
console.log("setting pageDict");

	search.pageDict = search.getPageDict()

	const params = new URLSearchParams(window.location.search);
	// FIXME: the next line is sometimes running before search.setUp finishes this.originalBoxes = await this.insertOriginalBoxes();
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
	document.querySelector('.search-box').addEventListener('keydown', function(e){
			if(e.key === 'Enter'){
			e.preventDefault();
			this.value='';
			// Don't call restoreOriginalContent(), just keep displayed matches.
			}
			});

	document.querySelectorAll('details.main-deets').forEach(details => {
			setScrollToDeets(details);
			});

	if (params.get('doscroll') === 'true') {
		console.log("scroll to content", scroll.contentAnchor);
		scroll.contentAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	await search.pageDict;
}
document.addEventListener('DOMContentLoaded', setUp);
