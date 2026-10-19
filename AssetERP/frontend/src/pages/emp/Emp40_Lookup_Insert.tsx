/**
 * 기준 적용일 생성 창 (E26) — Emp41_Tab_EvalList의 [등록]에서 연다
 * AS-IS: myApp/client/vi/emp/Emp40_Lookup_Insert.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L60-103: 모달 350×180 "생성", 가운데 줄 = 적용월 [년도 입력] 년 [월 콤보 MonthsCode], 아래 가운데 [생성][닫기].
 *   처음 값 = 오늘 기준 한 달 전의 년·월 (L64-71)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal } from 'antd';
import { empEvalApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  open: boolean;
  /** open(dateList, callback) L53-58 — 지금 있는 기준 적용일들('yyyy-MM-dd') */
  dateList: string[];
  /** callback.execute() — 생성에 성공하면 부른다 (목록 다시 조회) */
  onSaved: () => void;
  onClose: () => void;
}

/** L64-71: 오늘 기준 한 달 전의 [년, 월(01~12)] */
const defaultYearMonth = (): [string, string] => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return [String(d.getFullYear()), String(d.getMonth() + 1).padStart(2, '0')];
};

export const Emp40_Lookup_Insert: React.FC<Props> = ({ open, dateList, onSaved, onClose }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState<string | undefined>();

  // [E0] 화면 열림 (생성자 L60-91) → show(): 적용년도·적용월 처음 값 = 오늘 기준 한 달 전
  useEffect(() => {
    if (open) {
      const [y, m] = defaultYearMonth();
      setYear(y);
      setMonth(m);
    }
  }, [open]);

  // [E1] updateButton[생성].Select (L74) → update() L105-144
  const update = async () => {
    if (year.trim() === '') {
      message.warning('적용년도를 입력해주세요');
      return;
    }
    if (!month) {
      message.warning('적용월을 입력해주세요');
      return;
    }
    const startDate = `${year.trim().padStart(4, '0')}-${month}-01`;
    if (dateList.includes(startDate)) {
      message.warning('이미 생성된 기준 적용일입니다');
      return;
    }
    try {
      await empEvalApi.createEvalListStd(startDate);
      onSaved();
      onClose();
    } catch (err) {
      // status -1 "이미 생성된 기준 적용일입니다" / -2 "해당 적용일 범위에 등록된 인사평가 내역이 존재합니다. 삭제 후 진행바랍니다"
      message.warning(errorMessage(err, '생성 실패'));
    }
  };

  return (
    <Modal
      open={open}
      title="생성"
      width={350}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="generate" onClick={update}>생성</Button>
          {/* [E2] closeButton[닫기].Select (L80) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '20px 10px 25px' }}>
        <span style={{ width: 60 }}>적용월</span>
        <Input style={{ width: 70 }} value={year} maxLength={4} onChange={e => setYear(e.target.value)} onPressEnter={update} />
        <span>년</span>
        <SystemCodeComboBox kindCd="MonthsCode" allowClear={false} style={{ width: 80 }} value={month} onChange={v => setMonth(v)} />
      </div>
    </Modal>
  );
};
