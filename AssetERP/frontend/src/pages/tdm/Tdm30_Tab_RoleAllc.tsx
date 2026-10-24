/**
 * [1417] 책무 > 02. 책무구조도 > 임원별 직책배정 (N11)
 * AS-IS: myApp/client/vi/tdm/Tdm30_Tab_RoleAllc.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L100-165: 위 = 툴바(기준일 · 전체보기 · 검색 250 "직책/담당임원" · [조회] · 새로고침 아이콘 · 미반영 인사정보 안내와 "확인하기" 링크),
 *                 왼쪽(670, 스플리터) = 툴바([등록][삭제]) + 직책배정 그리드(단일 선택, 수정 아이콘),
 *                 가운데 = 책무배분일 탭(Tdm34_TabPage_RoleAllcDetail), 아래(50) = 안내 문구
 * 함께: Tdm34_TabPage_RoleAllcDetail·Tdm30_Edit_RoleAllc·Tdm30_Edit_RoleAllcModify·Tdm35_Lookup_RoleAllcTask·Tdm02_Lookup_HrRecord
 *       (직책·임원 조회창 Tdm20_Lookup_SelectSingle·Tdm01_Lookup_SelectSingle은 기존 부품)
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Modal, Space, Splitter, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ReloadOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { errorMessage } from '@/api/client';
import { tdmApi } from '@/api/tdm';
import { TdmRoleAllc } from '@/types/tdm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Tdm02_Lookup_HrRecord } from './Tdm02_Lookup_HrRecord';
import { Tdm30_Edit_RoleAllc } from './Tdm30_Edit_RoleAllc';
import { Tdm30_Edit_RoleAllcModify } from './Tdm30_Edit_RoleAllcModify';
import { Tdm34_TabPage_RoleAllcDetail } from './Tdm34_TabPage_RoleAllcDetail';

const gb = gbFor<TdmRoleAllc>();
const FORMAT = 'YYYY-MM-DD';

export const Tdm30_Tab_RoleAllc: React.FC = () => {
  const gridRef = useRef<AgGridReact<TdmRoleAllc>>(null);
  const [baseDate, setBaseDate] = useState<Dayjs>(dayjs());      // baseDate.setValue(LoginUser.getToday())
  const [allYn, setAllYn] = useState(true);                      // allYn "전체보기" = true → 기준일 비활성
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TdmRoleAllc[]>([]);
  const [selected, setSelected] = useState<TdmRoleAllc | null>(null);
  const [nonce, setNonce] = useState(0);                         // 조회할 때마다 탭을 다시 읽게 한다
  const [hrUnapplied, setHrUnapplied] = useState(false);         // 미반영된 인사정보가 있는가 (refreshLink)
  const [insertOpen, setInsertOpen] = useState(false);
  const [modifyTarget, setModifyTarget] = useState<TdmRoleAllc | null>(null);
  const [hrOpen, setHrOpen] = useState(false);
  const selectedId = useRef<number | null>(null);
  selectedId.current = selected?.roleAllcId ?? null;
  const pendingSelect = useRef<number | null>(null);   // 조회 뒤 그리드에서 선택할 행

  // refreshLink() L577-602: tdm.Tdm02_HrRecord.selectByCompanyId(applyCode "0", searchText "%") — 한 건이라도 있으면 "미반영된 인사정보가 존재합니다."
  const refreshLink = useCallback(async () => {
    try {
      const list = await tdmApi.searchHrRecords('0', null, null, '');
      setHrUnapplied(list.length > 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // retrieve() L339-368: tdm.Tdm30_RoleAllc.selectByText(companyId, baseDate, allYn, "%글자%") → 고른 행을 유지하고(없으면 첫 행) 탭을 읽는다 → refreshLink()
  const retrieve = useCallback(async (over?: { allYn?: boolean }) => {
    try {
      const list = await tdmApi.searchRoleAllcs(baseDate.format(FORMAT), over?.allYn ?? allYn, searchText);
      setRows(list);
      const keep = list.find(r => r.roleAllcId === selectedId.current) ?? list[0] ?? null;
      pendingSelect.current = keep ? keep.roleAllcId : null;
      setSelected(keep);
      setNonce(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
    void refreshLink();
  }, [baseDate, allYn, searchText, refreshLink]);

  // [E0] 화면 열림 (생성자 L100-165) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // 조회한 목록이 그려지면 고른 행(없으면 첫 행)을 선택한다 (L351-362)
  useEffect(() => {
    const id = pendingSelect.current;
    if (id == null) return;
    pendingSelect.current = null;
    setTimeout(() => gridRef.current?.api?.getRowNode(String(id))?.setSelected(true));
  }, [rows]);

  // [E1] allYn[전체보기].ValueChange (L173): 기준일 칸을 켜고 끄고 → retrieve()
  const changeAllYn = (checked: boolean) => {
    setAllYn(checked);
    void retrieve({ allYn: checked });
  };

  // [E5] deleteButton[삭제].Select (L212) → deleteChk() L504-528: 0건 "선택된 내용이 없습니다" → "n건을 삭제하시겠습니까?" → [YES] [E11] deleteRow() L530-556
  const deleteChk = () => {
    const targets = (gridRef.current?.api?.getSelectedRows() ?? []) as TdmRoleAllc[];
    if (targets.length === 0) { message.warning('선택된 내용이 없습니다'); return; }
    Modal.confirm({
      title: '삭제',
      content: `${targets.length}건을 삭제하시겠습니까?`,
      width: 280,
      onOk: async () => {
        if (targets.some(r => r.apprYn)) { message.warning('상신중이거나 완료된 문서는 삭제 불가합니다.'); return; }
        try {
          await tdmApi.deleteRoleAllcs(targets.map(r => r.roleAllcId));
          const ids = new Set(targets.map(r => r.roleAllcId));
          setRows(prev => prev.filter(r => !ids.has(r.roleAllcId)));
          message.success(`${targets.length}건 삭제되었습니다.`);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E9 생략] lookup01.TriggerClick [selectModel.getApprYn()] (L278) → 직책 조회창: 직책 칸이 컬럼에 연결되지 않아(L327 주석 처리) 도달 불가
  // [E10 생략] lookup02.TriggerClick [selectModel.getApprYn()] (L302) → 임원 조회창: 담당임원 칸도 연결되지 않아(L328 주석 처리) 도달 불가
  // buildGrid() L257-337
  const columnDefs = useMemo(() => [
    // actionCell L259-275 ImageCell("Edit") → Tdm30_Edit_RoleAllcModify.open(고른 행, 기준일, 저장하면 그 행만 바꾼다)
    iconCell<TdmRoleAllc>('edit', 'actionCell', 45, '수정', row => setModifyTarget(row)),
    gb.text('roleName', 200, '직책'),  // L327 (lookup01 조회창 칸은 주석 처리되어 연결되지 않음)
    gb.text('personName', 100, '담당임원'),  // L328 (lookup02도 같다)
    gb.booleanYn2('addTitleYn', 100, '추가수행직책<br>(겸임 직책)'),  // L330
    gb.date('startDate', 90, '직책부여일'),  // L331
    gb.date('endDate', 90, '직책해제일'),  // L332
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      <div style={{ margin: '20px 20px 0 20px', minHeight: 50 }}>
        {/* [E3] retrieveButton[조회].Select (L194) → retrieve() */}
        <SearchBar
          onSearch={() => retrieve()}
          extra={
            <Space size={12} align="center">
              {/* [E6] refreshLink.MouseDown (L224) → refreshLink() */}
              <ReloadOutlined style={{ cursor: 'pointer' }} onClick={() => void refreshLink()} />
              <b style={{ fontSize: 13 }}>{hrUnapplied ? '미반영된 인사정보가 존재합니다.' : '미반영된 인사정보가 없습니다.'}</b>
              {/* [E7] hiperLink["확인하기"].MouseDown (L230) → lookupLink() L604-612: Tdm02_Lookup_HrRecord.open(닫으면 refreshLink()) */}
              {hrUnapplied && <a style={{ color: 'red', fontSize: 14, fontWeight: 'bold' }} onClick={() => setHrOpen(true)}>확인하기</a>}
            </Space>
          }
        >
          <SearchBar.Field label="기준일">
            <DatePicker value={baseDate} format={FORMAT} allowClear={false} disabled={allYn} style={{ width: 120 }} onChange={d => { if (d) setBaseDate(d); }} />
          </SearchBar.Field>
          <SearchBar.Field label="">
            <Checkbox checked={allYn} onChange={e => changeAllYn(e.target.checked)}>전체보기</Checkbox>
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E2] searchText.KeyPress [Enter] (L186) → retrieve() */}
            <SearchBar.Input style={{ width: 250 }} placeholder="직책/담당임원" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <Splitter style={{ flex: 1, minHeight: 0, padding: '0 20px', boxSizing: 'border-box' }}>
        <Splitter.Panel defaultSize={670} min={300} max={1000}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
            <div style={{ padding: '10px 10px 8px' }}>
              <Space>
                {/* [E4] insertButton[등록].Select (L200) → insertRow() L370-378: Tdm30_Edit_RoleAllc.insert(기준일, 저장하면 retrieve()) */}
                <Button type="register" onClick={() => setInsertOpen(true)}>등록</Button>
                <Button type="delete" onClick={deleteChk}>삭제</Button>
              </Space>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E8] grid.SelectionChanged [선택>0] (L242) → retrieveTabPage() L252-255: tabPage.retrieve(고른 행) */}
              <SingleGrid<TdmRoleAllc>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.roleAllcId)}
                onSelect={row => { if (row) setSelected(row); }}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <Tdm34_TabPage_RoleAllcDetail roleAllc={selected} nonce={nonce} />
        </Splitter.Panel>
      </Splitter>
      <div style={{ margin: '-2px 20px 20px 20px', height: 50, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: '15px 0 0 10px', fontSize: 12 }}>
        ※ 대외겸직은 "임원 등록(#1411)" 화면에서 등록하세요
      </div>
      <Tdm30_Edit_RoleAllc open={insertOpen} baseDate={baseDate.format(FORMAT)} onSaved={() => { void retrieve(); }} onClose={() => setInsertOpen(false)} />
      <Tdm30_Edit_RoleAllcModify
        target={modifyTarget}
        baseDate={baseDate.format(FORMAT)}
        onSaved={row => {
          setRows(prev => prev.map(r => (r.roleAllcId === row.roleAllcId ? row : r)));
          setSelected(prev => (prev?.roleAllcId === row.roleAllcId ? row : prev));
          setModifyTarget(row);
        }}
        onClose={() => setModifyTarget(null)}
      />
      <Tdm02_Lookup_HrRecord open={hrOpen} onClose={() => { setHrOpen(false); void refreshLink(); }} />
    </div>
  );
};
