
import { mapActions } from 'vuex'

export default {
    template: `<div class="book" draggable="true" @dragend="dragEnd" @dragstart="dragStart(bookId, listId)">
                    <img :src="bookImagePath" :title="bookName" @click="openBook(bookPath)" style="object-fit:contain;" />
                    <button title="Remove Book" class="remove-book-btn dred" 
                        @click="removeBook({bookId: bookId,
                                            bookAuthor: bookAuthor,
                                            bookImagePath: bookImagePath,
                                            listId:listId})" />
                    <span class="title" :title="bookName" @click="openBook(bookPath)">{{ bookName }}</span>
                    <span class="author" :title="bookAuthor">{{ bookAuthor }}</span>
               </div>`,
    props: ['book-id', 'book-name', 'book-author', 'book-page-count', 'book-image-path', 'book-path', 'list-id'],
    methods: {
        ...mapActions({
            openBook: 'openBook',
            removeBook: 'removeBook'
        }),
        dragStart(bookId, listId) {
            localStorage.setItem('dragBookId', bookId)
            localStorage.setItem('dragListId', listId)

            document.querySelectorAll('[droppable]').forEach(e => e.classList.add('droppable'))
        },
        dragEnd() {
            document.querySelectorAll('[droppable]').forEach(e => {
                e.classList.remove('droppable')
                e.classList.remove('enter')
            })
        }        
    }
}