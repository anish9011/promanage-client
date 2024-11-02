import React, { useState, useEffect } from 'react';
import StylesBoard from './Board.module.css';
import Card from '../Card/Card';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import AddModal from '../AddModal/AddModal';
import { useSelector, useDispatch } from 'react-redux'
import { closeModal1, openModal1, toggleLoader } from '../../../Redux/slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Url } from '../../../Utils/Url';
import EditModal from '../EditModal/EditModal';
import AddBoardModal from '../AddBoardModal/AddBoardModal';
const Board = () => {

    const baseUrl = Url();
    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('thisWeek'); // Default selected option
    const [collasped, setCollasped] = useState(
        {
            backlog: false,
            todo: false,
            inprogress: false,
            done: false
        }
    );
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (item) => {
        console.log(`Selected item: ${item}`);
        toggleMenu();
    };

    // ?modal start

    const isOpenModal = useSelector(state => state.modal.isOpen);

    const isBoardChanged = useSelector(state => state.boardSwitch.isBoardSwitch);

    const isTosty = useSelector(state => state.toastyAction.toasty);

    const openEditModal = useSelector(state => state.modal2.isOpen);

    const taskId = useSelector((state) => state.itsTaskId.taskId);

    const dispatch = useDispatch();

    const onOpenModal = () => dispatch(openModal1());
    const onCloseModal = () => dispatch(closeModal1());

    //modal end

    const fetchTasksToDo = async (userId, boardDate) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${baseUrl}/api/gettasktodo`, { userId, boardDate },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data.tasksToDo;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    };

    const [tasksToDo, setTasksToDo] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('id');
        const fetchData = async () => {
            try {
                const tasks = await fetchTasksToDo(userId, selectedOption);
                setTasksToDo(tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchData();
    }, [selectedOption, isBoardChanged], []);

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const myName = localStorage.getItem('name')



    // ?? todays date  start
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const formatted = `${getFormattedDay(today)} ${getFormattedMonth(today)}, ${today.getFullYear()}`;
        setFormattedDate(formatted);
    }, []);

    function getFormattedDay(date) {
        const day = date.getDate();
        if (day >= 11 && day <= 13) {
            return `${day}th`;
        }
        switch (day % 10) {
            case 1:
                return `${day}st`;
            case 2:
                return `${day}nd`;
            case 3:
                return `${day}rd`;
            default:
                return `${day}th`;
        }
    }

    function getFormattedMonth(date) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[date.getMonth()];
    }


    const customToastStyle = {
        backgroundColor: '#F6FFF9', // Background color
        color: 'black', // Text color
        borderRadius: '8px', // Rounded corners
        padding: '16px', // Padding around the content
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', // Shadow for depth
        fontFamily: 'Poppins, sans-serif', // Font family
        border: '1px solid #48C1B5', // Border
        textAlign: 'center' // Center text alignment
    };
    

    useEffect(() => {
        if (isTosty) {
            toast.success('Link Copied', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                style: customToastStyle,
                closeButton: false,
                icon: false,
            });
        }
    }, [isTosty]); // Runs when isTosty changes

    return (
        <>
            <div>
                <br />
                <div className={StylesBoard.header} >
                    <div className={StylesBoard.headerTitle}>Welcome! {myName}</div>
                    <div className={StylesBoard.headerDate}>{formattedDate}</div>
                </div>
                <div className={StylesBoard.headerMain}>
                    <div className={StylesBoard.headerTitle2}>Board</div>
                    <div className={StylesBoard.headerButton}>
                    <div>
                        <img src="Assets/profile.svg" alt="Board Icon" />
                    </div>
                    <button onClick={() => {
                     console.log('Button clicked');
                     setIsBoardModalOpen(true);
                }}>Add Board</button>.

                    </div>

                    <div className={StylesBoard.headerMenu}>
                        <div className={StylesBoard.dropdown}>
                            <select className={StylesBoard.dropdown} onChange={handleSelectChange} value={selectedOption}>
                                <option value="today">Today</option>
                                <option value="thisWeek">This Week</option>
                                <option value="thisMonth">This Month</option>
                            </select>
                        </div>
                    </div>
                </div>
                <br />
                <div>
                    <div className={`${StylesBoard.boardCards} ${StylesBoard.scroll}`} style={{ position: 'relative', left: '300px', marginTop:'20px' }}>
                        <div className={StylesBoard.boardCards_background}>
                            <br />
                            <div className={StylesBoard.boardCards_backgroundTitle} style={{ position: 'relative', left: '-111px' }}>Backlog<img src='Assets/collaspe.svg' alt='collaspe' style={{ position: 'relative', right: '-231px' }} onClick={() => setCollasped({ ...collasped, backlog: !collasped.backlog })} /></div>

                            {tasksToDo.map((taskBoard, index) => {
                                return ((taskBoard.board === "backlog") && <><br /> <Card key={index} priority={taskBoard.priority} title={taskBoard.title} assignTo={taskBoard.assignTo} checklist={taskBoard.checklist} myTaskId={taskBoard._id} serverFetchedDate={taskBoard.dueDate} collasped={collasped.backlog} /></>);
                            })}

                        </div>
                        <div className={StylesBoard.boardCards_background}>
                            <br />
                            <div className={StylesBoard.boardCards_backgroundTitle} style={{ position: 'relative', left: '-111px' }}>To do<img src='Assets/add.svg' alt='add' style={{ position: 'relative', right: '-211px' }} onClick={onOpenModal} /><img src='Assets/collaspe.svg' alt='collaspe' style={{ position: 'relative', right: '-231px' }} onClick={() => {
                                setCollasped({ ...collasped, todo: !collasped.todo });
                            }} /></div>

                            {tasksToDo.map((taskBoard, index) => {
                                return ((taskBoard.board === "toDo") && <><br /> <Card key={index} priority={taskBoard.priority} title={taskBoard.title} assignTo={taskBoard.assignTo} checklist={taskBoard.checklist} myTaskId={taskBoard._id} serverFetchedDate={taskBoard.dueDate} collasped={collasped.todo} /></>);
                            })}
                        </div>
                        <div className={StylesBoard.boardCards_background}>
                            <br />
                            <div className={StylesBoard.boardCards_backgroundTitle} style={{ position: 'relative', left: '-100px' }}>In progress<img src='Assets/collaspe.svg' alt='collaspe' style={{ position: 'relative', right: '-200px' }} onClick={() => setCollasped({ ...collasped, inprogress: !collasped.inprogress })} /></div>

                            {tasksToDo.map((taskBoard, index) => {
                                return ((taskBoard.board === "inProgress") && <><br /> <Card key={index} priority={taskBoard.priority} title={taskBoard.title} assignTo={taskBoard.assignTo} checklist={taskBoard.checklist} myTaskId={taskBoard._id} serverFetchedDate={taskBoard.dueDate} collasped={collasped.inprogress} /></>);
                            })}
                        </div>
                        <div className={StylesBoard.boardCards_background}>
                            <br />
                            <div className={StylesBoard.boardCards_backgroundTitle} style={{ position: 'relative', left: '-111px' }}>Done<img src='Assets/collaspe.svg' alt='collaspe' style={{ position: 'relative', right: '-231px' }} onClick={() => setCollasped({ ...collasped, done: !collasped.done })} /></div>

                            {tasksToDo.map((taskBoard, index) => {
                                return ((taskBoard.board === "done") && <><br /> <Card key={index} priority={taskBoard.priority} title={taskBoard.title} assignTo={taskBoard.assignTo} checklist={taskBoard.checklist} myTaskId={taskBoard._id} serverFetchedDate={taskBoard.dueDate} collasped={collasped.done} /></>);
                            })}
                        </div>
                    </div>
                </div>
            </div>
         <Modal open={isOpenModal} onClose={onCloseModal} center showCloseIcon={false}
                classNames={{
                    modal: `${StylesBoard.customModal}`,
                }}
            >
                {
                    <AddModal />
                }
            </Modal>


            <Modal open={openEditModal} onClose={onCloseModal} center showCloseIcon={false}
                classNames={{
                    modal: `${StylesBoard.customModal}`,
                }}
            >
                {

                    <EditModal taskId={taskId} />

                }
            </Modal>
            <AddBoardModal open={isBoardModalOpen} onClose={() => setIsBoardModalOpen(false)} />

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />
        </>
    );
};

export default Board;
