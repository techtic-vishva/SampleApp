export type Role = {
	value: string
	label: string
}

export default [
	{
		value: 'mom',
		label: 'Mom'
	},
	{
		value: 'dad',
		label: 'Dad'
	},
	{
		value: 'child',
		label: 'Son / Daughter'
	},
	{
		value: 'grandparent',
		label: 'Grandparent'
	},
	{
		value: 'partner',
		label: 'Partner / Spouse'
	},
	{
		value: 'other',
		label: 'Other'
	}
] as Role[]
