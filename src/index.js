
const userData = require('electron').remote.app.getPath('userData')

import Datastore from 'nedb'
let bookListDb = new Datastore({ filename: `${userData}/dbs/book_lists.db`, autoload: true })
let authorListDb = new Datastore({ filename: `${userData}/dbs/author_list.db`, autoload: true })

import store from './store'
import App from './components/App'

new Vue({
    el: 'app',
    store: store,
    components: {
        'app': App
    }
})