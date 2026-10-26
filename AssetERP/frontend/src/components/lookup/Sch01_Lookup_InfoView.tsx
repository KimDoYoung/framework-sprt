/**
 * 업무일정 보기 창 — 기간별 업무일정 조회(O02)의 [상세보기] 아이콘에서 연다
 * AS-IS: myApp/client/vi/sch/Sch01_Lookup_InfoView.java (172줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L45-71·getEditor L113-150: 모달 "업무일정" 650×600, 읽기 전용 칸 = 분류 · 일정명(높이 85) · 상세내용(235) · 기한 · 비고 (보고처 `report`는 주석 처리라 화면에 없다),
 *   아래 가운데 [닫기] [첨부파일 확인(n)]
 */
import React, { useEffect, useState } from 'react';
import { Input, Space, message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Button } from '@/components/button';
import { schApi } from '@/api/sch';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { Sch01InfoView } from '@/types/sch';
import { Bbs02_Lookup_File } from '@/pages/bbs/Bbs02_Lookup_File';

export interface InfoViewTarget {
  infoId: number;
  deadlineId: number;
}

interface Props {
  /** 있으면 열린다 (AS-IS open(infoId, deadlineId) L73-86) */
  target: InfoViewTarget | null;
  onClose: () => void;
}

const ROW = { display: 'flex', alignItems: 'flex-start', margin: '20px 15px 20px 5px' } as const;
const LABEL = { width: 80, flex: '0 0 auto', paddingTop: 5, textAlign: 'right', paddingRight: 8 } as const;

export const Sch01_Lookup_InfoView: React.FC<Props> = ({ target, onClose }) => {
  const [info, setInfo] = useState<Sch01InfoView | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [showFiles, setShowFiles] = useState(false);

  // [E0] 열림 (생성자 L45-71) → open() L73-86: 서비스 sch.Sch01_Info.selectByDeadLineId(infoId, deadlineId) → settings() L92-111
  //   setFileButtonText() L152-163: 서비스 sys.Sys10_File.selectByParentId(parentId = infoId) → "첨부파일 확인(n)"
  useEffect(() => {
    if (!target) { setInfo(null); setFileCount(0); return; }
    schApi.getInfoView(target.infoId, target.deadlineId)
      .then(row => {
        setInfo(row);
        fileApi.searchByParentId(row.infoId).then(list => setFileCount(list.length)).catch(() => setFileCount(0));
      })
      .catch(err => { message.error(errorMessage(err, '조회 실패')); onClose(); });
  }, [target]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LookupModal
      open={target != null}
      title={<b>업무일정</b>}
      width={650}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E1] closeButton[닫기].Select (L52) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
            {/* [E2] fileButton[첨부파일 확인].Select (L58) → Bbs02_Lookup_File.openUser(parentId) */}
            <Button type="view" onClick={() => setShowFiles(true)}>{`첨부파일 확인(${fileCount})`}</Button>
          </Space>
        </div>
      }
    >
      <div style={ROW}><div style={LABEL}>분류</div><Input readOnly value={info?.className ?? ''} /></div>
      <div style={ROW}><div style={LABEL}>일정명</div><Input.TextArea readOnly value={info?.title ?? ''} style={{ height: 85, resize: 'none' }} /></div>
      <div style={ROW}><div style={LABEL}>상세내용</div><Input.TextArea readOnly value={info?.content ?? ''} style={{ height: 235, resize: 'none' }} /></div>
      <div style={ROW}><div style={LABEL}>기한</div><Input readOnly value={info?.deadlineName ?? ''} /></div>
      <div style={ROW}><div style={LABEL}>비고</div><Input readOnly value={info?.note ?? ''} /></div>
      <Bbs02_Lookup_File open={showFiles} parentId={info?.infoId} onClose={() => setShowFiles(false)} />
    </LookupModal>
  );
};
