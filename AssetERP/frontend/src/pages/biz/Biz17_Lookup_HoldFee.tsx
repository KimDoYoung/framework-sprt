/**
 * 펀드 조회창 (EE20) — Biz17_TabPage_DualManageFund의 펀드 칸(조회창 트리거)이 연다 (고른 계약사가 운용하는 보수원장 펀드)
 * AS-IS: myApp/client/vi/biz/Biz17_Lookup_HoldFee.java (186줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(contCorpId, stdDate, callback) L55-63: 모달 "펀드" 위 [기준일자][검색(펀드코드/펀드명)][조회] + 그리드(펀드코드 150 · 펀드명 480), [확인][닫기]
 * 기준일자는 열 때 오늘 전날이다(setting L84-90)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { bizContCorpApi } from '@/api/bizCont';
import { errorMessage } from '@/api/client';
import { BizContHoldFee } from '@/types/bizCont';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<BizContHoldFee>();
/** 단일 선택 — 행 클릭으로 고른다(UX-06). 상수로 넘긴다 */
const SINGLE_CLICK = { mode: 'singleRow', checkboxes: false, enableClickSelection: true } as const;

interface Props {
  /** open(contCorpId, …) — 값이 있으면 열린다 */
  contCorpId: number | null;
  /** callback.execute(result): [확인]·더블클릭이면 고른 펀드 (닫는 것은 이 창이 스스로) */
  onResult: (fund: BizContHoldFee) => void;
  onClose: () => void;
}

export const Biz17_Lookup_HoldFee: React.FC<Props> = ({ contCorpId, onResult, onClose }) => {
  const [stdDate, setStdDate] = useState<Dayjs>(dayjs().subtract(1, 'day'));
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BizContHoldFee[]>([]);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<BizContHoldFee | null>(null);

  // retrieve() L150-165: 서비스 ast.Ast30_BookFundFee.selectByContCorpId(companyId, holdDate, contCorpId, searchText "%…%")
  const retrieve = useCallback(async (date: Dayjs, text: string) => {
    if (contCorpId == null) return;
    setLoading(true);
    try {
      setRows(await bizContCorpApi.searchHoldFees(contCorpId, date.format('YYYY-MM-DD'), text));
      setPicked(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [contCorpId]);

  // [E0] 화면 열림 (생성자 L65-82) → show() · open() L55-63 → setting(), retrieve() — 기준일자는 오늘 전날, 검색칸은 비운다
  useEffect(() => {
    if (contCorpId == null) return;
    const d = dayjs().subtract(1, 'day');
    setStdDate(d);
    setSearchText('');
    void retrieve(d, '');
  }, [contCorpId, retrieve]);

  // select() L167-176: 고른 행이 없으면 "선택된 내역이 없습니다"
  const select = (row?: BizContHoldFee) => {
    const r = row ?? picked;
    if (!r) {
      message.warning('선택된 내역이 없습니다');
      return;
    }
    onResult(r);
    onClose();
  };

  const columnDefs = useMemo(() => [
    gb.textCenter('fundCd', 150, '펀드코드'),  // L144
    gb.text('fundNm', 480, '펀드명'),  // L145
  ], []);

  return (
    <LookupModal
      open={contCorpId != null}
      title="펀드"
      width={790}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{
        header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 },
        footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 },
      }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] selectButton[확인].Select (L120) → select() */}
            <Button type="save" onClick={() => select()}>확인</Button>
            {/* [E4] cancleButton[닫기].Select (L126) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L94)·[E5] retrieveButton[조회].Select (L132) → retrieve() */}
        <SearchBar onSearch={() => retrieve(stdDate, searchText)} loading={loading}>
          <SearchBar.Field label="기준일자">
            <DatePicker style={{ width: 120 }} allowClear={false} value={stdDate} onChange={d => d && setStdDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="펀드코드/펀드명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.RowDoubleClick (L104) → select() */}
          <SingleGrid<BizContHoldFee>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => p.data.fundCd}
            loading={loading}
            rowSelection={SINGLE_CLICK}
            onRowClicked={e => setPicked(e.data ?? null)}
            onRowDoubleClicked={e => select(e.data)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
