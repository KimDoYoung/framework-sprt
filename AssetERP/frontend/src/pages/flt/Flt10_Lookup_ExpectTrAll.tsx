/**
 * 사전신고내역 창 — #1142 정기보고(Flt10_Tab_RealTransaction) [사전신고 미체결 지정]이 연다 (원본 2026-11-06 새 창)
 * AS-IS: myApp/client/vi/flt/Flt10_Lookup_ExpectTrAll.java (427줄) — 함수 이름은 원본 메서드 이름 그대로
 * open(cycleType, startDate, closeDate, callback) L69-92 → open() L94-139: 1200×500 모달 "사전신고내역",
 *   왼쪽 툴바 "조회기간" 시작 ~ 종료 · "검색"(200, "계좌명/종목명") · [조회] · [삭제], 오른쪽 [미체결][미체결취소], 그리드(체크박스 다중), 아래 [닫기]
 * 목록은 매수·매도 모두(trType "%") — flt.Flt10_Tr.selectByAccountId(로그인 사용자 본인). cycleType은 원본도 쓰지 않는다(주석 처리)
 * 미체결·삭제 규칙은 매수 사전신고(#1126 Flt10_Tab_BuyReport)의 같은 이름 메서드와 같다
 * 스타일: MG (docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Modal, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { fltApi } from '@/api/flt';
import { errorMessage } from '@/api/client';
import { FltTr } from '@/types/flt';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FltTr>();
const DATE_FORMAT = 'YYYY-MM-DD';

/** buildGrid() L192-208 — setChecked(MULTI) */
const buildGrid = () => [
  gb.text('accountInfo', 250, '계좌정보'),
  gb.textCenter('trTypeName', 60, '구분'),
  gb.date('regDate', 90, '사전신고일'),
  gb.text('itemTypeName', 150, '종목유형'),
  gb.text('itemName', 250, '종목명'),
  gb.double('expectTrQty', 70, '신고수량'),
  gb.long('expectTrAmt', 130, '신고총액'),
  gb.textCenter('statusName', 65, '승인상태'),
  gb.booleanYn2('unfillYn', 60, '미체결'),
];

interface Props {
  open: boolean;
  /** open(…, startDate, closeDate, …) — 정기보고 화면의 조회기간(YYYY-MM-DD) */
  startDate: string;
  closeDate: string;
  /** [닫기] → callback.execute(null) — 부른 쪽이 다시 조회한다 */
  onClose: () => void;
}

export const Flt10_Lookup_ExpectTrAll: React.FC<Props> = ({ open, startDate: initStart, closeDate: initClose, onClose }) => {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<FltTr[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<FltTr>>(null);
  const columnDefs = useMemo(buildGrid, []);
  const selected = () => gridRef.current?.api?.getSelectedRows() ?? [];

  // retrieve() L210-227: flt.Flt10_Tr.selectByAccountId(companyId, personId, startDate, closeDate, searchText "%…%", trType "%")
  const retrieve = useCallback(async (start: Dayjs, close: Dayjs, text: string) => {
    setLoading(true);
    try {
      setRows(await fltApi.searchTrs({ trType: '%', startDate: start.format(DATE_FORMAT), closeDate: close.format(DATE_FORMAT), searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const start = dayjs(initStart);
    const close = dayjs(initClose);
    setStartDate(start);
    setCloseDate(close);
    setSearchText('');
    setRows([]);
    void retrieve(start, close, '');
  }, [open, initStart, initClose, retrieve]);

  const search = () => retrieve(startDate, closeDate, searchText);

  // [E3] deleteButton[삭제].Select (L165) → deleteRow() L229-247 → [E7] msgBox.DialogHide [YES] → delete() L249-269
  const deleteRow = () => {
    const list = selected();
    Modal.confirm({
      title: '삭제',
      content: `${list.length}건의 정보를 삭제하시겠습니까?`,
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        // 신청(10)·미신청(null)만 지울 수 있다
        if (list.some(m => m.statusCode != null && m.statusCode !== '10')) {
          message.warning('승인신청 내역이 포함되어있습니다');
          return;
        }
        if (list.length === 0) {
          message.warning('삭제할 행을 선택하세요.');
          return;
        }
        try {
          await fltApi.deleteTrs(list.map(m => m.trId));  // flt.Flt10_Tr.delete
          message.success(`${list.length}건 삭제되었습니다.`);
          await search();
        } catch (err) {
          message.warning(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E5] unFillButton[미체결].Select (L178) · [E6] unFillCancelButton[미체결취소].Select (L184) → updateUnFill("P"/"C") L350-417 → [E8] messageBox.DialogHide
  const updateUnFill = (actionType: 'P' | 'C') => {
    const list = selected();
    if (list.length === 0) {
      message.warning('선택한 사전신고 내역이 없습니다');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `${list.length}${actionType === 'P' ? '건을 미체결 처리하시겠습니까?' : '건의 미체결 내역을 취소하시겠습니까?'}`,
      width: 350,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        for (const m of list) {
          if (m.statusCode == null || m.statusCode === '10') {
            Modal.warning({
              title: '확인',
              width: 600,
              content: <>승인 전인 신고 내역이 존재합니다.<br />** 승인 전 신고 내역은 미체결 처리하지 않아도 되며, 삭제로 정리해 주세요</>,
            });
            return;
          }
          if (m.trDate != null) {
            message.warning(`'${m.itemName}' 종목은 실거래 등록이 진행된 신고내역입니다`);
            return;
          }
          if (actionType === 'P' && m.unfillYn) {
            message.warning(`'${m.itemName}'는 미체결 처리된 종목입니다`);
            return;
          }
          if (actionType === 'C' && !m.unfillYn) {
            message.warning(`'${m.itemName}' 종목은 미체결된 신고내역이 아닙니다`);
            return;
          }
        }
        try {
          await fltApi.updateTrUnfill(list.map(m => m.trId), actionType === 'P');  // flt.Flt10_Tr.updateUnFill
          message.success(actionType === 'P' ? '처리가 완료되었습니다' : '취소가 완료되었습니다');
          await search();
        } catch (err) {
          message.warning(errorMessage(err, '처리 실패'));
        }
      },
    });
  };

  return (
    <LookupModal
      open={open}
      title="사전신고내역"
      width={1200}
      closable={false}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E4] cancelButton[닫기].Select (L171) → callback.execute(null), hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 'min(400px, calc(100vh - 220px))', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          {/* [E1] searchText.KeyPress [Enter] (L151) · [E2] retrieveButton[조회].Select (L159) → retrieve() */}
          <SearchBar onSearch={search} loading={loading} extra={<Button type="delete" onClick={deleteRow}>삭제</Button>}>
            <SearchBar.Field label="조회기간">
              <Space size={4}>
                <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={DATE_FORMAT} onChange={d => d && setStartDate(d)} />
                <span>~</span>
                <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={DATE_FORMAT} onChange={d => d && setCloseDate(d)} />
              </Space>
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 200 }} placeholder="계좌명/종목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <Space>
            <Button type="close" onClick={() => updateUnFill('P')}>미체결</Button>
            <Button type="close" onClick={() => updateUnFill('C')}>미체결취소</Button>
          </Space>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<FltTr> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.trId)} loading={loading} />
        </div>
      </div>
    </LookupModal>
  );
};
