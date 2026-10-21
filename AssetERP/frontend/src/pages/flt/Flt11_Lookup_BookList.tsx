/**
 * 보유내역 조회창 (I04) — Flt10_Tab_SellReport [등록]에서 연다(매도할 종목 선택). 보유내역조회 화면(I09)도 이 창을 쓴다.
 * AS-IS: myApp/client/vi/flt/Flt11_Lookup_BookList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(accountId, personId, stdDate, expectYn, callback) L63-99: 1310×450 모달, 툴바 "검색"(150, "종목코드/명") + [조회], 체크박스 다중 그리드, [선택][닫기]
 * 지금은 expectYn=true(사전신고 반영 `selectByText2`)만 — expectYn=false(`selectByText`)는 I09에서 더한다
 * 열 폭 합계가 1120을 넘어(03 원칙 21) 모달을 AS-IS 폭(1310)에 두고 가로 스크롤을 허용한다
 * UX보강(10): 툴바 = SearchBar(UX-01), 조회창 UX-05·06, 날짜 열 UX-08
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal, Space } from 'antd';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltBook } from '@/types/flt';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FltBook>();

/** AS-IS buildGrid() — setChecked(MULTI) */
const buildGrid = () => [
  gb.date('bookDate', 90, '보유기준일'),  // 원본 100 → UX-08
  gb.text('accountNo', 200, '계좌'),
  gb.text('itemTypeName', 150, '종목유형'),
  gb.text('itemName', 200, '종목명'),
  gb.textCenter('itemCode', 110, '종목코드'),
  gb.long('bookAmt', 120, '보유금액'),
  gb.double('bookQty', 80, '보유수량'),
  gb.textCenter('bookDays', 100, '보유기간'),
  gb.date('buyDate', 90, '최근매수일'),  // 원본 100 → UX-08
  gb.booleanYn2('checkFundHoldYn', 60, '펀드종목'),
];

interface Props {
  open: boolean;
  /** open(accountId, …) */
  accountId: number | null;
  /** open(…, stdDate, …): 기준일(YYYY-MM-DD) */
  stdDate: string;
  /** open(…, searchText, …): 검색칸에 미리 넣는 글자 */
  searchText?: string | null;
  /** callback.execute(selectList) — confirmEnd() L331-337 */
  onResult: (list: FltBook[]) => void;
  onClose: () => void;
}

export const Flt11_Lookup_BookList: React.FC<Props> = ({ open, accountId, stdDate, searchText: initialText, onResult, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FltBook[]>([]);
  const [checked, setChecked] = useState<FltBook[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L187-210: 서비스 flt.Flt11_Book.selectByText2(companyId, personId, accountId, stdDate, searchText "%…%")
  const retrieve = useCallback(async (text: string) => {
    try {
      setRows(await fltApi.searchBooksExpect(accountId, stdDate, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [accountId, stdDate]);

  // open() L99-127: 열 때 retrieve()
  useEffect(() => {
    if (!open) return;
    const text = initialText ?? '';
    setSearchText(text);
    setChecked([]);
    setRows([]);
    void retrieve(text);
  }, [open, initialText, retrieve]);

  const confirmEnd = (list: FltBook[]) => onResult(list);

  // confirmNext() L251-329: 서비스 flt.Flt01_CompanyStd.selectByDate → 의무보유기간 체크
  const confirmNext = async (list: FltBook[]) => {
    let std;
    try {
      std = await fltApi.getLockupStd(stdDate);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
      return;
    }
    // (1:보유기간 체크)
    if (std?.lockUpCode === '1') {
      if (std.lockUpDays == null) {
        message.warning('의무보유기간 기준일수가 등록되어 있지 않습니다. 내부통제 관리자에게 문의하세요');
        return;
      }
      const lockUpDays = std.lockUpDays;
      const chkCount = list.filter(b => b.lockupCheckYn && b.lockupDate != null && b.lockupDate >= b.bookDate).length;
      if (chkCount !== 0) {
        const unit = std.lockUpCalcStdCode === 'M' ? '개월' : '영업일';
        // [E6] msgBox.DialogHide [YES] (L230) → confirmNext()/confirmEnd()
        Modal.confirm({
          title: '확인',
          content: <>의무보유기간({lockUpDays}{unit})이 지나지 않은 종목을 선택하였습니다.<br />이대로 진행하시겠습니까?</>,
          width: 500,
          okText: '예',
          cancelText: '아니오',
          onOk: () => confirmEnd(list),
        });
        return;
      }
    }
    confirmEnd(list);
  };

  // [E3] oKButton[선택].Select (L146)·[E5] grid.CellDoubleClick (L159) → confirm() L212-249: 펀드 보유종목 체크 → confirmNext()
  const confirm = (picked?: FltBook) => {
    const list = picked ? (checked.includes(picked) ? checked : [picked]) : checked;
    if (list.length === 0) {
      message.warning('선택된 보유내역이 없습니다');
      return;
    }
    if (list.some(b => b.checkFundHoldYn)) {
      Modal.confirm({
        title: '확인',
        content: <>펀드에서 보유중인 종목을 선택하였습니다.<br />이대로 진행하시겠습니까?</>,
        width: 350,
        okText: '예',
        cancelText: '아니오',
        onOk: () => confirmNext(list),
      });
    } else {
      void confirmNext(list);
    }
  };

  return (
    <LookupModal
      open={open}
      title="보유내역"
      width={1310}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="select" onClick={() => confirm()}>선택</Button>
            {/* [E4] cancelButton[닫기].Select (L152) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 330, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L140) → retrieve(). [E1] searchText.KeyPress [Enter] (L132) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 150 }} placeholder="종목코드/명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<FltBook>
            rowClick
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.bookId)}
            onCheckedChange={setChecked}
            onRowDoubleClicked={e => { if (e.data) confirm(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
