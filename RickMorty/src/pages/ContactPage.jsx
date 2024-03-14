import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../pages_css/ContactPage.css";

const ContactPage = () => {
  const [textValue, setTextValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [quantityValue, setQuantityValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmailValue(e.target.value);
  };

  const handleQuantityChange = (e) => {
    const newValue = Math.min(Math.max(Number(e.target.value), 1), 10);
    setQuantityValue(newValue);
  };

  const handleDateChange = (e) => {
    setDateValue(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setCheckboxValue(e.target.checked);
  };

  const validateForm = () => {
    let errors = {};
    if (!textValue.trim()) {
      errors.text = 'Text is required';
    }
    if (!emailValue.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      errors.email = 'Invalid email address';
    }
    if (!dateValue) {
      errors.date = 'Date is required';
    }
    if (!quantityValue) {
      errors.quantity = "Please enter a number between 1 and 10";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setFormSubmitted(true);
      setTextValue('');
      setEmailValue('');
      setDateValue('');
      setQuantityValue('');
      setCheckboxValue(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      toast.info("Are you here?", { autoClose: false }); 
    }, 6000000); 

    return () => {
      clearTimeout(timeoutId);
    };
  }, []); 

  return (
    <div className='form-contact-page'>
      <ToastContainer />
      <form className="my-form" onSubmit={handleSubmit}>
        <h2>Comment here!</h2>
        <label>
          Text
          <input type="text" value={textValue} onChange={handleTextChange} />
          {errors.text && <span className="error">{errors.text}</span>}
        </label>

        <label>
          Email
          <input type="email" value={emailValue} onChange={handleEmailChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>

        <label>
          Date
          <input type="date" value={dateValue} onChange={handleDateChange} />
          {errors.date && <span className="error">{errors.date}</span>}
        </label>

        <label>
          Experience
          <input type="number" value={quantityValue} onChange={handleQuantityChange} min={1} max={10} />
          {errors.quantity && <span className="error">{errors.quantity}</span>}
        </label>

        <label>
          Checkbox
          <input type="checkbox" checked={checkboxValue} onChange={handleCheckboxChange} />
        </label>

        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ContactPage;
