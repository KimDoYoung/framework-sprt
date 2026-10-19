/**
 * [1482] 기초자료 > 20. 문서(전자결재) > 문서양식등록 (E18) — 메뉴 #1007(문서작성 > 03. 파일 및 양식관리 > 문서양식등록)도 같은 클래스
 * AS-IS: myApp/client/vi/dcr/Dcr05_Tab_DocType.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 init() L84-204: 툴바(고객사[admin 회사만] · 구분 150 "전체" · 검색 250 "양식제목/비고" · 조회 · 등록 · 삭제 · 구분추가 · 내보내기[관리자만]) + 체크박스 다중 그리드
 *   (구분 200 · 양식 제목 450 · 상세보기 80[아이콘] · 비고 1000). 화면을 열 때 조회하지 않는다(생성자는 init만) — 조회 버튼이나 구분 콤보를 바꿔야 목록이 뜬다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없는 동작이라 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { DcrDocType } from '@/types/dcr';
import { Company } from '@/types/sys';
import { Button } from '@/components/button';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { Sys09_Lookup_Code } from '@/components/lookup/Sys09_Lookup_Code';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Dcr05_Edit_DocType } from './Dcr05_Edit_DocType';
import { Dcr05_Edit_Update } from './Dcr05_Edit_Update';

const gb = gbFor<DcrDocType>();

/** init() L142: companyField 기본 글자 */
const ADMIN_TEXT = 'Admin (관리자)';

export const Dcr05_Tab_DocType: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<DcrDocType>>(null);
  const [rows, setRows] = useState<DcrDocType[]>([]);
  const [loading, setLoading] = useState(false);
  const [formClassCode, setFormClassCode] = useState('%');
  const [titleName, setTitleName] = useState('');
  /** companyField(L120-140): admin 회사(0) 사용자만 보이는 고객사 칸. 선택안함 = admin 회사(0) */
  const [companyId, setCompanyId] = useState<number>(user.companyId);
  const [companyName, setCompanyName] = useState(ADMIN_TEXT);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [pushOpen, setPushOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeKey, setCodeKey] = useState(0);
  const [editRow, setEditRow] = useState<DcrDocType | null>(null);
  const isAdminCompany = user.companyId === 0;
  /** LoginUser.getIsManager() (L131) */
  const isManager = user.roles.includes('ROLE_ADMIN');

  // [E0] 화면 열림 (생성자 L80-82) → init(): 툴바·그리드만 만든다 — 열 때 조회하지 않는다
  // retrieve() L242-263: 로그인 회사가 0이 아니면 로그인 회사, 0이면 고객사 칸의 회사 → dcr.Dcr05_DocType.selectByName(searchText, companyId, formClassCode)
  const retrieve = async (text = titleName, formClass = formClassCode) => {
    setLoading(true);  // grid.mask("Loading...")
    try {
      setRows(await dcrApi.searchDocTypes(text, formClass, isAdminCompany ? companyId : undefined));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  };

  // buildGrid() L206-231
  const columnDefs = useMemo(() => [
    gb.text('docFormClassName', 200, '구분'),  // L225
    gb.text('title', 450, '양식 제목'),  // L226
    // L227 actionCell(Edit) → Dcr05_Edit_Update.retrieveApproval(docTypeModel, 닫히면 retrieve())
    iconCell<DcrDocType>('edit', 'actionCell', 80, '상세보기', row => setEditRow(row)),
    gb.text('note', 1000, '비고'),  // L228
  ], []);

  const selected = () => gridRef.current?.api?.getSelectedRows() ?? [];

  // [E3] companyField.TriggerClick [result != null] (L127) → Sys01_Lookup_Company.open: 고르면 회사 ID·이름, 선택안함이면 admin 회사
  const onCompanyResult = (company: Company | null) => {
    setCompanyOpen(false);
    if (company == null) {
      setCompanyName(ADMIN_TEXT);
      setCompanyId(0);
    } else if (company.companyId == null) {
      message.warning('에러');
    } else {
      setCompanyName(company.companyNm);
      setCompanyId(company.companyId);
    }
  };

  // [E6] deleteButton[삭제].Select (L166) → delete() L265-290: HtmlMessageBox "삭제" "선택한 양식을 삭제하시겠습니까?" → [E9] YES (L268) → dcr.Dcr05_DocType.delete
  //   (선택 없이 삭제하면 안내만 — 05 §8 사용자 결정 2026-10-12)
  const remove = () => {
    const checked = selected();
    if (checked.length === 0) {
      message.warning('삭제할 행을 선택하세요.');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: '선택한 양식을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await dcrApi.deleteDocTypes(checked.map(r => r.docTypeId), isAdminCompany ? companyId : undefined);
          setRows(prev => prev.filter(r => !checked.some(c => c.docTypeId === r.docTypeId)));
          message.success('삭제가 완료되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E8] pushDataButton[내보내기].Select (L186) → pushData() L292-330: 선택이 없으면 "선택된 내역이 없습니다." → Sys01_Lookup_Company → dcr.Dcr05_DocType.pushData(companyId)
  const pushData = () => {
    if (selected().length < 1) {
      message.warning('선택된 내역이 없습니다.');
      return;
    }
    setPushOpen(true);
  };
  const onPushResult = async (company: Company | null) => {
    setPushOpen(false);
    if (company == null) return;
    try {
      await dcrApi.pushDocTypes(company.companyId, isAdminCompany ? companyId : undefined, selected().map(r => r.docTypeId));
      message.success('작업이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '오류'));
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E4] retrieveButton[조회].Select (L152), [E2] titleName.KeyPress [Enter] (L115) → retrieve() */}
      <SearchBar onSearch={() => retrieve()} loading={loading} extra={
        <>
          {/* [E5] insertButton[등록].Select (L159) → insert() L233-240: Dcr05_Edit_DocType 열기, 저장되면 retrieve() */}
          <Button type="register" onClick={() => setInsertOpen(true)}>등록</Button>
          <Button type="delete" onClick={remove}>삭제</Button>
          {/* [E7] docClassButton[구분추가].Select (L173) → Sys09_Lookup_Code.edit("DocFormClassCode") → 닫히면 구분 콤보 다시 조회 */}
          <Button type="view" onClick={() => setCodeOpen(true)}>구분추가</Button>
          {isManager && <Button type="change" onClick={pushData}>내보내기</Button>}
        </>
      }>
        {isAdminCompany && (
          <SearchBar.Field label="고객사">
            <LookupInput value={companyName} empty={[ADMIN_TEXT]} onOpen={() => setCompanyOpen(true)} onClear={() => onCompanyResult(null)} />
          </SearchBar.Field>
        )}
        <SearchBar.Field label="구분">
          {/* [E1] docFormClassComboBox[DocFormClassCode].Collapse (L106) → retrieve() */}
          <SystemCodeComboBox key={codeKey} kindCd="DocFormClassCode" altCode={['%', '전체']} style={{ width: 150 }} value={formClassCode}
            onChange={code => { const next = code ?? '%'; setFormClassCode(next); void retrieve(titleName, next); }} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 250 }} placeholder="양식제목/비고" value={titleName} onChange={e => setTitleName(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<DcrDocType> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} loading={loading} getRowId={p => String(p.data.docTypeId)} />
      </div>

      <Sys01_Lookup_Company open={companyOpen} onResult={onCompanyResult} onClose={() => setCompanyOpen(false)} />
      <Sys01_Lookup_Company open={pushOpen} onResult={onPushResult} onClose={() => setPushOpen(false)} />
      <Dcr05_Edit_DocType open={insertOpen} onSaved={() => { void retrieve(); }} onClose={() => setInsertOpen(false)} />
      <Dcr05_Edit_Update model={editRow} companyId={isAdminCompany ? companyId : undefined} onSaved={() => { void retrieve(); }} onClose={() => setEditRow(null)} />
      <Sys09_Lookup_Code open={codeOpen} codeKind="DocFormClassCode" onResult={() => setCodeKey(k => k + 1)} onClose={() => setCodeOpen(false)} />
    </div>
  );
};
