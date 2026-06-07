import { useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";

import AccountCircle from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import Dropdown, { MenuItem, MenuDivider } from './ui/Dropdown';

import { PowerBiLoginRequest } from "../AuthConfig";

const LoginMenu = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const loginUser = () => {
    instance.loginPopup(PowerBiLoginRequest);
  };

  const logoutUser = () => {
    navigate("/");
    instance.logoutPopup();
  };

  if (isAuthenticated) {
    return (
      <div className="ml-auto mr-3">
        <Dropdown
          align="right"
          triggerClassName="flex items-center gap-1 px-2 py-1 text-sm font-medium uppercase text-white hover:bg-white/10 rounded"
          trigger={
            <>
              <AccountCircle fontSize="small" />
              <span className="normal-case">{account?.name}</span>
              <KeyboardArrowDownIcon fontSize="small" />
            </>
          }
        >
          {(close) => (
            <>
              <MenuItem className="text-black text-sm" onClick={() => { close(); navigate("profile"); }}>
                <AccountCircle className="mr-2" fontSize="small" /> User Profile
              </MenuItem>
              <MenuDivider />
              <MenuItem className="text-black  text-sm" onClick={() => { close(); logoutUser(); }}>
                <LogoutIcon className="mr-2" fontSize="small" /> Logout
              </MenuItem>
            </>
          )}
        </Dropdown>
      </div>
    );
  }

  return (
    <div className="ml-auto mr-3">
      <button
        type="button"
        onClick={loginUser}
        className="flex items-center gap-1 rounded px-2 py-1 text-sm font-medium uppercase text-white hover:bg-white/10"
      >
        <LoginIcon fontSize="small" /> Login
      </button>
    </div>
  );
}

export default LoginMenu;
