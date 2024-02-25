const mongoose=require("mongoose");

const Quiz = new mongoose.Schema(
  {  courseId:{
        type:String
     },
     topicId:{
        type:String
     },
     course_title:{
       type:String,
       required:true
     },
     topic_title:{
        type:String,
        required:true
     },
     questions:[
        {
          qid:{
             type:String
          },
          question:
          {
            type:String

          },
         options:{
            type:Array
        },
           
         correctAnswer:{
             type:String 
         }
        }
     ]
   }
  
);
const quiz=mongoose.model("quiz",Quiz);
module.exports=quiz;