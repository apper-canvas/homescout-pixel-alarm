import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from '@/components/organisms/Header';
import HomePage from '@/components/pages/HomePage';
import PropertyDetailPage from '@/components/pages/PropertyDetailPage';
import SavedPropertiesPage from '@/components/pages/SavedPropertiesPage';
import ComparePage from '@/components/pages/ComparePage';
import MortgageCalculatorPage from '@/components/pages/MortgageCalculatorPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/saved" element={<SavedPropertiesPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/mortgage-calculator" element={<MortgageCalculatorPage />} />
          </Routes>
        </main>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;