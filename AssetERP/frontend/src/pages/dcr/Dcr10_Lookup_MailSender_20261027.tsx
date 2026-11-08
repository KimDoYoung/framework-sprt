/**
 * 메일 보내기 창 (EE35) — 전자결재 문서·증명서·사용료 청구 메일을 앱 안 SMTP로 보낸다 (Dcr10_Lookup_MailSender 확인창에서 [아니오]가 연다)
 * AS-IS: myApp/client/vi/dcr/Dcr10_Lookup_MailSender_20261027.java (609줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L154-237: 모달 "보내기" 850×780, 발신(본인)·발신(공용) 라디오 + 수신 · 참조 · 제목 · 내용(HTML 편집기 350) · 첨부 파일(그리드 150), 아래 [전자서명에 내선/휴대폰 번호 추가][보내기][닫기]
 * open L111·certOpen L117·erpFeeChargeOpen L130(testYn = sendMailSessionTest). 편집창 규격(11 §4a)
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, Input, message, Modal, Radio, Space, Spin, Typography } from 'antd';
import { dcrMailSenderApi } from '@/api/dcrMail';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { FileInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Cmp10_Lookup_MailBookList } from '../cmp/Cmp10_Lookup_MailBookList';
import { Emp10_Lookup_MailAddress } from '../emp/Emp10_Lookup_MailAddress';
import { Emp10_Lookup_MailRetrieve } from '../emp/Emp10_Lookup_MailRetrieve';

const gb = gbFor<FileInfo>();

/** 부르는 쪽이 정하는 열기 방식 — open(apprId) / certOpen(apprId, emailAddress) / erpFeeChargeOpen(apprId, managerEmail, apprTitle, mailForm) */
export type MailSenderTarget =
  | { mode: 'open'; apprId: number }
  | { mode: 'cert'; apprId: number; emailAddress?: string | null }
  | { mode: 'erpFeeCharge'; apprId: number; managerEmail?: string | null; apprTitle?: string | null; mailForm?: string | null };

interface Props {
  /** 값이 있으면 열림 */
  target: MailSenderTarget | null;
  onClose: () => void;
}

/** 라벨 폭 105 (labelLayout2) */
const Field: React.FC<{ label: string; children: React.ReactNode; align?: 'center' | 'flex-start' }> = ({ label, children, align = 'center' }) => (
  <div style={{ display: 'flex', alignItems: align }}>
    <Typography.Text style={{ width: 105, flex: 'none', textAlign: 'right', paddingRight: 10, lineHeight: '32px' }}>{label}</Typography.Text>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: 5, alignItems: 'center' }}>{children}</div>
  </div>
);

export const Dcr10_Lookup_MailSender_20261027: React.FC<Props> = ({ target, onClose }) => {
  const [sender1, setSender1] = useState('');
  const [sender2, setSender2] = useState('');
  const [receiver, setReceiver] = useState('');
  const [ccReceiver, setCcReceiver] = useState('');
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [initialHtml, setInitialHtml] = useState('');
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [publicAllowed, setPublicAllowed] = useState(false);   // checkSender2
  const [officeTelno, setOfficeTelno] = useState<string | null>(null);
  const [mobileTelno, setMobileTelno] = useState<string | null>(null);
  const [radio, setRadio] = useState<'1' | '2'>('1');
  const [privacy, setPrivacy] = useState(false);
  const [sending, setSending] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [lookup, setLookup] = useState<'retrieve' | 'book' | 'receiver' | 'cc' | null>(null);

  // [E0] open()·certOpen()·erpFeeChargeOpen() → retrieve() + checkSender2() + 첨부 그리드(sys.Sys10_File.selectApprRelateDoc)
  useEffect(() => {
    if (!target) return;
    setSender2(''); setRadio('1'); setPrivacy(false); setSending(false); setFiles([]); setPublicAllowed(false); setLookup(null);
    let r = ''; let t = ''; let h = '';
    if (target.mode === 'cert' && target.emailAddress != null) { r = target.emailAddress; t = '증명서 발급완료'; }
    if (target.mode === 'erpFeeCharge' && target.managerEmail != null) { r = target.managerEmail; t = target.apprTitle ?? ''; if (target.mailForm != null) h = target.mailForm; }
    setReceiver(r); setCcReceiver(''); setTitle(t); setHtml(h); setInitialHtml(h);
    setEditorKey(k => k + 1);
    dcrMailSenderApi.init(target.apprId)
      .then(init => {
        setSender1(init.senderEmail ?? '');
        setOfficeTelno(init.officeTelno ?? null);
        setMobileTelno(init.mobileTelno ?? null);
        setPublicAllowed(init.publicMailAllowed);
        setFiles(init.files);
      })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [target]);

  // [E1] toggle.ValueChange (L268): 1이면 본인 칸, 2이면 공용 칸 — 공용메일 권한이 없으면 1로 되돌리고 안내
  const changeRadio = (v: '1' | '2') => {
    if (v === '2') {
      setPrivacy(false);
      if (!publicAllowed) {
        setRadio('1');
        message.warning('공용메일 사용권한이 없습니다');
        return;
      }
    }
    setRadio(v);
  };

  const columnDefs = useMemo(() => [
    gb.text('fileNm', 500, '첨부파일'),   // L385
    iconCell<FileInfo>('down', 'downCell', 70, '받기', row => { void fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패'))); }),   // L386 FileDownload?fileType=file
    iconCell<FileInfo>('delete', 'deleteCell', 70, '삭제', row => setFiles(prev => prev.filter(f => f.fileId !== row.fileId))),   // L387 목록에서만 뺀다
  ], []);

  // addLog() L549-586 → dcr.Dcr10_MailHistory.insertMailHistory 뒤 hide()
  const addLog = async (fileIds: number[]) => {
    try {
      await dcrMailSenderApi.saveHistory({
        apprId: target?.apprId, senderEmail: radio === '2' ? sender2 : sender1, receiverEmail: receiver, referencerEmail: ccReceiver,
        titleText: title, bodyText: html, fileIds,
      });
    } catch (err) {
      message.error(errorMessage(err, '메일 기록 저장 실패'));
    }
    onClose();
  };

  // sendMailSMTP() L466-535
  const sendMailSMTP = async () => {
    setSending(true);   // sendMail() L537-541: mask("sending…"), [보내기][닫기] 비활성
    const fail = (msg: string) => { message.warning(msg); setSending(false); };   // failMail() L543-547
    if (radio === '2' && sender2.trim() === '') return fail('공용메일을 먼저 선택해주세요');
    if (receiver.trim() === '') return fail('수신(메일주소)은 필수입력 항목입니다');
    if (title.trim() === '') return fail('제목은 필수입력 항목입니다');
    const fileIds = files.map(f => f.fileId);
    try {
      const res = await dcrMailSenderApi.send({
        apprId: target?.apprId, receptor: receiver, ccReceptor: ccReceiver, header: title, content: html,
        publicCheck: radio === '2' ? sender2 : null, privacyInfo: privacy, testYn: target?.mode === 'erpFeeCharge', fileIds,
      });
      if (!res.ok) return fail(res.message ?? '메일발송 중 에러가 발생했습니다');
      await addLog(fileIds);
    } catch (err) {
      fail(errorMessage(err, '메일발송 중 에러가 발생했습니다'));
    }
  };

  // [E6] confirmButton[보내기].Select (L349) → privacyInfoChk() L446-464
  const privacyInfoChk = () => {
    if (radio === '1' && privacy) {
      if (!officeTelno) { message.warning('내선번호를 먼저 등록해주세요'); return; }
      if (!mobileTelno) { message.warning('휴대폰번호를 먼저 등록해주세요'); return; }
    }
    void sendMailSMTP();
  };

  // setReceiver(String, TextField) L439-444: 조회창 결과를 칸의 글 뒤에 이어 붙인다
  const append = (cur: string, add: string) => cur + add;

  return (
    <>
      <Modal
        open={!!target}
        title="보내기"
        width={850}
        maskClosable={false}
        closable={false}
        onCancel={onClose}
        styles={{
          header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
          footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
        }}
        footer={(
          <div style={{ textAlign: 'center' }}>
            <Space size={12}>
              <Checkbox checked={privacy} disabled={radio === '2' || sending} onChange={e => setPrivacy(e.target.checked)}>전자서명에 내선/휴대폰 번호 추가</Checkbox>
              <Button type="send" onClick={privacyInfoChk} disabled={sending}>보내기</Button>
              {/* [E7] closeButton[닫기].Select (L355) → hide() */}
              <Button type="close" onClick={onClose} disabled={sending}>닫기</Button>
            </Space>
          </div>
        )}
      >
        <Spin spinning={sending} tip="sending...">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 2px' }}>
            <Radio.Group value={radio} onChange={e => changeRadio(e.target.value)} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Field label="발신(본인)">
                <Radio value="1" style={{ marginInlineEnd: 0 }} />
                <Input readOnly disabled={radio === '2'} value={sender1} />
                {/* [E2] sender1Button[본인메일].Select (L301) → Emp10_Lookup_MailRetrieve. callback의 retrieve()는 AS-IS 조회창이 callback을 부르지 않아 실행되지 않는다(그대로) */}
                <Button type="change" disabled={radio === '2'} onClick={() => setLookup('retrieve')}>본인메일</Button>
              </Field>
              <Field label="발신(공용)">
                <Radio value="2" style={{ marginInlineEnd: 0 }} />
                <Input readOnly disabled={radio !== '2'} value={sender2} />
                {/* [E3] sender2Button[공용메일].Select (L313) → Cmp10_Lookup_MailBookList → 선택한 주소를 공용 칸에 */}
                <Button type="change" disabled={radio !== '2'} onClick={() => setLookup('book')}>공용메일</Button>
              </Field>
            </Radio.Group>
            <Field label="수 신">
              <Input value={receiver} onChange={e => setReceiver(e.target.value)} />
              {/* [E4] receiverButton[주소록].Select (L326) → Emp10_Lookup_MailAddress */}
              <Button type="search" onClick={() => setLookup('receiver')}>주소록</Button>
            </Field>
            <Field label="참 조">
              <Input value={ccReceiver} onChange={e => setCcReceiver(e.target.value)} />
              {/* [E5] ccReceiverButton[주소록].Select (L338) → Emp10_Lookup_MailAddress */}
              <Button type="search" onClick={() => setLookup('cc')}>주소록</Button>
            </Field>
            <Field label="제 목"><Input value={title} onChange={e => setTitle(e.target.value)} /></Field>
            <Field label="내 용" align="flex-start">
              <div style={{ flex: 1, minWidth: 0 }}>
                <HtmlEditor toolbar="mail" key={editorKey} value={initialHtml} onChange={setHtml} height={350} />
              </div>
            </Field>
            <Field label="첨부 파일" align="flex-start">
              <div style={{ flex: 1, minWidth: 0, height: 150 }}>
                <SingleGrid<FileInfo> rowData={files} columnDefs={columnDefs} getRowId={p => String(p.data.fileId)} />
              </div>
            </Field>
          </div>
        </Spin>
      </Modal>
      <Emp10_Lookup_MailRetrieve open={lookup === 'retrieve'} onClose={() => setLookup(null)} />
      <Cmp10_Lookup_MailBookList open={lookup === 'book'} onResult={m => { setSender2(m.emailAddr); setLookup(null); }} onClose={() => setLookup(null)} />
      <Emp10_Lookup_MailAddress open={lookup === 'receiver' || lookup === 'cc'}
        onResult={text => { if (lookup === 'receiver') setReceiver(cur => append(cur, text)); else setCcReceiver(cur => append(cur, text)); setLookup(null); }}
        onClose={() => setLookup(null)} />
    </>
  );
};
