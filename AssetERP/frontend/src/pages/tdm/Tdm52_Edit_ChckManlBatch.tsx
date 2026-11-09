/**
 * 일괄점검처리 창 (N22) — Tdm52_TabPage_CheckManl의 [일괄점검](Tdm52_Tab_CheckManl)이 고른 점검진행 항목을 한꺼번에 점검완료한다.
 * AS-IS: myApp/client/vi/tdm/Tdm52_Edit_ChckManlBatch.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L51-58: 모달 650×400(닫기 X 없음), 아래 가운데 [증빙자료(n건)][점검완료][닫기]. getEditor() L121-144: 점검일자(오늘, settings L89-119)·점검결과(콤보 TdmCheckResult0003)·점검의견(200)
 * 열릴 때 임시 증빙 ID를 받고(getTmpFileParentId L77-87, 받은 뒤에 창을 보인다) [증빙자료]가 증빙자료 창(Tdm00_Lookup_RelateAppr "tdm52", 임시 ID)을 연다.
 *   [점검완료]는 임시 증빙을 모든 항목에 복사하고, [닫기](와 점검완료 뒤)는 임시 증빙을 지운 뒤 닫는다(close L208-225). 2026-11-05 연결(13-누락대장 2번) — 창 안 [불러오기]는 보류(Com01_Lookup_RelateAppr 머리)
 * UX보강(10): 해당 없음
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Space, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { EditModal, EditField } from '@/components/form/EditForm';
import { Tdm00_Lookup_RelateAppr } from './Tdm00_Lookup_RelateAppr';

const DATE_FORMAT = 'YYYY.MM.DD';

interface Props {
  /** 점검완료할 점검항목 ID들 (AS-IS open(list, stdDate, cb)의 list) — 값이 있으면 열린다 */
  ids: number[] | null;
  /** AS-IS callBack.execute() — 점검이 끝난 뒤(부르는 쪽이 다시 조회한다) */
  onDone: () => void;
  onClose: () => void;
}

const lb = (text: string, blue?: boolean) => <b style={{ color: blue ? '#0069B4' : undefined }}>{text}</b>;

export const Tdm52_Edit_ChckManlBatch: React.FC<Props> = ({ ids, onDone, onClose }) => {
  const [checkDate, setCheckDate] = useState<Dayjs | null>(dayjs());
  const [resultCode, setResultCode] = useState<string | undefined>(undefined);
  const [resultName, setResultName] = useState('');
  const [cmnt, setCmnt] = useState('');
  const [busy, setBusy] = useState(false);
  const [tmpFileParentId, setTmpFileParentId] = useState<number | null>(null);
  const [fileCountStr, setFileCountStr] = useState('0건');
  const [evidOpen, setEvidOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L51-58, open() L60-75) → settings(): 점검일자 = 오늘, 나머지는 빈 값
  useEffect(() => {
    if (!ids) return;
    setCheckDate(dayjs());
    setResultCode(undefined);
    setResultName('');
    setCmnt('');
  }, [ids]);

  // getTmpFileParentId() L77-87: getSeq → tmpFileParentId, 그 뒤 show()
  useEffect(() => {
    setTmpFileParentId(null);
    setFileCountStr('0건');
    setEvidOpen(false);
    if (!ids) return;
    let alive = true;
    tdmApi.createCheckManlTmpFileParent()
      .then(id => { if (alive) setTmpFileParentId(id); })
      .catch(err => { message.error(errorMessage(err, '조회 실패')); onClose(); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  // [E1] fileButton[증빙자료(0건)].Select (L100) → lookupFile() L189-206: Tdm00_Lookup_RelateAppr.open("tdm52", tmpFileParentId, callback → getFileCountStr → 버튼 글자)
  const lookupFile = () => setEvidOpen(true);
  const onEvidChanged = () => {
    if (tmpFileParentId == null) return;
    tdmApi.getCheckManlFileCountStr(tmpFileParentId).then(setFileCountStr).catch(err => message.error(errorMessage(err, '조회 실패')));
  };

  // close() L208-225: tdm.Tdm52_ChckManl.deleteTmpFile(임시 증빙 제거) → 성공이면 hide(), 아니면 "임시파일 삭제중 오류발생"
  const close = async () => {
    if (tmpFileParentId == null) { onClose(); return; }
    try {
      await tdmApi.deleteCheckManlTmpFileParent(tmpFileParentId);
    } catch {
      message.info('임시파일 삭제중 오류발생');
      return;
    }
    onClose();
  };

  // [E2] completeButton[점검완료].Select (L107) → update() L146-187: tdm.Tdm52_ChckManl.batchCheckComplete
  const update = async () => {
    if (!ids) return;
    if (!checkDate) { message.warning('점검일자를 선택하세요'); return; }
    if (!resultCode) { message.warning('점검결과를 선택하세요'); return; }
    setBusy(true);
    try {
      await tdmApi.batchCompleteCheckManls({
        chckManlIds: ids, checkDate: checkDate.format('YYYY-MM-DD'), checkResultCode: resultCode, checkResultName: resultName, checkCmnt: cmnt || null, tmpFileParentId,
      });
    } catch (err) {
      message.info(errorMessage(err, '처리 실패'));
      return;
    } finally {
      setBusy(false);
    }
    message.info('점검이 완료되었습니다');
    onDone();
    await close();
  };

  return (
    <EditModal
      open={!!ids && tmpFileParentId != null}
      title={<b>일괄점검처리</b>}
      width={650}
      keyboard={false}
      closable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="attach" style={{ width: 150 }} onClick={lookupFile}>{`증빙자료(${fileCountStr})`}</Button>
            <Button type="save" disabled={busy} onClick={update}>점검완료</Button>
            {/* [E3] closeButton[닫기].Select (L113) → close() L208-225 */}
            <Button type="close" onClick={() => void close()}>닫기</Button>
          </Space>
        </div>
      }
    >
      <EditField label={lb('점검일자', true)} labelWidth={70}><DatePicker style={{ width: 270 }} format={DATE_FORMAT} value={checkDate} onChange={setCheckDate} /></EditField>
      <EditField label={lb('점검결과', true)} labelWidth={70}>
        {/* CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", TdmCheckResult0003) */}
        <SystemCodeComboBox kindGroupCd="TdmCheckResult0003" style={{ width: 270 }} placeholder="선택하세요" allowClear={false}
          value={resultCode} onChange={(code, name) => { setResultCode(code); setResultName(name ?? ''); }} />
      </EditField>
      <EditField label={lb('점검의견')} labelWidth={70}><Input.TextArea style={{ height: 200, resize: 'none' }} value={cmnt} onChange={e => setCmnt(e.target.value)} /></EditField>
      <Tdm00_Lookup_RelateAppr open={evidOpen && tmpFileParentId != null} keyTable="tdm52" keyTableId={tmpFileParentId} onChanged={onEvidChanged} onClose={() => setEvidOpen(false)} />
    </EditModal>
  );
};
