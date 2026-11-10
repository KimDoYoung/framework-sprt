/**
 * PDF Viewer (공통 창) — AS-IS myApp/client/vi/PDFViewer.java (함수 이름은 원본 메서드 이름 그대로, 줄 번호는 원본 IDMS-IC)
 * 생성자 L82-90: 모달 1024×768 "PDF Viewer", 크기 조절·최대화, 닫기 X 없음. open(param) L137-210: 위 안내줄(45) "* 한글(HWP)의 일부 특수문자는 지원하지않습니다. (비표준 유니코드문자)",
 *   양식 줄(50) ◉기본 양식 ◉증명서 양식 ◉계약서 양식, 가운데 iframe(PDFLoader), 아래 가운데 [결재요청](callback이 있을 때)·[닫기].
 * 원본 PDFLoader 서블릿 대신 load(formType)가 돌려준 PDF Blob을 브라우저 PDF 뷰어로 보여 준다(Sys95_PDFViewer와 같은 방식).
 * 결재문서 PDF는 지금 PDF 시뮬레이터(서버 AprPdfService)가 만든다 — 원본 Apr10_StampPDF7과 모양이 다르다.
 */
import React, { useEffect, useState } from 'react';
import { Modal, Radio, Space, Spin, message } from 'antd';
import { Button } from '@/components/button';
import { errorMessage } from '@/api/client';

export interface PDFViewerTarget {
  /** 양식(A 기본·B 증명서·C 계약서·D·X)으로 PDF를 읽는다 */
  load: (formType: string) => Promise<Blob>;
  /** 처음 양식 — open(param, formType). 없으면 "A" */
  formType?: string;
  /**
   * view(param) L92-95: 양식 줄을 숨긴다. open(param, formType)은 양식이 A·X·D이거나 사내문서(inoutTypeCode=20)면 양식 줄을 숨긴다(L101·L130).
   * 부르는 쪽이 그 판정을 넘긴다.
   */
  hideFormBar?: boolean;
  /** open(param, formType, callbackResult) L125-135: [결재요청] → callbackResult.execute(formType), 창 닫기 */
  onSend?: (formType: string) => void;
}

interface Props {
  target: PDFViewerTarget | null;
  onClose: () => void;
}

export const PDFViewer: React.FC<Props> = ({ target, onClose }) => {
  const [formType, setFormType] = useState('A');
  const [url, setUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (target) setFormType(target.formType || 'A'); }, [target]);

  // iframe src = "PDFLoader?" + param + "&formType=" + formType — 양식이 바뀔 때마다 다시 읽는다
  useEffect(() => {
    setUrl(undefined);
    if (!target) return;
    let alive = true;
    let objectUrl: string | undefined;
    setLoading(true);
    target.load(formType).then(blob => {
      if (!alive) return;
      objectUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      setUrl(objectUrl);
    }).catch(err => { if (alive) message.error(errorMessage(err, 'PDF를 만들지 못했습니다')); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [target, formType]);

  // radioSetting() L212-240: 처음 양식이 A·D면 기본만 고르고 증명서·계약서는 막는다
  const lockOthers = target?.formType == null || target.formType === 'A' || target.formType === 'D';

  return (
    <Modal
      open={!!target}
      title="PDF Viewer"
      width={1024}
      closable={false}
      maskClosable={false}
      destroyOnClose
      onCancel={onClose}
      styles={{ body: { height: 768 - 110, display: 'flex', flexDirection: 'column', gap: 4 } }}
      footer={(
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] sendButton[결재요청].Select (L174) → callbackResult.execute(formType); hide() */}
            {target?.onSend && <Button type="save" onClick={() => { const ft = formType; onClose(); target.onSend?.(ft); }}>결재요청</Button>}
            {/* [E2] cancelButton[닫기].Select (L184) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      )}
    >
      <div style={{ color: '#1F4D83', fontWeight: 'bold', fontSize: 12, padding: '4px 2px' }}>* 한글(HWP)의 일부 특수문자는 지원하지않습니다. (비표준 유니코드문자)</div>
      {!target?.hideFormBar && (
        // [E3] toggle.ValueChange (L241) → 기본 A · 증명서 B · 계약서 C 로 다시 읽는다
        <Radio.Group value={formType} onChange={e => setFormType(e.target.value)} style={{ padding: '4px 2px' }}>
          <Radio value="A">기본 양식</Radio>
          <Radio value="B" disabled={lockOthers}>증명서 양식</Radio>
          <Radio value="C" disabled={lockOthers}>계약서 양식</Radio>
        </Radio.Group>
      )}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', border: '1px solid #d9d9d9', boxSizing: 'border-box', background: '#fff' }}>
        {url && <iframe title="pdf" src={url} style={{ width: '100%', height: '100%', border: 0, display: 'block' }} />}
        {loading && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin /></div>}
      </div>
    </Modal>
  );
};
