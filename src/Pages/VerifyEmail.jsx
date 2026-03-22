import React, { useEffect, useState } from 'react'
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate,Link } from 'react-router-dom';
import { sendOtp } from '../services/operations/authAPI';
import {BiArrowBack} from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { signUp } from '../services/operations/authAPI';

const VerifyEmail = () => {

  const {signupData,loading}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const [otp,setOtp]=useState("");

  useEffect(()=>{
    if(!signupData){
      navigate("/signup");
    }
    // [] ka meaning 1 render pe run hoga
  },[])

  const handleVerifyAndSignup=(e)=>{
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(signUp(
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      otp,
      navigate
    ))
  }


  return (
    <div>
      {
        loading ? (
          <div>
            <div className='spinner'></div>
          </div>
        ) : (
          <div>
            <h1>
              Verify Email
            </h1>
            <p>
            A verification code has been sent to you. Enter the code below
            </p>
            <form onSubmit={handleVerifyAndSignup}>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderInput={(props)=>(
                  <input
                    {...props}
                    placeholder='-'
                    style={{
                      boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                    className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                  />
                )}
                containerStyle={{
                  justifyContent: "space-between",
                  gap: "0 6px",
                }}
              />

              <button type='submit' className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900">
              Verify Email
              </button>
            </form>
            <div>
              <Link to="/signup">
                <p className="text-richblack-5 flex items-center gap-x-2">
                  <BiArrowBack /> Back To Signup
                </p>
              </Link>
              <button onClick={()=> dispatch(sendOtp(signupData.email,navigate))} className="flex items-center text-blue-100 gap-x-2">
                <RxCountdownTimer />
                Resend it
              </button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default VerifyEmail
