/**
 * 날인신청 탭 (V14) — 상신 문서창 오른쪽 패널의 마지막 탭. 왼쪽 [+][-]와 날인신청 목록(Apr16_Grid_StampApplList), 오른쪽 제공처·제공목적·비고.
 * AS-IS: myApp/client/vi/apr/Apr16_Grid_StampDoc.java (306줄) + Apr16_Grid_StampApplList.java (126줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L135-191: 왼쪽 420 = "날인신청"(250) + [+][-] + 그리드(420×156, 행번호 없음), 오른쪽 300 = 제공처 [ 미입력시 '수신'으로 대체 ] · 제공목적 [ 미입력시 '상신제목'으로 대체 ] · 비고 [ 날인필요서류 ]
 * 줄은 그 자리에서 DB에 넣고 지운다(Apr16_Lookup_StampApplQty.update·Apr16_Grid_StampApplList.deleteRow). 읽어 오기(retrieve L254-275·chkYn L277-297)는 부른 쪽 `Apr03_Page_Relate`가 한다 — 탭 글자의 개수가 필요하다.
 */
import React, { useMemo, useState } from 'react';
import { Input, message } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { aprStampApplApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprApprStampAppl } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SettingPopup } from '@/components/lookup/SettingPopup';
import { Apr16_Lookup_StampApplQty } from './Apr16_Lookup_StampApplQty';

const gb = gbFor<AprApprStampAppl>();

export interface StampMeta { provideCo: string; purpose: string; note: string }

interface Props {
  apprId: number;
  rows: AprApprStampAppl[];
  meta: StampMeta;
  /** chkYn: 이미 결재한 사람이 있거나 임시저장·결재요청 전이 아니면 [+][-]가 꺼진다 */
  locked: boolean;
  /** 오른쪽 세 칸을 고칠 수 있는 편집 모드 */
  editable: boolean;
  /** setStampId(stampId, stampName) — 문서의 인감 */
  stamp: { id: number | null; name: string };
  onMetaChange: (meta: StampMeta) => void;
  /** cCallback.execute() — 줄을 넣거나 지운 뒤 목록을 다시 읽는다 */
  onChanged: () => void;
}

export const Apr16_Grid_StampDoc: React.FC<Props> = ({ apprId, rows, meta, locked, editable, stamp, onMetaChange, onChanged }) => {
  const [selected, setSelected] = useState<AprApprStampAppl | undefined>(undefined);
  const [menu, setMenu] = useState(false);
  const [addType, setAddType] = useState<'1' | '2' | '3' | null>(null);

  // buildGrid L34-44: 구분 110 · 인감 및 대표명의 220 · 부수 40 · 반출 40 (행번호 없음)
  const columnDefs = useMemo<ColDef<AprApprStampAppl>[]>(() => [
    gb.text('applTypeName', 110, '구분'),
    gb.text('stampReprCorpName', 220, '인감 및 대표명의'),
    gb.longCenter('applQty', 40, '부수'),
    gb.booleanYn2('stampOutYn', 40, '반출'),
  ], []);

  // [E2] deleteButton[-].Select (L89) → stampList.deleteRow() L87-98: 고른 줄을 그 자리에서 지운다
  const deleteRow = async () => {
    if (!selected) return;
    try {
      await aprStampApplApi.remove(apprId, selected.stampDocId);
      setSelected(undefined);
      onChanged();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  const fields: [string, string, keyof StampMeta][] = [
    ['제공처', " [ 미입력시 '수신'으로 대체 ]", 'provideCo'],
    ['제공목적', " [ 미입력시 '상신제목'으로 대체 ]", 'purpose'],
    ['비고', ' [ 날인필요서류 ]', 'note'],
  ];

  return (
    <div style={{ display: 'flex', gap: 10, padding: 5 }}>
      <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 250, fontSize: 12, fontWeight: 'bold' }}>날인신청</span>
          {/* [E1] insertButton[+].Select (L79) → SettingPopup("날인신청") */}
          <Button type="plus" disabled={locked} onClick={() => setMenu(true)}>+</Button>
          <Button type="minus" disabled={locked} onClick={() => void deleteRow()}>-</Button>
        </div>
        <div style={{ height: 156 }}>
          <SingleGrid<AprApprStampAppl>
            rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.stampDocId)} rowNumber={false}
            rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }} onSelect={setSelected}
          />
        </div>
      </div>
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {fields.map(([label, hint, key]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div><span style={{ fontSize: 12, fontWeight: 'bold' }}>{label}</span><span style={{ fontSize: 12, color: '#808080' }}>{hint}</span></div>
            <Input readOnly={!editable} value={meta[key]} onChange={e => onMetaChange({ ...meta, [key]: e.target.value })} />
          </div>
        ))}
      </div>
      {/* [E3] stampDocButton[법인인감증명서] (L100) → insertRow("1", 인감) · [E4] corpRegDocButton[법인등기부등본] (L111) → insertRow("2", 회사) · [E5] stampButton[인감날인] (L122) → insertRow("3", 인감) */}
      <SettingPopup open={menu} title="날인신청" onClose={() => setMenu(false)} items={[
        { type: 'register', label: '법인인감증명서', onClick: () => setAddType('1') },
        { type: 'register', label: '법인등기부등본', onClick: () => setAddType('2') },
        { type: 'register', label: '인감날인', onClick: () => setAddType('3') },
      ]} />
      <Apr16_Lookup_StampApplQty applType={addType} apprId={apprId} stampId={stamp.id} stampName={stamp.name} onAdded={onChanged} onClose={() => setAddType(null)} />
    </div>
  );
};
