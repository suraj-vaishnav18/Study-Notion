import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import GetAvgRating from '../../../utils/avgRating';
import RatingStars from '../../common/RatingStars';


const Course_Card = ({course,Height}) => {

    const [avgReviewCount,setAvgReviewCount]=useState(0);

    useEffect(()=>{
        const count=GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course]);


  return (
    <>
        <Link to={`/courses/${course._id}`}>
            <div className="">
                <div className="rounded-lg">
                    <img 
                        src={course?.thumbnail}
                        alt="course thumbnail"
                        className={`${Height} w-full rounded-xl object-cover `}
                    />
                </div>

                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-sm text-richblack-50">{course?.courseName}</p>
                    <p className="text-sm text-richblack-50">
                        {course?.instructor?.firstName} {course?.instructor?.lastName}
                    </p>
                    <div className="flex items-center gap-2">
                        <span>{avgReviewCount || 0 }</span>
                        <RatingStars Review_Count={avgReviewCount} />
                        <span>
                            {course?.ratingAndReviews?.length} Ratings
                        </span>

                    </div>
                </div>
                <p className="text-xl text-richblack-5">Rs . {course?.price}</p>
            </div>
        </Link>
      
    </>
  )
}

export default Course_Card
