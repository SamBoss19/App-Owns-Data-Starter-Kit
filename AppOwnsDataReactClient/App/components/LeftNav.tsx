import { useState, useContext } from 'react';
import { useIsAuthenticated } from "@azure/msal-react";
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../AppContext";

import MenuIcon from '@mui/icons-material/Menu';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchemaIcon from '@mui/icons-material/Schema';

import { PowerBiReport, PowerBiDataset } from '../models/models';

import DataLoading from './DataLoading';

const LeftNav = () => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const { embeddingData } = useContext(AppContext);

  const expandedLeftNavWidth = 240;
  const colapsedLeftNavWidth = 48;
  const [leftNavWidth, setLeftNavWidth] = useState(expandedLeftNavWidth);
  const [leftNavExpanded, setLeftNavExpanded] = useState(true);

  const toggleLeftNavWidth = () => {
    if (leftNavExpanded) {
      setLeftNavExpanded(false);
      setLeftNavWidth(colapsedLeftNavWidth);
    }
    else {
      setLeftNavExpanded(true);
      setLeftNavWidth(expandedLeftNavWidth);
    }
  };

  const show = isAuthenticated && embeddingData.tenantName && !embeddingData.workspaceArtifactsLoading;
  if (!show) return null;

  const renderList = (items: (PowerBiReport | PowerBiDataset)[] | null, accentColor: string) => (
    <ul className="m-0 w-full list-none p-0 pb-2">
      {items?.map((item) => {
        const active = document.URL.includes(item.id);
        return (
          <li
            key={item.id}
            onClick={() => { navigate("/reports/" + item.id); }}
            className="w-full cursor-pointer py-1 pl-1.5 text-sm font-bold text-[#222222]"
            style={{
              backgroundColor: active ? "#DDDDDD" : "#F3F2F1",
              borderLeft: active ? `4px solid ${accentColor}` : "",
            }}
          >
            {item.name}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className="z-[1] shrink-0 self-stretch border-r h-screen
       border-[#444444] bg-themednavyblue text-white"
      style={{ width: leftNavWidth }}
    >
      {/* Tenant name + collapse toggle */}
      <div className="flex w-full">
        <div className="w-12 min-w-[48px] p-0 pt-1 text-center ">
          <MenuIcon className="cursor-pointer" 
          style={{ width: 22, height: 22 }}
           onClick={toggleLeftNavWidth} />
        </div>
        {leftNavExpanded && (
          <div className="w-full pt-0.5 pl-1">
            <span className="text-lg">{embeddingData.tenantName}</span>
          </div>
        )}
      </div>

      <div className="border-t border-white" />

      {/* Reports */}
      <div className="flex w-full cursor-pointer">
        <div className="w-12 min-w-[48px] p-0 pt-1 text-center ">
          <AssessmentIcon style={{ width: 22, height: 22 }} />
        </div>
        {leftNavExpanded && (
          <div className="w-full py-0 pl-1">
            <h2 className="my-0 w-full pt-0.5 text-lg ">Reports</h2>
            {embeddingData.workspaceArtifactsLoading && <DataLoading />}
            {!embeddingData.workspaceArtifactsLoading && renderList(embeddingData.reports, "#607D8B")}
          </div>
        )}
      </div>

      <div className="border-t border-white" />

      {/* Datasets */}
      {embeddingData.userCanCreate && (
        <>
          <div className="flex w-full cursor-pointer">
            <div className="w-12 min-w-[48px] p-0 pt-1 text-center">
              <SchemaIcon style={{ width: 22, height: 22 }} />
            </div>
            {leftNavExpanded && (
              <div className="w-full cursor-pointer py-0 pl-1">
                <h2 className="my-0 w-full pt-0.5 text-lg">Datasets</h2>
                {embeddingData.workspaceArtifactsLoading && <DataLoading />}
                {!embeddingData.workspaceArtifactsLoading && renderList(embeddingData.datasets, "#455A64")}
              </div>
            )}
          </div>
          <div className="border-t border-white" />
        </>
      )}
    </aside>
  )
}

export default LeftNav
