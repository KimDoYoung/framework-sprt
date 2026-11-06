/**
 * MyPage 전자결재 박스 — 미결함 · 결재요청함 · 임시저장함
 * AS-IS: myApp/client/vi/frm/Monitoring_Page_Appr.java (247줄, TabBorder 가운데 2/3). 함수 이름은 원본 메서드 이름 그대로
 * 생성자 L45-56: PlainTabPanel에 그리드 3개(탭 이름에 건수, 건수>0이면 파란 글씨 — clearPanel L212-240) → retrieve()
 * 모양은 MyPage 공통 MonitorGridBox(칩 탭 줄 = AS-IS 탭). 헤더 제목·총 n건은 MonitorGridBox 공통(AS-IS는 탭만 있다)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { frmApi } from '@/api/frm';
import { comRelateApprApi } from '@/api/com';
import { errorMessage } from '@/api/client';
import type { FrmMonitorOutstanding, FrmMonitorRequest, FrmMonitorTemporary } from '@/types/frm';
import { Apr01_Edit_ApprDoc } from '@/pages/apr/Apr01_Edit_ApprDoc';
import { MonitorGridBox, monitorDate, monitorDetail, monitorText, type MonitorTab } from './MonitorGridBox';

type TabKey = 'grid01' | 'grid02' | 'grid03';

interface Props {
  /** 값이 바뀌면 다시 조회 (AS-IS Calendar.allRetrieve → apprGird.retrieve()) */
  refreshKey?: number;
}

export const ApprovalGridBox: React.FC<Props> = ({ refreshKey = 0 }) => {
  const [grid01, setGrid01] = useState<FrmMonitorOutstanding[]>([]);
  const [grid02, setGrid02] = useState<FrmMonitorRequest[]>([]);
  const [grid03, setGrid03] = useState<FrmMonitorTemporary[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('grid01');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<{ apprId: number; statusCode?: string; after: () => void } | null>(null);

  const fail = (err: unknown) => message.error(errorMessage(err, '조회 실패'));

  // retrieve01 L141-161: apr.Apr01_Appr.selectOutstanding → clearPanel(0)
  const retrieve01 = useCallback(async () => {
    try { setGrid01(await frmApi.searchMonitorOutstandings()); } catch (err) { fail(err); }
  }, []);
  // retrieve02 L163-183: apr.Apr01_Appr.selectMonitorngAppr(toDay) → focus면 clearPanel(1), 아니면 clearPanel(0)
  const retrieve02 = useCallback(async () => {
    try { setGrid02(await frmApi.searchMonitorRequests()); } catch (err) { fail(err); }
  }, []);
  // retrieve03 L185-204: apr.Apr01_Appr.selectTemporary → focus면 clearPanel(2), 아니면 clearPanel(0)
  const retrieve03 = useCallback(async () => {
    try { setGrid03(await frmApi.searchMonitorTemporaries()); } catch (err) { fail(err); }
  }, []);

  // retrieve L206-210: 셋 다 조회(focus=false) → 각 콜백의 clearPanel(0)으로 첫 탭(미결함)이 선택된다
  const retrieve = useCallback(async () => {
    setLoading(true);
    try { await Promise.all([retrieve01(), retrieve02(), retrieve03()]); } finally { setLoading(false); }
    setActiveTab('grid01');
  }, [retrieve01, retrieve02, retrieve03]);

  // [E0] 화면 열림 (생성자 L45-56) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve, refreshKey]);

  // [E1] grid01 apprButton(ImageCell "Detail") L65-81 → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, callback → retrieve01(true))
  const openGrid01 = (row: FrmMonitorOutstanding) =>
    setView({ apprId: row.apprId, after: () => { void retrieve01(); setActiveTab('grid01'); } });

  // [E2] grid03 apprButton(ImageCell "Detail") L103-131 → ApprCallbackResult(apprId) = apr.Apr01_Appr.permissionsCheck
  //      → 있으면 Apr01_Edit_ApprDoc.retrieveApproval(…, callback → retrieve03(true)), 없으면 "해당문서의 열람권한이 없습니다"
  const openGrid03 = async (row: FrmMonitorTemporary) => {
    try {
      if (await comRelateApprApi.permission(row.apprId)) {
        setView({ apprId: row.apprId, statusCode: row.statusCode, after: () => { void retrieve03(); setActiveTab('grid03'); } });
      } else {
        message.info('해당문서의 열람권한이 없습니다');
      }
    } catch (err) { fail(err); }
  };

  // 탭 이름 (ColorTabItemConfig L41-43, clearPanel L218-225)
  const tabs: MonitorTab[] = [
    { key: 'grid01', label: '미결함', count: grid01.length },
    { key: 'grid02', label: '결재요청함 (완료/반려건은 최대 7일까지 표시)', count: grid02.length },
    { key: 'grid03', label: '임시저장함', count: grid03.length },
  ];

  const box = (() => {
    switch (activeTab) {
      case 'grid01': // buildGrid01 L82-89 (setRowNumHidden)
        return (
          <MonitorGridBox<FrmMonitorOutstanding>
            title="전자결재" tabs={tabs} activeTab={activeTab} onTabChange={k => setActiveTab(k as TabKey)}
            rowKey="apprId" dataSource={grid01} loading={loading}
            columns={[
              monitorText<FrmMonitorOutstanding>('statusName', 80, '진행상태', 'center'),
              monitorDate<FrmMonitorOutstanding>('regDate', 100, '등록일'),
              monitorText<FrmMonitorOutstanding>('title', undefined, '제목'),
              monitorText<FrmMonitorOutstanding>('regEmpName', 100, '상신자', 'center'),
              monitorDetail<FrmMonitorOutstanding>(80, openGrid01),
            ]}
          />
        );
      case 'grid02': // buildGrid02 L93-99 — 상세보기 열 없음
        return (
          <MonitorGridBox<FrmMonitorRequest>
            title="전자결재" tabs={tabs} activeTab={activeTab} onTabChange={k => setActiveTab(k as TabKey)}
            rowKey="apprId" dataSource={grid02} loading={loading}
            columns={[
              monitorText<FrmMonitorRequest>('statusName', 80, '결재상태', 'center'),
              monitorDate<FrmMonitorRequest>('regDate', 100, '등록일'),
              monitorText<FrmMonitorRequest>('title', undefined, '제목'),
              monitorText<FrmMonitorRequest>('nextApprName', 120, '다음결재자', 'center'),
            ]}
          />
        );
      default: // buildGrid03 L132-137
        return (
          <MonitorGridBox<FrmMonitorTemporary>
            title="전자결재" tabs={tabs} activeTab={activeTab} onTabChange={k => setActiveTab(k as TabKey)}
            rowKey="apprId" dataSource={grid03} loading={loading}
            columns={[
              monitorDate<FrmMonitorTemporary>('regDate', 100, '등록일'),
              monitorText<FrmMonitorTemporary>('title', undefined, '제목'),
              monitorDetail<FrmMonitorTemporary>(80, row => void openGrid03(row)),
            ]}
          />
        );
    }
  })();

  return (
    <>
      {box}
      <Apr01_Edit_ApprDoc
        apprId={view?.apprId ?? null}
        statusCode={view?.statusCode ?? null}
        onClosed={() => view?.after()}
        onClose={() => setView(null)}
      />
    </>
  );
};
