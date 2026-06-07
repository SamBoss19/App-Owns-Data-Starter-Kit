import { Route, Routes } from "react-router-dom";

import Banner from './Banner';
import LeftNav from './LeftNav';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Report from './pages/Report';
import PageNotFound from './PageNotFound';

const PageLayout = () => {

  return (
    <div className="bg-themednavyblue_200 font-light text-white h-screen overflow-y-scroll pb-8">
      <Banner />
      <div className="flex">
        <LeftNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="reports/:id" element={<Report />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default PageLayout