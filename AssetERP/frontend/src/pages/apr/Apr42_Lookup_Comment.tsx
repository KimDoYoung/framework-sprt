/**
 * 댓글 창 (V04) — 전자결재 문서창 머리의 [댓글(n)]이 연다.
 * AS-IS: myApp/client/vi/apr/Apr42_Lookup_Comment.java (269줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L85-101: 510×650 모달 "댓글 보기"(open L64-83), 위 오른쪽 [알림발송], 그리드(댓글 395 · 파일 50 · 삭제 25, 행 펼침 — 글이 모든 줄 아래에 펼쳐져 있다), 아래 글 입력(420×50) + [등 록]
 * 다른 점(12-화면우선원칙·사용자 설계): 행번호·펼침 단추 칸(GridExpandBuilder)은 두지 않고, 글은 처음부터 펼친 채 머리 아래 줄에 보인다.
 * 스타일: MFG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Modal } from 'antd';
import { aprCommentApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprComment } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { sanitizeHtml } from '@/components/grid/renderers';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Apr42_Lookup_FileList } from './Apr42_Lookup_FileList';
import { Sms03_Lookup_SendList } from '@/pages/sms/Sms03_Lookup_SendList';

const gb = gbFor<AprComment>();

interface Props {
  /** AS-IS open(apprModel, callback) — 값이 있으면 열린다 */
  apprId: number | null;
  /** 댓글을 등록했을 때·창을 닫을 때 (AS-IS callback.execute()) — 문서창의 댓글 건수를 다시 읽는다 */
  onChanged: () => void;
  onClose: () => void;
}

export const Apr42_Lookup_Comment: React.FC<Props> = ({ apprId, onChanged, onClose }) => {
  const user = useLoginUser();
  const [rows, setRows] = useState<AprComment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileTarget, setFileTarget] = useState<AprComment | null>(null);
  const [smsTarget, setSmsTarget] = useState<{ smsNoticeCode: string; personIds: number[]; message: string } | null>(null);

  // retrieve() L207-221: 서비스 apr.Apr42_Comment.selectByApprId(companyId, personId, apprId)
  const retrieve = useCallback(async () => {
    if (apprId == null) return;
    setLoading(true);
    try {
      setRows(await aprCommentApi.searchComments(apprId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [apprId]);

  // open() L64-83: 열리면 바로 조회
  useEffect(() => {
    if (apprId == null) { setRows([]); setText(''); return; }
    void retrieve();
  }, [apprId, retrieve]);

  // [E1] sendButton[알림발송].Select [선택>0] (L106) → 결재선 사원 getApprStepList() L150-171 + 문구 → Sms03_Lookup_SendList.open(personIdList, msg)
  const sendNotice = async () => {
    if (apprId == null || rows.length === 0) return;
    try {
      const notice = await aprCommentApi.getNotice(apprId);
      setSmsTarget({ smsNoticeCode: 'T03', personIds: notice.personIds, message: notice.message });   // 원본 98d5afdd6 open("T03", …)
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E2] insertButton[등 록].Select (L120) → 비면 "내용을 입력해주세요", 아니면 update() L239-258
  const update = async () => {
    if (apprId == null) return;
    if (text === '') {
      Modal.info({ title: '확인', content: '내용을 입력해주세요', okText: '확인' });
      return;
    }
    try {
      await aprCommentApi.createComment(apprId, text);
      setText('');
      await retrieve();
      onChanged();
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  // deleteChk() L181-205: 내 글이 아니면 "작성자만 댓글을 삭제할 수 있습니다", 맞으면 [E4] msgBox "해당 댓글을 삭제하시겠습니까?" [YES] (L185) → delete() L260-264
  const deleteChk = (row: AprComment) => {
    if (row.personId !== user?.userId) {
      Modal.info({ title: '확인', content: '작성자만 댓글을 삭제할 수 있습니다', okText: '확인' });
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '해당 댓글을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        try {
          await aprCommentApi.deleteComment(apprId ?? 0, row.commentId);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
        await retrieve();
      },
    });
  };

  // buildGrid() L173-179 (머리 없음, 행번호 숨김)
  const columnDefs = useMemo(() => [
    {
      ...gb.text('commentFullStr', 395, ' '),  // L175 addTextHtml + 행 펼침(글 = comment)
      autoHeight: true,
      wrapText: true,
      cellRenderer: (p: { data?: AprComment }) => p.data && (
        <div style={{ lineHeight: 1.6, padding: '4px 0' }}>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(p.data.commentFullStr) }} />
          <div style={{ whiteSpace: 'pre-wrap', color: '#434343', paddingLeft: 8 }}>{p.data.comment}</div>
        </div>
      ),
    },
    // [E3] grid.CellClick (L130) → cellIndex 3: Apr42_Lookup_FileList.open(선택 행, → retrieve())
    { ...gb.textCenter('fileStr', 50, ' '), cellStyle: { color: '#0084D4', cursor: 'pointer' }, onCellClicked: (e: { data?: AprComment }) => e.data && setFileTarget(e.data) },  // L176
    // cellIndex 4: ✕일 때만 deleteChk()
    { ...gb.textCenter('deleteStr', 25, ' '), cellStyle: { color: '#000000', cursor: 'pointer' }, onCellClicked: (e: { data?: AprComment }) => { if (e.data?.deleteStr === '✕') deleteChk(e.data); } },  // L177
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [user?.userId, retrieve, apprId]);

  return (
    <>
      <LookupModal
        open={apprId != null}
        title="댓글 보기"
        width={560}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={() => { onChanged(); onClose(); }}
        destroyOnClose
        footer={null}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ textAlign: 'right' }}>
            <Button type="send" onClick={sendNotice}>알림발송</Button>
          </div>
          <div style={{ height: 'min(460px, calc(100vh - 340px))' }}>
            <SingleGrid<AprComment>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.commentId)}
              loading={loading}
              rowNumber={false}
              rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }}
            />
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <Input.TextArea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="내용을 입력하세요"
              style={{ flex: 1, height: 50, resize: 'none' }}
            />
            <Button type="register" style={{ width: 80, height: 50 }} onClick={update}>등 록</Button>
          </div>
        </div>
      </LookupModal>
      <Apr42_Lookup_FileList comment={fileTarget} onClose={() => { setFileTarget(null); void retrieve(); }} />
      <Sms03_Lookup_SendList target={smsTarget} onClose={() => setSmsTarget(null)} />
    </>
  );
};
