
import { Routes, Route } from 'react-router-dom';
import { mainRoutes } from './routes';

function App() {
    return (
        <Routes>
            {mainRoutes.map((route) => {
                const Page = route.element;
                return <Route key={route.path} path={route.path} element={ <Page />} />;
            })}
            <Route path="*" element={<div>404</div>} />
        </Routes>
    );
}

export default App;
