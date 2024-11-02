import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Public.module.css'; // Changed the import name
import PublicTaskList from '../../Components/Public/PublicTaskList/PublicTaskList';
import { Url } from '../../Utils/Url';
import logoimg from '../../Assets/logo.svg';
import highPriorityImg from '../../Assets/high.svg';
import moderatePriorityImg from '../../Assets/moderate.svg';
import lowPriorityImg from '../../Assets/low.svg';

const Public = ({ taskId }) => {
    const baseUrl = Url();
    const [publicTaskData, setPublicTaskData] = useState(null);
    let imgSrc = null;

    const showPublicTaskData = async (taskId) => {
        try {
            const response = await axios.get(`${baseUrl}/api/publictasks/${taskId}`);
            const tasks = response.data.tasks;
            setPublicTaskData(tasks[0]); // Assuming you want the first task
        } catch (error) {
            console.error('Error fetching public task data:', error);
        }
    };

    useEffect(() => {
        showPublicTaskData(taskId);
    }, [taskId]);

    const setImage = (priority) => {
        switch (priority) {
            case 'HIGH PRIORITY':
                imgSrc = highPriorityImg;
                break;
            case 'MODERATE PRIORITY':
                imgSrc = moderatePriorityImg;
                break;
            default:
                imgSrc = lowPriorityImg;
        }
    };

    if (publicTaskData) {
        setImage(publicTaskData.priority);
    }

    const funTotalChecks = () => {
        return publicTaskData?.checklist?.length || 0;
    };

    const funTotalChecksMarked = () => {
        return publicTaskData?.checklist?.filter(task => task.completed).length || 0;
    };

    const theserverDate = publicTaskData?.checklist?.[0]?.dueDate; // Assuming you want the first checklist item

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const month = monthNames[monthIndex];
    
        // Determine the correct suffix for the day
        const daySuffix = (day === 1 || day === 21 || day === 31) ? "st" :
                          (day === 2 || day === 22) ? "nd" :
                          (day === 3 || day === 23) ? "rd" : "th";
    
        return `${month} ${day}${daySuffix}`;
    };
    

    return (
        <>
            {publicTaskData ? (
                <div className={styles.public}>
                    <div className={styles.logo}>
                        <img src={logoimg} alt='logo' style={{ width: '51px' }} />&nbsp;&nbsp;&nbsp;Pro Manage
                    </div>
                    <br />
                    <div className={styles.cards}>
                        <div className={styles.priorityText}>
                            <img src={imgSrc} alt='priority' />&nbsp;&nbsp;{publicTaskData.priority}
                        </div>
                        <br />
                        <div className={styles.cardTitle}>
                            {publicTaskData.title}
                        </div>
                        <br /><br />
                        <div className={styles.checklist}>
                            Checklist ({funTotalChecksMarked()}/{funTotalChecks()})
                        </div>
                        <br />
                        <div className={styles.taskList}>
                            {publicTaskData.checklist?.map((check) => (
                                <PublicTaskList key={check.taskName} checked={check.completed} taskName={check.taskName} />
                            ))}
                            {console.log(publicTaskData.checklist)}
                        </div>
                        <br />
                        {publicTaskData.dueDate && (
                            <div className={styles.dueDateDiv}>
                                <span className={styles.dueDateTitle}>Due Date</span> &nbsp;&nbsp;&nbsp;
                                <span className={styles.dueDate}>{formatDate(publicTaskData.dueDate)}</span>
                                <h1></h1>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default Public;
