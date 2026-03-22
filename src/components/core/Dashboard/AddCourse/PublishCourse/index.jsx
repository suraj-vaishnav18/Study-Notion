import React, { useEffect, useState } from 'react'
import IconBtn from '../../../../common/IconBtn';
import { useDispatch, useSelector } from 'react-redux';
import { COURSE_STATUS } from '../../../../../utils/constant';

import { useForm } from 'react-hook-form';
import { resetCourseState, setStep } from '../../../../../slices/courseSlice';
import { useNavigate } from 'react-router-dom';

import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';


const PublishCourse = () => {

    const { register, handleSubmit, setValue, getValues } = useForm();
    const [loading,setLoading]=useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {course}=useSelector((state)=>state.course);
    const {token}=useSelector((state)=>state.auth);

    useEffect(()=>{
        setValue("public",true);
        if(course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public",true);
        }
    },[])

    const goToCourses = () => {
      dispatch(resetCourseState())
      navigate("/dashboard/my-courses")
    }

    const goBack = () => {
        dispatch(setStep(2))
    }
    const handleCoursePublic=async ()=>{
        if( (course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||
            (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false) ){

            // already public course hai to navigate to gotoCourses(); rather than update the course
            goToCourses();

            return;
        }

        const formData = new FormData()
        formData.append("courseId", course._id)
        const courseStatus = getValues("public")
          ? COURSE_STATUS.PUBLISHED
          : COURSE_STATUS.DRAFT
        formData.append("status",courseStatus);
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        if (result) {
          goToCourses()
        }
        setLoading(false);
    }


    const onSubmit=(data)=>{
        handleCoursePublic();
    }

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">
            Publish Settings
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="">
                    <input 
                        type="checkbox" 
                        id="public"
                        {...register("public")}
                        className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                    />
                    <span className="ml-2 text-richblack-400">
                        Make this course as public
                    </span>
                </label>
            </div>

            <div className="ml-auto flex max-w-max items-center gap-x-4">
                <button
                    disabled={loading}
                    type="button"
                    onClick={goBack}
                    className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                >
                    Back
                </button>
                <IconBtn disabled={loading} text="Save Changes" />
            </div>
        </form>
    </div>
  )
}

export default PublishCourse
