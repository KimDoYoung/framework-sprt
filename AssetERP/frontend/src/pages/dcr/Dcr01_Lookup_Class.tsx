/**
 * 문서분류 확인 창 (W05 ⓒ) — [신규문서 작성]에서 문서분류를 정한다 (연관문서 창 Act80_Lookup_RelateAppr)
 * AS-IS: myApp/client/vi/dcr/Dcr01_Lookup_Class.java (119줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L71-105: 620×150 모달 "문서분류", 읽기 전용 칸(빈칸="선택해주세요", 600) + 트리거 → Dcr30_Move_DcrClass(일반 사용자 열기), 푸터 [확인][닫기]
 * open(classTreeId, defaultModel, callback) L36-69: classTreeId가 있으면 dcr.Dcr01_ClassTree.selectById로 이름을 채운다
 */
import React, { useEffect, useState } from 'react';
import { message, Space } from 'antd';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';

export interface Dcr01ClassResult {
  classTreeId: number;
  classTreeFullName: string;
}

interface Props {
  /** 값이 true인 동안 열려 있다 */
  open: boolean;
  /** open(classTreeId, …)의 classTreeId — 있으면 그 분류로 채워 연다 */
  classTreeId?: number | null;
  /** [확인]의 callback.execute(classTreeModel) */
  onResult: (result: Dcr01ClassResult) => void;
  onClose: () => void;
}

export const Dcr01_Lookup_Class: React.FC<Props> = ({ open, classTreeId, onResult, onClose }) => {
  const [picked, setPicked] = useState<Dcr01ClassResult | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L71-105 → show(), open L36-69): classTreeId가 있으면 dcr.Dcr01_ClassTree.selectById → classTreeFullName, 없으면 classTreeModel = null
  useEffect(() => {
    if (!open) return;
    setPicked(null);
    if (classTreeId == null) return;
    dcrApi.searchClassTree('%')
      .then(list => {
        const byId = new Map(list.map(r => [r.classTreeId, r]));
        const names: string[] = [];
        let cur = byId.get(classTreeId);
        while (cur) { names.unshift(cur.classTreeName); cur = byId.get(cur.parentTreeId); }
        if (names.length > 0) setPicked({ classTreeId, classTreeFullName: names.join('/') });
      })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open, classTreeId]);

  // [E2] updateButton[확인].Select (L79) → update() L107-114: 고른 것이 없으면 "문서분류를 선택해주세요", 있으면 callback.execute(classTreeModel) 뒤 hide()
  const update = () => {
    if (picked == null) { message.warning('문서분류를 선택해주세요'); return; }
    onResult(picked);
    onClose();
  };

  return (
    <>
      <LookupModal
        open={open}
        title="문서분류"
        width={680}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update}>확인</Button>
              {/* [E3] cancleButton[닫기].Select (L85) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ padding: '12px 2px' }}>
          {/* [E1] classTreeFullName.TriggerClick (L39) → Dcr30_Move_DcrClass.open(defaultModel, cb): 일반 사용자 열기(authCheck) → 고른 분류의 전체 이름을 채운다 */}
          <LookupInput
            width={640}
            value={picked?.classTreeFullName ?? ''}
            placeholder="선택해주세요"
            onOpen={() => setLookupOpen(true)}
          />
        </div>
      </LookupModal>
      <Dcr30_Move_DcrClass
        open={lookupOpen}
        authCheck
        onResult={r => {
          if (r.classTreeId != null && r.classTreeFullName != null) setPicked({ classTreeId: r.classTreeId, classTreeFullName: r.classTreeFullName });
        }}
        onClose={() => setLookupOpen(false)}
      />
    </>
  );
};
