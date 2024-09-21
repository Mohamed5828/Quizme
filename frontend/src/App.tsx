import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import AllQuestionsPage from "./components/Viewers/AllQuestionsPage";

function App() {
  return (
    <Router>
      <>
        {/* <Navbar /> */}
        <Switch>
          <Route path="/" exact component={AllQuestionsPage} />
          <Route path="/all-questions" component={AllQuestionsPage} />
        </Switch>
      </>
    </Router>
  );
}

export default App;
