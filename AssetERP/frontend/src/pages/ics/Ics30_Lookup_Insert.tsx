/**
 * 기준 적용일 생성 창 (E05) — Ics30_Tab_Compliance의 [등록]에서 연다
 * AS-IS: myApp/client/vi/ics/Ics30_Lookup_Insert.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L60-91·getEditor L93-103: 모달 350×180 "생성", 적용월 [년 입력] 년 [월 콤보 MonthsCode], 아래 가운데 [생성][닫기]. 열릴 때 기본값은 지난달
 */
import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  /** open(dateList, callback) L53-58 — 값이 true면 열린다 */
  open: boolean;
  /** 이미 있는 기준 적용일('YYYY-MM-DD') 목록 */
  dateList: string[];
  /** 생성에 성공하면 callback.execute() — 부른 쪽이 다시 조회한다 */
  onCreated: () => void;
  onClose: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

export const Ics30_Lookup_Insert: React.FC<Props> = ({ open, dateList, onCreated, onClose }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState<string | undefined>();

  // [E0] 화면 열림 (생성자 L60-91): 적용년도·월 기본값은 지난달
  useEffect(() => {
    if (!open) return;
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    setYear(String(d.getFullYear()));
    setMonth(pad(d.getMonth() + 1));
  }, [open]);

  // [E1] updateButton[생성].Select (L74) → update() L105-140
  const update = async () => {
    if (!year.trim()) { message.warning('적용년도를 입력해주세요'); return; }
    if (!month) { message.warning('적용월을 입력해주세요'); return; }
    const startDate = `${year.trim()}-${month}-01`;
    for (const date of dateList) {
      if (startDate === date) { message.warning('이미 생성된 기준 적용일입니다'); return; }
      if (date > startDate) { message.warning('기준 적용일 이후 데이터가 존재합니다'); return; }
    }
    try {
      await icsApi.createComplianceDate(startDate);
      onCreated();
      onClose();  // callback.execute(); hide()
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title="생성"
      width={350}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="generate" onClick={update}>생성</Button>
          {/* [E2] closeButton[닫기].Select (L80) → hide() */}
          <Button type="close" onClick={onClose} style={{ marginLeft: 8 }}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '20px 10px 25px' }}>
        <span style={{ width: 52 }}>적용월 </span>
        <Input style={{ width: 80 }} value={year} onChange={e => setYear(e.target.value)} />
        <span>년</span>
        <SystemCodeComboBox kindCd="MonthsCode" style={{ width: 80 }} value={month} onChange={v => setMonth(v)} allowClear={false} />
      </div>
    </LookupModal>
  );
};
