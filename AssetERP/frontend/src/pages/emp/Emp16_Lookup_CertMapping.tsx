/**
 * 증명서 양식 & 태그 창 (EE74) — AS-IS는 증명서 맵핑 탭(Emp16_TabPage_CertMapping)의 양식 아이콘이 연다
 * AS-IS: myApp/client/vi/emp/Emp16_Lookup_CertMapping.java (178줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L68-109: 950×880 모달 "증명서 양식 & 태그", 왼쪽 "▶ 우측에 정해진 태그값을 사용하여, 증명서 양식을 작성해주세요" + (참고) 링크 + 양식 편집기, 오른쪽 태그 목록, [저장][닫기]
 * 편집기는 AS-IS CKEditor 대신 HtmlEditor(Tiptap, 05 §5). 태그 목록은 TempData.getCertMappingList() L238 — 증명서 화면이 정해 둔 값이 없으면 기본 18개
 * [저장] update() L148-159: 양식을 모델에 담고(text-decoration-line → text-decoration, ' → ") "'Mapping' 팝업 창에서 저장을 하셔야 시스템에 최종 반영됩니다" 안내 후 callback(model). 창은 닫지 않는다
 * 호출처(Emp16_TabPage_CertMapping·Emp16_Lookup_CertList)가 AS-IS에서 아무 곳에도 붙어 있지 않아 TOBE에서 여는 곳이 없다(작업기록)
 * 스타일: MH (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { message, Space } from 'antd';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Pay06_Popup_Example } from '@/components/lookup/Pay06_Popup_Example';

/** AS-IS Emp16_CertMappingModel 중 이 창이 다루는 값 */
export interface CertMappingModel {
  certMappingId?: number | null;
  linkCode?: string | null;
  linkName?: string | null;
  title?: string | null;
  note?: string | null;
  content?: string | null;
}

/** TempData.getCertMappingList() L238-258: 정해 둔 태그가 없을 때의 기본 태그 */
export const CERT_MAPPING_TAGS = ['사번', '성명', '생년월일', '주민번호', '부서명', '주소', '직책', '직위', '입사일', '퇴사일',
  '근속년수', '발급일', '용도', '발령내역', '징계내역', '회사명', '회사주소', '회사대표'];

interface Props {
  /** open(certMappingModel, callback) L62 — 값이 있으면 열린다 */
  model: CertMappingModel | null;
  /** 오른쪽에 보여 줄 태그(없으면 기본 18개). 화면에서는 "#{태그}"로 표시 */
  tags?: string[];
  /** AS-IS callback.execute(model): [저장]이면 양식을 담은 모델. 창은 닫지 않는다 */
  onApply: (model: CertMappingModel) => void;
  onClose: () => void;
}

export const Emp16_Lookup_CertMapping: React.FC<Props> = ({ model, tags = CERT_MAPPING_TAGS, onApply, onClose }) => {
  const [content, setContent] = useState('');
  const [example, setExample] = useState(false);

  // [E0] 화면 열림 (생성자 L68-109, open L62): 양식을 편집기에 넣는다
  useEffect(() => { if (model) setContent(model.content ?? ''); }, [model]);

  // [E1] updateButton[저장].Select (L85) → update() L148-159
  const update = () => {
    if (!model) return;
    const html = content.replace(/text-decoration-line/g, 'text-decoration').replace(/'/g, '"');
    message.info("'Mapping' 팝업 창에서 저장을 하셔야 시스템에 최종 반영됩니다");
    onApply({ ...model, content: html });
  };

  return (
    <>
      <LookupModal
        open={model != null}
        title="증명서 양식 & 태그"
        width={950}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update}>저장</Button>
              {/* [E2] closeButton[닫기].Select (L91) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* [E3] referenceLabel.Click (L97) → Pay06_Popup_Example */}
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#CE4242', fontWeight: 'bold', fontSize: 12 }}>▶  우측에 정해진 태그값을 사용하여, 증명서 양식을 작성해주세요</span>&nbsp;
              <a href="#" style={{ color: '#597EB1', fontWeight: 'bold' }} onClick={e => { e.preventDefault(); setExample(true); }}>( 참 고 )</a>
            </div>
            {/* getEditor() L111-145: 편집기는 만들 때 한 번만 값을 넣는다 → 열릴 때마다 key로 새로 */}
            <HtmlEditor key={`${model?.certMappingId ?? 'new'}-${model?.linkCode ?? ''}`} value={model?.content} onChange={setContent} height={620} />
          </div>
          <div style={{ width: 150, flex: 'none', paddingTop: 40, lineHeight: '180%', fontWeight: 'bold' }}>
            {tags.map(t => <div key={t}>{`#{${t}}`}</div>)}
          </div>
        </div>
      </LookupModal>
      <Pay06_Popup_Example open={example} onClose={() => setExample(false)} />
    </>
  );
};
