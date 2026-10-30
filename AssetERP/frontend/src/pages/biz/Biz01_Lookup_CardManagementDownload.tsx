/**
 * 법인카드 내역 다운로드 기간 창 (U15) — Biz01_Tab_CardManagement의 [엑셀다운로드]에서 연다
 * AS-IS: myApp/client/vi/biz/Biz01_Lookup_CardManagementDownload.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L51-95: 모달 400×170(크기 고정, 닫기 X 없음), 제목 "다운로드", 한 줄 = 년(70) 년 월콤보(65) ~ 년(50) 년 월콤보(65),
 *   창 아래 가운데 [다운로드][닫기]. 열 때 시작·끝 모두 기준년월로 채운다
 */
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';

export interface DownloadPeriod {
  startYear: string;
  startMonth: string;
  closeYear: string;
  closeMonth: string;
}

interface Props {
  open: boolean;
  /** open(dataYMText, …) — 기준년월 'yyyy.MM' (getDataYm() L119-123) */
  dataYm: string;
  /** callback.execute(param) 뒤 hide() — 월은 코드('01'~'12') */
  onResult: (period: DownloadPeriod) => void;
  onClose: () => void;
}

const LABEL: React.CSSProperties = { fontWeight: 'bold', padding: '0 6px' };

export const Biz01_Lookup_CardManagementDownload: React.FC<Props> = ({ open, dataYm, onResult, onClose }) => {
  const [startYear, setStartYear] = useState('');
  const [startMonth, setStartMonth] = useState<string | undefined>();
  const [closeYear, setCloseYear] = useState('');
  const [closeMonth, setCloseMonth] = useState<string | undefined>();

  // open() L60-65: 시작·끝 모두 기준년월
  useEffect(() => {
    if (!open) return;
    const m = /^(\d{4})[.-](\d{1,2})$/.exec(dataYm.trim());
    const year = m?.[1] ?? '';
    const month = m ? m[2].padStart(2, '0') : undefined;
    setStartYear(year);
    setStartMonth(month);
    setCloseYear(year);
    setCloseMonth(month);
  }, [open, dataYm]);

  // [E1] downloadButton[다운로드].Select (L98) → callback.execute(param), hide()
  const download = () => {
    onResult({ startYear, startMonth: startMonth ?? '', closeYear, closeMonth: closeMonth ?? '' });
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title={<span style={{ color: '#0069B4', fontWeight: 'bold' }}>다운로드</span>}
      width={400}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Button type="download" onClick={download}>다운로드</Button>
          {/* [E2] closeButton[닫기].Select (L111) → hide() */}
          <Button type="close" onClick={onClose} style={{ marginLeft: 8 }}>닫기</Button>
        </div>
      )}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '15px 10px 25px 10px' }}>
        <Input style={{ width: 70 }} value={startYear} onChange={e => setStartYear(e.target.value)} />
        <span style={LABEL}>년</span>
        <SystemCodeComboBox kindCd="MonthsCode" allowClear={false} style={{ width: 80 }} value={startMonth} onChange={c => setStartMonth(c)} />
        <span style={LABEL}>~</span>
        <Input style={{ width: 70 }} value={closeYear} onChange={e => setCloseYear(e.target.value)} />
        <span style={LABEL}>년</span>
        <SystemCodeComboBox kindCd="MonthsCode" allowClear={false} style={{ width: 80 }} value={closeMonth} onChange={c => setCloseMonth(c)} />
      </div>
    </LookupModal>
  );
};
