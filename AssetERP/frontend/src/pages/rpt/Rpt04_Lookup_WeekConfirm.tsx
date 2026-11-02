/**
 * 주간업무보고 확인 창 (Z12) — Rpt04_Tab_WeekConfirm의 [주간업무보기] 칸에서 연다
 * AS-IS: myApp/client/vi/rpt/Rpt04_Lookup_WeekConfirm.java (316줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L63-121: 1300×880 모달(닫기 X 없음), 위 = RD 미리보기(mrd Rpt04_Rd_WeekConfirm), 가운데 줄 = 확인자(읽기 전용 450) + [확인][확인취소], 아래 = 확인자 메모(높이 80), 아래 가운데 [저장][닫기]
 * RD: 주소는 Rpt04_Tab_WeekConfirm.lookUpRd가 sys99_print를 채운 뒤 발급해 `url`로 넘긴다(docs/RD-대책.md)
 * 편집창 규격(11 §4a): 머리말 아래 선 · 푸터 위 선 · 라벨 오른쪽 정렬
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Space, Typography } from 'antd';
import { rptWeekApi, rptWeekConfirmApi } from '@/api/rpt';
import { errorMessage } from '@/api/client';
import { RptWeekConfirm } from '@/types/rpt';
import { Button } from '@/components/button';
import { useLoginUser } from '@/hooks/useLoginUser';

interface Props {
  /** 확인할 보고(그리드 선택 행) — null이면 닫힘 */
  model: RptWeekConfirm | null;
  /** RD 미리보기 주소 */
  url: string | null;
  /** AS-IS callBack.execute() → 탭 retrieve() (닫기·제출 취소된 보고 안내 뒤) */
  onClose: () => void;
  /** 저장 뒤 callBack.execute() (창은 그대로 둔다) */
  onChanged: () => void;
}

/** 라벨 폭 75 */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
    <Typography.Text style={{ width: 75, flex: 'none', lineHeight: '32px', textAlign: 'right', paddingRight: 10 }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Rpt04_Lookup_WeekConfirm: React.FC<Props> = ({ model, url, onClose, onChanged }) => {
  const user = useLoginUser();
  const [confirmNote, setConfirmNote] = useState('');
  const [confirmPerson, setConfirmPerson] = useState('');

  // open() L124-155: 확인자 메모 · 확인자 칸("부서 이름 (일시)", 확인자가 없으면 빈칸) · RD
  useEffect(() => {
    if (!model) return;
    setConfirmNote(model.confirmNote ?? '');
    setConfirmPerson(model.confirmerId != null ? `${model.confirmerOrgName ?? ''} ${model.confirmer ?? ''} (${model.confirmDateStr ?? ''})` : '');
  }, [model]);
  if (!model) return null;

  // retrieve() L157-178: rpt.Rpt04_WeekConfirm.selectByConfirmerId(내가 확인한 기록) → 확인자 칸
  const retrieve = async () => {
    try {
      const r = await rptWeekConfirmApi.getMyConfirm(model.personId, model.weekStartDate);
      setConfirmPerson(r ? `${r.confirmerOrgName ?? ''} ${r.confirmerName ?? ''} (${r.confirmDateStr ?? ''})` : '');
    } catch {
      setConfirmPerson('');
    }
  };

  // [E1] closeButton[닫기].Select (L73) → hide(), callBack.execute()
  const hide = () => onClose();

  // fixCheck(action) L247-280: 로그인 사원 자신의 주간업무 제출여부(rpt.Rpt03_Week.selectByStartDate, personId = 로그인 사원) — 제출이 아니면 안내 뒤 창을 닫는다
  const fixCheck = async (action: () => Promise<void>) => {
    try {
      const st = await rptWeekApi.getState(model.weekStartDate, model.weekCloseDate);
      if (st.fixYn) {
        await action();
      } else {
        message.warning('제출 취소된 보고입니다. 다시 확인해주세요.');
        hide();
      }
    } catch (err) {
      message.error(errorMessage(err, '상태 확인 실패'));
    }
  };

  // confirmCheck(action) L282-307: rpt.Rpt04_WeekConfirm.selectByCompanyId(personId = 로그인 사원) — 확인자가 없으면 fixCheck, 있으면 "이미 확인처리되었습니다."
  const confirmCheck = async (action: () => Promise<void>) => {
    try {
      const st = await rptWeekApi.getState(model.weekStartDate, model.weekCloseDate);
      if (st.confirmerId == null) {
        await fixCheck(action);
      } else {
        message.warning('이미 확인처리되었습니다.');
      }
    } catch (err) {
      message.error(errorMessage(err, '상태 확인 실패'));
    }
  };

  // update() L180-200: 확인자가 다른 사람이면 안내, 아니면 rpt.Rpt04_WeekConfirm.updateNote → "저장되었습니다." → callBack.execute()
  const update = async () => {
    if (model.confirmerId != null && model.confirmerId !== user.userId) {
      message.warning('확인자 본인만 삭제 및 수정이 가능합니다.');
      return;
    }
    try {
      await rptWeekConfirmApi.saveNote(model.personId, model.weekStartDate, confirmNote);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    message.success('저장되었습니다.');
    onChanged();
  };

  // confirmUpdate() L202-223: rpt.Rpt04_WeekConfirm.confirmUpdate → retrieve() → "확인 처리되었습니다."
  const confirmUpdate = async () => {
    if (model.confirmerId != null && model.confirmerId !== user.userId) {
      message.warning('확인자 본인만 삭제 및 수정이 가능합니다.');
      return;
    }
    try {
      await rptWeekConfirmApi.confirm(model.personId, model.weekStartDate);
    } catch (err) {
      message.error(errorMessage(err, '확인 실패'));
      return;
    }
    await retrieve();
    message.success('확인 처리되었습니다.');
  };

  // [E4] cancelButton[확인취소].Select (L97) → confirmCancel() L225-245: rpt.Rpt04_WeekConfirm.updateByPersonId → retrieve() → "취소 처리되었습니다."
  const confirmCancel = async () => {
    if (model.confirmerId != null && model.confirmerId !== user.userId) {
      message.warning('확인자 본인만 취소 및 수정이 가능합니다.');
      return;
    }
    try {
      await rptWeekConfirmApi.cancel(model.personId, model.weekStartDate, confirmNote);
    } catch (err) {
      message.error(errorMessage(err, '취소 실패'));
      return;
    }
    await retrieve();
    message.success('취소 처리되었습니다.');
  };

  return (
    <Modal
      open
      title="주간업무보고확인"
      width={1300}
      style={{ top: 20 }}
      maskClosable={false}
      closable={false}
      keyboard={false}
      destroyOnClose
      onCancel={hide}
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },  // EditModal 규격: 머리말 아래 선
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },  // 단추 줄 위 선
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] updateButton[저장].Select (L81) → fixCheck(), update() */}
            <Button type="save" onClick={() => fixCheck(update)}>저장</Button>
            {/* [E1] closeButton[닫기].Select (L73) → hide(), callBack.execute() */}
            <Button type="close" onClick={hide}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L63-121) → show() */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 2px' }}>
        {url && <iframe title="RD" src={url} style={{ width: '100%', height: 'calc(100vh - 380px)', minHeight: 300, border: '1px solid #d9d9d9' }} />}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Field label="확인자">
            <Input readOnly style={{ width: 450 }} value={confirmPerson} />
          </Field>
          {/* [E3] confirmButton[확인].Select (L89) → confirmCheck(), confirmUpdate() */}
          <Button type="save" onClick={() => confirmCheck(confirmUpdate)}>확인</Button>
          {/* [E4] cancelButton[확인취소].Select (L97) → confirmCancel() */}
          <Button type="cancel" onClick={confirmCancel}>확인취소</Button>
        </div>
        <Field label="확인자 메모"><Input.TextArea rows={3} value={confirmNote} onChange={e => setConfirmNote(e.target.value)} /></Field>
      </div>
    </Modal>
  );
};
