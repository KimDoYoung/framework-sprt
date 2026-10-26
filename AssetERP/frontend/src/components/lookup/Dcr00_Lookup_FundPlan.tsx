/**
 * 문서구분 조회창 (P03) — Fnd20_TabPage_Plan의 [등록]·문서분류 셀에서 연다. 다른 도메인에서도 쓰는 공통 조회창.
 * AS-IS: myApp/client/vi/dcr/Dcr00_Lookup_FundPlan.java (82줄) + Dcr00_TabPage_TreeFundPlan.java (205줄) + Dcr00_Tab_TreeFundPlan.java (75줄) + Dcr00_TabPage_GridFundPlan.java (103줄)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L30-65: 모달 1000×700 "문서구분", 탭 둘 — [문서분류](왼쪽 40% 트리 + 오른쪽 체크박스 다중 그리드) · [문서분류찾기](검색 300 + 체크박스 다중 그리드), 아래 가운데 [확인][닫기]
 * 폭: 문서분류찾기 그리드 열 합계 900+60+130 = 1090 (03 원칙 21 — AS-IS 1000보다 작게 하지 않는다)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Tabs, Tree } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrClassTree, DcrFundPlanLookup } from '@/types/dcr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { toTree } from '@/pages/dcr/dcr01Tree';

const gb = gbFor<DcrFundPlanLookup>();

interface Props {
  /** 값이 true인 동안 열려 있다 — 열릴 때마다 트리를 다시 조회한다 */
  open: boolean;
  /** callback.execute(selectList) — confirm() L67-77. 고른 문서구분들 */
  onResult: (list: DcrFundPlanLookup[]) => void;
  onClose: () => void;
}

/** Dcr00_Tab_TreeFundPlan.buildGrid() L39-50 */
const treeGridColumns = () => [
  gb.text('classTreeCode', 80, '구분코드'),  // L45
  gb.text('classTreeName', 280, '문서구분명'),  // L46
  gb.text('itemTypeName', 100, '상품분류'),  // L47
];

/** Dcr00_TabPage_GridFundPlan.buildGrid() L67-78 */
const findGridColumns = () => [
  gb.text('classTreeCode', 100, '구분코드'),  // L73
  gb.text('classTreeFullName', 600, '문서구분명'),  // L74
  gb.text('itemTypeName', 200, '상품분류'),  // L75
];

export const Dcr00_Lookup_FundPlan: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tree' | 'find'>('tree');
  // ── [문서분류] 탭 (Dcr00_TabPage_TreeFundPlan + Dcr00_Tab_TreeFundPlan)
  const [classRows, setClassRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [treeRows, setTreeRows] = useState<DcrFundPlanLookup[]>([]);
  const [treeLoading, setTreeLoading] = useState(false);
  const treeGridRef = useRef<AgGridReact<DcrFundPlanLookup>>(null);
  // ── [문서분류찾기] 탭 (Dcr00_TabPage_GridFundPlan)
  const [searchText, setSearchText] = useState('');
  const [findRows, setFindRows] = useState<DcrFundPlanLookup[]>([]);
  const [findLoading, setFindLoading] = useState(false);
  const findGridRef = useRef<AgGridReact<DcrFundPlanLookup>>(null);

  const treeData = useMemo(() => toTree(classRows), [classRows]);
  const treeColumns = useMemo(treeGridColumns, []);
  const findColumns = useMemo(findGridColumns, []);

  // [E2] retrieveButton[조회].Select (L60) → retrieve() L165-174: 서비스 dcr.Dcr01_ClassTree.selectByCompanyId(companyId, typeCode C)
  const retrieveTree = async () => {
    try {
      setClassRows(await dcrApi.searchClassTree('C'));
    } catch (err) {
      message.error(errorMessage(err, '매뉴조회 오류'));
    }
  };

  // [E0] 화면 열림 (생성자 L46-98) → retrieve()
  useEffect(() => {
    if (!open) return;
    setActiveTab('tree');
    setExpanded([]);
    setSelectedClass(null);
    setTreeRows([]);
    setSearchText('');
    setFindRows([]);
    void retrieveTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] tree.Selection (L84) → retrievePage() L197-200 → Dcr00_Tab_TreeFundPlan.retrieve(classTreeModel) L57-72:
  //   그리드를 비우고, 하위 분류가 없는 분류일 때만 서비스 dcr.Dcr01_ClassTree.selectByClassTreeId(companyId, parentId)
  const retrievePage = async (id: number) => {
    setTreeRows([]);
    if (classRows.some(r => r.parentTreeId === id)) return;  // 하위 분류가 더 있다.
    setTreeLoading(true);  // grid.mask()
    try {
      setTreeRows(await dcrApi.searchFundPlanByParent(id));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setTreeLoading(false);
    }
  };

  // [E1] searchField.KeyPress [Enter] (L41)·[E2] searchButton[조회].Select (L49) → retrieve() L80-94: 서비스 dcr.Dcr01_ClassTree.selectByText(companyId, typeCode T, searchText %…%)
  const retrieveFind = async () => {
    setFindLoading(true);  // grid.mask()
    try {
      setFindRows(await dcrApi.searchFundPlanByText(searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setFindLoading(false);
    }
  };

  // [E1] oKButton[확인].Select (L46) → confirm() L67-77: 활성 탭의 getSelectList()를 callback에 주고 hide().
  // 고른 행이 없으면 원본은 callback이 예외(get(0))를 내 창이 그대로 열려 있다 → 아무 일 없이 열어 둔다
  const confirm = () => {
    const grid = activeTab === 'tree' ? treeGridRef.current : findGridRef.current;
    const selectList = grid?.api?.getSelectedRows() ?? [];
    if (selectList.length === 0) return;
    onResult(selectList);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="문서구분"
      width={1090}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E2] cancelButton[닫기].Select (L54) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={k => setActiveTab(k as 'tree' | 'find')}
        items={[
          {
            key: 'tree',
            label: '문서분류',
            forceRender: true,
            children: (
              <div style={{ display: 'flex', gap: 2, height: 540 }}>
                <div style={{ width: '40%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  {/* buttonBar: 문서분류 [조회]. docSearch 칸은 원본에서 툴바에 붙이지 않아(주석) [E1 생략] docSearch.KeyPress (L51) → search()는 도달 불가라 만들지 않음 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 50, flex: 'none' }}>
                    <span>문서분류</span>
                    <Button type="search" onClick={retrieveTree}>조회</Button>
                  </div>
                  {/* getMenuTree() L104-138: 한 번 눌러도 노드가 열리고 닫힌다(onClick → onDoubleClick) */}
                  <div style={{ flex: 1, minHeight: 0, overflow: 'auto', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
                    {treeData.length > 0 && (
                      <Tree
                        treeData={treeData}
                        expandedKeys={expanded}
                        onExpand={keys => setExpanded(keys)}
                        selectedKeys={selectedClass == null ? [] : [selectedClass]}
                        onSelect={(keys, info) => {
                          const id = keys.length ? Number(keys[0]) : Number(info.node.key);
                          setSelectedClass(id);
                          setExpanded(prev => (prev.includes(info.node.key) ? prev.filter(k => k !== info.node.key) : [...prev, info.node.key]));
                          void retrievePage(id);
                        }}
                      />
                    )}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
                  <MultiGrid<DcrFundPlanLookup> rowClick gridRef={treeGridRef} rowData={treeRows} columnDefs={treeColumns} getRowId={p => String(p.data.classTreeId)} loading={treeLoading} />
                </div>
              </div>
            ),
          },
          {
            key: 'find',
            label: '문서분류찾기',
            forceRender: true,
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: 540, border: '1px solid #d9d9d9', boxSizing: 'border-box', padding: 8 }}>
                <SearchBar searchText="조회" onSearch={retrieveFind} loading={findLoading}>
                  <SearchBar.Field label="검색">
                    <SearchBar.Input style={{ width: 300 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
                  </SearchBar.Field>
                </SearchBar>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <MultiGrid<DcrFundPlanLookup> rowClick gridRef={findGridRef} rowData={findRows} columnDefs={findColumns} getRowId={p => String(p.data.classTreeId)} loading={findLoading} />
                </div>
              </div>
            ),
          },
        ]}
      />
    </LookupModal>
  );
};
