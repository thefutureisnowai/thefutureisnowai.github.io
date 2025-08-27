// Helper to check if an element is fully visible vertically in viewport
const deltaT_down = 500;
const deltaT_up = 500;

eps = 1e-6;
scrollEps = 50

function animateHeightscroll(details, startH, endH, scrollFrom, scrollTo, duration, callback) {
	// re-size details from startH to endH and simultaneously scroll by scrollAmount
	// record position for restoring scroll height
	const t0 = performance.now();

	details.scrollYPrev = window.scrollY; // back up current scroll location 

	const deltaHeightT = endH - startH;
	const deltaYT      = scrollTo - scrollFrom; // scroll amount

	const scrollRate   = deltaYT / duration;
	const heightRate   = deltaHeightT / duration;
	const yRate        = deltaYT / duration;

	function animate(now) {
		// scroll if necessary, and change height

		let deltaT = now - t0; 
		deltaT = deltaT > duration && duration || deltaT;  // min of duration

		const deltaScroll = scrollRate * deltaT;
		const deltaY = scrollRate * deltaT;
		const deltaHeight = heightRate * deltaT;

		if ( deltaHeight < -eps || deltaHeight > eps)
			details.style.maxHeight = (startH + deltaHeight) + "px";

		if ( deltaY < -eps || deltaY > eps)
			details.style.maxHeight = startH + deltaHeight;

		if ( deltaScroll < -eps || deltaScroll > eps)
			window.scrollTo(0, scrollFrom + deltaY);

		if (deltaT < duration - eps) { // slight upper tolerance for numberical errors
			requestAnimationFrame(animate);
		} else {
			details.style.maxHeight = '';
			if (callback) callback();
			details.preCloseScrollY = window.scrollY;
		}
	}
	requestAnimationFrame(animate);
}

function openDeets(details) {
	details.preOpenScrollY = window.scrollY;
	const sizeClosed = details.getBoundingClientRect().height;
	details.open = true; // FIXME: 
	void details.offsetHeight;
	const sizeOpen = details.scrollHeight;

	// restore closed dimensions without closing
	details.style.maxHeight = details.sizeClosed + "px";
	details.sizeClosed = sizeClosed;

	let scrollTo = window.scrollY; // will add to in the following branches
	if (details.getBoundingClientRect().top < 0) {// scroll up
		scrollTo +=details.getBoundingClientRect().top;
	}

	// else scroll down if off-sccreen
	else {
		const bottom = details.getBoundingClientRect().top + details.scrollHeight;

		if ( bottom > window.innerHeight + eps ) { // bottom is below screen
			if ( sizeOpen < document.documentElement.clientHeight ) {
				// it will fit entirely on screen, align bottoms
				scrollTo +=bottom - window.innerHeight // negative number
			}
			else { // will not fit on screen, scroll down to align to the top of details
				scrollTo +=details.getBoundingClientRect().top;
			}
		}
	}

	// Force reflow to apply maxHeight=0 immediately FIXME: ? 
	void details.offsetHeight;

	animateHeightscroll(details, 
			details.sizeClosed, sizeOpen, 
			window.scrollY, scrollTo,
			deltaT_down,  () => {
			details.style.maxHeight = '';
			});
}

function closeDeets(details) {
	let scrollTo;
	if (details.preCloseScrollY + scrollEps < window.scrollY < details.preCloseScrollY + scrollEps)
		scrollTo = details.preOpenScrollY;
	else
		scrollTo = window.scrollY;

	details.style.maxHeight = details.scrollHeight + 'px';

	// Force reflow to apply initial height immediately
	void details.offsetHeight;

	animateHeightscroll(details, 
			details.scrollHeight, details.sizeClosed, 
			window.scrollY, scrollTo,
			deltaT_up,  () => {
			details.style.maxHeight = '';
			details.open = false;
			});
}
function openOrClose(details) {
	if (! details.isAnimating) {
		details.isAnimating = true;

		if (! details.open) // since it's not closed yet, it's open!
			setTimeout(() => openDeets(details), 0); // after expand animation/layout
		else 
			setTimeout(() => closeDeets(details), 0); // after expand animation/layout
	}
	details.isAnimating = false;
}
function setupPlasmaBorders() {
	function updatePlasmaBorders() {
		document.querySelectorAll('.main-content-box').forEach(
				box => {
				const deets = box.querySelector('.main-content > details.main-deets');
				const summary = deets?.querySelector(':scope > summary.main-summary');
				box.classList.toggle('has-unopened-details', !!deets && !!summary && !deets.open);
				if (deets && summary) {
				box.style.cursor = "pointer";
				box.addEventListener("click", (e) => {
						if (e.target.closest('a')) return;
						e.preventDefault();
						openOrClose(deets);
						});
				}
				});
	}
	updatePlasmaBorders();

	// Listen only on direct .main-deets under .main-content in each .main-content-box
	document.querySelectorAll('.main-content-box .main-content > details.main-deets').forEach(deets => {
			deets.addEventListener('toggle', updatePlasmaBorders);
			});
}
