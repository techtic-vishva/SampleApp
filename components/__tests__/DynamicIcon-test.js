import * as React from 'react'
import renderer from 'react-test-renderer'
import DynamicIcon from '../DynamicIcon'

it('render when passing the props', () => {
	const tree = renderer
		.create(<DynamicIcon name={'dots-three-horizontal'} type="entypo" color={'#efae35'} size={20} />)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
