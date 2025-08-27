// Loads listed HTML files and collects all .main-content-box DOM nodes; returns them in an array.
// FIXME add hashtags to boxes, and all boxes will have their page name as a tag
class Search {
	constructor() {}
	async setUp() {
		// initially page is populated with the original page contents which is recieved from a template. Loop throught the template boxes and insert them (after resizing them)
		// search should check to see if a box is already in the page before showing it to avoid excessive insertions and deletions
		// main page boxes are hidden, but never removed or inserted after the first setUp call
		// maybe best to perform two separate searches: one on the original page contents, another on the remainder
		// first just get the initial page setup working.
		// boxes in this.pageName should never be deleted or cloned. Other boxes are deleted and cloned. No, don't make an exception.
		// if this.currentBoxes in null then we show original, if [] we show nothing.

		this.contentContainer = document.querySelector('.content');
		this.headerGrad = this.contentContainer.querySelector('.header-grad');
		this.pageName = window.location.pathname.split('/').filter(Boolean).pop();
		this.currentBoxes = null;
		this.originalBoxes = await this.insertOriginalBoxes();
		// this.pageDict = this.getPageDict() // do this externally because it's time consuming

		const search = this;
		document.querySelector('.search-box').addEventListener('input', async function(e){
				const query = e.target.value.trim();

				if (query.length == 0) return await search.restoreOriginalContent(); // empty search pattern
				if (query.length < 3) return;

				const results = await search.searchBoxes(query);

				if (results.length == 0) return; // empty results

				if (search.currentBoxes) search.currentBoxes.forEach(box => box.remove());
				search.currentBoxes = results;

				const boxes = search.currentBoxes;
				await search.insertBoxes(boxes);
				});
	}
	async insertOriginalBoxes() {
		const contentTemplate = document.getElementById('page-content');
		// this.contentContainer.appendChild(contentTemplate.content.cloneNode(true));
		const originalBoxes = Array.from(contentTemplate.content.children).filter(el => el.tagName === 'DIV');
		await this.insertBoxes(originalBoxes);
		console.log("finished insertOriginalBoxes");
		return originalBoxes;
	}
	async restoreOriginalContent() {
		if (this.currentBoxes) this.currentBoxes.forEach( box => box.remove() );
		this.pageDict[this.pageName].forEach( box => {
				box.style.maxWidth = this.headerGrad.offsetWidth + "px"; // no boxes are wider than the header
				box.style.display = '';
				});
	}
	async getPageDict() {
		const htmlFiles = [
			"about.html", "ai.html", "contact.html",
			"index.html", "it.html", "privacy.html",
			"scheduling.html", "security.html"
		];
		const pageDict = {};
		for (const file of htmlFiles) {
			const basename = file.split(".")[0];
			pageDict[basename] = [];
			const res = await fetch(file);
			const htmlText = await res.text();
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = htmlText;
			const contentTemplate = tempDiv.querySelector('#page-content');
			pageDict[basename] = Array.from(contentTemplate.content.children).filter(el => el.tagName === 'DIV');
		}
		return pageDict;
	}
	// Searches a module array for a query string, returns matching module objects (case-insensitive)
	async searchBoxes(query) {
		if (!query) return [];
		// Case-insensitive substring/fuzzy search using Fuse.js
		const boxes = Object.values(this.pageDict).flat(); // concatenate all boxes
		const fuse = new Fuse(boxes, {
	keys: [
	{
	name: 'textContent',
	getFn: (mod) => mod.textContent,
	weight: 1
	}
	],
	threshold: 0.3, // adjust for fuzziness
	ignoreLocation: true,
	minMatchCharLength: 2,
	includeScore: false
	});

	const results = fuse.search(query);
	return results.map(r => r.item);
	}
	async removeBoxes() {
		this.currentBoxes.forEach( box => { box.remove(); } );
	}
	async insertBoxes(boxes) {
		const contentContainer = this.contentContainer;
		const headerGrad = this.headerGrad;

		// Find the header-grad div
		let insertAfter = headerGrad;

		// Insert each module right after the headerGrad, preserving order
		this.contentAnchor = false;
		boxes.forEach(box => {
				if (!this.contentAnchor && box.querySelector(".scroll-to")) {
					this.contentAnchor = box;
				}
				box.style.maxWidth = this.headerGrad.offsetWidth + "px"; // no boxes are wider than the header
				box.style.display = '';
				
				contentContainer.insertBefore(box, insertAfter.nextSibling);
				insertAfter = box;
				});
			
	}
}
