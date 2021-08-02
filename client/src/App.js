import { BrowserRouter as Router, Route } from "react-router-dom";
import PageRender from "./PageRender";

function App() {
  return (
    <Router>
      <div className='app'>
        <Route exact path='/:page' component={PageRender} />
        <Route exact path='/:page/:id' component={PageRender} />
      </div>
    </Router>
  );
}

export default App;
