import { Route, Routes } from 'react-router-dom';
import MCQExamInterface from './components/MCQExamInterface';
import StartTestPage from './components/StartTestPage';
import FinishTest from './components/FinishTest';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartTestPage />} />
      <Route path="/mcq-exam" element={<MCQExamInterface />} />
      <Route path="/finish-test" element={<FinishTest />} />
    </Routes>
  );
}

export default App;
