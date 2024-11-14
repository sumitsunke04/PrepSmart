import React, { useState } from 'react';

function FinishTest() {
  

  return (
    <div style={styles.container}>
        <div style={styles.thankYouMessage}>
          Thank you for attempting the test!
        </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
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
    margin: '10px',
  },
  thankYouMessage: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default FinishTest;
