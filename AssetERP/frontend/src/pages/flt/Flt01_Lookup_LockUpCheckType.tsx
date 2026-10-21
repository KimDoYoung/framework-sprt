/**
 * 지분상장증권 의무보유기간 위반 체크 방식 (J09) — Flt01_Tab_CompanyStd 그리드의 편집 아이콘에서 연다.
 * AS-IS: myApp/client/vi/flt/Flt01_Lookup_LockUpCheckType.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L62-74: 모달 600×310, 폼(체크방식 콤보 / 의무보유기간 [체크][n][영업일|개월] 미만 보유한 경우 / 매수주문횟수 일간·월간 체크) + [저장][닫기].
 * open(stdModel, callback) L76-85: 고른 기준관리 행을 폼에 채운다.
 * UX보강(10): 조회창 UX-05(열면 첫 입력칸에 커서 — 입력칸이 숫자뿐이라 해당 없음)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, InputNumber, message, Space, Typography } from 'antd';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltCompanyStd } from '@/types/flt';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  /** AS-IS open(stdModel, callback)의 stdModel — 값이 있으면 열린다 */
  row: FltCompanyStd | null;
  /** callback.execute(result): 저장된 행으로 그리드 행을 바꾼다 (grid.getStore().update) */
  onResult: (saved: FltCompanyStd) => void;
  onClose: () => void;
}

const LABEL = { color: '#000' } as const;  // setHtmlCheckBoxLabelStyle

export const Flt01_Lookup_LockUpCheckType: React.FC<Props> = ({ row, onResult, onClose }) => {
  const [lockUpCode, setLockUpCode] = useState<string | undefined>('1');
  const [lockUpDays, setLockUpDays] = useState<number | null>(null);
  const [calcStdCode, setCalcStdCode] = useState<string | undefined>('D');
  const [dayYn, setDayYn] = useState(false);
  const [monthYn, setMonthYn] = useState(false);

  // [E0] 화면 열림 (생성자 L62-74) → getEditor(), show() — open() L76-85: editDriver.edit(stdModel) 뒤 setCheckBox() — 보유기간 체크("1")면 매수주문횟수 체크는 해제된다
  useEffect(() => {
    if (!row) return;
    const code = row.lockUpCode ?? '1';
    setLockUpCode(code);
    setLockUpDays(row.lockUpDays);
    setCalcStdCode(row.lockUpCalcStdCode ?? undefined);
    setDayYn(code === '1' ? false : row.buyOprDayYn === 'true');
    setMonthYn(code === '1' ? false : row.buyOprMonthYn === 'true');
  }, [row]);

  // [E1] lockUpName[체크방식].Collapse (L89) → setCheckBox() L121-146: 보유기간 체크("1")면 기간 칸을 켜고 매수주문횟수 체크를 끄며 해제, 아니면 반대
  const changeCode = (code: string | undefined) => {
    setLockUpCode(code);
    if (code === '1') { setDayYn(false); setMonthYn(false); }
  };

  const byPeriod = lockUpCode === '1';

  // [E2] updateButton[저장].Select (L107) → update() L180-211: 검사 뒤 서비스 flt.Flt01_CompanyStd.updateOne → 콜백(저장된 행) → hide()
  const update = async () => {
    if (!row) return;
    if (byPeriod) {
      if (lockUpDays == null) { message.warning('의무보유기간을 입력하세요'); return; }
    } else if (!dayYn && !monthYn) {
      message.warning('체크방식은 한 개 이상 반드시 체크되어야 합니다');
      return;
    }
    try {
      const saved = await fltApi.updateCompanyStdLockup(row.companyStdId, {
        lockUpCode: lockUpCode ?? null,
        lockUpDays,
        lockUpCalcStdCode: calcStdCode ?? null,
        buyOprDayYn: String(dayYn),
        buyOprMonthYn: String(monthYn),
      });
      onResult(saved);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  const rate = row?.turnoverRate;

  return (
    <LookupModal
      open={!!row}
      title="지분상장증권 의무보유기간 위반 체크 방식"
      width={600}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={update}>저장</Button>
            {/* [E3] closeButton[닫기].Select (L113) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ padding: '10px 15px 0 5px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Space size={10}>
          <Typography.Text strong style={{ width: 90, display: 'inline-block' }}>체크방식</Typography.Text>
          <SystemCodeComboBox kindCd="FloorTrLockUpCheckCode" style={{ width: 200 }} allowClear={false} value={lockUpCode} onChange={changeCode} />
        </Space>
        <Space size={6} style={{ marginLeft: 50 }}>
          <Checkbox checked={byPeriod} disabled />
          <Typography.Text style={{ ...LABEL, opacity: byPeriod ? 1 : 0.45 }}>의무보유기간 </Typography.Text>
          <InputNumber style={{ width: 70 }} min={0} precision={0} disabled={!byPeriod} value={lockUpDays} onChange={v => setLockUpDays(v)} />
          <SystemCodeComboBox kindCd="FloorTrLockUpCalcStdCode" style={{ width: 90 }} allowClear={false} disabled={!byPeriod}
            value={calcStdCode} onChange={setCalcStdCode} />
          <Typography.Text style={{ ...LABEL, opacity: byPeriod ? 1 : 0.45 }}> 미만 보유한 경우</Typography.Text>
        </Space>
        <Checkbox style={{ marginLeft: 50 }} disabled={byPeriod} checked={dayYn} onChange={e => setDayYn(e.target.checked)}>
          <span style={LABEL}>{`월간매매회전율 ${rate ?? ''}% 이상이며, 매수주문횟수 일간 3회 초과`}</span>
        </Checkbox>
        <Checkbox style={{ marginLeft: 50 }} disabled={byPeriod} checked={monthYn} onChange={e => setMonthYn(e.target.checked)}>
          <span style={LABEL}>{`월간매매회전율 ${rate ?? ''}% 이상이며, 매수주문횟수 월간 30회 초과`}</span>
        </Checkbox>
      </div>
    </LookupModal>
  );
};
