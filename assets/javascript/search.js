// Loads listed HTML files and collects all .main-content-box DOM nodes; returns them in an array.
async function loadModuleList(htmlFiles) {
	const moduleList  = [];
	for (const file of htmlFiles) {
		try {
			const res = await fetch(file);
			if (!res.ok) continue;
			const htmlText = await res.text();
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = htmlText;
			tempDiv.querySelectorAll('.main-content-box').forEach(box =>
					moduleList.push(box.cloneNode(true))
					);
		} catch (e) { console.error('Error loading:', file); }
	}
	return moduleList;
}

// Searches a module array for a query string, returns matching module objects (case-insensitive)
async function searchModules(modules, query) {
	// Case-insensitive substring/fuzzy search using Fuse.js
	// FIXME: when Enter is pressed it doubles the query
	query = query.trim().toLowerCase();
	if (!query) return [];

	const fuse = new Fuse(modules, {
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
async function insertModulesToContent(modules) {
	if (modules.length==0) return;
	const contentContainer = document.querySelector('.content');
	// Remove existing .main-content-box children first
	// FIXME: store these rather than remove them so we can restore the page without refreshing.
	contentContainer.querySelectorAll('.main-content-box').forEach(box => box.remove());

	// Find the header-grad div
	const headerGrad = contentContainer.querySelector('.header-grad');
	let insertAfter = headerGrad;

	// Insert each module right after the headerGrad, preserving order
	modules[0].id = "main-content";
	modules.forEach(mod => {
			mod.style.display = '';
			const details = mod.querySelector('details.main-deets');
			contentContainer.insertBefore(mod, insertAfter.nextSibling);
			insertAfter = mod;
			});

	contentContainer.querySelectorAll('.main-content-box details.main-deets').forEach(details => {
			setScrollToDeets(details);
			});
	return contentContainer;
}


// DOM
document.addEventListener('DOMContentLoaded', async function() {

		const htmlFiles = [
		"about.html", "ai.html", "contact.html",
		"index.html", "it.html", "privacy.html",
		"scheduling.html", "security.html"
		];

		// Step2: Load module DOM nodes from HTML/MD files
		const allModules = await loadModuleList(htmlFiles);

		// Optional: Do the fuzzy/text search when typing in search bar
		document.querySelector('.search-box').addEventListener('input', async function(e){
				const query = e.target.value;
				if (query.trim()) {
				// User is searching: show only matches.

				const results = await searchModules(allModules, query);
				if (results.length == 0) return;

				const contentContainer = await insertModulesToContent(results);

				} else {
				// Empty field: restore all original boxes
				restoreOriginalContent();
				}
				});

		// Helper to restore all content boxes (show original)
		function restoreOriginalContent() {
			// Option 1: reload whole page
			location.reload();
			// Option 2: If you have a *copy* of initial HTML nodes, reinsert those here instead of reload.
		}


}); // DOM

// when Enter is pressed the prompt text should vanish (rather than a newline), and the loaded content should stay the same.
document.querySelector('.search-box').addEventListener('keydown', function(e){
		if(e.key === 'Enter'){
		e.preventDefault();
		this.value='';
		// Don't call restoreOriginalContent(), just keep displayed matches.
		}
		});
document.addEventListener('DOMContentLoaded', function(){
		const searchBar = document.getElementById('search-bar');
		// Always focus on page load:
		if(searchBar) searchBar.focus();

		// Helper: Make images clickable and focus bar
		document.querySelectorAll('.nav-keyboard img, .nav-mouse img').forEach(img => {
				img.style.pointerEvents = 'auto';     // Allow clicking these images now!
				img.style.cursor = 'pointer';
				img.addEventListener('click', () => {
						if(searchBar) searchBar.focus();
						});
				});
		});
