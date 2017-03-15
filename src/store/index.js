
import Vuex from 'vuex'

import app from './modules/app'
import sidebar from './modules/sidebar'
import booksContent from './modules/books_content'
import authorList from './modules/author_list'
import bookList from './modules/book_list'
import book from './modules/book'
import top from './modules/top'

export default new Vuex.Store({
	modules: {
		app,
		top,
		sidebar,
		booksContent,
		bookList,
		authorList,
		book,
	}
})