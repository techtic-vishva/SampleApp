import { useIsFocused } from '@react-navigation/native'
import * as React from 'react'
import renderer from 'react-test-renderer'
import ContactsComponent from '../ContactsComponent'

jest.mock('@react-navigation/native', () => ({
	useIsFocused: jest.fn()
}))

it('render when passing the props', () => {
	useIsFocused.mockReturnValue({})
	const tree = renderer
		.create(
			<ContactsComponent
				onShare={() => {
					console.log('onShare')
				}}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
