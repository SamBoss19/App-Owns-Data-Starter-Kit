import React from 'react';
import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";

import PageNotAccessible from './../PageNotAccessible';

const Profile = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [showTokenClaims, setShowTokenClaims] = React.useState(false);

  if (!isAuthenticated) {
    return <PageNotAccessible />;
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4">
      <h2 className="my-6 text-2xl">User Profile</h2>

      <div className="rounded border border-gray-200 shadow-sm">
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className=" text-white">
              <th className="px-4 py-2 text-left font-medium">Profile Property</th>
              <th className="px-4 py-2 text-left font-medium">Value</th>
            </tr>
          </thead>
          <tbody className='text-white font-extralight'>
            {[
              ["name", account?.name],
              ["username", account?.username],
              ["localAccountId", account?.localAccountId],
              ["tenantId", account?.tenantId],
              ["homeAccountId", account?.homeAccountId],
              ["environment", account?.environment],
            ].map(([key, value]) => (
              <tr key={key as string} className="border-t border-gray-200">
                <th scope="row" className="px-4 py-2 text-left font-semibold">{key}</th>
                <td className="px-4 py-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="my-4 border-gray-200" />

      <button
        type="button"
        onClick={() => { setShowTokenClaims(!showTokenClaims); }}
        className="rounded px-3 py-1.5 text-sm font-medium uppercase text-brand hover:bg-brand/10"
      >
        {showTokenClaims ? "Hide Token Claims" : "Show Token Claims"}
      </button>

      {showTokenClaims && (
        <>
          <h3 className="my-3 text-xl">Token Claims</h3>
          <div className="rounded border border-gray-200 shadow-sm">
            <table className="mt-3 w-full border-collapse text-sm">
              <thead>
                <tr className="text-white">
                  <th className="px-4 py-2 text-left font-medium">Profile Property</th>
                  <th className="px-4 py-2 text-left font-medium">Value</th>
                </tr>
              </thead>
              <tbody className='text-white font-extralight' >
                {Object.keys(account.idTokenClaims).map((key) => (
                  <tr key={key} className="border-t border-gray-200">
                    <th scope="row" className="px-4 py-2 text-left font-semibold">{key}</th>
                    <td className="px-4 py-2">{(account.idTokenClaims[key] as string)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Profile;
