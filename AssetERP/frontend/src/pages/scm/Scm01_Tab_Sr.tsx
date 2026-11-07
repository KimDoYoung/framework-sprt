/**
 * [1261] KFS > 01. 시스템 개발 > 시스템 개발 의뢰 (EE15)
 * AS-IS: myApp/client/vi/scm/Scm01_Tab_Sr.java (364줄) + Scm01_Edit_Sr(773줄, 가운데 입력·결재 폼) + Scm01_Edit_SrRO(128줄, 아래 처리결과 읽기 전용 폼)
 *   + Scm01_Lookup_SrContent·Scm01_Grid_ApprFile·Scm02_Grid_ApprStep·Scm02_Edit_ApprStep·Scm02_Edit_NoteMessage
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L74-130: 위(250, 분할 가능, 여백 20·20·0·20) = 툴바 두 줄(조회기간·시스템·상태·미완료건만 보기·[조회][등록][삭제] / 검색조건·미승인건만 보기·내 등록건만 보기) + 의뢰 그리드
 *   / 가운데(Scm01_Edit_Sr, 여백 20) / 아래(150, 여백 0·20·20·20, Scm01_Edit_SrRO)
 * 열 때 settings() L132-206 끝에서 retrieve()를 부른다. 조회가 끝나면 첫 행을 고른다
 * 스타일: SGVF (견본 Fnd01_Tab_FundSearch — 아래 폼이 둘이라 분할이 셋이다)
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, DatePicker, Input, message, Modal, Splitter } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { scmApi } from '@/api/scm';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { Sr } from '@/types/scm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Scm01_Edit_Sr } from './Scm01_Edit_Sr';
import { Scm01_Edit_SrRO } from './Scm01_Edit_SrRO';

const gb = gbFor<Sr>();
const FORMAT = 'YYYY-MM-DD';
const ALL = '%';
/** 콤보 "전체"(ComboBoxField(kind, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];
/** setChecked 단일 → 한 행 선택. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;
/** settings() L141-155: 이 조직(경영관리실·IT개발실·고객지원팀)이면 시스템 콤보 기본값이 AssetERP, 아니면 ICAM(운용). SystemCode 20 = AssetERP / 10 = ICAM */
const ASSETERP_ORGS = [23541, 23542, 202209221337019];

export const Scm01_Tab_Sr: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<Sr>>(null);
  const selectFirst = useRef(false);
  const retrieveSeq = useRef(0);
  const [startDate, setStartDate] = useState(dayjs().startOf('year').format(FORMAT));
  const [closeDate, setCloseDate] = useState(dayjs().format(FORMAT));
  const [systemCode, setSystemCode] = useState<string>('10');
  const [srStatus, setSrStatus] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [checkBox01, setCheckBox01] = useState(true);
  const [checkBox02, setCheckBox02] = useState(true);
  const [checkBoxMyReg, setCheckBoxMyReg] = useState(true);
  const [rows, setRows] = useState<Sr[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Sr | null>(null);

  // [E0] 화면 열림 (생성자 L74-130) → settings() 끝에서 retrieve()
  // 시스템 구분 기본값 = 로그인 사원의 조직이 AssetERP 팀이면 20, 아니면 10 (AS-IS LoginUser.getOrgCodeId()). user.deptId 는 아직 설정값("D101" 같은 글자)이라 쓸 수 없어 서버에서 읽는다
  useEffect(() => {
    void (async () => {
      let code = '10';
      try { if (ASSETERP_ORGS.includes(await aprApi.getMyOrgCodeId())) code = '20'; } catch { /* 기본값 '10' */ }
      setSystemCode(code);
      await retrieve({ systemCode: code });
    })();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] systemComboBox.Collapse (L152) · [E3] srStatusComboBox.Collapse (L160) · [E4] searchText.KeyPress [Enter] (L178) · [E5] retrieveButton[조회].Select (L186)
  //   → retrieve() L250-291: scm.Scm01_Sr.selectByText(startDate, closeDate, "%검색어%", systemCode, srStatus, checkBox01, checkBox02, checkBoxMyReg, personId, gubun="sr")
  async function retrieve(over?: { systemCode?: string; srStatus?: string }) {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const list = await scmApi.searchSrs({
        startDate, closeDate, searchText,
        systemCode: over?.systemCode ?? systemCode, srStatus: over?.srStatus ?? srStatus,
        checkBox01, checkBox02, checkBoxMyReg,
      });
      if (my !== retrieveSeq.current) return;
      selectFirst.current = list.length > 0;  // 조회가 끝나면 첫 행을 고른다(onRowDataUpdated)
      setRows(list);
      if (list.length === 0) setSelected(null);  // editBoard1.mask(), editBoard2.mask()
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);
    }
  }

  // [E1] grid.RowClick (L124) → retrieveEditPage() L227-248: editBoard1.retrieve(srModel) 뒤 editBoard2.retrieve(srModel), 선택이 없으면 init()
  const retrieveEditPage = () => setSelected(gridRef.current?.api?.getSelectedRows()[0] ?? null);

  // [E6] insertButton[등록].Select (L192) → insertRow() L293-307: GridInsertRow(srDate = 오늘, personId = 로그인 사원). 새 행 번호는 getSeq(첨부파일을 올리려면 번호가 먼저 있어야 한다)
  const insertRow = async () => {
    try {
      const srId = await scmApi.nextSrId();
      const row: Sr = { srId, srDate: dayjs().format(FORMAT), personId: user.userId };
      setRows(prev => [...prev, row]);  // 03 원칙 17: 맨 아래에 넣고 보이게 스크롤한다
      setTimeout(() => {
        const node = gridRef.current?.api?.getRowNode(String(srId));
        if (!node) return;
        node.setSelected(true);
        gridRef.current?.api?.ensureNodeVisible(node);
      }, 0);
    } catch (err) {
      message.error(errorMessage(err, '등록 실패'));
    }
  };

  // [E7] deleteButton[삭제].Select (L198) → deleteRow() L309-329 → [E8] messageBox.DialogHide [YES] (L319) → deleteSelectedRow() L331-345
  const deleteRow = () => {
    if (!selected) { message.warning('삭제할 개발의뢰를 선택해주세요'); return; }
    if (selected.apprStatusCd != null && selected.apprStatusCd !== '99') {
      message.warning('상신중이거나 완료/반려된 문서는 삭제가 불가능합니다');
      return;
    }
    Modal.confirm({
      title: '삭제', content: '선택한 내용을 삭제하시겠습니까?', width: 300, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          await scmApi.deleteSrs([selected.srId]);
          selectFirst.current = true;  // GridDeleteData 뒤 첫 행을 고른다
          setRows(prev => prev.filter(r => r.srId !== selected.srId));
          setSelected(null);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // 저장·승인·반려 뒤 바뀐 줄 (GridUpdate.update(grid.getStore(), …))
  const onSaved = (row: Sr) => {
    setRows(prev => (prev.some(r => r.srId === row.srId) ? prev.map(r => (r.srId === row.srId ? row : r)) : [...prev, row]));
    setSelected(row);
  };

  // buildGrid() L208-225 (체크 단일)
  const columnDefs = useMemo(() => [
    gb.date('srDate', 100, '요청일'),
    gb.textCenter('systemNm', 120, '시스템구분'),
    gb.text('srTypeNm', 100, '요청구분'),
    gb.textCenter('personNm', 70, '등록자'),
    gb.text('requestorCorpNm', 130, '요청자'),
    gb.text('srArrangeContent', 650, '요청내용'),
    gb.longCenter('fileCount', 70, '첨부파일'),
    gb.textCenter('apprStatusNm', 100, '승인상태'),
    gb.textCenter('srStatusNm', 100, '처리상태'),
    gb.date('closeDate', 100, '처리완료일'),
    gb.textCenter('srNo', 100, 'SR번호'),
  ], []);

  const checkLabel: React.CSSProperties = { fontSize: 12 };

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={290} min={150}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={
                  <>
                    <Button type="register" onClick={insertRow}>등록</Button>
                    <Button type="delete" onClick={deleteRow}>삭제</Button>
                  </>
                }
              >
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
                <Checkbox checked={checkBox01} onChange={e => setCheckBox01(e.target.checked)} style={checkLabel}>미완료건만 보기</Checkbox>
              </SearchBar>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 12 }}>검색조건</span>
                <Input
                  allowClear
                  style={{ width: 648 }}
                  placeholder="등록자/요청자/요청내용/처리내용/결재(합의/참조)자/SR번호"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onPressEnter={() => void retrieve()}
                />
                <Checkbox checked={checkBox02} onChange={e => setCheckBox02(e.target.checked)} style={checkLabel}>미승인건만 보기</Checkbox>
                <Checkbox checked={checkBoxMyReg} onChange={e => setCheckBoxMyReg(e.target.checked)} style={checkLabel}>내 등록건만 보기</Checkbox>
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
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={360}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
              <Scm01_Edit_Sr sr={selected} onSaved={onSaved} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={190} min={120}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
              <Scm01_Edit_SrRO sr={selected} />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
