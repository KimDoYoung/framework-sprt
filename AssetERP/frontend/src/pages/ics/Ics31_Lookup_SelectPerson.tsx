/**
 * 사원명 조회창 (V28) — 내부통제 준수점검(준감인) 툴바의 사원명 칸에서 연다.
 * AS-IS: myApp/client/vi/ics/Ics31_Lookup_SelectPerson.java (181줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 700×500(원본) → 열 폭 합계(조직 200·직책 120·사번 80·성명 100·발령일 100 + 행번호·선택 60 + 여백 130) 기준 790 (03 원칙 21):
 *   검색줄(검색 "조직/성명" 200 + [조회]) + 단일 선택 그리드 + [확인][전체][닫기]
 * open(stdDate, cycleType, callback) L45-58: 열 때 곧바로 retrieve() — ics.Ics30_Compliance.selectWriterId(내가 확인자인 확정 작성 사원)
 * UX보강(10): 검색 줄 = SearchBar(UX-01·04), 조회창(UX-05·06)
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { icsApi } from '@/api/ics';
import { IcsComplianceWriter } from '@/types/ics';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<IcsComplianceWriter>();

/** buildGrid() L127-140 (setChecked SINGLE) */
const buildGrid = () => [
  gb.text('orgName', 200, '조직'),  // L133
  gb.text('titleName', 120, '직책'),  // L134
  gb.text('empNo', 80, '사번'),  // L135
  gb.text('personName', 100, '성명'),  // L136
  gb.date('transDate', 100, '발령일'),  // L137
];

interface Props {
  /** 값이 true인 동안 열려 있다 */
  open: boolean;
  /** 기준 분기(월)의 말일 'yyyy-MM-dd' (AS-IS getDate()) */
  stdDate: string;
  cycleType: string;
  /** AS-IS callback.execute(model): [확인]·더블클릭이면 고른 사원, [전체]이면 null. 닫기는 이 창이 onClose로 한다 */
  onResult: (row: IcsComplianceWriter | null) => void;
  onClose: () => void;
}

export const Ics31_Lookup_SelectPerson: React.FC<Props> = ({ open, stdDate, cycleType, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<IcsComplianceWriter>>(null);
  const [findText, setFindText] = useState('');
  const [rows, setRows] = useState<IcsComplianceWriter[]>([]);
  const [loading, setLoading] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L142-158: ics.Ics30_Compliance.selectWriterId(companyId, stdDate, searchText = '%' + 글자 + '%' — 서버가 감싼다, cycleType, confirmerId = 로그인 사원)
  const retrieve = useCallback(async (text: string) => {
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await icsApi.searchComplianceConfirmWriters(stdDate, cycleType, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, [stdDate, cycleType]);

  // [E0] 화면 열림 (생성자 → show(), retrieve()) — 원본은 열 때마다 새 창이라 입력을 비우고 바로 조회한다
  useEffect(() => {
    if (!open) return;
    setFindText('');
    setRows([]);
    void retrieve('');
  }, [open, retrieve]);

  // confirm() L160-172: 고른 사원이 없으면 "선택된 사원이 없습니다", 있으면 callback(선택) + hide()
  const confirm = () => {
    const row = gridRef.current?.api.getSelectedRows()[0];
    if (!row) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    onResult(row);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="사원선택"
      width={790}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] oKButton[확인].Select (L78) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] nullButton[전체].Select [callback != null] (L84) → callback(null), hide() */}
            <Button type="selectNone" onClick={() => { onResult(null); onClose(); }}>전체</Button>
            {/* [E5] cancelButton[닫기].Select (L93) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L72) → retrieve(). 초기화(UX-02)는 조건이 1개라 없음 */}
        <SearchBar onSearch={() => retrieve(findText)} loading={loading}>
          <SearchBar.Field label="검색">
            {/* [E1] findTextField.KeyPress [Enter] (L64) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="조직/성명" value={findText} onChange={e => setFindText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E6] grid.CellDoubleClick (L111) → confirm() */}
          <SingleGrid<IcsComplianceWriter>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.personId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </LookupModal>
  );
};
