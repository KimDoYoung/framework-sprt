/**
 * 펀드규약 내용 조회창 (P07) — Fnd01_Tab_FundSearch 그리드의 [규약보기] 아이콘이 연다 (viewContent L285-289)
 * AS-IS: myApp/client/vi/fnd/Fnd25_Lookup_Content.java (226줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L52-85: 모달 1154×800 "펀드규약", 왼쪽 310 = 개정 목록 그리드(제개정일 90 · 개정회차 70 · 첨부파일 80 · 아이콘 40, 행번호 없음), 가운데 = 선택한 개정의 본문(HTML), 아래 가운데 [닫기]
 * 첨부파일 아이콘은 Com01_Lookup_RelateFile.view(termsDetailId) — 같은 AS-IS 패턴(Bbs02 openUser)의 Bbs02_Lookup_File로 연다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { FundTermsDetail } from '@/types/fnd';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { HtmlView } from '@/components/form/HtmlView';
import { Bbs02_Lookup_File } from '@/pages/bbs/Bbs02_Lookup_File';

const gb = gbFor<FundTermsDetail>();

interface Props {
  /** open(termsId) L108-113 — 값이 있으면 열린다 */
  termsId: number | null | undefined;
  onClose: () => void;
}

// [E0] 화면 열림 (생성자 L52-85) → settings(), show() · open(termsId) L108-113 → retrieve()
export const Fnd25_Lookup_Content: React.FC<Props> = ({ termsId, onClose }) => {
  const gridRef = useRef<AgGridReact<FundTermsDetail>>(null);
  const [rows, setRows] = useState<FundTermsDetail[]>([]);
  const [selected, setSelected] = useState<FundTermsDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileParentId, setFileParentId] = useState<number | null>(null);

  // retrieve() L134-169: fnd.Fnd26_TermsDetail.selectByTermsId → 개정회차가 가장 큰 행을 고르고 본문을 보여 준다(없으면 첫 행)
  useEffect(() => {
    if (termsId == null) return;
    setRows([]); setSelected(null); setLoading(true);
    fndApi.searchTermsDetails(termsId)
      .then(list => {
        setRows(list);
        const max = list.reduce<FundTermsDetail | null>((m, r) => (r.revisionNo != null && (m == null || r.revisionNo > (m.revisionNo ?? -1)) ? r : m), null);
        const pick = max ?? list[0] ?? null;
        setSelected(pick);
        if (pick) setTimeout(() => gridRef.current?.api?.getRowNode(String(pick.termsDetailId))?.setSelected(true), 0);
      })
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => setLoading(false));
  }, [termsId]);

  // [E2] grid.SelectionChanged [선택>0] (L95) → setContent() L171-180: 선택하면 본문을 켜고 보여 주고, 선택이 없으면 본문을 끈다
  const onSelectionChanged = () => setSelected(gridRef.current?.api?.getSelectedRows()[0] ?? null);

  // buildGrid() L115-132 (행번호 숨김)
  const columnDefs = useMemo(() => [
    gb.date('revisionDate', 90, '제개정일'),
    gb.longCenter('revisionNo', 70, '개정회차'),
    gb.longCenter('fileCnt', 80, '첨부파일'),
    iconCell<FundTermsDetail>('view', 'actionCell', 40, '', row => setFileParentId(row.termsDetailId)),  // Com01_Lookup_RelateFile.view(termsDetailId)
  ], []);

  return (
    <>
      <LookupModal
        open={termsId != null}
        title="펀드규약"
        width={1154}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E1] closeButton[닫기].Select (L88) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 640, display: 'flex', gap: 0 }}>
          <div style={{ width: 310, flexShrink: 0, border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
            <SingleGrid<FundTermsDetail>
              gridRef={gridRef}
              rowData={rows}
              rowNumber={false}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.termsDetailId)}
              loading={loading}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0, marginLeft: -1, border: '1px solid #d9d9d9', boxSizing: 'border-box', background: '#fff', opacity: selected ? 1 : 0.5 }}>
            <HtmlView html={selected?.content} height="100%" />
          </div>
        </div>
      </LookupModal>
      <Bbs02_Lookup_File open={fileParentId != null} parentId={fileParentId} onClose={() => setFileParentId(null)} />
    </>
  );
};
