
import * as fs from 'fs'
import alertify from 'alertify.js'

import saveImage from '../../utils/pdf_utils'

const mutations = {
	activeList(state, event) {
		// deactivate the all active lists.
		document.querySelectorAll('.book-list').forEach(e => e.classList.remove('active'))
		// active the selected list.
		if (event) event.path[1].classList.add('active')
	}
}

const actions = {
	/** Dragged book save 
	 * @param {string} listId
	 */
	drop({ commit }, listId) {
		let dragBookId = localStorage.getItem('dragBookId')
		let dragListId = localStorage.getItem('dragListId')

		if (dragBookId && dragListId) {
			bookListDb.findOne({ _id: dragListId }, (err, doc) => {
				let dragBook = doc.books.filter(b => b.bookId == dragBookId)[0]
				dragBook.listId = listId
				if (dragBook)
					// the dragged book own list removed.
					bookListDb.update({ _id: dragListId }, { $pull: { books: { bookId: dragBookId } } }, err => {
						// the book was saved to the new list.
						bookListDb.update({ _id: listId }, { $push: { books: dragBook } }, err => {
							commit('updateBookContents', dragListId)
						})
					})
			})
		}
	},
	/**
	 * @param {Object} args
	 * args = { event, listId }
	 */
	addListBook({ rootState, commit }, args) {
		// Maximum 20 files
		let selectedFiles = args.event.target.files		
		if(selectedFiles.length > 0) commit('isLoading')

		if(selectedFiles.length > 20) 
			selectedFiles = Array.from(selectedFiles).slice(0, 20)
		let filePaths = Object.keys(selectedFiles).map(f => selectedFiles[f].path)

		if (!fs.existsSync(`${userData}/book-images`))
			fs.mkdirSync(`${userData}/book-images`)

		let books = [], tempAuthors = new Set(), authors = new Set()

		new Promise(resolve => {
			authorListDb.find({}, (e, docs) => resolve(docs.map(a => a.authorName)))
		}).then(tempAuthors => {
			new Promise(resolve => {
				filePaths.forEach(bookPath => {
					let data = fs.readFileSync(bookPath)

					// generate bookId
					let bookId = (args.listId + '_' + Math.random().toString(36).substr(2, 9))
					let bookImagePath = `${userData}/book-images/${bookId}.jpeg`

					// props = { meta, pageCount }
					saveImage(data, bookImagePath).then( props => {
						let metadata = props.meta.metadata != null ? props.meta.metadata.metadata : {}
						let info = props.meta.info != null ? props.meta.info : {}

						let bookName = (metadata['dc:title'] != '()' ? metadata['dc:title'] : '')
							|| bookPath.match(/.*[\/\\](.+?)\./).pop()
							|| 'Untitled'
						let bookAuthor = info.Author
							|| metadata['dc:author']
							|| 'Unknown Author'
						let bookPageCount = props.pageCount

						authors.add(bookAuthor)

						books.push({
							bookId: bookId,
							bookImagePath: bookImagePath,
							bookPath: bookPath,
							bookName: bookName,
							bookAuthor: bookAuthor,
							bookPageCount: bookPageCount,
							listId: args.listId
						})

						if ( books.length == selectedFiles.length ) resolve(books)
					})
				})
			}).then( books => {
				bookListDb.update({ _id: args.listId }, { $push: { books: { $each: books } } }, (err, num) => {
					let _tempAuthors = Array.from(tempAuthors)
					let _authors = Array.from(authors).filter(e => _tempAuthors.indexOf(e) === -1).map(e => ({ authorName: e }))

					authorListDb.insert(_authors, err => commit('updateAuthorsList'))
					commit('updateBookContents', args.listId)
					commit('isLoading')
				})
			})
		})
	},
	/**
	 * @param {Object} args 
	 * args = { listId, event }
	 */
	openBookList({ commit }, args) {
		commit('updateBookContents', args.listId)
		commit('activeList', args.event)
	},
	remove({ commit }, args) {
		alertify.okBtn('Yes').cancelBtn('No')
			.confirm('Do you delete the [' + args.listName + '] list ?').then(value => {
				value.event.preventDefault()

				if (value.buttonClicked == 'ok') {
					bookListDb.findOne({ _id: args.listId }, (err, selectedList) => {
						selectedList.books.forEach(book => {
							// remove book image
							fs.unlinkSync(book.bookImagePath)

							// does the book author have another book? 
							// if there is no other book, the author is deleted.
							let bookCount = 0
							bookListDb.find({ _id: { $ne: args.listId } }, (err, lists) => {
								lists.forEach(list => {
									list.books.forEach(b => {
										if (b.bookAuthor == book.bookAuthor) bookCount++
									})
								})

								if (bookCount == 0 || lists.length == 0) {
									authorListDb.remove({ authorName: book.bookAuthor })
									commit('updateAuthorsList')
								}
							})
						})

						// the selected list is deleted
						bookListDb.remove({ _id: args.listId }, err => {
							alertify.delay(3000).success(args.listName + ' list deleted.')
							// book lists and book contents are updated.
							commit('updateBookLists')
							commit('updateBookContents')
						})
					})
				}
			})
	}
}

export default {
	actions,
	mutations
}