/**
 * 허용항목 수정창 (N27) — Tdm43_Tab_ManlItemList 그리드의 [허용항목 수정] 아이콘에서 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm43_Lookup_EtcModify.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * getEditor() L126-158: 증빙자료(TextArea 100) · CEO의무 · 임원의무(조회창 트리거) · 중요도(250) · 사용시작일(250) + [미사용], 아래 가운데 [저장][닫기]
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Space, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlList } from '@/types/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Tdm43_Lookup_ExctDuty } from './Tdm43_Lookup_ExctDuty';

interface Props {
  /** open(manlModel, stdDate, callback) L79-92 — manl이 있으면 열린다. stdDate는 목록의 기준일('yyyy-MM-dd') */
  target: { manl: TdmManlList; stdDate: string } | null;
  /** callback.execute(manlModel) — 저장한 뒤(창은 안 닫힌다), 서버가 selectByDate로 다시 읽은 행 */
  onSaved: (row: TdmManlList) => void;
  onClose: () => void;
}

const LABEL: React.CSSProperties = { width: 100, flex: 'none', paddingTop: 5, textAlign: 'right', paddingRight: 8, fontWeight: 'bold' };
const Row: React.FC<{ label: string; top?: boolean; children: React.ReactNode }> = ({ label, top, children }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', marginBottom: 20 }}>
    <span style={LABEL}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Tdm43_Lookup_EtcModify: React.FC<Props> = ({ target, onSaved, onClose }) => {
  const [evidDoc, setEvidDoc] = useState('');
  const [ceoDuty, setCeoDuty] = useState<string | undefined>(undefined);
  const [exctMap, setExctMap] = useState('');
  const [exctName, setExctName] = useState('');
  const [importLevel, setImportLevel] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [exctLookup, setExctLookup] = useState<string | null>(null);

  // [E0] 화면 열림 (생성자 L63-77) → open() L79-92: 모델 값을 칸에 채운다
  useEffect(() => {
    const m = target?.manl;
    if (!m) return;
    setEvidDoc(m.checkEvidDocName ?? '');
    setCeoDuty(m.ceoDutyCode ?? undefined);
    setExctMap(m.exctDutyMap ?? '');
    setExctName(m.exctDutyName ?? '');
    setImportLevel(m.importLevelCode ?? undefined);
    setStartDate(m.startDate ? dayjs(m.startDate, 'YYYY-MM-DD') : null);
  }, [target]);

  // [E3] updateButton[저장].Select (L112) → update() L160-190: tdm.Tdm43_Manl.updateEtc(companyId, stdDate, "%", manlModel)
  const update = async () => {
    if (!target) return;
    try {
      const row = await tdmApi.updateManlEtc(target.manl.manlId, {
        stdDate: target.stdDate,
        ceoDutyCode: ceoDuty ?? null,
        exctDutyMap: exctMap || null,
        importLevelCode: importLevel ?? null,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
        checkEvidDocName: evidDoc,
      });
      message.success('저장이 완료되었습니다');
      onSaved(row);
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={!!target}
      title={<b>허용항목 수정</b>}
      width={760}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E4] closeButton[닫기].Select (L118) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ paddingTop: 10 }}>
        <Row label="증빙자료" top><Input.TextArea style={{ height: 86, resize: 'none' }} value={evidDoc} onChange={e => setEvidDoc(e.target.value)} /></Row>
        <Row label="CEO의무">
          <SystemCodeComboBox kindCd="TdmCeoDutyCode" altCode={['', '(해당없음)']} style={{ width: '100%' }} placeholder="선택하세요" allowClear={false} value={ceoDuty} onChange={setCeoDuty} />
        </Row>
        <Row label="임원의무">
          {/* [E1] exctDutyName[임원의무].TriggerClick (L99) → lookupExctDuty() L192-209 */}
          <Input readOnly style={{ cursor: 'pointer' }} placeholder="선택하세요" value={exctName} onClick={() => setExctLookup(exctMap)} />
        </Row>
        <Row label="중요도">
          <SystemCodeComboBox kindCd="TdmImportLevelCode" altCode={['', '(선택안함)']} style={{ width: 250 }} placeholder="선택하세요" allowClear={false} value={importLevel} onChange={setImportLevel} />
        </Row>
        <Row label="사용시작일">
          <Space>
            <DatePicker style={{ width: 250 }} format="YYYY.MM.DD" value={startDate} onChange={setStartDate} />
            {/* [E2] unUseButton[미사용].Select (L106) → startDate = 2999.12.31 */}
            <Button type="close" onClick={() => setStartDate(dayjs('2999-12-31'))}>미사용</Button>
          </Space>
        </Row>
      </div>
      <Tdm43_Lookup_ExctDuty exctDutyMap={exctLookup}
        onResult={r => { setExctMap(r.exctDutyMap); setExctName(r.exctDutyName ?? ''); }} onClose={() => setExctLookup(null)} />
    </LookupModal>
  );
};
