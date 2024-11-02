import React from 'react'
import StylesLeftPart from './LeftPart.module.css'

const LeftSideBar = () => {
    return (
        <div className={StylesLeftPart.leftSideBar} >
            <div>
                <div><img src='Assets/Art.svg' alt='Art' style={{ width: '100%' }} /></div>
                <div className={StylesLeftPart.font}>
                    <div className={StylesLeftPart.font1}>Welcome aboard my friend</div>
                    <div className={StylesLeftPart.font2}>just a couple of clicks and we start</div>
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar;