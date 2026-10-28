/**
 * 근로시간 편집창 (S16) — Pay11_TabPage_MonthItem의 [근로시간]이 연다.
 * AS-IS: myApp/client/vi/pay/Pay10_Lookup_Work.java (154줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L53-104: 300×400 모달 "근로시간", 사원명(읽기 전용)·근로일수·총 근로시간수(읽기 전용)·연장·야간·휴일 근로시간(소수 가능), 아래 가운데 [저장][닫기].
 * 03 원칙 16 / 11 §4a EditModal 규격: 머리말·푸터 선, 라벨 오른쪽 정렬
 */
import React, { useEffect, useState } from 'react';
import { InputNumber, message, Modal, Space } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayMonth } from '@/types/pay';
import { Button } from '@/components/button';

const LABEL: React.CSSProperties = { width: 110, textAlign: 'right', paddingRight: 10, flex: 'none' };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center' };

interface Props {
  /** 고른 급여(값이 있으면 열림) */
  month: PayMonth | null;
  /** 사원명 칸에 보일 글자 — 사원명 직급 (사번) */
  name: string;
  /** 저장이 끝난 뒤 바뀐 근로시간(부르는 쪽이 고른 행에 반영) — 창은 닫히지 않는다 */
  onSaved: (patch: Pick<PayMonth, 'workDay' | 'totalWorkTime' | 'extendWorkTime' | 'nightWorkTime' | 'holidayWorkTime'>) => void;
  onClose: () => void;
}

export const Pay10_Lookup_Work: React.FC<Props> = ({ month, name, onSaved, onClose }) => {
  const [workDay, setWorkDay] = useState<number | null>(0);
  const [extend, setExtend] = useState<number | null>(0);
  const [night, setNight] = useState<number | null>(0);
  const [holiday, setHoliday] = useState<number | null>(0);
  const [total, setTotal] = useState(0);
  const [saving, setSaving] = useState(false);

  // editDriver.edit(monthModel)
  useEffect(() => {
    if (!month) return;
    setWorkDay(month.workDay ?? 0);
    setExtend(month.extendWorkTime ?? 0);
    setNight(month.nightWorkTime ?? 0);
    setHoliday(month.holidayWorkTime ?? 0);
    setTotal(month.totalWorkTime ?? 0);
  }, [month]);

  // [E1] updateButton[저장].Select (L87) → checkAppr() L106-127 → update() L129-145
  // 서버가 checkAppr(결재 진행·전표)를 먼저 하고, 실패하면 그 문구를 돌려준다. 총근로시간 = 근로일수×8 + 연장 + 야간 + 휴일
  const save = async () => {
    if (!month) return;
    const req = { workDay: workDay ?? 0, extendWorkTime: extend ?? 0, nightWorkTime: night ?? 0, holidayWorkTime: holiday ?? 0 };
    setSaving(true);
    try {
      await payApi.updateMonthWorkTime(month.monthId, req);
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
      return;
    } finally {
      setSaving(false);
    }
    const totalWorkTime = req.workDay * 8 + req.extendWorkTime + req.nightWorkTime + req.holidayWorkTime;
    setTotal(totalWorkTime);
    message.success('정상적으로 저장되었습니다');
    onSaved({ ...req, totalWorkTime });
  };

  return (
    <Modal
      open={month != null}
      title="근로시간"
      width={330}
      maskClosable={false}
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" loading={saving} onClick={save}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L93) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <div style={ROW}><span style={LABEL}>사원명</span><input readOnly disabled value={name} style={{ flex: 1, height: 32, padding: '0 8px', border: '1px solid #d9d9d9', borderRadius: 6, background: '#f5f5f5' }} /></div>
        <div style={ROW}><span style={LABEL}>근로일수</span><InputNumber style={{ flex: 1 }} value={workDay} onChange={setWorkDay} /></div>
        <div style={ROW}><span style={LABEL}>총 근로시간수</span><InputNumber style={{ flex: 1 }} value={total} disabled /></div>
        <div style={ROW}><span style={LABEL}>연장근로시간</span><InputNumber style={{ flex: 1 }} value={extend} onChange={setExtend} /></div>
        <div style={ROW}><span style={LABEL}>야간근로시간</span><InputNumber style={{ flex: 1 }} value={night} onChange={setNight} /></div>
        <div style={ROW}><span style={LABEL}>휴일근로시간</span><InputNumber style={{ flex: 1 }} value={holiday} onChange={setHoliday} /></div>
      </div>
    </Modal>
  );
};
