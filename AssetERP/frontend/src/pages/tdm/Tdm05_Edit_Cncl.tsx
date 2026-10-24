/**
 * 회의체 편집창 (N07) — 회의체 등록의 [등록]·수정 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm05_Edit_Cncl.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 650×380(원본): 회의체 · 개최주기(콤보) · 주요의결사항(100 높이) · 사용시작일 · 사용종료일 + [저장][닫기]
 * UX보강(10): 조회창(UX-05)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCouncil } from '@/types/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';

const FORMAT = 'YYYY-MM-DD';
const BLUE = '#0069B4';   // setHtmlStyle(…, "0069B4") 필수 항목 라벨

interface Props {
  /** INSERT = 등록, UPDATE = 수정, null이면 닫힘 */
  mode: 'INSERT' | 'UPDATE' | null;
  /** UPDATE: 선택한 회의체 */
  council?: TdmCouncil | null;
  /** AS-IS callBack.execute() — 저장이 끝난 뒤 (부르는 쪽이 다시 조회). 닫기는 onClose */
  onSaved: () => void;
  onClose: () => void;
}

const Label: React.FC<{ required?: boolean; children: React.ReactNode }> = ({ required, children }) => (
  <div style={{ width: 120, textAlign: 'right', paddingRight: 8, fontWeight: 'bold', color: required ? BLUE : undefined, flex: 'none' }}>{children}</div>
);

export const Tdm05_Edit_Cncl: React.FC<Props> = ({ mode, council, onSaved, onClose }) => {
  const [cnclId, setCnclId] = useState<number | null>(null);
  const [cnclName, setCnclName] = useState('');
  const [openCycleCode, setOpenCycleCode] = useState<string | undefined>();
  const [mainDecision, setMainDecision] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  // [E0] 화면 열림 (생성자 L84-97) → setting(), show() / insert() L59-74, edit() L76-82: 열 때 값 채우기 (등록은 빈 값, 새 ID는 서버가 저장 때 만든다)
  useEffect(() => {
    if (!mode) return;
    if (mode === 'UPDATE' && council) {
      setCnclId(council.cnclId);
      setCnclName(council.cnclName ?? '');
      setOpenCycleCode(council.openCycleCode ?? undefined);
      setMainDecision(council.mainDecision ?? '');
      setStartDate(council.startDate ? dayjs(council.startDate) : null);
      setEndDate(council.endDate ? dayjs(council.endDate) : null);
      return;
    }
    setCnclId(null);
    setCnclName('');
    setOpenCycleCode(undefined);
    setMainDecision('');
    setStartDate(null);
    setEndDate(null);
  }, [mode, council]);

  // [E2] updateButton[저장].Select (L113) → update() L163-195: 필수 검사 → tdm.Tdm05_Cncl.modelUpdate → callBack, hide()
  const update = async () => {
    if (!cnclName) { message.warning('회의체는 필수입력 항목입니다'); return; }
    if (!openCycleCode) { message.warning('개최주기는 필수선택 항목입니다'); return; }
    if (!mainDecision) { message.warning('주요의결사항은 필수입력 항목입니다'); return; }
    if (!startDate) { message.warning('사용시작일은 필수선택 항목입니다'); return; }
    try {
      await tdmApi.saveCouncil({
        cnclId,
        cnclName,
        openCycleCode,
        mainDecision,
        startDate: startDate.format(FORMAT),
        endDate: endDate ? endDate.format(FORMAT) : null,
      });
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <LookupModal
      open={!!mode}
      title="회의체"
      width={650}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E3] closeButton[닫기].Select (L119) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '10px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label required>회의체</Label>
          <Input value={cnclName} onChange={e => setCnclName(e.target.value)} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label required>개최주기</Label>
          {/* [E1] openCycleName[개최주기].Collapse (L106) → openCycleCode 동기화 */}
          <SystemCodeComboBox kindGroupCd="CycleCode003" placeholder="선택하세요" style={{ flex: 1 }} value={openCycleCode} onChange={code => setOpenCycleCode(code)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Label required>주요의결사항</Label>
          <Input.TextArea value={mainDecision} onChange={e => setMainDecision(e.target.value)} style={{ height: 100, resize: 'none', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label required>사용시작일</Label>
          <DatePicker value={startDate} format={FORMAT} allowClear={false} onChange={d => setStartDate(d)} style={{ width: 140 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label>사용종료일</Label>
          <DatePicker value={endDate} format={FORMAT} onChange={d => setEndDate(d)} style={{ width: 140 }} />
        </div>
      </div>
    </LookupModal>
  );
};
