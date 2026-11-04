/**
 * 연장근무 신청 창 (EE73) — 출퇴근 창(Att02_Lookup_Commute)의 [연장근무신청]이 연다
 * AS-IS: myApp/client/vi/att/Att03_Lookup_OvertimeReq.java (947줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L101-132: 1250×300 모달(크기 고정), 머리말 "연장근무 신청", 툴바 50 = [근무일자 ◀ 날짜 ▶][조회][등록][저장][삭제] + 안내 줄(label01) + 셀 편집 그리드(체크 없음) + [닫기]
 * 그리드 buildGrid L247-326: 근무일자 100 · 구분 100 · 연장시간(분) 100(편집) · 근무시간 200 · 사유 350(편집) · 보상 150(편집, 콤보) · 상태 100 · 상신(보기) 80(아이콘)
 * 연장시간을 고치면 시간을 다시 계산한다(recalcFrom L393): 첫 행은 퇴근시간(야간근무면 야간 시작)부터 이어 붙이고, 연장근무가 야간 시작을 넘으면 야간근무 행을 만든다(insertNightRow L568)
 * 상신(보기) 아이콘 L270-311: 변경이 있으면 "저장 후 진행가능합니다" → 상태 10·20·30이면 결재문서 보기, 아니면 insertLinkApproval()(링크코드 A74, 문서분류는 defaultInfo L182의 Dcr30_Link)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Space, message } from 'antd';
import dayjs from 'dayjs';
import { attApi } from '@/api/att';
import { dcrApi } from '@/api/dcr';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { AttMyOvertime, AttMyOvertimeInfo, AttMyOvertimeSettings } from '@/types/att';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { sanitizeHtml } from '@/components/grid/renderers';
import { QuickMoveDateField } from '@/components/form/QuickMoveDateField';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const gb = gbFor<AttMyOvertime>();
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;
const LINK_CODE = 'A74';
const FMT = 'YYYY-MM-DD';
const FONT_COLOR = '#365B9D';
/** 10 상신 · 20 결재중 · 30 결재완료 */
const locked = (code?: string | null) => code === '10' || code === '20' || code === '30';

/** timeToMinutes() L472 */
const timeToMinutes = (time?: string | null): number => {
  if (!time) return 0;
  const [h, m] = time.split(':');
  return parseInt(h, 10) * 60 + parseInt(m, 10);
};
/** minutesToTime() L480: 24시간(1440분) 기준으로 순환 */
const minutesToTime = (total: number): string => {
  const t = ((total % 1440) + 1440) % 1440;
  const h = Math.floor(t / 60);
  const m = t % 60;
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`;
};

interface Code { code: string; name: string }

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Att03_Lookup_OvertimeReq: React.FC<Props> = ({ open, onClose }) => {
  const [baseDate, setBaseDate] = useState(dayjs().format(FMT));  // settings() L135 baseDate.setDate(LoginUser.getToday())
  const [markedDates, setMarkedDates] = useState<string[]>([]);
  const [settings, setSettings] = useState<AttMyOvertimeSettings | null>(null);
  const [info, setInfo] = useState<AttMyOvertimeInfo | null>(null);
  const [rewards, setRewards] = useState<Code[]>([]);
  const [classTreeId, setClassTreeId] = useState<number | null>(null);  // defaultInfo() L182: 정확히 1건일 때만
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [linkDoc, setLinkDoc] = useState<{ overtimeReqId: number } | null>(null);
  const linkSaved = useRef(false);
  const crudRef = useRef<ReturnType<typeof useGridCrud<AttMyOvertime>> | null>(null);
  const baseDateRef = useRef(baseDate);
  baseDateRef.current = baseDate;
  const settingsRef = useRef<AttMyOvertimeSettings | null>(null);
  const deleteIdsRef = useRef<number[]>([]);  // deleteList: 고친 연장시간 아래로 뺀 하위 행
  const calcLock = useRef(false);

  // getMarkingList() L768: att.Att03_OvertimeReq.selectByYearMonth → 달력에 신청이 있는 날짜 표시
  const getMarkingList = useCallback((yyyyMM: string) => {
    attApi.searchMyOvertimeDates(yyyyMM).then(setMarkedDates).catch(() => setMarkedDates([]));
  }, []);

  // retrieveLabel() L797: att.Att03_OvertimeReq.getInfo → 안내 줄
  const retrieveLabel = useCallback((date: string) => {
    attApi.getMyOvertimeInfo(date).then(setInfo).catch(() => setInfo(null));
  }, []);

  // defaultInfo() L182: att.Att01_WorkPolicy.getModel(근태 정책) + pay.Pay34_WorkTimeConfig.getModel(근로시간 기준)
  const defaultInfo = useCallback((date: string) => {
    attApi.getMyOvertimeSettings(date)
      .then(s => { settingsRef.current = s; setSettings(s); })
      .catch(() => undefined);
  }, []);

  const crud = useGridCrud<AttMyOvertime>({
    idField: 'overtimeReqId',
    // retrieve() L750: deleteList 비움 → att.Att03_OvertimeReq.selectByPersonId(내 ID, baseDate) → getMarkingList() + retrieveLabel()
    search: useCallback(async () => {
      deleteIdsRef.current = [];
      const date = baseDateRef.current;
      const list = await attApi.searchMyOvertimes(date);
      getMarkingList(date.slice(0, 7).replace('-', ''));
      retrieveLabel(date);
      return list;
    }, [getMarkingList, retrieveLabel]),
    // updateChk01 L595 → updateChk02 L655 → update L730: 서버가 같은 순서로 검사하고(중복·주간 합계) 뺀 행 삭제 → 저장한다. 저장 뒤 다시 조회
    save: useCallback(async (changed: AttMyOvertime[]) => {
      const ids = new Set(changed.map(r => r.overtimeReqId));
      const all = crudRef.current?.rows ?? changed;
      await attApi.saveMyOvertimes({
        baseDate: baseDateRef.current,
        rows: all.map(r => ({
          overtimeReqId: r.overtimeReqId, workDate: r.workDate, workTypeCode: r.workTypeCode ?? null, overtimeMin: r.overtimeMin ?? null,
          reason: r.reason ?? null, workRewardTypeCode: r.workRewardTypeCode ?? null, changed: ids.has(r.overtimeReqId),
        })),
        deleteIds: deleteIdsRef.current,
      });
      return changed;
    }, []),
    remove: useCallback((ids: number[]) => attApi.deleteMyOvertimes(ids), []),
    reloadAfterSave: true,
    newRow: () => ({ workDate: baseDateRef.current }),
    firstEditField: 'overtimeMin',
    deleteConfirm: false,
    // updateChk01 L595-653: 바뀐 행(결재 중·완료 불가 → 근무일자 → 구분 → 연장시간 → 사유 → 보상) 뒤 야간근무 한도 (서버도 같은 검사)
    validate: (changed, all) => {
      for (const m of changed) {
        if (locked(m.statusCode)) return '결재진행/완료된 연장근무내역은 수정할 수 없습니다.';
        if (!m.workDate) return '근무일자를 지정해주세요';
        if (!m.workTypeCode) return '구분값을 지정해주세요';
        if (m.overtimeMin == null) return '연장시간(분)를 지정해주세요';
        if (m.reason == null || m.reason === '') return '사유를 지정해주세요';
        if (!m.workRewardTypeCode) return '보상구분값을 지정해주세요';
      }
      const ntEnd = settingsRef.current?.ntEndTime;
      const limit = timeToMinutes(ntEnd);
      for (const m of all) {
        if (!m.endTimeStr) continue;
        const endMin = timeToMinutes(m.endTimeStr);
        if (m.workTypeCode === '20') {
          if ((m.overtimeMin ?? 0) > 720) return '연장시간(분)을 다시 입력해주세요 ';
          if ((m.overtimeMin ?? 0) > 130 && endMin > limit) return `${m.workTypeName ?? ''} 종료시간은 ${ntEnd}을 초과할 수 없습니다.`;
        }
      }
      return undefined;
    },
  });
  crudRef.current = crud;
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L101-132) → settings()(defaultInfo, 오늘), show(). open() L97 → retrieve()
  useEffect(() => {
    if (!open) return;
    const today = dayjs().format(FMT);
    setBaseDate(today);
    baseDateRef.current = today;
    setClassTreeId(null);
    setInfo(null);
    defaultInfo(today);
    void retrieve();
    dcrApi.searchClassTreeByLinkCode(LINK_CODE)
      .then(list => { if (list.length === 1) setClassTreeId(list[0].classTreeId); })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 보상 콤보 ComboBoxField("WorkRewardTypeCode") (L255)
  useEffect(() => {
    if (!open) return;
    sysApi.searchCodes('WorkRewardTypeCode').then(setRewards).catch(() => setRewards([]));
  }, [open]);

  // setTime() L465: 시작·종료·근무시간 문자열을 행에 넣는다
  const timePatch = (start: string, end: string) => ({ startTimeStr: start, endTimeStr: end, overTimeStr: `${start} ~ ${end}` });

  // recalcFrom() L393-463: target 행부터 시간을 다시 계산한다. target은 편집 중이라 제자리에서 고치고(셀 편집이 변경으로 표시), 나머지는 updateRow로 고친다
  const recalcFrom = (list: AttMyOvertime[], target: AttMyOvertime) => {
    if (calcLock.current) return;
    calcLock.current = true;
    try {
      const st = settingsRef.current;
      if (!st?.policyFound) return;  // workPolicyModel == null
      const idx = list.findIndex(r => r.overtimeReqId === target.overtimeReqId);
      if (idx < 0) return;
      const nightStartMin = timeToMinutes(st.ntStartTime);
      let cur: number;
      if (idx === 0) cur = target.workTypeCode === '20' ? nightStartMin : timeToMinutes(st.workEndTime);
      else cur = timeToMinutes(list[idx - 1].endTimeStr);

      for (let i = idx; i < list.length; i++) {
        const m = list[i];
        const apply = (patch: Partial<AttMyOvertime>) => {
          if (m.overtimeReqId === target.overtimeReqId) Object.assign(m, patch);
          else crud.updateRow(m.overtimeReqId, patch);
        };
        if (m.overtimeMin == null) { apply(timePatch('', '')); continue; }
        const start = cur;
        const end = cur + m.overtimeMin;
        // 10:연장근무가 야간 시작을 넘으면 낮 부분만 남기고 넘은 부분은 야간근무 행으로 (insertNightRow L568-593)
        if (m.workTypeCode === '10' && start < nightStartMin && end > nightStartMin) {
          const dayEnd = nightStartMin;
          const nightMin = end - dayEnd;
          apply({ overtimeMin: dayEnd - start, ...timePatch(minutesToTime(start), minutesToTime(dayEnd)) });
          crud.addRows([{
            workDate: m.workDate, reason: m.reason, workTypeCode: '20', workTypeName: '야간근무',
            workRewardTypeCode: m.workRewardTypeCode, workRewardTypeName: m.workRewardTypeName, overtimeMin: nightMin,
            ...timePatch(minutesToTime(dayEnd), minutesToTime(end)),
          }], true, m.overtimeReqId);
          return;
        }
        apply(timePatch(minutesToTime(start), minutesToTime(end)));
        cur = end;
      }
    } finally {
      calcLock.current = false;
    }
  };

  // overtimeField (LongField) ValueChange [E10] (L259-275) → 연장근무(10)면 handleChildRows() → recalcFrom()
  const onOvertimeMinSet = (row: AttMyOvertime, value: number | null): boolean => {
    let list = crud.rows;
    if (row.workTypeCode === '10') {
      // handleChildRows() L367-391: 아래 행에 결재 중·완료가 있으면 불가, 아니면 아래 행을 모두 빼서 deleteList에
      const idx = list.findIndex(r => r.overtimeReqId === row.overtimeReqId);
      const below = idx < 0 ? [] : list.slice(idx + 1);
      if (below.some(m => locked(m.statusCode))) {
        message.warning('하위에 결재진행/완료된 연장근무내역이 있어 수정할 수 없습니다.');
        return false;
      }
      if (below.length > 0) {
        deleteIdsRef.current.push(...below.map(m => m.overtimeReqId).filter(id => id > 0));
        crud.removeRows(below.map(m => m.overtimeReqId));
        list = list.slice(0, idx + 1);
      }
    }
    row.overtimeMin = value;
    recalcFrom(list, row);
    return true;
  };

  // updateApprId() L348-365: 상신한 문서 ID를 행에 기록 → retrieve()
  const updateApprId = async (apprId: number) => {
    if (!linkDoc) return;
    linkSaved.current = true;
    try {
      await attApi.updateMyOvertimeAppr(linkDoc.overtimeReqId, apprId);
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '상신 문서를 기록하지 못했습니다'));
    }
  };

  // 상신(보기) 아이콘 actionCell01 [E11] (L270-311)
  const onAction = (row: AttMyOvertime) => {
    if (crud.hasChanges() || row.overtimeReqId <= 0) { message.warning('저장 후 진행가능합니다'); return; }
    if (locked(row.statusCode)) {
      if (row.apprId == null) { message.warning('해당문서의 열람권한이 없습니다'); return; }
      setViewApprId(row.apprId);
      return;
    }
    // insertLinkApproval() L328-346
    if (classTreeId == null) { message.warning('관련 문서분류가 존재하지않습니다. 관리자에게 연락해주세요'); return; }
    linkSaved.current = false;
    setLinkDoc({ overtimeReqId: row.overtimeReqId });
  };

  // buildGrid() L247-326 (setSortable(false))
  const columnDefs = useMemo(() => [
    gb.date('workDate', 100, '근무일자'),                                  // L316
    gb.textCenter('workTypeName', 100, '구분'),                            // L317
    gb.long('overtimeMin', 100, '연장시간(분)', {                           // L318 (LongField — E10)
      editor: 'number',
      valueSetter: p => onOvertimeMinSet(p.data, p.newValue == null || p.newValue === '' ? null : Number(p.newValue)),
    }),
    gb.textCenter('overTimeStr', 200, '근무시간'),                          // L319
    gb.text('reason', 350, '사유', { editor: 'text' }),                    // L320
    gb.textCenter('workRewardTypeName', 150, '보상', {                      // L321 (rewardType 콤보 — E9)
      editor: 'select',
      values: rewards.map(c => c.name),
      valueSetter: p => {
        p.data.workRewardTypeName = p.newValue;
        p.data.workRewardTypeCode = rewards.find(c => c.name === p.newValue)?.code ?? p.data.workRewardTypeCode;
        return true;
      },
    }),
    gb.textStatus('statusName', 100, '상태'),                              // L322
    iconCell<AttMyOvertime>('edit', 'actionCell', 80, '상신(보기)', onAction),  // L323
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [classTreeId, rewards]);

  // [E4] insertButton[등록].Select (L155) → insertRow01() L496-531 → insertRow02() L533-566
  const insertRow01 = async () => {
    if (!baseDate) { message.warning('신청일자를 지정해주세요'); return; }
    try {
      const s = await attApi.getMyOvertimeSettings(baseDate);  // att.Att05_PmWork.getWorkDateInfo (그날 오후근무)
      if (!s.policyFound) return;  // AS-IS: workPolicyModel == null이면 스크립트 오류로 아무 일도 안 일어난다
      // 오후근무가 있으면 오후근무 퇴근시간, 없으면 일반 퇴근시간부터
      const workStartMin = timeToMinutes(s.pmWorkOnDate ? s.pmWorkEndTime : s.workEndTime);
      const ntStartMin = timeToMinutes(s.ntStartTime);
      const ntEndMin = timeToMinutes(s.ntEndTime);
      const isNightWork = ntStartMin < ntEndMin
        ? workStartMin >= ntStartMin && workStartMin < ntEndMin        // 야간이 자정을 넘지 않는 경우
        : workStartMin >= ntStartMin || workStartMin < ntEndMin;       // 자정을 넘는 경우 (22:00 ~ 06:00)
      crud.addRows([{
        workDate: baseDate,
        workTypeCode: isNightWork ? '20' : '10', workTypeName: isNightWork ? '야간근무' : '연장근무',
        workRewardTypeCode: '10', workRewardTypeName: '연장근로수당',
      }], false);
    } catch (err) {
      message.error(errorMessage(err, '기준 정보를 읽지 못했습니다'));
    }
  };

  // [E6] deleteButton[삭제].Select (L167) → deleteRow() L829-865: 결재 중·완료 안내 → 뒤에 행이 있으면 안내 → 확인(폭 350) → [E12] YES → delete
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('삭제할 행을 선택하세요.'); return; }
    const target = selected[0];
    if (locked(target.statusCode)) { message.warning('결재완료된 항목은 삭제불가능합니다'); return; }
    const index = crud.rows.findIndex(r => r.overtimeReqId === target.overtimeReqId);
    if (index >= 0 && index + 1 < crud.rows.length) {
      message.warning('연장근무와 야간근무가 함께 신청된 건은 야간근무를 먼저 삭제해야합니다');
      return;
    }
    Modal.confirm({
      title: '확인', content: '해당 정보를 삭제하시겠습니까?', width: 350, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          if (target.overtimeReqId > 0) await attApi.deleteMyOvertimes([target.overtimeReqId]);
          crud.removeRows([target.overtimeReqId]);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // baseDate(QuickMoveDateField) [E1] callbackOnCreate (L71) → defaultInfo() + retrieve(). 날짜를 옮기거나 고르면
  const onCommit = (v: string) => { baseDateRef.current = v; defaultInfo(v); void retrieve(); };

  // 안내 줄 label01: 기본은 정책 문구(defaultInfo), 조회 뒤 getInfo가 있으면 주간·월간 현황(retrieveLabel L797-827)
  const labelHtml = info
    ? `※ 주간 최대 연장근무 가능시간 : ${info.weekReport ?? ''} 시간 / 월간 연장근무 현황 : 총 ${info.monthReport ?? ''} 시간`
    : `※ 주간 최대 연장근무 가능시간 : ${settings?.weekMaxAddHours ?? 12}시간 / 야간근로 가능시간 : ${settings?.ntStartTime ?? '22:00'} ~ ${settings?.ntEndTime ?? '06:00'}`;

  return (
    <>
      <LookupModal
        open={open}
        title="연장근무 신청"
        width={1250}
        maskClosable={false}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              {/* [E7] closeButton[닫기].Select (L173) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 200, display: 'flex', flexDirection: 'column', gap: 8, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 'bold' }}>근무일자</span>
            {/* [E2] baseDate.Dom (L136) → getMarkingList(): 달력이 열리거나 달이 바뀔 때 신청 있는 날짜 표시 */}
            <QuickMoveDateField value={baseDate} onChange={setBaseDate} onCommit={onCommit}
              markedDates={markedDates} onMonthChange={m => getMarkingList(m.replace('-', ''))} />
            {/* [E3] retrieveButton[조회].Select (L149) → retrieve() */}
            <Button type="search" onClick={() => retrieve()}>조회</Button>
            <Button type="register" onClick={insertRow01}>등록</Button>
            {/* [E5] updateButton[저장].Select (L161) → updateChk01() */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
            <span style={{ fontSize: 12, color: FONT_COLOR, marginLeft: 8 }} dangerouslySetInnerHTML={{ __html: sanitizeHtml(labelHtml) }} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<AttMyOvertime> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_SELECTION} />
          </div>
        </div>
      </LookupModal>
      {/* insertLinkApproval() / retrieveApproval(): Apr01_Edit_ApprDoc */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        link={linkDoc && classTreeId != null ? { classTreeId, linkCode: LINK_CODE, refId: linkDoc.overtimeReqId } : null}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => { if (linkDoc && !linkSaved.current) void retrieve(); }}
        onClose={() => { setViewApprId(null); setLinkDoc(null); }}
      />
    </>
  );
};
