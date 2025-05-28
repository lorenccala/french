import React from 'react';
import { BookOpenIcon } from 'lucide-react'; // Example, if you add lucide later

const Header: React.FC = () => {
  return (
    <header className="text-center pb-6 mb-6 border-b border-slate-200/80">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold 
                     bg-gradient-to-r from-sky-600 to-teal-500 text-transparent bg-clip-text">
        French Language Comprehension Accelerator
      </h1>
      <p className="mt-2 text-sm text-slate-500">Master French, one sentence at a time.</p>
    </header>
  );
};

export default Header;