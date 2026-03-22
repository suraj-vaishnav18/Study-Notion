const Section=require("../models/Section");
const Course=require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req,res) =>{
    try{
        //data featch
        const {sectionName,courseId}=req.body;
        // validate Data
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }
        // create section
        const newSection= await Section.create({sectionName});
        // update course with section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent:newSection._id,
                                                }
                                            },
                                            {new:true},
                                            ).populate({
                                                path: "courseContent",
                                                populate:{
                                                    path:"subSection",
                                                },
                                            }).exec();
        // return responce 
        return res.status(200).json({
            success:true,
            message:'Section created Successfully',
            data:updatedCourseDetails,
        });
    }
    catch(error){
        return req.status(500).json({
            success:false,
            message:"Unable to create section try again!",
            error:error.message,
        });
    }
}

exports.updateSection= async (req,res) =>{
    try{
        // data input
        const {sectionName,sectionId,courseId}=req.body;

        // validate data
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }

        // Update Data
        const section= await Section.findByIdAndUpdate(sectionId, {sectionName},{new:true});

        const course=await Course.findById(courseId).populate({
                                                        path:"courseContent",
                                                        populate:{
                                                            path:"subSection",
                                                        }
                                                    }).exec();

        // return res
        return res.status(200).json({
            success:true,
            message:`Section Updated Successfully ${section}`,
            data:course,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to update Section, please try again",
            error:error.message,
        });
    }
}

exports.deleteSection= async (req,res) =>{
    try{
        const {sectionId,courseId}=req.body;
        await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent: sectionId,
            }
        })

        const section=await Section.findById(sectionId);
        if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

        await SubSection.deleteMany({_id : {$in: section.subSection}})

        await Section.findByIdAndDelete(sectionId);

        const course=await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            }
        }).exec();

        res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section, please try again",
            error:error.message,
        });
    }
}
