import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import AllQuestionsPage from "./components/Viewers/AllQuestionsPage";
import ExamCreationForm from "./components/Forms/ExamCreationForm";

function App() {
  return (
    <Router>
      <>
        {/* <Navbar /> */}
        <Switch>
          <Route path="/" exact component={ExamCreationForm} />
          <Route path="/all-questions" component={AllQuestionsPage} />
        </Switch>
      </>
    </Router>
  );
}

export default App;
