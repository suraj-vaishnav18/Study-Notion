import React, { useEffect, useState } from 'react'
import RenderSteps from '../AddCourse/RenderSteps'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';

const EditCourse = () => {

    const [loading,setLoading]=useState(false);
    const { course }=useSelector((state)=>state.course);
    const { courseId}=useParams();
    const {token}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();

    useEffect( ()=>{
      const getCourseFullDetails=async ()=>{
        setLoading(true);
        const result=await getFullDetailsOfCourse(courseId, token);

        if(result?.courseDetails){
            dispatch(setEditCourse(true));
            dispatch(setCourse(result?.courseDetails));
        }
        setLoading(false);
        
      }
      getCourseFullDetails();
        
    },[])


    if (loading) {
      return (
        <div className="grid flex-1 place-items-center">
          <div className="spinner"></div>
        </div>
      )
    }
  return (
    <div>
        <h1>
            Edit Course
        </h1>
        <div>
            {
                course ? (
                    <RenderSteps/>
                ) : (
                    <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
                        Course not found
                    </p>
                )
            }
        </div>
    </div>
  )
}

export default EditCourse
