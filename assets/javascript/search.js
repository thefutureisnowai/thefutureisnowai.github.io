// Loads listed HTML files and collects all .main-content-box DOM nodes; returns them in an array.
class Search {
	constructor() {}
	async setUp() {
	// load modules from files
	// save content for efficient memory usage
		const contentContainer = document.querySelector('.content');
	// back up original modules for restoring
		const originalModules = [];
		contentContainer.querySelectorAll('.main-content-box').forEach(box => originalModules.push(box));
	// set up fuzzy-search event handler
		const search = this;
		this.allModules = await this.loadModuleList();
		document.querySelector('.search-box').addEventListener('input', async function(e){
				const query = e.target.value.trim();
				if (query) {
				const results = await search.searchModules(query);
				if (results.length == 0) return;
				search.currentModules.forEach(box => box.remove());
				search.currentModules = results;
				await search.insertModules();

				} else { // Empty field: restore all original boxes
				await search.restoreOriginalContent();
				}
				});
	// save values for efficient memory use
		this.headerGrad = contentContainer.querySelector('.header-grad');
		this.contentContainer = contentContainer;
		this.originalModules = originalModules;
		this.currentModules = [];
	}
	// Helper to restore all content boxes (show original)
	async restoreOriginalContent() {
		this.currentModules = this.originalModules;
		await this.insertModules();
	}

	async loadModuleList() {
		const htmlFiles = [
			"about.html", "ai.html", "contact.html",
			"index.html", "it.html", "privacy.html",
			"scheduling.html", "security.html"
		];
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
	async searchModules(query) {
		if (!query) return [];
		const modules = this.allModules;
		// Case-insensitive substring/fuzzy search using Fuse.js

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
	async insertModules() {
		if (this.currentModules.length==0) return;
		const modules = this.currentModules;
		const contentContainer = this.contentContainer;
		const headerGrad = this.headerGrad;

		// Find the header-grad div
		let insertAfter = headerGrad;

		// Insert each module right after the headerGrad, preserving order
		modules[0].id = "main-content";
		modules.forEach(mod => {
				mod.style.display = '';
				const details = mod.querySelector('.main-content-box details.main-deets');
				contentContainer.insertBefore(mod, insertAfter.nextSibling);
				insertAfter = mod;
				});

		contentContainer.querySelectorAll('.main-content-box details.main-deets').forEach(details => {
				setScrollToDeets(details);
				});
		return contentContainer;
	}
}
// DOM
document.addEventListener('DOMContentLoaded', async function() {
		search = new Search();
		search.setUp();
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
