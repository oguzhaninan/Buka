
const actions = {
	/**
	 * Show the books of the selected author.
	 * @param {Object} args
	 * args = { authorName, event }
	 */
	openAuthorList({ rootState, commit }, args) {
		let books = []
		bookListDb.find({ 'books.bookAuthor': args.authorName }, (err, docs) => {
			docs.forEach((list) => {
				list.books.forEach((book) => {
					if (books.every(b => b.bookPath != book.bookPath) && book.bookAuthor == args.authorName)
						books.push(book)
				})
			})
			rootState.booksContent.booksContent = books
		})
		commit('activeList', args.event)
	}
}

export default {
	actions
}