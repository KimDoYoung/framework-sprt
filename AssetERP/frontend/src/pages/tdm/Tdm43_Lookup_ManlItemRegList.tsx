/**
 * 점검항목 조회창 (N17) — 매뉴얼(점검항목) 작성 아래 목록의 [불러오기]가 연다. 고른 원본 점검항목을 그 관리의무에 복사한다.
 * AS-IS: myApp/client/vi/tdm/Tdm43_Lookup_ManlItemRegList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L88-130: 모달 1600×850, 툴바(기준일 · 전체보기 · 직책 · 책무 · 부서 · 검색 · [조회]) + 위 그리드(원본 주요관리의무, 단일) + 아래 그리드(그 관리의무의 점검항목, 체크 다중) + [확인][닫기]
 * open(manlDutyModel, cb) L79-86: 직책 칸에 관리의무의 직책명만 넣고(직책 ID는 비어 있어 조건에 안 걸린다 — 원본 그대로) 검색칸에 관리의무 이름을 넣은 뒤 조회
 * UX보강(10): 검색 줄 = SearchBar(UX-01), 조회창(UX-05·06)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlCopyItem, TdmManlCopySource, TdmManlDutyReg } from '@/types/tdm';
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
const SINGLE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

/** buildGrid01() L267-279 */
const buildGrid01 = () => [
  gb1.text('taskName', 300, '책무'),  // L269
  gb1.textArea('taskRelateDetailName', 350, '책무세부'),  // L270
  gb1.textArea('taskRelateDutyName', 450, '주요관리의무'),  // L271
  gb1.text('roleName', 150, '직책'),  // L272 — selectByRoleId에 직책명 열이 없어 비어 있다(원본 그대로)
  gb1.text('orgName', 200, '부서'),  // L273
  gb1.date('applyStartDate', 100, '사용시작일'),  // L274
  gb1.date('applyEndDate', 100, '사용종료일'),  // L275
  gb1.text('jobName', 200, '매뉴얼작업명'),  // L276
];
/** buildGrid02() L281-288 (setChecked MULTI) */
const buildGrid02 = () => [
  gb2.textCenter('manlCode', 100, '코드'),  // L284
  gb2.textArea('checkItem', 900, '점검항목'),  // L285
];

interface Named { id: number | null; name: string | null }

interface Props {
  /** 점검항목을 불러올 관리의무 행(AS-IS manlDutyModel) — 값이 있으면 열린다 */
  target: TdmManlDutyReg | null;
  /** AS-IS callback.execute(고른 점검항목들) — 확인하면 창이 스스로 닫힌다 */
  onResult: (items: TdmManlCopyItem[]) => void;
  onClose: () => void;
}

export const Tdm43_Lookup_ManlItemRegList: React.FC<Props> = ({ target, onResult, onClose }) => {
  const grid1Ref = useRef<AgGridReact<TdmManlCopySource>>(null);
  const grid2Ref = useRef<AgGridReact<TdmManlCopyItem>>(null);
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs());
  const [allYn, setAllYn] = useState(false);
  const [role, setRole] = useState<Named>({ id: null, name: null });
  const [task, setTask] = useState<Named>({ id: null, name: null });
  const [org, setOrg] = useState<Named>({ id: null, name: null });
  const [searchText, setSearchText] = useState('');
  const [rows1, setRows1] = useState<TdmManlCopySource[]>([]);
  const [rows2, setRows2] = useState<TdmManlCopyItem[]>([]);
  const [lookup, setLookup] = useState<'role' | 'task' | 'org' | null>(null);
  const columns1 = useMemo(buildGrid01, []);
  const columns2 = useMemo(buildGrid02, []);

  // retrieve02() L315-331: tdm.Tdm43_Manl.selectByTaskRelateDutyId(manlOrgId, taskRelateDutyId)
  const retrieve02 = async (row: TdmManlCopySource | undefined) => {
    if (!row) return;
    try {
      setRows2(await tdmApi.searchManlSourceItems(row.manlOrgId, row.taskRelateDutyId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // retrieve01() L290-313: tdm.Tdm43_Manl.selectByRoleId(companyId, roleId, taskId, orgId, stdDate, allYn, "%검색어%") → 끝나면 첫 행을 고르고 retrieve02()
  // 값은 호출한 자리에서 막 바꾼 것이라 상태 반영 전이므로 over로 받는다
  const retrieve01 = async (over: { roleId?: number | null; taskId?: number | null; orgId?: number | null; allYn?: boolean; searchText?: string } = {}) => {
    try {
      const list = await tdmApi.searchManlSourcesByRole({
        roleId: 'roleId' in over ? over.roleId : role.id,
        taskId: 'taskId' in over ? over.taskId : task.id,
        orgId: 'orgId' in over ? over.orgId : org.id,
        stdDate: stdDate.format(FORMAT),
        allYn: over.allYn ?? allYn,
        searchText: over.searchText ?? searchText,
      });
      setRows1(list);
      setRows2([]);
      if (list.length > 0) {
        setTimeout(() => grid1Ref.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
        void retrieve02(list[0]);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L88-130) → settings(), show() / open() L79-86: 직책 칸·검색칸을 관리의무 값으로 채우고 retrieve01()
  useEffect(() => {
    if (!target) return;
    setStdDate(dayjs());
    setAllYn(false);
    setRole({ id: null, name: target.roleName ?? null });
    setTask({ id: null, name: null });
    setOrg({ id: null, name: null });
    setSearchText(target.taskRelateDutyName ?? '');
    setRows1([]);
    setRows2([]);
    void (async () => {
      try {
        const list = await tdmApi.searchManlSourcesByRole({
          roleId: null, taskId: null, orgId: null, stdDate: dayjs().format(FORMAT), allYn: false, searchText: target.taskRelateDutyName ?? '',
        });
        setRows1(list);
        if (list.length > 0) {
          setTimeout(() => grid1Ref.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
          void retrieve02(list[0]);
        }
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // confirm() L333-342: 고른 점검항목이 없으면 "선택된 매뉴얼이 없습니다", 있으면 callback + hide()
  const confirm = (fallback?: TdmManlCopyItem) => {
    const selected = grid2Ref.current?.api.getSelectedRows() ?? [];
    const list = selected.length > 0 ? selected : fallback ? [fallback] : [];
    if (list.length === 0) {
      message.warning('선택된 매뉴얼이 없습니다');
      return;
    }
    onResult(list);
    onClose();
  };

  return (
    <LookupModal
      open={!!target}
      title="점검항목 조회"
      width="min(1600px, calc(100vw - 32px))"
      style={{ top: 16 }}
      maskClosable={false}
      closable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E9] updateButton[확인].Select (L253) → confirm() */}
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E10] closeButton[닫기].Select (L259) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 'calc(100vh - 220px)', minHeight: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E5] searchText.KeyPress [Enter] (L225)·[E6] retrieveButton[조회].Select (L234) → retrieve01() */}
        <SearchBar onSearch={() => retrieve01()}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 120 }} allowClear={false} disabled={allYn} value={stdDate} format={FORMAT} onChange={d => d && setStdDate(d)} />
            {/* [E1] allYn[전체보기].ValueChange (L138) → 기준일을 비활성으로 하고 retrieve01() */}
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
            <SearchBar.Input style={{ width: 250 }} placeholder="부서/책무/관리의무" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E7] grid01.RowClick (L240) → retrieve02() */}
          <SingleGrid<TdmManlCopySource>
            gridRef={grid1Ref}
            rowData={rows1}
            columnDefs={columns1}
            getRowId={p => `${p.data.manlOrgId}-${p.data.taskRelateDutyId}-${p.data.manlId}`}
            rowSelection={SINGLE_SELECTION}
            onRowClicked={e => void retrieve02(e.data)}
          />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E8] grid02.RowDoubleClick (L246) → confirm() */}
          <MultiGrid<TdmManlCopyItem>
            gridRef={grid2Ref}
            rowData={rows2}
            columnDefs={columns2}
            getRowId={p => String(p.data.manlId)}
            rowClick
            onRowDoubleClicked={e => confirm(e.data)}
          />
        </div>
      </div>
      {/* [E2] roleLookup.TriggerClick [result != null] (L154) → Tdm20_Lookup_SelectRole.openAll(null): 고르면 직책, [전체]면 비움 → retrieve01() */}
      <Tdm20_Lookup_SelectRole
        open={lookup === 'role'}
        allButton
        onAll={() => { setRole({ id: null, name: null }); void retrieve01({ roleId: null }); }}
        onSelect={r => { setRole({ id: r.roleId, name: r.roleName }); void retrieve01({ roleId: r.roleId }); }}
        onClose={() => setLookup(null)}
      />
      {/* [E3] taskLookup.TriggerClick [result != null] (L178) → Tdm10_Lookup_SelectSingle.open: 고르면 책무, [전체]면 비움 → retrieve01() */}
      <Tdm10_Lookup_SelectSingle
        open={lookup === 'task'}
        onAll={() => { setTask({ id: null, name: null }); void retrieve01({ taskId: null }); }}
        onSelect={t => { setTask({ id: t.taskId, name: t.taskName }); void retrieve01({ taskId: t.taskId }); }}
        onClose={() => setLookup(null)}
      />
      {/* [E4] orgLookup.TriggerClick [result != null] (L202) → Org00_Lookup_SelectTdm.openAll(오늘, null, true): 고르면 부서, [전체]면 비움 → retrieve01() */}
      <Org00_Lookup_SelectTdm
        stdDate={lookup === 'org' ? dayjs().format(FORMAT) : undefined}
        allButton
        onSelect={o => { setOrg(o ? { id: o.orgCodeId, name: o.korNm ?? null } : { id: null, name: null }); void retrieve01({ orgId: o ? o.orgCodeId : null }); }}
        onClose={() => setLookup(null)}
      />
    </LookupModal>
  );
};
