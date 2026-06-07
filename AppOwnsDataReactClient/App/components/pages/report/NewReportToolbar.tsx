import { useState, useRef } from 'react';

import powerbi from "powerbi-client";

// ensure Power BI JavaScript API has loaded
require('powerbi-models');
require('powerbi-client');

import Fullscreen from '@mui/icons-material/Fullscreen';
import Article from '@mui/icons-material/Article';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import SaveAs from '@mui/icons-material/SaveAs';

import Dropdown, { MenuItem } from '../../ui/Dropdown';
import Modal from '../../ui/Modal';

interface NewReportToolbarProps {
  report: powerbi.Embed;
}

const toolbarBtn = "ml-1 flex items-center gap-0.5 rounded px-1 py-1 text-[9px] uppercase text-[#555555] hover:bg-gray-200";

const NewReportToolbar = ({ report }: NewReportToolbarProps) => {

  const [openSaveAsDialog, setOpenSaveAsDialog] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const refReportName = useRef<HTMLInputElement>(null);

  const onFileSaveAs = () => {
    setNewReportName("")
    setOpenSaveAsDialog(true);
  };

  const onReportFullscreen = () => {
    report.fullscreen();
  };

  return (
    <>
      <div className="m-0 w-full bg-[#CCCCCC] p-0">
        <div className="m-0 flex min-h-[32px] items-center p-0">

          <Dropdown
            triggerClassName={toolbarBtn}
            trigger={<><Article fontSize="small" /> File <KeyboardArrowDown fontSize="small" /></>}
          >
            {(close) => (
              <MenuItem onClick={() => { close(); onFileSaveAs(); }}>
                <SaveAs className="mr-2" fontSize="small" /> Save As
              </MenuItem>
            )}
          </Dropdown>

          <span className="ml-auto" />

          <button type="button" className={toolbarBtn} onClick={onReportFullscreen}>
            <Fullscreen fontSize="small" /> Full Screen
          </button>
          <span className="mr-1" />

        </div>
      </div>

      <Modal
        open={openSaveAsDialog}
        onClose={() => { setOpenSaveAsDialog(false); }}
        title="Enter report name"
        actions={
          <>
            <button
              type="button"
              disabled={newReportName === ""}
              onClick={async () => {
                setOpenSaveAsDialog(false);
                await report.saveAs({ name: newReportName });
              }}
              className="rounded px-3 py-1.5 text-sm font-medium uppercase text-brand hover:bg-brand/10 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setOpenSaveAsDialog(false); }}
              className="rounded px-3 py-1.5 text-sm font-medium uppercase text-brand hover:bg-brand/10"
            >
              Cancel
            </button>
          </>
        }
      >
        <p className="mb-2">You need to give this new report a name.</p>
        <input
          ref={refReportName}
          autoFocus
          type="text"
          placeholder="New Report Name"
          value={newReportName}
          onChange={(event) => { setNewReportName(event.target.value) }}
          className="w-full border-0 border-b border-gray-400 px-0 py-1 text-sm focus:border-brand focus:outline-none"
        />
      </Modal>
    </>
  )
}

export default NewReportToolbar
