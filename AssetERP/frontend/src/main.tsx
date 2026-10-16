// antd v5 정적 메서드(message, Modal.confirm 등)가 React 19에서 그려지도록 하는 공식 패치 — 다른 import보다 먼저
import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import App from './App.tsx';

// AG Grid Community 전체 모듈 등록 (옛 CSS 테마 파일은 import하지 않는다 — 공통 그리드 테마를 덮어쓴다)
ModuleRegistry.registerModules([AllCommunityModule]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
