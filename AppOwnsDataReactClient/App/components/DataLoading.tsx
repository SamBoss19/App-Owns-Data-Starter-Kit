import { useLayoutEffect, useRef } from 'react';

import Spinner from './ui/Spinner';

const DataLoading = () => {
  let topContaner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (topContaner.current) {
      topContaner.current.style.height = (window.innerHeight - 50) + "px";
    }
  });

  return (
    <div ref={topContaner} className="w-full bg-white text-black  p-6 text-center text-black">
      <p className="m-4 text-2xl">Waiting for data to load...</p>
      <Spinner size={48} className="mt-4 text-black" />
    </div>
  );
}

export default DataLoading;
