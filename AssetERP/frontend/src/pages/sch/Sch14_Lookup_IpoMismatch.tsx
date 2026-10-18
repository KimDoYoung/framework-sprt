/**
 * 공모주일정 미일치내역 창 (E20) — Sch10_Tab_IpoAdmin의 [미일치내역]에서 연다
 * AS-IS: myApp/client/vi/sch/Sch14_Lookup_IpoMismatch.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L52-84: 모달 1500×500 "공모주일정 미일치내역"(닫기 X 없음), 위 = 툴바(체크 "미확인 종목만 조회"(기본 켬) · [조회]),
 *   아래 = 단순 그리드(행번호: 종목코드 80 · 공모주일정 550 · IpoStock 550 · 생성일시 150 · 확인완료 80(체크)), 아래 가운데 [닫기]
 * 조회는 쓰기다: 서버가 먼저 DB 함수(f_create_ipoMismatch)로 미일치내역을 새로 만든다(원본 그대로)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Checkbox, message, Modal } from 'antd';
import type { CellValueChangedEvent } from 'ag-grid-community';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch14IpoMismatch } from '@/types/sch';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<Sch14IpoMismatch>();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sch14_Lookup_IpoMismatch: React.FC<Props> = ({ open, onClose }) => {
  const [checkYn, setCheckYn] = useState(true);                       // checkYn.setValue(true) L89
  const [rows, setRows] = useState<Sch14IpoMismatch[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L185-211: 서비스 sch.Sch14_IpoMismatch.createIpoMismatch(실패면 서버 메시지) → selectByCheckYn(checkYn)
  const retrieve = useCallback(async (only = checkYn) => {
    setLoading(true);
    try {
      setRows(await schApi.searchIpoMismatches(only));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [checkYn]);

  // [E0] 화면 열림 (생성자 L52-60) → open() L62-84: settings(), show(), retrieve()
  useEffect(() => {
    if (open) {
      setCheckYn(true);
      void retrieve(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] grid.getStore().StoreRecordChange (L104) → update() L213-216: 바뀐 행을 바로 저장 (sch.Sch14_IpoMismatch.update)
  const update = async (e: CellValueChangedEvent<Sch14IpoMismatch>) => {
    try {
      const [saved] = await schApi.updateIpoMismatches([e.data]);
      setRows(prev => prev.map(r => (r.ipoMismatchId === saved.ipoMismatchId ? saved : r)));
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      void retrieve();
    }
  };

  // [E4] grid.CellDoubleClick (L111) → getCellValue() L132-139: 종목코드·공모주일정·IpoStock 칸이면 그 글자를 알림창(NoticeMessage)에 보여 준다
  const onCellDoubleClicked = (field: string | undefined, value: unknown) => {
    if (field === 'stkCode' || field === 'target1' || field === 'target2') {
      Modal.info({ title: '알림', content: <div style={{ whiteSpace: 'pre-wrap', userSelect: 'text' }}>{String(value ?? '')}</div>, width: 600 });
    }
  };

  // buildGrid() L172-183
  const columnDefs = useMemo(() => [
    gb.textCenter('stkCode', 80, '종목코드'),                            // L176
    gb.text('target1', 550, '공모주일정'),                                // L177
    gb.text('target2', 550, 'IpoStock'),                                 // L178
    gb.textCenter('insertDateTimeStr', 150, '생성일시'),                  // L179
    gb.boolean('checkYn', 80, '확인완료', { editable: true }),           // L180
  ], []);

  return (
    <Modal
      open={open}
      title="공모주일정 미일치내역"
      width={1500}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] closeButton[닫기].Select (L97) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L91) → retrieve() */}
        <SearchBar onSearch={() => retrieve()} loading={loading}>
          <Checkbox checked={checkYn} onChange={e => setCheckYn(e.target.checked)}>미확인 종목만 조회</Checkbox>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Sch14IpoMismatch>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.ipoMismatchId)}
            loading={loading}
            onCellValueChanged={update}
            onCellDoubleClicked={e => onCellDoubleClicked(e.colDef.field, e.value)}
          />
        </div>
      </div>
    </Modal>
  );
};
