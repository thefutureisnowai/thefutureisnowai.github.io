
function matchMainBoxWidth() {
		const header = document.querySelector('.content > .header-grad');
		const mains = document.querySelectorAll('.content > .main-content-box');
		if(header){
			const w = header.offsetWidth;
			mains.forEach(main => main.style.maxWidth = w + "px");
		}
}
window.addEventListener('resize', matchMainBoxWidth);
window.addEventListener('DOMContentLoaded', matchMainBoxWidth);

// Optional: observe size changes directly
const header = document.querySelector('.content > .header-grad');
if(header){
	new ResizeObserver(matchMainBoxWidth).observe(header);
}
