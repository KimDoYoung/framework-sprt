/**
 * [1315] KFS > 04. ICAM 사용자ID 관리 > 미사용ID 권한정지 신청 (EE31)
 * AS-IS: myApp/client/vi/icam/Icam55_Tab_UserStopAuthAppr.java (595줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L95-132: 가운데(여백 20, 테두리) = 툴바(기준 분기 [연도 45][분기 콤보 50] 분기 · 검색 300 · [조회][저장][등록][삭제][템플릿][엑셀업로드][상신]) + 셀 편집 그리드(CellEditGrid, 체크 다중, 행번호, 12열).
 * 상신 = 전자결재 편집창 Apr01_Edit_ApprDoc 링크코드 A34(여러 행을 한 문서로, insertLinkApprovals L445-493 → updateApprId L495-515). 본문은 서버 IcamUserStopLinkSeedProvider.
 * 스타일: SG (견본 Tdm01_Tab_Hr — docs/page-style.md). 이 화면은 셀 편집 그리드 + 엑셀 업로드·템플릿.
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n) UX-03, 날짜 열 폭 UX-08(읽기 90)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { icamUserApi } from '@/api/icam';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { IcamStop } from '@/types/icam';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';

const gb = gbFor<IcamStop>();
const FORMAT = 'YYYY-MM-DD';
const LINK_CODE = 'A34';

/** settings() L134-158: 오늘에서 3개월 전의 연도와 분기 */
const initialQuarter = () => {
  const d = dayjs().subtract(3, 'month');
  return { year: String(d.year()), quarter: String(Math.floor(d.month() / 3) + 1) };
};

/** getStdDate() L537-580: 선택 분기의 마지막 날. 연도가 4자리가 아니면 null */
const stdDateOf = (year: string, quarter: string): string | null => {
  if (!/^\d{4}$/.test(year)) return null;
  return dayjs(`${year}-${String(Number(quarter) * 3).padStart(2, '0')}-01`).endOf('month').format(FORMAT);
};

export const Icam55_Tab_UserStopAuthAppr: React.FC = () => {
  const user = useLoginUser();
  const fileForm = useRef<FileUpdownFormHandle>(null);
  const init = useMemo(initialQuarter, []);
  const [year, setYear] = useState(init.year);
  const [quarter, setQuarter] = useState(init.quarter);
  const [searchText, setSearchText] = useState('');
  /** retrieveDoc() L517-535: dcr.Dcr30_Link.selectByLinkCode("A34") — 정확히 1건일 때만 지정된 것으로 본다 */
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [viewStatus, setViewStatus] = useState<string | null>(null);
  const [link, setLink] = useState<{ classTreeId: number; linkCode: string; args: { stdDate: string; searchText: string } } | null>(null);
  const cond = useRef({ year, quarter, searchText });
  cond.current = { year, quarter, searchText };

  // retrieve() L286-309: icam.Icam55_IcamUser.selectBySearchText (신청구분 2, 기준일자 = 분기 마지막 날)
  const search = useCallback(async () => {
    const std = stdDateOf(cond.current.year, cond.current.quarter);
    if (!std) { message.warning('기준 연도를 확인해주세요'); return []; }
    return icamUserApi.searchStops({ searchText: cond.current.searchText, stdDate: std });
  }, []);
  // update() L325-361: 바뀐 행마다 회사명·사용자ID·사용자명 필수 (결재 중 문서 검사는 원본의 `==` 비교 때문에 실제로는 걸리지 않는다 — 이상한점 #196)
  const validate = useCallback((changed: IcamStop[]) => {
    for (const r of changed) {
      if (!r.companyName) return '회사명은 필수입력 항목입니다.';
      if (!r.userId) return '사용자ID는 필수입력 항목입니다.';
      if (!r.userName) return '사용자명은 필수입력 항목입니다.';
    }
    return undefined;
  }, []);
  const save = useCallback(async (rows: IcamStop[]) => { await icamUserApi.saveStops(rows); return rows; }, []);
  const remove = useCallback(async (ids: number[]) => { await icamUserApi.remove(ids); }, []);
  // insertRow() L311-323: 기준일자 = 분기 마지막 날, 등록자 = 로그인 사원
  const newRow = useCallback((): Partial<IcamStop> => ({
    regDate: stdDateOf(cond.current.year, cond.current.quarter) ?? undefined, regEmpName: user.name,
  }), [user.name]);

  const crud = useGridCrud<IcamStop>({ idField: 'icamUserId', search, save, remove, newRow, validate, firstEditField: 'companyName', reloadAfterSave: true });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L95-132) → retrieveDoc(), settings(), retrieve()
  useEffect(() => {
    dcrApi.searchClassTreeByLinkCode(LINK_CODE).then(list => setClassTreeId(list.length === 1 ? list[0].classTreeId : null)).catch(() => setClassTreeId(null));
    void retrieve();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E5] deleteButton[삭제].Select (L192) → deleteCheck() L381-417 → [E12] msgBox.DialogHide [YES] (L402) → delete() L419-443
  const deleteCheck = () => {
    const checked = crud.gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('삭제할 정보를 먼저 선택해주세요'); return; }
    if (checked.some(r => r.apprStatusCode === '10' || r.apprStatusCode === '20')) { message.warning('결재진행 중인 문서가 존재합니다'); return; }
    Modal.confirm({
      title: '확인',
      content: <span>결재완료된 문서도 같이 삭제됩니다.<br />{checked.length}건의 정보를 삭제하시겠습니까?</span>,
      okText: '예',
      cancelText: '아니오',
      width: 310,
      onOk: async () => {
        try {
          const saved = checked.filter(r => r.icamUserId > 0).map(r => r.icamUserId);
          if (saved.length > 0) await remove(saved);
          crud.removeRows(checked.map(r => r.icamUserId));
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E7] tempDownloadButton[템플릿].Select (L206) → downloadForm.submit(): ./excelTemplete/Template_권한정지 신청서.xlsx
  const downloadTemplate = async () => {
    try {
      await icamUserApi.downloadStopTemplate();
    } catch (err) {
      message.error(errorMessage(err, '템플릿을 받지 못했습니다'));
    }
  };

  // [E8] excelUploadButton[엑셀업로드].Select (L213) → excelUpload() L363-379: 파일을 고르면 ExcelUpload?uploadType=icamUserStopUpload
  // [E11] fileUploadField.Change (L371) → uploadExcelForm.submit(), [E9] uploadExcelForm.SubmitComplete (L226) → retrieve()
  const upload = async (file?: File) => {
    if (!file) return;
    try {
      await icamUserApi.uploadStopsExcel(file);
      message.success('권한정지 신청서를 업로드하였습니다.');
    } catch (err) {
      message.error(errorMessage(err, '업로드 실패'));
    }
    void retrieve();
  };

  // [E6] apprButton[상신].Select (L199) → insertLinkApprovals() L445-493
  const insertLinkApprovals = () => {
    const rows = crud.rows;
    if (rows.some(r => r.apprStatusCode === '10' || r.apprStatusCode === '20')) { message.warning('결재 중인 문서이거나, 상신올린 문서가 포함되어있습니다.'); return; }
    if (rows.length === 0) { message.warning('상신할 내용이 없습니다. 내용을 확인해주세요.'); return; }
    if (crud.hasChanges() || rows.some(r => r.icamUserId <= 0)) { message.warning('저장 후 상신하세요'); return; }   // 본문은 서버가 저장된 행으로 만든다
    if (classTreeId == null) { message.warning('[문서분류지정]에서 먼저 문서분류를 선택해주세요'); return; }
    const std = stdDateOf(year, quarter);
    if (!std) { message.warning('기준 연도를 확인해주세요'); return; }
    // [E13] msgBox.DialogHide [YES] (L465) → Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "A34", gridList, …) → updateApprId()
    Modal.confirm({
      title: '상신',
      content: '문서상신이 완료된 경우 재상신합니다. 진행하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 500,
      onOk: () => setLink({ classTreeId, linkCode: LINK_CODE, args: { stdDate: std, searchText } }),
    });
  };

  // updateApprId() L495-515: icam.Icam55_IcamUser.updateApprIds — 화면의 모든 행에 같은 상신ID → retrieve()
  const updateApprId = async (apprId: number) => {
    try {
      await icamUserApi.updateStopApprIds(crud.rows.map(r => r.icamUserId), apprId);
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
  };

  // [E10] viewCell (ImageCell) L238-262: apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, 닫으면 retrieve())
  const apprView = (row: IcamStop) => {
    if (row.apprId == null) { message.warning('관련 상신문서가 존재하지 않습니다'); return; }
    setViewStatus(row.apprStatusCode ?? null);
    setViewApprId(row.apprId);
  };

  // buildGrid() L234-284
  const columnDefs = useMemo(() => [
    gb.date('regDate', 90, '기준일자'),                                          // L270 (UX-08)
    gb.text('companyName', 300, '회사명', { editor: 'text' }),                   // L271
    gb.text('userId', 150, '사용자ID', { editor: 'text' }),                      // L272
    gb.text('userName', 150, '사용자명', { editor: 'text' }),                    // L273
    gb.text('email', 150, '이메일', { editor: 'text' }),                         // L274
    gb.text('apprStatusName', 80, '결재상태'),                                   // L275
    iconCell<IcamStop>('view', 'viewCell', 60, '문서보기', apprView),            // L276
    gb.text('regEmpName', 80, '등록자'),                                         // L277
    gb.text('procStateName', 100, '처리결과'),                                   // L278
    gb.date('procDate', 90, '처리일자'),                                         // L279 (UX-08)
    gb.text('procEmpName', 80, '처리자'),                                        // L280
    gb.textArea('procNote', 300, '처리상세'),                                    // L281
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L171) → retrieve() */}
        <SearchBar
          onSearch={() => void retrieve()}
          loading={crud.loading}
          extra={
            <>
              {/* [E4] updateButton[저장].Select (L185) → update() */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E3] insertButton[등록].Select (L178) → insertRow() */}
              <Button type="register" onClick={() => crud.addRow()}>등록</Button>
              <Button type="delete" onClick={deleteCheck}>삭제</Button>
              <Button type="download" onClick={downloadTemplate}>템플릿</Button>
              <Button type="upload" onClick={() => fileForm.current?.click()}>엑셀업로드</Button>
              <FileUpdownForm ref={fileForm} accept=".xls,.xlsx" onChange={upload} />
              <Button type="register" onClick={insertLinkApprovals}>상신</Button>
            </>
          }
        >
          <SearchBar.Field label="기준 분기">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Input style={{ width: 80 }} maxLength={4} value={year} onChange={e => setYear(e.target.value)} />
              <Select style={{ width: 60 }} value={quarter} onChange={setQuarter} options={['1', '2', '3', '4'].map(v => ({ value: v, label: v }))} />
              분기
            </span>
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E1] searchText.KeyPress [Enter] (L162) → retrieve() */}
            <SearchBar.Input style={{ width: 300 }} placeholder="회사명/사용자/처리상세" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<IcamStop> crud={crud} columnDefs={columnDefs} getRowId={p => String(p.data.icamUserId)} />
        </div>
      </div>
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        statusCode={viewStatus}
        link={link}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setLink(null); }}
      />
    </div>
  );
};
