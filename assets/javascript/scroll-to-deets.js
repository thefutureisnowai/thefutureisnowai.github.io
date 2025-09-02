// Helper to check if an element is fully visible vertically in viewport
const deltaT_down = 500;
const deltaT_up = 500;

eps = 1e-6;
scrollEps = 50

class DeetsData {
	static map = new WeakMap();
	constructor() {
		this.isAnimating = false;
		this.hasEventListener = false;
	}
}
function animateHeightscroll(deets, startH, endH, scrollFrom, scrollTo, duration, callback) {
	// re-size deets from startH to endH and simultaneously scroll by scrollAmount
	// record position for restoring scroll height
	// console.log("animateHeightscroll");
	const t0 = performance.now();

	deets.scrollYPrev  = window.scrollY; // back up current scroll location 

	const deltaHeightT = endH - startH;
	const deltaYT      = scrollTo - scrollFrom; // scroll amount

	const scrollRate   = deltaYT / duration;
	const heightRate   = deltaHeightT / duration;
	const yRate        = deltaYT / duration;

	function animate(now) {
		// scroll if necessary, and change height
		// console.log("animate");
		let deltaT = now - t0; 
		deltaT = deltaT > duration && duration || deltaT;  // min of duration

		const deltaScroll = scrollRate * deltaT;
		const deltaHeight = heightRate * deltaT;

		if ( deltaHeight < -eps || deltaHeight > eps) { // change deets height (expand or close)
								// console.log("change height to", startH, "+", deltaHeight);
			deets.style.maxHeight = (startH + deltaHeight) + "px";
		}

		if ( deltaScroll < -eps || deltaScroll > eps) { // do scroll
								// console.log("change scroll to", scrollFrom, "+", deltaY);
			window.scrollTo(0, scrollFrom + deltaScroll);
		}

		if (deltaT < duration - eps) { // keep animating
					       // console.log("keep animating");
			requestAnimationFrame(animate);
		} else { // finished animation
			 // console.log("finished animate");
			deets.style.maxHeight = '';
			if (callback) callback();
			deets.preCloseScrollY = window.scrollY;
		}
	}
	requestAnimationFrame(animate);
}

function openDeets(deets, deetsData) {
	deets.preOpenScrollY = window.scrollY;
	const sizeClosed = deets.getBoundingClientRect().height;
	deets.open = true; // FIXME: 
	void deets.offsetHeight;
	const sizeOpen = deets.scrollHeight;

	// restore closed dimensions without closing
	deets.style.maxHeight = deets.sizeClosed + "px";

	let scrollTo = window.scrollY; // will add to in the following branches
	if (deets.getBoundingClientRect().top < 0) {// scroll up
		scrollTo +=deets.getBoundingClientRect().top;
	}

	// else scroll down if off-sccreen
	else {
		const bottom = deets.getBoundingClientRect().top + deets.scrollHeight;

		if ( bottom > window.innerHeight + eps ) { // bottom is below screen
			if ( sizeOpen < document.documentElement.clientHeight ) {
				// it will fit entirely on screen, align bottoms
				scrollTo +=bottom - window.innerHeight // negative number
			}
			else { // will not fit on screen, scroll down to align to the top of deets
				scrollTo +=deets.getBoundingClientRect().top;
			}
		}
	}

	// Force reflow to apply maxHeight=0 immediately FIXME: ? 
	void deets.offsetHeight;

	animateHeightscroll(deets, 
			sizeClosed, sizeOpen, 
			window.scrollY, scrollTo,
			deltaT_down,  () => {
			deets.style.maxHeight = '';
			});

	deetsData.sizeClosed = sizeClosed;
}

function closeDeets(deets, deetsData) {
	let scrollTo;
	if (deets.preCloseScrollY + scrollEps < window.scrollY < deets.preCloseScrollY + scrollEps)
		scrollTo = deets.preOpenScrollY;
	else
		scrollTo = window.scrollY;

	deets.style.maxHeight = deets.scrollHeight + 'px';

	// Force reflow to apply initial height immediately
	void deets.offsetHeight;

	animateHeightscroll(deets, 
			deets.scrollHeight, deetsData.sizeClosed, 
			window.scrollY, scrollTo,
			deltaT_up,  () => {
			deets.style.maxHeight = '';
			deets.open = false;
			});
}
function openOrClose(box, deets, deetsData) {
	console.log("openOrClose deetsData.isAnimating 0", deetsData.isAnimating);
	if (! deetsData.isAnimating) {
		deetsData.isAnimating = true;
		console.log("openOrClose deetsData.isAnimating 1", deetsData.isAnimating);
		if (! deets.open) { // since it's not closed yet, it's open!
    			box.classList.remove('has-unopened-details');
			setTimeout(() => openDeets(deets, deetsData), 0); // after expand animation/layout
		}
		else {
    			box.classList.add('has-unopened-details');
			setTimeout(() => closeDeets(deets, deetsData), 0); // after expand animation/layout
		}
	}
	deetsData.isAnimating = false;
}
