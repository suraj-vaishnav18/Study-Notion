import React, { useEffect, useState } from 'react'
import CoursesTable from './InstructorCourses/CoursesTable'
import { useSelector } from 'react-redux';
import { VscAdd } from "react-icons/vsc"
import { useNavigate } from 'react-router-dom';
import {fetchInstructorCourses} from "../../../services/operations/courseDetailsAPI"
import IconBtn from '../../common/IconBtn';

const MyCourses = () => {

    const [courses,setCourses]=useState([]);    
    const navigate=useNavigate();
    const {token}=useSelector((state)=>state.auth);

    useEffect(()=>{
        const featchCourses = async ()=>{
            const result=await fetchInstructorCourses(token);
            if(result){
                setCourses(result);
            }
        }
        featchCourses();
    },[])
  return (
    <>
      <div className="mb-14 flex flex-col items-center justify-between"> 

        <div className='flex items-center '>
          <h1 className="text-3xl font-medium text-richblack-5 mr-[650px] pb-[50px]">My Courses</h1> 
          
          <IconBtn
              text="Add Course"
              onclick={() => navigate("/dashboard/add-course")}
              className="mr-[100px]"
          >
              <VscAdd />
          </IconBtn>

        </div>
        
        {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
      </div>
    </>
  )
}

export default MyCourses
