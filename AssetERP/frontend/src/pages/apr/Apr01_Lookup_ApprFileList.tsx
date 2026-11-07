/**
 * 첨부파일 옵션설정 창 (V05) — 상신 편집창 [첨부파일 옵션설정]이 연다. 첨부파일의 순서와, 문서 미리보기·PDF를 만들 때 파일·확장자를 보일지를 정한다.
 * AS-IS: myApp/client/vi/apr/Apr01_Lookup_ApprFileList.java (207줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L54-91: 760×500 모달 "첨부파일 옵션설정"(닫기 X 없음), 위 안내 글(파랑), 그리드(▲ 25 · 첨부파일 405 · ▼ 25 · [대외문서] 파일 표시 120 · 확장자 표시 120), 푸터 [저장][닫기]
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { aprAttachApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprEditFile } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<AprEditFile>();
const TEXT = '>> 첨부파일의 순서를 설정하거나 문서 미리보기 및 PDF생성 시, 파일의 출력여부를 설정합니다.';

interface Props {
  /** open(apprModel, callback) — 값이 있으면 열린다 */
  apprId: number | null;
  /** [닫기] — AS-IS callback.execute(): 부른 쪽이 첨부 목록을 다시 읽는다 */
  onClosed: () => void;
  onClose: () => void;
}

export const Apr01_Lookup_ApprFileList: React.FC<Props> = ({ apprId, onClosed, onClose }) => {
  const [rows, setRows] = useState<AprEditFile[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<AprEditFile>>(null);

  // retrieve() L182-193: sys.Sys10_File.selectByParentId(parentId)
  const retrieve = useCallback(async () => {
    if (apprId == null) return;
    setLoading(true);
    try {
      setRows(await aprAttachApi.getEditFiles(apprId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [apprId]);
  useEffect(() => {
    if (apprId == null) { setRows([]); setSelectedId(null); return; }
    void retrieve();
  }, [apprId, retrieve]);

  // changeRow() L118-143 · getSeq() L145-152: 위/아래로 옮기고 번호를 000 형식으로 다시 매긴다. 옮기는 줄은 눌러서 고른 줄
  const changeRow = (action: 'up' | 'down', row: AprEditFile) => {
    setRows(prev => {
      const idx = prev.findIndex(r => r.fileId === row.fileId);
      const next = [...prev];
      if (action === 'down' && idx + 1 < next.length) { next.splice(idx, 1); next.splice(idx + 1, 0, prev[idx]); }
      else if (action === 'up' && idx > 0) { next.splice(idx, 1); next.splice(idx - 1, 0, prev[idx]); }
      else return prev;
      return next.map((r, i) => ({ ...r, seq: String(i + 1).padStart(3, '0') }));
    });
    setSelectedId(row.fileId);
  };

  // [E1] updateButton[저장].Select (L64) → update() L154-180: 모든 줄을 sys.Sys10_File.updateOthers(출력·확장자·순서) → "저장이 완료되었습니다" → retrieve()
  const update = async () => {
    if (apprId == null) return;
    try {
      await aprAttachApi.saveOptions(apprId, rows.map(r => ({ fileId: r.fileId, printYn: r.printYn, extYn: r.extYn, seq: r.seq ?? '' })));
      Modal.info({ title: '확인', content: '저장이 완료되었습니다', okText: '확인' });
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E2] closeButton[닫기].Select (L70) → callback(), hide()
  const close = () => { onClosed(); onClose(); };

  // buildGrid() L93-116
  const columnDefs = useMemo(() => [
    { colId: 'upAction', headerName: '', width: 25, cellRenderer: () => '▲', onCellClicked: (p: { data?: AprEditFile }) => p.data && changeRow('up', p.data), cellStyle: { cursor: 'pointer', textAlign: 'center' } },  // L100 upButton
    gb.text('fileName', 405, '첨부파일'),  // L106
    { colId: 'downAction', headerName: '', width: 25, cellRenderer: () => '▼', onCellClicked: (p: { data?: AprEditFile }) => p.data && changeRow('down', p.data), cellStyle: { cursor: 'pointer', textAlign: 'center' } },  // L107 downButton
    gb.group('대외문서', [
      gb.boolean('printYn', 120, '파일 표시', { editable: true }),  // L108
      gb.boolean('extYn', 120, '확장자 표시', { editable: true }),  // L109
    ]),
  ], []);

  return (
    <LookupModal
      open={apprId != null}
      title="첨부파일 옵션설정"
      width={820}
      style={{ top: 20 }}
      closable={false}
      maskClosable={false}
      onCancel={close}
      destroyOnClose
      focusFirst={false}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button type="save" onClick={update}>저장</Button>
          <Button type="close" onClick={close}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 12, color: '#527BB7' }}>{TEXT}</div>
        <div style={{ height: 'min(320px, calc(100vh - 300px))' }}>
          <SingleGrid<AprEditFile>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.fileId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            getRowClass={p => (p.data && p.data.fileId === selectedId ? 'ag-row-selected' : undefined)}
            onCellValueChanged={e => {
              if (!e.data || (e.colDef.field !== 'printYn' && e.colDef.field !== 'extYn')) return;
              const id = e.data.fileId;
              const field = e.colDef.field as 'printYn' | 'extYn';
              setRows(prev => prev.map(r => (r.fileId === id ? { ...r, [field]: !!e.newValue } : r)));
            }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
