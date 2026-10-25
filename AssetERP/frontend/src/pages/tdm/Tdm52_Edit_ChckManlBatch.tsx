/**
 * 일괄점검처리 창 (N22) — Tdm52_TabPage_CheckManl의 [일괄점검](Tdm52_Tab_CheckManl)이 고른 점검진행 항목을 한꺼번에 점검완료한다.
 * AS-IS: myApp/client/vi/tdm/Tdm52_Edit_ChckManlBatch.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L51-58: 모달 650×400(닫기 X 없음), 아래 가운데 [증빙자료(n건)][점검완료][닫기]. getEditor() L121-144: 점검일자(오늘, settings L89-119)·점검결과(콤보 TdmCheckResult0003)·점검의견(200)
 * 다음 단계: 열릴 때 임시 증빙 ID를 받고(getTmpFileParentId L77-87) [증빙자료]가 증빙자료 창(Tdm00_Lookup_RelateAppr)을 열어 고른 증빙을 모든 항목에 복사하고, [닫기]가 임시 증빙을 지운다(close L208-225).
 *   지금은 [증빙자료]가 안내만이라 임시 증빙·복사를 하지 않는다
 * UX보강(10): 해당 없음
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Modal, Space, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const DATE_FORMAT = 'YYYY.MM.DD';

interface Props {
  /** 점검완료할 점검항목 ID들 (AS-IS open(list, stdDate, cb)의 list) — 값이 있으면 열린다 */
  ids: number[] | null;
  /** AS-IS callBack.execute() — 점검이 끝난 뒤(부르는 쪽이 다시 조회한다) */
  onDone: () => void;
  onClose: () => void;
}

const Row: React.FC<{ label: React.ReactNode; blue?: boolean; children: React.ReactNode; top?: boolean }> = ({ label, blue, children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', marginBottom: 20 }}>
    <Typography.Text strong style={{ width: 100, flex: 'none', paddingTop: top ? 5 : 0, textAlign: 'right', paddingRight: 8, color: blue ? '#0069B4' : undefined }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Tdm52_Edit_ChckManlBatch: React.FC<Props> = ({ ids, onDone, onClose }) => {
  const [checkDate, setCheckDate] = useState<Dayjs | null>(dayjs());
  const [resultCode, setResultCode] = useState<string | undefined>(undefined);
  const [resultName, setResultName] = useState('');
  const [cmnt, setCmnt] = useState('');
  const [busy, setBusy] = useState(false);

  // [E0] 화면 열림 (생성자 L51-58, open() L60-75) → settings(): 점검일자 = 오늘, 나머지는 빈 값
  useEffect(() => {
    if (!ids) return;
    setCheckDate(dayjs());
    setResultCode(undefined);
    setResultName('');
    setCmnt('');
  }, [ids]);

  // [E1] fileButton[증빙자료(0건)].Select (L100) → lookupFile() L189-206 — 다음 단계(Tdm00_Lookup_RelateAppr)
  const lookupFile = () => { message.info('증빙자료 창(Tdm00_Lookup_RelateAppr)은 다음 단계에서 연결됩니다'); };

  // [E2] completeButton[점검완료].Select (L107) → update() L146-187: tdm.Tdm52_ChckManl.batchCheckComplete
  const update = async () => {
    if (!ids) return;
    if (!checkDate) { message.warning('점검일자를 선택하세요'); return; }
    if (!resultCode) { message.warning('점검결과를 선택하세요'); return; }
    setBusy(true);
    try {
      await tdmApi.batchCompleteCheckManls({
        chckManlIds: ids, checkDate: checkDate.format('YYYY-MM-DD'), checkResultCode: resultCode, checkResultName: resultName, checkCmnt: cmnt || null,
      });
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
      return;
    } finally {
      setBusy(false);
    }
    message.info('점검이 완료되었습니다');
    onDone();
    onClose();                                                              // close()
  };

  return (
    <Modal
      open={!!ids}
      title={<b>일괄점검처리</b>}
      width={650}
      maskClosable={false}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="attach" style={{ width: 150 }} onClick={lookupFile}>증빙자료(0건)</Button>
            <Button type="save" disabled={busy} onClick={update}>점검완료</Button>
            {/* [E3] closeButton[닫기].Select (L113) → close() L208-225 */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ paddingTop: 10 }}>
        <Row label="점검일자" blue><DatePicker style={{ width: 270 }} format={DATE_FORMAT} value={checkDate} onChange={setCheckDate} /></Row>
        <Row label="점검결과" blue>
          {/* CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", TdmCheckResult0003) */}
          <SystemCodeComboBox kindGroupCd="TdmCheckResult0003" style={{ width: 270 }} placeholder="선택하세요" allowClear={false}
            value={resultCode} onChange={(code, name) => { setResultCode(code); setResultName(name ?? ''); }} />
        </Row>
        <Row label="점검의견" top><Input.TextArea style={{ height: 200, resize: 'none' }} value={cmnt} onChange={e => setCmnt(e.target.value)} /></Row>
      </div>
    </Modal>
  );
};
