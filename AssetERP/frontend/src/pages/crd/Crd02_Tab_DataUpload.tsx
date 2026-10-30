/**
 * [1039] 자금관리 > 30. 법인카드관리 > 법인카드 내역 업로드 (U14) — 같은 클래스: [1479] 경영관리 > 92. 법인카드 등록 > 법인카드 내역 업로드
 * AS-IS: myApp/client/vi/crd/Crd02_Tab_DataUpload.java (990줄) + Crd02_Edit_DataUpload.java (314줄, 아래 편집 폼)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L274-316: 위(분할 가능, 여백 20, 최대 1000) = 테두리 박스(툴바 두 줄 88 + 내역 그리드 + 페이징 500건) / 아래(310, 최대 900, 여백 0·20·20·20) = 편집 폼(Crd02_Edit_DataUpload)
 *   툴바 1줄 = 기준년월(70) · 카드회사(100) · 확정여부 · 검색(200) · [조회][엑셀업로드] + 오른쪽 20% 총 승인금액, 2줄 = 개별내역 [등록(복사)][등록][삭제] · [전체내역확정][선택내역확정] + 오른쪽 총 부가세
 * 스타일: SGEF (견본 Fnd01_Tab_FundCode — 위 = SearchBar + 그리드, 아래 = 편집 폼). 다른 점: 툴바가 두 줄이고 그리드 아래에 서버 페이징 툴바가 붙는다
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 조건 4개 + 버튼이 많아 UX-02 초기화는 넣지 않는다
 * 도달 불가(원본): targetDelete()(E18, updateExcel의 상태 2 이상 분기 — targetCheck가 그 값을 만들지 않는다)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Select, Splitter, message } from 'antd';
import dayjs from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { crdApi } from '@/api/crd';
import { errorMessage } from '@/api/client';
import { CrdData, CrdDataConfirm } from '@/types/crd';
import { Button } from '@/components/button';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { MultiGrid, PagingToolBar, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Crd02_Edit_DataUpload } from './Crd02_Edit_DataUpload';
import { Crd11_Lookup_ExcelCode } from './Crd11_Lookup_ExcelCode';

const gb = gbFor<CrdData>();
const LIMIT = 500;
const ALL = '%';
const ALL_CODE: [string, string] = [ALL, '전체'];
const CONFIRM_OPTIONS: { value: CrdDataConfirm; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'DONE', label: '확정' },
  { value: 'NOT_ALL', label: '미확정(승인취소포함)' },
  { value: 'NOT_EXCEPT_CANCEL', label: '미확정(승인취소제외)' },
];
/** setChecked(MULTI) — 행 클릭은 그 행만 선택(체크박스는 누적). 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const MULTI_CHECK = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: true } as const;

const won = (v?: number | null) => (v ?? 0).toLocaleString('ko-KR');

/** HtmlMessageBox — 서버 문구에 <br>·<span>이 들어 있다 */
const html = (s?: string | null) => <div dangerouslySetInnerHTML={{ __html: s ?? '' }} />;

export const Crd02_Tab_DataUpload: React.FC = () => {
  const gridRef = useRef<AgGridReact<CrdData>>(null);
  const excelForm = useRef<FileUpdownFormHandle>(null);
  /** 엑셀업로드를 확인한 시점의 카드회사·사용년월(파일을 고르기까지 툴바가 바뀌어도 그대로 올린다) */
  const uploadTarget = useRef<{ cardCode: string; dataYm: string }>({ cardCode: '', dataYm: '' });
  // [E0] 화면 열림 (생성자 L104-107) → init() L109-329: 확정여부 "전체", 기준년월 = 지난달(오늘의 달 첫날 - 1일), 카드회사 "전체"(100), 검색 200(빈칸 글자 안내)
  const [dataYmText, setDataYmText] = useState(() => dayjs().startOf('month').subtract(1, 'day').format('YYYY.MM'));
  const [bankCode, setBankCode] = useState<string>(ALL);
  const [bankName, setBankName] = useState('전체');
  const [confirm, setConfirm] = useState<CrdDataConfirm>('ALL');
  const [searchText, setSearchText] = useState('');
  const [lookupOpen, setLookupOpen] = useState(false);
  /** [엑셀업로드 설정] 단추 — 처음엔 숨기고(L173), 카드회사를 고르면 보인다(L208) */
  const [setButtonVisible, setSetButtonVisible] = useState(false);
  const [rows, setRows] = useState<CrdData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState<{ approval: number; surtax: number }>({ approval: 0, surtax: 0 });
  /** 목록에서 고른 내역 → 편집 폼(editForm). null이면 폼 비활성 */
  const [selected, setSelected] = useState<CrdData | null>(null);
  /** 다음 rowData 갱신 때 고를 행 id (없으면 첫 행) */
  const pendingSelect = useRef<number | null>(null);
  const prevSelected = useRef<number[]>([]);
  const tempId = useRef(0);
  const retrieveSeq = useRef(0);

  /** getApprDate() L981 — "yyyy.MM"로 맞춘다(2026-10 → 2026.10). 읽을 수 없으면 null */
  const apprDate = (): string | null => {
    const m = /^(\d{4})\.(\d{1,2})$/.exec(dataYmText.replace(/-/g, '.').trim());
    return m ? `${m[1]}.${m[2].padStart(2, '0')}` : null;
  };
  const apprDateOrWarn = (): string | null => {
    const d = apprDate();
    if (!d) message.warning('양식에 맞게 입력해주세요 (YYYY.MM)');
    return d;
  };

  const cond = (bank = bankCode) => ({ searchText, dataBankCode: bank, dataYm: dataYmText.trim() === '' ? ALL : (apprDate() ?? dataYmText), confirm });

  // [E13] gridToolBar (GridPagingLoader).callbackOnCreate (L289) → retrieve() / 페이지 이동은 그 페이지만 다시 읽는다(총액은 그대로)
  const load = async (toPage: number, bank = bankCode) => {
    const my = ++retrieveSeq.current;
    setLoading(true);  // grid.mask("Loading")
    try {
      const res = await crdApi.searchData({ ...cond(bank), offset: (toPage - 1) * LIMIT, limit: LIMIT });
      if (my !== retrieveSeq.current) return;
      pendingSelect.current = null;
      setRows(res.rows);
      setTotal(res.total);
      setPage(toPage);
      if (res.rows.length === 0) setSelected(null);  // 조회가 끝나면 첫 행을 고르고 폼을 켠다(onRowDataUpdated), 행이 없으면 폼을 끈다
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === retrieveSeq.current) setLoading(false);  // grid.unmask()
    }
  };

  // retrieve() L362-419 → 1쪽을 읽고 totalAmtCheck() L421-474: crd.Crd02_Data.selectByAmt → 총 승인금액·총 부가세 라벨
  // [E1] uploadExcelForm.SubmitComplete (L162)·[E3] dataYMText.KeyPress [Enter] (L194)·[E5] searchText.KeyPress [Enter] (L220)·[E7] retrieveButton[조회].Select (L234)·[E15] messageBox.DialogHide (L579)
  const retrieve = async (bank = bankCode) => {
    if (dataYmText.trim() !== '' && !apprDateOrWarn()) return;
    void load(1, bank);
    try {
      const a = await crdApi.getDataAmount(cond(bank));
      setAmount({ approval: a.totalApprovalAmount ?? 0, surtax: a.totalSurtax ?? 0 });
    } catch {
      setAmount({ approval: 0, surtax: 0 });
    }
  };
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E4] CCompanyComboBox[CreditCardCompany].Collapse (L204) → [엑셀업로드 설정] 단추를 보이거나 숨기고 retrieve()
  const onBankChange = (code: string | undefined, name?: string) => {
    const c = code ?? ALL;
    setBankCode(c);
    setBankName(name ?? '전체');
    setSetButtonVisible(c !== ALL);
    void retrieve(c);
  };

  /** 선택 바뀜 → 편집 폼. GXT getSelectedItem()은 마지막으로 고른 행이라 새로 더해진 행을 쓴다 */
  // [E14] grid.SelectionChanged [선택>0] (L318) → retrieveEditPage() L351-360: editForm.retrieve(고른 내역), 선택이 없으면 폼 비활성
  const retrieveEditPage = () => {
    const sel = gridRef.current?.api?.getSelectedRows() ?? [];
    const ids = sel.map(r => r.dataId);
    const added = sel.find(r => !prevSelected.current.includes(r.dataId));
    prevSelected.current = ids;
    setSelected(sel.length === 0 ? null : added ?? sel[sel.length - 1]);
  };
  const selectedRows = () => gridRef.current?.api?.getSelectedRows() ?? [];

  /** 마감체크 → 통과하면 next() (insertDeadLineCheck L480 · copyDeadLineCheck L507, checkType "3") */
  const deadLineCheck = async (next: () => void) => {
    const ym = apprDateOrWarn();
    if (!ym) return;
    try {
      const r = await crdApi.dataTargetCheck(ym, '3');
      if (r.status === 0) next();
      else message.warning(r.message ?? '');
    } catch (err) {
      message.warning(errorMessage(err, '확인 실패'));
    }
  };

  // [E11] insertButton[등록].Select (L260) → insertDeadLineCheck() L480: 카드회사가 전체·비어 있으면 "카드회사를 선택해주세요" → 마감체크 → insertRow()
  const insertDeadLineCheck = () => {
    if (bankCode === ALL || bankCode === '') {
      message.warning('카드회사를 선택해주세요');
      return;
    }
    void deadLineCheck(insertRow);
  };

  // insertRow() L529-538: GridInsertRow — 03 원칙 17에 따라 맨 아래에 넣고 보여 준다. 회사·기준년월·카드회사를 채운다
  const insertRow = () => {
    const row: CrdData = { dataId: --tempId.current, dataYm: apprDate(), dataBankCode: bankCode, dataBankName: bankName };
    pendingSelect.current = row.dataId;
    setRows(prev => [...prev, row]);
  };

  // [E6] copyButton[등록(복사)].Select (L228) → copyDeadLineCheck() L507: 마감체크 → copyInsertRow() L925-966
  const copyDeadLineCheck = () => { void deadLineCheck(() => void copyInsertRow()); };

  //   고른 내역이 없으면 "복사할 대상을 선택해주세요." / 있으면 회사·기준년월·카드회사·카드번호·승인일·승인시간·승인금액·부가세·결제방법·할부개월수·승인번호·승인상태·가맹점(번호·명·상태·사업자번호·주소·업종·대표자·전화)을 가진 새 행을
  //   넣고 바로 copyUpdateRow() L968: crd.Crd02_Data.copyUpdate로 서버에 저장한다 → 저장한 내역(서버 ID)으로 바꿔 고른다
  const copyInsertRow = async () => {
    const src = selectedRows()[0];
    if (!src) {
      message.warning('복사할 대상을 선택해주세요.');
      return;
    }
    const copy: CrdData = {
      dataId: --tempId.current,
      companyId: src.companyId, dataYm: src.dataYm, dataBankCode: src.dataBankCode, dataBankName: src.dataBankName,
      cardNo: src.cardNo, approvalDt: src.approvalDt, approvalTime: src.approvalTime, approvalAmount: src.approvalAmount, surtax: src.surtax,
      paymentMethod: src.paymentMethod, monthlyPayments: src.monthlyPayments, approvalNo: src.approvalNo, stateName: src.stateName,
      merchantNo: src.merchantNo, franchiseName: src.franchiseName, merchantStatus: src.merchantStatus, bizLicenseNo: src.bizLicenseNo,
      merchantAddr: src.merchantAddr, sectorName: src.sectorName, representativeName: src.representativeName, merchantPhone: src.merchantPhone,
    };
    try {
      const saved = await crdApi.saveData(copy);
      pendingSelect.current = saved.dataId;
      setRows(prev => [...prev, saved]);
    } catch (err) {
      message.warning(errorMessage(err, '등록(복사) 실패'));
    }
  };

  // [E12] deleteButton[삭제].Select (L267) → deleteCheck() L540-573: 고른 내역이 없으면 "선택된 정보가 없습니다" → biz.Biz01_Promo.targetListCheck(checkType "1")
  //   마감(-1)이면 메시지, 그 밖은 deleteRow()
  const deleteCheck = async () => {
    const sel = selectedRows();
    if (sel.length === 0) {
      message.warning('선택된 정보가 없습니다');
      return;
    }
    const ids = sel.map(r => r.dataId).filter(id => id > 0);
    try {
      const r = ids.length > 0 ? await crdApi.dataListCheck('1', ids) : { status: 0, message: '', count: 0 };
      if (r.status === -1) message.warning(r.message ?? '');
      else deleteRow(sel);
    } catch (err) {
      message.warning(errorMessage(err, '확인 실패'));
    }
  };

  // deleteRow() L575-613: "삭제"/"해당 전표를 삭제하시겠습니까?"(폭 300) → [YES] crd.Crd02_Data.delete + crd.Crd02_Data.deleteBiz → "삭제 되었습니다." 뒤 retrieve()
  const deleteRow = (sel: CrdData[]) => {
    Modal.confirm({
      title: '삭제',
      content: '해당 전표를 삭제하시겠습니까?',
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          const ids = sel.map(r => r.dataId).filter(id => id > 0);
          if (ids.length > 0) await crdApi.deleteData(ids);
          message.success('삭제 되었습니다.');
          void retrieve();
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  const openExcelCodeLookup = () => {
    if (bankCode === ALL) {
      message.warning('카드사를 선택해주세요.');
      return;
    }
    setLookupOpen(true);
  };

  // [E8] insertRootButton[엑셀업로드].Select (L240) → uploadExcelCheck() L615-650: 카드회사가 전체면 "카드사를 선택해주세요." → 기준년월 형식 검사 →
  //   [E16] "확인"/"{yyyy}년 {MM}월 '{카드회사}'의 엑셀업로드를 진행하시겠습니까?"(폭 460) → [YES] updateExcel()
  const uploadExcelCheck = () => {
    if (bankCode === ALL) {
      message.warning('카드사를 선택해주세요.');
      return;
    }
    const ym = apprDateOrWarn();
    if (!ym) return;
    Modal.confirm({
      title: '확인',
      content: `${ym.substring(0, 4)}년 ${ym.substring(5, 7)}월 '${bankName}'의 엑셀업로드를 진행하시겠습니까?`,
      width: 460,
      okText: '예',
      cancelText: '아니오',
      onOk: () => updateExcel(ym),
    });
  };

  // updateExcel() L652-711: biz.Biz01_Promo.targetCheck(checkType "1") — 0이면 excelUpload(), -1이면 메시지, 1이면 확인창(message, 폭 500) [YES] → excelUpload()
  //   (그 밖의 값이면 [YES] → targetDelete() E18이지만 서버가 그 값을 만들지 않아 도달 불가)
  const updateExcel = async (ym: string) => {
    try {
      const r = await crdApi.dataTargetCheck(ym, '1');
      if (r.status === 0) {
        excelUpload(ym);
      } else if (r.status === -1) {
        message.warning(r.message ?? '');
      } else {
        Modal.confirm({ title: '확인', content: html(r.message), width: 500, okText: '예', cancelText: '아니오', onOk: () => excelUpload(ym) });
      }
    } catch (err) {
      message.warning(errorMessage(err, '확인 실패'));
    }
  };

  // excelUpload() L737-756: 파일을 고르면 ExcelUpload?uploadType=crdExcelUpload&cardCode&dataYMText 로 올린다
  const excelUpload = (ym: string) => {
    uploadTarget.current = { cardCode: bankCode, dataYm: ym };
    excelForm.current?.click();
  };
  // [E19] fileUploadField.Change (L748) → uploadExcelForm.submit() → [E1] SubmitComplete (L162): "카드전표 업로드" 메시지(서버 결과 글) 뒤 retrieve()
  const onExcelFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      await crdApi.uploadDataExcel(file, uploadTarget.current.cardCode, uploadTarget.current.dataYm);
      message.info('카드전표를 업로드하였습니다.');
    } catch (err) {
      message.warning(errorMessage(err, '업로드 실패'));
    } finally {
      setBusy(false);
    }
    void retrieve();
  };

  /** 내역확정 확인 문구 앞머리 — "{yyyy}년 {MM}월 '{카드회사} {n}'건의 {서버 문구}" */
  const confirmPrefix = (ym: string, n: number) => `${ym.substring(0, 4)}년 ${ym.substring(5, 7)}월 '${bankName} ${n}'건의 `;

  // [E9] selectInsertBizButton[선택내역확정].Select (L246) → insertCheck() L758-816: 고른 내역이 없으면 "선택된 정보가 없습니다", 카드회사가 빈 내역이 있으면
  //   "카드회사가 미입력된 정보가 포함되어 있습니다" → biz.Biz01_Promo.targetListCheck(checkType "2"): -1 메시지 / 0 insertBiz / 그 밖은 확인창(폭 500) [E20] YES → insertBiz()
  const insertCheck = async () => {
    const sel = selectedRows();
    if (sel.length === 0) {
      message.warning('선택된 정보가 없습니다');
      return;
    }
    if (sel.some(r => r.dataBankCode == null || r.dataBankCode === '')) {
      message.warning('카드회사가 미입력된 정보가 포함되어 있습니다');
      return;
    }
    const ym = apprDate();
    await confirmThen({ ids: sel.map(r => r.dataId).filter(id => id > 0) }, ym, sel.length);
  };

  // [E10] allInsertBizButton[전체내역확정].Select (L253) → totalInsertCheck() L818-897: 조회조건에 맞는 전체를 읽어(crd.Crd02_Data.selectByText) 있으면 같은 확인 → [E21] YES → insertBiz()
  //   조건에 맞는 내역이 없으면 아무 일도 하지 않는다
  const totalInsertCheck = async () => {
    const c = cond();
    await confirmThen({ searchText: c.searchText, dataBankCode: c.dataBankCode, dataYm: c.dataYm, confirm: c.confirm }, apprDate(), null);
  };

  const confirmThen = async (target: { ids?: number[]; searchText?: string; dataBankCode?: string; dataYm?: string; confirm?: CrdDataConfirm }, ym: string | null, n: number | null) => {
    setBusy(true);  // grid.mask("Loading...")
    try {
      const r = await crdApi.dataConfirmCheck(target);
      if (n == null && r.count === 0) return;
      if (r.status === -1) {
        message.warning(r.message ?? '');
      } else if (r.status === 0) {
        await insertBiz(target);
      } else {
        const when = ym ?? '';
        Modal.confirm({
          title: '확인',
          content: html(`${confirmPrefix(when, n ?? r.count)}${r.message ?? ''}`),
          width: 500,
          okText: '예',
          cancelText: '아니오',
          onOk: () => insertBiz(target),
        });
      }
    } catch (err) {
      message.warning(errorMessage(err, '확인 실패'));
    } finally {
      setBusy(false);
    }
  };

  // insertBiz() L899-923: biz.Biz01_Promo.insertList — 성공이면 "내역확정이 완료되었습니다" 뒤 retrieve(), 실패면 서버 메시지
  const insertBiz = async (target: Parameters<typeof crdApi.confirmData>[0]) => {
    setBusy(true);  // grid.mask("처리 중")
    try {
      await crdApi.confirmData(target);
      message.success('내역확정이 완료되었습니다');
      void retrieve();
    } catch (err) {
      message.warning(errorMessage(err, '내역확정 실패'));
    } finally {
      setBusy(false);
    }
  };

  // Crd02_Edit_DataUpload.updateRow()의 결과 행으로 목록을 갱신한다(새 행은 임시 id를 서버 id로 바꾼다) → 그 행을 그대로 고른다
  const onSaved = (oldId: number, saved: CrdData) => {
    pendingSelect.current = saved.dataId;
    setRows(prev => prev.map(r => (r.dataId === oldId ? saved : r)));
  };

  // buildGrid() L331-349
  const columnDefs = useMemo(() => [
    gb.date('approvalDt', 100, '승인일'),
    gb.textCenter('approvalTime', 100, '승인시간'),
    gb.textCenter('cardNo', 150, '카드번호'),
    gb.text('franchiseName', 250, '가맹점명'),
    gb.text('sectorName', 150, '업종명'),
    gb.long('approvalAmount', 150, '승인금액'),
    gb.long('surtax', 150, '부가세'),
    gb.textCenter('stateName', 100, '승인상태'),
    gb.textCenter('bizLicenseNo', 150, '가맹점 사업자번호'),
    gb.textCenter('representativeName', 200, '가맹점 대표자명'),
    gb.text('merchantPhone', 150, '가맹점 전화'),
    gb.textCenter('confirmYn', 80, '내역확정'),
  ], []);

  const totalLabel = (text: string, value: number) => (
    <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
      {text} : <span style={{ color: '#456EA6' }}>{won(value)}</span> 원
    </div>
  );

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={200} max={1000}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 15px 0 15px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <SearchBar
                    onSearch={() => void retrieve()}
                    loading={loading}
                    extra={<>
                      <Button type="upload" onClick={uploadExcelCheck}>엑셀업로드</Button>
                      {/* [E2] uploadSetButton[엑셀업로드 설정].Select (L174) → 카드회사가 전체면 "카드사를 선택해주세요." / 아니면 Crd11_Lookup_ExcelCode.open(카드회사, 이름) */}
                      {setButtonVisible && <Button type="assign" onClick={openExcelCodeLookup}>엑셀업로드 설정</Button>}
                      <FileUpdownForm ref={excelForm} accept=".xlsx,.xls" onChange={onExcelFile} />
                    </>}
                  >
                    <SearchBar.Field label="기준년월">
                      <SearchBar.Input style={{ width: 70 }} placeholder="YYYY.MM" value={dataYmText} onChange={e => setDataYmText(e.target.value)} />
                    </SearchBar.Field>
                    <SearchBar.Field label="카드회사">
                      <SystemCodeComboBox kindCd="CreditCardCompany" altCode={ALL_CODE} style={{ width: 100 }} value={bankCode} onChange={onBankChange} />
                    </SearchBar.Field>
                    <SearchBar.Field label="확정여부">
                      <Select<CrdDataConfirm> style={{ width: 170 }} value={confirm} options={CONFIRM_OPTIONS} onChange={setConfirm} />
                    </SearchBar.Field>
                    <SearchBar.Field label="검색">
                      <SearchBar.Input style={{ width: 200 }} placeholder="문자열을 입력하세요" value={searchText} onChange={e => setSearchText(e.target.value)} />
                    </SearchBar.Field>
                  </SearchBar>
                </div>
                <div style={{ width: '20%', minWidth: 220, flexShrink: 0 }}>{totalLabel('총 승인금액', amount.approval)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 15px 8px 15px' }}>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>개별내역</span>
                  <Button type="register" onClick={copyDeadLineCheck}>등록(복사)</Button>
                  <Button type="register" onClick={insertDeadLineCheck}>등록</Button>
                  <Button type="delete" onClick={deleteCheck}>삭제</Button>
                  <span style={{ width: 8 }} />
                  <Button type="save" onClick={totalInsertCheck}>전체내역확정</Button>
                  <Button type="save" onClick={insertCheck}>선택내역확정</Button>
                </div>
                <div style={{ width: '20%', minWidth: 220, flexShrink: 0 }}>{totalLabel('총 부가세', amount.surtax)}</div>
              </div>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <MultiGrid<CrdData>
                    gridRef={gridRef}
                    rowData={rows}
                    columnDefs={columnDefs}
                    getRowId={p => String(p.data.dataId)}
                    loading={loading || busy}
                    rowSelection={MULTI_CHECK}
                    onRowDataUpdated={e => {
                      // 조회·등록·저장 뒤 고를 행(없으면 첫 행)을 고르고 보여 준다
                      const node = pendingSelect.current != null ? e.api.getRowNode(String(pendingSelect.current)) : e.api.getDisplayedRowAtIndex(0);
                      pendingSelect.current = null;
                      prevSelected.current = [];
                      if (node) {
                        node.setSelected(true);
                        if (node.rowIndex != null) e.api.ensureIndexVisible(node.rowIndex);
                      }
                    }}
                    onSelectionChanged={retrieveEditPage}
                  />
                </div>
                <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={p => void load(p)} />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={310} min={250} max={900}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Crd02_Edit_DataUpload model={selected} onSaved={onSaved} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Crd11_Lookup_ExcelCode open={lookupOpen} bankCode={bankCode} bankName={bankName} onClose={() => setLookupOpen(false)} />
    </div>
  );
};
