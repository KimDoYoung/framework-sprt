/**
 * 신청내용 창 — Icam55_Edit_UserRegAppr의 "신청내용 :" 글자에서 연다 (EE29)
 * AS-IS: myApp/client/vi/icam/Icam55_Lookup_RegContent.java (153줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L55-102: 모달 750×850 "내용", 크기 고정, HTML 편집기(CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13)) + [저장][닫기] 가운데.
 * 편집창 규격(11 §4a): 머리 아래 선 · 푸터 위 선(LookupModal) · 닫기 maskClosable=false.
 * 스타일: MH (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { message, Space } from 'antd';
import { icamUserApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamUser } from '@/types/icam';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  /** 값이 있으면 열림 — AS-IS open(icamUserModel, callback) */
  model: IcamUser | null;
  /** 저장된 행 (AS-IS callback.execute(icamUserModel) 뒤 hide) */
  onSaved: (row: IcamUser) => void;
  onClose: () => void;
}

export const Icam55_Lookup_RegContent: React.FC<Props> = ({ model, onSaved, onClose }) => {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (model) setContent(model.regContent ?? ''); }, [model]);

  // [E1] updateButton[저장].Select (L85) → update() L104-132
  const update = async () => {
    if (!model) return;
    // 결재 중인 문서이거나 완료된 문서는 고칠 수 없다
    if (['10', '20', '30'].includes(model.apprStatusCode ?? '')) {
      message.warning('결재 중인 문서이거나, 완료된 문서가 포함되어있습니다');
      return;
    }
    if (!content) {
      message.warning('신청내용을 입력해주세요');
      return;
    }
    setSaving(true);
    try {
      const saved = await icamUserApi.save({
        icamUserId: model.icamUserId, regDate: model.regDate ?? null, companyName: model.companyName ?? null, userName: model.userName ?? null,
        procAddYn: model.procAddYn, procModiYn: model.procModiYn, procdelYn: model.procdelYn, regContent: content,
      });
      onSaved(saved);
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <LookupModal
      open={model != null}
      title="내용"
      width={750}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" loading={saving} onClick={update}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L91) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <HtmlEditor value={model?.regContent ?? ''} onChange={setContent} height={600} />
    </LookupModal>
  );
};
