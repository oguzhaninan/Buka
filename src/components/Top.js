
import { mapState, mapGetters, mapActions } from 'vuex'
import Translate from './Translate'

export default {
    template: `<div class="top">
                    <button :class="['translate-window-btn' , { 'active-top-btn' : showTranslate} ]" title="Translate" @click="updateShowTranslate"></button>
                    <input type="range" id="brightness" @input="updateBrightness" class="fr" min="0" max="1" step="0.02" value="1" v-if="! toggleBooksContent"
                        title="Brightness" />
                    <button class="back-to-main-btn" title="Back to Main" v-show="! toggleBooksContent" @click="backToMain"></button>
                    <translate></translate>
                </div>`,
    methods: {
        ...mapActions({
            updateBrightness: 'updateBrightness',
            updateShowTranslate: 'updateShowTranslate',
            backToMain: 'backToMain'
        })
    },
    computed: {
        ...mapGetters({
            toggleBooksContent: 'toggleBooksContent',
            showTranslate: 'showTranslate'
        })
    },
    components: {
        'translate': Translate
    }
}