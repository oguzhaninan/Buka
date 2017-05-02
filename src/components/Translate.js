import {
	mapGetters
} from 'vuex'
import gtranslate from 'node-google-translate-skidz'
import languages from '../utils/languages'

export default {
	template: `<div class="translate-form" v-show="showTranslate">
									<select v-model="sourceSelectedLang" class="fl">
										<option v-for="lang in languages" :value="lang.value"> {{lang.text}} </option>
									</select>
									<button id="switch-languages" title="Switch Languages" @click="switchLangs"></button>
									<select v-model="targetSelectedLang" class="fr">
										<option v-for="lang in languages" :value="lang.value"> {{lang.text}} </option>
									</select>
									<textarea v-model="sourceText" placeholder="Source Text" maxlength="1000" @keyup.enter="translate"></textarea>
									<span class="trans-char-count fr db"> {{ sourceText.length }} / 1000 </span>
									<textarea v-model="targetText" placeholder="Target Text">{{targetText}}</textarea>
									<button id="clear-translate-btn" class="fl" @click="clearText">Clear</button>
									<div id="trans-loader" class="fl" v-show="transLoader">
										<div class="dot1"></div>
										<div class="dot2"></div>
										<div class="dot3"></div>
										<div class="dot4"></div>
									</div>
							<button id="translate-btn" class="fr royal" @click="translate">Translate</button>`,
	data() {
		return ({
			sourceText: '',
			targetText: '',
			languages: languages,
			sourceSelectedLang: 'en',
			targetSelectedLang: 'tr',
			transLoader: false,
		})
	},
	methods: {
		translate() {
			if (this.sourceText) {
				this.transLoader = true
				try {
					gtranslate({
						text: this.sourceText,
						source: this.sourceSelectedLang,
						target: this.targetSelectedLang
					}, result => {
						if (result.translation){
							this.targetText = result.translation
							this.transLoader = false
						}
						else
							this.transLoader = false						
					})
				} catch (error) {					
						this.transLoader = false
				}				
			}
		},
		switchLangs() {
			let temp = this.sourceSelectedLang
			this.sourceSelectedLang = this.targetSelectedLang
			this.targetSelectedLang = temp
			temp = this.sourceText
			this.sourceText = this.targetText
			this.targetText = temp
		},
		clearText() {
			this.sourceText = this.targetText = ''
		}
	},
	computed: {
		...mapGetters({
			showTranslate: 'showTranslate',
		})
	}
}