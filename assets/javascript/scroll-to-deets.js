// Helper to check if an element is fully visible vertically in viewport
const dt_down = 1000;
const dt_up = 500;

function isInView(details) {
	const rect = details.getBoundingClientRect();
	return (
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
	       );
}
function smoothScrollBy(scrollAmount, duration) {
	const startY = window.scrollY;
	const scrollRate = scrollAmount / duration;

	const startTime = performance.now();
	let dt=0;

	function animate(now) {
		dt = now - startTime; 
		if (dt >= duration) {
			window.scrollTo(0, startY + scrollAmount);
		} else {
			let amountScrolled = scrollRate * dt;
			window.scrollTo(0, startY + amountScrolled);
		}
		if (dt < duration) {
			requestAnimationFrame(animate);
		}
	}
	requestAnimationFrame(animate);
}

function animateMaxHeight(element, from, to, duration, callback, padFrom, padTo) {
	const startTime = performance.now();

	const scrollTotal = to - from;
	const padTotal = padTo - padFrom;

	const scrollRate = scrollTotal / duration;
	const padRate = padTotal / duration;

	function animate(now) {
		let elapsed = now - startTime;
		elapsed = elapsed > duration && duration || elapsed; 
		const curScroll = scrollRate * elapsed;
		
		element.style.maxHeight = (from + curScroll) + "px";

		const curPad = padRate * elapsed;
		element.style.paddingTop = element.style.paddingBottom = padFrom + curPad + "px";

		if (Math.abs(elapsed - duration) > 1e-6) {
			requestAnimationFrame(animate);
		} else {
			element.style.maxHeight = '';
			element.style.paddingTop = element.style.paddingBottom = '';

			if (callback) callback();
		}
	}
	requestAnimationFrame(animate);
}

function openDeets(details) {

	// open temporarily to get dims: FIXME make invisible?
	const sizeClosed = details.getBoundingClientRect().height;
	details.open = true;
	const sizeOpen = details.getBoundingClientRect().height;
	const padAmount = ( sizeOpen - sizeClosed ) / 2;
	// get scrollAmount
	let scrollAmount = 0;
	if (details.getBoundingClientRect().top < 0) { // top is above screen
		scrollAmount = details.getBoundingClientRect().top;
	}

	else if ( details.getBoundingClientRect().bottom > window.innerHeight ) { // bottom is below screen
		if (details.getBoundingClientRect().height < document.documentElement.clientHeight) {
			// it will fit entirely on screen, align bottoms
			scrollAmount = details.getBoundingClientRect().bottom - window.innerHeight // negative number
		} else {
			// will not fit on screen, align to the top of details
			scrollAmount = details.getBoundingClientRect().top;
		}
	}
	if (scrollAmount != 0) {
		smoothScrollBy(scrollAmount, dt_up);
	}

	// Set to 0 then transition to scrollHeight
	details.style.overflow = 'hidden';
	details.style.maxHeight = '0px';

	// Force reflow to apply maxHeight=0 immediately
	void details.offsetHeight;

	const targetHeight = details.scrollHeight;

	animateMaxHeight(details, 0, targetHeight, dt_down, 0, () => {
			details.style.maxHeight = '';
			details.style.overflow = '';
			});
} 

function closeDeets(details) {
	const startHeight = details.scrollHeight;
	details.style.overflow = 'hidden';
	details.style.maxHeight = startHeight + 'px';

	// Force reflow to apply initial height immediately
	void details.offsetHeight;

	animateMaxHeight(details, startHeight, 0, dt_up, () => {
			details.open = false;
			details.style.maxHeight = '';
			details.style.overflow = '';
			});
}

// Scrolls the element into view vertically so its entire height fits in viewport if possible                                                                                                                                              
document.addEventListener('DOMContentLoaded', () => {                                                                                                                                                                                      
		document.querySelectorAll('details.main-deets').forEach(details => {
				console.log(details);
				details.isAnimating = false;
				details.addEventListener("click", (e) => {
						e.preventDefault();

						if (! details.isAnimating) {
						details.isAnimating = true;

						if (! details.open) { // since it's not closed yet, it's open!

						setTimeout(() => openDeets(details), 0); // after expand animation/layout
						}

						else {
						setTimeout(() => closeDeets(details), 0); // after expand animation/layout
						}
						}
						details.isAnimating = false;
						});
				});
});
