/**
 * 급여공제 탭 (C01-3) — C01 사원정보 관리 하위.
 * AS-IS: myApp/client/vi/emp/Emp35_TabPage_DeductDate.java (좌 15% 날짜 목록)
 *        + myApp/client/vi/emp/Emp35_TabPage_DeductInsert.java (우 85% 편집 폼)
 * 레이아웃(settings() L44-96): Horizontal { grid 0.15 | vlc(DeductInsertPage) 0.85 }
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, InputNumber, message, Modal, Space, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Deduct, TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { TransInfoTabProps } from './Emp00_Tab_TransInfo';
import { Emp35_Popup_DeductCreate } from './Emp35_Popup_DeductCreate';
import { Emp36_Popup_AddDeduct } from './Emp36_Popup_AddDeduct';

const gb = gbFor<Deduct>();

/** settings() L53-64: grid.addColumn(startDate) */
const buildGrid = () => [
  gb.date('startDate', 190, '적용시작일'),
];

// ── DeductInsert 폼 (Emp35_TabPage_DeductInsert 논리, 우 85%) ─────────────────

interface DeductFormProps {
  row: TransInfo | undefined;
  deduct: Deduct | null;
  onSaved: (saved: Deduct) => void;
  onDeleted: () => void;
}

const DeductInsertForm: React.FC<DeductFormProps> = ({ deduct, onSaved, onDeleted }) => {
  const [form, setForm] = useState<Partial<Deduct>>({});
  const [saving, setSaving] = useState(false);
  const [addDeductOpen, setAddDeductOpen] = useState(false);

  useEffect(() => { setForm(deduct ?? {}); }, [deduct]);

  const setField = (field: keyof Deduct, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  // [E1] updateButton[저장].Select (L83) → update() L217-235
  const update = async () => {
    if (form.withHoldRate == null) {
      message.warning('원천징수비율은 필수입력 항목입니다');
      return;
    }
    if (!deduct?.deductId) return;
    setSaving(true);
    try {
      const saved = await empApi.updateDeduct(deduct.deductId, {
        deductId: deduct.deductId,
        basicDeductCnt: form.basicDeductCnt ?? null,
        addDeductYn: form.addDeductYn ?? null,
        insureYn: form.insureYn ?? null,
        reprYn: form.reprYn ?? null,
        withHoldRate: form.withHoldRate ?? null,
        note: form.note ?? null,
        childDeductCnt: form.childDeductCnt ?? null,
      });
      onSaved(saved);
      message.success('저장이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '확인'));
    } finally {
      setSaving(false);
    }
  };

  // [E2] deleteButton[삭제].Select (L89) → deleteChk() L237-249
  const deleteChk = () => {
    if (!deduct?.deductId) return;
    Modal.confirm({
      title: '삭제',
      content: '선택한 급여공제를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await empApi.deleteDeduct(deduct.deductId);
          onDeleted();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E3] anchor.MouseDown (L108): addDeductYn 미체크면 메시지, 체크면 추가인적공제 팝업
  const openAddDeduct = () => {
    if (form.addDeductYn !== 'true') {
      message.info('추가인적공제 체크후 등록가능합니다');
      return;
    }
    setAddDeductOpen(true);
  };

  const isActive = !!deduct;
  const toNum = (v: unknown) => (v == null ? undefined : Number(v));
  const checked = (v: string | null | undefined) => v === 'true';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '8px 12px', gap: 8 }}>
      <Space>
        {/* [E1] */}
        <Button type="save" onClick={update} loading={saving} disabled={!isActive}>저장</Button>
        {/* [E2] */}
        <Button type="delete" onClick={deleteChk} disabled={!isActive}>삭제</Button>
      </Space>

      {!isActive ? (
        <div style={{ padding: 24, color: '#888' }}>급여공제 항목을 선택하세요.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          {/* Row01: 적용시작일 | — | 4대보험가입여부 */}
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Typography.Text style={{ width: 110, textAlign: 'right' }}>적용시작일</Typography.Text>
              <Typography.Text style={{ flex: 1 }}>{form.startDate ?? ''}</Typography.Text>
            </div>
            <div style={{ width: 350 }} />
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox
                checked={checked(form.insureYn)}
                onChange={e => setField('insureYn', e.target.checked ? 'true' : 'false')}
              >4대보험가입여부</Checkbox>
            </div>
          </div>

          {/* Row02: 공제대상 가족수 | [추가인적공제여부+아이콘] | 대표자여부 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Typography.Text style={{ width: 190, textAlign: 'right' }}>공제대상 가족수(본인포함)</Typography.Text>
              <InputNumber
                style={{ width: 140 }}
                value={toNum(form.basicDeductCnt)}
                min={0}
                onChange={v => setField('basicDeductCnt', v)}
              />
            </div>
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Checkbox
                checked={checked(form.addDeductYn)}
                onChange={e => setField('addDeductYn', e.target.checked ? 'true' : 'false')}
              >추가인적공제여부</Checkbox>
              {/* [E3] anchor: 추가인적공제 팝업 */}
              <EditOutlined style={{ cursor: 'pointer', color: '#1677ff' }} onClick={openAddDeduct} />
            </div>
            <div style={{ width: 350, display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={checked(form.reprYn)}
                onChange={e => setField('reprYn', e.target.checked ? 'true' : 'false')}
              >대표자여부</Checkbox>
            </div>
          </div>

          {/* Row03: 자녀 수 | — | 4대보험 신고정보 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Typography.Text style={{ width: 190, textAlign: 'right' }}>공제대상 8세이상 20세이하 자녀 수</Typography.Text>
              <InputNumber
                style={{ width: 140 }}
                value={toNum(form.childDeductCnt)}
                min={0}
                onChange={v => setField('childDeductCnt', v)}
              />
            </div>
            <div style={{ width: 350 }} />
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Typography.Text>4대보험 신고정보</Typography.Text>
              {/* [E4 생략] anchor2 → Pay31_Popup_InsureApply — 급여 도메인(Pay31) 범위 밖 */}
              <EditOutlined
                style={{ cursor: 'pointer', color: '#aaa' }}
                onClick={() => message.info('4대보험 신고정보는 급여 도메인에서 구현 예정입니다.')}
              />
            </div>
          </div>

          {/* Row04: 원천징수비율 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 350, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Typography.Text style={{ width: 110, textAlign: 'right' }}>원천징수비율(%)</Typography.Text>
              <InputNumber
                style={{ width: 220 }}
                value={toNum(form.withHoldRate)}
                min={0}
                onChange={v => setField('withHoldRate', v)}
              />
            </div>
            <div style={{ width: 350, display: 'flex', alignItems: 'center' }}>
              <Typography.Text type="secondary">(80%, 100%, 120%)</Typography.Text>
            </div>
          </div>
        </div>
      )}

      <Emp36_Popup_AddDeduct
        open={addDeductOpen}
        deductId={deduct?.deductId}
        onClose={() => setAddDeductOpen(false)}
      />
    </div>
  );
};

// ── 메인: Emp35_TabPage_DeductDate ───────────────────────────────────────────

export const Emp35_TabPage_DeductDate: React.FC<TransInfoTabProps> = ({ row }) => {
  const gridRef = useRef<AgGridReact<Deduct>>(null);
  const [rows, setRows] = useState<Deduct[]>([]);
  const [selectedDeduct, setSelectedDeduct] = useState<Deduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // [E0] 생성자 → settings(), retrieve() → 첫 행 선택
  // [E1] retrieveButton[조회].Select (L52) → retrieve() L116-130
  const retrieve = useCallback(async () => {
    if (!row?.personId) { setRows([]); setSelectedDeduct(null); return; }
    setLoading(true);
    try {
      const list = await empApi.getDeducts(row.personId);
      setRows(list);
      setSelectedDeduct(list.length > 0 ? list[0] : null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [row?.personId]);

  useEffect(() => { retrieve(); }, [retrieve]);

  // [E3] grid.SelectionChanged (L88) → retrievePage() L132-140: 선택 행을 폼에 전달
  const onSelect = (deduct: Deduct | undefined) => setSelectedDeduct(deduct ?? null);

  // [E2] insertButton[등록].Select (L58) → insert() L142-150: 팝업 열기
  const insert = () => setCreateOpen(true);

  // Emp35_Popup_DeductCreate 콜백: 목록 갱신
  const onCreated = () => retrieve();

  // DeductInsertForm 콜백: 저장 후 그리드 행 갱신
  const onDeductSaved = (saved: Deduct) => {
    setRows(prev => prev.map(r => (r.deductId === saved.deductId ? saved : r)));
    setSelectedDeduct(saved);
  };

  // DeductInsertForm 콜백: 삭제 후 그리드에서 제거
  const onDeductDeleted = () => {
    if (!selectedDeduct) return;
    setRows(prev => prev.filter(r => r.deductId !== selectedDeduct.deductId));
    setSelectedDeduct(null);
  };

  return (
    // AS-IS settings() L44-96: HorizontalLayoutContainer 0.15 / 0.85 — 고정 비율(분할 아님. 화면은 2단까지 — 05 §6)
    <div style={{ height: '100%', display: 'flex' }}>
      {/* 좌 15%: 날짜 목록 */}
      <div style={{ width: '15%', minWidth: 120, flex: 'none' }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 4px' }}>
          <Space size="small">
            {/* [E1] */}
            <Button type="search" onClick={retrieve}>조회</Button>
            {/* [E2] */}
            <Button type="register" onClick={insert} disabled={!row}>등록</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<Deduct>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columnDefs}
              loading={loading}
              getRowId={p => String(p.data.deductId)}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>

      {/* 우 85%: DeductInsert 폼 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <DeductInsertForm
          row={row}
          deduct={selectedDeduct}
          onSaved={onDeductSaved}
          onDeleted={onDeductDeleted}
        />
      </div>

      <Emp35_Popup_DeductCreate
        open={createOpen}
        row={row}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />
    </div>
  );
};
