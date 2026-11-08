/**
 * 이관정보 등록 편집창 (X28) — Ast33_Tab_OfficeMngFundTrans의 [등록]이 연다
 * AS-IS: myApp/client/vi/ast/Ast33_Lookup_OfficeMngFundTrans2.java (409줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L83-89: 모달 950×600 "이관정보 등록". getEditor() L188-233: 라벨 폭 80, 이관구분(200) · 이관일자(200) / 운용사(코드 200 + 이름 400) / 펀드(높이 250: [행 추가][행 삭제] + 체크 다중 셀 편집 그리드) / 적요(높이 70) / 파란 안내, 아래 가운데 저장·닫기
 * buildGrid() L235-246: 체크 다중 · 펀드코드 100(편집) · 펀드명 300 · 통화 80 · 외화미수보수 100(편집) · 원화미수보수 150(편집). 이관(입)이면 통화·외화·원화 열(4,5,6)을 숨긴다
 * EditModal 규격(11 §4a): 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬
 * E1 date.Change(L106)·E2 date.Collapse(L112)는 같은 결과(그리드 비움)라 이관일자가 바뀔 때 한 번 처리한다
 * 스타일: MFG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useMemo, useState } from 'react';
import { DatePicker, Input, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { astApi } from '@/api/ast';
import { errorMessage } from '@/api/client';
import { FundTrans, PreHoldFee } from '@/types/ast';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Ast30_Lookup_HoldFee } from './Ast30_Lookup_HoldFee';

const gb = gbFor<FundTrans>();
const FORMAT = 'YYYY-MM-DD';
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: false } as const;

/** 목록은 화면 안에서만 만든다 — 조회·저장·삭제는 이 창이 직접 한다 */
const searchNone = async (): Promise<FundTrans[]> => [];
const saveNone = async (rows: FundTrans[]) => rows;
const removeNone = async () => 0;
const newRow = () => ({}) as Partial<FundTrans>;

interface Props {
  /** 부르는 쪽이 열 때마다 새로 만든다(열 때마다 새 창 — 처음 값으로 시작) */
  open: boolean;
  onClose: () => void;
  /** callback.execute(result): 저장했으면 부른다 — 창은 스스로 닫는다 */
  onDone: () => void;
}

/** 라벨 폭 80 (form.setLabelWidth(80)) */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <Typography.Text style={{ width: 80, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Ast33_Lookup_OfficeMngFundTrans2: React.FC<Props> = ({ open, onClose, onDone }) => {
  const user = useLoginUser();
  // [E0] 화면 열림 (생성자 L83-89) — 열 때마다 새 창이라 처음 값으로 되돌린다 (이관(출), 오늘)
  const [fundTransCode, setFundTransCode] = useState('1');
  const [date, setDate] = useState(() => dayjs());
  const [corp, setCorp] = useState<{ corpId: number; corpCode: string; corpName: string } | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);
  const [holdOpen, setHoldOpen] = useState(false);
  const crud = useGridCrud<FundTrans>({ idField: 'fundTransId', search: searchNone, save: saveNone, remove: removeNone, newRow, firstEditField: 'fundCode', insertAt: 'last' });
  const isOut = fundTransCode === '1';

  // buildGrid() L235-246 — 이관(입)이면 통화·외화미수보수·원화미수보수 열 숨김 (L128-134)
  const columnDefs = useMemo(() => [
    gb.textCenter('fundCode', 100, '펀드코드', { editor: 'text' }),  // L239
    gb.text('fundName', 300, '펀드명'),  // L240
    gb.textCenter('curCode', 80, '통화', { hide: !isOut }),  // L241
    gb.double('forFee', 100, '외화미수보수', { editor: 'number', hide: !isOut }),  // L242
    gb.long('fee', 150, '원화미수보수', { editor: 'number', hide: !isOut }),  // L243
  ], [isOut]);

  // [E3] fundTransName[이관구분].Collapse (L124) → 이관(출)이면 열 보이기, 아니면 숨기기 + 그리드 비움
  const changeType = (code: string | undefined) => {
    setFundTransCode(code ?? '1');
    crud.clear();
  };

  // [E4] corpCode[운용사].TriggerClick (L142) → Sys15_Lookup_Corp("운용사") — 고르면 운용사 + 그리드 비움
  const onCorp = (c: Corp | null) => {
    setCorpOpen(false);
    if (!c) return;
    setCorp({ corpId: c.corpId, corpCode: c.corpCode ?? '', corpName: c.corpName ?? '' });
    crud.clear();
  };

  // [E5] insertRowButton[행 추가].Select (L162) → insertRow() L248-304
  const insertRow = () => {
    if (!date) { message.warning('해지일자(이관일자)는 필수입력 항목입니다'); return; }
    if (!corp) { message.warning('운용사는 필수선택 항목입니다'); return; }
    if (isOut) {
      setHoldOpen(true);   // 이관(출): 보수원장 조회창(MULTI)에서 펀드를 고른다
    } else {
      // 이관(입): 빈 행 1개 — 펀드코드를 직접 입력 (addChange(fundCode,"") 로 변경 행이 된다)
      crud.addRows([{ companyId: user.companyId, fundTransCode, date: date.format(FORMAT), corpId: corp.corpId, fundCode: '' }], true);
    }
  };
  const onHold = (rows: PreHoldFee[]) => {
    setHoldOpen(false);
    crud.addRows(rows.map(r => ({
      companyId: user.companyId, fundTransCode, date: date.format(FORMAT), corpId: r.corpId, fundCode: r.fundCode, fundName: r.fundName,
      forFee: r.forFee, fee: r.fee, curCode: r.curCode, note: '',
    })), true);
  };

  // [E6] deleteRowButton[행 삭제].Select (L168) → deleteRow() L306-311: 체크한 행을 화면에서만 뺀다
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length > 0) crud.removeRows(selected.map(r => r.fundTransId as number));
  };

  // [E7] updateButton[저장].Select (L174) → preUpdate() L313-345 → update() L347-400 (회계마감 검사는 서버가 먼저 한다)
  const update = async () => {
    if (crud.rows.length === 0) return message.warning('이관펀드를 등록하세요');
    if (!date) return message.warning('해지일자(이관일자)는 필수입력 항목입니다');
    if (!corp) return message.warning('운용사는 필수선택 항목입니다');
    crud.gridRef.current?.api.stopEditing();
    const items = crud.getChanged();
    if (items.some(r => !r.fundCode)) return message.warning('펀드코드를 입력하세요');
    setSaving(true);
    try {
      // 적요(note)는 창의 적요 칸 값을 모든 행에 넣는다 (L363)
      await astApi.saveFundTrans(items.map(r => ({ ...r, fundTransId: null, note })));
      message.success('저장이 완료되었습니다.');
      onClose();
      onDone();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title="이관정보 등록"
      width={950}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update} loading={saving}>저장</Button>
            {/* [E8] closeButton[닫기].Select (L180) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ width: 300 }}>
            <Field label="이관구분">
              <SystemCodeComboBox kindCd="FundTransCode" style={{ width: 200 }} value={fundTransCode} onChange={changeType} />
            </Field>
          </div>
          <div style={{ width: 300 }}>
            <Field label="이관일자">
              {/* [E1] date[이관일자].Change (L106) · [E2] date.Collapse (L112) → 그리드 비움 */}
              <DatePicker style={{ width: 200 }} allowClear={false} format={FORMAT} value={date}
                onChange={d => { if (d) { setDate(d); crud.clear(); } }} />
            </Field>
          </div>
        </div>
        <Field label="운용사">
          <Space.Compact style={{ width: '100%' }}>
            <LookupInput value={corp?.corpCode ?? ''} width={200} onOpen={() => setCorpOpen(true)} />
            <Input readOnly value={corp?.corpName ?? ''} />
          </Space.Compact>
        </Field>
        <Field label="펀드">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Space>
              <Button type="addRow" onClick={insertRow}>행 추가</Button>
              <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
            </Space>
            <div style={{ height: 210 }}>
              <CellEditGrid<FundTrans> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_SELECTION} />
            </div>
          </div>
        </Field>
        <Field label="적요">
          <Input.TextArea rows={2} value={note} onChange={e => setNote(e.target.value)} />
        </Field>
        <div style={{ paddingLeft: 40, fontSize: 13, fontWeight: 'bold', color: '#456EA6', lineHeight: 1.6 }}>
          ※ 처리전 ICAM운용보수 발생내역을 확인하여 이관일의 보수인출 금액을 정리하세요<br />
          ※ 이관일자 : 이관(입) 등록시 최초 보수발생일 / 이관(출) 등록시 최종 보수발생 다음일
        </div>
      </div>
      <Sys15_Lookup_Corp open={corpOpen} corpTypeName="운용사" regYn onResult={onCorp} onClose={() => setCorpOpen(false)} />
      <Ast30_Lookup_HoldFee open={holdOpen} stdDate={date.format(FORMAT)} corpId={corp?.corpId} multi onResult={onHold} onClose={() => setHoldOpen(false)} />
    </Modal>
  );
};
