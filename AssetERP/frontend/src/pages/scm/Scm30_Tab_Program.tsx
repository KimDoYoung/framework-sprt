/**
 * [1265] KFS > 03. 프로그램 관리 > 프로그램 관리 (EE19)
 * AS-IS: myApp/client/vi/scm/Scm30_Tab_Program.java (287줄) + Scm30_Lookup_Program(207줄) + Scm30_Lookup_MultiUpload(147줄) + Scm30_Edit_Program(465줄, insert·edit·versionEdit 모드 추가)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L55-96: BorderLayout 가운데(여백 20) = 툴바 50(시스템 120 · 구분 100 · 사용여부 100 · 검색 300 "구분/프로그램ID/프로그램명/파일명/비고" · [조회][등록][파일일괄등록]) + 그리드(행번호, 단일 선택) + 아래 페이징 툴바(100건)
 * 열 때 조회하지 않는다(생성자의 toolBar.refresh()는 조건이 비어 있다). settings() L98-156: 시스템 = 로그인 사원 조직이 경영본부(23541)·IT금융사업본부(23542)면 "AssetERP", 아니면 "ICAM(운용)", 구분 "전체", 사용여부 "사용"
 * 스타일: SGP (견본 Chk02_Tab_DailyList — [등록]·소스보기 아이콘이 편집 팝업 Scm30_Edit_Program 을 연다)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 조건이 4개이지만 원본 버튼 3개가 있어 한 줄에 넣을 공간이 없어 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { message, Select } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { empApi } from '@/api/emp';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { Program } from '@/types/scm';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Scm30_Edit_Program } from './Scm30_Edit_Program';
import { Scm30_Lookup_MultiUpload } from './Scm30_Lookup_MultiUpload';
import { Scm30_Lookup_Program } from './Scm30_Lookup_Program';

const gb = gbFor<Program>();
const LIMIT = 100;
const ALL = '%';
const ALL_CODE: [string, string] = [ALL, '전체'];
/** 한국펀드서비스 경영본부 · IT금융사업본부 (settings L98-104) */
const ASSET_ERP_ORGS = [23541, 23542];
const USE_YN_OPTIONS = [{ value: '%', label: '전체' }, { value: 'true', label: '사용' }, { value: 'false', label: '미사용' }];

export const Scm30_Tab_Program: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<Program>>(null);
  const retrieveSeq = useRef(0);
  const [systemCode, setSystemCode] = useState<string>('');
  const [programType, setProgramType] = useState<string>(ALL);
  const [useYn, setUseYn] = useState<string>('true');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<Program[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<{ mode: 'insert' | 'edit'; program: Program | null } | null>(null);
  const [versionTarget, setVersionTarget] = useState<Program | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  // retrieve() L219-264: 시스템이 없으면 "시스템을 선택하세요", 사용여부 전체/사용/미사용 → %/true/false, 구분이 없으면 %, 검색어는 "%…%" → 1페이지부터
  async function retrieve(p = 1, over?: { systemCode?: string }) {
    const system = over?.systemCode ?? systemCode;
    if (!system) { message.warning('시스템을 선택하세요'); return; }
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await scmApi.searchProgramList({ systemCode: system, programType, useYn, searchText, offset: (p - 1) * LIMIT, limit: LIMIT });
      if (my !== retrieveSeq.current) return;
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
      // 조회가 끝나면 첫 행을 고른다 (callback: grid.getSelectionModel().select(0, false))
      setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true), 0);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }

  // [E0] 화면 열림 (생성자 L55-96) → settings() — 시스템 콤보 목록과 로그인 사원의 조직을 알아야 첫 시스템을 정한다 (조회는 하지 않는다)
  const codesRef = useRef<{ code: string; name: string }[] | null>(null);
  const orgRef = useRef<number | null | undefined>(undefined);
  const started = useRef(false);
  const start = () => {
    if (started.current || codesRef.current == null || orgRef.current === undefined) return;
    started.current = true;
    const name = orgRef.current != null && ASSET_ERP_ORGS.includes(orgRef.current) ? 'AssetERP' : 'ICAM(운용)';
    setSystemCode(codesRef.current.find(c => c.name === name)?.code ?? '');
  };
  React.useEffect(() => {
    (user.userId < 0 ? Promise.resolve(null) : empApi.getCurrentTransInfo(user.userId).then(t => t.orgCodeId ?? null))
      .catch(() => null)
      .then(org => { orgRef.current = org; start(); });
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L158-217 (단일 선택, 행번호)
  const columnDefs = useMemo(() => [
    gb.text('systemNm', 100, '시스템'),                                                              // L204
    gb.text('programTypeNm', 100, '구분'),                                                           // L205
    gb.text('programCd', 250, '프로그램ID'),                                                         // L206
    gb.text('programNm', 350, '프로그램명'),                                                         // L207
    // [E6] sourceViewCell (L165) → Scm30_Edit_Program.edit(grid, selectModel, callback)
    iconCell<Program>('view', 'sourceViewCell', 70, '소스보기', row => setEditTarget({ mode: 'edit', program: row })),  // L208
    // downloadCell (L173-185): FileDownload?fileType=file&fileId
    iconCell<Program>('down', 'downloadCell', 70, '파일다운', row => {                               // L209
      if (row.fileId == null) return;
      fileApi.download(row.fileId).catch(err => message.error(errorMessage(err, '다운로드 실패')));
    }),
    gb.longCenter('version', 40, '버전'),                                                            // L210
    // [E7] versionViewCell (L194) → Scm30_Lookup_Program.open(grid, selectModel, callback)
    iconCell<Program>('view', 'versionViewCell', 30, '', row => setVersionTarget(row)),             // L211
    gb.text('regDateStr', 150, '최종변경일시'),                                                      // L212
    gb.text('note', 330, '비고'),                                                                    // L213
    gb.text('useYn', 70, '사용여부', { valueFormatter: p => (p.value === 'true' ? '사용' : '미사용') }),  // L214 addBooleanString = "사용"/"미사용" 글자
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] searchText.KeyPress [Enter] (L128) → retrieve(), [E3] retrieveButton[조회].Select (L137) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve(1)}
          loading={loading}
          extra={
            <>
              {/* [E4] insertButton[등록].Select (L143) → insertRow() L266-272 */}
              <Button type="register" onClick={() => setEditTarget({ mode: 'insert', program: null })}>등록</Button>
              {/* [E5] fileMultiUploadButton[파일일괄등록].Select (L149) → fileMultiUpload() L274-281 */}
              <Button type="register" onClick={() => setUploadOpen(true)}>파일일괄등록</Button>
            </>
          }
        >
          <SearchBar.Field label="시스템">
            <SystemCodeComboBox kindCd="SystemCode" style={{ width: 120 }} value={systemCode || undefined}
              onLoad={list => { codesRef.current = list; start(); }}
              onChange={c => setSystemCode(c ?? '')} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            {/* [E1] programType (ComboBoxField).callbackOnCreate (L108) → 목록이 만들어지면 "전체"를 고른다 (altCode 전체 = 기본값) */}
            <SystemCodeComboBox kindCd="ProgramType" altCode={ALL_CODE} style={{ width: 100 }} value={programType} onChange={c => setProgramType(c ?? ALL)} />
          </SearchBar.Field>
          <SearchBar.Field label="사용여부">
            <Select style={{ width: 100 }} options={USE_YN_OPTIONS} value={useYn} onChange={setUseYn} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="구분/프로그램ID/프로그램명/파일명/비고" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<Program>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.programId)}
            loading={loading}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void retrieve(p)} />
      </div>
      {/* 저장하면 팝업을 닫고 다시 조회한다 (AS-IS grid.getStore().update(result)) */}
      <Scm30_Edit_Program
        open={editTarget != null}
        mode={editTarget?.mode ?? 'edit'}
        program={editTarget?.program ?? null}
        onSaved={() => void retrieve(page)}
        onClose={() => setEditTarget(null)}
      />
      <Scm30_Lookup_Program open={versionTarget != null} program={versionTarget} onTabChanged={() => void retrieve(page)} onClose={() => setVersionTarget(null)} />
      <Scm30_Lookup_MultiUpload open={uploadOpen} onUploaded={() => void retrieve(1)} onClose={() => setUploadOpen(false)} />
    </div>
  );
};
