/**
 * 매뉴얼 부서지정의 아래 관리의무 목록 (N16)
 * AS-IS: myApp/client/vi/tdm/Tdm41_TabPage_ManlDutyOrg.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L72-102: 툴바(검색 [300 "책무/책무세부/담당부서"] · 미지정만 보기 · [전체선택][전체해제][부서일괄지정]) + GridGroupBuilder 그리드(책무별 그룹 머리글) + 페이징 100건
 * 생략: [E3] retrieveButton[조회] (L133) — 컬럼·툴바에 연결되지 않은 도달 불가 버튼. 점검부서 수정 아이콘 actionCell(L297, "임시로 막음")과 Tdm44_Lookup_ManlDutyOrg도 같은 이유로 만들지 않았다
 * UX보강(10): 툴바 = SearchBar는 쓰지 않는다(원본에 [조회]가 없다), 부서 조회창(UX-05·06)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, Input, Modal, Space, message } from 'antd';
import type { ICellRendererParams } from 'ag-grid-community';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmManlDuty, TdmRoleOrgLookup } from '@/types/tdm';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { Tdm23_Lookup_SelectOrg } from './Tdm23_Lookup_SelectOrg';

const LIMIT = 100;   // gridToolBar.setToolBar(100)

/** 화면 행 — 서버 행 + 체크(selectYn, 화면에서만 쓴다) */
type Row = TdmManlDuty & { selectYn: boolean };
/** 표시용 행 — 책무(title)가 바뀔 때 끼우는 그룹 머리글 행(AS-IS GroupSummaryView.groupBy(title)) */
type DisplayRow = Row & { __group?: boolean; groupTitle?: string };
const gb = gbFor<DisplayRow>();

const GroupHeader: React.FC<ICellRendererParams<DisplayRow>> = ({ data }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: 4, borderBottom: '1px solid #8fb4e3', color: '#15428b', fontWeight: 'bold', fontSize: 11 }}>
    {data?.groupTitle}
  </div>
);

/** buildGrid() L263-300 (GridGroupBuilder — 첫 열 title로 그룹, title 열은 보이지 않는다) */
const buildGrid = () => [
  gb.boolean('selectYn', 35, ' '),  // L294 addBoolean — 값은 행 클릭(E8)으로 바뀐다
  gb.textArea('taskRelateDutyName', 1000, '[직책] 책무 : 책무세부 / 관리의무'),  // L295
  gb.textArea('orgName2', 250, '점검부서'),  // L296
];

export interface ManlDutyTarget {
  manlJobId: number | null;
  roleId: number | null;
  taskId: number | null;
  /** 같은 대상을 다시 눌러도 다시 읽게 하는 번호 (AS-IS retrieve(manlJobId, roleId, taskId) 호출마다 +1) */
  nonce: number;
}

interface Props {
  target: ManlDutyTarget;
}

export const Tdm41_TabPage_ManlDutyOrg: React.FC<Props> = ({ target }) => {
  const [searchText, setSearchText] = useState('');
  const [unRegYn, setUnRegYn] = useState(false);   // unRegYn "미지정만 보기" = false (settings L124-125)
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orgLookup, setOrgLookup] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // 페이징 조건은 마지막 조회 것 (gridToolBar.addParam은 retrieve()에서만 바뀐다)
  const latest = useRef({ searchText, unRegYn, target });
  latest.current = { searchText, unRegYn, target };
  const last = useRef({ searchText: '', unRegYn: false, target });

  // retrieve() L361-380: gridToolBar.addParam(manlJobId, roleId, taskId, unRegYn, searchText = "%…%") → 1페이지부터 tdm.Tdm41_ManlDuty.selectByTextPaging
  const load = useCallback(async (toPage: number) => {
    const cond = last.current;
    if (cond.target.manlJobId == null) { setRows([]); setTotal(0); setPage(1); return; }
    setLoading(true);
    try {
      const res = await tdmApi.searchManlDuties({
        manlJobId: cond.target.manlJobId, roleId: cond.target.roleId, taskId: cond.target.taskId,
        unRegYn: cond.unRegYn, searchText: cond.searchText, offset: (toPage - 1) * LIMIT, limit: LIMIT,
      });
      setRows(res.rows.map(r => ({ ...r, selectYn: false })));
      setTotal(res.total);
      setPage(toPage);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);
  const retrieve = useCallback((over: { unRegYn?: boolean } = {}) => {
    last.current = { ...latest.current, ...over };
    return load(1);
  }, [load]);

  // [E0] 화면 열림 (생성자 L72-102) → settings(), retrieve() / 부모의 retrieve(manlJobId, roleId, taskId) L353-359
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, [target.manlJobId, target.roleId, target.taskId, target.nonce]);

  // [E1] searchText.KeyPress [Enter] (L110) → 매뉴얼작업이 없으면 "매뉴얼작업을 선택하세요", 있으면 retrieve()
  const onEnter = () => {
    if (target.manlJobId == null) { message.warning('매뉴얼작업을 선택하세요'); return; }
    void retrieve();
  };

  // [E4] selectAllButton[전체선택].Select (L144) / [E5] selectNoneButton[전체해제].Select (L152): 목록 전체의 selectYn
  const selectAll = (v: boolean) => setRows(prev => prev.map(r => ({ ...r, selectYn: v })));

  // [E8] grid.RowClick (L242): 고른 행의 selectYn을 뒤집는다
  const toggleRow = (row: Row | undefined) => {
    if (!row) return;
    setRows(prev => prev.map(r => (r.realManlDutyId === row.realManlDutyId ? { ...r, selectYn: !r.selectYn } : r)));
  };

  // [E6] selectOrgButton[부서일괄지정].Select (L160): 확정(useYn)된 행이 있으면 막고, 고른 행이 없으면 안내, 있으면 부서 고르기(MULTI)
  const selectOrg = () => {
    let selectedCount = 0;
    for (const r of rows) {
      if (r.selectYn) selectedCount++;
      if (r.useYn) { message.warning('부서지정이 확정되어 수정할 수 없습니다'); return; }
    }
    if (selectedCount === 0) { message.warning('선택된 관리의무가 없습니다'); return; }
    setOrgLookup(true);   // Tdm23_Lookup_SelectOrg.open("MULTI", roleId, callback)
  };
  // [E7] msgBox.DialogHide [YES] (L204) → updateOrgCodeId() L323-336 → 끝나면 retrieve()
  const onOrgsResult = (orgs: TdmRoleOrgLookup[]) => {
    const selected = rows.filter(r => r.selectYn).map(r => r.realManlDutyId);
    Modal.confirm({
      title: '확인',
      content: '선택한 부서를 일괄지정하시겠습니까?',
      width: 350,
      onOk: async () => {
        try {
          await tdmApi.assignManlDutyOrgs(selected, orgs.map(o => o.orgId));
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '부서지정 실패'));
        }
      },
    });
  };

  // 책무(title)가 바뀔 때마다 그룹 머리글 행을 끼운다
  const displayRows = useMemo<DisplayRow[]>(() => {
    const out: DisplayRow[] = [];
    let prev: string | null | undefined;
    rows.forEach((r, i) => {
      if (i === 0 || r.title !== prev) {
        out.push({ ...r, realManlDutyId: -(i + 1), __group: true, groupTitle: r.title ?? '' });
        prev = r.title;
      }
      out.push(r);
    });
    return out;
  }, [rows]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderBottom: '1px solid #d9d9d9' }}>
        <Input style={{ width: 300 }} placeholder="책무/책무세부/담당부서" value={searchText} allowClear
          onChange={e => setSearchText(e.target.value)} onPressEnter={onEnter} />
        {/* [E2] unRegYn[미지정만 보기].Change (L126) → retrieve() */}
        <Checkbox checked={unRegYn} onChange={e => { setUnRegYn(e.target.checked); void retrieve({ unRegYn: e.target.checked }); }}>미지정만 보기</Checkbox>
        <Space>
          <Button type="addRow" onClick={() => selectAll(true)}>전체선택</Button>
          <Button type="removeRow" onClick={() => selectAll(false)}>전체해제</Button>
          <Button type="save" onClick={selectOrg}>부서일괄지정</Button>
        </Space>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<DisplayRow>
          rowData={displayRows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.realManlDutyId)}
          rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: false }}
          isFullWidthRow={p => !!p.rowNode.data?.__group}
          fullWidthCellRenderer={GroupHeader}
          getRowHeight={p => (p.data?.__group ? 28 : undefined)}
          loading={loading}
          onRowClicked={e => { if (!e.data?.__group) toggleRow(e.data); }}
        />
      </div>
      <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void load(p)} />
      <Tdm23_Lookup_SelectOrg
        roleId={orgLookup ? target.roleId : null}
        multi
        onSelectMulti={onOrgsResult}
        onClose={() => setOrgLookup(false)}
      />
    </div>
  );
};
