import { browser } from '$app/env';
import { writable, readable, derived } from 'svelte/store';

export const data = writable([]);

export const isTouchDevice = readable(false, (set) => {
	return set(
		browser
			? 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
			: false
	);
});

// a lazy load store that, once the window is available, kicks up an IntersectionObserver instance and watches inputted images, video and iframes. Use in coordination with Image.svelte.
export const lazyloader = writable(null, (set) => {
	// lazyload callback function that handles images iframes and videos, uses common data-src pattern
	const lazyLoadCb = (entries, observer) => {
		entries.forEach((entry) => {
			if (entry.target.tagName === 'IMG') {
				if (entry.isIntersecting && entry.target.src !== entry.target.dataset.src) {
					// TODO: add srcset option here
					entry.target.src = entry.target.dataset.src;
					observer.unobserve(entry.target);
				}
			} else if (entry.target.tagName === 'VIDEO') {
				if (entry.isIntersecting && entry.target.poster !== entry.target.dataset.poster) {
					const children = [...entry.target.children];
					entry.target.poster = entry.target.dataset.poster;
					children.forEach((child) => {
						child.src = child.dataset.src;
					});
					entry.target.load();
					observer.unobserve(entry.target);
				}
			} else if (entry.target.tagName === 'IFRAME') {
				if (entry.isIntersecting && entry.target.src !== entry.target.dataset.src) {
					entry.target.src = entry.target.dataset.src;
					observer.unobserve(entry.target);
				}
			}
		});
	};

	// set IntersectionObserver once window is available
	if (typeof window !== 'undefined')
		set(new IntersectionObserver(lazyLoadCb, { rootMargin: '0px 0px 0px 0px' }));

	return () => set(null);
});