import { useNavigation } from '@react-navigation/native'
import * as React from 'react'
import renderer from 'react-test-renderer'
import ContentList from '../ContentList'

jest.mock('@react-navigation/native', () => ({
	useNavigation: jest.fn()
}))

it('render when passing the props', () => {
	useNavigation.mockReturnValue({})
	const tree = renderer.create(<ContentList layout="vertical" contents={[]}></ContentList>).toJSON()
	expect(tree).toMatchSnapshot()
})

it('render when layout is horizontal', () => {
	useNavigation.mockReturnValue({})
	const tree = renderer.create(<ContentList layout="horizontal" contents={[]}></ContentList>).toJSON()
	expect(tree).toMatchSnapshot()
})

it('render when layout is featured', () => {
	useNavigation.mockReturnValue({})
	const tree = renderer.create(<ContentList layout="featured" contents={[]}></ContentList>).toJSON()
	expect(tree).toMatchSnapshot()
})
