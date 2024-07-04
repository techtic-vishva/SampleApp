import { FlatList, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { KeyboardAvoidingView, Text, View } from '../components/Themed'
import {
	createTag,
	deletes,
	Tag,
	update,
	useRecentTags,
	useSession,
	useTags,
	create,
	buildSessionBase
} from '../core/services/session'
import { RootStackScreenProps } from '../types'
import Loading from '../components/Loading'
import { formatDurationSeparate, formatLocalTimeWithoutSeconds, timeRange } from '../core/format'
import { chattanoogaTapWater, darkArts, dichotomousHippopotamus, fill } from '../constants/Colors'
import { HeaderText } from '../components/StyledText'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import OrangeButton from '../components/OrangeButton'
import LottieView from 'lottie-react-native'
import BaseScreen from './BaseScreen'
import { useOnActivate } from '../hooks/useOnActivate'
import { useIsFocused } from '@react-navigation/native'
import { intervalToDuration, subHours } from 'date-fns'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import useColorScheme from '../hooks/useColorScheme'
import useTimeout from '../hooks/useTimeout'
import AroModal from '../components/AroModal'
import { mark } from '../core/services/achievement'
import InAppReview from 'react-native-in-app-review'
import { GlobalState, setShouldPromptForReview } from '../core/GlobalState'
import { useFuse } from '../hooks/useFuse'

type SelectorTag = Tag & { isMostRecent: boolean }

function useDatePickerModal({
	setValue,
	startTime,
	isEndTime,
	defaultVisibile = false
}: {
	setValue: (date: Date) => void
	startTime?: Date
	isEndTime?: boolean
	defaultVisibile?: boolean
}) {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(defaultVisibile)

	const showDatePicker = () => {
		setDatePickerVisibility(true)
	}

	const hideDatePicker = () => {
		setDatePickerVisibility(false)
	}

	const handleConfirm = (date: Date) => {
		if (Platform.OS == 'ios') {
			setValue(date)
			hideDatePicker()
		} else {
			if (startTime && date > startTime) {
				setValue(date)
				hideDatePicker()
			} else {
				setValue(isEndTime ? new Date() : date)
				hideDatePicker()
			}
		}
	}

	return { isDatePickerVisible, showDatePicker, hideDatePicker, handleConfirm }
}
const options = {
	keys: ['name']
}
export default function EditSessionScreen({ navigation, route }: RootStackScreenProps<'EditSession'>) {
	const uuid = route.params.uuid
	const [isNew] = useState(!uuid)
	const { isFetching, data, refetch } = useSession(uuid)
	const { data: tags, refetch: refetchTags } = useTags()
	const { data: recentTags } = useRecentTags()
	const [tag, setTag] = useState(isNew ? '1' : data?.tagId)
	const [isOvernight, setIsOvernight] = useState(data?.isOvernight)
	const [tagData, setTagData] = useState([] as SelectorTag[])
	const [search, setSearch] = useState('')
	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
	const [isErrorModalVisible, setErrorModalVisible] = useState(false)
	const [error, setError] = useState('')
	const [topCount, setTopCount] = useState(0)
	const [endTime, setEndTime] = useState(new Date())
	const [startTime, setStartTime] = useState(subHours(endTime, 1))
	const lottieRef = useRef<LottieView | null>(null)
	const flatlistRef = useRef<FlatList | null>(null)
	const [filteredTags, setFilteredTags] = useState(tags)
	const isFocused = useIsFocused()
	const searchSuggesstion = useFuse<Tag>(search, filteredTags || [], options)

	const {
		isDatePickerVisible: isStartPickerVisible,
		showDatePicker: showStartPicker,
		hideDatePicker: hideStartPicker,
		handleConfirm: handleConfirmStartPicker
	} = useDatePickerModal({ setValue: setStartTime, defaultVisibile: isNew })
	const {
		isDatePickerVisible: isEndPickerVisible,
		showDatePicker: showEndPicker,
		hideDatePicker: hideEndPicker,
		handleConfirm: handleConfirmEndPicker
	} = useDatePickerModal({ setValue: setEndTime, startTime: startTime, isEndTime: true })
	const theme = useColorScheme()
	useOnActivate(refetch, isFocused && !isFetching)

	// Create list of non-retired tags
	useEffect(() => {
		const filteredTags = tags?.filter((i) => !i.retiredOn || tag == i.id) || []
		setFilteredTags(filteredTags)
	}, [tags, tag])

	// Set current tag upon fetch
	useEffect(() => {
		if (isNew || !data) return

		setTag(data.tagId)
		setIsOvernight(data.isOvernight)
		setStartTime(new Date(data.startTime))
		setEndTime(new Date(data.endTime))
	}, [isFetching, data])

	useTimeout(() => {
		lottieRef.current?.resume()
	}, 500)

	// Change list when search term or tags refresh
	useEffect(() => {
		const top: SelectorTag[] = []
		const bottom: SelectorTag[] = []
		// Searching
		if (search) {
			searchSuggesstion.forEach((i) => bottom.push({ ...i.item, isMostRecent: false }))
		} else {
			for (const tagItem of filteredTags || []) {
				// Most Recent
				if (recentTags?.some((rt) => rt.tagId === tagItem.id)) {
					top.push({ ...tagItem, isMostRecent: true })
				}

				// Selected
				else if (tagItem.id === tag && `${tagItem.id}` !== '1') {
					top.unshift({ ...tagItem, isMostRecent: true })
				}

				// Default
				else {
					bottom.push({ ...tagItem, isMostRecent: false })
				}
			}
		}

		setTagData([...top, ...bottom])
		setTopCount(top.length)
	}, [search, tags, recentTags, tag, filteredTags])

	// Don't render until ready
	if (isFetching || !data || !tags || !recentTags) {
		return <Loading />
	}

	const durationParts = formatDurationSeparate(
		intervalToDuration({
			start: startTime,
			end: endTime
		}),
		2
	)

	const selectedBorder = {
		borderColor: dichotomousHippopotamus,
		borderWidth: 1
	}

	const defaultBorder = {
		borderColor: 'transparent',
		borderWidth: 1
	}

	async function onSave() {
		let tagId = typeof tag === 'string' ? parseInt(tag, 10) : tag

		// Handle user-typed tag
		if (search && search.length) {
			// Find existing tag that matches
			const match = (tagData || []).find((td) => td.name.toLowerCase() === search.toLowerCase())
			if (match) {
				tagId = match.id
			}

			// otherwise, create a custom tag
			else {
				tagId = await addCustomTag()
			}
		}

		if (!isNew) {
			await update(uuid, {
				tagId,
				isOvernight,
				startTime: startTime.toISOString(),
				endTime: endTime.toISOString()
			})
			navigation.goBack()
		} else {
			const base = await buildSessionBase()

			const result = await create({
				startTime: startTime.toISOString(),
				endTime: endTime.toISOString(),
				tagId: tagId,
				isOvernight: isOvernight,
				aroDeviceId: 'manual-add',
				...base
			})

			if (result.error) {
				setError(result.error)
				toggleConfirmError()
			} else {
				if (result.didMeetGoal) {
					// Show goal met screen
					navigation.pop()
					navigation.navigate('GoalMet', { uuid: uuid, skipEdit: true })
				} else {
					navigation.goBack()
				}
			}
		}

		// Ask for review on session complete
		if (GlobalState.shouldPromptForReview) {
			InAppReview.RequestInAppReview()
				.then((hasFlowFinishedSuccessfully: boolean) => {
					if (hasFlowFinishedSuccessfully) {
						setShouldPromptForReview(false)
					}
				})
				.catch(() => {})
		}
	}

	function onOvernightPress() {
		const newIsOvernight = !isOvernight
		if (newIsOvernight) {
			const sleeping = tagData?.find((t) => `${t.id}` === '22')
			if (sleeping) onSelect(sleeping)
		}
		setIsOvernight(newIsOvernight)
	}

	function onSelect(tag: SelectorTag) {
		setTag(tag.id)
		if (search) setSearch('')
		flatlistRef.current?.scrollToOffset({ animated: true, offset: 0 })
	}

	async function addCustomTag() {
		const newTag = await createTag(search)
		await Promise.all([refetchTags(), mark('custom-tag')])
		setTag(newTag.id)
		setSearch('')
		return newTag.id
	}

	async function toggleConfirmDelete() {
		if (isNew) return
		setDeleteModalVisible(!isDeleteModalVisible)
	}

	async function onDeleteSession() {
		await deletes(route.params.uuid, 'UserDelete')
		navigation.goBack()
	}

	function ConfirmDeleteModal(dismiss: () => void) {
		async function onDelete() {
			await onDeleteSession()
		}

		return (
			<AroModal
				title="Are you sure you want to delete this session?"
				actionBtnTxt="Delete"
				cancelBtnText="Cancel"
				onActionPress={onDelete}
				onCancelPress={dismiss}
				isCancleBtnDisable={false}
			/>
		)
	}

	async function toggleConfirmError() {
		setErrorModalVisible(!isErrorModalVisible)
	}

	function ConfirmErrorModal(dismiss: () => void) {
		return (
			<AroModal title={error} actionBtnTxt="Okay" onActionPress={dismiss} isCancleBtnDisable={true} cancelBtnText="" />
		)
	}

	return (
		<BaseScreen>
			<KeyboardAvoidingView
				keyboardVerticalOffset={30}
				style={styles.container}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<View
					style={{
						backgroundColor: 'white',
						width: '35%',
						height: 4.5,
						borderRadius: 5,
						opacity: 0.2,
						marginBottom: 20,
						marginTop: 10
					}}
				/>
				<View style={{ flexDirection: 'row', backgroundColor: 'transparent', marginHorizontal: 35 }}>
					<TouchableOpacity style={{ flex: 1 }} onPress={toggleConfirmDelete}>
						{!isNew && <Feather name="trash" size={28} color={chattanoogaTapWater} />}
					</TouchableOpacity>
					<HeaderText style={{ flex: 2, textAlign: 'center', fontSize: 15, color: chattanoogaTapWater }}>
						{isNew ? 'Add Session' : ''}
					</HeaderText>
					<TouchableOpacity onPress={onOvernightPress} style={{ flex: 1 }}>
						<Ionicons
							name={isOvernight ? 'ios-moon' : 'ios-moon-outline'}
							size={28}
							color={isOvernight ? dichotomousHippopotamus : chattanoogaTapWater}
							style={{ marginLeft: 'auto' }}
						/>
					</TouchableOpacity>
				</View>

				<View
					style={{
						flexDirection: 'row',
						backgroundColor: 'transparent',
						alignItems: 'center',
						justifyContent: 'space-between'
					}}>
					<LottieView
						ref={lottieRef}
						source={require('../assets/animations/plus.min.json')}
						loop={false}
						style={{ width: 50, paddingTop: 5 }}
						speed={1.5}
					/>
					{durationParts &&
						durationParts.map((d, i) => {
							const fontSize = i % 2 ? 20 : 45
							const paddingTop = i % 2 ? 15 : 0
							const ThisComponent = i % 2 ? Text : HeaderText
							return (
								<ThisComponent key={i} style={{ paddingTop, fontSize, marginHorizontal: 5 }}>
									{d}
								</ThisComponent>
							)
						})}
				</View>

				<View
					style={{
						backgroundColor: 'transparent',
						display: 'flex',
						width: '80%',
						flexDirection: 'row',
						justifyContent: 'center',
						marginTop: 15
					}}>
					<TouchableOpacity
						style={{
							borderColor: chattanoogaTapWater,
							borderWidth: 2,
							borderRadius: 15,
							width: '35%',
							padding: 5,
							marginRight: 10
						}}
						onPress={showStartPicker}>
						<Text style={{ textAlign: 'center', color: chattanoogaTapWater }}>
							{formatLocalTimeWithoutSeconds(startTime)}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={{ borderColor: chattanoogaTapWater, borderWidth: 2, borderRadius: 15, width: '35%', padding: 5 }}
						onPress={showEndPicker}>
						<Text style={{ textAlign: 'center', color: chattanoogaTapWater }}>
							{formatLocalTimeWithoutSeconds(endTime)}
						</Text>
					</TouchableOpacity>
				</View>
				<DateTimePickerModal
					maximumDate={endTime}
					date={startTime}
					onConfirm={handleConfirmStartPicker}
					onCancel={hideStartPicker}
					isVisible={isStartPickerVisible}
					mode="datetime"
					confirmTextIOS="Save Start Time"
					buttonTextColorIOS={theme === 'dark' ? 'white' : 'black'}
				/>

				<DateTimePickerModal
					minimumDate={startTime}
					maximumDate={new Date()}
					date={endTime}
					onConfirm={handleConfirmEndPicker}
					onCancel={hideEndPicker}
					isVisible={isEndPickerVisible}
					mode="datetime"
					confirmTextIOS="Save End Time"
					buttonTextColorIOS={theme === 'dark' ? 'white' : 'black'}
				/>
				<Text style={{ marginTop: 30, marginBottom: 20 }}>How'd you spend your time?</Text>
				<TextInput
					style={styles.input}
					onChangeText={setSearch}
					value={search}
					placeholder={'ex. Morning Walk'}
					autoFocus={false}
					focusable={true}
					placeholderTextColor={chattanoogaTapWater}
				/>
				<FlatList
					keyboardShouldPersistTaps="handled"
					ref={flatlistRef}
					style={{ width: '80%', minHeight: 10 }}
					data={tagData}
					initialNumToRender={3}
					extraData={tag}
					renderItem={({ item, index }: { item: SelectorTag; index: number }) => {
						return (
							<>
								{topCount > 0 && (index === 0 || index === topCount) && (
									<View
										style={{
											display: 'flex',
											flexDirection: 'row',
											backgroundColor: 'transparent',
											alignItems: 'center',
											marginBottom: 5,
											justifyContent: 'space-between',
											marginTop: index === topCount ? 5 : undefined
										}}>
										<View
											style={{
												flex: 1,
												height: 1,
												backgroundColor: chattanoogaTapWater,
												marginHorizontal: 10
											}}></View>
										<Text
											style={{
												color: chattanoogaTapWater,
												fontSize: 10,
												textTransform: 'lowercase'
											}}>
											{index === 0 ? 'Most Recent' : 'All Activities'}
										</Text>
										<View
											style={{
												flex: 1,
												height: 1,
												backgroundColor: chattanoogaTapWater,
												marginHorizontal: 10
											}}></View>
									</View>
								)}
								<TouchableOpacity
									style={[
										{ backgroundColor: '#4a4640' },
										styles.tagItem,
										item.id === tag ? selectedBorder : defaultBorder
									]}
									onPress={() => onSelect(item)}>
									<Text style={{}}>{item.name}</Text>
									{item.type === 'private' && <Feather name="tag" size={18} color={dichotomousHippopotamus} />}
								</TouchableOpacity>
							</>
						)
					}}
					ListEmptyComponent={() => {
						return (
							<TouchableOpacity onPress={addCustomTag} style={{ paddingTop: 10, paddingBottom: 30 }}>
								<Text
									style={{
										textAlign: 'center',
										textDecorationLine: 'underline',
										color: chattanoogaTapWater
									}}>
									Add "{search}" as a custom tag.
								</Text>
							</TouchableOpacity>
						)
					}}
				/>
				<OrangeButton
					title="Save Session"
					outterStyle={{ width: '80%', marginTop: 15, marginBottom: 30 }}
					onPress={onSave}
				/>
				{isDeleteModalVisible && ConfirmDeleteModal(toggleConfirmDelete)}
				{isErrorModalVisible && ConfirmErrorModal(toggleConfirmError)}
			</KeyboardAvoidingView>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: fill
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%'
	},
	tagItem: {
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		marginVertical: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	input: {
		backgroundColor: darkArts,
		padding: 14,
		fontSize: 18,
		borderRadius: 10,
		borderColor: chattanoogaTapWater,
		shadowColor: chattanoogaTapWater,
		shadowOffset: { width: 0, height: 0 },
		shadowRadius: 1,
		shadowOpacity: 0.4,
		width: '80%',
		color: 'white',
		marginBottom: 15
	}
})
