/**
 * 프로그램 List 조회창 (EE16) — Scm03_Grid_ExpectProgram의 [등록]이 연다 (예상프로그램 고르기)
 * AS-IS: myApp/client/vi/scm/Scm30_Lookup_SelectMulti.java (197줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(srModel, callback) L53-135: 모달 700×700 "프로그램 List", 검색 줄 = 시스템(의뢰의 시스템, 막힘) 구분(콤보 ProgramType, "전체") 검색(100) [조회] /
 *   그리드(체크 다중: 구분 80 · 프로그램코드 200 · 프로그램명 200 · 비고 200) + 아래 페이징 툴바(100건) / [확인][취소]
 * 열 때 조회하지 않는다(파라미터가 없어 비어 있다). retrieve() L150-177: 시스템·구분·"%검색어%" → 1페이지 부터. confirm() L179-188: 고른 것이 없으면 "선택된 프로그램이 없습니다"
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useMemo, useState } from 'react';
import { message, Space } from 'antd';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { Program } from '@/types/scm';
import { Button } from '@/components/button';
import { MultiGrid, PagingToolBar, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<Program>();
const LIMIT = 100;
const ALL_CODE: [string, string] = ['%', '전체'];

interface Props {
  open: boolean;
  /** open(srModel, …)의 의뢰 시스템 코드(막힌 콤보) */
  systemCd: string | null;
  /** callback.execute(list) */
  onResult: (list: Program[]) => void;
  onClose: () => void;
}

export const Scm30_Lookup_SelectMulti: React.FC<Props> = ({ open, systemCd, onResult, onClose }) => {
  const [programType, setProgramType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Program[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);

  // buildGrid() L137-148 (체크 다중)
  const columnDefs = useMemo(() => [
    gb.text('programTypeNm', 80, '구분'),
    gb.text('programCd', 200, '프로그램코드'),
    gb.text('programNm', 200, '프로그램명'),
    gb.text('note', 200, '비고'),
  ], []);

  // [E1] findTextField.KeyPress [Enter] (L63) · [E2] retrieveButton[조회].Select (L80) → retrieve() L150-177 (1페이지부터)
  const retrieve = async (p = 1) => {
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await scmApi.searchPrograms({ systemCode: systemCd || '%', programType, searchText, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E3] oKButton[확인].Select (L86) · [E5] grid.CellDoubleClick (L123) → confirm() L179-188
  const confirm = (list: Program[] = checked) => {
    if (list.length === 0) { message.warning('선택된 프로그램이 없습니다'); return; }
    onResult(list);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="프로그램 List"
      width={880}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L92) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 520, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar onSearch={() => void retrieve(1)} loading={loading}>
          <SearchBar.Field label="시스템">
            <SystemCodeComboBox kindCd="SystemCode" disabled style={{ width: 120 }} value={systemCd ?? undefined} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            <SystemCodeComboBox kindCd="ProgramType" altCode={ALL_CODE} style={{ width: 120 }} value={programType} onChange={c => setProgramType(c ?? '%')} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 100 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<Program>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.programId)}
            loading={loading}
            rowClick
            onCheckedChange={setChecked}
            onRowDoubleClicked={e => e.data && confirm([e.data])}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void retrieve(p)} />
      </div>
    </LookupModal>
  );
};
