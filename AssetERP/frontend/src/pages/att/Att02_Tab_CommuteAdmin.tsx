/**
 * [1485] 경영관리 > 06. 근태관리 > 근태관리(관리자) (T06)
 * AS-IS: myApp/client/vi/att/Att02_Tab_CommuteAdmin.java (454줄) + Att02_Lookup_InsertBatch(227) + Att02_Edit_InOutReason(89) + Att02_Edit_CommuteBatch(258) + Att02_Edit_Commute(223) + Att01_Lookup_WorkPolicy(314) + Emp00_Lookup_SelectSingle(공용)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L86-127: north = 툴바 두 줄(1줄: 근무일자 {기준일} / 근무기간 {시작}~{종료} · 검색 200 "사원번호/사원명/본부(부서)" · 사원 100 "전체" · [조회][일괄수정][일괄생성], 2줄: [근로시간 일괄조정][근태정책설정]), center = 근태 그리드(행번호, 체크박스 다중, 2단 헤더 "근로자 실입력"·"관리자 확정")
 * 스타일: SGP (견본 — docs/page-style.md). 검색 영역은 두 줄이라 SearchPanel
 * UX보강(10): 툴바 = SearchPanel(UX-01·04). 초기화(UX-02)는 없다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, DatePicker, Modal, Radio, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { AttCommute } from '@/types/att';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { dynamicIconCell } from '@/components/grid/iconCell';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { SearchPanel } from '@/components/search';
import { Att01_Lookup_WorkPolicy } from './Att01_Lookup_WorkPolicy';
import { Att02_Edit_Commute } from './Att02_Edit_Commute';
import { Att02_Edit_CommuteBatch } from './Att02_Edit_CommuteBatch';
import { Att02_Edit_InOutReason } from './Att02_Edit_InOutReason';
import { Att02_Lookup_InsertBatch } from './Att02_Lookup_InsertBatch';

const gb = gbFor<AttCommute>();
const DATE = 'YYYY-MM-DD';
/** 관리자 확정 열 제목 색 (AS-IS setHtmlGridStyle / addTextCenter(…, "2EAC7E")) */
const ADMIN_COLOR = { headerStyle: { color: '#2EAC7E' } };

export const Att02_Tab_CommuteAdmin: React.FC = () => {
  const gridRef = useRef<AgGridReact<AttCommute>>(null);
  // settings() L129-296: radio01(근무일자) 선택, 기준일 = 오늘(활성), 시작일 = 이달 1일·종료일 = 오늘(비활성)
  const [byBase, setByBase] = useState(true);
  const [baseDate, setBaseDate] = useState(() => dayjs().format(DATE));
  const [startDate, setStartDate] = useState(() => dayjs().startOf('month').format(DATE));
  const [closeDate, setCloseDate] = useState(() => dayjs().format(DATE));
  const [searchText, setSearchText] = useState('');
  const [empName, setEmpName] = useState('');
  const [personId, setPersonId] = useState<number | null>(null);
  const [rows, setRows] = useState<AttCommute[]>([]);
  const [loading, setLoading] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);
  const [reasonTarget, setReasonTarget] = useState<AttCommute | null>(null);
  const [editTarget, setEditTarget] = useState<AttCommute | null>(null);
  const [batchRows, setBatchRows] = useState<AttCommute[] | null>(null);
  const [insertTarget, setInsertTarget] = useState<{ startDate: string; closeDate: string } | null>(null);
  const [policyOpen, setPolicyOpen] = useState(false);

  // retrieve() L382-405: att.Att02_Commute.selectByTextAdmin(searchText "%…%"(서버), companyId(서버), personId, 기준일 또는 시작·종료일)
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await attApi.searchAdminCommutes({
        searchText, personId,
        ...(byBase ? { baseDate } : { startDate, closeDate }),
      }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [searchText, personId, byBase, baseDate, startDate, closeDate]);

  // [E0] 화면 열림 (생성자 L86-127) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkedRows = () => gridRef.current?.api?.getSelectedRows() ?? [];

  // [E7] updateButton[일괄수정].Select (L222) → 선택이 없으면 "수정할 사원의 근태내역을 선택해주세요", 있으면 update() L407-415: Att02_Edit_CommuteBatch.open(고른 행, 끝나면 retrieve())
  const update = () => {
    const sel = checkedRows();
    if (sel.length === 0) { message.warning('수정할 사원의 근태내역을 선택해주세요'); return; }
    setBatchRows(sel);
  };

  // [E8] updateAutoButton[근로시간 일괄조정].Select [YES] (L233) → 선택이 없으면 "선택된 사원이 없습니다", 확인창 "선택된 사원의 근로시간을 일괄조정하시겠습니까?"(제목 "확인", 폭 420)
  //   → [E9] msgBox.DialogHide [YES] (L243) → updateAuto() L417-435: att.Att04_CommuteHist.updateAuto(변경사유 "근로시간 일괄조정") → retrieve()
  const updateAutoChk = () => {
    if (checkedRows().length === 0) { message.warning('선택된 사원이 없습니다'); return; }
    Modal.confirm({
      title: '확인',
      content: '선택된 사원의 근로시간을 일괄조정하시겠습니까?',
      width: 420,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await attApi.updateAutoCommutes(checkedRows().map(r => r.commuteId));
        } catch (err) {
          message.error(errorMessage(err, '저장 실패'));
          return;
        }
        await retrieve();
      },
    });
  };

  // [E11] insertButton[일괄생성].Select [radio01.getValue()] (L268) → 근무일자(기준일 또는 시작·종료일)가 비면 "근무일자를 선택해주세요", Att02_Lookup_InsertBatch.open(시작, 종료, 끝나면 retrieve())
  const insertBatch = () => {
    const st = byBase ? baseDate : startDate;
    const cl = byBase ? baseDate : closeDate;
    if (!st || !cl) { message.warning('근무일자를 선택해주세요'); return; }
    setInsertTarget({ startDate: st, closeDate: cl });
  };

  // [E12] msgBox.DialogHide [YES] (L306) → adminCheck() L369-380: att.Att02_Commute.adminCheck(commuteId) → retrieve()
  //   확인창 "관리자 확인처리하시겠습니까?"(제목 "확인", 폭 300) — 잠금 아이콘(statusCode "99")이 연다
  const adminCheck = (row: AttCommute) => {
    Modal.confirm({
      title: '확인',
      content: '관리자 확인처리하시겠습니까?',
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await attApi.adminCheck(row.commuteId);
        } catch (err) {
          message.error(errorMessage(err, '저장 실패'));
          return;
        }
        await retrieve();
      },
    });
  };

  // buildGrid() L298-367
  const columnDefs = useMemo<ColDef<AttCommute>[]>(() => [
    // L324 addDynamicCell(statusCode, 35, " ", Lock, {"99"}) — 관리자 확인필요(99)인 행만 잠금 아이콘
    {
      colId: 'statusCode', width: 35, headerName: '', headerClass: 'gb-hdr', editable: false, cellStyle: { padding: 0, textAlign: 'center' },
      cellRenderer: (p: CustomCellRendererProps<AttCommute>) => (p.data?.statusCode === '99'
        ? <AntButton type="text" size="small" icon={<LockOutlined />} onClick={e => { e.stopPropagation(); if (p.data) adminCheck(p.data); }} /> : null),
    },
    gb.date('workDate', 100, '근무일자'),  // L325
    gb.textCenter('division', 100, '근무형태'),  // L326
    gb.textCenter('statusName', 140, '상태'),  // L327
    // L328 addDynamicCell(inOutReasonYnStr, 35, " ", View, true) — 사유가 있는 행만 보기 아이콘, 없으면 금지 표시
    dynamicIconCell<AttCommute>('view', 'inOutReason', 35, '', row => setReasonTarget(row), row => row.inOutReasonYnStr != null),
    gb.textCenter('personNo', 100, '사원번호'),  // L329
    gb.textCenter('personName', 80, '사원명'),  // L330
    gb.text('orgName', 160, '본부(부서)'),  // L331
    gb.textCenter('posName', 80, '직위'),  // L332
    gb.textCenter('dayOfWeek', 50, '요일'),  // L333
    // L316 addHeaderGroupMap(0, 12, "근로자 실입력", 1, 3) — 구분은 묶음 밖(2행 높이)
    gb.textCenter('dateInfo', 100, '구분'),  // L334
    gb.group('근로자 실입력', [
      gb.textCenter('checkInTimeStr', 90, '출근시간'),  // L335
      gb.textCenter('checkOutTimeStr', 90, '퇴근시간'),  // L336
      gb.textCenter('workTimeStr', 100, '근로시간'),  // L337
    ]),
    // L317 addHeaderGroupMap(0, 15, "관리자 확정"(색 2EAC7E), 1, 3)
    { ...gb.group('관리자 확정', [
      gb.textCenter('calcCheckInTimeStr', 90, '출근시간', ADMIN_COLOR),  // L338
      gb.textCenter('calcCheckOutTimeStr', 90, '퇴근시간', ADMIN_COLOR),  // L339
      gb.textCenter('calcWorkTimeStr', 100, '근로시간', ADMIN_COLOR),  // L340
    ]), ...ADMIN_COLOR },
    // L341 addCell(actionCell, 35, " ", Edit) → Att02_Edit_Commute.edit(고른 행, 끝나면 retrieve())
    iconCell<AttCommute>('edit', 'actionCell', 35, '', row => setEditTarget(row)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [retrieve]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E6] retrieveButton[조회].Select (L216) → retrieve(), [E3] searchText.KeyPress [Enter] (L178) → retrieve() — 원본 buttonBar1·2 두 줄 */}
      <SearchPanel onSearch={retrieve} loading={loading} fieldsWidth={980}>
        <SearchPanel.Row>
          {/* [E1] radio01[근무일자 :].ValueChange (L134) / [E2] radio02[근무기간 :].ValueChange (L150) → 기준일 ↔ 시작·종료일 사용 전환 */}
          <Radio.Group value={byBase ? 'base' : 'period'} onChange={e => setByBase(e.target.value === 'base')} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Radio value="base"><b>근무일자 :</b></Radio>
          </Radio.Group>
          <DatePicker style={{ width: 125 }} allowClear={false} disabled={!byBase} format={DATE} value={dayjs(baseDate)} onChange={d => d && setBaseDate(d.format(DATE))} />
          <Radio.Group value={byBase ? 'base' : 'period'} onChange={e => setByBase(e.target.value === 'base')}>
            <Radio value="period"><b>근무기간 :</b></Radio>
          </Radio.Group>
          <DatePicker style={{ width: 125 }} allowClear={false} disabled={byBase} format={DATE} value={dayjs(startDate)} onChange={d => d && setStartDate(d.format(DATE))} />
          <span>~</span>
          <DatePicker style={{ width: 125 }} allowClear={false} disabled={byBase} format={DATE} value={dayjs(closeDate)} onChange={d => d && setCloseDate(d.format(DATE))} />
          <SearchPanel.Field label="검색">
            <SearchPanel.Input style={{ width: 200 }} placeholder="사원번호/사원명/본부(부서)" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchPanel.Field>
          <SearchPanel.Field label="사원">
            {/* [E4] empKorName.TriggerClick [result == null] (L189) → Emp00_Lookup_SelectSingle.open(전체 단추): 사원이면 이름·personId, [전체](null)이면 "전체"·personId null
                [E5] empKorName.Change (L208) → 칸이 비면 personId null (읽기 전용 칸이라 x 단추로 지운다) */}
            <LookupInput width={100} value={empName} placeholder="전체" onOpen={() => setEmpOpen(true)} onClear={() => { setEmpName(''); setPersonId(null); }} />
          </SearchPanel.Field>
        </SearchPanel.Row>
        <SearchPanel.Row />
        <SearchPanel.Actions>
          <Button type="change" onClick={update}>일괄수정</Button>
          <Button type="generate" onClick={insertBatch}>일괄생성</Button>
        </SearchPanel.Actions>
        <SearchPanel.Actions>
          <Button type="view" onClick={updateAutoChk}>근로시간 일괄조정</Button>
          {/* [E10] settingButton[근태정책설정].Select (L261) → Att01_Lookup_WorkPolicy.open() */}
          <Button type="settings" onClick={() => setPolicyOpen(true)}>근태정책설정</Button>
        </SearchPanel.Actions>
      </SearchPanel>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<AttCommute>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.commuteId)}
        />
      </div>
      <Att02_Edit_InOutReason target={reasonTarget} onClose={() => setReasonTarget(null)} />
      <Att02_Edit_Commute target={editTarget} onSaved={() => { void retrieve(); }} onClose={() => setEditTarget(null)} />
      <Att02_Edit_CommuteBatch rows={batchRows} onSaved={() => { void retrieve(); }} onClose={() => setBatchRows(null)} />
      <Att02_Lookup_InsertBatch target={insertTarget} onSaved={() => { void retrieve(); }} onClose={() => setInsertTarget(null)} />
      <Att01_Lookup_WorkPolicy open={policyOpen} onClose={() => setPolicyOpen(false)} />
      <Emp00_Lookup_SelectSingle
        open={empOpen}
        transDate={dayjs().format(DATE)}
        onResult={row => {
          setEmpOpen(false);
          if (row) { setEmpName(row.korNm ?? ''); setPersonId(row.personId); } else { setEmpName(''); setPersonId(null); }
        }}
        onClose={() => setEmpOpen(false)}
      />
    </div>
  );
};
