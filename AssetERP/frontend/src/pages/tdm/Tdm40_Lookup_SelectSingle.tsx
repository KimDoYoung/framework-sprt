/**
 * 매뉴얼 선택 조회창 (N16) — 매뉴얼 부서지정(Tdm41_Tab_ManlDutyOrg)의 매뉴얼작업 칸이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm40_Lookup_SelectSingle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 1180×500(원본): 열 합계 1050+행번호·선택 60+여백 130 = 1240이라 원본 폭 1180에 가로 스크롤을 허용한다(03 원칙 21).
 * 검색줄(검색 · 작성중만 조회 · [조회]) + 단일 선택 그리드 + [확인][닫기]. 열 때 checkYn=false(open(false, …)) — N17은 `checkYn`으로 open(true, …)(내 부서 확정 작업만, 작성중만 조회 끔·비활성)
 * UX보강(10): 검색 줄 = SearchBar(UX-01), 조회창(UX-05·06), 읽기 전용 날짜 열 90(UX-08)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlJob } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TdmManlJob>();

/** buildGrid() L132-145 (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('jobName', 300, '매뉴얼작업명'),  // L135
  gb.text('roleName', 200, '직책'),  // L136
  gb.date('manlApplyStartDate', 90, '매뉴얼<br>적용시작일'),  // L137
  gb.date('startDate', 90, '작성시작일'),  // L138
  gb.date('endDate', 90, '작성마감일'),  // L139
  gb.textCenter('dutyCntStr', 100, '작성현황'),  // L140
  gb.booleanYn2('dutyEndYn', 90, '완료여부'),  // L141
  gb.date('dutyEndDate', 90, '완료일'),  // L142
];

interface Props {
  open: boolean;
  /** AS-IS callback.execute(고른 매뉴얼작업). 닫기는 onClose */
  onSelect: (job: TdmManlJob) => void;
  onClose: () => void;
  /** AS-IS open(checkYn, …) — true(N17 책무관리자가 아닌 사용자)면 내 부서가 확정된 작업만 읽고 "작성중만 조회"는 꺼진 채 비활성. 기본 false */
  checkYn?: boolean;
}

export const Tdm40_Lookup_SelectSingle: React.FC<Props> = ({ open, onSelect, onClose, checkYn = false }) => {
  const gridRef = useRef<AgGridReact<TdmManlJob>>(null);
  const [searchText, setSearchText] = useState('');
  const [writingYn, setWritingYn] = useState(!checkYn);   // writingYn "작성중만 조회" = true (settings L104-105)
  const [rows, setRows] = useState<TdmManlJob[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L147-162: tdm.Tdm40_ManlJob.selectByText (companyId·orgId는 서버, searchText "%…%", writingYn, checkYn) — createDutyYn은 안 보내 서버 기본 true
  const retrieve = useCallback(async (text: string, writing: boolean) => {
    try {
      setRows(await tdmApi.searchManlJobs({ searchText: text, writingYn: writing, checkYn, createDutyYn: true }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [checkYn]);

  // [E0] 화면 열림 (생성자 L64-91) → settings(), show() / open() L52-62 → retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setWritingYn(!checkYn);                       // open(true) L55-58: 작성중만 조회를 끄고 비활성
    setRows([]);
    void retrieve('', !checkYn);
  }, [open, retrieve, checkYn]);

  // confirm() L164-172: 선택이 없으면 "선택된 매뉴얼이 없습니다", 있으면 callback + hide()
  const confirm = (fallback?: TdmManlJob) => {
    const selected = gridRef.current?.api.getSelectedRows()[0] ?? fallback;
    if (!selected) {
      message.warning('선택된 매뉴얼이 없습니다');
      return;
    }
    onSelect(selected);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="매뉴얼 선택"
      width={1180}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] updateButton[확인].Select (L118) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E5] closeButton[닫기].Select (L124) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L96)·[E3] retrieveButton[조회].Select (L112) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText, writingYn)}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="매뉴얼작업명/직책" value={searchText} onChange={e => setSearchText(e.target.value)} />
            <Checkbox checked={writingYn} disabled={checkYn} onChange={e => setWritingYn(e.target.checked)}>작성중만 조회</Checkbox>
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.CellDoubleClick (L106) → confirm() */}
          <SingleGrid<TdmManlJob>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.manlJobId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
