/**
 * [1114] 기초자료 > 40. 관리회계 > 계정코드 관리 (E27) — 같은 화면: 관리회계 > 21. 회계장부 > 계정과목 관리 [1250]
 * AS-IS: myApp/client/vi/act/Act01_Tab_AccountCode.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L67-106: 가운데 = 툴바(계정코드/명 200 · 계정속성 100 · 사용여부 100 · [조회][생성][삭제][엑셀다운로드] + 관리자 회사면 [계정과목복사], 아니면 [출력정보 및 사용여부 설정]) + 계정코드 그리드(행번호, 체크박스 단일 선택)
 * UX보강(10): 툴바 = SearchBar(UX-01·02·04, 조건 3개: 검색·계정속성·사용여부 → 초기화는 ''·전체·전체)
 */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { message, Modal, Select } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { actApi } from '@/api/act';
import { errorMessage } from '@/api/client';
import { AccountCodeAdmin } from '@/types/act';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar, useSearchParams } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { Act01_Edit_AccountCode, AccountCodeEdit } from './Act01_Edit_AccountCode';
import { Act01_Lookup_CopyAdmin } from './Act01_Lookup_CopyAdmin';
import { Act01_Lookup_PrintYn } from './Act01_Lookup_PrintYn';
import { useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<AccountCodeAdmin>();
const ALL = '%';
const USE_OPTIONS = [{ value: ALL, label: '전체' }, { value: 'true', label: '사용' }, { value: 'false', label: '미사용' }];  // useYnName 전체·사용·미사용

/** setChecked(SINGLE) — 체크박스 단일 선택. rowSelection은 상수로 넘긴다(11 §1 함정) */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

const today = () => new Date().toISOString().slice(0, 10);

export const Act01_Tab_AccountCode: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<AccountCodeAdmin>>(null);
  // settings() L108-169: 검색어 빈칸 "계정코드/계정과목/계정영문명" · 계정속성 "전체" · 사용여부 "전체"
  const sp = useSearchParams(() => ({ searchText: '', attributeCode: ALL, useYn: ALL }));
  const [rows, setRows] = useState<AccountCodeAdmin[]>([]);
  const [editTarget, setEditTarget] = useState<AccountCodeEdit | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const selectFirst = useRef(false);

  // retrieve() L210-255: 서비스 act.Act01_AccountCode.selectByCompanyId(로그인 회사, "%검색어%"(없으면 "%"), useYn(전체 %·사용 true·미사용 false), attributeCode(없으면 "%")) → 첫 행 선택
  const retrieve = useCallback(async (v = sp.current.current) => {
    try {
      const list = await actApi.searchAccountCodeList(v.searchText, v.useYn, v.attributeCode);
      selectFirst.current = true;
      setRows(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [sp.current]);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E0] 화면 열림 (생성자 L67-106) → settings() — 열 때 자동 조회는 없다 (원본 생성자는 retrieve()를 부르지 않는다)

  // [E3] insertButton[생성].Select (L139) → insertRow() L263-271: 회사만 정해진 새 계정으로 Act01_Edit_AccountCode.insert
  const insertRow = () => setEditTarget({ companyId: user.companyId });

  // [E4] deleteButton[삭제].Select (L145) → deleteRow() L274-299: 고른 행이 없으면 "계정코드를 선택해주세요"(원본은 이어서 확인창도 띄운다 — 아무 것도 지우지 않으므로 여기서는 멈춘다) → [E8] msgBox.DialogHide [YES] (L281)
  const deleteRow = () => {
    const selected = gridRef.current?.api?.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('계정코드를 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '해당 계정코드 정보를 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await actApi.deleteAccountCodes(selected.map(r => r.accountCodeId));
          const removed = new Set(selected.map(r => r.accountCodeId));
          setRows(prev => prev.filter(r => !removed.has(r.accountCodeId)));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E6] rdButton[엑셀다운로드].Select (L157) → createRdExcel() L306-388: 조회 조건 그대로 "계정과목(yyyy-MM-dd).xlsx" 받기
  const createRdExcel = async () => {
    const v = sp.current.current;
    try {
      await actApi.downloadAccountCodesExcel(v.searchText, v.useYn, v.attributeCode, `계정과목(${today()}).xlsx`);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // buildGrid() L171-207
  const columnDefs = useMemo(() => [
    gb.textCenter('accountCode', 100, '계정코드'),  // L189
    gb.textArea('accountName', 300, '계정과목'),  // L190
    gb.textArea('parentName', 300, '상위계정과목'),  // L191
    gb.textCenter('attributeName', 60, '속성'),  // L192
    gb.textCenter('drcrName', 60, '차대'),  // L193
    gb.boolean('slipYn', 50, '전표'),  // L194
    gb.boolean('printYn', 50, '출력'),  // L195
    gb.boolean('useYn', 50, '사용'),  // L196
    gb.boolean('fssYn', 50, '금감원'),  // L197
    gb.boolean('fssSlipYn', 55, '전표(금)'),  // L198
    iconCell<AccountCodeAdmin>('edit', 'actionCell', 50, '수정', row => setEditTarget(row)),  // L199 addCell(ImageCell("Edit")) → Act01_Edit_AccountCode.edit(selectModel)
    gb.textCenter('printSeq', 100, '정렬코드'),  // L200
    gb.textArea('accountName2', 350, '계정과목(보고서용)'),  // L201
    gb.textArea('fssAccountName', 350, '계정과목(금감원용)'),  // L202
    gb.textArea('accountEName', 350, '계정영문명'),  // L203
    gb.textArea('content', 350, '내용'),  // L204
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E2] retrieveButton[조회].Select (L133) → retrieve(), [E1] searchText.KeyPress [Enter] (L111) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        onReset={sp.reset}
        extra={
          <>
            <Button type="generate" onClick={insertRow}>생성</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
            <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>
            {/* 생성자 L90-94: 관리자 회사(0)면 [계정과목복사], 아니면 [출력정보 및 사용여부 설정] 중 하나만 둔다 */}
            {user.companyId === 0 ? (
              /* [E5] copyAdminButton[계정과목복사].Select (L151) → adminLookup() L301-304 */
              <Button type="change" onClick={() => setCopyOpen(true)}>계정과목복사</Button>
            ) : (
              /* [E7] printSetButton[출력정보 및 사용여부 설정].Select (L163) → lookupPrintSet() L390-403 */
              <Button type="save" onClick={() => setPrintOpen(true)}>출력정보 및 사용여부 설정</Button>
            )}
          </>
        }
      >
        <SearchBar.Field label="계정코드/명">
          <SearchBar.Input style={{ width: 200 }} placeholder="계정코드/계정과목/계정영문명" value={sp.values.searchText} onChange={e => sp.set('searchText', e.target.value)} />
        </SearchBar.Field>
        <SearchBar.Field label="계정속성">
          <SystemCodeComboBox kindCd="AccountAttributeCode" altCode={['%', '전체']} style={{ width: 100 }}
            value={sp.values.attributeCode} onChange={code => sp.set('attributeCode', code ?? ALL)} />
        </SearchBar.Field>
        <SearchBar.Field label="사용여부">
          <Select style={{ width: 100 }} value={sp.values.useYn} onChange={v => sp.set('useYn', v)} options={USE_OPTIONS} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AccountCodeAdmin>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.accountCodeId)}
          rowSelection={SINGLE_CHECK}
          onRowDataUpdated={() => {   // retrieve() 끝: 첫 행을 고른다 (grid.getSelectionModel().select(0, false))
            if (!selectFirst.current) return;
            selectFirst.current = false;
            gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true);
          }}
        />
      </div>
      {/* 저장하면 목록을 다시 읽는다 (callBack.execute() → retrieve()) */}
      <Act01_Edit_AccountCode model={editTarget} onClose={() => setEditTarget(null)} onDone={() => retrieve()} />
      <Act01_Lookup_CopyAdmin open={copyOpen} onClose={() => setCopyOpen(false)} />
      <Act01_Lookup_PrintYn open={printOpen} param={sp.values} onClose={() => setPrintOpen(false)} />
    </div>
  );
};
