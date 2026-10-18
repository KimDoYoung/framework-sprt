/**
 * 양식 & 태그 (E17) — Dcr30_Tab_LinkAdmin 데이터연결(양식) 아이콘에서 연다.
 * AS-IS: myApp/client/vi/com/Com10_Lookup_CommonMapping.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L72-150: linkCode별 태그 목록(오른쪽) + 양식 편집기(왼쪽). 목록이 없으면 안내 후 닫는다. 950×880 모달 "양식 & 태그"
 * 편집기는 AS-IS CKEditor 대신 HtmlEditor(Tiptap, 05 §5)
 */
import React, { useEffect, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { comApi } from '@/api/com';
import { errorMessage } from '@/api/client';
import { FormMapping } from '@/types/com';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { Pay06_Popup_Example } from '@/components/lookup/Pay06_Popup_Example';
import { tagsOf } from './com10Tags';

interface Props {
  /** open(comMappingModel, linkId, linkCode, callback) L72 — 열 때 쓸 양식 (없으면 닫힘). 새 양식이면 formMappingId가 없다 */
  model: FormMapping | null;
  linkId: number;
  linkCode: string;
  /** 저장이 끝났을 때(AS-IS callback.execute()) */
  onSaved: () => void;
  onClose: () => void;
}

export const Com10_Lookup_CommonMapping: React.FC<Props> = ({ model, linkId, linkCode, onSaved, onClose }) => {
  const [content, setContent] = useState('');
  const [example, setExample] = useState(false);
  const tags = tagsOf(linkCode);

  // [E0] 화면 열림 (생성자 L152-191, open L72-150): 태그 목록이 없으면 안내하고 닫는다
  useEffect(() => {
    if (!model) return;
    setContent(model.content ?? '');
    if (tags == null) {
      if (linkCode === 'D01') message.info('해당 양식은 [특정양식 지정 (연봉계약서)]에서만 가능합니다');
      else message.info("해당 양식은 데이터연결 양식을 지원하지 않습니다 ('#'태그 미지원 양식)");
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  // [E1] updateButton[저장].Select (L169) → update() L230-251
  const update = async () => {
    // text-decoration-line → text-decoration, ' → " (L233-236)
    const html = content.replace(/text-decoration-line/g, 'text-decoration').replace(/'/g, '"');
    try {
      await comApi.updateFormMapping({ formMappingId: model?.formMappingId ?? null, linkId, content: html });
      onSaved();
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <>
      <Modal
        open={model != null && tags != null}
        title="양식 & 태그"
        width={950}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update}>저장</Button>
              {/* [E2] closeButton[닫기].Select (L175) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* [E3] referenceLabel.Click (L181) → Pay06_Popup_Example */}
            <div style={{ marginBottom: 12 }}>
              <b>양식</b>&nbsp;
              <a href="#" style={{ color: '#597EB1', fontWeight: 'bold' }} onClick={e => { e.preventDefault(); setExample(true); }}>( 참 고 )</a>
            </div>
            {/* getEditor() L193-228: 편집기는 만들 때 한 번만 값을 넣는다 → 열릴 때마다 key로 새로 */}
            <HtmlEditor key={`${model?.formMappingId ?? 'new'}-${linkId}`} value={model?.content} onChange={setContent} height={620} />
          </div>
          <div style={{ width: 150, flex: 'none', paddingTop: 40, lineHeight: '180%', fontWeight: 'bold' }}>
            {(tags ?? []).map(t => <div key={t}>{`#{${t}}`}</div>)}
          </div>
        </div>
      </Modal>
      <Pay06_Popup_Example open={example} onClose={() => setExample(false)} />
    </>
  );
};
