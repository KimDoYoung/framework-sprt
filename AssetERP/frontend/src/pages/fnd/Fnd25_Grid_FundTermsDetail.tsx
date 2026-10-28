/**
 * 펀드규약 개정 목록 (P12) — Fnd25_Tab_FundTermsManager 오른쪽
 * AS-IS: myApp/client/vi/fnd/Fnd25_Grid_FundTermsDetail.java (299줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L59-85: 위(50) = 툴바(검색 190 "펀드규약명" · [조회][등록][등록(복사)] · [삭제]) + 개정 그리드(행번호, 체크박스 다중). 엑셀다운로드는 주석 처리(L65-66)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { Terms, TermsRevision } from '@/types/fnd';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Fnd25_Edit_FundTermsManager, TermsEditTarget } from './Fnd25_Edit_FundTermsManager';

const gb = gbFor<TermsRevision>();

interface Props {
  /** retrieve(selectModel) L163-178: 고른 규약. nonce가 바뀌면 같은 규약이라도 다시 조회한다(왼쪽이 다시 조회했을 때) */
  target: { terms: Terms; nonce: number } | null;
  /** AS-IS callback.execute() — 삭제·저장 뒤 부르는 쪽(왼쪽 목록)이 다시 조회한다 */
  onChanged: () => void;
}

export const Fnd25_Grid_FundTermsDetail: React.FC<Props> = ({ target, onChanged }) => {
  const gridRef = useRef<AgGridReact<TermsRevision>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TermsRevision[]>([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<TermsEditTarget | null>(null);
  const termsId = target?.terms.termsId;
  const retrieveSeq = useRef(0);
  const searchTextRef = useRef(searchText);
  searchTextRef.current = searchText;

  // retrieve(selectModel) L163-178: fnd.Fnd26_TermsDetail.selectBySearchTextManager (termsId, "%검색어%")
  const retrieve = useCallback(async () => {
    if (termsId == null) { setRows([]); return; }
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await fndApi.searchTermsRevisions(termsId, searchTextRef.current);
      if (my === retrieveSeq.current) setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }, [termsId]);

  // [E0] 화면 열림 (생성자 L59-85) → settings() — 열릴 때 조회하지 않고, 왼쪽에서 규약을 고르거나 다시 조회할 때 (retrieveTabPage() L221-224 → detailGrid.retrieve(selectModel))
  useEffect(() => { void retrieve(); }, [retrieve, target?.nonce]);

  const checked = () => gridRef.current?.api?.getSelectedRows() ?? [];

  // [E3] insertButton[등록].Select (L105) → insert() L208-225: 개정회차 최댓값의 행으로 Fnd25_Edit_FundTermsManager.newFundTerms() L224-260 — 회차 +1, 사용, 새 ID
  const insert = async () => {
    const max = rows.filter(r => r.revisionNo != null).reduce<TermsRevision | null>((m, r) => (m == null || r.revisionNo! > m.revisionNo! ? r : m), null);
    const base: Partial<TermsRevision> = max ?? { ...target?.terms, revisionNo: 0 };
    try {
      const termsDetailId = await fndApi.getTermsNextId();
      setEditTarget({
        mode: 'new',
        model: {
          termsDetailId, termsId: base.termsId, termsType: base.termsType, termsTypeName: base.termsTypeName, termsName: base.termsName,
          content: '', note: '', seq: base.seq, useYn: true, revisionNo: (base.revisionNo ?? 0) + 1, ksdFundCode: base.ksdFundCode, fundId: base.fundId,
        },
      });
    } catch (err) {
      message.error(errorMessage(err, '새 ID를 받지 못했습니다'));
    }
  };

  // [E5] copyButton[등록(복사)].Select (L117) → copyInsert() L227-244 → copyFundTerms() L288-334: 고른 행을 새 ID로 복사
  const copyInsert = async () => {
    const list = checked();
    if (list.length === 0) return void message.warning('복사할 대상을 선택해주세요.');
    if (list.length > 1) {
      Modal.info({ title: '확인', content: <>한개의 데이터만 복사가 가능합니다. <br />한개의 데이터만 선택바랍니다.</>, width: 350 });
      return;
    }
    const src = list[0];
    try {
      const termsDetailId = await fndApi.getTermsNextId();
      setEditTarget({
        mode: 'copy',
        model: {
          termsDetailId, termsId: src.termsId, content: src.content, note: src.note, revisionDate: src.revisionDate, revisionNo: src.revisionNo, useYn: src.useYn,
          termsType: src.termsType, termsName: src.termsName, termsTypeName: src.termsTypeName, seq: src.seq, ksdFundCode: src.ksdFundCode, fundId: src.fundId,
        },
      });
    } catch (err) {
      message.error(errorMessage(err, '새 ID를 받지 못했습니다'));
    }
  };

  // [E4] deleteButton[삭제].Select (L111) → deleteRow() L180-206: "n건의 정보를 삭제하시겠습니까?"(제목 "삭제") → [E7] messageBox.DialogHide [YES] (L183) → fnd.Fnd26_TermsDetail.delete → callback.execute()
  const deleteRow = () => {
    const list = checked();
    if (list.length === 0) return void message.warning('삭제할 행을 선택하세요.');
    Modal.confirm({
      title: '삭제',
      content: `${list.length}건의 정보를 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await fndApi.deleteTermsRevisions(list.map(r => r.termsDetailId));
          onChanged();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // buildGrid() L131-161
  const columnDefs = useMemo(() => [
    // [E6] editCell (ImageCell, L138) → Fnd25_Edit_FundTermsManager.editFundTerms(): 고른 행(내용 포함)을 연다 — 수정이 끝나면 다시 조회
    iconCell<TermsRevision>('edit', 'actionCell', 55, '수정', row => setEditTarget({ mode: 'edit', model: { ...row } })),
    gb.text('termsName', 320, '펀드규약명'),
    gb.date('revisionDate', 90, '제개정일'),
    gb.longCenter('revisionNo', 70, '개정회차'),
    gb.longCenter('fileCnt', 90, '첨부파일 갯수'),
    gb.booleanYn2('useYn', 30, '사용'),
    gb.date('closeDate', 90, '종료일'),
    gb.text('note', 270, '비고'),
    gb.textCenter('updName', 70, '변경자'),
    gb.textCenter('updDateStr', 140, '작성(변경)일'),
  ], []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L99), [E1] searchTextField.KeyPress [Enter] (L90) → retrieve(termsDetailModel) */}
      <SearchBar
        onSearch={retrieve}
        loading={loading}
        extra={<>
          <Button type="register" onClick={insert} disabled={!target}>등록</Button>
          <Button type="register" onClick={copyInsert}>등록(복사)</Button>
          <Button type="delete" onClick={deleteRow}>삭제</Button>
        </>}
      >
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 190 }} placeholder="펀드규약명" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
        <MultiGrid<TermsRevision>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.termsDetailId)}
          loading={loading}
        />
      </div>
      <Fnd25_Edit_FundTermsManager target={editTarget} onDone={() => { void retrieve(); onChanged(); }} onClose={() => setEditTarget(null)} />
    </div>
  );
};
