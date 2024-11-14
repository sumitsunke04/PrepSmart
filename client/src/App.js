import { Route, Routes } from 'react-router-dom';
import MCQExamInterface from './components/MCQExamInterface';
import StartTestPage from './components/StartTestPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartTestPage />} />
      <Route path="/mcq-exam" element={<MCQExamInterface />} />
    </Routes>
  );
}

export default App;
