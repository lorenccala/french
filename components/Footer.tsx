import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center pt-10 mt-12 border-t border-slate-200/80">
      <p className="text-xs text-slate-500">
        © {new Date().getFullYear()} Language Learning Accelerator. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;