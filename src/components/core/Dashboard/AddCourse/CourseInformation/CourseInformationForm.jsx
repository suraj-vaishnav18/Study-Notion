import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { setCourse, setStep } from '../../../../../slices/courseSlice';
import Upload from '../Upload';
import { toast } from "react-hot-toast"
import {COURSE_STATUS} from "../../../../../utils/constant"
import ChipInput from './ChipInput';
import IconBtn from '../../../../common/IconBtn';
import { MdNavigateNext } from "react-icons/md"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import RequirementsField from './RequirementsField';
import {featchCourseCategories,addCourseDetails,editCourseDetails} from "../../../../../services/operations/courseDetailsAPI"

const CourseInformationForm = () => {

    const dispatch=useDispatch();
    const [loading,setLoading]=useState(false);
    const [courseCategories,setCourseCategories]=useState([]);
    const {editCourse,course}=useSelector((state)=>state.course);
    const {token}=useSelector((state)=>state.auth);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
    } =useForm();

    useEffect(()=>{
        const getCategories= async ()=>{
            setLoading(true);
            const categories=await featchCourseCategories()
            if(categories.length >0){
                setCourseCategories(categories);
            }
            setLoading(false);
        }
        if(editCourse){
            setValue("courseTitle",course.courseName);
            setValue("courseShortDesc",course.courseDescription)
            setValue("coursePrice",course.price);
            setValue("courseTags",course.tag);
            setValue("courseBenefits",course.whatYouWillLearn);
            setValue("courseCategory",course.category);
            setValue("courseRequirements",course.instructions);
            setValue("courseImage",course.thumbnail);
        }
        getCategories();
    },[])

    const isFormUpdated = ()=>{
        const currentValues=getValues();
        if(
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags !== course.tag ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory !== course.category ||
            currentValues.courseRequirements !== course.instructions ||
            currentValues.courseImage !== course.thumbnail
        ){
            return true
        }
        return false
    }

    const onSubmit= async (data)=>{
        if(editCourse){
            if(isFormUpdated()){
                const currentValues=getValues();
                const formData=new FormData();
                formData.append("courseId",course._id);
                if(currentValues.courseTitle !== course.courseName){
                    formData.append("courseName", data.courseTitle)
                }
                if (currentValues.courseShortDesc !== course.courseDescription) {
                  formData.append("courseDescription", data.courseShortDesc)
                }
                if (currentValues.coursePrice !== course.price) {
                  formData.append("price", data.coursePrice)
                }
                if (currentValues.courseTags.toString() !== course.tag.toString()) {
                  formData.append("tag", JSON.stringify(data.courseTags))
                }
                if (currentValues.courseBenefits !== course.whatYouWillLearn) {
                  formData.append("whatYouWillLearn", data.courseBenefits)
                }
                if (currentValues.courseCategory._id !== course.category._id) {
                  formData.append("category", data.courseCategory)
                }
                if(currentValues.courseRequirements.toString() !==
                course.instructions.toString()){
                    formData.append(
                        "instructions",
                        JSON.stringify(data.courseRequirements)
                    )
                }
                if (currentValues.courseImage !== course.thumbnail) {
                    formData.append("thumbnailImage", data.courseImage)
                }
                setLoading(true)
                const result=await editCourseDetails(formData, token);
                setLoading(false);
                if(result){
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                }
            }
            else{
                toast.error("No changes in course form")
            }
            return ;

        }

        const formData=new FormData();

        formData.append("courseName",data.courseTitle);
        formData.append("courseDescription",data.courseShortDesc);
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)

        setLoading(true);

        
        const result=await addCourseDetails(formData,token);
        
        if(result){
            dispatch(setStep(2))
            dispatch(setCourse(result))
        }

        setLoading(false);

    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
        <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="courseTitle">
                Course Title <sup className="text-pink-200">*</sup>
            </label>
            <input 
                type="text"
                id="courseTitle"
                placeholder='Enter Course Title'
                {
                    ...register("courseTitle",{required:true})
                }
                className="form-style w-full"
            />
            {
                errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Title is Required
                    </span>
                )
            }

            {/* Course Short Description */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
                    Course Short Description <sup className="text-pink-200">*</sup>
                </label>
                <textarea 
                    id="courseShortDesc"
                    placeholder='Enter Short Desciption'
                    {...register("courseShortDesc",{required:true})}
                    className="form-style resize-x-none min-h-[130px] w-full"
                />
                {errors.courseShortDesc && (
                    <span>
                        Course Description is Required
                    </span>
                )}
            </div>

            {/* Course Price */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="coursePrice">
                    Course Price <sup className="text-pink-200">*</sup>
                </label>
                <div className="relative">
                    <input 
                        type="text" 
                        id="coursePrice"
                        placeholder='Enter Course Price'
                        {...register("coursePrice",{
                            required:true,
                            valueAsNumber:true,
                            pattern: {
                                value: /^(0|[1-9]\d*)(\.\d+)?$/,
                            },
                        })}
                        className="form-style w-full !pl-12"
                    />
                </div>
            </div>
            {/* Course Category  */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseCategory">
                    Course Category <sup className="text-pink-200">*</sup>
                </label>
                <select 
                    {...register("courseCategory",{required:true})}
                    defaultValue=""
                    id="courseCategory"
                    className="form-style w-full"
                >
                    <option value="" disabled>
                        Choose a Category
                    </option>
                    {
                        !loading && 
                        courseCategories?.map((category,index) =>(
                            <option value={category?._id} key={index}>
                                {category?.name}
                            </option>
                        ))
                    }
                </select>
                {errors.courseCategory && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Category is required
                    </span>
                )}
            </div>
            {/* Course Tags  */}
            <ChipInput 
                label="Tags"
                name="courseTags"
                placeholder="Enter Tags and press Enter"
                register={register}
                errors={errors}
                setValue={setValue}
            />
            {/* Course Thumbnail Image */}
            <Upload
                name="courseImage"
                label="Course Thumbnail"
                register={register}
                setValue={setValue}
                errors={errors}
                editData={editCourse ? course?.thumbnail : null}
            />
            {/* Benefits of the course */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
                Benefits of the course <sup className="text-pink-200">*</sup>
                </label>
                <textarea
                id="courseBenefits"
                placeholder="Enter benefits of the course"
                {...register("courseBenefits", { required: true })}
                className="form-style resize-x-none min-h-[130px] w-full"
                />
                {errors.courseBenefits && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Benefits of the course is required
                </span>
                )}
            </div>

            {/* Requirements/Instructions */}
            <RequirementsField
                name="courseRequirements"
                label="Requirements/Instructions"
                register={register}
                setValue={setValue}
                errors={errors}
            />
            {/* Next Btn */}
            <div>
                {
                    editCourse && (
                        <button
                            onClick={()=> dispatch(setStep(2))}
                            disabled={loading}
                            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                        >
                            Continue Wihout Saving
                        </button>
                    )
                }
                <IconBtn 
                    disabled={loading}
                    text={!editCourse ? "Next" : "Save Changes"}
                >
                    <MdNavigateNext />
                </IconBtn>
            </div>
        </div>
    </form>
  )
}

export default CourseInformationForm
