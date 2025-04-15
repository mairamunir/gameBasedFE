import React from 'react';
import Navbar from './Navbar';

const PageLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default PageLayout;
