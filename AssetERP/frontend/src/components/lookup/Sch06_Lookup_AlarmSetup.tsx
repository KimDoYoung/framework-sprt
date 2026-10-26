/**
 * 알람설정 창 (O01) — Sch01_Lookup_Info의 [알람설정]에서 연다. 공모주(IPO)·공지(BBS) 화면도 같은 창을 쓴다(AS-IS targetCode)
 * AS-IS: myApp/client/vi/sch/Sch06_Lookup_AlarmSetup.java (367줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 open() L71-114: 모달 650×350 "알람설정"(BBS는 "알람설정 (공지일 기준)"), 위 툴바 50([조회][등록][저장][삭제] + "* 알람은 메일로 발송됩니다" 527BB7),
 *   그리드(체크 다중 + 셀 편집, 2단 헤더 일/주·시간·휴일지정·사용), 아래 가운데 [닫기]
 * [생략] IPO 전용 ipoGrid(L95-98·L303-310 ipoGrid.update/retrieve)는 이 창을 SCH로만 쓰는 O01에서 만들지 않는다 — 공모주 알람 화면을 변환할 때 더한다
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { schApi } from '@/api/sch';
import { sysApi } from '@/api/sys';
import { Sch06Alarm } from '@/types/sch';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Sch06Alarm>();
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

export interface AlarmTarget {
  /** AlarmTargetCode — SCH 스케줄 / IPO 공모주 / BBS 공지사항 */
  targetCode: string;
  /** 대상 ID (sch01_info_id …) */
  targetId: number;
}

interface Props {
  /** open(targetCode, targetId, callback) L71 — 값이 있으면 열린다 */
  target: AlarmTarget | null;
  /** closeButton[닫기]의 callback.execute() */
  onClosed?: () => void;
  /** 창의 닫기(X) — callback 없이 닫는다 */
  onClose: () => void;
}

type CodeKey = 'dayWeek' | 'befAft' | 'amPm' | 'hour' | 'minute' | 'holiday';
const KINDS: Record<CodeKey, string> = { dayWeek: 'DayWeekCode', befAft: 'BeforeAfterCode', amPm: 'AmPmCode', hour: 'HourCode12', minute: 'MinuteCode2', holiday: 'HolidaySettleCode' };

export const Sch06_Lookup_AlarmSetup: React.FC<Props> = ({ target, onClosed, onClose }) => {
  const [codes, setCodes] = useState<Record<CodeKey, Code[]>>({ dayWeek: [], befAft: [], amPm: [], hour: [], minute: [], holiday: [] });

  // retrieve() L339-352: sch.Sch06_Alarm.selectByTargetId(targetId)
  const search = useCallback(
    async () => (target ? schApi.searchAlarms(target.targetId) : []),
    [target?.targetId],  // eslint-disable-line react-hooks/exhaustive-deps
  );
  // update() L303-310: sch.Sch06_Alarm.update
  const save = useCallback(async (changed: Sch06Alarm[]) => schApi.saveAlarms(changed), []);
  const remove = useCallback(async (ids: number[]) => schApi.deleteAlarms(ids), []);

  const crud = useGridCrud<Sch06Alarm>({
    idField: 'alarmId',
    search,
    save,
    remove,
    newRow: () => ({}),
    // delete() L312-337: 확인 "선택한 알람설정 정보를 삭제하시겠습니까?" → [E12] msgBox.DialogHide [YES] (L320) → sch.Sch06_Alarm.delete
    deleteConfirm: '선택한 알람설정 정보를 삭제하시겠습니까?',
    // preCheck() L253-301: num이 있는 행마다 일/주·전/후·오전/오후·시·분·휴일지정을 모두 골랐는지 본다
    validate: changed => {
      for (const m of changed) {
        if (m.num == null) continue;
        if (!m.dayWeekCode) return '일 또는 주를 선택하세요';
        if (!m.befAftCode) return '전 또는 후를 선택하세요';
        if (!m.amPmCode) return '오전 또는 오후를 선택하세요';
        if (!m.hourCode) return '알람시간(시)을 선택하세요';
        if (!m.minuteCode) return '알람시간(분)을 선택하세요';
        if (!m.holidayCode) return '휴일알람지정을 선택하세요';
      }
      return undefined;
    },
  });
  const { retrieve, addRows } = crud;

  // [E0] 화면 열림 (생성자 L65-69, open L71-114) → setting(), retrieve(). 콤보는 grid() L152-227의 ComboBoxField(DayWeekCode …)
  useEffect(() => {
    if (!target) return;
    void retrieve();
    Promise.all((Object.keys(KINDS) as CodeKey[]).map(k => sysApi.searchCodes(KINDS[k]).then(list => [k, list] as const)))
      .then(entries => setCodes(Object.fromEntries(entries) as Record<CodeKey, Code[]>))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.targetId, target?.targetCode]);

  // [E2] insertButton[등록].Select (L123) → insertRow() L229-251: 회사·대상·알람방식 1(메일)·사용 true, 숫자 0 · 일(D) · 전(1)
  const insertRow = () => {
    if (!target) return;
    addRows([{
      alarmType: '1', targetCode: target.targetCode, targetId: target.targetId, useYn: true,
      num: 0, dayWeekCode: 'D', dayWeekName: '일', befAftCode: '1', befAftName: '전',
      hourCode: null, minuteCode: null, holidayCode: null,
    }], true);  // addChange로 넣은 값이라 변경 행으로 친다
  };

  // [E3] deleteButton[삭제].Select (L129) → delete() L312-337: 선택이 없으면 "삭제대상을 선택하세요"
  const deleteRows = () => {
    if ((crud.gridRef.current?.api.getSelectedRows() ?? []).length === 0) {
      message.warning('삭제대상을 선택하세요');
      return;
    }
    crud.deleteChecked();
  };

  // [E6] dayWeekComboField[DayWeekCode].Collapse (L157) · [E7] befAftComboField[BeforeAfterCode] (L166) · [E8] ampmComboField[AmPmCode] (L175)
  // · [E9] hourComboField[HourCode12] (L184) · [E10] minuteComboField[MinuteCode2] (L193) · [E11] holidayComboField[HolidaySettleCode] (L202)
  //   → 이름과 코드를 같이 바꾼다 (addChange xxxCode ← comboField.getCode())
  const selectCol = (key: CodeKey, nameField: keyof Sch06Alarm & string, codeField: keyof Sch06Alarm & string, width: number) => {
    const list = codes[key];
    return gb.textCenter(nameField, width, '', {
      editor: 'select',
      values: [...new Set(list.map(c => c.name))],
      valueSetter: p => {
        const d = p.data as unknown as Record<string, unknown>;
        d[nameField] = p.newValue;
        d[codeField] = list.find(c => c.name === p.newValue)?.code ?? null;
        return true;
      },
    });
  };

  const columnDefs = useMemo(() => [
    gb.group('일/주', [
      gb.longCenter('num', 50, '', { editor: 'number' }),
      selectCol('dayWeek', 'dayWeekName', 'dayWeekCode', 50),
      selectCol('befAft', 'befAftName', 'befAftCode', 50),
    ]),
    gb.group('시간', [
      selectCol('amPm', 'amPmName', 'amPmCode', 80),
      selectCol('hour', 'hourName', 'hourCode', 80),
      selectCol('minute', 'minuteName', 'minuteCode', 80),
    ]),
    gb.group('휴일지정', [selectCol('holiday', 'holidayName', 'holidayCode', 120)]),
    gb.group('사용', [gb.boolean('useYn', 50, '', { editable: true })]),
  ], [codes]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LookupModal
      open={target != null}
      title={target?.targetCode === 'BBS' ? '알람설정 (공지일 기준)' : '알람설정'}
      width={780}
      maskClosable={false}
      onCancel={onClose}
      footer={(
        <div style={{ textAlign: 'center' }}>
          {/* [E5] closeButton[닫기].Select [callback != null] (L141) → callback.execute(); hide() */}
          <Button type="close" onClick={() => { onClosed?.(); onClose(); }}>닫기</Button>
        </div>
      )}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 250 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L117) → retrieve() */}
          <Button type="search" onClick={() => void retrieve()}>조회</Button>
          <Button type="register" onClick={insertRow}>등록</Button>
          {/* [E4] updateButton[저장].Select (L135) → preCheck() */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="delete" onClick={deleteRows}>삭제</Button>
          <span style={{ color: '#527BB7', marginLeft: 4 }}>* 알람은 메일로 발송됩니다</span>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Sch06Alarm> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_SELECTION} />
        </div>
      </div>
    </LookupModal>
  );
};
