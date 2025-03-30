import React from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'


function StartTestPage() {
  const navigate = useNavigate();
  const handleStartTest = () => {
    axios.post('http://localhost:5000/question',{
      questionNumber : 0,
      subjectID : 1,
      studentID : 1,
      quizID : 1  
    }).then(response => {
      console.log('First question:', response.data);
      navigate('/mcq-exam', { state: { question: response.data } });
    })
    .catch(error => {
      console.error('Error starting the test:', error);
    });
    // navigate('/mcq-exam')
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={handleStartTest}>
        Start Test
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  button: {
    padding: '15px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

export default StartTestPage;
