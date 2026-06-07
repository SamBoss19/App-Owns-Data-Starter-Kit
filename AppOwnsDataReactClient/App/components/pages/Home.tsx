import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";
import { BadgeAlert, TriangleAlert } from 'lucide-react';
import { AppContext } from "../../AppContext";

import Assessment from '@mui/icons-material/Assessment';
import Schema from '@mui/icons-material/Schema';

import Alert from './../ui/Alert';
import DataLoading from './../DataLoading';

import { PowerBiReport, PowerBiDataset } from '../../models/models';

const WELCOME = "Welcome to the Mikano International Analytics Portal";

const Home = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const navigate = useNavigate();
  const { embeddingData } = useContext(AppContext);

  if (!isAuthenticated) {
    return (
      <div className=" px-4 font-light text-white ">
        <h2 className="my-6 text-2xl">{WELCOME}</h2>
        <p className="mb-6">
          This platform serves as the centralized hub for managing Mikano's data environment and embedded Power BI reporting. It streamlines the provisioning of departmental workspaces, automates dashboard integrations, and allows administrators to securely assign access permissions across the organization.
        </p>
       <div className='flex gap-x-2 p-4 w-1/3  bg-themedred/20  rounded-md '>
         <BadgeAlert /> <p>Click the <strong>sign in</strong> link in the upper right to access your reports.</p>
       </div>
      </div>
    )
  }

  if (isAuthenticated && embeddingData.user && !embeddingData.tenantName) {
    return (
      <div className="px-4">
        <h2 className="my-6 text-2xl">{WELCOME}</h2>
        <div className='flex px-4 py-2.5 rounded-md gap-x-2 text-yellow-100 '>
          <TriangleAlert />
          <p>Your user account has not been assigned to a department workspace. You will
          not have access to any reports until your user account has been assigned.</p>
        </div>
      </div>
    )
  }

  if (embeddingData.workspaceArtifactsLoading) {
    return <DataLoading />
  }

  const sessionRows: [string, string, boolean?][] = [
    ["User Login:", account?.username, true],
    ["User Display Name:", account?.name, true],
    ["Tenant Name:", embeddingData.tenantName, true],
    ["User can edit content:", String(embeddingData.userCanEdit)],
    ["User can create content:", String(embeddingData.userCanCreate)],
  ];

  const contentList = (items: (PowerBiReport | PowerBiDataset)[] | null, Icon: typeof Assessment) => (
    <ul className="list-none border border-[#CCCCCC]  p-0">
      {items?.map((item) => (
        <li key={item.id} className=" border-b border-gray-300 last:border-b-0">
          <button
            type="button"
            onClick={() => { navigate("/reports/" + item.id); }}
            className="flex w-full items-center gap-3 px-3 py-1.5 text-left hover:bg-gray-200"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <Icon fontSize="small" />
            </span>
            <span className="text-sm">{item.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4">
      <h2 className="my-6 text-2xl">{WELCOME}</h2>

      <Alert severity="info">
        Now that you have logged in, you can use the left navigation menu to navigate to the reports accessible within your department.
      </Alert>

      <h4 className="mt-4 mb-1.5 text-lg font-medium">Login Session Info:</h4>

      <div className="border border-gray-300 ]">
        <table className="w-full min-w-[650px] border-collapse text-sm">
          <tbody>
            {sessionRows.map(([label, value]) => (
              <tr key={label} className="border-b border-gray-300 last:border-b-0">
                <td className="w-[200px] px-3 py-1.5 align-top">{label}</td>
                <td className="px-3 py-1.5"><strong>{value}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="mt-4 mb-2 border-b border-gray-400 text-lg font-medium">Tenant Contents</h4>

      <div className="flex">
        <div className={embeddingData.userCanCreate ? "w-1/2 pr-1" : "w-full"}>
          <div className="rounded-t bg-brand-gradient px-3 py-1 text-xl text-white">Reports</div>
          {embeddingData.reports && contentList(embeddingData.reports, Assessment)}
        </div>
        {embeddingData.userCanCreate && (
          <div className="w-1/2 pl-1">
            <div className="rounded-t bg-brand-gradient px-3 py-1 text-xl text-white">Datasets</div>
            {embeddingData.datasets && contentList(embeddingData.datasets, Schema)}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home;
