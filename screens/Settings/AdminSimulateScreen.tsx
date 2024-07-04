import React from 'react'
import { StyleSheet } from 'react-native'
import { View } from '../../components/Themed'
import { SettingsTabScreenProps } from '../../types'
import { emitDeviceConnection } from '../../core/EventBroker'
import { PhoneState } from '../../core/connectivity/AroDevice'
import SettingGroup from '../../components/settings/group'
import SettingItem from '../../components/settings/item'
import BaseScreen from '../BaseScreen'

const aroDeviceId = '37'
const aroFirmwareVersion = 'demo.demo.demo'

export default function AdminSimulateScreen({ navigation }: SettingsTabScreenProps<'AdminSimulate'>) {
	return (
		<BaseScreen>
			<View style={styles.container}>
				<SettingGroup>
					<SettingItem
						label="Session Start"
						onClick={() =>
							emitDeviceConnection({
								newState: PhoneState.IN,
								previousState: PhoneState.OUT,
								aroDeviceId,
								aroFirmwareVersion
							})
						}
					/>
					<SettingItem
						label="Session End"
						last
						onClick={() =>
							emitDeviceConnection({
								newState: PhoneState.OUT,
								previousState: PhoneState.IN,
								aroDeviceId,
								aroFirmwareVersion
							})
						}
					/>
				</SettingGroup>
			</View>
		</BaseScreen>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 20,
		paddingTop: 30
	}
})
