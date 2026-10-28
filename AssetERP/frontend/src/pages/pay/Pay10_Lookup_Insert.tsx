/**
 * 급여 생성 구분 창 (S16) — Pay10_Tab_Month의 [생성]이 연다.
 * AS-IS: myApp/client/vi/pay/Pay10_Lookup_Insert.java (243줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L64-167: 530×370 모달 "생성 구분", 지급구분(PayMonthCode 콤보 120) · 지급일자 120 · 기준연월 120(빈칸 "YYYY.MM", 지급일자를 바꾸면 yyyy.MM으로 채움)
 *   · 라디오(연봉정보/전월급여 — 지급구분이 "급여"일 때만 활성) · 안내 문구, 아래 가운데 [생성][닫기]
 * 생성 흐름: [생성] → checkAppr(L169-192, 퇴직정산 03은 건너뜀) → update(L194-234): 필수 검사 → Emp01_Lookup_TransDate.open(true) → 서버 insert
 * 11 §4a EditModal 규격: 머리말·푸터 선, 라벨 오른쪽 정렬
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, message, Modal, Radio, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { TransTarget } from '@/types/emp';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Emp01_Lookup_TransDate } from '@/components/lookup/Emp01_Lookup_TransDate';

const LABEL: React.CSSProperties = { width: 80, textAlign: 'right', paddingRight: 10, flex: 'none', fontWeight: 600, color: '#456EA6' };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', paddingLeft: 35 };
const NOTE_STYLE: React.CSSProperties = { color: '#456EA6', fontWeight: 600, fontSize: 13, lineHeight: 1.6, padding: '0 20px' };

interface Props {
  open: boolean;
  /** 생성이 끝난 뒤 (AS-IS callback.execute() — 창을 닫을 때도 불린다) */
  onClosed?: () => void;
  onClose: () => void;
}

export const Pay10_Lookup_Insert: React.FC<Props> = ({ open, onClosed, onClose }) => {
  const [payCode, setPayCode] = useState<string | null>(null);
  const [payName, setPayName] = useState('');
  const [payDate, setPayDate] = useState<Dayjs | null>(null);
  const [stdMonth, setStdMonth] = useState('');
  // annualYn: 라디오가 바꾸는 값. 지급구분을 바꿔 라디오가 비활성이 되어도 마지막 값을 그대로 보낸다(원본 그대로)
  const [annualYn, setAnnualYn] = useState(true);
  const [empOpen, setEmpOpen] = useState(false);

  // 열 때마다 새 창: annualYn = true, 라디오 연봉정보
  useEffect(() => {
    if (!open) return;
    setPayCode(null);
    setPayName('');
    setPayDate(null);
    setStdMonth('');
    setAnnualYn(true);
    setEmpOpen(false);
  }, [open]);

  const radioEnabled = payName === '급여';

  // [E4] payDate.ValueChange (L141) → stdMonth = yyyy.MM
  const changeDate = (d: Dayjs | null) => {
    setPayDate(d);
    if (d) setStdMonth(d.format('YYYY.MM'));
  };

  // [E5] updateButton[생성].Select (L148) → checkAppr() L169-192 → update() L194-234
  // 필수 검사(구분·지급일자)는 서버를 부르기 전에 한다 — 원본은 checkAppr를 먼저 부르지만 구분이 비면 서버가 거절하므로 같은 문구로 먼저 막는다
  const checkAppr = async () => {
    if (payCode == null) {
      message.warning('구분값은 필수입력 항목입니다');
      return;
    }
    if (payDate == null) {
      message.warning('급여지급일은 필수입력 항목입니다');
      return;
    }
    if (payCode !== '03') {
      try {
        const res = await payApi.checkMonthAppr(payCode, payDate.format('YYYY-MM-DD'), null);
        if (!res.ok) {
          message.warning(res.message ?? '생성할 수 없습니다');
          return;
        }
      } catch (err) {
        message.error(errorMessage(err, '확인 실패'));
        return;
      }
    }
    setEmpOpen(true);   // Emp01_Lookup_TransDate.open(true, callback)
  };

  // Emp01_Lookup_TransDate callback → pay.Pay10_Month.insert (L206-232)
  const create = async (list: TransTarget[]) => {
    setEmpOpen(false);
    if (payCode == null || payDate == null) return;
    try {
      await payApi.createMonths({
        payCode,
        payDate: payDate.format('YYYY-MM-DD'),
        annualYn,
        stdMonth,
        targets: list.map(t => ({ personId: t.personId, transCode: t.transCd, hireDate: t.hireDate ?? null, transDate: t.transDate })),
      });
    } catch (err) {
      message.warning(errorMessage(err, '데이터를 불러올수 없습니다. 관리자에게 문의해주세요'));
      return;
    }
    message.success('생성이 완료되었습니다');
    onClosed?.();
    onClose();
  };

  // [E6] closeButton[닫기].Select (L155) → callback.execute(), hide()
  const close = () => {
    onClosed?.();
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        title="생성 구분"
        width={560}
        maskClosable={false}
        onCancel={close}
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={(
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="generate" onClick={checkAppr}>생성</Button>
              <Button type="close" onClick={close}>닫기</Button>
            </Space>
          </div>
        )}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <div style={ROW}>
            <span style={LABEL}>지급구분</span>
            {/* [E2] Collapse (L122) → payCode = 콤보 코드, [E3] ValueChange (L129) → 이름이 "급여"일 때만 라디오 활성 */}
            <SystemCodeComboBox kindCd="PayMonthCode" style={{ width: 120 }} value={payCode ?? undefined}
              onChange={(c, n) => { setPayCode(c ?? null); setPayName(n ?? ''); }} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>지급일자</span>
            <DatePicker style={{ width: 120 }} allowClear={false} value={payDate} onChange={changeDate} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>기준연월</span>
            <Input style={{ width: 120 }} placeholder="YYYY.MM" value={stdMonth} onChange={e => setStdMonth(e.target.value)} />
          </div>
          <div style={{ ...ROW, paddingLeft: 135 }}>
            {/* [E1] toggle.ValueChange (L83) → annualYn "true"(연봉정보) / "false"(전월급여) */}
            <Radio.Group disabled={!radioEnabled} value={annualYn} onChange={e => setAnnualYn(e.target.value)}>
              <Radio value={true}>연봉정보</Radio>
              <Radio value={false}>전월급여</Radio>
            </Radio.Group>
          </div>
          <div style={NOTE_STYLE}>
            *지급구분이 &#39;급여&#39;인 경우 선택구분에 따라 전월의 급여 또는 연봉정보<br />
            &nbsp;데이터로 생성됩니다.<br />
            &nbsp;만약 전월의 급여지급이 1건 이상인 경우 최근 급여데이터로 생성합니다.<br /><br />
            *이미 지급구분과 지급일이 같은 내역이 존재할  경우<br />
            &nbsp;기존 데이터는 유지되며 추가분만 기존데이터에 추가됩니다.
          </div>
        </div>
      </Modal>
      <Emp01_Lookup_TransDate open={empOpen} isSeparateAddTitle onResult={create} onClose={() => setEmpOpen(false)} />
    </>
  );
};
