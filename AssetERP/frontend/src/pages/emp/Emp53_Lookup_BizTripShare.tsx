/**
 * 출장 공유정보 창 (Y05) — Emp53_Tab_BizTrip 그리드 맨 오른쪽 공유 아이콘에서 연다
 * AS-IS: myApp/client/vi/emp/Emp53_Lookup_BizTripShare.java (157줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L48-66: 모달 600×180 "공유정보", 한 줄 = ☑전체공유 / + 공유대상(읽기 전용 조회창 칸), 아래 가운데 [저장][닫기].
 * settings() L68-117: 전체공유를 켜면 공유대상 칸을 비우고 막는다. 칸을 누르면 Emp56_Lookup_Share(출장 ID) → 고른 공유명을 칸에 보인다.
 * update() L135-148: emp.Emp53_BizTrip.updateShareInfo(bizTripId, publicYn) → 목록 행을 바뀐 행으로 바꾸고 닫는다.
 * EditModal 규격(11 §4a): 머리 아래 선·푸터 위 선.
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, message, Modal, Space } from 'antd';
import { empBizTripApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { MyBizTrip } from '@/types/emp';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp56_Lookup_Share } from './Emp56_Lookup_Share';

interface Props {
  /** 고른 출장 행 — 값이 있으면 열린다 */
  trip: MyBizTrip | null;
  /** update() L144: 바뀐 행 */
  onUpdated: (row: MyBizTrip) => void;
  onClose: () => void;
}

export const Emp53_Lookup_BizTripShare: React.FC<Props> = ({ trip, onUpdated, onClose }) => {
  const [publicYn, setPublicYn] = useState(false);
  const [shareInfo, setShareInfo] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (생성자 L43-46) → open() L48-66
  // settings() L82-91: 전체공유면 공유대상 막기, 공유대상 글자 = 행의 shareInfo
  useEffect(() => {
    if (trip) { setPublicYn(trip.publicYn); setShareInfo(trip.shareInfo ?? ''); }
  }, [trip]);

  // [E3] updateButton[저장].Select (L105) → update() L135-148
  const update = async () => {
    if (!trip) return;
    setSaving(true);
    try {
      onUpdated(await empBizTripApi.updateShare(trip.bizTripId, publicYn));
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open={trip != null}
        title="공유정보"
        width={600}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" loading={saving} onClick={update}>저장</Button>
              {/* [E4] closeButton[닫기].Select (L111) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 2px 12px 30px' }}>
          {/* [E1] publicYn[전체공유 /].ValueChange (L70) → 켜면 공유대상 비우고 막음 */}
          <Checkbox checked={publicYn} onChange={e => { setPublicYn(e.target.checked); if (e.target.checked) setShareInfo(''); }}>전체공유 /</Checkbox>
          {/* [E2] shareInfo[].TriggerClick (L92) → Emp56_Lookup_Share.open(bizTripId, …) */}
          <LookupInput value={shareInfo} width={400} disabled={publicYn} onOpen={() => setShareOpen(true)} />
        </div>
      </Modal>
      <Emp56_Lookup_Share parentId={shareOpen && trip ? trip.bizTripId : null} onResult={setShareInfo} onClose={() => setShareOpen(false)} />
    </>
  );
};
