/**
 * 출장품의 편집창 (Y05) — Emp53_Tab_BizTrip의 [등록]·수정 아이콘에서 연다
 * AS-IS: myApp/client/vi/emp/Emp53_Lookup_BizTrip.java (272줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * insert() L82-97(새 행: 회사·사원·전체공유 true) → edit() L99-124: 모달 600×590 "출장품의", 아래 가운데 [저장][닫기].
 * getEditor() L179-230: 출장기간(시작 ~ 종료) · 출장구분 콤보(BizTripCode) + 출장인원 · 동반인 · 출장지 · 출장목적(큰 칸) · 비고 · 공유(☑전체공유 / + 공유대상).
 * update() L232-263: 출장기간·출장구분·출장지·출장목적 검사 → emp.Emp53_BizTrip.modelUpdate → callBack(모델), hide().
 * [닫기] L165-175: 새 행이면 목록에서 빼고 callBack(null), 고치던 행이면 callBack(모델)(부른 화면이 다시 조회).
 * 공유 칸(L146-157): 전체공유를 켜면 공유대상을 비우고 막는다. 공유대상 칸 → Emp56_Lookup_Share(출장 ID).
 * EditModal 규격(11 §4a): 머리 아래 선·푸터 위 선·라벨 오른쪽 정렬.
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empBizTripApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { MyBizTrip } from '@/types/emp';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp56_Lookup_Share } from './Emp56_Lookup_Share';

const LABEL = 90;
const FORMAT = 'YYYY-MM-DD';

interface Props {
  /** null이면 닫힘, 'NEW'면 새 출장, 행이면 그 출장을 고친다 */
  target: MyBizTrip | 'NEW' | null;
  /** callBack.execute(): 저장했거나(true) 고치던 행을 닫을 때(true) 부른 화면이 다시 조회한다. 새 행을 저장 없이 닫으면 false */
  onDone: (refresh: boolean) => void;
}

const Row: React.FC<{ label: string; children: React.ReactNode; top?: boolean }> = ({ label, children, top }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', gap: 8 }}>
    <span style={{ width: LABEL, textAlign: 'right', paddingRight: 10, flex: 'none', fontWeight: 'bold', paddingTop: top ? 5 : 0 }}>{label}</span>
    {children}
  </div>
);

export const Emp53_Lookup_BizTrip: React.FC<Props> = ({ target, onDone }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [closeDate, setCloseDate] = useState<Dayjs | null>(null);
  const [bizTripCode, setBizTripCode] = useState<string | undefined>(undefined);
  const [num, setNum] = useState('');
  const [companion, setCompanion] = useState('');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [note, setNote] = useState('');
  const [publicYn, setPublicYn] = useState(true);
  const [shareInfo, setShareInfo] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const isNew = target === 'NEW';
  const trip = target && target !== 'NEW' ? target : null;

  // [E0] 화면 열림 (생성자 L78-80) → insert() L82-97 / edit() L99-124: editDriver.edit(model)
  useEffect(() => {
    if (target == null) return;
    if (target === 'NEW') {
      setStartDate(null); setCloseDate(null); setBizTripCode(undefined); setNum(''); setCompanion(''); setDestination('');
      setPurpose(''); setNote(''); setPublicYn(true); setShareInfo('');
    } else {
      setStartDate(target.startDate ? dayjs(target.startDate) : null);
      setCloseDate(target.closeDate ? dayjs(target.closeDate) : null);
      setBizTripCode(target.bizTripCode ?? undefined);
      setNum(target.num ?? ''); setCompanion(target.companion ?? ''); setDestination(target.destination ?? '');
      setPurpose(target.purpose ?? ''); setNote(target.note ?? '');
      setPublicYn(target.publicYn); setShareInfo(target.publicYn ? '' : target.shareInfo ?? '');
    }
  }, [target]);

  // [E3] updateButton[저장].Select (L159) → update() L232-263
  const update = async () => {
    if (startDate == null || closeDate == null) { message.warning('출장기간은 필수작성 항목입니다'); return; }
    if (!bizTripCode) { message.warning('출장구분은 필수선택 항목입니다'); return; }
    if (!destination) { message.warning('출장지는 필수작성 항목입니다'); return; }
    if (!purpose) { message.warning('출장목적은 필수작성 항목입니다'); return; }
    const req = {
      startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), bizTripCode, destination, purpose,
      num: num || null, companion: companion || null, note: note || null, publicYn,
    };
    setSaving(true);
    try {
      if (trip) await empBizTripApi.update(trip.bizTripId, req);
      else await empBizTripApi.create(req);
      onDone(true);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E4] closeButton[닫기].Select ["NEW".equals(actionName)] (L165) → 새 행이면 callBack(null), 아니면 callBack(모델)
  const close = () => onDone(!isNew);

  // [E2] shareInfo[].TriggerClick (L146) → Emp56_Lookup_Share.open(bizTripId.getValue(), …)
  // 새 출장은 저장 전이라 출장 ID가 없다(AS-IS는 ID 없이 열어 공유 행이 부모 없이 저장됨) — 저장 뒤 공유 아이콘으로 지정한다
  const openShare = () => {
    if (!trip) { message.warning('저장 후 목록의 공유 아이콘에서 공유대상을 지정해주세요'); return; }
    setShareOpen(true);
  };

  return (
    <>
      <Modal
        open={target != null}
        title="출장품의"
        width={640}
        maskClosable={false}
        onCancel={close}
        destroyOnClose
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" loading={saving} onClick={update}>저장</Button>
              <Button type="close" onClick={close}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <Row label="출장기간">
            <DatePicker style={{ width: 140 }} value={startDate} onChange={setStartDate} />
            <span>~</span>
            <DatePicker style={{ width: 140 }} value={closeDate} onChange={setCloseDate} />
          </Row>
          <div style={{ display: 'flex', gap: 20 }}>
            <Row label="출장구분">
              <SystemCodeComboBox kindCd="BizTripCode" style={{ width: 140 }} value={bizTripCode} onChange={c => setBizTripCode(c ?? undefined)} />
            </Row>
            <Row label="출장인원">
              <Input style={{ width: 120 }} maxLength={10} value={num} onChange={e => setNum(e.target.value)} />
            </Row>
          </div>
          <Row label="동반인">
            <Input style={{ width: 460 }} maxLength={100} value={companion} onChange={e => setCompanion(e.target.value)} />
          </Row>
          <Row label="출장지">
            <Input style={{ width: 460 }} maxLength={100} value={destination} onChange={e => setDestination(e.target.value)} />
          </Row>
          <Row label="출장목적" top>
            <Input.TextArea style={{ width: 460 }} rows={5} value={purpose} onChange={e => setPurpose(e.target.value)} />
          </Row>
          <Row label="비고" top>
            <Input.TextArea style={{ width: 460 }} rows={3} value={note} onChange={e => setNote(e.target.value)} />
          </Row>
          <Row label="공유">
            {/* [E1] publicYn[공유].ValueChange (L128) → 켜면 공유대상 비우고 막음 */}
            <Checkbox checked={publicYn} onChange={e => { setPublicYn(e.target.checked); if (e.target.checked) setShareInfo(''); }}>전체공유 /</Checkbox>
            <LookupInput value={shareInfo} width={280} disabled={publicYn} onOpen={openShare} />
          </Row>
        </div>
      </Modal>
      <Emp56_Lookup_Share parentId={shareOpen && trip ? trip.bizTripId : null} onResult={setShareInfo} onClose={() => setShareOpen(false)} />
    </>
  );
};
