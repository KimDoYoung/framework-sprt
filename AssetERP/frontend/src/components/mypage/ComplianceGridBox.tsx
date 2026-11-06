/**
 * MyPage 법규보고공시 및 내규정보 박스
 * AS-IS: myApp/client/vi/frm/Monitoring_Page_IcsNotice.java (150줄, TabBorder 가운데 3/3). 함수 이름은 원본 메서드 이름 그대로
 * 생성자 L39-54: 제목 "법규보고공시 및 내규정보" + 그리드 1개 → retrieve()
 * 모양은 MyPage 공통 MonitorGridBox. 칩 줄은 AS-IS에 없는 구분별 필터(UX보강 — 10-UX보강.md "MyPage 업무구분 필터 칩")
 */
import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { frmApi } from '@/api/frm';
import { errorMessage } from '@/api/client';
import type { FrmIcsNotice } from '@/types/frm';
import { Sch04_Lookup_IcsList } from '@/pages/sch/Sch04_Lookup_IcsList';
import { Sch04_Lookup_IcrList } from '@/pages/sch/Sch04_Lookup_IcrList';
import { MonitorGridBox, monitorDate, monitorDetail, monitorHtml, monitorText, useKindChips } from './MonitorGridBox';

interface Props {
  /** 기준일 'YYYY-MM-DD' — 없으면 오늘 (AS-IS retrieve(date) L84-88: 달력 날짜 클릭 → LoginUser.setSelectDate) */
  selectDate?: string;
  /** 값이 바뀌면 다시 조회 (AS-IS Calendar.allRetrieve → icsNoticeGrid.retrieve()) */
  refreshKey?: number;
}

type LookupArg = { infoId: number; deadlineId: number | null; gubunCode: string };

export const ComplianceGridBox: React.FC<Props> = ({ selectDate, refreshKey = 0 }) => {
  const [rows, setRows] = useState<FrmIcsNotice[]>([]);
  const [loading, setLoading] = useState(false);
  const [lookIcs, setLookIcs] = useState<LookupArg | null>(null);
  const [lookIcr, setLookIcr] = useState<LookupArg | null>(null);
  const chips = useKindChips(rows, r => r.bizNoticeName);

  // retrieve L90-110: frm.Frm01_List.selectIcsNotice(companyId, empId, orgCd, orgCodeLevel, selectDate) → 첫 행 선택
  const retrieve = useCallback(async () => {
    setLoading(true);
    try { setRows(await frmApi.searchIcsNotices(selectDate)); }
    catch (err) { message.error(errorMessage(err, '조회 실패')); }
    finally { setLoading(false); }
  }, [selectDate]);

  // [E0] 화면 열림 (생성자 L39-54) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, [retrieve, refreshKey]);

  // callLookup L112-127: sch04Model(infoId=relateId, closeDate=date, deadlineId) — 업무구분 210(내규정보)이면 lookupIcr, 아니면 lookupIcs. gubunCode = scheduleCode
  const callLookup = (row: FrmIcsNotice) => {
    const arg = { infoId: row.relateId, deadlineId: row.deadlineId, gubunCode: row.scheduleCode };
    if (row.bizNoticeCode === '210') setLookIcr(arg);   // lookupIcr L138-145
    else setLookIcs(arg);                                // lookupIcs L129-136
  };

  return (
    <>
      <MonitorGridBox<FrmIcsNotice>
        title="법규보고공시 및 내규정보"
        total={chips.filtered.length}
        tabs={chips.tabs}
        activeTab={chips.active}
        onTabChange={chips.setActive}
        rowKey="listId"
        dataSource={chips.filtered}
        loading={loading}
        // [E1] grid.CellDoubleClick (L58) → callLookup()
        onRowDoubleClick={callLookup}
        // buildGrid L66-82 (setRowNumHidden)
        columns={[
          monitorText<FrmIcsNotice>('bizNoticeName', 100, '구분', 'center'),
          monitorDate<FrmIcsNotice>('date', 100, '마감일'),
          monitorHtml<FrmIcsNotice>('todoTitle', undefined, '제목'),
          monitorDetail<FrmIcsNotice>(60, callLookup),   // viewCell(ImageCell "Detail") L69-74 → callLookup()
        ]}
      />
      <Sch04_Lookup_IcsList
        infoId={lookIcs?.infoId ?? null} deadlineId={lookIcs?.deadlineId ?? null} gubunCode={lookIcs?.gubunCode ?? ''}
        onClose={() => setLookIcs(null)}
      />
      <Sch04_Lookup_IcrList
        infoId={lookIcr?.infoId ?? null} deadlineId={lookIcr?.deadlineId ?? null} gubunCode={lookIcr?.gubunCode ?? ''}
        onClose={() => setLookIcr(null)}
      />
    </>
  );
};
