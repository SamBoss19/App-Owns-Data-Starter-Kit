import { useNavigate } from 'react-router-dom';

import Apps from '@mui/icons-material/Apps';

import Login from './LoginMenu';

const Banner = () => {
  let navigate = useNavigate();

  return (
    <header className="relative z-[2] flex
     h-[44px] items-center bg-themedred/20 text-white">
      <button
        type="button"
        onClick={() => { navigate("/"); }}
        aria-label="menu"
        className="flex h-[42px] items-center pl-1 text-inherit"
      >
        <Apps className="ml-1 mr-3" style={{ width: 32, height: 30 }} />
        <span className="text-xl">Mikano International Analytics Portal</span>
      </button>
      <Login />
    </header>
  )
}

export default Banner;
