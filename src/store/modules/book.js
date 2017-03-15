
import * as fs from 'fs'
import { shell } from 'electron'

const actions = {
	/**
	 * The book selected from the book content opens.
	 * @param {string} bookPath
	 */
	openBook({ rootState }, bookPath) {
		rootState.app.openedBookPath = '../pdfviewer/web/viewer.html?file=' + bookPath
		rootState.app.toggleBooksContent = false

		// The address of the external links clicked in the book is given to the input named <externalLink>.		
		try {
			document.getElementById('book-viewer-iframe').onload = () => {
				let externalLink = document.getElementById('book-viewer-iframe').contentDocument.getElementById('externalLink')
				// Where the input named <externalLink> is listened to and opened on the browser when the value changes.		
				if (externalLink)
					externalLink.onchange = () => shell.openExternal(externalLink.value)
			}
		}
		catch (err) { }
	},
	/**
	 * The book selected from the book content removes.
	 * @param {Object} args
	 * args = { bookId, bookAuthor, bookImagePath, listId }
	 */
	removeBook({ commit }, args) {
		// remove the book image.
		fs.unlink(args.bookImagePath)

		let bookCount = 0
		bookListDb.find({}, (err, lists) => {
			lists.forEach(list => {
				list.books.forEach(book => {
					if (book.bookAuthor == args.bookAuthor) bookCount++
				})
			})
			// If the book author only has this book, the author is removed.
			if (bookCount == 1)
				authorListDb.remove({ authorName: args.bookAuthor })
			// the book remove from the books list.
			bookListDb.update({ _id: args.listId }, { $pull: { books: { bookId: args.bookId } } }, (err, n) => {
				// The author list and the book content are updated.
				commit('updateAuthorsList')
				commit('updateBookContents', args.listId)
			})
		})
	}
}

export default {
	actions
}