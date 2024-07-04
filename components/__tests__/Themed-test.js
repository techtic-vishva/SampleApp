import * as React from 'react'
import renderer from 'react-test-renderer'

import { useThemeColor, Text, View, KeyboardAvoidingView } from '../Themed'

it(`useThemeColor renders correctly`, () => {
	const tree = renderer.create(<useThemeColor />).toJSON()

	expect(tree).toMatchSnapshot()
})

it(`Text renders correctly`, () => {
	const tree = renderer.create(<Text>Snapshot test!</Text>).toJSON()

	expect(tree).toMatchSnapshot()
})

it(`View renders correctly`, () => {
	const tree = renderer.create(<View />).toJSON()

	expect(tree).toMatchSnapshot()
})

it(`KeyboardAvoidingView renders correctly`, () => {
	const tree = renderer.create(<KeyboardAvoidingView />).toJSON()

	expect(tree).toMatchSnapshot()
})
