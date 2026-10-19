/**
 * [1325] 관리자 > 01. 고객관리 > 사용자정보 조회  (C03) — admin 회사 메뉴(sys admin만, 전 고객사 사원)
 * AS-IS: myApp/client/vi/emp/Emp01_Tab_UserInfo.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * UX보강(10) B12-3: 툴바 = SearchBar(UX-01·02·04, 조건 4개: 고객사·검색·사용고객만·퇴사자 제외 → 초기화는 '전체'·''·체크·체크, 자동 조회 없음)
 * 레이아웃(생성자 L62-107): 툴바(높이 50) = 고객사(트리거)·검색·사용고객만 보기·퇴사자 제외·조회·안내문 / 그리드 + 페이징 툴바(100행)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { AgGridReact, CustomCellRendererProps } from 'ag-grid-react';
import type { CellDoubleClickedEvent, ColDef } from 'ag-grid-community';
import { empUserInfoApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { NoteAdmin, UserInfo } from '@/types/emp';
import { Company } from '@/types/sys';
import { useLoginUser } from '@/hooks/useLoginUser';
import { SearchBar, useSearchParams } from '@/components/search';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { Emp02_Edit_Note } from './Emp02_Edit_Note';

const gb = gbFor<UserInfo>();

/** AS-IS gridToolBar.setToolBar(100) L96 */
const LIMIT = 100;

/** AS-IS ImageCell("Edit") — 행 안 편집 아이콘. 클릭이 행 더블클릭으로 번지지 않게 막는다 */
const EditImageCell: React.FC<CustomCellRendererProps<UserInfo> & { onEdit: (row: UserInfo) => void }> = ({ data, onEdit }) =>
  data ? (
    <EditOutlined
      style={{ cursor: 'pointer', color: '#1677ff' }}
      onClick={e => { e.stopPropagation(); onEdit(data); }}
      onDoubleClick={e => e.stopPropagation()}
    />
  ) : null;

/**
 * AS-IS buildGrid() L177-222 (setChecked MULTI).
 * 수정(제안 ③ 사용자 승인 2026-10-12): 원본 체크박스 열은 쓰는 곳이 없어(체크 목록을 읽는 코드·일괄 버튼 없음) SingleGrid로 바꿨다
 */
const buildGrid = (onEdit: (row: UserInfo) => void): ColDef<UserInfo>[] => [
  gb.text('companyName', 220, '고객사'),  // L208
  gb.textCenter('korName', 80, '사원명'),  // L209
  gb.text('empNo', 120, '사번'),  // L210
  gb.textCenter('posName', 80, '직위'),  // L211
  gb.text('orgName', 220, '부서명'),  // L212
  gb.textCenter('officeTelNo', 120, '사무실'),  // L213
  gb.textCenter('mobileTelNo', 120, '휴대폰'),  // L214
  gb.text('emailAddress', 200, '이메일'),  // L215
  gb.date('hireDate', 100, '입사일'),  // L216
  gb.date('retireDate', 100, '퇴사일'),  // L217
  gb.textArea('noteAdmin', 220, '비고'),  // L218
  // L219 addCell(actionCell, 40, " ") — ImageCell("Edit")
  { colId: 'actionCell', headerName: ' ', width: 40, resizable: false, cellStyle: { textAlign: 'center' },
    cellRenderer: EditImageCell, cellRendererParams: { onEdit } },
];

/**
 * getCellValue() L273-286: AS-IS colIndex 2~9(0 행번호, 1 체크) → 복사할 값. 사원명·직위·부서명은 '부서 이름 직위'.
 * 수정(제안 ② 사용자 승인 2026-10-12): 원본은 Java 문자열 연결이라 빈 값이 "null" 글자로 복사됐다 → 빈 값은 빈 문자열, '부서 이름 직위'는 있는 것만 공백으로 잇는다
 */
const getCellValue = (model: UserInfo, field?: string): string | undefined => {
  const s = (v?: string | null) => v ?? '';
  const person = () => [model.orgName, model.korName, model.posName].filter(Boolean).join(' ');
  switch (field) {
    case 'companyName': return s(model.companyName);  // 고객사
    case 'korName': return person();
    case 'empNo': return s(model.empNo);  // 사번
    case 'posName': return person();
    case 'orgName': return person();
    case 'officeTelNo': return s(model.officeTelNo);  // 사무실
    case 'mobileTelNo': return s(model.mobileTelNo);  // 휴대폰
    case 'emailAddress': return s(model.emailAddress);  // 이메일
    default: return undefined;  // 입사일·퇴사일·비고·Edit 칸은 복사 안 함 (1 < colIndex < 10)
  }
};

/** AS-IS copyToClipboard (Emp01_Tab_UserInfo 밖, 브라우저 복사) — http 배포에서도 되도록 execCommand로 한 번 더 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
};

/** showCopyMessage() L298-316: '복사 완료' + 내용, 화면 위쪽 가운데, 모달 아님, 0.8초 뒤 닫힘 */
const showCopyMessage = (copyText: string) => {
  message.open({
    type: 'success',
    duration: 0.8,
    content: <span><b>복사 완료</b><br />{copyText}</span>,
  });
};

interface SearchParams {
  companyId: number | null;
  searchText: string;
  useYn: string;
  quitYn: string;
}

export const Emp01_Tab_UserInfo: React.FC = () => {
  const loginUser = useLoginUser();
  const gridRef = useRef<AgGridReact<UserInfo>>(null);
  // settings() L109-120: 고객사 '전체'(편집 불가), 사용고객만 보기·퇴사자 제외 체크
  const sp = useSearchParams(() => ({ companyField: '전체', companyId: null as number | null, searchText: '', useYn: true, quitYn: true }));
  const { companyField, companyId, searchText, useYn, quitYn } = sp.values;
  const [lookupOpen, setLookupOpen] = useState(false);
  const [rows, setRows] = useState<UserInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [othersModel, setOthersModel] = useState<NoteAdmin>();
  /** gridToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<SearchParams | undefined>(undefined);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await empUserInfoApi.searchUserInfos({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // retrieve() L224-270: 조건을 만들어 1페이지부터 다시 읽는다
  const retrieve = () => {
    let id: number | null;
    if (companyField === '전체') {
      id = null;
    } else if (companyField === '한국펀드서비스(주)' && loginUser.loginId === 'kfiamuser') {
      id = 1;
    } else if (companyField === '한국펀드서비스(주)' && loginUser.loginId === 'idmsuser') {
      id = 28000;
    } else {
      id = companyId;
    }
    paramRef.current = {
      companyId: id,
      searchText,  // 원본은 "%" + 검색어 + "%" — 서버가 만든다(05 §6)
      useYn: useYn ? 'true' : 'false',
      quitYn: quitYn ? 'true' : 'false',
    };
    getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L62-107) → settings(), retrieve(): 처음 한 번 조회
  useEffect(retrieve, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // getPaging 콜백(L262-267): 첫 행이 있으면 select(0)
  const onRowDataUpdated = () => {
    gridRef.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
  };

  // [E2] companyField[전체].TriggerClick (L131) → Sys01_Lookup_Company.open(): 결과가 있으면 회사명·ID, 없으면(선택안함) '전체'
  const onLookupResult = (companyModel: Company | null) => {
    setLookupOpen(false);
    if (companyModel != null) {
      sp.setValues(v => ({ ...v, companyField: companyModel.companyNm, companyId: companyModel.companyId }));
    } else {
      sp.setValues(v => ({ ...v, companyField: '전체', companyId: null }));
    }
  };

  // actionCell ImageCell("Edit") L178-203: 서비스 emp.Emp02_Others.selectById(personId) → Emp02_Edit_Note.edit(결과, callback)
  // 원본은 선택 행(getSelectedItem)을 쓴다 — GXT는 칸 클릭으로 그 행이 선택되므로 누른 행을 선택하고 쓴다
  const editRow = useRef<UserInfo | undefined>(undefined);
  const onEdit = async (selectModel: UserInfo) => {
    gridRef.current?.api.getRowNode(String(selectModel.personId))?.setSelected(true, true);
    editRow.current = selectModel;
    try {
      setOthersModel(await empUserInfoApi.getNoteAdmin(selectModel.personId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };
  const columnDefs = useMemo(() => buildGrid(onEdit), []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Emp02_Edit_Note callback: 선택 행의 noteAdmin을 바꾸고 store.update
  const onNoteSaved = (saved: NoteAdmin) => {
    const target = editRow.current;
    if (!target) return;
    setRows(prev => prev.map(r => (r.personId === target.personId ? { ...r, noteAdmin: saved.noteAdmin } : r)));
  };

  // [E4] grid.CellDoubleClick (L159) → getCellValue(), copyToClipboard(), showCopyMessage() — 1 < colIndex < 10 칸만
  const onCellDoubleClicked = (e: CellDoubleClickedEvent<UserInfo>) => {
    if (!e.data) return;
    const cellValue = getCellValue(e.data, e.colDef.field);
    if (cellValue === undefined) return;
    copyToClipboard(cellValue);
    showCopyMessage(cellValue);
  };

  return (
    <div style={{ height: '100%', padding: 20, background: '#fff', boxSizing: 'border-box' }}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
        <div style={{ height: 50, flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px' }}>
          {/* [E3] retrieveButton[조회].Select (L152) → retrieve(). 초기화는 UX-02 */}
          <SearchBar onSearch={retrieve} onReset={sp.reset} extra={
            /* setHtmlCheckBoxStyle: 굵게, #262d3f, 12px */
            <b style={{ marginLeft: 8, color: '#262d3f', fontSize: 12 }}>※ 복사하고싶은 정보를 더블클릭하시면 복사가 됩니다.</b>
          }>
            <SearchBar.Field label="고객사">
              <LookupInput value={companyField} onOpen={() => setLookupOpen(true)} onClear={() => onLookupResult(null)} />
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              {/* [E1] searchText.KeyPress [Enter] (L122) → retrieve() */}
              <SearchBar.Input style={{ width: 270 }} placeholder="고객사명/부서명/사원명/사무실/휴대폰/비고" value={searchText}
                onChange={e => sp.set('searchText', e.target.value)} />
            </SearchBar.Field>
            <Checkbox checked={useYn} onChange={e => sp.set('useYn', e.target.checked)}>사용고객만 보기</Checkbox>
            <Checkbox checked={quitYn} onChange={e => sp.set('quitYn', e.target.checked)}>퇴사자 제외</Checkbox>
          </SearchBar>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <SingleGrid<UserInfo>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            loading={loading}
            getRowId={p => String(p.data.personId)}
            onRowDataUpdated={onRowDataUpdated}
            onCellDoubleClicked={onCellDoubleClicked}
          />
          <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
        </div>
      </div>
      <Sys01_Lookup_Company open={lookupOpen} onResult={onLookupResult} onClose={() => setLookupOpen(false)} />
      <Emp02_Edit_Note othersModel={othersModel} onSaved={onNoteSaved} onClose={() => setOthersModel(undefined)} />
    </div>
  );
};
