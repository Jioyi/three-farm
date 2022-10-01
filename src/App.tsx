import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Views
import Game from './Views/Game';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Game />} />
            </Routes>
        </Router>
    );
};

export default App;
