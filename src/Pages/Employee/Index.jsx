import React from 'react'
import AssignedTask from './AssignedTask'
import TasksLists from '../Tasklists'

const EmployeePanel = () => {
    return (
        <div>
            <AssignedTask />
            <TasksLists />
        </div>
    )
}

export default EmployeePanel
