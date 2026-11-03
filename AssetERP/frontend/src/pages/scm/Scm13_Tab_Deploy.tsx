/**
 * [1266] KFS > 02. 배포관리 > 배포처리 (EE18)
 * AS-IS: myApp/client/vi/scm/Scm13_Tab_Deploy.java (246줄) + Scm13_Page_Deploy(200줄) + Scm13_Lookup_Note(94줄) + Scm30_Edit_Program(465줄, 소스보기 read 모드)
 *   (Scm01_Lookup_Detail·Scm11_Lookup_DevStep(view)·Scm11_Grid... 는 EE15~EE17 재사용) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-103: BorderLayout 가운데(여백 20) = 툴바 50(조회기간 100 · 시스템 · □전체보기 · 검색 250 · [조회]) + 그리드(행번호, 단일 선택·체크 없음), 아래 400(여백 0,20,20,20) = Scm13_Page_Deploy
 * 열 때 조회한다(L102 retrieve()). 시스템 콤보는 로그인 사원 조직이 경영본부(23541)·IT금융사업본부(23542)면 "AssetERP", 아니면 "ICAM(운용)" (settings L105-141)
 * 스타일: GG (견본 Est02_Tab_PfResultReport — 아래 400 고정)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Deploy, Sr } from '@/types/scm';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Scm01_Lookup_Detail } from './Scm01_Lookup_Detail';
import { Scm11_Lookup_DevStep } from './Scm11_Lookup_DevStep';
import { Scm13_Page_Deploy } from './Scm13_Page_Deploy';

const gb = gbFor<Deploy>();
const FORMAT = 'YYYY-MM-DD';
const ALL = '%';
const ALL_CODE: [string, string] = [ALL, '전체'];
/** 한국펀드서비스 경영본부 · IT금융사업본부 (settings L111-112) */
const ASSET_ERP_ORGS = [23541, 23542];

export const Scm13_Tab_Deploy: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<Deploy>>(null);
  const selectFirst = useRef<number | null | undefined>(undefined);
  const retrieveSeq = useRef(0);
  const selectedRef = useRef<Deploy | null>(null);
  // settings() L105-141: 조회기간 = 올해 1/1 ~ 오늘, 시스템 = 조직에 따라 AssetERP / ICAM(운용), □전체보기 끔
  const [startDate, setStartDate] = useState(dayjs().startOf('year').format(FORMAT));
  const [closeDate, setCloseDate] = useState(dayjs().format(FORMAT));
  const [systemCode, setSystemCode] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [deployCheck, setDeployCheck] = useState(false);
  const [rows, setRows] = useState<Deploy[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Deploy | null>(null);
  const [pageKey, setPageKey] = useState(0);
  const [detailSr, setDetailSr] = useState<Sr | null>(null);
  const [stepDevId, setStepDevId] = useState<number | null>(null);

  // retrieve() L206-237: scm.Scm11_DevStep.selectByDeployPersonId(personId, startDate, closeDate, "%검색어%", systemCode, checkBox)
  //   → 고른 줄이 있으면 그대로, 없으면 첫 행을 고른다 → retrievePage()
  async function retrieve(over?: { systemCode?: string }) {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await scmApi.searchDeploys({
        startDate, closeDate, searchText, systemCode: over?.systemCode ?? systemCode, checkBox: deployCheck,
      });
      if (my !== retrieveSeq.current) return;
      const cur = selectedRef.current;
      const keep = cur && list.some(d => d.devStepId === cur.devStepId) ? cur.devStepId : null;
      selectFirst.current = list.length > 0 ? keep : undefined;
      setRows(list);
      setPageKey(n => n + 1);
      if (list.length === 0) { selectedRef.current = null; setSelected(null); }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }

  // [E0] 화면 열림 (생성자 L57-103) → settings(), retrieve() — 시스템 콤보 목록과 로그인 사원의 조직을 알아야 첫 시스템을 정한다
  const codesRef = useRef<{ code: string; name: string }[] | null>(null);
  const orgRef = useRef<number | null | undefined>(undefined);
  const started = useRef(false);
  const start = () => {
    if (started.current || codesRef.current == null || orgRef.current === undefined) return;
    started.current = true;
    const name = orgRef.current != null && ASSET_ERP_ORGS.includes(orgRef.current) ? 'AssetERP' : 'ICAM(운용)';
    const code = codesRef.current.find(c => c.name === name)?.code ?? ALL;
    setSystemCode(code);
    void retrieve({ systemCode: code });
  };
  React.useEffect(() => {
    (user.userId < 0 ? Promise.resolve(null) : empApi.getCurrentTransInfo(user.userId).then(t => t.orgCodeId ?? null))
      .catch(() => null)
      .then(org => { orgRef.current = org; start(); });
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E1] grid.SelectionChanged (L93) → retrievePage() L192-204
  const onSelectionChanged = () => {
    const row = gridRef.current?.api?.getSelectedRows()[0] ?? null;
    selectedRef.current = row;
    setSelected(row);
  };

  // buildGrid() L143-190 (체크 없음, 단일 선택)
  const columnDefs = useMemo(() => [
    gb.date('srDate', 100, '요청일'),                                                       // L177
    gb.textCenter('systemNm', 120, '시스템'),                                               // L178
    // requestViewCell (L144-163): scm.Scm01_Sr.getSrModel(devId) → Scm01_Lookup_Detail.open(srModel)
    iconCell<Deploy>('view', 'requestViewCell', 70, '개발의뢰<br>상세보기', row => {        // L179
      scmApi.getSrByDev(row.devId).then(setDetailSr).catch(err => message.error(errorMessage(err, '조회 실패')));
    }),
    gb.text('devNote', 650, '개발내용'),                                                    // L180
    gb.textCenter('devPersonNm', 100, '개발자'),                                            // L181
    gb.textCenter('resultDateStr', 150, '배포완료일시'),                                    // L183
    gb.longCenter('deployCount', 70, '배포건수'),                                           // L184
    gb.textCenter('devStepResult', 100, '개발진행상태'),                                    // L185
    // progressViewCell (L165-171): Scm11_Lookup_DevStep.view(devId)
    iconCell<Deploy>('view', 'progressViewCell', 40, '', row => setStepDevId(row.devId)),   // L186
    gb.textCenter('srNo', 100, 'SR번호'),                                                   // L187
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* [E2] searchText.KeyPress [Enter] (L126) → retrieve(), [E3] retrieveButton[조회].Select (L135) → retrieve() */}
              <SearchBar onSearch={() => void retrieve()} loading={loading}>
                <SearchBar.Field label="조회기간">
                  <DatePicker value={dayjs(startDate)} format={FORMAT} allowClear={false} style={{ width: 120 }} onChange={d => d && setStartDate(d.format(FORMAT))} />
                  <span style={{ margin: '0 6px' }}>~</span>
                  <DatePicker value={dayjs(closeDate)} format={FORMAT} allowClear={false} style={{ width: 120 }} onChange={d => d && setCloseDate(d.format(FORMAT))} />
                </SearchBar.Field>
                <SearchBar.Field label="시스템">
                  <SystemCodeComboBox kindCd="SystemCode" altCode={ALL_CODE} style={{ width: 130 }} value={systemCode}
                    onLoad={list => { codesRef.current = list; start(); }}
                    onChange={c => setSystemCode(c ?? ALL)} />
                </SearchBar.Field>
                <Checkbox checked={deployCheck} onChange={e => setDeployCheck(e.target.checked)} style={{ fontSize: 12 }}>전체보기</Checkbox>
                <SearchBar.Field label="검색">
                  <SearchBar.Input style={{ width: 250 }} placeholder="개발내용/프로그램ID/프로그램명/SR번호" value={searchText} onChange={e => setSearchText(e.target.value)} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<Deploy>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.devStepId)}
                  loading={loading}
                  onRowDataUpdated={e => {
                    const want = selectFirst.current;
                    if (want === undefined) return;
                    selectFirst.current = undefined;
                    const node = want != null ? e.api.getRowNode(String(want)) : e.api.getDisplayedRowAtIndex(0);
                    node?.setSelected(true);
                  }}
                  onSelectionChanged={onSelectionChanged}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={400} min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Scm13_Page_Deploy dev={selected} reloadKey={pageKey} onCompleted={() => void retrieve()} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Scm01_Lookup_Detail open={detailSr != null} sr={detailSr} onClose={() => setDetailSr(null)} />
      <Scm11_Lookup_DevStep open={stepDevId != null} devId={stepDevId} mode="view" onClose={() => setStepDevId(null)} />
    </div>
  );
};
