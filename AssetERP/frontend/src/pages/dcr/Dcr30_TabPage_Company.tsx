/**
 * 문서분류지정 아래쪽 — 목적지 회사 (E17) — Dcr30_Tab_LinkAdmin의 south.
 * AS-IS: myApp/client/vi/dcr/Dcr30_TabPage_Company.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃: west = 회사 툴바(회사명 180 · 조회) + 회사 MultiGrid(고객명 180 · Sub-Domain 105), center = 고른 회사의 Link SingleGrid
 *   (Link명 400 · 문서분류명 450(조회창) · 데이터연결(양식) 95 · 비고 550 · 비고 아이콘 60)
 * 부모(Dcr30_Tab_LinkAdmin)가 forwardRef 핸들로 open(searchText)·retrieveLinks(searchText)·retrieve()·getModels()를 부른다
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { message, Space, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button as AntButton } from 'antd';
import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { dcrApi } from '@/api/dcr';
import { sysApi } from '@/api/sys';
import { comApi } from '@/api/com';
import { errorMessage } from '@/api/client';
import { Company } from '@/types/sys';
import { DcrLink } from '@/types/dcr';
import { FormMapping } from '@/types/com';
import { MultiGrid, SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Com10_Lookup_CommonMapping } from '@/pages/com/Com10_Lookup_CommonMapping';
import { Dcr30_Lookup_LinkNote } from './Dcr30_Lookup_LinkNote';

const gbCompany = gbFor<Company>();
const gbLink = gbFor<DcrLink>();

/** AS-IS buildGrid() L123-132 (setChecked MULTI) */
const buildGrid = (): ColDef<Company>[] => [
  gbCompany.text('companyNm', 180, '고객명'),  // L129
  gbCompany.text('locNm', 105, 'Sub-Domain'),  // L130
];

export interface Dcr30CompanyHandle {
  /** open(searchText) L61 — 부모가 조회할 때 넘기는 검색어(AS-IS는 "%…%", 여기서는 서버가 %로 감싸므로 글자만) */
  open: (searchText: string) => void;
  /** retrieve(companyId, searchText) L222 — 고른 회사의 Link만 다시 조회(회사 목록은 그대로) */
  retrieveLinks: (searchText: string) => Promise<void>;
  /** retrieve() L204 — 회사 목록을 다시 조회하고 고른 회사의 Link도 조회 */
  retrieve: () => Promise<void>;
  /** getModels() L281: 체크한 회사들 */
  getModels: () => Company[];
}

interface Props {
  /** 부모가 처음 조회하기 전의 검색어 */
  initialSearch?: string;
}

export const Dcr30_TabPage_Company = forwardRef<Dcr30CompanyHandle, Props>(({ initialSearch = '' }, ref) => {
  const columnDefs = useMemo(buildGrid, []);
  const [searchText, setSearchText] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<DcrLink[]>([]);
  const [linkLoading, setLinkLoading] = useState(false);
  const search = useRef(initialSearch);              // AS-IS 필드 search (open(searchText)로 바뀐다)
  const selected = useRef<Company | null>(null);     // grid.getSelectionModel().getSelectedItem() — 마지막으로 고른(클릭한) 회사
  const checked = useRef<Company[]>([]);             // companyMenu.getModels() — 체크한 회사들
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [classTarget, setClassTarget] = useState<DcrLink | null>(null);
  const [mapping, setMapping] = useState<{ model: FormMapping; link: DcrLink } | null>(null);
  const [noteLink, setNoteLink] = useState<DcrLink | null>(null);

  // retrieve(companyId, searchText) L222-240: 고른 회사가 없으면 아무 일도 없다(원본은 NPE)
  const retrieveLinks = useCallback(async (company: Company | null = selected.current, text: string = search.current) => {
    if (company == null) return;
    setLinkLoading(true);
    try {
      setLinks(await dcrApi.searchLinks(text, company.companyId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLinkLoading(false);
    }
  }, []);

  // retrieve() L204-220: sys.Sys01_Company.selectByName("%x%") 뒤 retrieve(고른 회사, search)
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await sysApi.searchCompanies(searchText, true);
      setCompanies(list);
      const keep = list.find(c => c.companyId === selected.current?.companyId) ?? null;
      selected.current = keep;
      setSelectedId(keep?.companyId ?? null);
      checked.current = checked.current.filter(c => list.some(l => l.companyId === c.companyId));
      await retrieveLinks(keep);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [searchText, retrieveLinks]);

  useImperativeHandle(ref, () => ({
    open: (text: string) => { search.current = text; },
    retrieveLinks: (text: string) => retrieveLinks(selected.current, text),
    retrieve,
    getModels: () => checked.current,
  }), [retrieve, retrieveLinks]);

  // [E0] 화면 열림 (생성자 L65-96) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // update() L260-279: dcr.Dcr30_Link.update → updateDcrAuth(고른 회사) → retrieve(고른 회사, search)
  const update = async (link: DcrLink, patch: { classTreeId: number | null }) => {
    const company = selected.current;
    if (company == null) return;
    try {
      await dcrApi.updateLinks([{ linkId: link.linkId, classTreeId: patch.classTreeId, note: link.note }], company.companyId);
      await retrieveLinks(company);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // 데이터연결(양식) 아이콘 L136-169: com.Com10_FormMapping.selectById(formMappingId) → 없으면 새 모델(회사 = 로그인 회사) → Com10_Lookup_CommonMapping.open
  const openMapping = async (link: DcrLink) => {
    try {
      const found = link.formMappingId != null ? await comApi.getFormMapping(link.formMappingId) : null;
      setMapping({ model: found ?? {}, link });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  /** AS-IS buildDcrGrid() L134-202 */
  const dcrColumnDefs = useMemo<ColDef<DcrLink>[]>(() => [
    gbLink.text('linkName', 400, 'Link명'),  // L184
    // L185 classTreeFullName + lookupClassTree(LookupTriggerField) — 아이콘으로 문서분류 조회창 (E4)
    gbLink.text('classTreeFullName', 450, '문서분류명', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: CustomCellRendererProps<DcrLink>) => (
        <Space size={4}>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setClassTarget(p.data); }} />
          {p.value}
        </Space>
      ),
    }),
    iconCell<DcrLink>('edit', 'actionCell01', 95, '데이터연결(양식)', openMapping),  // L186
    gbLink.text('note', 550, '비고'),  // L187
    iconCell<DcrLink>('edit', 'actionCell02', 60, '비고', setNoteLink),  // L188
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <>
      <Splitter style={{ height: '100%', background: '#fff' }}>
        <Splitter.Panel defaultSize={330} min={250}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 8, boxSizing: 'border-box' }}>
            {/* [E1] searchText.KeyPress [Enter] (L100), [E2] retrieveButton[조회].Select (L108) → retrieve() */}
            <SearchBar onSearch={retrieve} loading={loading} style={{ flexWrap: 'nowrap' }}>
              <SearchBar.Field label="회사명">
                <SearchBar.Input style={{ width: 180 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              <MultiGrid<Company>
                rowData={companies}
                columnDefs={columnDefs}
                loading={loading}
                getRowId={p => String(p.data.companyId)}
                onCheckedChange={rows => { checked.current = rows; }}
                // [E3] grid.RowClick (L114) → retrieve(고른 회사, search)
                onRowClicked={e => {
                  if (!e.data) return;
                  selected.current = e.data;
                  setSelectedId(e.data.companyId);
                  retrieveLinks(e.data);
                }}
                rowClassRules={{ 'ag-row-selected': p => p.data?.companyId === selectedId }}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', padding: 8, boxSizing: 'border-box' }}>
            <SingleGrid<DcrLink>
              rowData={links}
              columnDefs={dcrColumnDefs}
              loading={linkLoading}
              getRowId={p => String(p.data.linkId)}
            />
          </div>
        </Splitter.Panel>
      </Splitter>

      {/* [E4] lookupClassTree.TriggerClick (L171) → lookupClassTree() L242-258: openNull(회사ID, 회사명, cb) → 고른 분류로 update() */}
      <Dcr30_Move_DcrClass
        open={classTarget != null}
        companyId={selected.current?.companyId}
        companyName={selected.current?.companyNm}
        onResult={r => { if (classTarget) update(classTarget, { classTreeId: r.classTreeId }); }}
        onClose={() => setClassTarget(null)}
      />
      <Com10_Lookup_CommonMapping
        model={mapping?.model ?? null}
        linkId={mapping?.link.linkId ?? 0}
        linkCode={mapping?.link.linkCode ?? ''}
        onSaved={() => undefined}
        onClose={() => setMapping(null)}
      />
      <Dcr30_Lookup_LinkNote link={noteLink} onSaved={() => retrieveLinks()} onClose={() => setNoteLink(null)} />
    </>
  );
});
