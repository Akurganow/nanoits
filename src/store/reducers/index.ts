import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import tasksReducer from 'store/reducers/tasks'
import dialogsReducer from 'store/reducers/dialogs'
import settingsReducer from 'store/reducers/settings'
import tagsReducer from 'store/reducers/tags'
import { storeKey as tasksStoreKey, initialState as tasksInitialState } from 'store/constants/tasks'
import { storeKey as dialogsStoreKey, initialState as dialogsInitialState } from 'store/constants/dialogs'
import { storeKey as settingsStoreKey, initialState as settingsInitialState } from 'store/constants/settings'
import { storeKey as tagsStoreKey, initialState as tagsInitialState } from 'store/constants/tags'
import { RootState, PersistPartial } from 'store/types'

export const initialState: RootState = {
	[tasksStoreKey]: tasksInitialState as typeof tasksInitialState & PersistPartial,
	[settingsStoreKey]: settingsInitialState as typeof settingsInitialState & PersistPartial,
	[tagsStoreKey]: tagsInitialState as typeof tagsInitialState & PersistPartial,
	[dialogsStoreKey]: dialogsInitialState,
}

type Storage = typeof storage
function createPersistConfig(key: string, storage: Storage) {
	return {
		key: `nanoits/${key}`,
		storage,
	}
}

export const rootReducer = combineReducers({
	[tasksStoreKey]: persistReducer(
		createPersistConfig(tasksStoreKey, storage),
		tasksReducer(tasksInitialState),
	),
	[settingsStoreKey]: persistReducer(
		createPersistConfig(settingsStoreKey, storage),
		settingsReducer(settingsInitialState),
	),
	[tagsStoreKey]: persistReducer(
		createPersistConfig(tagsStoreKey, storage),
		tagsReducer(tagsInitialState),
	),
	[dialogsStoreKey]: dialogsReducer(dialogsInitialState),
})