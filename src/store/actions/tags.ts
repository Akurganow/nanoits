import { actionCreatorFactory } from 'typescript-fsa'
import { storeKey } from 'store/constants/tags'
import { Tag } from 'types/tags'

const createAction = actionCreatorFactory(storeKey)

export const addTag = createAction<Tag>('ADD_TAG')
export const editTag = createAction<Tag>('EDIT_TAG')
export const removeTag = createAction<string>('REMOVE_TAG')