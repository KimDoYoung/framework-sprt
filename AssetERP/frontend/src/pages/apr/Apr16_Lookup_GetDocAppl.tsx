/**
 * 신청내역 가져오기 창 — Apr16_Tab_StampDocManager의 "신청내역 가져오기" 링크에서 연다 (T23)
 * AS-IS: myApp/client/vi/apr/Apr16_Lookup_GetDocAppl.java (183줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L60-81: 모달 1100×450 "신청내역"(창 닫기 X 없음), 툴바 [조회] + 체크박스 다중 그리드(신청일자 90 · 신청자 80 · 제공처 180 · 목적 180 · 구분 130 · 인감 및 대표명의 250 · 신청매수 70),
 *   아래 가운데 [확인][닫기]
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { aprStampDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprStampDocAppl } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<AprStampDocAppl>();
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

interface Props {
  open: boolean;
  /** callback.execute() — [확인] 등록 성공 뒤, [닫기] */
  onDone: () => void;
}

export const Apr16_Lookup_GetDocAppl: React.FC<Props> = ({ open, onDone }) => {
  const gridRef = useRef<AgGridReact<AprStampDocAppl>>(null);
  const [rows, setRows] = useState<AprStampDocAppl[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L127-139: apr.Apr16_StampDoc.selectApplDocByRegDateIsNull(companyId)
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await aprStampDocApi.searchAppl());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L60-81, open L50-58) → settings() · retrieve()
  useEffect(() => {
    if (!open) return;
    setRows([]);
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] updateButton[확인].Select (L90) · [E4] grid.CellDoubleClick (L104) → update() L141-178
  const update = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('선택된 내역이 없습니다'); return; }
    // [E5] messageBox.DialogHide (L156) → YES면 apr.Apr16_StampDoc.updateRegDate(선택한 행) 뒤 callback(), hide()
    Modal.confirm({
      title: '확인',
      content: `${selected.length}건의 신청내역을 등록하시겠습니까?`,
      width: 350,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await aprStampDocApi.registerRegDate(selected.map(r => r.stampDocId));
          onDone();
        } catch (err) {
          message.error(errorMessage(err, '등록 실패'));
        }
      },
    });
  };

  // buildGrid() L112-125
  const columnDefs = useMemo(() => [
    gb.date('applDate', 90, '신청일자'),  // L116
    gb.textCenter('applEmpName', 80, '신청자'),  // L117
    gb.text('provideCo', 180, '제공처'),  // L118
    gb.text('purpose', 180, '목적'),  // L119
    gb.textCenter('applTypeName', 130, '구분'),  // L120
    gb.text('stampReprCorpName', 250, '인감 및 대표명의'),  // L121
    gb.longCenter('docApplQty', 70, '신청매수'),  // L122
  ], []);

  return (
    <LookupModal
      open={open}
      title="신청내역"
      width={1100}
      maskClosable={false}
      closable={false}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>확인</Button>
            {/* [E3] cancleButton[닫기].Select (L96) → callback(), hide() */}
            <Button type="close" onClick={onDone}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L84) → retrieve() */}
        <div><Button type="search" onClick={retrieve}>조회</Button></div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<AprStampDocAppl>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.stampDocId)}
            loading={loading}
            rowSelection={MULTI_SELECTION}
            onRowDoubleClicked={update}
          />
        </div>
      </div>
    </LookupModal>
  );
};
