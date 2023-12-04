import { Button, Input, message, Modal, Space } from 'antd'
import Markdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { selectedDialog } from 'store/selectors/dialogs'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { closeDialog } from 'store/actions/dialogs'
import { ApiTwoTone, FileExcelTwoTone, FundTwoTone, SaveTwoTone } from '@ant-design/icons'
import { selectedTasks } from 'store/selectors/tasks'
import { downloadArrayAsJSON } from 'utils/files'
import { selectedOpenAI } from 'store/selectors/settings'
import { setOpenAIApiKey, setOpenAIUserId } from 'store/actions/settings'
import { importTasks } from 'store/actions/tasks'

export default function Exports() {
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()
	const [messageApi, contextHolder] = message.useMessage()
	const isDialogOpened = useSelector(selectedDialog('export'))
	const tasks = useSelector(selectedTasks)
	const { apiKey, userId } = useSelector(selectedOpenAI)
	const fileName = useMemo(() => `Alexenda-tasks-${new Date().toISOString()}`, [])
	const [isAnalyzing, setIsAnalyzing] = useState(false)
	const [apiKeyValue, setAPIKeyValue] = useState(apiKey)
	const [analysis, setAnalysis] = useState('')

	const handleClose = useCallback(() => {
		dispatch(closeDialog('export'))
	}, [dispatch])

	const handleDownload = useCallback(() => {
		downloadArrayAsJSON(tasks, fileName)
	}, [fileName, tasks])

	const handleUpload = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.length) return

		const fileReader = new FileReader()
		fileReader.readAsText(event.target.files[0], 'UTF-8')
		fileReader.onload = e => {
			const { result } = e.target as FileReader

			if (!result) return

			try {
				const tasks = JSON.parse(result.toString())
				dispatch(importTasks(tasks))
				messageApi.success(t('tasksImported'))
			} catch (error) {
				messageApi.error(error.message)
			}
		}
	}, [dispatch, messageApi, t])

	const handleAPIKeySave = useCallback(() => {
		dispatch(setOpenAIApiKey(apiKeyValue))
		messageApi.success(t('apiKeySaved'))
	}, [apiKeyValue, dispatch, messageApi, t])

	const handleAPIKeyChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setAPIKeyValue(event.target.value)
	}, [])

	const handleAnalyze = useCallback(async () => {
		setIsAnalyzing(true)

		if (!apiKey) {
			messageApi.error(t('apiKeyNotSet'))
			setIsAnalyzing(false)
			return
		}

		const message = t('analyzerMessage', { tasks: JSON.stringify(tasks) })
		const { translation } = i18n.store.data[i18n.resolvedLanguage || i18n.language]
		console.log('message', { message, length: message.length, apiKey, userId })

		try {
			const resp = await fetch('/api/analyzer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message, apiKey, userId, translation }),
			}).then((r) => r.json())
			console.log('resp', resp.message)
			setAnalysis(resp.message)
			setIsAnalyzing(false)
		} catch (error) {
			messageApi.error(error.message)
			setIsAnalyzing(false)
		}
	}, [apiKey, i18n.language, i18n.resolvedLanguage, i18n.store.data, messageApi, t, tasks, userId])

	useEffect(() => {
		if (!userId) {
			dispatch(setOpenAIUserId())
		}
	}, [dispatch, userId])
    
	return <Modal
		width="60vw"
		open={isDialogOpened}
		title={t('export')}
		onCancel={handleClose}
		okButtonProps={{}}
		getContainer="#dialog"
		destroyOnClose={true}
		footer={null}
	>
		{contextHolder}
		<Space direction="vertical">
			<Space.Compact>
				<Input
					name="apiKey"
					onChange={handleAPIKeyChange}
					placeholder={t('apiKey')}
					prefix={<ApiTwoTone />}
					value={apiKeyValue}
					onPressEnter={handleAPIKeySave}
				/>
				<Button onClick={handleAPIKeySave}>
					<SaveTwoTone />
				</Button>
			</Space.Compact>

			<Space.Compact>
				<Button
					icon={<FundTwoTone />}
					onClick={handleAnalyze}
					loading={isAnalyzing}
				>
					{t('analyzeTasks')}
				</Button>
				<Button
					icon={<FileExcelTwoTone />}
					onClick={handleDownload}
				>
					{t('downloadTasks')}
				</Button>

				<Input
					type="file"
					accept="application/json"
					onChange={handleUpload}
				/>
			</Space.Compact>
		</Space>

		{analysis && analysis.length > 0 && <Markdown>{analysis}</Markdown>}
	</Modal>
}