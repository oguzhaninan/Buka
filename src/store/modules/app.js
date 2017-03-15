
const state = {
	toggleBooksContent: true,
	openedBookPath: '',
	isLoading: false
}

const getters = {
	toggleBooksContent: state => state.toggleBooksContent,
	openedBookPath: state => state.openedBookPath,
	isLoading: state => state.isLoading
}

const mutations = {
	isLoading(state) {
		state.isLoading = !state.isLoading
	}
}

export default {
	state,
	getters,
	mutations
}