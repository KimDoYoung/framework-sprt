/**
 * 경조구분 상세 창 — Bbs20_Edit_FloralRequest에서 경조구분이 10(결혼)·20(근조)일 때 연다 (Y12)
 * AS-IS: myApp/client/vi/bbs/Bbs20_Lookup_OccasionsOption.java (176줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(occasionsCode, callback) L42-77: 모달 "경조구분 상세", 10 = 260×150 [신랑측][신부측] 체크 둘, 20 = 370×150 상주(글자 100) · 발인일(날짜 100, 기본 오늘),
 *   아래 가운데 [확인][닫기]. [확인] L136-161: 10은 하나도 안 골랐으면 "신랑,신부는 필수선택값입니다.", 20은 상주 "상주는 필수입력값입니다."·발인일 "발인일은 필수선택값입니다." —
 *   결과 글자: 10 "신랑측" / "신부측" / "신랑측, 신부측", 20 "상주 : 이름 / 발인일 : yyyy-MM-dd". [닫기]는 결과 없이 닫는다(callback 안 부름)
 * 편집창 규격(11 §4a)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Button } from '@/components/button';

const LABEL: React.CSSProperties = { width: 60, flex: 'none', textAlign: 'right', paddingRight: 10 };

interface Props {
  /** 값이 있으면 열린다 — 10 결혼 / 20 근조 */
  occasionsCode: string | null;
  /** [확인]의 결과 글자 (callback.execute(text)) */
  onResult: (text: string) => void;
  onClose: () => void;
}

export const Bbs20_Lookup_OccasionsOption: React.FC<Props> = ({ occasionsCode, onResult, onClose }) => {
  const [groom, setGroom] = useState(false);
  const [bride, setBride] = useState(false);
  const [chief, setChief] = useState('');
  const [date, setDate] = useState<Dayjs>(dayjs());

  useEffect(() => {
    if (occasionsCode == null) return;
    // settings() L88-134: 체크 둘 해제, 발인일 기본 오늘
    setGroom(false); setBride(false); setChief(''); setDate(dayjs());
  }, [occasionsCode]);

  // [E1] checkBox01[신랑측].ValueChange (L93) · [E2] checkBox02[신부측].ValueChange (L113) → 선택에 따라 "신랑측"/"신부측"/"신랑측, 신부측"/없음 (아래 confirm에서 계산)
  // [E3] updateButton[확인].Select (L136)
  const confirm = () => {
    if (occasionsCode === '10') {
      if (!groom && !bride) { message.warning('신랑,신부는 필수선택값입니다.'); return; }
      onResult(groom && bride ? '신랑측, 신부측' : groom ? '신랑측' : '신부측');
    } else if (occasionsCode === '20') {
      if (!chief) { message.warning('상주는 필수입력값입니다.'); return; }
      onResult(`상주 : ${chief} / 발인일 : ${date.format('YYYY-MM-DD')}`);
    }
    onClose();
  };

  return (
    <Modal
      open={occasionsCode != null}
      title="경조구분 상세"
      width={occasionsCode === '20' ? 370 : 260}
      maskClosable={false}
      closable={false}
      destroyOnClose
      onCancel={onClose}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E4] cancelButton[닫기].Select (L162) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '12px 2px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {occasionsCode === '10' && (
          <Space size={20}>
            <Checkbox checked={groom} onChange={e => setGroom(e.target.checked)}>신랑측</Checkbox>
            <Checkbox checked={bride} onChange={e => setBride(e.target.checked)}>신부측</Checkbox>
          </Space>
        )}
        {occasionsCode === '20' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={LABEL}>상주</span>
              <Input style={{ width: 100 }} value={chief} onChange={e => setChief(e.target.value)} />
              <span style={{ ...LABEL, marginLeft: 10 }}>발인일</span>
              <DatePicker style={{ width: 130 }} allowClear={false} value={date} onChange={d => d && setDate(d)} />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
