/**
 * MyPage Day List 박스 (오늘의 할일)
 * AS-IS: myApp/client/vi/frm/Monitoring_Page_DayList.java (355줄, TabBorder 가운데 1/3). 함수 이름은 원본 메서드 이름 그대로
 * 생성자 L75-127: 왼쪽 "Day List" ◀ 기준일 ▶ / 오른쪽 [새로고침][바로가기] + 그리드 1개 → retrieve()
 * 모양은 MyPage 공통 MonitorGridBox. 칩 줄은 AS-IS에 없는 업무구분별 필터(UX-11)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { frmApi } from '@/api/frm';
import { schApi } from '@/api/sch';
import { comRelateApprApi } from '@/api/com';
import { errorMessage } from '@/api/client';
import type { FrmToDo } from '@/types/frm';
import type { Sch10Ipo } from '@/types/sch';
import { Button } from '@/components/button';
import { QuickMoveDateField } from '@/components/form/QuickMoveDateField';
import { openMenuByNo } from '@/utils/tempData';
import { Apr01_Edit_ApprDoc } from '@/pages/apr/Apr01_Edit_ApprDoc';
import { Fnd20_Lookup_ToDoList } from '@/pages/fnd/Fnd20_Lookup_ToDoList';
import { Ast04_Lookup_Cf } from '@/pages/ast/Ast04_Lookup_Cf';
import { Sch04_Lookup_IcsList } from '@/pages/sch/Sch04_Lookup_IcsList';
import { Sch04_Lookup_IcrList } from '@/pages/sch/Sch04_Lookup_IcrList';
import { Sch10_Lookup_Ipo } from '@/components/lookup/Sch10_Lookup_Ipo';
import { MonitorGridBox, monitorDate, monitorDetail, monitorHtml, monitorText, useKindChips } from './MonitorGridBox';

interface Props {
  /** 기준일 'YYYY-MM-DD' — 달력 날짜 클릭 (AS-IS retrieve(date) L317-320: baseDate.setValue(date) → retrieve()) */
  selectDate?: string;
  /** 값이 바뀌면 다시 조회 (AS-IS Calendar.allRetrieve → toDoGrid.retrieve()) */
  refreshKey?: number;
}

type LookupArg = { infoId: number; deadlineId: number | null; gubunCode: string };

/** AS-IS MenuOpener.openBizNoticeCode L1765-1848: 업무구분 → 화면번호 */
const BIZ_NOTICE_MENU: Record<string, string> = {
  '030': '1018',                                                         // 상신문서 → Apr01_Tab_MyApproveList
  '060': '1185', '061': '1185', '062': '1185', '063': '1185', '064': '1185', '065': '1185', // 연차·월차 촉진/통보 → Emp21_Tab_UnLeaveList
  '070': '1294',                                                         // 임원만료 → Emp31_Tab_Director
  '075': '1029',                                                         // 계약만료 → Emp00_Tab_TransInfo
  '080': '1209',                                                         // 계약종료 → Biz10_Tab_ContCorp
  '200': '1337', '210': '1337',                                          // 법규보고·내규정보 → Sch04_Tab_IcsList
};

export const DayListBox: React.FC<Props> = ({ selectDate, refreshKey = 0 }) => {
  // settings() L129-131: baseDate = LoginUser.getToday()
  const [baseDate, setBaseDate] = useState<string>(selectDate ?? dayjs().format('YYYY-MM-DD'));
  const [rows, setRows] = useState<FrmToDo[]>([]);
  const [selected, setSelected] = useState<FrmToDo | null>(null);
  const [loading, setLoading] = useState(false);
  const chips = useKindChips(rows, r => r.bizNoticeName);

  const [fnd, setFnd] = useState<{ planId: number; date: string } | null>(null);
  const [cfRelateId, setCfRelateId] = useState<number | null>(null);
  const [apprId, setApprId] = useState<number | null>(null);
  const [lookIcs, setLookIcs] = useState<LookupArg | null>(null);
  const [lookIcr, setLookIcr] = useState<LookupArg | null>(null);
  const [ipo, setIpo] = useState<Sch10Ipo | null>(null);

  // retrieve() L322-337: frm.Frm01_List.selectToDoList(companyId, empId, orgCd, orgCodeLevel, selectDate=baseDate) → 첫 행 선택
  const retrieve = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const list = await frmApi.searchToDos(date);
      setRows(list);
      setSelected(list[0] ?? null);
    } catch (err) { message.error(errorMessage(err, '조회 실패')); }
    finally { setLoading(false); }
  }, []);

  // retrieve(date) L317-320: 달력에서 날짜를 고르면 기준일을 바꾸고 조회
  useEffect(() => { if (selectDate) setBaseDate(selectDate); }, [selectDate]);

  // [E0] 화면 열림 (생성자 L75-127) → settings(), setIconStyle(), retrieve()
  useEffect(() => { void retrieve(baseDate); }, [retrieve, baseDate, refreshKey]);

  // open() L198-315: 업무구분별 상세 창
  const open = async (row: FrmToDo) => {
    const code = row.bizNoticeCode;
    const relateId = row.relateId;
    if (code === '050' && relateId != null) {                 // 050 상품기획 → Fnd20_Lookup_ToDoList.open(relateId, date)
      setFnd({ planId: relateId, date: (row.date ?? baseDate).slice(0, 10) });
    } else if (code === '090' && relateId != null) {          // 090 C/F → ast.Ast04_Cf.selectByRelateId → Ast04_Lookup_Cf (조회는 창이 한다)
      setCfRelateId(relateId);
    } else if (code === '030' && relateId != null) {          // 030 상신문서 → ApprCallbackResult(permissionsCheck) → Apr01_Edit_ApprDoc
      try {
        if (await comRelateApprApi.permission(relateId)) setApprId(relateId);
        else message.info('해당문서의 열람권한이 없습니다');
      } catch (err) { message.error(errorMessage(err, '조회 실패')); }
    } else if (code === '200' && relateId != null) {          // 200 법규보고 → Sch04_Lookup_IcsList.open(sch04Model, scheduleCode)
      setLookIcs({ infoId: relateId, deadlineId: row.deadlineId, gubunCode: row.scheduleCode ?? '' });
    } else if (code === '210' && relateId != null) {          // 210 내규정보 → Sch04_Lookup_IcrList.open(sch04Model, scheduleCode)
      setLookIcr({ infoId: relateId, deadlineId: row.deadlineId, gubunCode: row.scheduleCode ?? '' });
    } else if (['040', '041', '042', '043'].includes(code) && relateId != null) {
      // 040 수요예측 · 041 공모주청약 · 042 청약납입일 · 043 공모주상장 → sch.Sch10_Ipo.selectById → new Sch10_Lookup_Ipo(model, null)
      try { setIpo(await schApi.getIpo(relateId)); }
      catch (err) { message.error(errorMessage(err, '조회 실패')); }
    } else {
      message.info('상세보기를 지원하지않는 업무구분입니다');
    }
  };

  // [E6] baroButton[바로가기].Click (L152) → MenuOpener.openBizNoticeCode(bizNoticeCode)
  //      (AS-IS는 선택이 없으면 메시지 뒤에도 진행해 오류가 났다 — TOBE는 메시지 뒤 멈춘다)
  const onBaro = () => {
    if (!selected) { message.info('업무구분을 선택해주세요'); return; }
    const menuNo = BIZ_NOTICE_MENU[selected.bizNoticeCode];
    if (!menuNo) { message.info('바로가기를 지원하지 않는 업무구분입니다'); return; }
    if (!openMenuByNo(menuNo)) message.warning('권한이 없는 화면입니다. 관리자에게 문의해주세요');
  };

  return (
    <>
      <MonitorGridBox<FrmToDo>
        title={
          <>
            <span>Day List</span>
            {/* [E1] anchor01(◀).MouseDown (L81) · [E2] anchor02(▶).MouseDown (L93) · [E3] baseDate.ValueChange (L132) → retrieve() */}
            <QuickMoveDateField value={baseDate} onChange={setBaseDate} onCommit={setBaseDate} />
          </>
        }
        total={chips.filtered.length}
        extra={
          <>
            {/* [E5] refreshButton.Click (L146) → retrieve() */}
            <Button type="reset" size="small" onClick={() => retrieve(baseDate)}>새로고침</Button>
            <Button type="goto" size="small" onClick={onBaro}>바로가기</Button>
          </>
        }
        tabs={chips.tabs}
        activeTab={chips.active}
        onTabChange={chips.setActive}
        rowKey="listId"
        dataSource={chips.filtered}
        loading={loading}
        onRowClick={setSelected}
        // [E4] grid.CellDoubleClick (L139) → open(selectModel)
        onRowDoubleClick={row => void open(row)}
        // buildGrid L176-196 (setRowNumHidden)
        columns={[
          monitorText<FrmToDo>('bizNoticeName', 100, '업무구분', 'center'),
          monitorDate<FrmToDo>('date', 90, '등록(마감)일'),
          monitorHtml<FrmToDo>('todoTitle', undefined, '제목'),
          monitorDate<FrmToDo>('closeDate', 90, '처리(완료)일'),
          monitorText<FrmToDo>('personName', 70, '담당자', 'center'),
          monitorDetail<FrmToDo>(60, row => void open(row)),   // goPageButton(ImageCell "Detail") L179-186 → open(selectModel)
        ]}
      />
      <Fnd20_Lookup_ToDoList planId={fnd?.planId ?? null} date={fnd?.date ?? baseDate} onClose={() => setFnd(null)} />
      <Ast04_Lookup_Cf relateId={cfRelateId} onClose={() => setCfRelateId(null)} />
      <Apr01_Edit_ApprDoc apprId={apprId} onClose={() => setApprId(null)} />
      <Sch04_Lookup_IcsList
        infoId={lookIcs?.infoId ?? null} deadlineId={lookIcs?.deadlineId ?? null} gubunCode={lookIcs?.gubunCode ?? ''}
        onClose={() => setLookIcs(null)}
      />
      <Sch04_Lookup_IcrList
        infoId={lookIcr?.infoId ?? null} deadlineId={lookIcr?.deadlineId ?? null} gubunCode={lookIcr?.gubunCode ?? ''}
        onClose={() => setLookIcr(null)}
      />
      <Sch10_Lookup_Ipo ipo={ipo} onClose={() => setIpo(null)} />
    </>
  );
};
