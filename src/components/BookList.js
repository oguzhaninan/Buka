
import { mapActions } from 'vuex'

export default {
    template: `<div class="book-list" @drop="drop(listId)" @dragover.prevent @dragenter="dragEnter" droppable="true">
                    <span :title="listName" @click="openBookList({ listId: listId,
                                                                   event: $event })">{{ listName }}</span>
                    <label :for="listId" title="Add New Book" class="add-list-book"></label>
                    <button title="Remove List" @click="remove({ listId: listId,
                                                                 listName: listName })" class="remove-list-btn"></button>
                    <input type="file" :id="listId" accept="application/pdf" @change="addListBook({ listId: listId,
                                                                                                     event: $event
                                                                                                    })" maxlength="5" hidden multiple/>
                </div>`,
    props: ['list-name', 'list-id', 'book-paths'],
    methods: {
        ...mapActions({
            openBookList: 'openBookList',
            remove: 'remove',
            addListBook: 'addListBook',
            drop: 'drop'
        }),
        dragEnter(e) {
            e.preventDefault()
            document.querySelectorAll('[droppable]').forEach(e => e.classList.remove('enter'))
            let bookList = e.path[1]
            if (bookList.classList.contains('droppable')) {
                bookList.classList.add('enter')
            }
        }
    }
}