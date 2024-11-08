import React, { useState } from 'react';
import axios from 'axios';
import StyleSettingsForm from './SettingsForm.module.css';
import passEye from '../../../Assets/passEye.svg';
import { Url } from '../../../Utils/Url';
import { useDispatch } from 'react-redux';
import { toggleLoader } from '../../../Redux/slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsForm = () => {
    const baseUrl = Url();

    const [formData, setFormData] = useState({
        _id: localStorage.getItem('id'),
        name: '',
        email: '', // Added email field
        password: '',
        confirmPassword: '',
    });

    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        email: '', // Added email error state
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        let errorMessage = '';
        if (name === 'name') {
            errorMessage = value.trim() === '' ? 'Name is required' : '';
        } else if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            errorMessage = !emailRegex.test(value) ? 'Invalid email format' : '';
        } else if (name === 'password') {
            errorMessage = value.length < 8 ? 'Password must be at least 8 characters long' : '';
        } else if (name === 'confirmPassword') {
            errorMessage = value !== formData.password ? 'Passwords do not match' : '';
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    };

    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        dispatch(toggleLoader());
        try {
            const response = await axios.post(`${baseUrl}/api/updatesettings`, formData,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("response^^^^^^^", response.data);
            localStorage.setItem('name', response.data.updatedDocument.name);
            localStorage.setItem('email', response.data.updatedDocument.email); // Update localStorage for email
            dispatch(toggleLoader());
            if (formData.name === response.data.updatedDocument.name || 
                formData.email === response.data.updatedDocument.email ||
                formData.password === response.data.updatedDocument.password) {
                toast.success('Updated successfully!');
            }
        } catch (error) {
            console.error('Error updating settings:', error.response.data);
            dispatch(toggleLoader());
            toast.error('Error updating settings'); // Notify user of the error
        }
    };

    return (
        <div className={StyleSettingsForm.register}>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        className={StyleSettingsForm.inputName}
                        type="text"
                        name="name"
                        placeholder="         Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {formSubmitted && <span className={StyleSettingsForm.error}>{errors.name}</span>}
                </div>

                <div>
                    <input
                        className={StyleSettingsForm.inputEmail}
                        type="email"
                        name="email"
                        placeholder="         Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {formSubmitted && <span className={StyleSettingsForm.error}>{errors.email}</span>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexWrap: 'nowrap' }}>
                    <input
                        className={StyleSettingsForm.inputPassword}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="         Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <img
                        src={showPassword ? passEye : passEye}
                        alt={showPassword ? 'Hide Password' : 'Show Password'}
                        className={StyleSettingsForm.passwordIcon}
                        onClick={handleTogglePassword}
                        style={{ position: 'relative', left: '-40px' }}
                    />
                    {formSubmitted && <span className={StyleSettingsForm.error}>{errors.password}</span>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexWrap: 'nowrap' }}>
                    <input
                        className={StyleSettingsForm.inputPassword}
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="         Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <img
                        src={showConfirmPassword ? passEye : passEye}
                        alt={showConfirmPassword ? 'Hide Confirm Password' : 'Show Confirm Password'}
                        className={StyleSettingsForm.passwordIcon}
                        onClick={handleToggleConfirmPassword}
                        style={{ position: 'relative', left: '-40px' }}
                    />
                    {formSubmitted && <span className={StyleSettingsForm.error}>{errors.confirmPassword}</span>}
                </div>

                <button type="submit" className={StyleSettingsForm.updateButton}>
                    Update
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default SettingsForm;
