import { useIsAuthenticated } from "@azure/msal-react";

import Alert from './ui/Alert';

const PageNotAccessible = () => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return (
      <div className="w-full px-4">
        <h2 className="my-6 text-2xl">Page not accessible to anonymous user</h2>
        <Alert severity="error" className="mx-2 p-4">
          Please login by clicking the <strong>LOGIN</strong> link in the upper right of this page.
        </Alert>
      </div>
    )
  }

  return null;
}

export default PageNotAccessible;
