import * as React from 'react'
import renderer from 'react-test-renderer'

import AroModal from '../AroModal'

it('render when cancel button disable properly', () => {
	const tree = renderer
		.create(
			<AroModal
				tile="Aro Model"
				cancelBtnText="cancel"
				actionBtnTxt="Delete"
				onActionPress={() => {
					console.log('Action button pressed')
				}}
				isCancleBtnDisable={true}
				onCancelPress={() => {}}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})

it('render when cancel button show properly', () => {
	const tree = renderer
		.create(
			<AroModal
				tile="Aro Model"
				cancelBtnText="cancel"
				actionBtnTxt="nmhjkhkkDelete"
				onActionPress={() => {
					console.log('Action button pressed')
				}}
				isCancleBtnDisable={false}
				onCancelPress={() => {
					console.log('Cancel button pressed')
				}}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
