/**
 * 내규 상세 창 (E13-3) — 연관내규 그리드의 보기 아이콘에서 연다. apr·sch·tdm 여러 도메인이 쓰는 공통 조회창(IM-02)
 * AS-IS: myApp/client/vi/icr/Icr01_Lookup_ClassTreeDetail.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L101-137: 모달 650×700 "내규 상세", 라벨 폭 80, 위에서 내규명(50)·상세내용(225)·관련조문(70)·제출처(50)·기한(50)·서식파일 그리드(130), 아래 가운데 [닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Typography } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icrApi } from '@/api/icr';
import { errorMessage } from '@/api/client';
import { IcrClassTreeDetail } from '@/types/icr';
import { Button } from '@/components/button';
import { Icr01_Page_IcrFile } from './Icr01_Page_IcrFile';

const ROW: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', margin: '15px 15px 0 5px' };
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography.Text strong style={{ width: 80, flex: 'none', paddingTop: 4 }}>{children}</Typography.Text>
);

interface Props {
  /** open(classTreeId) L53-76 — 값이 있으면 열린다 */
  classTreeId: number | null;
  onClose: () => void;
}

export const Icr01_Lookup_ClassTreeDetail: React.FC<Props> = ({ classTreeId, onClose }) => {
  const [model, setModel] = useState<IcrClassTreeDetail | null>(null);

  // open() L53-76: 서비스 icr.Icr01_ClassTree.selectById(classTreeId) → settings() L78-99: 폼을 채우고 서식파일을 조회
  useEffect(() => {
    setModel(null);
    if (classTreeId == null) return;
    icrApi.getDetail(classTreeId).then(setModel).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [classTreeId]);

  const text = (value?: string | null, height?: number) =>
    <Input.TextArea readOnly style={{ height, resize: 'none', flex: 1 }} value={value ?? ''} />;

  return (
    <LookupModal
      open={classTreeId != null}
      title="내규 상세"
      width={690}
      maskClosable={false}
      onCancel={onClose}
      footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E1] closeButton[닫기].Select (L93) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L40-51) → getEditor(), show() */}
      <div style={{ paddingBottom: 15 }}>
        <div style={ROW}><Label>내규명</Label>{text(model ? `(${model.classTreeCode ?? ''}) ${model.classTreeName ?? ''}` : '', 40)}</div>
        <div style={ROW}><Label>상세내용</Label>{text(model?.content, 215)}</div>
        <div style={ROW}><Label>관련조문</Label>{text(model?.relatedLaw, 60)}</div>
        <div style={ROW}><Label>제출처</Label>{text(model?.submitTo, 40)}</div>
        <div style={ROW}><Label>기한</Label>{text(model?.deadlineName, 40)}</div>
        <div style={{ display: 'flex', margin: '15px 15px 0 5px', height: 130 }}>
          <Label>서식파일</Label>
          <div style={{ flex: 1, minWidth: 0 }}><Icr01_Page_IcrFile classTreeId={classTreeId} /></div>
        </div>
      </div>
    </LookupModal>
  );
};
