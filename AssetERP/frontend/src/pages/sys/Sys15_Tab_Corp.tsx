/**
 * [1146] 거래처 등록 / [1155] 거래처 관리  (A25) — 같은 클래스를 두 메뉴가 쓴다 (로그인 회사의 거래처)
 * AS-IS: myApp/client/vi/sys/Sys15_Tab_Corp.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L74-114): 가운데 = 툴바(높이 50) + 거래처 그리드, 아래 = 편집 칸 `Sys15_Edit_Corp`(높이 400, 분할 없음).
 * 관리자 회사(0)만 툴바 끝에 고객사 칸 + [기초데이터생성]
 * UX보강(10) B12-2: 툴바 = SearchBar(UX-01·02·04, 조건 3개: 거래처구분·거래처명·사용거래처만 보기 → 초기화는 '%'·''·체크)
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Modal, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Corp } from '@/types/sys';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { useLoginUser } from '@/hooks/useLoginUser';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { Sys15_Edit_Corp } from './Sys15_Edit_Corp';

const gb = gbFor<Corp>();

/** AS-IS buildGrid() L215-230 (색인 Grid Spec) */
const buildGrid = () => [
  gb.textCenter('corpTypeName', 120, '거래처구분'),  // L220
  gb.text('corpName', 250, '거래처명'),  // L221
  gb.textCenter('bizNo', 120, '사업자번호'),  // L222
  gb.textCenter('corpCode', 120, '거래처코드'),  // L223
  gb.longCenter('seq', 100, '조회순서'),  // L224
  gb.boolean('useYn', 80, '사용'),  // L225
  gb.text('note', 300, '비고'),  // L226
  gb.textCenter('corpAccountCnt', 100, '계좌정보'),  // L227
];

export const Sys15_Tab_Corp: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<Corp>>(null);
  const tempSeq = useRef(0);
  // settings() L116-: corpTypeComboBox ComboBoxField("CorpType","%","전체"), searchText, useCheckBox 초기값 true
  const sp = useSearchParams(() => ({ corpType: '%', searchText: '', useYn: true }));
  const { corpType, searchText, useYn } = sp.values;
  const [rows, setRows] = useState<Corp[]>([]);
  const [selected, setSelected] = useState<Corp>();
  // 관리자 회사만: 기초데이터생성 대상 고객사 (AS-IS companyField·companyId)
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [lookupOpen, setLookupOpen] = useState(false);
  const columnDefs = useMemo(buildGrid, []);

  // 행이 그려질 때까지 기다렸다가(rowData 갱신은 비동기) 그 행을 고른다 — GridInsertRow·select(0)
  const selectRow = (id: number, tries = 20) => setTimeout(() => {
    const node = gridRef.current?.api?.getRowNode(String(id));
    if (!node) { if (tries > 0) selectRow(id, tries - 1); return; }
    node.setSelected(true, true);
    if (node.rowIndex != null) gridRef.current?.api.ensureIndexVisible(node.rowIndex);
  }, 50);

  // [E1] searchText.KeyPress [Enter] (L123) / [E2] corpTypeComboBox.Collapse (L141) / [E4] retrieveButton[조회].Select (L167) → retrieve() L232-258
  const retrieve = useCallback(async () => {
    try {
      const list = await sysApi.searchCorps(corpType, searchText, useYn);
      setRows(list);
      // 끝나면 첫 행 선택 (grid.getStore().get(0) != null → select(0))
      if (list.length > 0) selectRow(list[0].corpId); else setSelected(undefined);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [corpType, searchText, useYn]);

  // [E5] insertButton[등록].Select (L173) → insertRow() L283-291: 구분 '0'(일반)·사용 true인 빈 행을 선택 행 아래에 (GridInsertRow)
  const insertRow = () => {
    const id = --tempSeq.current;
    const row: Corp = {
      corpId: id, companyId: user.companyId, corpType: '0', corpTypeName: '일반', corpName: null, bizNo: null, corpCode: null,
      seq: null, useYn: 'true', note: null, tel: null, addr: null, issCorpCode: null, corpAccountCnt: null,
    };
    setRows(prev => {
      const at = selected ? prev.findIndex(r => r.corpId === selected.corpId) : -1;
      return at < 0 ? [...prev, row] : [...prev.slice(0, at + 1), row, ...prev.slice(at + 1)];
    });
    selectRow(id);
  };

  // [E6] deleteButton[삭제].Select (L179) → deleteRow() L294-329: 미선택이면 알림, 확인 → [E9] msgBox.DialogHide [YES] (L302) → sys.Sys15_Corp.delete
  const deleteRow = () => {
    if (!selected) {
      message.warning('삭제할 거래처정보를 선택하여 주십시오.');
      return;
    }
    const target = selected;
    Modal.confirm({
      title: '확인',
      content: '선택한 거래처정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        try {
          // GridDeleteData: 저장된 행만 서버로, 임시 행은 목록에서만 뺀다 (완료 메시지 없음)
          if (target.corpId > 0) await sysApi.deleteCorps([target.corpId]);
          setRows(prev => prev.filter(r => r.corpId !== target.corpId));
          setSelected(undefined);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E7] dataButton[기초데이터생성].Select (L185) → initData() L260-275: sys.Sys15_Corp.insertInitData(companyId)
  const initData = async () => {
    try {
      await sysApi.insertCorpInitData(companyId);
      message.success('생성이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  // Sys15_Edit_Corp.updateRow() 결과: 목록의 그 행을 저장된 행으로 바꾸고 다시 고른다 (GridUpdate)
  const onSaved = (saved: Corp, oldId: number) => {
    setRows(prev => prev.map(r => (r.corpId === oldId ? saved : r)));
    setSelected(saved);
    selectRow(saved.corpId);
  };

  // [E0] 화면 열림 (생성자 L74-114) → settings() — 원본은 열 때 조회하지 않는다 (조회 버튼을 눌러야 목록이 나온다)

  return (
    <>
      <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
        <Splitter.Panel min={150}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0', boxSizing: 'border-box' }}>
            <SearchBar onSearch={retrieve} onReset={sp.reset} extra={<>
              {/* [E5] insertButton[등록] */}
              <Button type="register" onClick={insertRow}>등록</Button>
              {/* [E6] deleteButton[삭제] */}
              <Button type="delete" onClick={deleteRow}>삭제</Button>
              {user.companyId === 0 && <>
                {/* [E3] companyField.TriggerClick [result != null] (L150) → Sys01_Lookup_Company: 고른 회사명·ID */}
                <LookupInput width={150} value={companyName} onOpen={() => setLookupOpen(true)} onClear={() => { setCompanyName(''); setCompanyId(null); }} />
                <Button type="register" onClick={initData}>기초데이터생성</Button>
              </>}
            </>}>
              <SearchBar.Field label="거래처구분">
                {/* [E2] corpTypeComboBox[CorpType].Collapse (L141) → retrieve(): 고르면 바로 조회 */}
                <SystemCodeComboBox kindCd="CorpType" altCode={['%', '전체']} style={{ width: 120 }} value={corpType}
                  onChange={code => sp.set('corpType', code ?? '%')} />
              </SearchBar.Field>
              <SearchBar.Field label="거래처명">
                {/* [E1] searchText.KeyPress [Enter] (L123) → retrieve() */}
                <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
              </SearchBar.Field>
              <Checkbox checked={useYn} onChange={e => sp.set('useYn', e.target.checked)}>사용거래처만 보기</Checkbox>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E8] grid.SelectionChanged [선택>0] (L191) → retrieveEditPage() L201-213: 선택한 행을 편집 칸에 */}
              <SingleGrid<Corp>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.corpId)}
                onSelect={r => { if (r) setSelected(r); }}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={400} min={200} resizable={false}>
          <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box' }}>
            <Sys15_Edit_Corp corp={selected} onSaved={onSaved} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Sys01_Lookup_Company open={lookupOpen}
        onResult={c => { if (c) { setCompanyName(c.companyNm); setCompanyId(c.companyId); } setLookupOpen(false); }}
        onClose={() => setLookupOpen(false)} />
    </>
  );
};
