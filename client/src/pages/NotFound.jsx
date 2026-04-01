import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-4 font-sans fade-in">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-200 text-center max-w-lg w-full">
        <div className="mb-8">
          <LoadingSpinner />
        </div>
        <h1 className="text-6xl font-extrabold text-primary mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed font-medium">The page you're looking for doesn't exist or has been moved.</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dull transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 w-full"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;