
import * as fs from 'fs'

export default function saveImage(data, imagePath) {
	return new Promise(resolve => {

		PDFJS.disableWorker = true
		let CANVAS = document.createElement('canvas'),
			CTX = CANVAS.getContext('2d')

		PDFJS.getDocument(data).then( pdfDoc => {

			pdfDoc.getPage(1).then( page => {

				let viewport = page.getViewport(300 / page.getViewport(1).width)

				CANVAS.width = 300
				CANVAS.height = viewport.height

				let renderContext = {
					canvasContext: CTX,
					viewport: viewport
				}

				page.render(renderContext).then(() => {
					let base64Data = CANVAS.toDataURL('image/jpeg', 1).replace(/^data:image\/jpeg;base64,/, '')
					fs.writeFileSync(imagePath, base64Data, 'base64')
					CANVAS.remove()
					pdfDoc.getMetadata().then( meta =>
						resolve({
							meta: meta,
							pageCount: pdfDoc.numPages || pdfDoc.pdfInfo.numPages || 0
					}))
				})
			})
		})
	})
}