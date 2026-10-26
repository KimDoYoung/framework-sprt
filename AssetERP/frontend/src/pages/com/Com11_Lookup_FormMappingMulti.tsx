/**
 * 양식 & 태그 (상세코드별, Q08) — Est01_Tab_PfFeeType의 계획서양식·결과보고서양식 아이콘에서 연다.
 * AS-IS: myApp/client/vi/com/Com11_Lookup_FormMappingMulti.java (207줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L67-89: linkCode별 태그 목록(오른쪽) + 양식 편집기(왼쪽). 목록이 없으면 안내 후 닫는다. 950×880 모달 "양식 & 태그"
 * Com10_Lookup_CommonMapping과 같은 모양이지만 양식 번호·linkId가 아니라 (종류코드, 상세코드, 연결코드)로 찾은 양식을 저장한다.
 * 편집기는 AS-IS CKEditor 대신 HtmlEditor(Tiptap, 05 §5)
 */
import React, { useEffect, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Pay06_Popup_Example } from '@/components/lookup/Pay06_Popup_Example';
import { comApi } from '@/api/com';
import { errorMessage } from '@/api/client';
import { FormMappingMulti } from '@/types/com';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { multiTagsOf } from './com11Tags';

interface Props {
  /** open(comMappingModel, linkCode) L67 — 열 때 쓸 양식 (없으면 닫힘). 저장된 것이 없으면 번호만 새로 받은 빈 양식 */
  model: FormMappingMulti | null;
  linkCode: string;
  onClose: () => void;
}

export const Com11_Lookup_FormMappingMulti: React.FC<Props> = ({ model, linkCode, onClose }) => {
  const [content, setContent] = useState('');
  const [example, setExample] = useState(false);
  const tags = multiTagsOf(linkCode);

  // [E0] 화면 열림 (생성자 L91-130, open L67-89): 태그 목록이 없으면 안내하고 닫는다
  useEffect(() => {
    if (!model) return;
    setContent(model.content ?? '');
    if (tags == null) {
      message.info("해당 양식은 데이터연결 양식을 지원하지 않습니다 ('#'태그 미지원 양식)");
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  // [E1] updateButton[저장].Select (L108) → update() L169-188: text-decoration-line → text-decoration, ' → " (L174-175)
  const update = async () => {
    if (!model) return;
    const html = content.replace(/text-decoration-line/g, 'text-decoration').replace(/'/g, '"');
    try {
      await comApi.updateFormMappingMulti({
        formMappingMultiId: model.formMappingMultiId,
        sysKindCode: model.sysKindCode,
        sysDetailCode: model.sysDetailCode,
        linkCode: model.linkCode,
        content: html,
      });
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <>
      <LookupModal
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
              {/* [E2] closeButton[닫기].Select (L114) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* [E3] referenceLabel.Click (L120) → Pay06_Popup_Example. getEditor() L132-167: 안내 글(CE4242) + ( 참 고 ) */}
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#CE4242', fontWeight: 'bold' }}>▶  우측에 정해진 태그값을 사용하여, 양식을 작성해주세요 </span>&nbsp;
              <a href="#" style={{ color: '#597EB1', fontWeight: 'bold' }} onClick={e => { e.preventDefault(); setExample(true); }}>( 참 고 )</a>
            </div>
            {/* 편집기는 만들 때 한 번만 값을 넣는다 → 열릴 때마다 key로 새로 */}
            <HtmlEditor key={`${model?.formMappingMultiId ?? 'new'}-${linkCode}`} value={model?.content} onChange={setContent} height={620} />
          </div>
          <div style={{ width: 150, flex: 'none', paddingTop: 40, lineHeight: '180%', fontWeight: 'bold' }}>
            {(tags ?? []).map(t => <div key={t}>{`#{${t}}`}</div>)}
          </div>
        </div>
      </LookupModal>
      <Pay06_Popup_Example open={example} onClose={() => setExample(false)} />
    </>
  );
};
