import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StartTestPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginAndStartTest = async () => {
    try {
      // Step 1: Login
      const loginResponse = await axios.post('http://localhost:5000/login', {
        username,
        password
      });

      console.log('login res :',loginResponse)
      const token = loginResponse.data;
      console.log('token',token)
      localStorage.setItem('token', token); // store token for future API calls
      

      // Decode token to get studentID (you could also make a /me route if preferred)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload)
      const studentID = payload.std_id;
      console.log(studentID)
      localStorage.setItem('studentID',studentID)
      // Step 2: Start the test
      const questionResponse = await axios.post(
        'http://localhost:5000/question',
        {
          questionNumber: 0,
          subjectID: 1,   // or let the student select this
          studentID,
          quizID: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 3: Navigate to MCQ page with first question
      navigate('/mcq-exam', { state: { question: questionResponse.data } });

    } catch (error) {
      console.error('Login or test start failed:', error);
      alert('Invalid username or password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.heading}>Login to Start Test</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLoginAndStartTest} style={styles.button}>
          Login & Start Test
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  form: {
    padding: 40,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    width: 320,
  },
  heading: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px 0',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 5,
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

export default StartTestPage;
