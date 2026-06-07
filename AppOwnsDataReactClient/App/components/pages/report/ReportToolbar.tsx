import { useState, useRef, useContext } from 'react';

import { AppContext } from "../../../AppContext";

import AppOwnsDataWebApi from './../../../services/AppOwnsDataWebApi';
import { ExportFileRequest } from '../../../models/models';

import * as powerbi from "powerbi-client";
import * as models from "powerbi-models";

import { ViewMode } from './../Report'

// ensure Power BI JavaScript API has loaded
require('powerbi-models');
require('powerbi-client');

import Dropdown, { MenuItem, MenuRow, MenuDivider } from '../../ui/Dropdown';
import Modal from '../../ui/Modal';
import Switch from '../../ui/Switch';
import LinearProgress from '../../ui/LinearProgress';

import Fullscreen from '@mui/icons-material/Fullscreen';
import Edit from '@mui/icons-material/Edit';
import Pageview from '@mui/icons-material/Pageview';
import Download from '@mui/icons-material/Download';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';
import Image from '@mui/icons-material/Image';
import Slideshow from '@mui/icons-material/Slideshow';
import SyncAlt from '@mui/icons-material/SyncAlt';
import Refresh from '@mui/icons-material/Refresh';
import Article from '@mui/icons-material/Article';
import Bookmark from '@mui/icons-material/Bookmark';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import SaveAs from '@mui/icons-material/SaveAs';
import Save from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import FitScreen from '@mui/icons-material/FitScreen';
import PhotoSizeSelectActual from '@mui/icons-material/PhotoSizeSelectActual';

import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonChecked from '@mui/icons-material/RadioButtonChecked';
import FilterAlt from '@mui/icons-material/FilterAlt';
import MenuIcon from '@mui/icons-material/Menu';

interface ReportToolbarProps {
  report: powerbi.Report;
  editMode: boolean;
  setEditMode: (EditMode: boolean) => void;
  showNavigation: boolean;
  setShowNavigation: (ShowNavigation: boolean) => void;
  showFiltersPane: boolean;
  setShowFiltersPane: (ShowFiltersPane: boolean) => void;
  showBookmarksPane: boolean;
  setShowBookmarksPane: (ShowBookmarksPane: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (VeiwModeValue: ViewMode) => void;
  setEmbedToken: (embedToken: string) => void;
  setEmbedTokenExpiration: (embedTokenExpiration: string) => void;
}

const ReportToolbar = ({ report, editMode, setEditMode, showNavigation, setShowNavigation, showFiltersPane, setShowFiltersPane,
  showBookmarksPane, setShowBookmarksPane, viewMode, setViewMode, setEmbedToken, setEmbedTokenExpiration }: ReportToolbarProps) => {

  const { embeddingData } = useContext(AppContext)
  const [anchorElementFile, setAnchorElementFile] = useState<null | HTMLElement>(null);
  const [anchorElementExport, setAnchorElementExport] = useState<null | HTMLElement>(null);
  const [anchorElementView, setAnchorElementView] = useState<null | HTMLElement>(null);
  const [anchorElementViewMode, setAnchorElementViewMode] = useState<null | HTMLElement>(null);
  const [openSaveAsDialog, setOpenSaveAsDialog] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const [openExportProgressDialog, setOpenExportProgressDialog] = useState(false);

  const refReportName = useRef<HTMLInputElement>(null);

  const toolbarBtn = "ml-1 flex items-center gap-0.5 rounded px-1 py-1 text-[9px] uppercase text-[#555555] hover:bg-gray-200";

  const onFileSave = () => {
    setAnchorElementFile(null);
    report.save()
  };

  const onFileSaveAs = () => {
    setAnchorElementFile(null);
    setNewReportName("")
    setOpenSaveAsDialog(true);
  };

  const onExportPageToPDF = async () => {

    // close Export menu and open export progress dialog
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);

    // get report data for ExportFile operation
    let reportId = report.getId();
    let currentPage = await report.getActivePage();
    let currentPageName = currentPage.name;
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });

    // create ExportFileRequest variable with parameters for export
    const exportRequest: ExportFileRequest = {
      ReportId: reportId,
      ExportType: "PDF",
      BookmarkState: bookmark.state,
      PageName: currentPageName,
    };

    // Call ExportFile from AppOwnsDataWebApi
    await AppOwnsDataWebApi.ExportFile(exportRequest);

    // close export progress dialog
    setOpenExportProgressDialog(false);

  };

  const onExportPageToPNG = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);
    let reportId = report.getId();
    let currentPage = await report.getActivePage();
    let currentPageName = currentPage.name;
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });
    const exportRequest: ExportFileRequest = {
      ReportId: reportId,
      ExportType: "PNG",
      PageName: currentPageName,
      BookmarkState: bookmark.state
    };
    await AppOwnsDataWebApi.ExportFile(exportRequest);
    setOpenExportProgressDialog(false);
  };

  const onExportPageToPPTX = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);
    let reportId = report.getId();
    let currentPage = await report.getActivePage();
    let currentPageName = currentPage.name;
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });
    const exportRequest: ExportFileRequest = {
      ReportId: reportId,
      ExportType: "PPTX",
      PageName: currentPageName,
      BookmarkState: bookmark.state
    };
    await AppOwnsDataWebApi.ExportFile(exportRequest);
    setOpenExportProgressDialog(false);
  };

  const onExportReportToPDF = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);

    let reportId = report.getId();
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });

    // create ExportFileRequest variable with parameters for export
    const exportRequest: ExportFileRequest = {
      ReportId: reportId,
      ExportType: "PDF",
      BookmarkState: bookmark.state
    };

    // Call ExportFile from AppOwnsDataWebApi
    await AppOwnsDataWebApi.ExportFile(exportRequest);

    // close dialog
    setOpenExportProgressDialog(false);
  };

  const onExportReportToPNG = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);
    let reportId = report.getId();
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });
    const exportRequest: ExportFileRequest = {
      ReportId: reportId,
      ExportType: "PNG",
      BookmarkState: bookmark.state
    };
    await AppOwnsDataWebApi.ExportFile(exportRequest);
    setOpenExportProgressDialog(false);
  };

  const onExportReportToPPTX = async () => {
    setAnchorElementExport(null);
    setOpenExportProgressDialog(true);
    let reportId = report.getId();
    let currentPage = await report.getActivePage();
    let currentPageName = currentPage.name;
    let bookmark = await report.bookmarksManager.capture({ allPages: false, personalizeVisuals: false });
    const exportRequest: ExportFileRequest = {
      ReportId: reportId,
      ExportType: "PPTX",
      PageName: currentPageName,
      BookmarkState: bookmark.state
    };
    await AppOwnsDataWebApi.ExportFile(exportRequest);
    setOpenExportProgressDialog(false);
  };

  const onViewToggleNavigation = () => {
    setShowNavigation(!showNavigation);
    report.updateSettings({
      panes: {
        pageNavigation: { visible: !showNavigation }
      }
    });
  };

  const onViewToggleFilterPane = () => {
    setShowFiltersPane(!showFiltersPane);
    report.updateSettings({
      panes: {
        filters: { visible: !showFiltersPane, expanded: true }
      }
    });
  };

  const onViewToggleBookmarksPane = () => {
    setShowBookmarksPane(!showBookmarksPane);
    report.updateSettings({
      panes: {
        bookmarks: { visible: !showBookmarksPane }
      }
    });
  };

  const onToggleEditMode = () => {
    report.switchMode(editMode ? "view" : "edit");
    setEditMode(!editMode);
  }

  const onViewModeFitToPage = () => {
    setAnchorElementViewMode(null);
    report.updateSettings({
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage }
    });
    setViewMode("FitToPage")
  };

  const onViewModeFitToWidth = () => {
    setAnchorElementViewMode(null);
    report.updateSettings({
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToWidth }
    });
    setViewMode("FitToWidth")
  };

  const onViewModeActualSize = () => {
    setAnchorElementViewMode(null);
    report.updateSettings({
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.ActualSize }
    });
    setViewMode("ActualSize")
  };

  const onReportRefresh = async () => {
    report.refresh();
  };

  const onReportFullscreen = () => {
    report.fullscreen();
  };

  const dialogBtn = "rounded px-3 py-1.5 text-sm font-medium uppercase text-brand hover:bg-brand/10";

  return (
    <>
      <div className="m-0 w-full bg-nav p-0">
        <div className="m-0 flex min-h-[32px] items-center p-0">
          {editMode && (
            <>
              <Dropdown
                triggerClassName={toolbarBtn}
                trigger={<><Article fontSize="small" /> File <KeyboardArrowDown fontSize="small" /></>}
              >
                {(close) => (
                  <>
                    <MenuItem onClick={() => { close(); onFileSave(); }}>
                      <Save className="mr-2" fontSize="small" /> Save
                    </MenuItem>
                    {embeddingData.userCanCreate &&
                      <>
                        <MenuDivider />
                        <MenuItem onClick={() => { close(); onFileSaveAs(); }}>
                          <SaveAs className="mr-2" fontSize="small" /> Save As
                        </MenuItem>
                      </>
                    }
                  </>
                )}
              </Dropdown>
              <span className="mx-0.5 h-5 border-l border-gray-300" />
            </>
          )}

          <Dropdown
            triggerClassName={toolbarBtn}
            menuClassName="whitespace-nowrap"
            trigger={<><Download fontSize="small" /> Export <KeyboardArrowDown fontSize="small" /></>}
          >
            {(close) => (
              <>
                <MenuItem onClick={() => { close(); onExportPageToPDF(); }}>
                  <PictureAsPdf className="mr-2" fontSize="small" /> Export Current Page to PDF
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => { close(); onExportPageToPNG(); }}>
                  <Image className="mr-2" fontSize="small" /> Export Current Page to PNG
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => { close(); onExportPageToPPTX(); }}>
                  <Slideshow className="mr-2" fontSize="small" /> Export Current Page to PowerPoint (PPTX)
                </MenuItem>
                <div className="my-1 border-t border-[#666666]" />
                <MenuItem onClick={() => { close(); onExportReportToPDF(); }}>
                  <PictureAsPdf className="mr-2" fontSize="small" /> Export Report to PDF
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => { close(); onExportReportToPNG(); }}>
                  <Image className="mr-2" fontSize="small" /> Export Report to PNG
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => { close(); onExportReportToPPTX(); }}>
                  <Slideshow className="mr-2" fontSize="small" /> Export Report to PowerPoint (PPTX)
                </MenuItem>
              </>
            )}
          </Dropdown>
          <span className="mx-0.5 h-5 border-l border-gray-300" />

          <Dropdown
            triggerClassName={toolbarBtn}
            menuClassName="whitespace-nowrap"
            trigger={<><Visibility fontSize="small" /> View <KeyboardArrowDown fontSize="small" /></>}
          >
            {() => (
              <>
                <MenuRow className="justify-between">
                  <span className="flex items-center"><MenuIcon className="mr-2" fontSize="small" /> Navigation Menu</span>
                  <Switch className="ml-3" checked={showNavigation} onChange={onViewToggleNavigation} />
                </MenuRow>
                <MenuDivider />
                <MenuRow className="justify-between">
                  <span className="flex items-center"><FilterAlt className="mr-2" fontSize="small" /> Filter Pane</span>
                  <Switch className="ml-3" checked={showFiltersPane} onChange={onViewToggleFilterPane} />
                </MenuRow>
                <MenuDivider />
                <MenuRow className="justify-between">
                  <span className="flex items-center"><Bookmark className="mr-2" fontSize="small" /> Bookmarks Pane</span>
                  <Switch className="ml-3" checked={showBookmarksPane} onChange={onViewToggleBookmarksPane} />
                </MenuRow>
              </>
            )}
          </Dropdown>

          <span className="mx-0.5 h-5 border-l border-gray-300" />

          {embeddingData.userCanEdit &&
            <>
              <button type="button" className={toolbarBtn} onClick={onToggleEditMode}>
                {editMode ? <Pageview fontSize="small" /> : <Edit fontSize="small" />}
                {editMode ? "Reading View" : "Edit"}
              </button>
              <span className="mx-0.5 h-5 border-l border-gray-300" />
            </>
          }

          <span className="ml-auto h-5 border-l border-gray-300" />

          <Dropdown
            align="right"
            triggerClassName={toolbarBtn}
            menuClassName="whitespace-nowrap"
            trigger={<><FitScreen fontSize="small" /> View Mode <KeyboardArrowDown fontSize="small" /></>}
          >
            {(close) => (
              <>
                <MenuItem className="justify-between" onClick={() => { close(); onViewModeFitToPage(); }}>
                  <span className="flex items-center"><FitScreen className="mr-2" fontSize="small" /> Fit to Page</span>
                  {viewMode === "FitToPage" ? <RadioButtonChecked className="ml-3" fontSize="small" /> : <RadioButtonUnchecked className="ml-3" fontSize="small" />}
                </MenuItem>
                <MenuDivider />
                <MenuItem className="justify-between" onClick={() => { close(); onViewModeFitToWidth(); }}>
                  <span className="flex items-center"><SyncAlt className="mr-2" fontSize="small" /> Fit to Width</span>
                  {viewMode === "FitToWidth" ? <RadioButtonChecked className="ml-3" fontSize="small" /> : <RadioButtonUnchecked className="ml-3" fontSize="small" />}
                </MenuItem>
                <MenuDivider />
                <MenuItem className="justify-between" onClick={() => { close(); onViewModeActualSize(); }}>
                  <span className="flex items-center"><PhotoSizeSelectActual className="mr-2" fontSize="small" /> Actual Size</span>
                  {viewMode === "ActualSize" ? <RadioButtonChecked className="ml-3" fontSize="small" /> : <RadioButtonUnchecked className="ml-3" fontSize="small" />}
                </MenuItem>
              </>
            )}
          </Dropdown>

          <span className="mx-0.5 h-5 border-l border-gray-300" />

          <button type="button" className={toolbarBtn} onClick={onReportRefresh}>
            <Refresh fontSize="small" /> Refresh
          </button>

          <span className="mx-0.5 h-5 border-l border-gray-300" />

          <button type="button" className={toolbarBtn} onClick={onReportFullscreen}>
            <Fullscreen fontSize="small" /> Full Screen
          </button>

          <span className="ml-0.5 mr-1 h-5 border-l border-gray-300" />

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
              className={`${dialogBtn} disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent`}
            >
              Save
            </button>
            <button type="button" onClick={() => { setOpenSaveAsDialog(false); }} className={dialogBtn}>Cancel</button>
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

      <Modal
        open={openExportProgressDialog}
        onClose={() => { setOpenExportProgressDialog(false); }}
        title="Power BI Report Export Job in Progress"
        actions={<button type="button" onClick={() => { setOpenExportProgressDialog(false); }} className={dialogBtn}>Dismiss</button>}
      >
        <div className="w-full bg-blue-100 py-2">
          <LinearProgress />
        </div>
      </Modal>
    </>
  )
}

export default ReportToolbar