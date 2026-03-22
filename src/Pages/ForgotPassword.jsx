import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BiArrowBack } from "react-icons/bi"
import { useState } from 'react';
import { getPasswordResetToken } from '../services/operations/authAPI';
import { Link } from 'react-router-dom';


const ForgotPassword = () => {
    const dispatch=useDispatch();
    const {loading}=useSelector((state)=>state.auth);
    const [email,setEmail]=useState();
    const [emailSent,setEmailSent]=useState(false);

    const handleOnSubmit=(e)=>{
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent))
    }
  return (
    <div>
      {
        loading ? (
            <div className='spinner'></div>
        ) : (
            <div>
                <h1>
                    {!emailSent ? "Reset your password" : "Check email"}
                </h1>
                <p>
                    {
                        !emailSent ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery" : `We have sent the reset email to ${email}`
                    }
                </p>
                <form  onSubmit={handleOnSubmit}>
                {/* Because of Only "not emailSent" in show a input field of email */}
                    {
                        !emailSent && (
                            <label >
                                <p>
                                    Email Address <sup className="text-pink-200">*</sup>
                                </p>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    placeholder='Enter Email Address'
                                    className="form-style w-full"
                                />
                            </label>
                        )
                    }
                    <button type="submit"
                            className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">
                        {
                            !emailSent ? "Submit" : "Resend Email"
                        }
                    </button>
                </form>
                <div>
                    <Link to="/login">
                        <p>
                            <BiArrowBack /> Back To Login
                        </p>
                    </Link>
                </div>
            </div>
        )
      }
    </div>
  )
}

export default ForgotPassword
