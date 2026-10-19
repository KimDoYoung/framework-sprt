/**
 * 법규상세 창 (E03-1) — 연결법규 그리드의 상세보기 아이콘에서 연다. ics·sch·tdm 여러 도메인이 쓰는 공통 조회창(IM-02)
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_ClassTreeDetail.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L103-156: 모달 1300×570 "법규상세", 라벨 폭 80, 왼쪽 반 = 법규명·상세내용·관련조문·제출처·기한(모두 읽기 전용),
 *   세로 줄, 오른쪽 반 = 개정이력 그리드(255)·서식파일 그리드(195), 아래 가운데 [닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Typography } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icsApi } from '@/api/ics';
import { errorMessage } from '@/api/client';
import { IcsLawDetail } from '@/types/ics';
import { Button } from '@/components/button';
import { Ics01_Page_IcsFile } from './Ics01_Page_IcsFile';
import { Ics01_Page_RevisionHistory } from './Ics01_Page_RevisionHistory';

const ROW: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', margin: '0 15px 15px 5px' };
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography.Text strong style={{ width: 80, flex: 'none', paddingTop: 4 }}>{children}</Typography.Text>
);

interface Props {
  /** open(classTreeId) L54-77 — 값이 있으면 열린다 */
  classTreeId: number | null;
  onClose: () => void;
}

export const Ics01_Lookup_ClassTreeDetail: React.FC<Props> = ({ classTreeId, onClose }) => {
  const [model, setModel] = useState<IcsLawDetail | null>(null);

  // open() L54-77: 서비스 ics.Ics01_ClassTree.selectById(classTreeId) → settings() L79-101: 폼을 채우고 개정이력·서식파일을 조회
  useEffect(() => {
    setModel(null);
    if (classTreeId == null) return;
    icsApi.getLawDetail(classTreeId).then(setModel).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [classTreeId]);

  const text = (value?: string | null, height?: number) =>
    <Input.TextArea readOnly style={{ height, resize: 'none', flex: 1 }} value={value ?? ''} />;

  return (
    <LookupModal
      open={classTreeId != null}
      title="법규상세"
      width={1340}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E1] closeButton[닫기].Select (L95) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L41-52) → getEditor(), show() */}
      <div style={{ display: 'flex', height: 470 }}>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 20 }}>
          <div style={ROW}><Label>법규명</Label>{text(model ? `(${model.classTreeCode ?? ''}) ${model.classTreeName ?? ''}` : '', 40)}</div>
          <div style={ROW}><Label>상세내용</Label>{text(model?.content, 215)}</div>
          <div style={ROW}><Label>관련조문</Label>{text(model?.relatedLaw, 70)}</div>
          <div style={ROW}><Label>제출처</Label>{text(model?.submitTo, 40)}</div>
          <div style={ROW}><Label>기한</Label>{text(model?.deadlineName, 32)}</div>
        </div>
        <div style={{ width: 2, background: '#d9d9d9', margin: '10px 0' }} />
        <div style={{ flex: 1, minWidth: 0, padding: '20px 0 0 5px' }}>
          <div style={{ display: 'flex', margin: '0 15px 15px 5px', height: 255 }}>
            <Label>개정이력</Label>
            <div style={{ flex: 1, minWidth: 0 }}><Ics01_Page_RevisionHistory classTreeId={classTreeId} /></div>
          </div>
          <div style={{ display: 'flex', margin: '0 15px 15px 5px', height: 175 }}>
            <Label>서식파일</Label>
            <div style={{ flex: 1, minWidth: 0 }}><Ics01_Page_IcsFile classTreeId={classTreeId} /></div>
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
