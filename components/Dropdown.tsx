import { AntDesign } from '@expo/vector-icons'
import { FC, useRef, useState, ReactElement, useEffect } from 'react'
import { TouchableOpacity, Modal, FlatList } from 'react-native'
import { chattanoogaTapWater } from '../constants/Colors'
import { Text, View } from './Themed'
import { fill } from '../constants/Colors'

interface Props {
	label: string
	data: Array<{ label: string; value: string }>
	onSelect: (item: { label: string; value: string }) => void
	isSelected: boolean
	toggle?: number
}

export const Dropdown: FC<Props> = ({ label, data, onSelect, isSelected, toggle }) => {
	const DropdownButton = useRef()
	const [visible, setVisible] = useState(false)
	const [selected, setSelected] = useState<{ label: string; value: string }>()
	const [dropdownTop, setDropdownTop] = useState(0)

	const toggleDropdown = (): void => {
		visible ? setVisible(false) : openDropdown()
	}

	const openDropdown = (): void => {
		//@ts-ignore
		DropdownButton.current.measure((_fx: number, _fy: number, _w: number, h: number, _px: number, py: number) => {
			setDropdownTop(py + h)
		})

		setTimeout(() => {
			setVisible(true)
		}, 10)
	}

	const onItemPress = (item: any): void => {
		setSelected(item)
		onSelect(item)
		setVisible(false)
	}

	useEffect(() => {
		if (typeof toggle === 'number' && toggle > 0) toggleDropdown()
	}, [toggle])

	const renderItem = ({ item }: any): ReactElement<any, any> => (
		<TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 10 }} onPress={() => onItemPress(item)}>
			<Text>{item.label}</Text>
		</TouchableOpacity>
	)

	const renderDropdown = (): ReactElement<any, any> => {
		return (
			<Modal visible={visible} transparent animationType="none">
				<TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => setVisible(false)}>
					<View
						style={[
							{
								position: 'absolute',
								backgroundColor: fill,
								marginLeft: '13%',
								marginTop: '5%',
								width: '82%',
								borderRadius: 10
							},
							{ top: dropdownTop }
						]}>
						<FlatList
							ItemSeparatorComponent={() => {
								return <View style={{ height: 1, backgroundColor: chattanoogaTapWater, opacity: 0.3 }} />
							}}
							data={data}
							renderItem={renderItem}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View>
				</TouchableOpacity>
			</Modal>
		)
	}

	return (
		<TouchableOpacity
			//@ts-ignore
			ref={DropdownButton}
			style={{ alignItems: 'center', backgroundColor: 'transparent', display: 'flex', zIndex: 1 }}
			onPress={toggleDropdown}>
			{renderDropdown()}
			<View
				style={{
					flexDirection: 'row',
					backgroundColor: 'transparent',
					alignItems: 'center',
					justifyContent: 'space-between',
					width: '100%',
					paddingRight: 20
				}}>
				<Text style={{ color: isSelected ? 'white' : 'grey' }}>{(!!selected && selected.label) || label}</Text>
				<AntDesign name={visible ? 'caretup' : 'caretdown'} color={chattanoogaTapWater} size={12} />
			</View>
		</TouchableOpacity>
	)
}
