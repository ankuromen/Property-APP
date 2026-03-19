import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import PropertyDetail from './pages/PropertyDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
          <Route path="property/:id" element={<PropertyDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
