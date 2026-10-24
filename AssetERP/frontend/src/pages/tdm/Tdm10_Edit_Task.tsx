/**
 * 책무 편집창 (N05) — 책무 등록의 [등록]·[등록(복사)]·수정 아이콘이 연다.
 * AS-IS: myApp/client/vi/tdm/Tdm10_Edit_Task.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 창 630×380(원본): 책무구분(콤보) · 책무유형(조회창 칸) · 책무(100 높이) · 공통책무 | 사용시작일 · CEO책무 | 사용종료일 + [세부내용(n건)][연결규정(n건)][저장][닫기]
 * 1단계: [연결규정(n건)]이 여는 Tdm11_Lookup_TaskRelateRule(연결법규·내규)은 다음 단계 — 누르면 안내만
 * UX보강(10): 조회창(UX-05·06은 Tdm14 안에서)
 */
import React, { useEffect, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmTask, TdmTaskSaveReq } from '@/types/tdm';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { AreaMessage } from '@/components/lookup/AreaMessage';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Tdm12_Lookup_TaskRelateDetail } from './Tdm12_Lookup_TaskRelateDetail';
import { Tdm14_Lookup_TaskType } from './Tdm14_Lookup_TaskType';

const FORMAT = 'YYYY-MM-DD';
const BLUE = '#0069B4';   // setHtmlStyle(…, "0069B4") 필수 항목 라벨

interface Props {
  /** INSERT = 등록, COPY = 등록(복사), UPDATE = 수정, null이면 닫힘 */
  mode: 'INSERT' | 'COPY' | 'UPDATE' | null;
  /** COPY·UPDATE: 선택한 책무 */
  task?: TdmTask | null;
  /** AS-IS callBack.execute() — 저장이 끝난 뒤 (부르는 쪽이 다시 조회). 닫기는 onClose */
  onSaved: () => void;
  onClose: () => void;
}

const Label: React.FC<{ required?: boolean; children: React.ReactNode }> = ({ required, children }) => (
  <div style={{ width: 100, textAlign: 'right', paddingRight: 8, fontWeight: 'bold', color: required ? BLUE : undefined, flex: 'none' }}>{children}</div>
);

export const Tdm10_Edit_Task: React.FC<Props> = ({ mode, task, onSaved, onClose }) => {
  const [taskId, setTaskId] = useState<number | null>(null);
  const [oldTaskId, setOldTaskId] = useState<number | null>(null);
  const [classCode, setClassCode] = useState<string | undefined>();
  const [typeCode, setTypeCode] = useState<string | null>(null);
  const [typeName, setTypeName] = useState<string | null>(null);
  const [taskName, setTaskName] = useState('');
  const [commonYn, setCommonYn] = useState(false);
  const [ceoYn, setCeoYn] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [detailCnt, setDetailCnt] = useState('0건');
  const [ruleCnt, setRuleCnt] = useState('0건');
  const [typeLookup, setTypeLookup] = useState(false);
  const [detailLookup, setDetailLookup] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);

  // [E0] 화면 열림 (생성자 L135-150) → setting(), show() / insert() L79-95, copy() L97-121, edit() L123-133: 열 때 값 채우기. 등록·복사는 새 책무 ID를 미리 받는다(DBUtil.setSeq)
  useEffect(() => {
    if (!mode) return;
    setOldTaskId(null);
    setTypeLookup(false); setDetailLookup(false); setReasonOpen(false);
    if (mode === 'UPDATE' && task) {
      setTaskId(task.taskId);
      setClassCode(task.taskClassCode ?? undefined);
      setTypeCode(task.taskTypeCode); setTypeName(task.taskTypeName);
      setTaskName(task.taskName ?? '');
      setCommonYn(task.commonYn === 'true'); setCeoYn(task.ceoYn === 'true');
      setStartDate(task.startDate ? dayjs(task.startDate) : null); setEndDate(task.endDate ? dayjs(task.endDate) : null);
      // retrieveRelate() L417-429: 건수가 없으면 0건
      setDetailCnt(task.taskRelateDetailCntStr || '0건');
      const rules = (task.taskRelateLawCnt ?? 0) + (task.taskRelateRuleCnt ?? 0);
      setRuleCnt(rules === 0 ? '0건' : `${rules}건`);
      return;
    }
    const copy = mode === 'COPY' && task;
    setClassCode(copy ? task.taskClassCode ?? undefined : undefined);
    setTypeCode(copy ? task.taskTypeCode : null); setTypeName(copy ? task.taskTypeName : null);
    setTaskName(copy ? task.taskName ?? '' : '');
    setCommonYn(copy ? task.commonYn === 'true' : false); setCeoYn(copy ? task.ceoYn === 'true' : false);
    setStartDate(null); setEndDate(null);
    setDetailCnt('0건'); setRuleCnt('0건');
    setOldTaskId(copy ? task.taskId : null);
    setTaskId(null);
    tdmApi.getTaskNextId().then(setTaskId).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [mode, task]);

  // [E3] taskClassName[책무구분].Collapse (L166) → 책무구분을 바꾸면 책무유형 초기화 (L169-175)
  const changeClass = (code: string | undefined) => {
    if (classCode && classCode !== code) {
      setTypeCode(null);
      setTypeName(null);
    }
    setClassCode(code);
  };

  // [E4] taskTypeName[책무유형].TriggerClick (L178) → lookupTaskType() L431-448
  const lookupTaskType = () => {
    if (!classCode) {
      message.warning('책무구분을 선택해주세요');
      return;
    }
    setTypeLookup(true);
  };

  // [E5] relateDetailButton[세부내용(n건)].Select (L185): 책무구분 필수 → Tdm12_Lookup_TaskRelateDetail
  const openDetail = () => {
    if (!classCode) {
      message.warning('책무구분은 필수선택 항목입니다');
      return;
    }
    setDetailLookup(true);
  };

  // [E6] relateRuleButton[연결규정(n건)].Select (L207) → Tdm11_Lookup_TaskRelateRule: 다음 단계
  const openRule = () => {
    message.info('연결규정(연결법규·연결내규) 창은 아직 변환되지 않았습니다 (다음 단계).');
  };

  const req = (): TdmTaskSaveReq => ({
    taskId,
    taskClassCode: classCode ?? null,
    taskTypeCode: typeCode,
    taskName: taskName || null,
    commonYn: String(commonYn),
    ceoYn: String(ceoYn),
    startDate: startDate ? startDate.format(FORMAT) : null,
    endDate: endDate ? endDate.format(FORMAT) : null,
  });

  // [E1] updateButton[저장].Select (L153) → preUpdate() L272-317
  const preUpdate = () => {
    if (!classCode) { message.warning('책무구분은 필수선택 항목입니다'); return; }
    if (!typeCode) { message.warning('책무유형은 필수선택 항목입니다'); return; }
    if (!taskName) { message.warning('책무는 필수입력 항목입니다'); return; }
    if (!startDate) { message.warning('사용시작일은 필수선택 항목입니다'); return; }
    if (mode === 'UPDATE' && task) {
      // getHistoryMap() L342-415: 바뀐 것이 없으면 안내, 있으면 변경사유를 받는다
      const unchanged =
        (task.taskClassCode ?? '') === classCode && (task.taskTypeCode ?? '') === typeCode && (task.taskName ?? '') === taskName &&
        (task.commonYn === 'true') === commonYn && (task.ceoYn === 'true') === ceoYn &&
        (task.startDate ?? '') === startDate.format(FORMAT) && (task.endDate ?? '') === (endDate ? endDate.format(FORMAT) : '');
      if (unchanged) {
        message.warning('변경사항이 없습니다');
        return;
      }
      setReasonOpen(true);
    } else {
      void update(null);
    }
  };

  // update() L319-340: tdm.Tdm10_Task.modelUpdate (actionType INSERT·COPY·UPDATE, 복사면 oldTaskId) → callBack, hide()
  const update = async (reason: string | null) => {
    try {
      if (mode === 'UPDATE' && taskId) {
        await tdmApi.updateTask(taskId, { ...req(), reason });
      } else {
        await tdmApi.createTask({ ...req(), oldTaskId });
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <LookupModal
      open={!!mode}
      title="책무"
      width={630}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="change" style={{ width: 150 }} onClick={openDetail}>세부내용({detailCnt})</Button>
            <Button type="change" style={{ width: 150 }} onClick={openRule}>연결규정({ruleCnt})</Button>
            <Button type="save" onClick={preUpdate}>저장</Button>
            {/* [E2] closeButton[닫기].Select (L159) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '10px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label required>책무구분</Label>
          <SystemCodeComboBox kindCd="TdmTaskClassCode" placeholder="선택하세요" style={{ flex: 1 }} value={classCode} onChange={code => changeClass(code)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label required>책무유형</Label>
          <LookupInput value={typeName ?? ''} width={470} onOpen={lookupTaskType} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <Label required>책무</Label>
          <Input.TextArea value={taskName} onChange={e => setTaskName(e.target.value)} style={{ height: 100, resize: 'none', flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label>공통책무</Label>
          <div style={{ width: 250 }}><Checkbox checked={commonYn} onChange={e => setCommonYn(e.target.checked)} /></div>
          <Label required>사용시작일</Label>
          <DatePicker value={startDate} format={FORMAT} allowClear={false} onChange={d => setStartDate(d)} style={{ width: 140 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Label>CEO책무</Label>
          <div style={{ width: 250 }}><Checkbox checked={ceoYn} onChange={e => setCeoYn(e.target.checked)} /></div>
          <Label>사용종료일</Label>
          <DatePicker value={endDate} format={FORMAT} onChange={d => setEndDate(d)} style={{ width: 140 }} />
        </div>
      </div>
      <Tdm14_Lookup_TaskType
        mode={typeLookup ? 'view' : null}
        taskClassCode={classCode}
        onResult={t => { setTypeCode(t.taskTypeCode); setTypeName(t.taskTypeName); }}
        onClose={() => setTypeLookup(false)}
      />
      <Tdm12_Lookup_TaskRelateDetail
        task={detailLookup && taskId ? { taskId, taskName } : null}
        onClosed={count => setDetailCnt(`${count}건`)}
        onClose={() => setDetailLookup(false)}
      />
      <AreaMessage open={reasonOpen} title="변경사유" required
        onResult={text => { if (text == null) message.warning('저장이 취소되었습니다 (변경사유 미입력)'); else void update(text); }}
        onClose={() => setReasonOpen(false)} />
    </LookupModal>
  );
};

