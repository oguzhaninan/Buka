
import * as fs from 'fs'
import { shell } from 'electron'

const actions = {
	/**
	 * The book selected from the book content opens.
	 * @param {string} bookPath
	 */
	openBook({ rootState }, bookPath) {
		let Datastore = require('nedb')
		let db = new Datastore({ filename: 'locations.json', autoload: true })

		db.find({ path: bookPath }, function (err, docs) {
			let currentPage = 1

			if (docs.length === 0) {
				// Page was not found. Initialize book in db to page 1
				db.insert({ path: bookPath, page: 1 })
			} else if (err) {
				// Error
				console.log(err)
			} else {
				// Page number was found. Set initial page.
				currentPage = docs[0].page
			}

			rootState.app.openedBookPath = '../pdfviewer/web/viewer.html' + '?file=' + bookPath
			rootState.app.toggleBooksContent = false

			// The address of the external links clicked in the book is given to the input named <externalLink>.		
			try {
				document.getElementById('book-viewer-iframe').onload = () => {
					let viewerDocument = document.getElementById('book-viewer-iframe').contentDocument
					
					let externalLink = viewerDocument.getElementById('externalLink')

					// Where the input named <externalLink> is listened to and opened on the browser when the value changes.		
					if (externalLink) {
						externalLink.onchange = () => shell.openExternal(externalLink.value)
					}

					let app = viewerDocument.PDFViewerApplication

					if (app) {
						const updatePageIfNecessary = () => {
							if (app.page != currentPage) {
								currentPage = app.page
								db.update({ path: bookPath }, { path: bookPath, page: currentPage })
							}
						}
	
						app.page = currentPage
						setInterval(updatePageIfNecessary, 100)
					}
				}
			}
			catch (err) { }
		})
	},
	/**
	 * The book selected from the book content removes.
	 * @param {Object} args
	 * args = { bookId, bookAuthor, bookImagePath, listId }
	 */
	removeBook({ commit }, args) {
		// remove the book image.
		fs.unlinkSync(args.bookImagePath)

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