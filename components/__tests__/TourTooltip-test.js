import * as React from 'react'
import renderer from 'react-test-renderer'
import TourTooltip from '../TourTooltip'
import useTour from '../../hooks/useTour'
it('TourTooltip renders correctly', () => {
	const tree = renderer
		.create(
			<TourTooltip
				isFirstStep={false}
				isLastStep={true}
				handleNext={() => {}}
				handlePrev={() => {}}
				handleStop={() => {}}
				currentStep={{ text: 'test', order: 1, target: '', wrapper: '' }}
				labels={{ skip: 'skip', previous: 'previous', next: 'next', finish: 'finish' }}
			/>
		)
		.toJSON()
	expect(tree).toMatchSnapshot()
})
