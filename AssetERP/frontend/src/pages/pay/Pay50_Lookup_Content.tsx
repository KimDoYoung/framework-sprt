/**
 * 내역상세 창 (U03) — Pay50_Edit_Expense의 [내역상세]가 연다
 * AS-IS: myApp/client/vi/pay/Pay50_Lookup_Content.java (230줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L54-62: 모달 740×700 "내역상세"(크기 조절·최대화, X 없음), HTML 편집기 하나.
 *   open(content) L64-96 = 보기 전용 [닫기] / open(content, callback) L98-132 = [확인][닫기] / edit(expenseId, content, callback) L134-169 = [저장][닫기]
 */
import React, { useEffect, useState } from 'react';
import { message, Space } from 'antd';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { HtmlView } from '@/components/form/HtmlView';

export type ContentMode = 'view' | 'confirm' | 'edit';

interface Props {
  open: boolean;
  /** view = open(content), confirm = open(content, callback), edit = edit(expenseId, content, callback) */
  mode: ContentMode;
  content?: string | null;
  /** edit에서 저장할 지출결의서 */
  expenseId?: number | null;
  /** callback.execute(html): [확인]은 편집기 글, [저장]은 서버에 쓴 뒤 같은 글 */
  onResult?: (html: string) => void;
  onClose: () => void;
}

export const Pay50_Lookup_Content: React.FC<Props> = ({ open, mode, content, expenseId, onResult, onClose }) => {
  const [html, setHtml] = useState('');
  // HtmlEditor는 만들 때 한 번만 값을 받으므로 열 때마다 key를 바꿔 새로 만든다(11 §3)
  const [nonce, setNonce] = useState(0);

  // [E0] 화면 열림 (생성자 L54-62, open·edit L64-169) → settings() — 열 때마다 편집기를 새로 만든다
  useEffect(() => {
    if (open) {
      setHtml(content ?? '');
      setNonce(n => n + 1);
    }
  }, [open, content]);

  // [E1] updateButton[저장].Select (L172) → update() L192-205: pay.Pay50_Expense.updateContent(content, expenseId) → callback(html), hide()
  const update = async () => {
    if (expenseId == null) return;
    try {
      await payApi.updateExpenseContent(expenseId, html);
      onResult?.(html);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E2] confirmButton[확인].Select (L178) → confirm() L207-210: callback(html), hide()
  const confirm = () => {
    onResult?.(html);
    onClose();
  };

  return (
    <LookupModal open={open} title="내역상세" width={740} maskClosable={false} closable={false} onCancel={onClose} destroyOnHidden focusFirst={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {mode === 'edit' && <Button type="save" onClick={update}>저장</Button>}
            {mode === 'confirm' && <Button type="save" onClick={confirm}>확인</Button>}
            {/* [E3] closeButton[닫기].Select (L184) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {mode === 'view'
        ? <HtmlView html={content} height={540} />
        : <HtmlEditor key={nonce} value={content} onChange={setHtml} height={540} />}
    </LookupModal>
  );
};
