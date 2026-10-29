/**
 * 근태 일괄생성 창 (T06) — Att02_Tab_CommuteAdmin의 [일괄생성]이 연다
 * AS-IS: myApp/client/vi/att/Att02_Lookup_InsertBatch.java (227줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-103: 툴바 50 = 근무일자 {시작일} ~ {종료일} [행 추가][행 삭제], 체크 다중 그리드(성명 100 · 사번 100 · 부서명 250 · 직위 100), 아래 [일괄생성][닫기]
 * open() L59-65: 시작일·종료일을 받아 칸에 넣는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { attApi } from '@/api/att';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

/** AS-IS Emp01_PersonModel 한 행 — 그리드에 담은 사원 */
interface PersonRow {
  rowId: number;
  personId: number;
  korName: string;
  empNo: string;
  orgName: string;
  posName: string;
}

const gb = gbFor<PersonRow>();
const DATE = 'YYYY-MM-DD';

interface Props {
  /** 값이 있으면 열림 — 시작일·종료일('yyyy-MM-dd') */
  target: { startDate: string; closeDate: string } | null;
  /** AS-IS callback.execute(): 생성한 뒤 부르는 쪽이 다시 조회한다 */
  onSaved: () => void;
  onClose: () => void;
}

export const Att02_Lookup_InsertBatch: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const gridRef = useRef<AgGridReact<PersonRow>>(null);
  const seq = useRef(0);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [closeDate, setCloseDate] = useState<string | null>(null);
  const [rows, setRows] = useState<PersonRow[]>([]);
  const [empOpen, setEmpOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L67-103) → settings(). open(stDate, clDate, callback) L59-65
  useEffect(() => {
    if (!target) return;
    setStartDate(target.startDate);
    setCloseDate(target.closeDate);
    setRows([]);
  }, [target]);

  // [E1] insertButton[행 추가].Select (L109) → insertRow() L146-172: Emp00_Lookup_SelectMulti.open(오늘, false) → 고른 사원마다 한 행(맨 아래, 03 원칙 17)
  const insertRow = (list: TransInfo[]) => {
    setEmpOpen(false);
    if (list.length === 0) return;
    const added = list.map<PersonRow>(m => ({
      rowId: ++seq.current, personId: m.personId, korName: m.korNm ?? '', empNo: m.empNo ?? '', orgName: m.orgKorNm ?? '', posName: m.posNm ?? '',
    }));
    setRows(prev => [...prev, ...added]);
    setTimeout(() => {
      const api = gridRef.current?.api;
      const node = api?.getRowNode(String(added[added.length - 1].rowId));
      if (api && node?.rowIndex != null) api.ensureIndexVisible(node.rowIndex);
    }, 0);
  };

  // [E2] deleteButton[행 삭제].Select (L115) → delete() L213-218: 체크한 행을 그리드에서 뺀다
  const deleteRows = () => {
    const ids = new Set((gridRef.current?.api.getSelectedRows() ?? []).map(r => r.rowId));
    setRows(prev => prev.filter(r => !ids.has(r.rowId)));
  };

  // [E3] updateButton[일괄생성].Select (L121) → update() L174-211: att.Att02_Commute.insertBatch(시작일·종료일·회사(서버)·사원 목록) → "정상적으로 등록완료되었습니다" → callback.execute() → hide()
  const update = async () => {
    if (startDate == null) { message.warning('시작일은 필수입력 항목입니다'); return; }
    if (closeDate == null) { message.warning('종료일은 필수입력 항목입니다'); return; }
    setSaving(true);
    try {
      await attApi.insertBatchCommutes({ startDate, closeDate, personIds: rows.map(r => r.personId) });
      message.success('정상적으로 등록완료되었습니다');
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // buildGrid(): 체크 다중, 행번호
  const columnDefs = useMemo(() => [
    gb.textCenter('korName', 100, '성명'),
    gb.textCenter('empNo', 100, '사번'),
    gb.text('orgName', 250, '부서명'),
    gb.text('posName', 100, '직위'),
  ], []);

  return (
    <LookupModal
      open={target != null}
      title="근태 일괄생성"
      width={760}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="generate" onClick={update} loading={saving}>일괄생성</Button>
            {/* [E4] closeButton[닫기].Select (L127) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Typography.Text strong>근무일자 :</Typography.Text>
          <DatePicker style={{ width: 120 }} allowClear={false} format={DATE} value={startDate ? dayjs(startDate) : null}
            onChange={d => setStartDate(d ? d.format(DATE) : null)} />
          <span>~</span>
          <DatePicker style={{ width: 120 }} allowClear={false} format={DATE} value={closeDate ? dayjs(closeDate) : null}
            onChange={d => setCloseDate(d ? d.format(DATE) : null)} />
          <Button type="addRow" onClick={() => setEmpOpen(true)}>행 추가</Button>
          <Button type="removeRow" onClick={deleteRows}>행 삭제</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<PersonRow> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.rowId)} />
        </div>
      </div>
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={dayjs().format(DATE)} onResult={insertRow} onClose={() => setEmpOpen(false)} />
    </LookupModal>
  );
};
