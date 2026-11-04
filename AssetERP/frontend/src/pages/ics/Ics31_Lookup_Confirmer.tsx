/**
 * 확인자 선택창 (EE75) — 내부통제 준수확인서 작성(Ics31_Tab_ComplianceWrite)의 [제출]이 연다
 * AS-IS: myApp/client/vi/ics/Ics31_Lookup_Confirmer.java (150줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L44-56: 400×180 모달 "확인자 선택", 한 줄 [확인자 (조회창 입력칸 200, 편집 불가, "선택하세요")] + [확인][닫기]
 * open(stdDate, callback) L58-63: 기본 확인자를 읽어 채운다(setComfirmId L121: ics.Ics30_Compliance.selectConfirmer → 이전 확인자 → 부서장 → 준법감시인)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { icsApi } from '@/api/ics';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectSingle } from '@/components/lookup/Emp00_Lookup_SelectSingle';

interface Props {
  open: boolean;
  /** 기준 분기(월)의 말일 'yyyy-MM-dd' (AS-IS getDate()) */
  stdDate: string;
  /** AS-IS callback.execute(personId): [확인]이면 고른 확인자. 닫기는 이 창이 onClose로 한다 */
  onResult: (confirmerId: number) => void;
  onClose: () => void;
}

export const Ics31_Lookup_Confirmer: React.FC<Props> = ({ open, stdDate, onResult, onClose }) => {
  const [empName, setEmpName] = useState<string | null>(null);
  const [personId, setPersonId] = useState<number | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);

  // [E0] 화면 열림 → settings(), setComfirmId() L121-138: 기본 확인자 (status 1이면 값, 아니면 비움)
  useEffect(() => {
    if (!open) return;
    setEmpName(null);
    setPersonId(null);
    icsApi.getComplianceConfirmer(stdDate)
      .then(r => { setEmpName(r.confirmerName ?? null); setPersonId(r.confirmerId ?? null); })
      .catch(err => message.error(errorMessage(err, '확인자를 읽지 못했습니다')));
  }, [open, stdDate]);

  // [E2] confirmButton[확인].Select (L89): 고른 확인자가 없으면 "확인자를 선택하세요", 있으면 callback(personId) + hide()
  const confirm = () => {
    if (personId == null) { message.warning('확인자를 선택하세요'); return; }
    onResult(personId);
    onClose();
  };

  return (
    <>
      <LookupModal
        open={open}
        title="확인자 선택"
        width={400}
        maskClosable={false}
        onCancel={onClose}
        focusFirst={false}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={confirm}>확인</Button>
              {/* [E3] closeButton[닫기].Select (L100) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 2px 8px' }}>
          <span style={{ width: 80, textAlign: 'right', paddingRight: 10, fontSize: 12, fontWeight: 'bold' }}>확인자</span>
          {/* [E1] empName[확인자].TriggerClick (L69) → Emp00_Lookup_SelectSingle.open(오늘, "One") — [전체] 단추가 없는 열기 */}
          <Input readOnly style={{ width: 200, cursor: 'pointer' }} placeholder="선택하세요" value={empName ?? ''}
            suffix={<SearchOutlined />} onClick={() => setLookupOpen(true)} />
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectSingle
        open={lookupOpen}
        transDate={dayjs().format('YYYY-MM-DD')}
        noneLabel={null}
        onResult={row => {
          setEmpName(row ? (row.korNm ?? null) : null);
          setPersonId(row ? row.personId : null);
          setLookupOpen(false);
        }}
        onClose={() => setLookupOpen(false)}
      />
    </>
  );
};
