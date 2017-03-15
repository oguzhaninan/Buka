
import { mapState } from 'vuex'
import Book from './Book'

export default {
	template: `<div class="books-content">
								<ul>
									<li v-for="book in booksContent">
										<book :book-id="book.bookId" :book-name="book.bookName" :book-author="book.bookAuthor"
												:book-path="book.bookPath" :book-image-path="book.bookImagePath"
												:book-page-count="book.bookPageCount" :list-id="book.listId"></book>
										</li>
								</ul>
							</div>`,
	data() {
	},
	computed: mapState({
		booksContent: state => state.booksContent.booksContent
	}),
	components: {
		'book': Book
	}
}