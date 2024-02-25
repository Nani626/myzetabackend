require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const quiz = require('./models/Qiuzquestions');

const app = express();

app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB");
   
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });



//to add new questions
// app.post('/quiz/questions', async (req, res) => {
//   try {
//     const {course_title, topic_title, questions } = req.body;
//     const newQuiz = new quiz({
//       course_title,
//       topic_title,
//       questions
//     });

//     const savedQuiz = await newQuiz.save();

//     res.status(201).json(savedQuiz);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });





//to get the existing questions
app.get('/quiz/questions', async (req, res) => {
  try {
    const { course_title, topic_title } = req.query;
    console.log(course_title,topic_title);

    const quizzes = await quiz.find({ course_title, topic_title });

    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/quiz/questions/add', async (req, res) => {
  try {
    const { course_title, topic_title, questions } = req.body;

    const updatedQuiz = await quiz.findOneAndUpdate(
      { course_title, topic_title },
      { $push: { questions: { $each: questions } } },
      { upsert: true, new: true }
    );

    res.json(updatedQuiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});




app.delete('/quiz/questions', async (req, res) => {
  try {
    const { course_title, topic_title } = req.query;

    // Find the quiz document to delete
    const deletedQuiz = await quiz.findOneAndDelete({ course_title, topic_title });

    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully', deletedQuiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//delete  a single question with question id
app.delete('/quiz/questions', async (req, res) => {
  try {
    const { course_title, topic_title, qid } = req.query;

    
    const quizToUpdate = await quiz.findOne({ course_title, topic_title });

    if (!quizToUpdate) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
     //filter mehtod
    quizToUpdate.questions = quizToUpdate.questions.filter(question => question.qid !== qid);

    
    const updatedQuiz = await quizToUpdate.save();

    res.json({ message: 'Question deleted successfully', updatedQuiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
   

//update the single question
app.put('/quiz/updatequestion', async (req, res) => {
  try {
    console.log(req.body)
    const { course_title, topic_title, qid, question, options, correctAnswer } = req.body;

    
    const quizToUpdate = await quiz.findOne({ course_title, topic_title });

    if (!quizToUpdate) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Find the index of the question with the specified qid
    const questionIndex = quizToUpdate.questions.findIndex(q => q.qid === qid);

    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found in the quiz' });
    }

    
    quizToUpdate.questions[questionIndex] = { qid, question, options, correctAnswer };

    
    const updatedQuiz = await quizToUpdate.save();

    res.json({ message: 'Question updated successfully', updatedQuiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }});
