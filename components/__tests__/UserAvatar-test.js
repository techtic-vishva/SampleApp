import * as React from 'react'
import renderer from 'react-test-renderer'

import UserAvatar from '../UserAvatar'

it('UserAvatar renders correctly', () => {
	const tree = renderer.create(<UserAvatar user={{ fullname: 'test', avatar: '' }} />).toJSON()
	expect(tree).toMatchSnapshot()
})

it('reander when passing the props', () => {
	const tree = renderer
		.create(<UserAvatar user={{ fullname: 'test', avatar: '' }} style={{}} shadeCounter={10} size={'large'} />)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
