import * as React from 'react'
import renderer from 'react-test-renderer'
import InterstitialComponent from '../InterstitialComponent'
jest.useFakeTimers()
it('render when passing the props', async () => {
	const tree = renderer
		.create(
			<InterstitialComponent
				imageURLs={[
					'https://img.freepik.com/free-photo/medium-shot-happy-family-nature_23-2148996570.jpg?w=2000',
					'https://media.gettyimages.com/id/1349249677/photo/family-fun.jpg?s=612x612&w=gi&k=20&c=oiRza0bcMwvrnMvwfKKIsYHEZdaYuv09DPDAWcrFaNA=',
					'https://thumbs.dreamstime.com/b/happy-family-mother-father-children-son-daughter-sunset-nature-150794881.jpg'
				]}
				topLabel={`Let's setup your household.How will you use Aro?`}
				bottomLabel={`For each statement, select "Agree" or "Disagree".`}
				primaryButtonLabel="With My Family"
				secondaryButtonLabel="Just me for now"
				onPrimaryButton={() => {}}
				onSecondaryButton={() => {}}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
