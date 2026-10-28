/**
 * [1185] 경영관리 > 02. 휴가/출장 관리 > 연차휴가 사용촉진 (S08)
 * AS-IS: myApp/client/vi/emp/Emp21_Tab_UnLeaveList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L13-29): 바깥 여백 20 + 테두리 박스 안에 탭 두 개 "연차"(Emp21_TabPage_UnLeaveList1) · "월차"(Emp21_TabPage_UnLeaveList2).
 * 1단계(사용자 결정 2026-10-28): 상신(결재문서 일괄 생성)·문자발송·상세보기(전자결재 편집창)는 다음 단계.
 */
import React from 'react';
import { Tabs } from 'antd';
import { Emp21_TabPage_UnLeaveList1 } from './Emp21_TabPage_UnLeaveList1';
import { Emp21_TabPage_UnLeaveList2 } from './Emp21_TabPage_UnLeaveList2';

export const Emp21_Tab_UnLeaveList: React.FC = () => {
  // [E0] 화면 열림 (생성자 L13-29): 탭 "연차"·"월차"를 만든다(두 탭 모두 조회는 하지 않는다)
  const tabs = [
    { key: 'year', label: '연차', children: <Emp21_TabPage_UnLeaveList1 /> },
    { key: 'month', label: '월차', children: <Emp21_TabPage_UnLeaveList2 /> },
  ];

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column' }}>
        <Tabs
          type="card"
          className="emp21-un-leave-tabs"
          style={{ flex: 1, minHeight: 0 }}
          items={tabs.map(t => ({ ...t, forceRender: true, style: { height: '100%' } }))}
        />
      </div>
      <style>{`
        .emp21-un-leave-tabs { display: flex; flex-direction: column; }
        .emp21-un-leave-tabs > .ant-tabs-content-holder { flex: 1; min-height: 0; }
        .emp21-un-leave-tabs > .ant-tabs-content-holder > .ant-tabs-content { height: 100%; }
        .emp21-un-leave-tabs .ant-tabs-tabpane { height: 100%; }
      `}</style>
    </div>
  );
};
