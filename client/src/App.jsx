import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import PulseBrief from './PulseBrief';
import PulseDocs from './PulseDocs';
import PulseDecide from './PulseDecide';
import PulseSearch from './PulseSearch';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/brief" replace />} />
          <Route path="/brief" element={<PulseBrief />} />
          <Route path="/docs" element={<PulseDocs />} />
          <Route path="/decide" element={<PulseDecide />} />
          <Route path="/search" element={<PulseSearch />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
