
const state = {
	booksContent: []
}

const mutations = {
	updateBookContents(state, listId) {
		if (listId)
			bookListDb.findOne({ _id: listId }, (err, doc) => {
				state.booksContent = doc.books
			})
		else
			state.booksContent = []
	}
}

export default {
	state,
	mutations
}