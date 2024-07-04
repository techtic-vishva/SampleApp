import * as React from 'react'
import renderer from 'react-test-renderer'

import { MonoText, HeaderText, MainText } from '../StyledText'

it(`MonoText renders correctly`, () => {
	const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON()

	expect(tree).toMatchSnapshot()
})

it(`HeaderText renders correctly`, () => {
	const tree = renderer.create(<HeaderText>Snapshot test!</HeaderText>).toJSON()

	expect(tree).toMatchSnapshot()
})

it(`MainText renders correctly`, () => {
	const tree = renderer.create(<MainText>Snapshot test!</MainText>).toJSON()

	expect(tree).toMatchSnapshot()
})
