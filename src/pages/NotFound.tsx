import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-h2 text-cool-900 mb-2">404</h1>
      <p className="text-body2 text-cool-500 mb-6">Page not found</p>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2.5 rounded-lg bg-plum-600 text-white text-body3 font-medium hover:bg-plum-700 transition-colors"
      >
        Back to Overview
      </button>
    </div>
  );
}
