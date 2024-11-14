import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MCQExamInterface() {
  const maxQuestionCnt = 6 ; 
  const [timeRemaining, setTimeRemaining] = useState(60 * 15); // 15 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();


  useEffect(()=>{
    if(location.state && location.state.question){
      const initialQuestion = location.state.question[0];
      setQuestions(initialQuestion);
      setCurrentQuestion(1);
    }
    else{
      console.log('fetching questions...')
    }
  },[location.state])

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => prevTime > 0 ? prevTime - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time in HH:MM:SS
  const formatTime = (time) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index); // Set the selected answer
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) { // Ensure an answer is selected before moving to the next question

      const currentQuestionData = questions;
      const selectedOption = currentQuestionData.options[selectedAnswer];
      const subjectID = currentQuestionData.sub_id;

      const data = {
        que_id:currentQuestionData.que_id,
        selected_opt_id:selectedOption.opt_id,
        subjectID:4,
        std_id : 1,
        quiz_id : 1
      }

      //send data to backend
      axios.post('http://localhost:5000/submitAnswer',data)
      .then(response=>{
        console.log('Answer submiited successfully',response.data);

      }).catch(error=>{
        console.error('error submitting answer',error);
      })


      const data2 = {
        questionNumber:currentQuestion,
        subjectID : 4,
        studentID : 1,
        quizID : 1
      }

      if(currentQuestion === maxQuestionCnt){
        console.log("max question count reached")
        navigate("/finish-test")
      }
      axios.post('http://localhost:5000/question',data2)
      .then(response=>{
        console.log('Recieved data successfully',response.data);
        setQuestions(response.data[0]);

      }).catch(error=>{
        console.error('error recieving data ',error);
      })
      setCurrentQuestion((prev) => (prev + 1) % 7); // Move to the next question
      setSelectedAnswer(null); // Reset the selected answer
    }
  };

  const handleSubmit = () => {
    alert("Submit functionality here!");
  };

  return (
    <div style={styles.container}>
      <div style={styles.quizBox}>
        <div style={styles.header}>
          <p>Time remaining: {formatTime(timeRemaining)}</p>
          <button
            style={{
              ...styles.submitButton,
              backgroundColor: selectedAnswer === null ? '#ccc' : '#2d2d2d', // Grayed out when not selected
              cursor: selectedAnswer === null ? 'not-allowed' : 'pointer', // Disable cursor when not selected
            }}
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null} // Disable button if no answer selected
          >
            {currentQuestion === 6 ? 'Submit' : 'Next'}
          </button>
        </div>
        <h3>Question {currentQuestion} of {6}</h3>
        <p>{questions?.text}</p>
        <div style={styles.options}>
          {questions?.options?.map((option, index) => (
            <button
              key={index}
              style={{
                ...styles.optionButton,
                backgroundColor: selectedAnswer === index ? '#cfcfcf' : 'white',
              }}
              onClick={() => handleAnswerSelect(index)} // Select option
            >
              {option.text}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#e0f7fa',
  },
  quizBox: {
    width: '60%',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#2d2d2d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  options: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginTop: '20px',
  },
  optionButton: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default MCQExamInterface;
