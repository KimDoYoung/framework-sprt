/**
 * 계약서 양식 & 태그 (S13) — Pay06_Lookup_ActList의 내용 아이콘에서 연다.
 * AS-IS: myApp/client/vi/pay/Pay06_Lookup_ActMapping.java (177줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-108: 950×880 모달 "계약서 양식 & 태그", 왼쪽 안내 글(CE4242) + ( 참 고 ) + CKEditor, 오른쪽 150 태그 목록(TempData.getActMappingList), 아래 가운데 [저장][닫기].
 * 편집기는 AS-IS CKEditor 대신 HtmlEditor(Tiptap, 05 §5). [저장]은 서버에 쓰지 않고 내용을 부르는 쪽에 돌려준다 — 최종 저장은 Pay06_Lookup_ActList의 [저장]
 */
import React, { useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Pay06_Popup_Example } from '@/components/lookup/Pay06_Popup_Example';
import { PayActMapping } from '@/types/pay';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { getActMappingTags } from './pay06Tags';

interface Props {
  /** open(actMappingModel, callback) L61 — 값이 있으면 열린다 */
  model: PayActMapping | null;
  /** callback.execute(actMappingModel): 내용을 바꾼 행 */
  onResult: (row: PayActMapping) => void;
  onClose: () => void;
}

export const Pay06_Lookup_ActMapping: React.FC<Props> = ({ model, onResult, onClose }) => {
  // [E0] 화면 열림 (생성자 L67-108) → getEditor(), show(). 열릴 때 JSCaller 콜백(L76-83)이 content가 있으면 편집기에 넣는다 — HtmlEditor의 value
  const [content, setContent] = useState('');
  const [example, setExample] = useState(false);

  // [E1] updateButton[저장].Select (L84) → update() L147-158: text-decoration-line → text-decoration, ' → " (L152-153) 뒤
  //   "'계약서 Mapping' 팝업 창에서 저장을 하셔야 시스템에 최종 반영됩니다" 안내, callback.execute(actMappingModel). 창은 닫지 않는다
  const update = () => {
    if (!model) return;
    const html = content.replace(/text-decoration-line/g, 'text-decoration').replace(/'/g, '"');
    message.info("'계약서 Mapping' 팝업 창에서 저장을 하셔야 시스템에 최종 반영됩니다");
    onResult({ ...model, content: html });
  };

  return (
    <>
      <LookupModal
        open={model != null}
        title="계약서 양식 & 태그"
        width={950}
        maskClosable={false}
        onCancel={onClose}
        destroyOnHidden
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update}>저장</Button>
              {/* [E2] closeButton[닫기].Select (L90) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
        afterOpenChange={open => { if (open) setContent(model?.content ?? ''); }}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* [E3] referenceLabel.Click (L96) → Pay06_Popup_Example. getEditor() L110-144: 안내 글(CE4242) + ( 참 고 ) */}
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#CE4242', fontWeight: 'bold' }}>▶  우측에 정해진 태그값을 사용하여, 계약서 양식을 작성해주세요 </span>&nbsp;
              <a href="#" style={{ color: '#597EB1', fontWeight: 'bold' }} onClick={e => { e.preventDefault(); setExample(true); }}>( 참 고 )</a>
            </div>
            {/* 편집기는 만들 때 한 번만 값을 넣는다 → 열릴 때마다 key로 새로 (JSCaller 콜백 L76-83: content가 있으면 setHtmlText) */}
            <HtmlEditor key={`${model?.actMappingId ?? 'new'}`} value={model?.content ?? undefined} onChange={setContent} height={620} />
          </div>
          <div style={{ width: 150, flex: 'none', paddingTop: 40, lineHeight: '180%', fontWeight: 'bold' }}>
            {getActMappingTags().map(t => <div key={t}>{`#{${t}}`}</div>)}
          </div>
        </div>
      </LookupModal>
      <Pay06_Popup_Example open={example} onClose={() => setExample(false)} />
    </>
  );
};
