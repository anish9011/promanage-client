import React, { useState, forwardRef } from 'react';
import StylesAddModal from './AddModal.module.css';
import ModalTaskList from '../ModalTaskList/ModalTaskList';
import { useDispatch } from 'react-redux';
import { closeModal1, toggleLoader } from '../../../Redux/slice';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { Url } from '../../../Utils/Url';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddModalElement = () => {
    const baseUrl = Url();
    const [selectedPriority, setSelectedPriority] = useState(null);
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState(null);
    const uId = localStorage.getItem('id');
    const myBoard = 'toDo';
    const [checklists, setChecklists] = useState([]);
    const [assignTo, setAssignTo] = useState('');
    const [emailList, setEmailList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleCloseModal = () => {
        dispatch(closeModal1());
    };

    const handlePriorityClick = (priority) => {
        setSelectedPriority(priority);
    };

    const handleTaskCheck = (taskId, completed) => {
        console.log('Task checkbox clicked - Task ID:', taskId, 'Completed:', completed);
    };

    const handleTaskDelete = (taskId) => {
        console.log('Task delete button clicked - Task ID:', taskId);
    };

    const handleUserDetails = () => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:5000/api/getusers`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setEmailList(response.data.emails);
                setShowDropdown(true);
            })
            .catch(error => {
                console.error('Error fetching emails:', error);
                toast.error("Error fetching emails");
            });
    };

    const handleEmailSelect = (email) => {
        setAssignTo(email);
        setShowDropdown(false);
    };

    const handleSave = () => {
        const title = document.getElementById('taskTitle').value;
        const priority = selectedPriority;
        const dueDate = startDate ? startDate : null;
        const userId = uId;
        const board = myBoard;

        const nonEmptyChecklist = checklists.filter(item => item.inputValue.trim() !== '');

        if (nonEmptyChecklist.length === 0) {
            toast.error('No tasks to save.');
            return;
        }

        const checklist = nonEmptyChecklist.map(item => ({
            taskName: item.inputValue,
            completed: item.isChecked
        }));

        const data = {
            title,
            priority,
            checklist,
            dueDate,
            userId,
            board,
            assignTo
        };

        const token = localStorage.getItem('token');
        axios.post(`${baseUrl}/api/addtask`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data.message);
                handleCloseModal();
                window.location.reload();
            })
            .catch(error => {
                toast.error(error);
            });
    };

    const DateInput = forwardRef(({ value, onClick }, ref) => (
        <button
            className={StylesAddModal.button1}
            onClick={onClick}
            ref={ref}
        >
            {value || "Select Due Date"}
        </button>
    ));

    let checkMarkMe = 0;

    return (
        <>
            <div className={StylesAddModal.addModalElement}>
                <div className={StylesAddModal.title}>Title<span className={StylesAddModal.asterisk}> *</span></div>
                <div>
                    <input id="taskTitle" type='text' className={StylesAddModal.inputTitle} placeholder='Enter Task Title' />
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className={StylesAddModal.priority}>Select Priority<span className={StylesAddModal.asterisk}> *</span></div>
                    <div className={StylesAddModal.priorityOptions}>
                        <button value="HIGH PRIORITY" className={selectedPriority === "HIGH PRIORITY" ? StylesAddModal.addPriorityColor : StylesAddModal.addPriority} onClick={() => handlePriorityClick("HIGH PRIORITY")}><img src='Assets/high.svg' alt='addPriority' />&nbsp;&nbsp;HIGH PRIORITY</button>
                        <button value="MODERATE PRIORITY" className={selectedPriority === "MODERATE PRIORITY" ? StylesAddModal.addPriorityColor : StylesAddModal.addPriority} onClick={() => handlePriorityClick("MODERATE PRIORITY")}><img src='Assets/moderate.svg' alt='addPriority' />&nbsp;&nbsp;MODERATE PRIORITY</button>
                        <button value="LOW PRIORITY" className={selectedPriority === "LOW PRIORITY" ? StylesAddModal.addPriorityColor : StylesAddModal.addPriority} onClick={() => handlePriorityClick("LOW PRIORITY")}><img src='Assets/low.svg' alt='addPriority' />&nbsp;&nbsp;LOW PRIORITY</button>
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    <div className={StylesAddModal.assignTo}>Assign To</div>
                    <div>
                        <input 
                            type='text' 
                            className={StylesAddModal.assignTitle} 
                            placeholder='Add an assignee' 
                            value={assignTo} 
                            onChange={(e) => setAssignTo(e.target.value)} 
                            onClick={handleUserDetails}
                            onFocus={() => setShowDropdown(true)}
                        />
                        {showDropdown && (
                        <div className={StylesAddModal.dropdown}>
                            {emailList
                                .filter(email => email.includes(assignTo))
                                .map((email, index) => {
                                    const initials = email.slice(0, 2).toUpperCase(); // Get the first two letters of the email
                                    return (
                                        <div key={index} className={StylesAddModal.dropdownItem}>
                                            <div className={StylesAddModal.dropdownImg}>
                                                {initials}
                                            </div>
                                            <div className={StylesAddModal.dropdownEmail}>
                                                {email}
                                            </div>
                                            <button onClick={() => handleEmailSelect(email)}>Assign</button>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    )}

                    </div>
                </div>
                <div>
                    <br />
                    <span className={StylesAddModal.checklistTitle}>Checklist ({checkMarkMe}/{checklists.length})<span className={StylesAddModal.asterisk}>*</span></span>
                </div>
                <div className={StylesAddModal.checklist}>
                    <ModalTaskList checklists={checklists} setChecklists={setChecklists} onTaskCheck={handleTaskCheck} onTaskDelete={handleTaskDelete} />
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            customInput={<DateInput />}
                            placeholderText='Select Due Date'
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '18px' }}>
                        <button className={StylesAddModal.cancel} onClick={handleCloseModal}>Cancel</button>
                        <button className={StylesAddModal.save} onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default AddModalElement;
