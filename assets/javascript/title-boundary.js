function blockForSeconds(seconds) {
    var start = Date.now();
    while (Date.now() - start < seconds * 1000) {
        // Busy waiting
    }
}
class DivWrapper {
	constructor(div, screen) {
		this.div = div, screen;
		this.screen = screen
		this.isText = div.classList.contains('title');
		this.words = Array.from(this.div.querySelectorAll('.title-word'));
		this.string = this.toString();
		// const screenRect = this.title.getBoundingClientRect();
	}
	toString() {
		if (this.div.classList.contains('title')) {
			if (this.words.length > 0) {
				// Case 1: <div class="title"><div class="title-word">...</div>...</div>
				return this.words.map(w => w.textContent).join(' ');
			} else {
				// Case 2: <div class="title">Bellingham</div>
				return this.div.textContent.trim();
			}
		} else if (this.div.classList.contains('main-logo')) {
			// Case 3: <div class="main-logo"><img ...></div>
			return "🛡️";
		}
		return "";
	}
	// Resize a div: set height, width, and font-size (all in pixels unless otherwise stated)
	// Assumes elem is a DOM element
	resizeDiv(elem, height, width) {
		if (height !== null && height !== undefined) this.div.style.height = `${height}px`;
		if (width !== null && width !== undefined) this.div.style.width = `${width}px`;
	}
	resizeFont(elem, height, width, fontSize) {
		if (fontSize !== null && fontSize !== undefined) this.div.style.fontSize = `${fontSize}px`;
	}
	// Move a div by setting its position inside its .title-screen container using fractional coordinates.
	// Requires .title-screen to be relative or absolute positioned ancestor. This function sets absolute positioning.
	move(y, x) {
		console.log(this.toString(), "moving from", this.r_left, this.r_top, "to ", y, x);
		const compStyle = window.getComputedStyle(this.screen);
		if (compStyle.position === "static") {
			this.screen.style.position = "relative";
		}
		this.div.style.position = "absolute";

		// Compute pixel top/left using fractions of this.screen dimensions
		const parentRect = this.screen.getBoundingClientRect();
		// Center the element at the given fraction:
		const elemRect = this.div.getBoundingClientRect();
		this.div.style.left = `${x}px`;
		this.div.style.top = `${y}px`;
	}
	move01(y, x) {
		this.move(y * this.screen.clientHeight, x * this.screen.clientWidth);
	}
	boundsPenalty() {
		this.getDims();
		// Test if "content box" is outside viewport (ignores margins/padding/gaps)
		const vw = window.innerWidth, vh = window.innerHeight;
		const penalties = { 	left:   this.r_left   > 0  ? 0 : this.r_left, // negative penalty for negative left
			right:  this.r_right  < vw ? 0 : this.r_right - vw, // positive penalty for large right
			top:    this.r_top    > 0  ? 0 : this.r_top, // negative penalty for negative top
			bottom: this.r_bottom < vh ? 0 : this.r_bottom - vh	} // positive penalty for large bottom
		return penalties;
	}
	isOutOfBounds() {
		const rect = this.div.getBoundingClientRect();
		// Test if "content box" is outside viewport (ignores margins/padding/gaps)
		const vw = window.innerWidth, vh = window.innerHeight;
		if (rect.left	< 0	||
		    rect.right	> vw 	||
		    rect.top	< 0	||
		    rect.bottom	> vh	) return true;

		return false;
	}
}
class ScreenWrapper {
	constructor(div) {
		// Find all visible elements that comprise the actual content:
		this.divs = [];
		const screen = document.querySelector('.title-screen');
		console.log("screen", screen);
		let contentElems = [
			...screen.querySelectorAll('.title'),
			...screen.querySelectorAll('.main-logo')
		].filter(el => el.offsetParent !== null);

		if (contentElems.length === 0) return;

		contentElems.forEach(el => {
				const div = new DivWrapper(el, screen);
				console.log(div.toString());
				if (div.toString().includes("S")) this.scs = div;
				else if (div.toString().includes("🛡️")) this.logo = div;
				else if (div.toString().includes("Bellingham")) this.bham = div;
				this.divs.push(div); 
				});

		this.screen = screen;
		this.isFixed = false;
		this.keepGoing = true;
		}

	fixedTitleScreen() {
	    if (this.isFixed) return;

	    const rect = this.screen.getBoundingClientRect();

	    this.screen.style.width = rect.width + 'px';
	    this.screen.style.height = rect.height + 'px';
	    this.screen.style.position = 'relative'; // Ensure rel. pos for abs children

	    // Optionally kill flexbox behavior:
	    this.screen.style.display = 'block';

	    this.isFixed = true;
	}
	reset() {
		// FIXME: refresh page
		this.isFixed = false;
	}
	repositionDivs() {
		// sizees will not change so these are safe
		const screenHeight = this.screen.clientHeight; 	   const screenWidth = this.screen.clientWidth;
		const scsHeight   = this.scs.div.clientHeight; 	   const scsWidth    = this.scs.div.clientWidth;
		const bhamHeight  = this.bham.div.clientHeight;    const bhamWidth   = this.bham.div.clientWidth;
		const logoHeight  = this.logo.div.clientHeight;	   const logoWidth   = this.logo.div.clientWidth;
		const secure = this.scs.words[0]; const computer = this.scs.words[1]; const solutions = this.scs.words[2];
		const em = bhamHeight;
		// move scs to top-right corner justified to the left to calculate maximum space
		this.scs.move(0, 0);
		this.scs.div.style.justifyContent = "start"

		const numLines = 
			// if on different lines secure.top should be less than  solutions.top, and still less 
			(secure.getBoundingClientRect().top   + em / 2 < computer.getBoundingClientRect().top)  && 3 ||
			(computer.getBoundingClientRect().top + em / 2 < solutions.getBoundingClientRect().top) && 2 ||
														   1; 
														   
		const bottomOfSolutions = solutions.getBoundingClientRect().bottom - this.screen.getBoundingClientRect().top;
		const vSpaceUnderSCS    = screenHeight - bottomOfSolutions;

		if (numLines == 1) {
			// Secure Computer Solutions all on same line, center logo next then bellingham
			if (vSpaceUnderSCS > bhamHeight + logoHeight) { // there is room for all items to stack vertically
				const vGap  = (vSpaceUnderSCS - (bhamHeight + logoHeight)) / 4; // 4 posts, 3 segments
				const logoY = vGap + bottomOfSolutions + vGap;
				const bhamY = logoY + logoHeight + vGap;
				this.scs.move(  vGap , (screenWidth - scsWidth) / 2);
				this.logo.move( logoY, (screenWidth - logoWidth) / 2);
				this.bham.move( bhamY, (screenWidth - bhamWidth) / 2);
			} else { // not enough vertical space, stack logo and bham horizontally
				const vGap  = (vSpaceUnderSCS - logoHeight) / 3; // 4 posts, 3 segments
				const logoY = vGap + bottomOfSolutions + vGap;
				const bhamY = logoY + (logoHeight - bhamHeight) / 3;
				this.scs.move( vGap, (screenWidth - scsWidth) / 2);
				const hSpace = screenWidth - logoWidth - bhamWidth - em;
				const lPad   = hSpace / 2;
				this.logo.move( logoY, lPad );
				this.bham.move( bhamY, lPad + logoWidth + em );
			}
		} else if (numLines == 2) { // Secure Computer\nSolutions logo goes in bottom-right
			const vGap = (vSpaceUnderSCS - bhamHeight) / 3;
			// horizontal space limit is between scs and logo
			const hSpace = this.screen.getBoundingClientRect().right - computer.getBoundingClientRect().right;
			const hGap = hSpace / 3;
			this.scs.move(vGap, hGap);
			this.bham.move(vGap + bottomOfSolutions + vGap, hGap);
			const rightOfSolutions = solutions.getBoundingClientRect().right - this.screen.getBoundingClientRect().left;
			const topOfSolutions     = vGap + em;
			this.logo.move(topOfSolutions + em / 3, rightOfSolutions + hGap);
		} else {
			const vGap = (vSpaceUnderSCS - bhamHeight) / 3;
			// horizontal space limit is between scs and logo
			const hSpace = this.screen.getBoundingClientRect().right - computer.getBoundingClientRect().right;
			const hGap = hSpace / 3;
			this.scs.move(vGap, hGap);
			this.bham.move(vGap + bottomOfSolutions + vGap, hGap);
			const rightOfSecure = secure.getBoundingClientRect().right - this.screen.getBoundingClientRect().left;
			const topOfSecure     = vGap;
			this.logo.move(topOfSecure + em / 3, rightOfSecure + hGap);
		}
	}
	isOutOfBounds() {
		return 	this.scs.isOutOfBounds() ||
			this.logo.isOutOfBounds() ||
			this.bham.isOutOfBounds();
	}
	checkAndResposition() {
		if (this.isFixed || this.isOutOfBounds()){
			this.fixedTitleScreen();
			console.log("reposition");
			this.repositionDivs();	
		}
	}
}
const screenWrapper = new ScreenWrapper();
window.addEventListener('resize', () => screenWrapper.checkAndResposition());
window.addEventListener('load', () => screenWrapper.checkAndResposition());
