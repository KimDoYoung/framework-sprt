/**
 * 거래처 편집 칸 (A25) — Sys15_Tab_Corp 아래 칸. 선택한 거래처를 고치고 저장한다
 * AS-IS: myApp/client/vi/sys/Sys15_Edit_Corp.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L61-88 + getEditor() L90-130: 라벨 폭 120, 줄 5개(구분·거래처명·사업자번호 / 코드·조회순서·사용 / 전화번호·주소 / 비고 / 계좌정보 그리드 150),
 * 필수 라벨(거래처구분·거래처명)은 파란색, 아래 가운데 [저장]. 편집 폼이므로 검색 영역 보강(UX-04 지우기 x)은 쓰지 않는다
 */
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Input, InputNumber, message } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { CorpAccountHandle, Sys17_Grid_CorpAccount } from './Sys17_Grid_CorpAccount';

const REQUIRED = '#0069B4';

/** FieldLabel(라벨 폭 120) + 필드 한 칸 — setHtmlStyle("라벨 ", "0069B4") */
const Row: React.FC<{ label: string; required?: boolean; width: number; children: React.ReactNode }> = ({ label, required, width, children }) => (
  <div style={{ width, display: 'flex', alignItems: 'center', marginRight: 50 }}>
    <label style={{ width: 120, flex: 'none', color: required ? REQUIRED : undefined }}>{label}</label>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

interface Props {
  /** AS-IS retrieve(param{corpModel}) L132-141 — 선택한 거래처. 없으면 init()(editDriver.edit(new Model)) */
  corp?: Corp;
  /** AS-IS updateRow() L143-159: 서비스 결과 행으로 목록을 갈아 끼운다 (GridUpdate) */
  onSaved: (saved: Corp, oldId: number) => void;
}

export const Sys15_Edit_Corp: React.FC<Props> = ({ corp, onSaved }) => {
  const [form, setForm] = useState<Corp>();
  const accountRef = useRef<CorpAccountHandle>(null);

  // [E0] 화면 열림 (생성자 L61-88) → getEditor() / 부모 retrieve() L132-141: editDriver.edit(corpModel) + gridCorpAccount.retrieve(corpId)
  useEffect(() => { if (corp) setForm({ ...corp }); }, [corp]);

  const set = <K extends keyof Corp>(key: K, value: Corp[K]) => setForm(prev => (prev ? { ...prev, [key]: value } : prev));

  // [E1] updateButton[저장].Select (L69) → updateRow() L143-159
  const updateRow = async () => {
    if (!form) return;
    let saved: Corp;
    try {
      saved = (await sysApi.updateCorps([form]))[0];
    } catch (err) {
      // new SimpleMessage("확인", serviceResult.getMessage())
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    // editDriver.edit(저장된 행) + gridCorpAccount.update() — 계좌는 새 거래처 ID로 보낸다
    await accountRef.current?.update(saved.corpId);
    setForm({ ...saved });
    onSaved(saved, form.corpId);
  };

  const v = form;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex' }}>
          <Row label="거래처구분" required width={350}>
            {/* corpTypeName ComboBoxField("CorpType") — 고르면 corpType(코드)·corpTypeName */}
            <SystemCodeComboBox kindCd="CorpType" style={{ width: '100%' }} value={v?.corpType ?? undefined}
              onChange={(code, name) => setForm(prev => (prev ? { ...prev, corpType: code ?? null, corpTypeName: name ?? null } : prev))} />
          </Row>
          <Row label="거래처명" required width={350}>
            <Input value={v?.corpName ?? ''} onChange={e => set('corpName', e.target.value)} />
          </Row>
          <Row label="사업자번호" width={350}>
            <Input value={v?.bizNo ?? ''} onChange={e => set('bizNo', e.target.value)} />
          </Row>
        </div>
        <div style={{ display: 'flex' }}>
          <Row label="거래처코드" width={350}>
            <Input placeholder="미입력시 사업자번호로 등록." value={v?.corpCode ?? ''} onChange={e => set('corpCode', e.target.value)} />
          </Row>
          <Row label="조회순서" width={350}>
            <InputNumber precision={0} style={{ width: '100%' }} value={v?.seq ?? null} onChange={n => set('seq', n)} />
          </Row>
          <Row label="사용" width={350}>
            <Checkbox checked={v?.useYn === 'true'} onChange={e => set('useYn', e.target.checked ? 'true' : 'false')} />
          </Row>
        </div>
        <div style={{ display: 'flex' }}>
          <Row label="전화번호" width={350}>
            <Input value={v?.tel ?? ''} onChange={e => set('tel', e.target.value)} />
          </Row>
          <Row label="주소" width={700}>
            <Input value={v?.addr ?? ''} onChange={e => set('addr', e.target.value)} />
          </Row>
        </div>
        <div style={{ display: 'flex' }}>
          <Row label="비고" width={1050}>
            <Input value={v?.note ?? ''} onChange={e => set('note', e.target.value)} />
          </Row>
        </div>
        <div style={{ display: 'flex' }}>
          <Row label="계좌정보" width={1050}>
            <div style={{ height: 150 + 40 }}>
              <Sys17_Grid_CorpAccount ref={accountRef} corpId={corp && corp.corpId > 0 ? corp.corpId : null} corp={corp} />
            </div>
          </Row>
        </div>
      </div>
      <div style={{ height: 60, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Button type="save" onClick={updateRow}>저장</Button>
      </div>
    </div>
  );
};
