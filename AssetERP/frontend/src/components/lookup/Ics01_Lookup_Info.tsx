/**
 * 법규 정보 창 (E04) — Sch05_Page_RelateIcs의 상세보기 아이콘에서 연다. ics·sch 도메인이 쓰는 공통 조회창(IM-02)
 * AS-IS: myApp/client/vi/ics/Ics01_Lookup_Info.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L108-145: 모달 650×690 "법규", 라벨 폭 80, 제출처·법규명·상세내용·기한·서식파일(그리드)·비고(모두 읽기 전용), 아래 가운데 [닫기]
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Typography } from 'antd';
import { icsApi } from '@/api/ics';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { IcsLawDetail } from '@/types/ics';
import { Sch05RelateIcs } from '@/types/sch';
import { Button } from '@/components/button';
import { Ics01_Page_IcsFile } from './Ics01_Page_IcsFile';

const ROW: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', margin: '0 15px 20px 5px' };
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography.Text strong style={{ width: 80, flex: 'none', paddingTop: 4 }}>{children}</Typography.Text>
);

interface Props {
  /** view(Sch05_RelateIcsModel) L42-57 — 연결 행(기한·법규). 있으면 열린다 */
  relate?: Sch05RelateIcs | null;
  /** view(Long icsClassTreeId) L59-61 — 법규만. 있으면 열린다(기한·비고 칸은 빈칸) */
  classTreeId?: number | null;
  onClose: () => void;
}

export const Ics01_Lookup_Info: React.FC<Props> = ({ relate, classTreeId, onClose }) => {
  const [law, setLaw] = useState<IcsLawDetail | null>(null);
  const [deadlineName, setDeadlineName] = useState('');
  const [note, setNote] = useState('');
  const treeId = relate?.icsClassTreeId ?? classTreeId ?? null;

  // view(selectModel) L42-57: 서비스 sch.Sch03_Deadline.selectById(deadlineId) → 기한·비고, settings() L63-86: ics.Ics01_ClassTree.selectById(법규) → 제목·상세내용·제출처, 서식파일 조회
  useEffect(() => {
    setLaw(null);
    setDeadlineName('');
    setNote('');
    if (treeId == null) return;
    if (relate) {
      schApi.getDeadline(relate.deadlineId).then(d => { setNote(d.note ?? ''); setDeadlineName(d.deadlineFullName ?? ''); })
        .catch(err => message.error(errorMessage(err, '조회 실패')));
    }
    icsApi.getLawDetail(treeId).then(setLaw).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [relate, treeId]);

  const ro = (value: string, height?: number, multi = false) => multi
    ? <Input.TextArea readOnly style={{ height, resize: 'none', flex: 1 }} value={value} />
    : <Input readOnly style={{ flex: 1 }} value={value} />;

  return (
    <Modal
      open={treeId != null}
      title="법규"
      width={690}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E1] closeButton[닫기].Select (L95) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      {/* [E0] 화면 열림 (생성자 L88-106) → getEditor(), show() */}
      <div style={{ paddingTop: 10 }}>
        <div style={ROW}><Label>제출처</Label>{ro(law?.submitTo ?? '')}</div>
        <div style={ROW}><Label>법규명</Label>{ro(law ? `(${law.classTreeCode ?? ''}) ${law.classTreeFullName ?? ''}` : '', 65, true)}</div>
        <div style={ROW}><Label>상세내용</Label>{ro(law?.content ?? '', 215, true)}</div>
        <div style={ROW}><Label>기한</Label>{ro(deadlineName)}</div>
        <div style={{ ...ROW, height: 130 }}>
          <Label>서식파일</Label>
          <div style={{ flex: 1, minWidth: 0, height: 130 }}><Ics01_Page_IcsFile classTreeId={treeId} /></div>
        </div>
        <div style={ROW}><Label>비고</Label>{ro(note)}</div>
      </div>
    </Modal>
  );
};
