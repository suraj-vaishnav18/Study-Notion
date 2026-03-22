const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");


// createRating
exports.createRating= async (req,res) =>{
    try{
        // get userid
        const userId=req.user.id;
        // featched from body
        const { rating, review, courseId}= req.body;
        // find Course to _id is same as courseId and
        // check if user is enrolled or not
        const courseDetails= await Course.findOne({
                                    _id:courseId,
                                    studentsEnrolled: {$elemMatch: {$eq: userId}}
                                    });
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'Student is Enrolled in the course',
            });
        }
        // check if user already reviewed the course
        const alreadyReviewed= await RatingAndReview.findOne({
                                                        user:userId,
                                                        course:courseId,
                                                    });
        if(alreadyReviewed){
            return res.status(404).json({
                success:false,
                message:"Course is Already Reviewed By User",
            });
        }
        // create rating and review
        const ratingReview= await RatingAndReview.create({
                                                    rating,
                                                    review,
                                                    course:courseId,
                                                    user:userId,
                                                });
        // update course with thid rating/review
        const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},
                                        {
                                            $push:{
                                                ratingAndReviews:ratingReview._id,
                                            }
                                        },
                                        {new:true}
                                        )
        console.log(updatedCourseDetails);
        // return responce 
        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


// getAverageRating
exports.getAverageRating = async (req,res) =>{
    try{
        // get courseId
        const courseId= req.body.courseId;

        // calculate avg Rating
        const result= await RatingAndReview.aggregate([
            {
                $match:{
                    // new mongoose.Types.ObjectId   use for string to convert Object id because db in ObjectId
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating: { $avg: "$rating" },
                }
            }
        ])

        // return rating
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }

        // if no rating/review exist
        return res.status(200).json({
            success:true,
            message:"Average rating is 0,because no rating/review exist",
        });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}