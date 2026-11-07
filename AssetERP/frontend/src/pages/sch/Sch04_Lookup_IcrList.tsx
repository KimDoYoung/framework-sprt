/**
 * 내규정보 창 (EE79) — AS-IS는 MyPage 오늘의 할일(Monitoring_Page_DayList)에서 업무구분 210(내규정보) 행을 더블클릭하면 연다
 * AS-IS: myApp/client/vi/sch/Sch04_Lookup_IcrList.java (286줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L65-76: 650×755 모달 "내규정보", 라벨 폭 80, 위에서 내규명 · 상세내용 · 관련조문 · 제출처 · 기한 · 서식파일(그리드) · 원인문서(조회창 입력칸) + [닫기]. 모두 읽기 전용
 * open(listModel, gubunCode, callback) L78-96 → settings(gubunCode) L98-: 기한(Sch03_Deadline.selectById(deadlineId)) 표시 후
 *   gubunCode "6": 내규(infoId = 내규 ID)를 읽어 채운다(setIcr L152: icr.Icr01_ClassTree.selectById → "(코드) 이름" · 상세내용 · 제출처 · 관련조문 + 서식파일)
 *   gubunCode "7": apr.Apr22_RelateIcr.selectById(relateIcrId = infoId) → 그 내규(setIcr) + 원인문서(setAppr L170: apr.Apr01_Appr.selectById → 제목)
 * 원인문서 [E2] apprName.TriggerClick (L138): 문서가 없으면 "원인문서가 없습니다", 있으면 전자결재 문서창(apprView L233)
 * TOBE에서는 MyPage Day List(`DayListBox`, EE106)와 법규 박스(`ComplianceGridBox`, EE105)가 연다. 법규판 Sch04_Lookup_IcsList(미변환 목록 31번)는 이 창과 쌍
 * 스타일: MF (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useState } from 'react';
import { Input, message, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { LookupModal } from '@/components/lookup/LookupModal';
import { aprRelateEditApi } from '@/api/apr';
import { icrApi } from '@/api/icr';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { IcrClassTreeDetail } from '@/types/icr';
import { Button } from '@/components/button';
import { Icr01_Page_IcrFile } from '@/components/lookup/Icr01_Page_IcrFile';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const ROW: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', margin: '15px 15px 0 5px' };
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography.Text strong style={{ width: 80, flex: 'none', paddingTop: 4 }}>{children}</Typography.Text>
);

interface Props {
  /** open(listModel, gubunCode, callback) — 할일 행의 relateId(내규 ID 또는 연관내규 ID). 값이 있으면 열린다 */
  infoId: number | null;
  /** 기한(Sch03_Deadline) ID — 할일 행의 deadlineId */
  deadlineId: number | null;
  /** 업무 구분 코드: "6" 내규 / "7" 연관내규(원인문서 있음) */
  gubunCode: string;
  onClose: () => void;
}

export const Sch04_Lookup_IcrList: React.FC<Props> = ({ infoId, deadlineId, gubunCode, onClose }) => {
  const [icr, setIcr] = useState<IcrClassTreeDetail | null>(null);
  const [deadlineName, setDeadlineName] = useState('');
  const [apprId, setApprId] = useState<number | null>(null);   // this.apprId
  const [apprTitle, setApprTitle] = useState('해당 없음');      // apprName.setValue("해당 없음")
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);

  // [E0] 화면 열림 → open() → settings() L98-
  useEffect(() => {
    setIcr(null); setDeadlineName(''); setApprId(null); setApprTitle('해당 없음'); setClassTreeId(null); setViewApprId(null);
    if (infoId == null) return;
    const fail = (err: unknown) => message.error(errorMessage(err, '조회 실패'));
    // setDeadline() L126: sch.Sch03_Deadline.selectById
    if (deadlineId != null) schApi.getDeadline(deadlineId).then(d => setDeadlineName(d.deadlineFullName ?? '')).catch(fail);
    if (gubunCode === '6') {
      setClassTreeId(infoId);
    } else if (gubunCode === '7') {
      // apr.Apr22_RelateIcr.selectById → setIcr(classTreeId) + setAppr(apprId)
      aprRelateEditApi.getRelateIcrOrigin(infoId).then(r => {
        setClassTreeId(r.classTreeId);
        setApprId(r.apprId);
        setApprTitle(r.apprTitle ?? '');
      }).catch(fail);
    }
  }, [infoId, deadlineId, gubunCode]);

  // setIcr() L152-168: icr.Icr01_ClassTree.selectById(classTreeId)
  useEffect(() => {
    if (classTreeId == null) return;
    icrApi.getDetail(classTreeId).then(setIcr).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [classTreeId]);

  const text = (value?: string | null, height?: number) =>
    <Input.TextArea readOnly style={{ height, resize: 'none', flex: 1 }} value={value ?? ''} />;

  return (
    <>
      <LookupModal
        open={infoId != null}
        title="내규정보"
        width={690}
        maskClosable={false}
        onCancel={onClose}
        focusFirst={false}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E1] closeButton[닫기].Select (L132) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ paddingBottom: 15 }}>
          <div style={ROW}><Label>내규명</Label>{text(icr ? `(${icr.classTreeCode ?? ''}) ${icr.classTreeName ?? ''}` : '', 40)}</div>
          <div style={ROW}><Label>상세내용</Label>{text(icr?.content, 215)}</div>
          <div style={ROW}><Label>관련조문</Label>{text(icr?.relatedLaw, 60)}</div>
          <div style={ROW}><Label>제출처</Label>{text(icr?.submitTo, 40)}</div>
          <div style={ROW}><Label>기한</Label><Input readOnly value={deadlineName} /></div>
          <div style={{ display: 'flex', margin: '15px 15px 0 5px', height: 130 }}>
            <Label>서식파일</Label>
            <div style={{ flex: 1, minWidth: 0 }}><Icr01_Page_IcrFile classTreeId={classTreeId} /></div>
          </div>
          <div style={ROW}>
            <Label>원인문서</Label>
            {/* [E2] apprName[원인문서].TriggerClick (L138): 문서가 없으면 "원인문서가 없습니다", 있으면 문서창 */}
            <Input readOnly style={{ cursor: 'pointer' }} value={apprTitle} suffix={<SearchOutlined />}
              onClick={() => {
                if (apprId == null || apprId === 0) { message.warning('원인문서가 없습니다'); return; }
                setViewApprId(apprId);
              }} />
          </div>
        </div>
      </LookupModal>
      {/* apprView() L233: ApprCallbackResult → Apr01_Edit_ApprDoc.retrieveApproval (열람권한 검사는 문서창이 한다) */}
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClose={() => setViewApprId(null)} />
    </>
  );
};
