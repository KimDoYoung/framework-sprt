/**
 * [1262] KFS > 01. 시스템 개발 > 시스템 개발 관리 (EE16)
 * AS-IS: myApp/client/vi/scm/Scm01_Tab_DevMng.java (301줄) + Scm01_Edit_DevMngRO(228줄, 가운데 요청 읽기 폼) + Scm01_Edit_DevMng(446줄, 아래 처리·개발 폼)
 *   + Scm10_Grid_Dev·Scm03_Grid_ExpectProgram·Scm11_Lookup_DevStep·Scm11_Lookup_Result·Scm10_Lookup_Note·Scm12_Lookup_DevStepRule·Scm13_Lookup_DevProgram·Scm13_Edit_DevProgram·Scm30_Lookup_SelectMulti·Scm01_Lookup_ResultContent·Scm01_Lookup_ApprFile
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L87-107: 위(250, 분할 가능, 여백 20·20·0·20) = 툴바 두 줄(조회기간·시스템·상태·미완료건만 보기·[조회] / 검색조건) + 의뢰 그리드
 *   / 가운데(120, 여백 20·20·0·20, Scm01_Edit_DevMngRO) / 아래(380, 여백 20, Scm01_Edit_DevMng)
 * 열 때 조회하지 않는다(원본 settings() 끝의 `// this.retrieve()`가 주석 처리). 조회가 끝나면 첫 행을 고른다
 * 스타일: SGEF (견본 Sys90_Tab_AfterService — 아래 폼이 둘이라 분할이 셋이다)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { Sr } from '@/types/scm';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Scm01_Edit_DevMng } from './Scm01_Edit_DevMng';
import { Scm01_Edit_DevMngRO } from './Scm01_Edit_DevMngRO';

const gb = gbFor<Sr>();
const FORMAT = 'YYYY-MM-DD';
const ALL = '%';
/** 콤보 "전체"(ComboBoxField(kind, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** setChecked 단일 → 한 행 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
/** settings() L125-134: 이 조직(경영관리실·IT개발실·고객지원팀)이면 시스템 콤보 기본값이 AssetERP, 아니면 ICAM(운용). SystemCode 20 = AssetERP / 10 = ICAM */
const ASSETERP_ORGS = [23541, 23542, 202209221337019];

export const Scm01_Tab_DevMng: React.FC = () => {
  const gridRef = useRef<AgGridReact<Sr>>(null);
  const selectFirst = useRef(false);
  const retrieveSeq = useRef(0);
  const [startDate, setStartDate] = useState(dayjs().startOf('year').format(FORMAT));
  const [closeDate, setCloseDate] = useState(dayjs().format(FORMAT));
  const [systemCode, setSystemCode] = useState<string>('10');
  const [srStatus, setSrStatus] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [checkBox01, setCheckBox01] = useState(true);
  const [rows, setRows] = useState<Sr[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Sr | null>(null);

  // [E0] 화면 열림 (생성자 L63-114) → settings() — 열 때 조회하지 않는다
  // 시스템 구분 기본값 = 로그인 사원의 조직이 AssetERP 팀이면 20, 아니면 10 (AS-IS LoginUser.getOrgCodeId()). user.deptId 는 아직 설정값("D101" 같은 글자)이라 쓸 수 없어 서버에서 읽는다
  useEffect(() => {
    void (async () => {
      try { if (ASSETERP_ORGS.includes(await aprApi.getMyOrgCodeId())) setSystemCode('20'); } catch { /* 기본값 '10' */ }
    })();
  }, []);

  // [E2] systemComboBox.Collapse (L136) · [E3] srStatusComboBox.Collapse (L144) · [E4] searchText.KeyPress [Enter] (L156) · [E5] retrieveButton[조회].Select (L164)
  //   → retrieve() L235-272: scm.Scm01_Sr.selectByDevMng(startDate, closeDate, "%검색어%", systemCode, srStatus, checkBox01, checkBox02 = false, gubun = "mng")
  async function retrieve(over?: { systemCode?: string; srStatus?: string }) {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await scmApi.searchDevMng({
        startDate, closeDate, searchText,
        systemCode: over?.systemCode ?? systemCode, srStatus: over?.srStatus ?? srStatus, checkBox01,
      });
      if (my !== retrieveSeq.current) return;
      selectFirst.current = list.length > 0;  // 조회가 끝나면 첫 행을 고른다(onRowDataUpdated)
      setRows(list);
      if (list.length === 0) setSelected(null);  // editBoard1.init(), editBoard2.init()
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }

  // [E1] grid.RowClick (L108) → retrieveEditPage() L206-233: editBoard1.retrieve(srModel) 뒤 editBoard2.retrieve(srModel), 선택이 없으면 init()
  const retrieveEditPage = () => setSelected(gridRef.current?.api?.getSelectedRows()[0] ?? null);

  // 아래 폼 [저장] 뒤 바뀐 줄 (GridUpdate.update(grid.getStore(), …))
  const onSaved = (row: Sr) => {
    setRows(prev => prev.map(r => (r.srId === row.srId ? row : r)));
    setSelected(row);
  };

  // buildGrid() L186-204 (체크 단일)
  const columnDefs = useMemo(() => [
    gb.date('srDate', 100, '요청일'),
    gb.textCenter('systemNm', 120, '시스템구분'),
    gb.text('srTypeNm', 100, '요청구분'),
    gb.textCenter('personNm', 70, '등록자'),
    gb.text('requestorCorpNm', 150, '요청자'),
    gb.text('srArrangeContent', 650, '요청내용'),
    gb.longCenter('fileCount', 70, '첨부파일'),
    gb.textCenter('srStatusNm', 70, '처리상태'),
    gb.textCenter('devCountStr', 70, '개발상태'),
    gb.date('closeDate', 100, '처리완료일'),
    gb.textCenter('srNo', 100, 'SR번호'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={290} min={200}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar onSearch={() => void retrieve()} loading={loading}>
                <SearchBar.Field label="조회기간">
                  <DatePicker value={dayjs(startDate)} format={FORMAT} allowClear={false} style={{ width: 120 }} onChange={d => d && setStartDate(d.format(FORMAT))} />
                  <span style={{ margin: '0 6px' }}>~</span>
                  <DatePicker value={dayjs(closeDate)} format={FORMAT} allowClear={false} style={{ width: 120 }} onChange={d => d && setCloseDate(d.format(FORMAT))} />
                </SearchBar.Field>
                <SearchBar.Field label="시스템">
                  <SystemCodeComboBox kindCd="SystemCode" altCode={ALL_CODE} style={{ width: 130 }} value={systemCode}
                    onChange={c => { const v = c ?? ALL; setSystemCode(v); void retrieve({ systemCode: v }); }} />
                </SearchBar.Field>
                <SearchBar.Field label="상태">
                  <SystemCodeComboBox kindCd="SrStatus" altCode={ALL_CODE} style={{ width: 120 }} value={srStatus}
                    onChange={c => { const v = c ?? ALL; setSrStatus(v); void retrieve({ srStatus: v }); }} />
                </SearchBar.Field>
                <Checkbox checked={checkBox01} onChange={e => setCheckBox01(e.target.checked)} style={{ fontSize: 12 }}>미완료건만 보기</Checkbox>
              </SearchBar>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 12 }}>검색조건</span>
                <Input
                  allowClear
                  style={{ width: 648 }}
                  placeholder="등록자/요청자/요청내용/처리내용/SR번호/개발진행상태/개발내용/개발결과상세/개발비고"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onPressEnter={() => void retrieve()}
                />
              </div>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                <SingleGrid<Sr>
                  gridRef={gridRef}
                  rowData={rows}
                  columnDefs={columnDefs}
                  getRowId={p => String(p.data.srId)}
                  loading={loading}
                  rowSelection={SINGLE_CHECK}
                  onRowDataUpdated={e => {
                    if (!selectFirst.current) return;
                    selectFirst.current = false;
                    e.api.getDisplayedRowAtIndex(0)?.setSelected(true);
                  }}
                  onSelectionChanged={retrieveEditPage}
                  // [E6] grid.CellDoubleClick [colIndex == 12] (L171) → SR번호 복사 (copyToClipboard)
                  onCellDoubleClicked={e => {
                    if (e.colDef.field === 'srNo' && e.data?.srNo) void navigator.clipboard?.writeText(e.data.srNo).catch(() => undefined);
                  }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={150} min={120}>
          <div style={{ height: '100%', padding: '0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
              <Scm01_Edit_DevMngRO sr={selected} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={360}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
            <div style={{ height: '100%', boxSizing: 'border-box' }}>
              <Scm01_Edit_DevMng sr={selected} onSaved={onSaved} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
