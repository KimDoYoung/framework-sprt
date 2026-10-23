/**
 * 의견 창 (M05 의견 아이콘 / M06 의견 아이콘) — AS-IS: myApp/client/vi/ics/Ics40_Edit_Msg.java (154줄, 다른 도메인 apr도 쓴다)
 * 생성자 L78-91: 모달 550×520 "의견"(닫기 X 없음), [저장][닫기]. getEditor L111-129: 준감인 의견 / 신청인 의견 (각 500×200 텍스트 영역, 라벨 110)
 *   · editConfirmMsg L54-63 (M05): 준감인 의견만 고친다(신청인 의견 비활성) — [저장] → update() L131-145 → 서버 ics.Ics40_DcrPreconfirm.modelUpdate → callback → hide
 *   · show L65-76 (M06): 두 칸 모두 읽기 전용, [저장] 비활성
 * 이벤트: [E1] updateButton[저장] (L94) → update() / [E2] closeButton[닫기] (L100) callback != null이면 callback.execute() 뒤 hide()
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Button } from '@/components/button';
import { errorMessage } from '@/api/client';
import { icsApi } from '@/api/ics';
import { IcsDcrPreconfirm } from '@/types/ics';

export interface Ics40_Edit_MsgTarget {
  row: IcsDcrPreconfirm;
  /** 'edit' = editConfirmMsg(M05, 준감인 의견 수정) / 'view' = show(M06, 읽기 전용) */
  mode: 'edit' | 'view';
}

interface Props {
  target: Ics40_Edit_MsgTarget | null;
  /** AS-IS callback.execute() — 저장·닫기 뒤 부르는 쪽이 다시 조회한다(edit 모드만) */
  onCallback?: () => void;
  onClose: () => void;
}

const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 8 };
const labelStyle: React.CSSProperties = { width: 110, flex: 'none', textAlign: 'right', fontWeight: 'bold', paddingTop: 4 };

export const Ics40_Edit_Msg: React.FC<Props> = ({ target, onCallback, onClose }) => {
  const [confirmMsg, setConfirmMsg] = useState('');
  const [regEmpMsg, setRegEmpMsg] = useState('');
  const edit = target?.mode === 'edit';

  // [E0] 화면 열림 (생성자 L78-91) → settings(), show() — 열 때 두 의견을 채운다
  useEffect(() => {
    if (target) {
      setConfirmMsg(target.row.confirmMsg ?? '');
      setRegEmpMsg(target.row.regEmpMsg ?? '');
    }
  }, [target]);

  // [E1] updateButton[저장].Select (L94) → update() L131-145
  const update = async () => {
    if (!target) return;
    try {
      await icsApi.updateDcrPreconfirmConfirmMsg(target.row.dcrPreconfirmId, confirmMsg === '' ? null : confirmMsg);
      onCallback?.();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E2] closeButton[닫기].Select [callback != null] (L100) → callback.execute(), hide()
  const close = () => {
    if (edit) onCallback?.();
    onClose();
  };

  return (
    <LookupModal open={!!target} title="의견" width={550} closable={false} maskClosable={false} keyboard={false} onCancel={close} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" disabled={!edit} onClick={update}>저장</Button>
            <Button type="close" onClick={close}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '15px 10px' }}>
        <div style={rowStyle}>
          <div style={labelStyle}>준감인 의견</div>
          <Input.TextArea style={{ width: 500, height: 200, resize: 'none' }} value={confirmMsg} readOnly={!edit} onChange={e => setConfirmMsg(e.target.value)} />
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>신청인 의견</div>
          <Input.TextArea style={{ width: 500, height: 200, resize: 'none' }} value={regEmpMsg} readOnly disabled={edit} />
        </div>
      </div>
    </LookupModal>
  );
};
