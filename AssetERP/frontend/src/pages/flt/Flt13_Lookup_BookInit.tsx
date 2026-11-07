/**
 * 최초원장 등록 조회창 — Flt03_Tab_AccountReport(#1125)의 [최초원장 등록]이 연다 (임직원매매 화면사용순서 #1369의 링크도 같은 창)
 * AS-IS: myApp/client/vi/flt/Flt13_Lookup_BookInit.java (665줄) — 메서드 이름·줄 번호는 원본(IDMS-IC)
 * 생성자 L99-107·open(date, callback) L109-144: 모달 1350×650 "최초원장 등록"(닫기 X 없음), 툴바 50 =
 *   검색(200, "계좌/종목/종목유형") · [조회] · ※ 최초원장 잔고기준일(영업일) 날짜(100) · [등록][저장][삭제] · [템플릿][엑셀업로드][종목유형코드]
 *   + 체크박스 다중 셀 편집 그리드(잔고기준일 100 · 계좌 250 · 종목유형 150 · 종목명 250 · 종목코드 120 · 보유수량<br>(입출금액) 100 · 보유금액 120, 맨 아래 합계 행 "계") + [닫기]
 * 등록·저장·삭제·엑셀업로드·잔고기준일 일괄 변경 전에는 checkPreTr()로 영업일·기준일 이전 실거래·정기보고 상신문서를 점검한다
 * 스타일: MFG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, DatePicker, Input, message, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { CustomCellRendererProps } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi, fltBookInitApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltBookInit, FltItemTypeCode, FltTrAccount } from '@/types/flt';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { FileUpdownForm, FileUpdownFormHandle } from '@/components/form/FileUpdownForm';
import { useGridCrud } from '@/hooks/useGridCrud';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Com50_Lookup_StkItem } from '@/components/lookup/Com50_Lookup_StkItem';
import { Flt03_Lookup_Account } from './Flt03_Lookup_Account';
import { Flt05_Lookup_ItemTypeConfirm } from './Flt05_Lookup_ItemTypeConfirm';
import { Flt10_Lookup_Item } from './Flt10_Lookup_Item';

const gb = gbFor<FltBookInit>();
const DATE = 'YYYY-MM-DD';

interface Props {
  open: boolean;
  /** [닫기] — AS-IS callback.execute() 뒤 hide() (닫기 X는 없다) */
  onClose: () => void;
}

export const Flt13_Lookup_BookInit: React.FC<Props> = ({ open, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [stdDate, setStdDate] = useState<Dayjs | null>(null);
  // orgDate (L97): 마지막으로 점검을 통과한(또는 처음 읽은) 잔고기준일 — 점검에 실패하거나 일괄 변경을 취소하면 이 값으로 되돌린다
  const orgDate = useRef<string | null>(null);
  const [itemTypes, setItemTypes] = useState<FltItemTypeCode[]>([]);
  const [accountRow, setAccountRow] = useState<FltBookInit | null>(null);
  const [itemRow, setItemRow] = useState<FltBookInit | null>(null);
  const [stkRow, setStkRow] = useState<FltBookInit | null>(null);
  const [typeConfirmOpen, setTypeConfirmOpen] = useState(false);
  const fileUpload = useRef<FileUpdownFormHandle>(null);
  const searchRef = useRef('');
  searchRef.current = searchText;

  const crud = useGridCrud<FltBookInit>({
    idField: 'bookInitId',
    // retrieve() L425-439: flt.Flt13_BookInit.selectByPersonId(회사, 로그인 사원, "%검색어%")
    search: useCallback(() => fltBookInitApi.search(searchRef.current), []),
    save: async rows => fltBookInitApi.save(rows),
    remove: ids => fltBookInitApi.remove(ids),
    newRow: () => ({}),
    firstEditField: 'itemTypeName',
  });
  // 오래 사는 콜백이 최신 crud 를 부르게 한다 (crud 는 rows 가 바뀔 때마다 새 객체)
  const crudRef = useRef(crud);
  crudRef.current = crud;
  // crud 는 rows 가 바뀔 때마다 새 객체라 의존성에는 안정된 것만 꺼내 쓴다
  const { retrieve: crudRetrieve } = crud;

  // [E0] 화면 열림 (생성자 L99-107, open L109-144) → settings() → setStdDate() L267-283: flt.Flt13_BookInit.getInitDate → 있으면 잔고기준일로 하고 retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    searchRef.current = '';
    const today = dayjs();
    setStdDate(today);
    orgDate.current = today.format(DATE);
    fltApi.searchItemTypeCodes(today.format(DATE)).then(setItemTypes).catch(() => {});  // buildGrid() L335 종목유형 콤보(startDate = 오늘)
    fltBookInitApi.getInitDate().then(d => {
      if (d) {
        setStdDate(dayjs(d));
        orgDate.current = d;
        void crudRetrieve();
      }
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [open, crudRetrieve]);

  const stdText = () => stdDate?.format(DATE) ?? null;

  /**
   * checkPreTr() L621-651 (checkWorkingYn L285-304 포함): 영업일 여부 → 잔고기준일 이전 실거래 → 정기보고 상신문서.
   * 통과하면 orgDate를 잔고기준일로 하고 true, 아니면 안내 후 (영업일 실패가 아니면) 잔고기준일을 orgDate로 되돌리고 false
   */
  const checkPreTr = async (): Promise<boolean> => {
    const std = stdText();
    if (!std) {
      message.info('상단의 원장기준일을 지정하세요');
      return false;
    }
    try {
      const r = await fltBookInitApi.check(std);
      if (r.ok) {
        orgDate.current = std;
        return true;
      }
      message.info(r.message ?? '');
      if (r.revert && orgDate.current && orgDate.current !== std) setStdDate(dayjs(orgDate.current));
      return false;
    } catch (err) {
      message.error(errorMessage(err, '점검 실패'));
      return false;
    }
  };

  // [E1] searchText.KeyPress [Enter] (L149) / [E4] retrieveButton[조회].Select (L192) → retrieve()
  const retrieve = () => { void crud.retrieve(); };

  // [E2] stdDate.ValueChange (L159) → 목록이 있으면 확인창 "일괄변경" / "잔고기준일을 일괄 변경하시겠습니까?" → [E3] msgBox.DialogHide [YES] (L171) → holdDateChange() L586-595, NO → orgDate로 되돌림
  const onStdDateChange = (value: Dayjs | null) => {
    setStdDate(value);
    if (!value || crud.rows.length === 0) return;
    Modal.confirm({
      title: '일괄변경',
      content: '잔고기준일을 일괄 변경하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        // holdDateChange(): checkPreTr(…) → 모든 행의 잔고기준일을 새 날짜로 (변경 표시)
        const r = await fltBookInitApi.check(value.format(DATE)).catch(() => null);
        if (!r) return;
        if (!r.ok) {
          message.info(r.message ?? '');
          if (r.revert && orgDate.current && orgDate.current !== value.format(DATE)) setStdDate(dayjs(orgDate.current));
          return;
        }
        orgDate.current = value.format(DATE);
        crud.rows.forEach(row => crud.updateRow(row.bookInitId, { bookDate: value.format(DATE) }));
      },
      onCancel: () => { if (orgDate.current) setStdDate(dayjs(orgDate.current)); },
    });
  };

  // [E5] insertButton[등록].Select (L198) → insertRow() L441-460: 원장기준일이 없으면 안내, checkPreTr 통과하면 잔고기준일이 채워진 새 행
  const insertRow = async () => {
    if (!stdDate) { message.info('상단의 원장기준일을 지정하세요'); return; }
    if (!(await checkPreTr())) return;
    crud.addRows([{ bookDate: stdDate.format(DATE) }], false);
  };

  // [E6] updateButton[저장].Select (L204) → update() L462-531: 바뀐 게 없으면 안내 → checkPreTr → 행마다 순서대로 검사 → flt.Flt13_BookInit.update
  const update = async () => {
    crud.gridRef.current?.api?.stopEditing();
    const changed = crud.getChanged();
    if (changed.length === 0) { message.info('변경내역이 없습니다.'); return; }
    if (!(await checkPreTr())) return;
    for (const m of changed) {
      if (m.accountId == null) return void message.info('계좌를 선택하세요');
      if (m.itemType == null) return void message.info('종목유형을 선택하세요');
      if (m.itemName == null || m.itemName === '') return void message.info('종목명을 입력하세요');
      if (m.stkPriceYn && !m.itemCode) return void message.info('주식시세적용 종목유형인 경우 종목코드는 필수입니다');
      if (m.bookQty == null || m.bookQty === 0) return void message.info('보유수량을 입력하세요');
      if (m.bookAmt == null && m.itemType !== '99') return void message.info('보유금액을 입력하세요');
    }
    // 종목유형이 '99:예치금'인 경우 보유금액은 보유수량으로 SET (L506-509)
    const rows = changed.map(m => (m.itemType === '99' ? { ...m, bookAmt: Math.trunc(m.bookQty ?? 0) } : m));
    try {
      const saved = await fltBookInitApi.save(rows);
      changed.forEach((m, i) => crud.replaceRow(m.bookInitId, saved[i]));
      message.info('보유원장 생성이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E7] deleteButton[삭제].Select (L210) → preDelete() L533-563: checkPreTr → 선택 없으면 안내 → 확인창 "확인" / "{n}건의 내역을 삭제하시겠습니까?" → [E16] msgBox.DialogHide [YES] (L546) → delete() L565-584
  const preDelete = async () => {
    if (!(await checkPreTr())) return;
    const checked = (crud.gridRef.current?.api?.getSelectedRows() ?? []) as FltBookInit[];
    if (checked.length === 0) { message.info('삭제대상을 선택하세요'); return; }
    Modal.confirm({
      title: '확인',
      content: `${checked.length}건의 내역을 삭제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 200,
      onOk: async () => {
        try {
          const ids = checked.map(r => r.bookInitId);
          const savedIds = ids.filter(id => id > 0);
          if (savedIds.length > 0) await fltBookInitApi.remove(savedIds);
          crud.removeRows(ids);
          message.info('삭제가 완료되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E8] closeButton[닫기].Select [callback != null] (L216) → callback.execute(), hide()
  // [E9] tempDownloadButton[템플릿].Select (L225) → downloadForm.submit() (./excelTemplete/Template_초기원장등록.xlsx)
  const downloadTemplate = () => {
    fltBookInitApi.downloadTemplate().catch(err => message.error(errorMessage(err, '다운로드 실패')));
  };

  // [E10] excelUploadButton[엑셀업로드].Select (L231) → checkPreTr() → excelUpload() L597-616 (파일 선택 창)
  const excelUpload = async () => {
    if (!(await checkPreTr())) return;
    fileUpload.current?.click();
  };

  // [E17] fileUploadField.Change (L608) → uploadExcelForm.submit() → [E12] uploadExcelForm.SubmitComplete (L256): 서버 안내 문구를 알리고 retrieve()
  const onExcelChange = async (file: File | undefined) => {
    const std = stdText();
    if (!file || !std) return;
    try {
      message.info(await fltBookInitApi.uploadExcel(std, file));
    } catch (err) {
      message.info(errorMessage(err, '업로드 실패'));
    }
    retrieve();
  };

  // [E13] lookupAccount.TriggerClick [result != null] (L313) → Flt03_Lookup_Account.openDateLock(잔고기준일, …) → 고른 계좌의 이름·ID
  const pickAccount = (acc: FltTrAccount | null) => {
    if (acc && accountRow) crud.updateRow(accountRow.bookInitId, { accountInfo: acc.accountName, accountId: acc.accountId });
    setAccountRow(null);
  };

  // [E14] ItemTypeComboBox[sys.Sys00_Common.selectByFltItemType].Collapse (L336-347): 종목유형·주식시세적용 여부, '99'(예치금)면 종목명도 종목유형 이름으로
  const pickItemType = useCallback((row: FltBookInit, name: string | null) => {
    const code = itemTypes.find(c => c.name === name);
    if (!code) return;
    crudRef.current.updateRow(row.bookInitId, {
      itemType: code.code,
      itemTypeName: code.name,
      stkPriceYn: code.stkPriceYn,
      ...(code.code === '99' ? { itemName: code.name } : {}),
    });
  }, [itemTypes]);

  // [E15] lookupItemInfo.TriggerClick (L351) → 종목유형을 안 골랐으면 안내, 주식시세적용이면 lookupStkItem() L400-423(상장주식종목), 아니면 lookupItem() L388-398
  const lookupItemMain = (row: FltBookInit) => {
    if (row.stkPriceYn == null) {
      message.info('종목유형 선택 후 종목 선택이 가능합니다');
      return;
    }
    if (row.stkPriceYn) setStkRow(row);
    else setItemRow(row);
  };

  // lookupItem() L388-398: Flt10_Lookup_Item(잔고기준일) → 고른 종목명, 종목코드는 비움
  const pickItem = (itemName: string) => {
    if (itemRow) crud.updateRow(itemRow.bookInitId, { itemName, itemCode: null });
    setItemRow(null);
  };

  const triggerCell = (onClick: (row: FltBookInit) => void) => (p: CustomCellRendererProps<FltBookInit>) => {
    if (p.node.rowPinned || !p.data) return p.value;
    const data = p.data;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); onClick(data); }} />
        {p.value}
      </span>
    );
  };

  // buildGrid() L306-386: setChecked(MULTI) + getSumGrid("계", 1, 7, 8)
  const columnDefs = useMemo(() => [
    gb.date('bookDate', 100, '잔고기준일'),  // L377
    gb.text('accountInfo', 250, '계좌', { cellStyle: { color: '#1677ff' }, cellRenderer: triggerCell(setAccountRow) }),  // L378 lookupAccount(LookupTriggerField, 편집 불가)
    gb.text('itemTypeName', 150, '종목유형', {  // L379
      editor: 'select',
      values: itemTypes.map(c => c.name),
      valueSetter: p => { pickItemType(p.data, p.newValue); return true; },
    }),
    gb.text('itemName', 250, '종목명', { editor: 'text', cellStyle: { color: '#1677ff' }, cellRenderer: triggerCell(lookupItemMain) }),  // L380 lookupItemInfo
    gb.textCenter('itemCode', 120, '종목코드'),  // L381
    gb.double('bookQty', 100, '보유수량<br>(입출금액)', { editor: 'number' }),  // L382
    gb.long('bookAmt', 120, '보유금액', { editor: 'number' }),  // L383
  ], [itemTypes, pickItemType]);

  return (
    <>
      {/* 열 폭 합계 100+250+150+250+120+100+120 = 1090 + 행번호·체크 60 + 여백 130 = 1280 → AS-IS 1350보다 작지 않게 1350 (03 원칙 21) */}
      <LookupModal open={open} title="최초원장 등록" width={1350} style={{ top: 20 }} closable={false} maskClosable={false} keyboard={false} onCancel={onClose} destroyOnHidden
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E8] closeButton[닫기].Select [callback != null] (L216) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 520, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap' }}>
            <span>검색</span>
            {/* [E1] searchText.KeyPress [Enter] (L149) → retrieve() */}
            <Input value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={retrieve} placeholder="계좌/종목/종목유형" allowClear style={{ width: 200 }} />
            {/* [E4] retrieveButton[조회].Select (L192) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
            <span style={{ marginLeft: 8 }}>※ 최초원장 잔고기준일(영업일)</span>
            {/* [E2] stdDate.ValueChange (L159) → 일괄변경 확인 → [E3] holdDateChange() */}
            <DatePicker value={stdDate} onChange={onStdDateChange} format={DATE} allowClear={false} style={{ width: 130 }} />
            {/* [E5] insertButton[등록].Select (L198) → insertRow() */}
            <Button type="register" onClick={() => void insertRow()}>등록</Button>
            {/* [E6] updateButton[저장].Select (L204) → update() */}
            <Button type="save" count={crud.changes} onClick={() => void update()}>저장</Button>
            {/* [E7] deleteButton[삭제].Select (L210) → preDelete() */}
            <Button type="delete" onClick={() => void preDelete()}>삭제</Button>
            {/* [E9] tempDownloadButton[템플릿].Select (L225) */}
            <Button type="download" onClick={downloadTemplate}>템플릿</Button>
            {/* [E10] excelUploadButton[엑셀업로드].Select (L231) → checkPreTr(), excelUpload() */}
            <Button type="upload" onClick={() => void excelUpload()}>엑셀업로드</Button>
            {/* [E11] itemTypeButton[종목유형코드].Select (L242) → Flt05_Lookup_ItemTypeConfirm.open() */}
            <Button type="search" onClick={() => setTypeConfirmOpen(true)}>종목유형코드</Button>
            <FileUpdownForm ref={fileUpload} accept=".xls,.xlsx" onChange={file => void onExcelChange(file)} />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* setChecked(MULTI) L376 — 삭제·저장용 체크라 행 클릭 선택(rowClick)은 쓰지 않는다 (03 원칙 16 예외) */}
            <CellEditGrid<FltBookInit> crud={crud} columnDefs={columnDefs}
              sumRow={{ labelField: 'bookDate', label: '계', sum: ['bookQty', 'bookAmt'] }} />
          </div>
        </div>
      </LookupModal>
      <Flt03_Lookup_Account open={accountRow != null} baseDate={stdText() ?? dayjs().format(DATE)} dateLock onResult={pickAccount} onClose={() => setAccountRow(null)} />
      <Flt10_Lookup_Item open={itemRow != null} stdDate={stdText() ?? dayjs().format(DATE)} onResult={pickItem} onClose={() => setItemRow(null)} />
      <Com50_Lookup_StkItem
        mode={stkRow != null ? 'VIEW' : null}
        onResult={item => {
          // lookupStkItem() L412-422: Com50_Lookup_StkItem.view → 고른 종목의 이름·코드
          if (stkRow) crud.updateRow(stkRow.bookInitId, { itemName: item.itemName ?? null, itemCode: item.itemCode ?? null });
          setStkRow(null);
        }}
        onClose={() => setStkRow(null)}
      />
      <Flt05_Lookup_ItemTypeConfirm open={typeConfirmOpen} onClose={() => setTypeConfirmOpen(false)} />
    </>
  );
};
