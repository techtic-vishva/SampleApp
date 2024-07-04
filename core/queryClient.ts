import { QueryClient } from 'react-query'
import { createAsyncStoragePersistor } from 'react-query/createAsyncStoragePersistor-experimental'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistQueryClient } from 'react-query/persistQueryClient-experimental'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			cacheTime: 1000 * 60 * 60 * 24 // 24 hour stale-while-revalidate cache
		}
	}
})

const asyncStoragePersistor = createAsyncStoragePersistor({
	storage: AsyncStorage
})

// Persist cache through app close
persistQueryClient({
	queryClient,
	persistor: asyncStoragePersistor
})
