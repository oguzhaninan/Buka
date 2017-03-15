
import { mapGetters } from 'vuex'
import request from 'request'
import { shell } from 'electron'

import Top from './Top'
import Sidebar from './Sidebar'
import BooksContent from './BooksContent'
import Book from './Book'
import BookList from './BookList'
import AuthorList from './AuthorList'
import BookViewer from './BookViewer'

export default {
	template: `<div :class="['main', { 'update' : update_check }]">
								<top></top>
								<sidebar v-show="toggleBooksContent"></sidebar>
								<books-content v-show="toggleBooksContent"></books-content>
								<book-viewer v-show="! toggleBooksContent" :src="openedBookPath"></book-viewer>
								<div id="book-loader" v-show="isLoading">
									<div class="spinner">
										<div class="rect1"></div>
										<div class="rect2"></div>
										<div class="rect3"></div>
										<div class="rect4"></div>
										<div class="rect5"></div>
									</div>
								</div>
								<div class="update_check" v-show="update_check">
									<span>There are updates currently available.</span>
									<button @click="downloadUpdate"> Download Update </button>
								</div>
						</div>`,
	computed: {
		...mapGetters({
			toggleBooksContent: 'toggleBooksContent',
			openedBookPath: 'openedBookPath',
			isLoading: 'isLoading'
		})
	},
	data() {
		return { update_check: false }
	},
	methods: {
		// open the link on browser
		downloadUpdate() {
			let homepage = require('../../package.json').homepage
			shell.openExternal(homepage + '/releases/latest')
		}
	},
	created() {
		localStorage.clear()

		try {
			request.get('https://api.github.com/repos/oguzhaninan/Buka/releases/latest',
				{ headers: { 'Content-Type': 'application/json', 'User-Agent': 'request' } },
				(err, res, body) => {
					let jsonBody = JSON.parse(body)

					let currentVersion = require('../../package.json').version.toString()
					if (jsonBody.tag_name) {
						let releaseVersion = jsonBody.tag_name.substr(1).toString()
						this.update_check = (currentVersion != releaseVersion)
					}
				})
		} catch (error) {
			console.log(error)
		}
	},
	components: {
		'top': Top,
		'sidebar': Sidebar,
		'books-content': BooksContent,
		'book-viewer': BookViewer
	}
}