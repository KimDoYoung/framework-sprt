/**
 * 사용자ID 신청서 편집 폼 (EE29) — Icam55_Tab_UserRegAppr 아래쪽
 * AS-IS: myApp/client/vi/icam/Icam55_Edit_UserRegAppr.java (305줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 getEditor() L121-192: 왼쪽 = 신청일자 · 회사명 · 사용자 · 처리구분(추가·변경·삭제 체크) · 등록자(읽기 전용),
 *   오른쪽 = "신청내용 :" 글자(눌러서 창으로 보기) + HTML 편집기. 아래 가운데 [저장].
 * 한 줄 라벨은 오른쪽 정렬(03 SGEF 규칙 2, 12 Page 4). 신청내용 편집기는 CKEditor(iframe) → HtmlEditor(Tiptap, 사용자 결정 2026-10-13).
 * 부르는 쪽이 key={선택 ID-조회 횟수}로 다시 만든다 (AS-IS retrieve()의 editDriver.edit(model)).
 * 스타일: MH (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useState } from 'react';
import { Checkbox, DatePicker, Input, message, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { icamUserApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamUser } from '@/types/icam';
import { Button } from '@/components/button';
import { HtmlEditor } from '@/components/form/HtmlEditor';
import { Icam55_Lookup_RegContent } from './Icam55_Lookup_RegContent';

const ROW: React.CSSProperties = { display: 'flex', alignItems: 'center', marginBottom: 8 };

const Label: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <Typography.Text strong style={{ width: 100, flex: 'none', textAlign: 'right', marginRight: 8, color: '#0069B4', cursor: onClick ? 'pointer' : undefined }} onMouseDown={onClick}>{children}</Typography.Text>
);

interface Props {
  /** 선택한 신청서 — 없으면 비활성 */
  model: IcamUser | null;
  /** 저장 뒤 그리드 행을 바꾼다 (AS-IS GridUpdate → grid.getStore().update(model)). 새 행이면 임시 번호가 저장된 번호로 바뀐다 */
  onSaved: (oldId: number, row: IcamUser) => void;
  /** 신청내용 창에서 저장한 뒤 그리드 행만 바꾼다 (AS-IS callback → grid.getStore().update(model)) */
  onContentSaved: (row: IcamUser) => void;
}

export const Icam55_Edit_UserRegAppr: React.FC<Props> = ({ model, onSaved, onContentSaved }) => {
  const disabled = !model;
  // [E0] 화면 열림 (생성자 L85-119) → getEditor() — 선택한 신청서로 칸을 채운다(부르는 쪽 key로 다시 만든다)
  const [regDate, setRegDate] = useState<string | null>(model?.regDate ?? null);
  const [companyName, setCompanyName] = useState(model?.companyName ?? '');
  const [userName, setUserName] = useState(model?.userName ?? '');
  const [procAddYn, setProcAddYn] = useState(model?.procAddYn ?? false);
  const [procModiYn, setProcModiYn] = useState(model?.procModiYn ?? false);
  const [procdelYn, setProcdelYn] = useState(model?.procdelYn ?? false);
  const [regContent, setRegContent] = useState(model?.regContent ?? '');
  const [contentKey, setContentKey] = useState(0);
  const [popup, setPopup] = useState<IcamUser | null>(null);
  const [saving, setSaving] = useState(false);

  // [E1] updateButton[저장].Select (L100) → updateRow() L209-277: 검사 순서·문구 그대로
  const updateRow = async () => {
    if (!model) return;
    if (['10', '20', '30'].includes(model.apprStatusCode ?? '')) { message.warning('결재 중인 문서이거나, 완료된 문서가 포함되어있습니다'); return; }
    if (!regDate) { message.warning('신청일자를 입력해주세요'); return; }
    if (!companyName) { message.warning('회사명을 입력해주세요'); return; }
    if (!userName) { message.warning('사용자를 입력해주세요'); return; }
    if (!procAddYn && !procModiYn && !procdelYn) { message.warning('처리구분을 선택해주세요'); return; }
    if (!regContent) { message.warning('신청내용을 입력해주세요'); return; }
    setSaving(true);
    try {
      const saved = await icamUserApi.save({
        icamUserId: model.icamUserId, regDate, companyName, userName, procAddYn, procModiYn, procdelYn, regContent,
      });
      message.success('저장이 완료되었습니다.');
      onSaved(model.icamUserId, saved);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : undefined, background: '#fff', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      <div style={{ display: 'flex', padding: '20px 20px 0 20px', flex: 1, minHeight: 0, minWidth: 1000, boxSizing: 'border-box' }}>
        <div style={{ width: 420, flex: 'none', marginRight: 40 }}>
          <div style={ROW}>
            <Label>신청일자</Label>
            <DatePicker style={{ width: 140 }} allowClear={false} value={regDate ? dayjs(regDate) : null} format="YYYY-MM-DD"
              onChange={d => setRegDate(d ? d.format('YYYY-MM-DD') : null)} />
          </div>
          <div style={ROW}><Label>회사명</Label><Input style={{ width: 250 }} value={companyName} onChange={e => setCompanyName(e.target.value)} /></div>
          <div style={ROW}><Label>사용자</Label><Input style={{ width: 250 }} value={userName} onChange={e => setUserName(e.target.value)} /></div>
          <div style={ROW}>
            <Label>처리구분</Label>
            <Checkbox checked={procAddYn} onChange={e => setProcAddYn(e.target.checked)}>추가</Checkbox>
            <Checkbox checked={procModiYn} onChange={e => setProcModiYn(e.target.checked)}>변경</Checkbox>
            <Checkbox checked={procdelYn} onChange={e => setProcdelYn(e.target.checked)}>삭제</Checkbox>
          </div>
          <div style={ROW}><Label>등록자</Label><Input readOnly disabled style={{ width: 140 }} value={model?.regEmpName ?? ''} /></div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', marginBottom: 8 }}>
            {/* [E2] anchor.MouseDown (L125) → Icam55_Lookup_RegContent.open(icamUserModel, callback → setHtmlText, grid.getStore().update(model)) */}
            <Tooltip title="클릭 시, 팝업으로 보기" placement="right">
              <Typography.Text strong style={{ color: '#0069B4', cursor: 'pointer', letterSpacing: 1 }} onMouseDown={() => model && setPopup(model)}>신청내용 :</Typography.Text>
            </Tooltip>
          </div>
          <div style={{ flex: 1, minHeight: 0, maxWidth: 700 }}>
            <HtmlEditor toolbar="client" key={contentKey} value={regContent} onChange={setRegContent} height={190} />
          </div>
        </div>
      </div>
      <div style={{ flex: 'none', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderTop: '1px solid #d9d9d9' }}>
        <Button type="save" loading={saving} onClick={updateRow}>저장</Button>
      </div>
      <Icam55_Lookup_RegContent
        model={popup}
        onClose={() => setPopup(null)}
        onSaved={row => { setRegContent(row.regContent ?? ''); setContentKey(k => k + 1); onContentSaved(row); }}
      />
    </div>
  );
};
