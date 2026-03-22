const Course= require("../models/Course");
const Category =require("../models/Category");
const User=require("../models/User");
const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const {uploadImageCloudinary}=require("../utils/imageUploader");
const { json } = require("react-router-dom");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");
require("dotenv").config();

// creatCourse Handler Function
exports.createCourse=async (req,res)=>{
    try{
        // featch data from req ki body because of User in middlerware in varify in decode of payload in id present to featch
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            category,
            status,
            instructions,
        }=req.body;
        // get thumbnail
        const thumbnail=req.files.thumbnailImage;
        console.log("Thumnail image : ",thumbnail);

        // validation
        if(!courseName || !courseDescription || !tag || !whatYouWillLearn || !price   || !thumbnail){
            return res.status(400).json({
                success:false,
                message:'All fields are require',
            });
        }
        if (!status || status === undefined) {
			status = "Draft";
		}
        // check for instructor
        const userId=req.user.id;//from payload in JWT token
        const instructorDetails=await User.findById(userId,{
			accountType: "Instructor",
		});
        // findById(findId,Condition of Id find)
        console.log("Instructor Deatails :",instructorDetails);
        // ToDO: verify userid and instructorDetails._id are same or diffrent ?

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:'Instructor details is not found',
            });
        }

        // check tag is valid or not
        const categoryDetails=await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:'Category details is not found',
            });
        }

        // Upload Image top cloudinary
        const thumbnailImage=await uploadImageCloudinary(thumbnail,process.env.FOLDER_NAME);

        // create and entry for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            // above instructorDetails are featch by id because storoe in User schema
            instructor : instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag : tag,
            category:categoryDetails._id,
            thumbnail : thumbnailImage.secure_url,
            status:status,
            instructions: instructions,
        })

        // add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true},
        )
        // findByIdAndUpdate(find Id is same instructorDetails.Id, than Update date mean push id in array of course)

        // update the Categories ka Schema
        await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					courses: newCourse._id,
				},
			},
			{ new: true }
		);

        // return responce
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed To be created Course",
            error:error.message,
        })

    }
}

exports.editCourse =async (req,res)=>{
    try{
        const {courseId}=req.body;
        const updates=req.body;
        const course=await Course.findById(courseId);

        if(!course){
            return res.status(404).json({error:"Course can not found"})
        }

        if(req.files){
            console.log("thumbnail Updates");
            const thumbnail = req.files.thumbnailImage
            const thumbnailImage= await uploadImageCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            )
            course.thumbnail = thumbnailImage.secure_url;
        }


        for(const key in updates){
            if(updates.hasOwnProperty(key)){
                if(key=== "tag" || key=== "instructions"){
                    course[key] = JSON.parse(updates[key]);
                } else{
                    course[key] = updates[key]
                }
            }
        }

        await course.save();

        const updatedCourse= await Course.findOne({
            _id: courseId,
        })
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails",
            }
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        }).exec();

        res.json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        })

    }
    catch(error){
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

// getAllCourses Handler Function
exports.getAllCourses=async (req,res)=>{
    try{
        // TODO:Chnage the below statement incrementally
        const allCourses=await Course.find({},{
                                                courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentsEnrolled:true,
                                            }).populate("instructor").exec();
        
        return res.status(200).json({
            success:true,
            message:'Data for all course featched successfully',
            data:allCourses,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Can not feach All Data",
            error:error.message,
        })
    }
}

// getCourseDetails
exports.getCourseDetails = async (req,res) =>{
    try{
        // get id
        const {courseId}= req.body;
        // find course details
        const courseDetails= await Course.find(
                                        {_id:courseId}
                                    )
                                    .populate(
                                        {
                                            path:"instructor",
                                            populate:{
                                                path:"additionalDetails",
                                            },
                                        }
                                    )
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"subSection",
                                        },
                                    })
                                    .exec();

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course with the ${courseId}`,
            });
        }
        // responce
        return res.status(200).json({
            success:true,
            message:"Course Details featched Successfully",
            data:courseDetails,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

exports.getInstructorCourses=async (req,res)=>{
    try{
        const instructorId=req.user.id;

        // Find all courses belonging to the instructor
        const instructorCourses=await Course.find({
            instructor: instructorId,
        }).sort({createdAt:-1});

        res.status(200).json({
          success: true,
          data: instructorCourses,
        })

    }
    catch(error){
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: error.message,
        })
    }
}

// Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }


  
exports.getFullCourseDetails = async (req,res) =>{
    try{
        const { courseId} =req.body;
        const userId=req.user.id;
        const courseDetails= await Course.findOne( {_id:courseId,}).populate({
                                                                        path: "instructor",
                                                                        populate: {
                                                                            path: "additionalDetails",
                                                                        },
                                                                    })
                                                                    .populate("category")
                                                                    .populate("ratingAndReviews")
                                                                    .populate({
                                                                        path: "courseContent",
                                                                        populate: {
                                                                        path: "subSection",
                                                                        },
                                                                    })
                                                                    .exec()
            
        let courseProgressCount = await CourseProgress.findOne({courseID: courseId,userId: userId,})

        console.log("courseProgressCount",courseProgressCount);

        if(!courseDetails){
            return res.status(400).json({
              success: false,
              message: `Could not find course with id: ${courseId}`,
            })
        }

        let totalDeurationInSeconds = 0;
        courseDetails.courseContent.forEach( (content) =>{
            content.subSection.forEach((subSection) =>{
                const timeDurationInSeconds= parseInt(subSection.timeDuration);
                totalDeurationInSeconds += timeDurationInSeconds;
            })
        })

        const totalDuration= convertSecondsToDuration(totalDeurationInSeconds);

        return res.status(200).json({
            success:true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos : courseProgressCount?.completedVideos ? 
                                  courseProgressCount?.  completedVideos : [],
            },
        })

    }
    catch(error){
        return res.status(500).json({
          success: false,
          message: error.message,
        })
    }
}