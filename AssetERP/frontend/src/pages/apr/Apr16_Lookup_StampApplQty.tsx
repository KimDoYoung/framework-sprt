/**
 * 날인신청 줄 추가 창 (V14) — 날인신청 탭의 [+] 메뉴(법인인감증명서/법인등기부등본/인감날인)가 연다. 저장하면 그 자리에서 apr16_stamp_doc에 넣는다.
 * AS-IS: myApp/client/vi/apr/Apr16_Lookup_StampApplQty.java (240줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L51-91: 550×200 모달 "법인인감증명서 추가"/"법인등기부등본 추가"/"인감날인 추가", 인감(대표명의) 트리거 칸 + 신청매수(날인부수) + (인감날인만) 반출여부, 푸터 [저장]
 * 편집창 규격(11 §4a): 머리 아래·푸터 위 선, 라벨 오른쪽 정렬, 본문 위아래 12.
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, InputNumber, message, Modal } from 'antd';
import { aprStampApplApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Apr10_Lookup_Stamp } from './Apr10_Lookup_Stamp';
import { Apr15_Lookup_ReprCorp } from './Apr15_Lookup_ReprCorp';

const LABEL: React.CSSProperties = { width: 90, flex: 'none', textAlign: 'right', paddingRight: 10, fontSize: 12, fontWeight: 'bold' };
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center' };
const TITLES: Record<string, string> = { '1': '법인인감증명서 추가', '2': '법인등기부등본 추가', '3': '인감날인 추가' };

interface Props {
  /** 값이 있으면 열린다 — new Apr16_Lookup_StampApplQty(applType, apprId) */
  applType: '1' | '2' | '3' | null;
  apprId: number;
  /** open(stampId, stampName, cb) — 문서의 인감 (법인인감증명서·인감날인의 처음 값) */
  stampId: number | null;
  stampName: string;
  /** update() L146-181 뒤 callback.execute(1) — 부른 쪽이 목록을 다시 읽는다 */
  onAdded: () => void;
  onClose: () => void;
}

export const Apr16_Lookup_StampApplQty: React.FC<Props> = ({ applType, apprId, stampId, stampName, onAdded, onClose }) => {
  const user = useLoginUser();
  const [name, setName] = useState('');
  const [id, setId] = useState<number | null>(null);
  const [qty, setQty] = useState<number | null>(1);
  const [outYn, setOutYn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pick, setPick] = useState(false);

  // open() L93-144: 1은 문서의 인감, 2는 회사 자신(법인), 3은 비어 있음. 매수는 1
  useEffect(() => {
    if (!applType) return;
    setQty(1); setOutYn(false); setPick(false);
    if (applType === '1') { setName(stampName); setId(stampId); }
    else if (applType === '2') { setName(user.companyName); setId(user.companyId); }
    else { setName(''); setId(null); }
  }, [applType, stampId, stampName, user.companyId, user.companyName]);

  const info = (content: string) => Modal.info({ title: '확인', content, okText: '확인' });

  // [E2] updateButton[저장].Select (L121): 인감(대표명의)·매수 검사 → update()
  const update = async () => {
    if (!applType) return;
    if (id == null) return info(applType === '2' ? '대표명의를 선택해주세요' : '인감을 선택해주세요');
    if (qty == null || qty === 0) return info(applType === '3' ? '날인부수를 입력해주세요' : '신청매수를 입력해주세요');
    setSaving(true);
    try {
      await aprStampApplApi.add(apprId, { applType, stampReprCorpId: id, qty, outYn: applType === '3' ? outYn : undefined });
      onAdded();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E1] stampReprCorpName[인감].TriggerClick (L108) → 2이면 lookupReprCorp() L183-198, 아니면 lookupStamp() L200-231
  const onStamp = (stamp: { stampId: number; stampName?: string | null } | null) => {
    setPick(false);
    if (!stamp) return;
    // 인감날인인데 문서에 대외문서 인감으로 등록된 인감이면 "추가 부수만" 안내 — [아니오]면 창을 닫는다 — [E3] messageBox.DialogHide (L211) → hide()
    if (applType === '3' && stamp.stampId === stampId) {
      Modal.confirm({
        title: '확인', width: 580, okText: '예', cancelText: '아니오',
        content: <span>선택한 인감은 대외문서 인감으로 등록되어 있습니다. 추가 부수만 등록해 주세요.<br />계속 진행하시겠습니까?</span>,
        onOk: () => { setName(stamp.stampName ?? ''); setId(stamp.stampId); },
        onCancel: onClose,
      });
      return;
    }
    setName(stamp.stampName ?? ''); setId(stamp.stampId);
  };

  return (
    <>
      <Modal
        open={applType != null}
        title={applType ? TITLES[applType] : ''}
        width={550}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 } }}
        footer={<div style={{ textAlign: 'center' }}><Button type="save" loading={saving} onClick={update}>저장</Button></div>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
          <div style={ROW}>
            <span style={LABEL}>{applType === '2' ? '대표명의' : '인감'}</span>
            <LookupInput value={name} empty={['']} placeholder="선택하세요" width={300} onOpen={() => setPick(true)} />
          </div>
          <div style={ROW}>
            <span style={LABEL}>{applType === '3' ? '날인부수' : '신청매수'}</span>
            <InputNumber style={{ width: 120 }} min={0} precision={0} value={qty} onChange={v => setQty(v)} />
            {applType === '3' && (
              <>
                <span style={{ ...LABEL, width: 100 }}>반출여부</span>
                <Checkbox checked={outYn} onChange={e => setOutYn(e.target.checked)} />
              </>
            )}
          </div>
        </div>
      </Modal>
      {/* lookupReprCorp: Apr15_Lookup_ReprCorp.open(true, cb) — 고르지 않으면 칸을 비운다 */}
      <Apr15_Lookup_ReprCorp
        open={pick && applType === '2'}
        companyAddYn
        onResult={r => { setPick(false); setName(r?.corpName ?? ''); setId(r?.reprCorpId ?? null); }}
        onClose={() => setPick(false)}
      />
      {/* lookupStamp: new Apr10_Lookup_Stamp(false, false) — 내 부서 소유 인감 포함 */}
      <Apr10_Lookup_Stamp
        open={pick && applType !== '2'}
        flag={false}
        checkflag={false}
        onResult={onStamp}
        onDelete={() => setPick(false)}
        onClose={() => setPick(false)}
      />
    </>
  );
};
