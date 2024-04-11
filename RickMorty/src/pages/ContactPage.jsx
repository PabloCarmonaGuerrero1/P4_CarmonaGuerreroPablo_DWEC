import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../pages_css/ContactPage.css";
import { useUser } from '../context/UserContext';

const ContactPage = () => {
  const [usernameValue, setUsername] = useState('');
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [quantityValue, setQuantityValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const getDate = () => {
      const x = new Date();
      let year = x.getFullYear();
      let day = x.getDate();
      let month = x.getMonth() + 1;
      return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    };
    setDateValue(getDate());
  }, []);

  const validateUsername = (value) => {
    if (!value.trim()) {
      return 'Username is required';
    }
    return '';
  };

  const validateText = (value) => {
    if (!value.trim()) {
      return 'Text is required';
    }
    return '';
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      return 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      return 'Invalid email address';
    }
    return '';
  };

  const validateDate = (value) => {
    if (!value.trim()) {
      return 'Date is required';
    }
    return '';
  };

  const validateQuantity = (value) => {
    if (!value) {
      return 'Please enter a number between 1 and 10';
    }
    return '';
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setErrors({ ...errors, username: validateUsername(value) });
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setTextValue(value);
    setErrors({ ...errors, text: validateText(value) });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailValue(value);
    setErrors({ ...errors, email: validateEmail(value) });
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setDateValue(value);
    setErrors({ ...errors, date: validateDate(value) });
  };

  const handleQuantityChange = (e) => {
    const value = Math.min(Math.max(Number(e.target.value), 1), 10);
    setQuantityValue(value);
    setErrors({ ...errors, quantity: validateQuantity(value) });
  };

  const handleCheckboxChange = (e) => {
    setCheckboxValue(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setFormSubmitted(true);
      toast.success('Form submitted successfully!');
      setTimeout(() => {
        setFormSubmitted(false);
        setUsername('');
        setTextValue('');
        setEmailValue('');
        setDateValue('');
        setQuantityValue('');
        setCheckboxValue(false);
      }, 3000);
    } else {
      toast.error('Please fill out all the required fields correctly!');
    }
  };

  const validateForm = () => {
    const usernameError = validateUsername(usernameValue);
    const textError = validateText(textValue);
    const emailError = validateEmail(emailValue);
    const dateError = validateDate(dateValue);
    const quantityError = validateQuantity(quantityValue);

    setErrors({
      username: usernameError,
      text: textError,
      email: emailError,
      date: dateError,
      quantity: quantityError
    });

    return !usernameError && !textError && !emailError && !dateError && !quantityError;
  };

  return (
    <div className='form-contact-page'>
      <ToastContainer />
      <form className="my-form" onSubmit={handleSubmit}>
        <h2>Contact us!</h2>
        <label>
          <p>Username</p>
          <input type="text" value={usernameValue} onChange={handleUsernameChange} />
          {errors.username && <span className="error">{errors.username}</span>}
        </label>

        <label>
          <p>Email</p>
          <input type="email" value={emailValue} onChange={handleEmailChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>
        <label>
          <p>Text</p>
          <textarea type="text" value={textValue} onChange={handleTextChange} />
          {errors.text && <span className="error">{errors.text}</span>}
        </label>
        <label>
          <p>Date</p>
          <input type="date" value={dateValue} onChange={handleDateChange} />
          {errors.date && <span className="error">{errors.date}</span>}
        </label>

        <label>
          <p>Experience</p>
          <input type="number" value={quantityValue} onChange={handleQuantityChange} min={1} max={10} />
          {errors.quantity && <span className="error">{errors.quantity}</span>}
        </label>

        <label>
          <p>Important</p>
          <input type="checkbox" checked={checkboxValue} onChange={handleCheckboxChange} />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ContactPage;
