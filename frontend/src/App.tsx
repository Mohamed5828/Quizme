import ExamCreationForm from "./forms/ExamCreationForm";
import React from 'react';

import setupInterceptors from './utils/axiosInterceptors';

function App() {
  const App: React.FC = () => {
    React.useEffect(() => {
      setupInterceptors();
    }, []);
  
  return (
    <>
      <ExamCreationForm />
    </>
  );
}

export default App;
