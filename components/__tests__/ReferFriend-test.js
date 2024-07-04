import * as React from 'react'
import renderer from 'react-test-renderer'
import ReferFriend from '../ReferFriend'

it('render when passing the props', () => {
	const tree = renderer
		.create(
			<ReferFriend onInviteContact={() => console.log('onInviteContact')} onShare={() => console.log('onShare')} />
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
