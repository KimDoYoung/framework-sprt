/**
 * 전년도분 보수총액 등록 창 (S26) — Pay31_TabPage_InsureApply3 [생성]이 연다. 편집창 규격(11 §4a, 03 원칙 16)
 * AS-IS: myApp/client/vi/pay/Pay31_Lookup_Insert3.java (212줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(yearText, callback) L63-95: 300×200 모달 "전년도분 보수총액 등록" — 라디오 [전체생성](기본) / [개별생성] + 사원 칸(개별생성일 때만) + 아래 가운데 [생성][닫기]
 * [E3] insertButton[생성].Select (L141) → insertCheck() L156-180: 개별생성인데 사원이 없으면 "사원을 선택해주세요" → 확인(550) "기본 생성내역이 있는 경우 삭제 후 생성됩니다. 진행하시겠습니까?" [YES]
 *   → insert() L182-203: pay.Pay31_InsureApply.insert3(신고일 = (기준년도+1)-04-01) — 실패면 서버 문구, 성공이면 callback.execute() + hide()
 * [E4] closeButton[닫기].Select (L147) → callback.execute() + hide() (닫아도 목록을 다시 읽는다)
 */
import React, { useEffect, useState } from 'react';
import { Modal, message, Radio, Space } from 'antd';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

interface Props {
  /** open(yearText, callback) — 기준년도(값이 있으면 열린다) */
  year: string | null;
  /** 생성에 성공한 뒤, 또는 [닫기] (AS-IS callback.execute()) */
  onDone: () => void;
  onClose: () => void;
}

export const Pay31_Lookup_Insert3: React.FC<Props> = ({ year, onDone, onClose }) => {
  const [allYn, setAllYn] = useState(true);
  const [person, setPerson] = useState<{ id: number; name: string } | null>(null);
  const [personOpen, setPersonOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // [E0] 화면 열림 (open L63-95) → settings(): 전체생성, 사원 칸 비활성
  useEffect(() => {
    if (year != null) { setAllYn(true); setPerson(null); }
  }, [year]);

  // [E1] toggle.ValueChange (L109): 전체생성이면 사원을 비우고 막고, 개별생성이면 쓴다
  const onToggle = (all: boolean) => { setAllYn(all); if (all) setPerson(null); };

  // [E3] insertButton[생성].Select (L141) → insertCheck() L156-180
  const insertCheck = () => {
    if (!allYn && person == null) return message.warning('사원을 선택해주세요');
    Modal.confirm({
      title: '확인',
      content: '기본 생성내역이 있는 경우 삭제 후 생성됩니다. 진행하시겠습니까?',
      width: 550,
      okText: '예',
      cancelText: '아니오',
      onOk: () => insert(),
    });
  };

  // [E5] msgBox.DialogHide [YES] (L164) → insert() L182-203
  const insert = async () => {
    if (year == null) return;
    setSaving(true);
    try {
      await payApi.createInsurePreYear({ personId: person?.id ?? null, allYn, year });
      onDone();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    } finally {
      setSaving(false);
    }
  };

  // [E2] personName.TriggerClick (L127) → Emp00_Lookup_SelectSingle: 고른 사원의 ID·이름
  const onPersonPicked = (row: TransInfo | null) => {
    setPersonOpen(false);
    if (row) setPerson({ id: row.personId, name: row.korNm ?? '' });
  };

  return (
    <Modal
      open={year != null}
      title="전년도분 보수총액 등록"
      width={300}
      maskClosable={false}
      destroyOnHidden
      onCancel={onClose}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="generate" onClick={insertCheck} loading={saving}>생성</Button>
            <Button type="close" onClick={() => { onDone(); onClose(); }}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 2px' }}>
        <Radio.Group value={allYn} onChange={e => onToggle(e.target.value)} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Radio value={true}>전체생성</Radio>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio value={false}>개별생성</Radio>
            <LookupInput value={person?.name ?? ''} width={150} disabled={allYn} onOpen={() => setPersonOpen(true)} />
          </div>
        </Radio.Group>
      </div>
      <Emp00_Lookup_SelectSingle open={personOpen} separateAddTitle transDate={dayjs().format('YYYY-MM-DD')} onResult={onPersonPicked} onClose={() => setPersonOpen(false)} />
    </Modal>
  );
};
