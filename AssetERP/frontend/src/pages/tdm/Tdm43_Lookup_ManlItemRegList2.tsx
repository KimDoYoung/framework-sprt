/**
 * 복사대상 주요관리의무 선택 창 (N17) — 매뉴얼(점검항목) 작성 위쪽의 [불러오기]가 연다. 고른 원본 주요관리의무의 점검항목을 이 작업·직책·부서에 복사한다.
 * AS-IS: myApp/client/vi/tdm/Tdm43_Lookup_ManlItemRegList2.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L77-83·open() L85-145: 모달 1600×850, 제목 "**직책 (부서)** 점검항목 등록 - 복사대상 주요관리의무 선택", 툴바(기준일 · 전체보기 · 직책 · 책무 · 부서 · 검색 · [조회])
 *   + 위 그리드(원본 주요관리의무, 체크 다중) + 아래 그리드(고른 행의 점검항목, 보기용) + [확인][닫기]
 * UX보강(10): 검색 줄 = SearchBar(UX-01), 조회창(UX-05·06)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlCopyItem, TdmManlCopySource } from '@/types/tdm';
import { Button } from '@/components/button';
import { MultiGrid, SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Org00_Lookup_SelectTdm } from '@/components/lookup/Org00_Lookup_SelectTdm';
import { SearchBar } from '@/components/search';
import { Tdm10_Lookup_SelectSingle } from './Tdm10_Lookup_SelectSingle';
import { Tdm20_Lookup_SelectRole } from './Tdm20_Lookup_SelectRole';

const FORMAT = 'YYYY-MM-DD';
const gb1 = gbFor<TdmManlCopySource>();
const gb2 = gbFor<TdmManlCopyItem>();
const NO_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: false } as const;

const rowKey = (r: TdmManlCopySource) => `${r.manlOrgId}-${r.taskRelateDutyId}-${r.manlId}`;

/** buildGrid01() L278-293 (setChecked MULTI) */
const buildGrid01 = () => [
  gb1.text('taskName', 300, '책무'),  // L283
  gb1.textArea('taskRelateDetailName', 350, '책무세부'),  // L284
  gb1.textArea('taskRelateDutyName', 450, '주요관리의무'),  // L285
  gb1.text('roleName', 150, '직책'),  // L286
  gb1.text('orgName', 150, '부서'),  // L287
  gb1.date('applyStartDate', 90, '사용시작일'),  // L288
  gb1.date('applyEndDate', 90, '사용종료일'),  // L289
  gb1.text('jobName', 200, '매뉴얼작업명'),  // L290
];
/** buildGrid02() L295-303 */
const buildGrid02 = () => [
  gb2.textCenter('manlCode', 80, '코드'),  // L299
  gb2.textArea('checkItem', 900, '점검항목'),  // L300
];

interface Named { id: number | null; name: string | null }

export interface ManlItemRegList2Target {
  manlJobId: number;
  /** 이 화면의 직책·부서(AS-IS param roleId·orgId) — "우리 부서의 관리의무와 같은 것이 있는" 원본만 보이게 하는 기준이자 제목에 쓴다 */
  roleId: number;
  roleName: string;
  orgId: number;
  orgName: string;
}

interface Props {
  /** 값이 있으면 열린다 (AS-IS open(param, cb)) */
  target: ManlItemRegList2Target | null;
  /** AS-IS callback.execute(고른 주요관리의무들) — 확인하면 창이 스스로 닫힌다 */
  onResult: (sources: TdmManlCopySource[]) => void;
  onClose: () => void;
}

export const Tdm43_Lookup_ManlItemRegList2: React.FC<Props> = ({ target, onResult, onClose }) => {
  const grid1Ref = useRef<AgGridReact<TdmManlCopySource>>(null);
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs());
  const [allYn, setAllYn] = useState(false);
  const [role, setRole] = useState<Named>({ id: null, name: null });
  const [task, setTask] = useState<Named>({ id: null, name: null });
  const [org, setOrg] = useState<Named>({ id: null, name: null });
  const [searchText, setSearchText] = useState('');
  const [rows1, setRows1] = useState<TdmManlCopySource[]>([]);
  const [rows2, setRows2] = useState<TdmManlCopyItem[]>([]);
  const [lookup, setLookup] = useState<'role' | 'task' | 'org' | null>(null);
  const prevChecked = useRef<Set<string>>(new Set());
  const columns1 = useMemo(buildGrid01, []);
  const columns2 = useMemo(buildGrid02, []);

  // retrieve02() L330-344: tdm.Tdm43_Manl.selectByTaskRelateDutyId(manlOrgId, taskRelateDutyId)
  const retrieve02 = async (row: TdmManlCopySource) => {
    try {
      setRows2(await tdmApi.searchManlSourceItems(row.manlOrgId, row.taskRelateDutyId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // retrieve01() L305-328: tdm.Tdm43_Manl.selectByManlJobId(companyId, manlJobId, stdRoleId, stdOrgId, roleId, taskId, orgId, stdDate, allYn, "%검색어%") → 끝나면 첫 행을 체크한다(→ E7)
  // 값은 호출한 자리에서 막 바꾼 것이라 상태 반영 전이므로 over로 받는다
  const retrieve01 = async (over: { roleId?: number | null; taskId?: number | null; orgId?: number | null; allYn?: boolean; searchText?: string } = {}) => {
    if (!target) return;
    try {
      const list = await tdmApi.searchManlSourcesByJob({
        manlJobId: target.manlJobId, stdRoleId: target.roleId, stdOrgId: target.orgId,
        roleId: 'roleId' in over ? over.roleId : role.id,
        taskId: 'taskId' in over ? over.taskId : task.id,
        orgId: 'orgId' in over ? over.orgId : org.id,
        stdDate: stdDate.format(FORMAT),
        allYn: over.allYn ?? allYn,
        searchText: over.searchText ?? searchText,
      });
      prevChecked.current = new Set();
      setRows1(list);
      setRows2([]);
      if (list.length > 0) setTimeout(() => grid1Ref.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L77-83) → open() L85-145: settings(), show(), retrieve01()
  useEffect(() => {
    if (!target) return;
    setStdDate(dayjs());
    setAllYn(false);
    setRole({ id: null, name: null });
    setTask({ id: null, name: null });
    setOrg({ id: null, name: null });
    setSearchText('');
    setRows1([]);
    setRows2([]);
    prevChecked.current = new Set();
    void (async () => {
      try {
        const list = await tdmApi.searchManlSourcesByJob({
          manlJobId: target.manlJobId, stdRoleId: target.roleId, stdOrgId: target.orgId,
          roleId: null, taskId: null, orgId: null, stdDate: dayjs().format(FORMAT), allYn: false, searchText: '',
        });
        setRows1(list);
        if (list.length > 0) setTimeout(() => grid1Ref.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E7] grid01.SelectionChanged [selectModel != null] (L254) → retrieve02(): 막 체크한 행(없으면 체크된 마지막 행)의 점검항목을 아래에 보인다
  const onCheckedChange = (checked: TdmManlCopySource[]) => {
    const keys = new Set(checked.map(rowKey));
    const added = checked.filter(r => !prevChecked.current.has(rowKey(r)));
    prevChecked.current = keys;
    const shown = added.length > 0 ? added[added.length - 1] : checked[checked.length - 1];
    if (shown) void retrieve02(shown);
  };

  // confirm() L346-357: 고른 주요관리의무가 없으면 "선택된 주요관리의무가 없습니다", 있으면 callback + hide()
  const confirm = () => {
    const selected = grid1Ref.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('선택된 주요관리의무가 없습니다');
      return;
    }
    onResult(selected);
    onClose();
  };

  return (
    <LookupModal
      open={!!target}
      title={target ? <b>{`${target.roleName} (${target.orgName})`} 점검항목 등록 - 복사대상 주요관리의무 선택</b> : ''}
      width="min(1600px, calc(100vw - 32px))"
      style={{ top: 16 }}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E8] updateButton[확인].Select (L264) → confirm() */}
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E9] closeButton[닫기].Select (L270) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 'calc(100vh - 220px)', minHeight: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] searchText.KeyPress [Enter] (L239)·[E6] retrieveButton[조회].Select (L248) → retrieve01() */}
        <SearchBar onSearch={() => retrieve01()}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} disabled={allYn} value={stdDate} format={FORMAT} onChange={d => d && setStdDate(d)} />
            {/* [E1] allYn[전체보기].ValueChange (L153) → 기준일을 비활성으로 하고 retrieve01() */}
            <Checkbox checked={allYn} onChange={e => { setAllYn(e.target.checked); void retrieve01({ allYn: e.target.checked }); }}>전체보기</Checkbox>
          </SearchBar.Field>
          <SearchBar.Field label="직책">
            <LookupInput width={250} value={role.name ?? ''} placeholder="전체" onOpen={() => setLookup('role')} />
          </SearchBar.Field>
          <SearchBar.Field label="책무">
            <LookupInput width={200} value={task.name ?? ''} placeholder="전체" onOpen={() => setLookup('task')} />
          </SearchBar.Field>
          <SearchBar.Field label="부서">
            <LookupInput width={200} value={org.name ?? ''} placeholder="전체" onOpen={() => setLookup('org')} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="책무/책무세부/관리의무/부서" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<TdmManlCopySource>
            gridRef={grid1Ref}
            rowData={rows1}
            columnDefs={columns1}
            getRowId={p => rowKey(p.data)}
            rowClick
            onCheckedChange={onCheckedChange}
          />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<TdmManlCopyItem>
            rowData={rows2}
            columnDefs={columns2}
            getRowId={p => String(p.data.manlId)}
            rowSelection={NO_SELECTION}
          />
        </div>
      </div>
      {/* [E2] roleLookup.TriggerClick [result != null] (L168) → Tdm20_Lookup_SelectRole.openAll(null): 고르면 직책, [전체]면 비움 → retrieve01() */}
      <Tdm20_Lookup_SelectRole
        open={lookup === 'role'}
        allButton
        onAll={() => { setRole({ id: null, name: null }); void retrieve01({ roleId: null }); }}
        onSelect={r => { setRole({ id: r.roleId, name: r.roleName }); void retrieve01({ roleId: r.roleId }); }}
        onClose={() => setLookup(null)}
      />
      {/* [E3] taskLookup.TriggerClick [result != null] (L192) → Tdm10_Lookup_SelectSingle.open: 고르면 책무, [전체]면 비움 → retrieve01() */}
      <Tdm10_Lookup_SelectSingle
        open={lookup === 'task'}
        onAll={() => { setTask({ id: null, name: null }); void retrieve01({ taskId: null }); }}
        onSelect={t => { setTask({ id: t.taskId, name: t.taskName }); void retrieve01({ taskId: t.taskId }); }}
        onClose={() => setLookup(null)}
      />
      {/* [E4] orgLookup.TriggerClick [result != null] (L216) → Org00_Lookup_SelectTdm.openAll(오늘, null, true): 고르면 부서, [전체]면 비움 → retrieve01() */}
      <Org00_Lookup_SelectTdm
        stdDate={lookup === 'org' ? dayjs().format(FORMAT) : undefined}
        allButton
        onSelect={o => { setOrg(o ? { id: o.orgCodeId, name: o.korNm ?? null } : { id: null, name: null }); void retrieve01({ orgId: o ? o.orgCodeId : null }); }}
        onClose={() => setLookup(null)}
      />
    </LookupModal>
  );
};
