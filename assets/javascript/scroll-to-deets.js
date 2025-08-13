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
function animateMaxHeight(element, from, to, duration, callback) {
	const startTime = performance.now();

	function animate(now) {
		const elapsed = now - startTime;
		const progress = Math.min(elapsed / duration, 1);
		element.style.maxHeight = (from + (to - from) * progress) + "px";
		if (progress < 1) {
			requestAnimationFrame(animate);
		} else if (callback) {
			callback();
		}
	}
	requestAnimationFrame(animate);
}

function openDeets(details) {
	// open temporarily to get dims: FIXME make invisible?
	details.open = true;
	// get scrollAmount
	let scrollAmount = 0;
	if ( details.getBoundingClientRect().bottom > window.innerHeight ) { // not on screen
		if (details.getBoundingClientRect().height <= document.documentElement.clientHeight) {
			// it will fit entirely on screen, align bottoms
			scrollAmount = details.getBoundingClientRect().bottom - window.innerHeight // negative number
		} else {
			// will not fit on screen, align to the top of details
			scrollAmount = details.getBoundingClientRect().top;
		}
		smoothScrollBy(scrollAmount, dt_up);
	}
	// Set to 0 then transition to scrollHeight
	details.style.overflow = 'hidden';
	details.style.maxHeight = '0px';

	// Force reflow to apply maxHeight=0 immediately
	void details.offsetHeight;

	const targetHeight = details.scrollHeight;

	animateMaxHeight(details, 0, targetHeight, dt_down, () => {
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
