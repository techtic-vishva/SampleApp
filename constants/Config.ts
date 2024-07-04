/**
 * See `app.config.js` for definition
 */

import Constants from 'expo-constants'

type Config = {
	baseURL: string
}

const ResolvedConfig = Constants.manifest?.extra as Config

export default ResolvedConfig
