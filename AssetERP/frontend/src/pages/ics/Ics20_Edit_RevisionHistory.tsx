/**
 * 법규개정내역 보기 폼 (H05) — Ics20_Tab_RevisionHistory 아래쪽
 * AS-IS: myApp/client/vi/ics/Ics20_Edit_RevisionHistory.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L86-158: 라벨 폭 90, 세 칸 = 등록일·소관부처·의견제출일·시행일·법규반영일(200) | 법규명·조문(540×55)·연결법규 그리드(540×175) | "내용 :" 글자(누르면 팝업)+내용 입력(545×140)·첨부파일 그리드(640×145)
 * 읽기 전용: 등록일·시행일·소관부처·법규명·내용. 그 밖(의견제출일·조문·법규반영일)은 AS-IS도 고칠 수 있게 두지만 저장 버튼이 없다(updateButton은 어디서도 열리지 않음)
 * 부르는 쪽은 key={선택 ID-조회 횟수}로 다시 만든다 (AS-IS retrieve() → editDriver.edit(model))
 */
import React, { useState } from 'react';
import { DatePicker, Input, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { IcsRevisionHistoryAdmin } from '@/types/ics';
import { Ics01_Lookup_ClassTreeDetail } from '@/components/lookup/Ics01_Lookup_ClassTreeDetail';
import { Ics19_Grid_IcsList } from './Ics19_Grid_IcsList';
import { Ics20_Grid_FileList } from './Ics20_Grid_FileList';
import { Ics20_Lookup_Content } from './Ics20_Lookup_Content';

const LABEL_W = 90;
const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', marginBottom: 10 };

const Label: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <Typography.Text strong style={{ width: LABEL_W, flex: 'none', cursor: onClick ? 'pointer' : undefined }} onMouseDown={onClick}>{children}</Typography.Text>
);

const DateView: React.FC<{ value?: string | null; readOnly?: boolean }> = ({ value, readOnly }) => (
  <DatePicker
    style={{ width: 140 }}
    defaultValue={value ? dayjs(value) : null}
    format="YYYY-MM-DD"
    inputReadOnly={readOnly}
    open={readOnly ? false : undefined}
    allowClear={!readOnly}
  />
);

interface Props {
  /** 선택한 개정내역 — 없으면 비활성 */
  model: IcsRevisionHistoryAdmin | null;
}

export const Ics20_Edit_RevisionHistory: React.FC<Props> = ({ model }) => {
  // [E0] 화면 열림 (생성자 L64-84) → getEditor(), show(): 폼에 선택한 개정내역 값을 채운다. 선택이 없으면 비운다
  const disabled = !model;
  const id = model?.revisionHistoryId ?? 0;
  const [detailId, setDetailId] = useState<number | null>(null);
  const [contentRevision, setContentRevision] = useState<IcsRevisionHistoryAdmin | null>(null);

  return (
    <div style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : undefined, background: '#fff', overflow: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', padding: '20px 20px 10px 20px', minWidth: 1500 }}>
        <div style={{ flex: 'none', width: 240, marginRight: 10 }}>
          <div style={ROW}><Label>등록일</Label><DateView value={model?.regDate} readOnly /></div>
          <div style={ROW}><Label>소관부처</Label><Input style={{ width: 140 }} readOnly value={model?.financeAgencyName ?? ''} /></div>
          <div style={ROW}><Label>의견제출일</Label><DateView value={model?.submissionDate} /></div>
          <div style={ROW}><Label>시행일</Label><DateView value={model?.effectDate} readOnly /></div>
          <div style={ROW}><Label>법규반영일</Label><DateView value={model?.reflectionDate} /></div>
        </div>
        <div style={{ flex: 'none', width: 640, marginRight: 10, display: 'flex', flexDirection: 'column' }}>
          <div style={ROW}><Label>법규명</Label><Input.TextArea style={{ width: 540, height: 55, resize: 'none' }} readOnly value={model?.title ?? ''} /></div>
          <div style={ROW}><Label>조문</Label><Input.TextArea style={{ width: 540, height: 55, resize: 'none' }} defaultValue={model?.relatedLaw ?? ''} /></div>
          <div style={{ display: 'flex' }}>
            <Label>연결법규</Label>
            <div style={{ width: 540, height: 175 }}><Ics19_Grid_IcsList revisionHistoryId={id} view onDetail={row => setDetailId(row.classTreeId)} /></div>
          </div>
        </div>
        <div style={{ flex: 'none', width: 640, marginLeft: 20, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', marginBottom: 10 }}>
            {/* [E1] anchor.MouseDown (L93) → Ics20_Lookup_Content.open(revisionHistoryModel, "user", callback → 내용 칸·그리드 갱신) */}
            <Tooltip title="클릭 시, 팝업으로 보기" placement="right">
              <span style={{ display: 'inline-block', width: 95, flex: 'none' }}>
                <Label onClick={() => model && setContentRevision(model)}>내용 :</Label>
              </span>
            </Tooltip>
            <Input.TextArea style={{ width: 545, height: 140, resize: 'none' }} readOnly value={model?.note ?? ''} />
          </div>
          <div style={{ display: 'flex' }}>
            <Label>첨부파일</Label>
            <div style={{ width: 545, height: 145 }}><Ics20_Grid_FileList parentId={id} userType="user" /></div>
          </div>
        </div>
      </div>
      <Ics01_Lookup_ClassTreeDetail classTreeId={detailId} onClose={() => setDetailId(null)} />
      <Ics20_Lookup_Content revision={contentRevision} userType="user" onClose={() => setContentRevision(null)} />
    </div>
  );
};
