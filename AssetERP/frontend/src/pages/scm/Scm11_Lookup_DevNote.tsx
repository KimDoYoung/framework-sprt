/**
 * 개발내용 창 (EE101) — 개발 건의 [개발내용]과 단계별 확인 결과를 한 화면에 보여 준다
 * AS-IS: myApp/client/vi/scm/Scm11_Lookup_DevNote.java (181줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, IDMS-IC)
 * 호출처 Scm11_Tab_DevTest(개발테스트)는 TOBE에 아직 없다 — 창만 만들고 여는 곳은 없다.
 * open(devStepModel) L57-140: 모달 1000×700 "개발내용" · 위 [개발내용](HTML, 읽기 전용) 300 · 아래 왼쪽 단계 그리드 400 + 오른쪽 [결과](HTML) 588 · 아래 가운데 [닫기]
 * 그리드 buildApprStepGrid() L144-153 (체크 없음, 한 줄 선택, 정렬 없음): 구분 60 · 담당자 80 · 확인일시 140 · 결과 60
 * retrieve() L155-166: scm.Scm11_DevStep.selectByDevId(devId) — 처음에는 아무 줄도 고르지 않는다(오른쪽은 비어 있다)
 * 스타일: MH (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { errorMessage } from '@/api/client';
import { DevStep } from '@/types/scm';
import { SingleGrid, gbFor } from '@/components/grid';
import { HtmlView } from '@/components/form/HtmlView';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { MODAL_HEADER_STYLE } from './scmGridCells';

const gb = gbFor<DevStep>();

interface Props {
  open: boolean;
  /** open(devStepModel).getDevId() — 단계 목록을 읽을 개발 */
  devId: number | null;
  /** open(devStepModel).getDevNote() — 위쪽 [개발내용](HTML). 없으면 비워 둔다 (L74) */
  devNote: string | null;
  onClose: () => void;
}

export const Scm11_Lookup_DevNote: React.FC<Props> = ({ open, devId, devNote, onClose }) => {
  const gridRef = useRef<AgGridReact<DevStep>>(null);
  const [rows, setRows] = useState<DevStep[]>([]);
  const [loading, setLoading] = useState(false);
  // apprStepGrid.RowClick (L93-117): 고른 줄이 있으면 그 줄의 결과를 오른쪽에 보여 주고, 없으면 비운다
  const [selected, setSelected] = useState<DevStep | null>(null);

  // [E0] 화면 열림 (open L57-140) → show() → retrieve() L155-166
  useEffect(() => {
    if (!open || devId == null) return;
    let alive = true;
    setSelected(null);  // resultHtmlLayoutContainer.clear() L83-84
    setRows([]);
    setLoading(true);  // apprStepGrid.mask("Loading")
    scmApi.searchDevSteps(devId)
      .then(list => { if (alive) setRows(list); })
      .catch(err => { if (alive) message.error(errorMessage(err, '조회 실패')); })
      .finally(() => { if (alive) setLoading(false); });  // unmask()
    return () => { alive = false; };
  }, [open, devId]);

  const columnDefs = useMemo(() => [
    gb.text('devStepNm', 60, '구분'),
    gb.text('personNm', 80, '담당자'),
    gb.text('resultDateStr', 140, '확인일시'),
    gb.text('resultNm', 60, '결과'),
  ], []);

  return (
    <LookupModal
      open={open}
      title="개발내용"
      width={1000}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      focusFirst={false}
      styles={{ header: MODAL_HEADER_STYLE }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E1] closeButton[닫기].Select (L86) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 598, boxSizing: 'border-box' }}>
        {/* row00 L119-120: devNotehtmlLayoutContainer 988×300 */}
        <div style={{ height: 300, flex: 'none' }}>
          <HtmlView html={devNote} height={300} />
        </div>
        {/* row01 L122-124: 그리드 400 + 결과 588, 위 칸과 1px 겹침(Margins -1) */}
        <div style={{ display: 'flex', height: 298, flex: 'none', marginTop: -1 }}>
          <div style={{ width: 400, flex: 'none', height: '100%' }}>
            {/* [E2] apprStepGrid.RowClick (L93) → 고른 줄의 결과를 오른쪽에 채운다 */}
            <SingleGrid<DevStep>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.devStepId)}
              loading={loading}
              onRowClicked={e => setSelected(e.data ?? null)}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0, marginLeft: -1 }}>
            <HtmlView html={selected?.result} height={298} />
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
