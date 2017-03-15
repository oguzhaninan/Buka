
const state = {
	newListName: '',
	newListInput: false,
	bookLists: [],
	authorsList: []
}

const getters = {
	bookLists: state => state.bookLists,
	authorsList: state => state.authorsList,
	newListInput: state => state.newListInput,
	newListName: state => state.newListName
}

const mutations = {
	updateBookLists(state) {
		bookListDb.find({}).sort({ listName: 1 }).exec((err, docs) => {
			state.bookLists = docs
		})
	},
	updateAuthorsList(state) {
		authorListDb.find({}).sort({ authorName: 1 }).exec((err, docs) => {
			state.authorsList = docs
		})
	},
	updateNewListName(state, val) {
		state.newListName = val
	},
}

const actions = {
	addNewList({ state, commit }) {
		if (state.newListInput) {
			let newListName = state.newListName.trim()
			if (newListName) {
				bookListDb.insert({
					listName: newListName,
					books: []
				}, () => commit('updateBookLists'))
			}
			state.newListName = ''
			state.newListInput = false
		}
		else {
			state.newListInput = true
		}
	},
	bookSearching({ rootState, commit }, event) {
		commit('activeList')

		let results = []
		let query = event.target.value.toLowerCase().trim()

		if (query) {
			bookListDb.find({}, (er, docs) => {
				docs.forEach((list) => {
					list.books.forEach((book) => {
						if (book.bookName.toLowerCase().indexOf(query) !== -1)
							results.push(book)
						else if (book.bookAuthor.toLowerCase().indexOf(query) !== -1)
							results.push(book)
					})
				})
			})
		}
		rootState.booksContent.booksContent = results
	}
}

export default {
	state,
	mutations,
	getters,
	actions
}