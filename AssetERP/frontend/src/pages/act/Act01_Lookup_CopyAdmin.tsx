/**
 * 고객사별 계정과목 반영 창 (E27) — Act01_Tab_AccountCode의 [계정과목복사]에서 연다
 * AS-IS: myApp/client/vi/act/Act01_Lookup_CopyAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L67-73·open() L75-124: 모달 1100×700 "고객사별 계정과목 반영", 왼쪽(65%, 분할) = 툴바(기준고객사 150 · [조회] · 계정과목 · [찾기]) + 계정과목 트리(계정코드 100 · 계정과목 500 · 전표생성 80),
 * 오른쪽(35%) = 툴바 [계정과목복사] + 고객사 체크박스 그리드(고객사 200 · " " 100), 아래 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Space, Splitter } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AccountCodeTree, ActCompany } from '@/types/act';
import { Company } from '@/types/sys';
import { Button } from '@/components/button';
import { MultiGrid, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { useTreeGrid } from '@/hooks/useTreeGrid';

const gb = gbFor<ActCompany>();
const tgb = gbFor<AccountCodeTree>();

/** AS-IS buildGrid() L191-198: setChecked(MULTI) */
const buildGrid = () => [
  gb.text('companyName', 200, '고객사'),  // L195
  gb.text('locationName', 100, ' '),  // L196
];

/** 트리 선택은 한 행 (체크박스 없음). rowSelection은 상수로 넘긴다(11 §1 함정) */
const TREE_SELECTION = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Act01_Lookup_CopyAdmin: React.FC<Props> = ({ open, onClose }) => {
  const companyGridRef = useRef<AgGridReact<ActCompany>>(null);
  const tree = useTreeGrid<AccountCodeTree>({ idField: 'accountCodeId', parentField: 'parentId', depthField: 'level' });
  // 기준 고객사 — 열면 ADMIN(0). 선택안함이면 null (setting() L126-189)
  const [stdCompanyId, setStdCompanyId] = useState<number | null>(0);
  const [stdCompanyName, setStdCompanyName] = useState('ADMIN');
  const [searchText, setSearchText] = useState('');
  const [companies, setCompanies] = useState<ActCompany[]>([]);
  const [companyOpen, setCompanyOpen] = useState(false);
  const pendingFind = useRef<{ select: number; focus: number } | null>(null);
  const columnDefs = useMemo(buildGrid, []);
  const treeColumns = useMemo(() => [
    tgb.textCenter('accountCode', 100, '계정코드'),  // L203
    tree.treeCol('accountName2', 500, '계정과목'),  // L204 — getTreeGrid(2): 트리 열은 계정과목
    tgb.boolean('slipYn', 80, '전표생성'),  // L205
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [tree.treeCol]);

  // retrieve() L210-246: 기준 고객사가 없으면 "기준 고객사를 선택해주세요", 있으면 selectTreeByCompanyId — 서버가 전위 순서로 주므로 부모 ID만 코드로 찾아 채운다
  const retrieve = useCallback(async (companyId: number | null) => {
    if (companyId == null) return message.warning('기준 고객사를 선택해주세요');
    try {
      const list = await actApi.searchAccountTree(companyId);
      const idByCode = new Map(list.map(a => [a.accountCode, a.accountCodeId]));
      tree.setRows(list.map(a => ({ ...a, parentId: idByCode.get(a.parentCode ?? '') ?? 0 })));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [tree.setRows]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E0] 화면 열림 (생성자 L67-73) → open() L75-124: 열 때 기준 고객사 ADMIN · retrieveCompany() L258-261 · retrieve()
  useEffect(() => {
    if (!open) return;
    setStdCompanyId(0);
    setStdCompanyName('ADMIN');
    setSearchText('');
    tree.setRows([]);
    void (async () => {
      try {
        setCompanies(await actApi.searchCopyCompanies());
      } catch (err) {
        message.error(errorMessage(err, '조회 실패'));
      }
    })();
    void retrieve(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] stdCompanyField.TriggerClick [result == null] (L135) → Sys01_Lookup_Company.open(): 고르면 칸·ID 설정, 선택안함이면 비운다
  const onCompanyResult = (company: Company | null) => {
    setCompanyOpen(false);
    if (company == null) {
      setStdCompanyName('');
      setStdCompanyId(null);
    } else {
      setStdCompanyName(company.companyNm);
      setStdCompanyId(company.companyId);
    }
  };

  // [E2] searchText.KeyPress [Enter] (L156) / [E3] searchButton[찾기].Select (L165) → search() L302-338
  const search = () => {
    const api = tree.gridRef.current?.api;
    api?.deselectAll();
    tree.collapseAll();
    if (!searchText) return;
    const matches = tree.rows.filter(a => (a.accountName + a.accountCode).indexOf(searchText) > -1);
    if (matches.length === 0) return;
    // 일치하는 계정의 부모를 펼친다. 선택은 마지막 일치 행(단일 선택이라 마지막이 남는다), 화면 이동은 처음·가장 깊은 일치 행
    tree.expandAncestors(matches.map(a => a.accountCodeId));
    let focus = matches[0];
    matches.forEach(a => { if (a.level > focus.level) focus = a; });
    pendingFind.current = { select: matches[matches.length - 1].accountCodeId, focus: focus.accountCodeId };
  };
  // 펼침이 반영된 뒤(필터가 바뀐 뒤)에 선택하고 보이게 한다
  useEffect(() => {
    const p = pendingFind.current;
    const api = tree.gridRef.current?.api;
    if (!p || !api) return;
    pendingFind.current = null;
    setTimeout(() => {
      api.getRowNode(String(p.select))?.setSelected(true);
      const idx = api.getRowNode(String(p.focus))?.rowIndex;
      if (idx != null) api.ensureIndexVisible(idx);
    });
  }, [tree.expanded]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E5] updateButton[계정과목복사].Select (L177) → update() L263-300
  const update = async () => {
    const selected = tree.gridRef.current?.api.getSelectedRows()[0];
    if (!selected) return message.warning('계정과목을 선택해주세요');
    if (selected.slipYn !== 'true') return message.warning('전표발생 계정과목을 선택해주세요');
    const checked = companyGridRef.current?.api.getSelectedRows() ?? [];
    if (checked.length === 0) return message.warning('고객사를 선택해주세요');
    try {
      await actApi.copyAdminAccountCodes(selected.companyId, selected.accountCode, checked.map(c => c.companyId));
      message.info('계정과목 반영이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '반영 실패'));
    }
  };

  return (
    <LookupModal open={open} title="고객사별 계정과목 반영" width={1100} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E6] closeButton[닫기].Select (L183) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 540 }}>
        <Splitter>
          <Splitter.Panel defaultSize="65%" min="30%">
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 8 }}>
              {/* [E4] retrieveButton[조회].Select (L171) → retrieve() */}
              <SearchBar
                onSearch={() => retrieve(stdCompanyId)}
                extra={
                  <>
                    <SearchBar.Field label="계정과목">
                      {/* Enter는 조회가 아니라 찾기 (SearchBar.Input은 Enter = 조회라 쓰지 않는다) */}
                      <Input allowClear style={{ width: 150 }} value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={search} />
                    </SearchBar.Field>
                    <Button type="search" onClick={search}>찾기</Button>
                  </>
                }
              >
                <SearchBar.Field label="기준고객사">
                  <LookupInput width={150} value={stdCompanyName} onOpen={() => setCompanyOpen(true)} onClear={() => onCompanyResult(null)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0 }}>
                <SingleGrid<AccountCodeTree>
                  gridRef={tree.gridRef}
                  {...tree.gridProps}
                  columnDefs={treeColumns}
                  rowNumber={false}
                  rowSelection={TREE_SELECTION}
                />
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 8 }}>
              <Space>
                <Button type="change" onClick={update}>계정과목복사</Button>
              </Space>
              <div style={{ flex: 1, minHeight: 0 }}>
                <MultiGrid<ActCompany> rowClick
                  gridRef={companyGridRef}
                  rowData={companies}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.companyId)}
                />
              </div>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
      <Sys01_Lookup_Company open={companyOpen} onResult={onCompanyResult} onClose={() => setCompanyOpen(false)} />
    </LookupModal>
  );
};
