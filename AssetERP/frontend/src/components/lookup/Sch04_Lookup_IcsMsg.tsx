/**
 * 처리결과 및 확인 (H06) — 법규보고 점검의 [처리결과] 아이콘이 연다. actionType 2(확인자 확인처리)는 관리자용 Sch04_Tab_IcsListManager(H12)가 쓴다
 * AS-IS: myApp/client/vi/sch/Sch04_Lookup_IcsMsg.java (205줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L150-169: 모달 550×380 "처리결과 및 확인", 닫기(X) 없음, 라벨 폭 110, 처리결과 480×200 · 확인자/확인일자 240씩(읽기 전용), 아래 가운데 버튼
 * 버튼: actionType 1(처리자 처리결과입력) = [저장][닫기], 2(확인자 확인처리) = [확인][확인취소][닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Typography, Space } from 'antd';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { Sch04List } from '@/types/sch';
import { Button } from '@/components/button';
import { LookupModal } from './LookupModal';

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography.Text strong style={{ width: 110, flex: 'none', paddingTop: 4 }}>{children}</Typography.Text>
);

interface Props {
  /** open(actionType, schModel, callback) L60-84 — 값이 있으면 열린다 */
  row: Sch04List | null;
  /** 1: 처리자 처리결과입력 / 2: 확인자 확인처리 */
  actionType: '1' | '2';
  /** update()가 서버에서 다시 읽은 한 행을 돌려줄 때마다 (AS-IS callback.execute(schModel)) */
  onResult: (row: Sch04List) => void;
  onClose: () => void;
}

export const Sch04_Lookup_IcsMsg: React.FC<Props> = ({ row, actionType, onResult, onClose }) => {
  const [model, setModel] = useState<Sch04List | null>(null);
  const [note, setNote] = useState('');

  // open() L60-84: editDriver.edit(schModel) — 열릴 때마다 그 행으로 폼을 채운다
  useEffect(() => {
    setModel(row);
    setNote(row?.note ?? '');
  }, [row]);

  // [E1] updateButton[저장].Select (L92) → update("U") / [E2] confirmButton[확인].Select (L98) → update("P") / [E3] cancelButton[확인취소].Select (L104) → update("C")
  // update() L171-197: sch.Sch04_List.updateConfirm → 돌아온 행으로 폼을 다시 채우고 setEnable(), "U"면 "저장이 완료되었습니다", callback
  const update = async (type: 'U' | 'P' | 'C') => {
    if (!model) return;
    try {
      const saved = await schApi.updateIcsListResult(model.listId, type, note);
      setModel(saved);
      setNote(saved.note ?? '');
      if (type === 'U') message.info('저장이 완료되었습니다');
      onResult(saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // setEnable() L118-148
  const confirmed = !!model?.confirmYn;
  const done = ['1', '2', '5'].includes(model?.statusCode ?? '');
  const saveDisabled = confirmed;
  const confirmDisabled = !(done && !confirmed);
  const cancelDisabled = !(done && confirmed);

  return (
    <LookupModal
      open={row != null}
      title="처리결과 및 확인"
      width={550}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {actionType === '1' && <Button type="save" disabled={saveDisabled} onClick={() => update('U')}>저장</Button>}
            {actionType === '2' && <Button type="save" disabled={confirmDisabled} onClick={() => update('P')}>확인</Button>}
            {actionType === '2' && <Button type="cancel" disabled={cancelDisabled} onClick={() => update('C')}>확인취소</Button>}
            {/* [E4] closeButton[닫기].Select (L110) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L51-58) → 모달·크기·제목. open()이 폼을 채운다 */}
      <div style={{ padding: '20px 15px 10px 5px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Label>처리결과 </Label>
          <Input.TextArea
            style={{ width: 480, height: 200, resize: 'none' }}
            readOnly={actionType === '2'}
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: 30 }}>
          <div style={{ display: 'flex', width: 240 }}>
            <Label>확인자 </Label>
            <Input readOnly style={{ width: 120 }} value={model?.confirmerName ?? ''} />
          </div>
          <div style={{ display: 'flex', width: 240 }}>
            <Label>확인일자 </Label>
            <Input readOnly style={{ width: 120 }} value={model?.confirmDate ?? ''} />
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
