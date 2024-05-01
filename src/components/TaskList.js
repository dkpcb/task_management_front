import axios from "axios"
import { useState, useEffect } from "react"
import "./TaskList.css"

function TaskList() {
	const [donetasks, setdonetasks] = useState([])
	const [tasks, setTasks] = useState([])
	const [task, setTask] = useState("")

	function handlePush() {
		if (task !== "") {
			axios
				.post("http://localhost:8000/api/tasks", {
					name: task,
				})
				.then(() => {
					handleGetTasks()
				})
			setTask("")
		}
	}
	function handleComplete(index) {
		axios.put(`http://localhost:8000/api/tasks/` + tasks[index].id).then(() => {
			handleGetTasks()
		})
	}
	function handleDelete(index) {
		axios
			.delete(`http://localhost:8000/api/tasks/` + donetasks[index].id)
			.then(() => {
				handleGetTasks()
			})
	}
	function handleGetTasks() {
		axios.get("http://localhost:8000/api/tasks").then((res) => {
			let tmpdonetasks = []
			let tmpTasks = []
			for (let i = 0; i < res.data.length; i++) {
				if (res.data[i].finished === true) {
					tmpdonetasks = tmpdonetasks.concat([
						{
							id: res.data[i].id,
							name: res.data[i].name,
						},
					])
				} else {
					tmpTasks = tmpTasks.concat([
						{
							id: res.data[i].id,
							name: res.data[i].name,
						},
					])
				}
			}
			setdonetasks(tmpdonetasks)
			setTasks(tmpTasks)
		})
	}
	useEffect(() => {
		handleGetTasks()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="taskList">
			<h1 className="title">Task管理</h1>
			<input value={task} onChange={(e) => setTask(e.target.value)} />
			<button onClick={handlePush} className="button">
				追加
			</button>
			<h2>タスク</h2>
			<h3>完了</h3>
			<ul className="ul">
				{donetasks.map((donetask, index) => (
					<li key={donetask.id} className="li">
						{donetask.name}
						<button onClick={() => handleDelete(index)} className="button">
							消去
						</button>
					</li>
				))}
			</ul>

			<h3>未完了</h3>
			<ul className="ul">
				{tasks.map((task, index) => (
					<li key={task.id} className="li">
						{task.name}
						<button onClick={() => handleComplete(index)} className="button">
							完了する
						</button>
					</li>
				))}
			</ul>
		</div>
	)
}

export default TaskList