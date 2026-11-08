/**
 * 업무일정 창 (나의일정 상세) — MyPage 일정 박스 나의일정 [상세보기]가 연다 (EE109)
 * AS-IS: myApp/client/vi/sch/Sch04_Lookup_SchList.java (286줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L137-182: 650×640 모달 "업무일정", 라벨 폭 80. 줄: 처리여부(코드 ScheduleStatusCode)·처리일·처리자 / 분류 / 일정명(글상자 85) / 상세내용(글상자 235) / 기한 / 비고
 *   단추 [저장][닫기][첨부파일 확인(n)]. 창을 닫으면(hideCallback) 부른 화면의 callback이 돈다(MyPage: retrieve01)
 * open(listModel, gubunCode, callback) L79-94: sch.Sch03_Deadline.selectById → settings() L96-135(값 채우기, 010이면 sch.Sch01_Info.selectById의 상세내용)
 * view() L71-77(읽기 전용: 처리여부·마감일 잠금, [저장] 숨김)은 메뉴 #1440 (X)기간별 스케줄 조회만 써서 readOnly prop으로만 둔다
 * 스타일: MF (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useState } from 'react';
import { DatePicker, Input, Modal, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { schApi } from '@/api/sch';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import type { Sch04Todo } from '@/types/sch';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Bbs02_Lookup_File } from '@/pages/bbs/Bbs02_Lookup_File';

export interface SchListTarget {
  /** sch.Sch04_List.selectByToDoList 한 건 */
  row: Sch04Todo;
  /** "010" 나의일정 — 상세내용을 일정에서 읽는다 */
  gubunCode: string;
  /** view(): 읽기 전용 */
  readOnly?: boolean;
}

interface Props {
  target: SchListTarget | null;
  /** hide() → hideCallback → callback.execute() — [닫기]·[저장] 뒤 */
  onClose: () => void;
}

const LABEL: React.CSSProperties = { width: 80, flex: '0 0 auto', textAlign: 'right', paddingRight: 10 };
const Row: React.FC<{ label: string; width?: number; top?: boolean; children: React.ReactNode }> = ({ label, width = 600, top, children }) => (
  <div style={{ display: 'flex', alignItems: top ? 'flex-start' : 'center', width }}>
    <span style={{ ...LABEL, paddingTop: top ? 4 : 0 }}>{label}</span>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

export const Sch04_Lookup_SchList: React.FC<Props> = ({ target, onClose }) => {
  const user = useLoginUser();
  const [statusCode, setStatusCode] = useState<string | null>(null);
  const [manageDate, setManageDate] = useState<Dayjs | null>(null);
  const [deadlineFullName, setDeadlineFullName] = useState('');
  const [note, setNote] = useState('');
  const [content, setContent] = useState('');
  const [fileCount, setFileCount] = useState(0);
  const [showFiles, setShowFiles] = useState(false);
  const [saving, setSaving] = useState(false);
  const row = target?.row;
  const readOnly = target?.readOnly === true;

  // [E0] 화면 열림 → open() L79-94 → settings() L96-135
  useEffect(() => {
    setDeadlineFullName(''); setNote(''); setContent(''); setFileCount(0);
    if (!target) return;
    const r = target.row;
    setStatusCode(r.statusCode ?? null);
    setManageDate(r.manageDate ? dayjs(r.manageDate) : null);
    const fail = (err: unknown) => message.error(errorMessage(err, '조회 실패'));
    // sch.Sch03_Deadline.selectById(deadlineId) → 비고·기한
    if (r.deadlineId != null) schApi.getDeadline(r.deadlineId).then(d => { setNote(d.note ?? ''); setDeadlineFullName(d.deadlineFullName ?? ''); }).catch(fail);
    // setFileButtonText() L265-276: sys.Sys10_File.selectByParentId(infoId) → "첨부파일 확인(n)"
    if (r.infoId != null) fileApi.searchByParentId(r.infoId).then(l => setFileCount(l.length)).catch(() => setFileCount(0));
    // gubunCode "010"(나의일정): sch.Sch01_Info.selectById → 상세내용
    if (target.gubunCode === '010' && r.infoId != null) schApi.getInfo(r.infoId).then(i => setContent(i.content ?? '')).catch(fail);
  }, [target]);

  // [E2] updateButton[저장].Select (L156) → update() L231-263: 담당자만, 처리일이 비면 오늘 → sch.Sch04_List.insertCheck → callback, hide()
  const update = async () => {
    if (!row) return;
    if (row.personId !== user.userId) { message.info('담당자만 수정가능합니다'); return; }
    setSaving(true);
    try {
      await schApi.saveTodo([{ ...row, statusCode, manageDate: (manageDate ?? dayjs()).format('YYYY-MM-DD') }]);
      message.success('저장되었습니다');
      onClose();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    } finally { setSaving(false); }
  };

  return (
    <Modal
      open={target != null}
      title="업무일정"
      width={650}
      centered
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 0 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {!readOnly && <Button type="save" loading={saving} onClick={update}>저장</Button>}
          {/* [E3] closeButton[닫기].Select (L162) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
          {/* [E4] fileButton[첨부파일 확인].Select (L168) → Bbs02_Lookup_File.openUser(parentId = infoId) */}
          <Button type="view" onClick={() => setShowFiles(true)}>{`첨부파일 확인(${fileCount})`}</Button>
        </div>
      }
    >
      {/* getEditor() L184-229 */}
      <div style={{ padding: '12px 2px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex' }}>
          <Row label="처리여부" width={200}>
            {/* [E1] statusName[처리여부].Collapse (L150) → statusCode = 고른 코드 */}
            <SystemCodeComboBox kindCd="ScheduleStatusCode" value={statusCode ?? undefined} onChange={v => setStatusCode(v ?? null)} disabled={readOnly} allowClear={false} style={{ width: '100%' }} />
          </Row>
          <Row label="처리일" width={200}>
            <DatePicker value={manageDate} onChange={setManageDate} format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Row>
          <Row label="처리자" width={200}><Input readOnly value={row?.personName ?? ''} /></Row>
        </div>
        <Row label="분류"><Input readOnly value={row?.className ?? ''} /></Row>
        <Row label="일정명" top><Input.TextArea readOnly value={row?.title ?? ''} style={{ height: 85, resize: 'none' }} /></Row>
        <Row label="상세내용" top><Input.TextArea readOnly value={content} style={{ height: 235, resize: 'none' }} /></Row>
        <Row label="기한"><Input readOnly value={deadlineFullName} /></Row>
        <Row label="비고"><Input readOnly value={note} /></Row>
      </div>
      <Bbs02_Lookup_File open={showFiles} parentId={row?.infoId} onClose={() => setShowFiles(false)} />
    </Modal>
  );
};
