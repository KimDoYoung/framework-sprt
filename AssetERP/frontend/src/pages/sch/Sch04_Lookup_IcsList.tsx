/**
 * 법규정보 창 (EE80) — AS-IS는 MyPage 오늘의 할일(Monitoring_Page_DayList)에서 업무구분 200(법규보고) 행을 더블클릭하면 연다
 * AS-IS: myApp/client/vi/sch/Sch04_Lookup_IcsList.java (293줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L68-80: 1300×560 모달 "법규정보", 라벨 폭 80, 왼쪽 반 = 법규명 · 상세내용 · 관련조문 · 제출처 · 기한, 세로 줄, 오른쪽 반 = 개정이력(그리드 230) · 서식파일(그리드 170) · 원인문서(조회창 입력칸) + [닫기]. 모두 읽기 전용
 * open(listModel, gubunCode, callback) → settings(gubunCode): 기한(Sch03_Deadline.selectById(deadlineId)) 표시 후
 *   gubunCode "2"·"X": 법규(infoId = 법규 ID)를 읽어 채운다(setIcs: ics.Ics01_ClassTree.selectById → "(코드) 이름" · 상세내용 · 제출처 · 관련조문 + 서식파일·개정이력)
 *   gubunCode "3": apr.Apr20_RelateIcs.selectById(relateIcsId = infoId) → 그 법규(setIcs) + 원인문서(setAppr: apr.Apr01_Appr.selectById → 제목)
 * 원인문서 [E2] apprName.TriggerClick: 문서가 없으면 "원인문서가 없습니다", 있으면 전자결재 문서창(apprView)
 * 내규판 Sch04_Lookup_IcrList(EE79)와 쌍. TOBE에서는 MyPage Day List(`DayListBox`, EE106)와 법규 박스(`ComplianceGridBox`, EE105)가 연다
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { LookupModal } from '@/components/lookup/LookupModal';
import { aprRelateEditApi } from '@/api/apr';
import { icsApi } from '@/api/ics';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { IcsLawDetail } from '@/types/ics';
import { Button } from '@/components/button';
import { Ics01_Page_IcsFile } from '@/components/lookup/Ics01_Page_IcsFile';
import { Ics01_Page_RevisionHistory } from '@/components/lookup/Ics01_Page_RevisionHistory';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const ROW: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', margin: '0 15px 15px 5px' };
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography.Text strong style={{ width: 80, flex: 'none', paddingTop: 4 }}>{children}</Typography.Text>
);

interface Props {
  /** open(listModel, gubunCode, callback) — 할일 행의 relateId(법규 ID 또는 연관법규 ID). 값이 있으면 열린다 */
  infoId: number | null;
  /** 기한(Sch03_Deadline) ID — 할일 행의 deadlineId */
  deadlineId: number | null;
  /** 업무 구분 코드: "2"·"X" 법규 / "3" 연관법규(원인문서 있음) */
  gubunCode: string;
  onClose: () => void;
}

export const Sch04_Lookup_IcsList: React.FC<Props> = ({ infoId, deadlineId, gubunCode, onClose }) => {
  const [ics, setIcs] = useState<IcsLawDetail | null>(null);
  const [deadlineName, setDeadlineName] = useState('');
  const [apprId, setApprId] = useState<number | null>(null);
  const [apprTitle, setApprTitle] = useState('해당 없음');      // apprName.setValue("해당 없음")
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);

  // [E0] 화면 열림 → open() → settings(gubunCode)
  useEffect(() => {
    setIcs(null); setDeadlineName(''); setApprId(null); setApprTitle('해당 없음'); setClassTreeId(null); setViewApprId(null);
    if (infoId == null) return;
    const fail = (err: unknown) => message.error(errorMessage(err, '조회 실패'));
    // setDeadline(): sch.Sch03_Deadline.selectById
    if (deadlineId != null) schApi.getDeadline(deadlineId).then(d => setDeadlineName(d.deadlineFullName ?? '')).catch(fail);
    if (gubunCode === '2' || gubunCode === 'X') {
      setClassTreeId(infoId);
    } else if (gubunCode === '3') {
      // apr.Apr20_RelateIcs.selectById → setIcs(classTreeId) + setAppr(apprId)
      aprRelateEditApi.getRelateIcsOrigin(infoId).then(r => {
        setClassTreeId(r.classTreeId);
        setApprId(r.apprId);
        setApprTitle(r.apprTitle ?? '');
      }).catch(fail);
    }
  }, [infoId, deadlineId, gubunCode]);

  // setIcs(): ics.Ics01_ClassTree.selectById(classTreeId)
  useEffect(() => {
    if (classTreeId == null) return;
    icsApi.getLawDetail(classTreeId).then(setIcs).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [classTreeId]);

  const text = (value?: string | null, height?: number) =>
    <Input.TextArea readOnly style={{ height, resize: 'none', flex: 1 }} value={value ?? ''} />;

  return (
    <>
      <LookupModal
        open={infoId != null}
        title="법규정보"
        width={1340}
        maskClosable={false}
        onCancel={onClose}
        focusFirst={false}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E1] closeButton[닫기].Select → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', height: 470 }}>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 20 }}>
            <div style={ROW}><Label>법규명</Label>{text(ics ? `(${ics.classTreeCode ?? ''}) ${ics.classTreeName ?? ''}` : '', 40)}</div>
            <div style={ROW}><Label>상세내용</Label>{text(ics?.content, 215)}</div>
            <div style={ROW}><Label>관련조문</Label>{text(ics?.relatedLaw, 70)}</div>
            <div style={ROW}><Label>제출처</Label>{text(ics?.submitTo, 40)}</div>
            <div style={ROW}><Label>기한</Label><Input readOnly value={deadlineName} /></div>
          </div>
          <div style={{ width: 2, background: '#d9d9d9', margin: '10px 0' }} />
          <div style={{ flex: 1, minWidth: 0, padding: '20px 0 0 5px' }}>
            <div style={{ display: 'flex', margin: '0 15px 15px 5px', height: 230 }}>
              <Label>개정이력</Label>
              <div style={{ flex: 1, minWidth: 0 }}><Ics01_Page_RevisionHistory classTreeId={classTreeId} /></div>
            </div>
            <div style={{ display: 'flex', margin: '0 15px 15px 5px', height: 170 }}>
              <Label>서식파일</Label>
              <div style={{ flex: 1, minWidth: 0 }}><Ics01_Page_IcsFile classTreeId={classTreeId} /></div>
            </div>
            <div style={ROW}>
              <Label>원인문서</Label>
              {/* [E2] apprName[원인문서].TriggerClick: 문서가 없으면 "원인문서가 없습니다", 있으면 문서창 */}
              <Input readOnly style={{ cursor: 'pointer' }} value={apprTitle} suffix={<SearchOutlined />}
                onClick={() => {
                  if (apprId == null || apprId === 0) { message.warning('원인문서가 없습니다'); return; }
                  setViewApprId(apprId);
                }} />
            </div>
          </div>
        </div>
      </LookupModal>
      {/* apprView(): ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval (열람권한 검사는 문서창이 한다) */}
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClose={() => setViewApprId(null)} />
    </>
  );
};
