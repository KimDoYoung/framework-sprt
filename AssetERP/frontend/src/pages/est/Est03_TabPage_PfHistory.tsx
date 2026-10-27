/**
 * 용역수행내역 상세 (Q10) — Est03_Tab_PfHistory 아래 330 영역
 * AS-IS: myApp/client/vi/est/Est03_TabPage_PfHistory.java (437줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L191-232: 라벨 120, 왼쪽 660 폼(수행번호 · 수행시작일 · 수행종료일 / 담당자 · 승인자 · 승인상태 각 220 / 수행내역 660 / 상세내역 660×100) + 오른쪽 "증빙자료" 890×277(Est04_Grid_PfFile)
 * 아래 버튼 줄 50(가운데): [저장][승인신청][신청취소]. 신청(10)·승인(20)이면 setEnable(false)로 폼을 잠그고 [저장]을 막는다(L399-421)
 * 저장은 수행내역과 증빙자료(Est04_Grid_PfFile.updateChk)를 한 번에 보낸다.
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Input, InputNumber, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { estApi } from '@/api/est';
import { errorMessage } from '@/api/client';
import { PfHistory } from '@/types/est';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';
import { Est04_Grid_PfFile, Est04_Grid_PfFileHandle } from './Est04_Grid_PfFile';

const FORMAT = 'YYYY-MM-DD';

interface Form {
  no: number | null;
  startDate: Dayjs | null;
  closeDate: Dayjs | null;
  personId: number | null;
  personName: string;
  confirmerId: number | null;
  confirmerName: string;
  statusCode: string | null;
  statusName: string;
  content: string;
  detail: string;
}

const EMPTY: Form = { no: null, startDate: null, closeDate: null, personId: null, personName: '', confirmerId: null, confirmerName: '', statusCode: null, statusName: '', content: '', detail: '' };

const toForm = (row: PfHistory): Form => ({
  no: row.no,
  startDate: row.startDate ? dayjs(row.startDate) : null,
  closeDate: row.closeDate ? dayjs(row.closeDate) : null,
  personId: row.personId,
  personName: row.personName ?? '',
  confirmerId: row.confirmerId,
  confirmerName: row.confirmerName ?? '',
  statusCode: row.statusCode,
  statusName: row.statusName ?? '',
  content: row.content ?? '',
  detail: row.detail ?? '',
});

const Field: React.FC<{ label: string; width: number; children: React.ReactNode }> = ({ label, width, children }) => (
  <div style={{ width, flex: 'none', display: 'flex', alignItems: 'flex-start' }}>
    <span style={{ width: 120, flex: 'none', lineHeight: '32px' }}>{label} </span>
    <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>{children}</div>
  </div>
);

interface Props {
  /** retrieve(param) L387-397 — 그리드에서 고른 수행내역 (없으면 빈 폼) */
  row: PfHistory | null;
  /** 같은 행을 다시 눌러도 폼과 증빙을 다시 읽도록 부모가 올린다 */
  nonce: number;
  /** grid.getStore().update(resultModel) — 저장된 행으로 그리드 행 교체 */
  onChanged: (row: PfHistory) => void;
}

export const Est03_TabPage_PfHistory: React.FC<Props> = ({ row, nonce, onChanged }) => {
  const fileList = useRef<Est04_Grid_PfFileHandle>(null);
  const [f, setF] = useState<Form>(EMPTY);
  const [empLookup, setEmpLookup] = useState<'person' | 'confirmer' | null>(null);
  const [fileNonce, setFileNonce] = useState(0);

  // [E0] 화면 열림 (생성자 L78-94) → settings(), getEditor()
  // retrieve() L387-397: editDriver.edit(선택 행), fileList.retrieve(선택 행)
  useEffect(() => { setF(row ? toForm(row) : EMPTY); }, [row, nonce]);

  const locked = row == null || f.statusCode === '10' || f.statusCode === '20';
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setF(prev => ({ ...prev, [key]: value }));

  /** update()·confirm()의 필수 입력 검사 (L237-264, L320-352) — 문구는 원본 그대로 */
  const required = (m: Form): string | undefined => {
    if (m.no == null) return '수행번호은 필수입력 항목입니다';
    if (m.startDate == null) return '수행시작일은 필수입력 항목입니다';
    if (m.closeDate == null) return '수행종료일은 필수입력 항목입니다';
    if (m.personName.trim() === '') return '담당자는 필수입력 항목입니다';
    if (m.confirmerName.trim() === '') return '승인자는 필수입력 항목입니다';
    if (m.content.trim() === '') return '수행내역은 필수입력 항목입니다';
    if (m.detail.trim() === '') return '상세내역은 필수입력 항목입니다';
    return undefined;
  };

  /** fileList.updateChk() 뒤 est.Est03_PfHistory.modelUpdate (L270-295, L359-381) */
  const persist = async (statusCode: string | null) => {
    if (!row) return;
    const msg = required(f);
    if (msg) { message.warning(msg); return; }
    const chk = fileList.current?.updateChk();
    if (chk?.error) { message.warning(chk.error); return; }
    try {
      const saved = await estApi.savePfHistory({
        pfHistoryId: row.pfHistoryId,
        pfContractId: row.pfContractId,
        no: f.no,
        startDate: f.startDate?.format(FORMAT) ?? null,
        closeDate: f.closeDate?.format(FORMAT) ?? null,
        content: f.content,
        detail: f.detail,
        personId: f.personId,
        statusCode,
        confirmerId: f.confirmerId,
        files: chk?.files ?? [],
        deleteFileIds: chk?.deleteFileIds ?? [],
      });
      setFileNonce(n => n + 1);
      onChanged(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] updateButton[저장].Select (L130) → update() L234-295 (상태는 그대로)
  const update = () => {
    if (!row) { message.warning('수행내역을 선택하세요.'); return; }
    return persist(f.statusCode);
  };

  // confirm(Boolean) L297-384: 상태를 검사한 뒤 신청(10) 또는 신청취소(null)로 저장
  const confirm = (apply: boolean) => {
    if (f.statusCode === '20') { message.warning('완료된 내역입니다'); return; }
    if (apply) {
      if (f.statusCode === '10') { message.warning('이미 신청한 내역입니다'); return; }
      return persist('10');
    }
    if (f.statusCode == null) { message.warning('신청전 내역입니다'); return; }
    return persist(null);
  };

  // [E4] confirmButton[승인신청].Select [YES] (L136) → "승인 신청하시겠습니까?"(제목 확인, 300폭) → [E5] msgBox.DialogHide [YES] (L141) → confirm(true)
  const askApply = () => {
    if (!row) { message.warning('수행내역을 선택하세요.'); return; }
    Modal.confirm({ title: '확인', content: '승인 신청하시겠습니까?', width: 300, okText: '예', cancelText: '아니오', onOk: () => confirm(true) });
  };

  // [E6] cancleButton[신청취소].Select [YES] (L159) → 승인(20)이면 "승인된 건은 신청취소가 불가능합니다", 아니면 "신청 취소하시겠습니까?" → [E7] msgBox.DialogHide [YES] (L170) → confirm(false)
  const askCancel = () => {
    if (!row) { message.warning('수행내역을 선택하세요.'); return; }
    if (row.statusCode === '20') { message.warning('승인된 건은 신청취소가 불가능합니다'); return; }
    Modal.confirm({ title: '확인', content: '신청 취소하시겠습니까?', width: 300, okText: '예', cancelText: '아니오', onOk: () => confirm(false) });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div style={{ width: 660, flex: 'none', display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 40 }}>
          <div style={{ display: 'flex' }}>
            <Field label="수행번호" width={220}>
              <InputNumber style={{ width: '100%' }} controls={false} precision={0} disabled={locked} value={f.no} onChange={v => set('no', v == null ? null : Number(v))} />
            </Field>
            <Field label="수행시작일" width={220}>
              <DatePicker style={{ width: '100%' }} format={FORMAT} disabled={locked} value={f.startDate} onChange={d => set('startDate', d)} />
            </Field>
            <Field label="수행종료일" width={220}>
              <DatePicker style={{ width: '100%' }} format={FORMAT} disabled={locked} value={f.closeDate} onChange={d => set('closeDate', d)} />
            </Field>
          </div>
          <div style={{ display: 'flex' }}>
            <Field label="담당자" width={220}>
              {/* [E1] personName[담당자].TriggerClick (L99) → Emp00_Lookup_SelectSingle.open(오늘) → 성명·personId */}
              <LookupInput value={f.personName} width={100} disabled={locked} onOpen={() => setEmpLookup('person')} />
            </Field>
            <Field label="승인자" width={220}>
              {/* [E2] confirmerName[승인자].TriggerClick (L115) → Emp00_Lookup_SelectSingle.open(오늘) → 성명·confirmerId */}
              <LookupInput value={f.confirmerName} width={100} disabled={locked} onOpen={() => setEmpLookup('confirmer')} />
            </Field>
            <Field label="승인상태" width={220}>
              <Input readOnly value={f.statusName} />
            </Field>
          </div>
          <Field label="수행내역" width={660}>
            <Input disabled={locked} value={f.content} onChange={e => set('content', e.target.value)} />
          </Field>
          <Field label="상세내역" width={660}>
            <Input.TextArea style={{ height: 100, resize: 'none' }} disabled={locked} value={f.detail} onChange={e => set('detail', e.target.value)} />
          </Field>
        </div>
        <div style={{ width: 890, flex: 'none', display: 'flex', margin: '40px 20px 20px 10px' }}>
          <span style={{ width: 120, flex: 'none', lineHeight: '32px' }}>증빙자료 </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Est04_Grid_PfFile ref={fileList} pfHistoryId={row?.pfHistoryId ?? null} statusCode={f.statusCode} nonce={nonce + fileNonce} />
          </div>
        </div>
      </div>
      <div style={{ height: 50, flex: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Space>
          <Button type="save" disabled={locked} onClick={update}>저장</Button>
          <Button type="register" onClick={askApply}>승인신청</Button>
          <Button type="cancel" onClick={askCancel}>신청취소</Button>
        </Space>
      </div>
      <Emp00_Lookup_SelectSingle
        open={empLookup != null}
        transDate={dayjs().format(FORMAT)}
        noneLabel={null}
        onResult={r => {
          if (!r) return;
          if (empLookup === 'person') setF(prev => ({ ...prev, personName: r.korNm ?? '', personId: r.personId }));
          else setF(prev => ({ ...prev, confirmerName: r.korNm ?? '', confirmerId: r.personId }));
        }}
        onClose={() => setEmpLookup(null)}
      />
    </div>
  );
};
