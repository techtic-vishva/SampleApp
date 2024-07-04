import Loading from '../components/Loading'
import { useAppState } from '../hooks/useAppState'

export default function BaseScreen({ children }: { children: React.ReactChild[] | React.ReactChild }) {
	const appState = useAppState()
	if (appState !== 'active') return <Loading />
	return <>{children}</>
}
