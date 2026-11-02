/**
 * 회사규정 내용 조회창 (Z01) — Bbs15_Tab_CompanyRule의 "상세보기" 아이콘이 연다
 * AS-IS: myApp/client/vi/bbs/Bbs15_Lookup_Content.java (122줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L37-57: 모달 900×800, 머리글 "회사규정", 본문 = HTML(open L75-90 setHtmlText), 아래 가운데 [첨부파일(n건)] [닫기]
 */
import React, { useEffect, useState } from 'react';
import { Space } from 'antd';
import { fileApi } from '@/api/file';
import { Button } from '@/components/button';
import { HtmlView } from '@/components/form/HtmlView';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Bbs02_Lookup_File } from './Bbs02_Lookup_File';

interface Props {
  /** 있으면 열린다 (AS-IS open(content, parentId)) */
  rule: { content?: string | null; companyRuleId: number } | null;
  onClose: () => void;
}

export const Bbs15_Lookup_Content: React.FC<Props> = ({ rule, onClose }) => {
  const [fileCount, setFileCount] = useState(0);
  const [showFiles, setShowFiles] = useState(false);
  const parentId = rule?.companyRuleId;

  // setFileButtonText() L92-103: 서비스 sys.Sys10_File.selectByParentId → "첨부파일(n건)"
  useEffect(() => {
    if (parentId == null) return;
    fileApi.searchByParentId(parentId).then(list => setFileCount(list.length)).catch(() => setFileCount(0));
  }, [parentId]);

  return (
    <LookupModal
      open={rule != null}
      title={<b>회사규정</b>}
      width={900}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E2] fileButton[첨부파일(0건)].Select (L66) → Bbs02_Lookup_File.openUser(parentId) */}
            <Button type="view" onClick={() => setShowFiles(true)}>{`첨부파일(${fileCount}건)`}</Button>
            {/* [E1] closeButton[닫기].Select (L60) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L37-57) → settings() */}
      <div style={{ height: 640 }}>
        <HtmlView html={rule?.content ?? ''} height="100%" />
      </div>
      <Bbs02_Lookup_File open={showFiles} parentId={parentId} onClose={() => setShowFiles(false)} />
    </LookupModal>
  );
};
