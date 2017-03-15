
export default {
	template: `<div class="book-viewer">
					<iframe id="book-viewer-iframe" :src="src" width="100%" height="100%"></iframe>
				</div>`,
	props: ['src']
}