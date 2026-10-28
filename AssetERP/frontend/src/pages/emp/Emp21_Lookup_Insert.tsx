/**
 * 생성 구분 창 — 연차 탭(Emp21_TabPage_UnLeaveList1, S08)의 [생성]에서 연다.
 * AS-IS: myApp/client/vi/emp/Emp21_Lookup_Insert.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L45-103: 모달 600×250 "생성 구분", 기준년도(45) · 공지구분(150) + 통보기간 안내 글, 아래 가운데 [생성][닫기].
 */
import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import dayjs from 'dayjs';
import { empUnLeaveApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

interface Props {
  open: boolean;
  /** open(unLeaveName, callback) L45 — 부른 화면에서 고른 구분 이름(콤보 글자) */
  unLeaveName: string | null;
  /** 닫기·생성 완료 callback.execute() — 부른 쪽이 다시 조회한다 */
  onClose: () => void;
}

const LABEL: React.CSSProperties = { width: 80, textAlign: 'right', paddingRight: 10, flexShrink: 0 };

export const Emp21_Lookup_Insert: React.FC<Props> = ({ open, unLeaveName, onClose }) => {
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [code, setCode] = useState<string | undefined>(undefined);

  // 열림 (open L45-103): 기준년도 = 올해, 구분 = 부른 화면에서 고른 구분(이름이 같은 코드를 콤보 목록에서 찾는다)
  useEffect(() => {
    if (!open) return;
    setYear(dayjs().format('YYYY'));
    setCode(undefined);
  }, [open]);

  // [E1] updateButton[생성].Select (L84) → updateCheck() L105 → update() L126-154: 서비스 emp.Emp21_UnLeave.insert(companyId, stdYear, unLeaveCode)
  const update = async () => {
    if (!year) { message.warning('기준년도는 필수입력 항목입니다'); return; }
    if (!code) { message.warning('공지구분값은 필수입력 항목입니다'); return; }
    try {
      const count = await empUnLeaveApi.createYear(year, code);
      if (count > 0) {
        message.success('생성이 완료되었습니다');
        onClose();
      } else {
        message.warning('생성가능한 사원이 없습니다');
      }
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title="생성 구분"
      width={600}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {/* [E1] updateButton[생성].Select (L84) */}
          <Button type="generate" onClick={update}>생성</Button>
          {/* [E2] closeButton[닫기].Select (L91) → callback.execute(), hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '12px 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingLeft: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={LABEL}>기준년도</span>
            <Input style={{ width: 60 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={LABEL}>공지구분</span>
            <SystemCodeComboBox
              kindGroupCd="unLeaveCode001"
              style={{ width: 150 }}
              placeholder="구분을 선택해주세요"
              value={code}
              onChange={c => setCode(c)}
              onLoad={list => { if (unLeaveName) setCode(prev => prev ?? list.find(c => c.name === unLeaveName)?.code); }}
            />
          </div>
        </div>
        <div style={{ color: '#4472C4', fontSize: 13, lineHeight: 1.7, paddingLeft: 15 }}>
          *통보기간<br />
          연차 사용촉진 : 결산기준월 6개월전부터 10일이내 (예, 결산월이 12월인 경우 7/1 ~ 7/10)<br />
          연차 지정통보 : 결산기준월 2개월전부터 10일이내 (예, 결산월이 12월인 경우 11/1 ~ 11/10)
        </div>
      </div>
    </LookupModal>
  );
};
