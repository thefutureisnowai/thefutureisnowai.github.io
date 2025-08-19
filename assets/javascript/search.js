// 1. Hides all .main-content-box elements in .content
function hideAllContentBoxes() {
	document.querySelectorAll('.content .main-content-box').forEach(box => {
			box.style.display = 'none';
			});
}

// 2. Loads listed HTML files and collects all .main-content-box DOM nodes; returns them in an array.
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

// 3. Searches a module array for a query string, returns matching module objects (case-insensitive)
function searchModules(modules, query) {
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
function insertModulesToContent(modules) {
	const contentContainer = document.querySelector('.content');
	// Remove existing .main-content-box children first
	contentContainer.querySelectorAll('.main-content-box').forEach(box => box.remove());

	// Find the header-grad div
	const headerGrad = contentContainer.querySelector('.header-grad');
	let insertAfter = headerGrad;

	// Insert each module right after the headerGrad, preserving order
	modules[0].id = "main-content";
	modules.forEach(mod => {
			mod.style.display = '';
			contentContainer.insertBefore(mod, insertAfter.nextSibling);
			insertAfter = mod;
			});
}

function hideAllContentBoxes() {
	document.querySelectorAll('.content .main-content-box').forEach(box => {
			box.style.display = 'none';
			});
}
document.addEventListener('DOMContentLoaded', async function() {

		const htmlFiles = [
		"about.html", "ai.html", "contact.html",
		"index.html", "it.html", "privacy.html",
		"scheduling.html", "security.html"
		];

		// Step2: Load module DOM nodes from HTML/MD files
		const allModules = await loadModuleList(htmlFiles);

		// Optional: Do the fuzzy/text search when typing in search bar
		document.querySelector('.search-box').addEventListener('input', function(e){
				const query = e.target.value;
				if (query.trim()) {
				// User is searching: show only matches.

				const results = searchModules(allModules, query);

				insertModulesToContent(results);
				} else {
				// Empty field: restore all original boxes
				restoreOriginalContent();
				}
				setScrollToDeets();
				});

		// Helper to restore all content boxes (show original)
		function restoreOriginalContent() {
			// Option 1: reload whole page
			location.reload();
			// Option 2: If you have a *copy* of initial HTML nodes, reinsert those here instead of reload.
		}


});
