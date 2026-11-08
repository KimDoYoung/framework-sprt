/**
 * 문자발송 창 (V04) — 댓글 창의 [알림발송]이 연다(다른 도메인 tdm도 쓴다).
 * AS-IS: myApp/client/vi/sms/Sms03_Lookup_SendList.java (235줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L68-94: 560×650 모달 "문자발송", 위 오른쪽 [추가][초기화], 그리드(조직 160 · 직책 100 · 사번 80 · 성명 80 · 삭제 70), 아래 글(MyTextArea 100), 푸터 [발송][취소]
 * 원본 그대로인 것: [추가]로 넣은 사원은 조직 칸이 비어 있다(Emp00_TransInfoModel의 orgKorName에 넣지만 그리드는 orgTitleName을 보여 준다) — 이상한점 #27.
 * 스타일: MFG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import dayjs from 'dayjs';
import { smsApi } from '@/api/sms';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

interface Row {
  /** 같은 사원이 두 번 들어갈 수 있어(AS-IS GridInsertRow) 행마다 번호를 둔다 */
  rowKey: number;
  personId: number;
  orgTitleName: string | null;
  titleName: string | null;
  empNo: string | null;
  empKorName: string | null;
}

const gb = gbFor<Row>();

interface Props {
  /** AS-IS open(personIdList, message) — 값이 있으면 열린다 */
  target: { personIds: number[]; message: string } | null;
  onClose: () => void;
}

export const Sms03_Lookup_SendList: React.FC<Props> = ({ target, onClose }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const seq = useRef(0);

  // retrieve() L165-178: 서비스 emp.Emp00_TransInfo.selectByList(companyId, personIdList)
  const retrieve = useCallback(async () => {
    if (target == null) return;
    setLoading(true);
    try {
      const list = await smsApi.searchSendTargets(target.personIds);
      setRows(list.map(r => ({ ...r, rowKey: ++seq.current })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [target]);

  // open() L62-66: 글을 채우고 조회
  useEffect(() => {
    if (target == null) { setRows([]); setText(''); return; }
    setText(target.message);
    void retrieve();
  }, [target, retrieve]);

  // [E2] insertButton[추가].Select [list != null] (L103) → Emp00_Lookup_SelectMulti.open(오늘) → 고른 사원마다 GridInsertRow (맨 아래, 03 원칙 17)
  const onPick = (list: { personId: number; titleNm?: string | null; empNo?: string | null; korNm?: string | null }[]) => {
    setLookupOpen(false);
    setRows(prev => [...prev, ...list.map(m => ({
      rowKey: ++seq.current, personId: m.personId, orgTitleName: null, titleName: m.titleNm ?? null, empNo: m.empNo ?? null, empKorName: m.korNm ?? null,
    }))]);
  };

  // [E3] sendButton[발송].Select (L134) → sendCheck() L180-199 → [E5] msgBox.DialogHide [YES] (L183) → sendMessage() L201-230
  const sendCheck = () => {
    Modal.confirm({
      title: '확인',
      content: `선택한${rows.length}명 사원들에게 알림을 발송하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          await smsApi.sendList(rows.map(r => r.personId), text);
          Modal.info({ title: '확인', content: '발송이 완료되었습니다', okText: '확인' });
        } catch (err) {
          Modal.info({ title: '확인', content: errorMessage(err, '발송 실패'), okText: '확인' });
        }
      },
    });
  };

  // buildGrid() L148-163
  const columnDefs = useMemo(() => [
    gb.text('orgTitleName', 160, '조직'),  // L155
    gb.text('titleName', 100, '직책'),  // L156
    gb.text('empNo', 80, '사번'),  // L157
    gb.text('empKorName', 80, '성명'),  // L158
    // L150 deleteButton → grid.getStore().remove(선택된 행) — 누른 줄을 지운다(이상한점 #21과 같은 처리)
    iconCell<Row>('delete', 'deleteCell', 70, '삭제', row => setRows(prev => prev.filter(r => r.rowKey !== row.rowKey))),
  ], []);

  return (
    <>
      <LookupModal
        open={target != null}
        title="문자발송"
        width={660}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <Button type="send" onClick={sendCheck}>발송</Button>
            {/* [E4] closeButton[취소].Select (L140) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button type="register" onClick={() => setLookupOpen(true)}>추가</Button>
            {/* [E1] retrieveButton[초기화].Select (L97) → retrieve() */}
            <Button type="reset" onClick={retrieve}>초기화</Button>
          </div>
          <div style={{ height: 'min(380px, calc(100vh - 380px))' }}>
            <SingleGrid<Row>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.rowKey)}
              loading={loading}
              rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            />
          </div>
          <Input.TextArea value={text} onChange={e => setText(e.target.value)} style={{ height: 100, resize: 'none' }} />
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectMulti
        open={lookupOpen && target != null}
        transDate={dayjs().format('YYYY-MM-DD')}
        onResult={onPick}
        onClose={() => setLookupOpen(false)}
      />
    </>
  );
};
