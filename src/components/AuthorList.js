
import { mapActions } from 'vuex'

export default {
    template: `<div class="book-list">
                    <span :title="authorName" @click="openAuthorList( { authorName: authorName, event: $event }) ">{{ authorName }}</span>
               </div>`,
    props: ['author-id', 'author-name'],
    methods: {
        ...mapActions({
            openAuthorList: 'openAuthorList'
        })
    }
}