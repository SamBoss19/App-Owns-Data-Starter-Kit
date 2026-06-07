import { useNavigate } from 'react-router-dom';

import Alert from './ui/Alert';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full px-4">
      <h2 className="my-6 text-2xl">The request page cannot be found</h2>
      <Alert severity="error" className="mx-2 p-4">
        The following URL is not valid: <strong>{document.URL}</strong>
      </Alert>
      <button
        type="button"
        onClick={() => { navigate("/"); }}
        className="mt-6 rounded px-3 py-1.5 text-sm font-medium uppercase text-brand hover:bg-brand/10"
      >
        Go to home page
      </button>
    </div>
  )
};

export default PageNotFound;
