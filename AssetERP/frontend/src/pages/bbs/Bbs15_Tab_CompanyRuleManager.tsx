/**
 * [1483] 기초자료 > 10. 책무 > 회사규정관리 (E10)
 * 같은 클래스: 준법감시 > 02. 회사규정 > 회사규정(관리자) #1477, 커뮤니티 > 01. 회사규정 > 회사규정(관리자) #1345
 * AS-IS: myApp/client/vi/bbs/Bbs15_Tab_CompanyRuleManager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L94-136: 위(50) = 툴바([고객사 200 — 관리자 회사만] · 구분 150 · 검색 230 "규정명/규정코드" · [조회][등록][등록(복사)] · [삭제] · [엑셀다운로드] · [엑셀업로드][내보내기] — 회사관리자만), 아래 = 회사규정 그리드(행번호, 체크박스 다중)
 * UX보강(10): 툴바 = SearchBar(UX-01)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AgGridReact } from 'ag-grid-react';
import { bbsApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { BbsCompanyRule } from '@/types/bbs';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { SearchBar } from '@/components/search';
import { isSysAdmin, useLoginUser } from '@/hooks/useLoginUser';
import { Bbs15_Edit_CompanyRuleManager, BbsCompanyRuleEdit } from './Bbs15_Edit_CompanyRuleManager';

const gb = gbFor<BbsCompanyRule>();
const ADMIN_COMPANY_NAME = 'Admin (관리자)';

export const Bbs15_Tab_CompanyRuleManager: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<BbsCompanyRule>>(null);
  const excelForm = useRef<FileUpdownFormHandle>(null);
  const isAdminCompany = isSysAdmin(user);                       // LoginUser.getCompanyId() == 0 → 고객사 칸
  const isManager = user.roles.includes('ROLE_ADMIN');           // LoginUser.getIsManager() → 엑셀업로드·내보내기
  const [companyId, setCompanyId] = useState(0);                  // private Long companyId = 0l
  const [companyName, setCompanyName] = useState(ADMIN_COMPANY_NAME);
  const [ruleType, setRuleType] = useState('%');                  // ComboBoxField("CompanyRuleType", "%", "전체")
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BbsCompanyRule[]>([]);
  const [editTarget, setEditTarget] = useState<BbsCompanyRuleEdit | null>(null);
  const [lookupCompany, setLookupCompany] = useState(false);
  const [pushOpen, setPushOpen] = useState(false);

  // retrieve() L288-310: 서비스 bbs.Bbs15_CompanyRule.selectBySearchTextManager(companyId(회사관리자는 로그인 회사), ruleType, "%검색어%")
  const retrieve = useCallback(async (over?: { ruleType?: string }) => {
    try {
      setRows(await bbsApi.searchCompanyRules(over?.ruleType ?? ruleType, searchText, isAdminCompany ? companyId : undefined));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [ruleType, searchText, isAdminCompany, companyId]);

  // [E0] 화면 열림 (생성자 L94-136) → settings(), retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void retrieve(); }, []);

  // [E2] companyField.TriggerClick [result != null] (L153) → Sys01_Lookup_Company.open(): 고른 고객사로 바꾸고, 선택안함이면 Admin (관리자)로 되돌린다 (조회는 [조회]를 눌러야 한다)
  const onCompanyResult = (company: { companyId: number; companyNm: string } | null) => {
    setLookupCompany(false);
    if (company) {
      setCompanyId(company.companyId);
      setCompanyName(company.companyNm);
    } else {
      setCompanyId(0);
      setCompanyName(ADMIN_COMPANY_NAME);
    }
  };

  const checked = () => gridRef.current?.api?.getSelectedRows() ?? [];

  // [E5] insertButton[등록].Select (L193) → insert() L339-347: Bbs15_Edit_CompanyRuleManager.newCompanyRule() L192-216 — 로그인 회사·공개·새 ID(DBUtil.setSeq)
  const insert = async () => {
    try {
      const companyRuleId = await bbsApi.getCompanyRuleNextId();
      setEditTarget({ isNew: true, companyRuleId, companyId: user.companyId, ruleType: null, title: null, content: '', note: '', seq: null, publicYn: true, creName: user.name });
    } catch (err) {
      message.error(errorMessage(err, '새 ID를 받지 못했습니다'));
    }
  };

  // [E7] copyButton[등록(복사)].Select (L205) → copyInsert() L349-366 → copyCompanyRule() L218-258: 고른 행을 새 ID로 복사 (제개정일 비움, 공개 해제)
  const copyInsert = async () => {
    const list = checked();
    if (list.length === 0) return void message.warning('복사할 대상을 선택해주세요.');
    if (list.length > 1) {
      Modal.info({ title: '확인', content: <>한개의 데이터만 복사가 가능합니다. <br />한개의 데이터만 선택바랍니다.</>, width: 350 });
      return;
    }
    const src = list[0];
    try {
      const companyRuleId = await bbsApi.getCompanyRuleNextId();
      setEditTarget({
        isNew: true, companyRuleId, companyId: src.companyId, ruleType: src.ruleType, ruleTypeName: src.ruleTypeName, title: src.title, content: src.content,
        note: src.note, seq: src.seq, revisionDate: null, revisionNo: src.revisionNo, publicYn: false, creName: user.name, companyRuleCode: src.companyRuleCode,
      });
    } catch (err) {
      message.error(errorMessage(err, '새 ID를 받지 못했습니다'));
    }
  };

  // [E6] deleteButton[삭제].Select (L199) → deleteRow() L312-337: "n건의 정보를 삭제하시겠습니까?"(제목 "삭제") → [E12] messageBox.DialogHide [YES] (L315) → bbs.Bbs15_CompanyRule.delete: 실패 메시지는 그대로 보이고, 성공하면 그리드에서 뺀다
  const deleteRow = () => {
    const list = checked();
    Modal.confirm({
      title: '삭제',
      content: `${list.length}건의 정보를 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await bbsApi.deleteCompanyRules(list.map(r => r.companyRuleId));
          const gone = new Set(list.map(r => r.companyRuleId));
          setRows(prev => prev.filter(r => !gone.has(r.companyRuleId)));
        } catch (err) {
          Modal.warning({ title: '확인', content: errorMessage(err, '삭제 실패') });
        }
      },
    });
  };

  // [E8] excelDownloadButton[엑셀다운로드].Select (L211) → downLoad() L428-479: 조회 조건 그대로 "회사규정_{회사명}.xlsx" (AS-IS는 RD 리포트 서버 — 서버가 xlsx를 만든다)
  const downLoad = async () => {
    try {
      await bbsApi.downloadCompanyRulesExcel(ruleType, searchText, `회사규정_${user.companyName}.xlsx`, isAdminCompany ? companyId : undefined);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    }
  };

  // [E9] excelUploadButton[엑셀업로드].Select (L224) → excelUpload() L368-386: 파일을 고르면 ExcelUpload?uploadType=bbsUpload → [E11] uploadExcelForm.SubmitComplete (L241) → 성공이면 "업로드 완료", 아니면 서버 메시지
  // [E13] fileUploadField.Change (L378) → uploadExcelForm.submit() (FileUpdownForm onChange)
  const onExcelFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      await bbsApi.uploadCompanyRulesExcel(file);
      message.info('업로드 완료');
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
  };

  // [E10] pushDataButton[내보내기].Select (L231) → pushData() L388-426: 선택이 없으면 메시지, 있으면 고객사를 고르고 bbs.Bbs15_CompanyRule.pushData → "작업이 완료되었습니다."
  const pushData = () => {
    if (checked().length < 1) return void message.warning('선택된 내역이 없습니다.');
    setPushOpen(true);
  };
  const onPushResult = async (company: { companyId: number } | null) => {
    setPushOpen(false);
    if (!company) return;
    try {
      await bbsApi.pushCompanyRules(company.companyId, checked().map(r => r.companyRuleId));
      message.info('작업이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '내보내기 실패'));
    }
  };

  // buildGrid()
  const columnDefs = useMemo(() => [
    gb.text('ruleTypeName', 150, '구분'),
    gb.textCenter('companyRuleCode', 100, '규정코드'),
    gb.text('title', 450, '규정명'),
    gb.date('revisionDate', 100, '제개정일'),
    gb.longCenter('revisionNo', 70, '개정회차'),
    gb.longCenter('fileCnt', 130, '규정 첨부파일 갯수'),
    gb.booleanYn2('publicYn', 50, '공개'),
    gb.date('closeDate', 100, '종료일'),
    gb.text('note', 300, '비고'),
    // addCell → Bbs15_Edit_CompanyRuleManager.editCompanyRule(): 고른 행(content 포함)을 연다
    iconCell<BbsCompanyRule>('edit', 'actionCell', 55, '수정', row => setEditTarget({ ...row })),
    gb.textCenter('creName', 90, '작성자'),
    gb.textCenter('updName', 90, '변경자'),
    gb.textCenter('updDateStr', 150, '작성(변경)일'),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      {/* [E4] retrieveButton[조회].Select (L187) → retrieve(), [E1] searchTextField.KeyPress [Enter] (L141) → retrieve() */}
      <SearchBar
        onSearch={() => retrieve()}
        extra={
          <>
            <Button type="register" onClick={insert}>등록</Button>
            <Button type="register" onClick={copyInsert}>등록(복사)</Button>
            <Button type="delete" onClick={deleteRow}>삭제</Button>
            <Button type="download" onClick={downLoad}>엑셀다운로드</Button>
            {isManager && <Button type="upload" onClick={() => excelForm.current?.click()}>엑셀업로드</Button>}
            {isManager && <Button type="change" onClick={pushData}>내보내기</Button>}
            <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
          </>
        }
      >
        {isAdminCompany && (
          <SearchBar.Field label="고객사">
            <Input readOnly style={{ width: 200, cursor: 'pointer' }} value={companyName} suffix={<SearchOutlined />} onClick={() => setLookupCompany(true)} />
          </SearchBar.Field>
        )}
        <SearchBar.Field label="구분">
          {/* [E3] companyRuleName[CompanyRuleType].Collapse (L180) → retrieve() */}
          <SystemCodeComboBox kindCd="CompanyRuleType" altCode={['%', '전체']} style={{ width: 150 }} value={ruleType}
            onChange={code => { const v = code ?? '%'; setRuleType(v); void retrieve({ ruleType: v }); }} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 230 }} placeholder="규정명/규정코드" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MultiGrid<BbsCompanyRule>
          gridRef={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.companyRuleId)}
        />
      </div>
      <Bbs15_Edit_CompanyRuleManager model={editTarget} onClose={() => setEditTarget(null)} onDone={() => { void retrieve(); }} />
      <Sys01_Lookup_Company open={lookupCompany} onResult={onCompanyResult} onClose={() => setLookupCompany(false)} />
      <Sys01_Lookup_Company open={pushOpen} onResult={onPushResult} onClose={() => setPushOpen(false)} />
    </div>
  );
};
