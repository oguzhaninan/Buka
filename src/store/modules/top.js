
const state = {
	showTranslate: false
}

const getters = {
	showTranslate: state => state.showTranslate
}

const actions = {
	updateBrightness(context, event) {
		try {
			document.getElementById('book-viewer-iframe').contentWindow
				.document.getElementById('viewerContainer').style.opacity = event.target.value
		}
		catch (err) { }
	},
	updateShowTranslate({ state }) {
		state.showTranslate = ! state.showTranslate
	},
	backToMain({ rootState }) {
		rootState.app.toggleBooksContent = true
		rootState.app.openedBookPath = ''
	}
}

export default {
	state,
	actions,
	getters
}