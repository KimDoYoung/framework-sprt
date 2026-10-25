/**
 * 이행점검 작업등록 창 (N20) — Tdm50_Tab_CheckJob의 [작업정보등록]이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm50_Edit_CheckJob.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 920×170(원본): 한 줄 = 점검시작일(200) · 점검마감일(200) · 이행점검명(450), 라벨 폭 100, [저장][닫기]
 * 비어 있던 시작일·마감일은 오늘·이번 달 마지막 날로 채워 연다(edit() L53-58)
 * UX보강(10): 팝업(UX-05)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmCheckJob } from '@/types/tdm';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

const FORMAT = 'YYYY-MM-DD';
const LABEL = { width: 100, flex: 'none', color: '#0069B4' } as const;

interface Props {
  /** 값이 있으면 열림 — AS-IS edit(chckJobModel, callBack) 의 모델 */
  job: TdmCheckJob | null;
  /** 저장이 끝나면 (AS-IS callBack.execute()) */
  onSaved: () => void;
  onClose: () => void;
}

export const Tdm50_Edit_CheckJob: React.FC<Props> = ({ job, onSaved, onClose }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [checkName, setCheckName] = useState('');

  // [E0] 화면 열림 (생성자 L61-74) → setting(), show()
  // edit() L46-59: editDriver.edit(모델) 뒤 비어 있는 시작일 = LoginUser.getToday(), 마감일 = LoginUser.getMonthLastDay()
  useEffect(() => {
    if (!job) return;
    setStartDate(job.startDate ? dayjs(job.startDate) : dayjs());
    setEndDate(job.endDate ? dayjs(job.endDate) : dayjs().endOf('month'));
    setCheckName(job.checkName ?? '');
  }, [job]);

  // [E1] updateButton[저장].Select (L77) → update() L111-144
  const update = async () => {
    if (!job) return;
    if (!startDate) return void message.warning('점검시작일은 필수선택 항목입니다');
    if (!endDate) return void message.warning('점검마감일은 필수선택 항목입니다');
    if (!checkName) return void message.warning('내용은 필수입력 항목입니다');
    try {
      await tdmApi.saveCheckJob({
        chckJobId: job.chckJobId,
        checkYm: job.checkYm,
        checkName,
        startDate: startDate.format(FORMAT),
        endDate: endDate.format(FORMAT),
      });
      onSaved();                                                      // callBack.execute() → hide()
      onClose();
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));               // L136-139: status != 1 → SimpleMessage(result.getMessage())
    }
  };

  const field = (label: string, width: number, node: React.ReactNode) => (
    <div style={{ width, display: 'flex', alignItems: 'center' }}>
      <span style={LABEL}><b>{label}</b></span>
      {node}
    </div>
  );

  return (
    <LookupModal
      open={job != null}
      title="이행점검 작업등록"
      width={920}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="save" onClick={update}>저장</Button>
          {/* [E2] closeButton[닫기].Select (L83) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', padding: '15px 10px 25px 0' }}>
        {field('점검시작일', 300, <DatePicker allowClear={false} style={{ width: 140 }} value={startDate} format={FORMAT} onChange={setStartDate} />)}
        {field('점검마감일', 300, <DatePicker allowClear={false} style={{ width: 140 }} value={endDate} format={FORMAT} onChange={setEndDate} />)}
        {field('이행점검명', 450, <Input style={{ width: 340 }} value={checkName} onChange={e => setCheckName(e.target.value)} />)}
      </div>
    </LookupModal>
  );
};
