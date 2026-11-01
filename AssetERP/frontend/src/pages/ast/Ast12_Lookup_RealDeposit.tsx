/**
 * 대사작업용 예금잔고 입력 창 (W21) — Ast09_Tab_DepositBook의 [잔고입력(대사용)] 버튼이 연다
 * AS-IS: myApp/client/vi/ast/Ast12_Lookup_RealDeposit.java (200줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open L54-85: 모달 1000×600 "대사작업용 예금잔고 입력"(닫기 X 없음), 위 툴바 50(잔고일자 100 · 검색 250 "기관/계좌/통화" · [조회][최근잔고 가져오기]) + 셀 편집 그리드(단일 체크), 아래 가운데 [저장][닫기]
 * 그리드: 기준일 100 · 구분 100 · 기관 150 · 계좌 150 · 기준통화 80 · 원화 잔고 150(편집) · 외화 잔고 120(편집)
 * 03 원칙 21: 열 폭 합계 880 + 행번호·선택 60 + 130 = 1070 (AS-IS 1000보다 작게 하지 않는다)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Modal, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { astApi } from '@/api/ast';
import { AstBookReal } from '@/types/ast';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<AstBookReal>();
const FORMAT = 'YYYY-MM-DD';
/** setChecked(SINGLE) — 체크박스 단일 선택. 상수로 둬야 선택이 풀리지 않는다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true } as const;

interface Props {
  open: boolean;
  /** AS-IS open(stdDate): 잔고일자 'yyyy-MM-dd' */
  stdDate: string;
  onClose: () => void;
}

export const Ast12_Lookup_RealDeposit: React.FC<Props> = ({ open, stdDate, onClose }) => {
  const [holdDate, setHoldDate] = useState<Dayjs>(() => dayjs(stdDate));
  const [searchText, setSearchText] = useState('');
  const ref = useRef({ holdDate: stdDate, searchText: '' });
  ref.current = { holdDate: holdDate.format(FORMAT), searchText };

  const crud = useGridCrud<AstBookReal>({
    idField: 'bookRealId',
    // retrieve() L163-169: ast.Ast12_BookReal.selectByHoldDate(companyId, holdDate, searchText = %…%)
    search: useCallback(() => astApi.searchBookReals(ref.current.holdDate, ref.current.searchText), []),
    // update() L171-184: GridUpdate → ast.Ast12_BookReal.update — 성공이면 "저장이 완료되었습니다."
    save: useCallback((rows: AstBookReal[]) => astApi.saveBookReals(ref.current.holdDate, rows), []),
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),
  });

  // 열림 (open L54-85) → settings(stdDate), retrieve()
  useEffect(() => {
    if (!open) return;
    setHoldDate(dayjs(stdDate));
    setSearchText('');
    ref.current = { holdDate: stdDate, searchText: '' };
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] getRcntAmtButton[최근잔고 가져오기].Select (L109) → setRealAmt() L186-191: 모든 행의 원화·외화 잔고를 최근 입력일의 값(rcnt)으로 바꾼다(변경으로 표시)
  const setRealAmt = () => {
    crud.rows.forEach(r => crud.updateRow(r.bookRealId, { realAmt: r.rcntAmt, realForAmt: r.rcntForAmt }));
  };

  // [E5] closeButton[닫기].Select (L121): 고친 것이 있으면 확인(440) "미저장이 데이터가 존재합니다. 화면을 닫으시겠습니까?" → [E6] msgBox.DialogHide [YES] (L127) → hide()
  const close = () => {
    if (!crud.hasChanges()) { onClose(); return; }
    Modal.confirm({
      title: '확인', content: '미저장이 데이터가 존재합니다. 화면을 닫으시겠습니까?', okText: '예', cancelText: '아니오', width: 440,
      onOk: () => onClose(),
    });
  };

  // buildGrid() — 원화·외화 잔고만 편집
  const columnDefs = useMemo(() => [
    gb.date('holdDate', 100, '기준일'),
    gb.text('itemSClassName', 100, '구분'),
    gb.text('corpName', 150, '기관'),
    gb.text('astClassTreeName', 150, '계좌'),
    gb.textCenter('curCode', 80, '기준통화'),
    gb.long('realAmt', 150, '원화 잔고', { editor: 'number' }),
    gb.double('realForAmt', 120, '외화 잔고', { editor: 'number' }),
  ], []);

  return (
    <LookupModal open={open} title="대사작업용 예금잔고 입력" width={1070} style={{ top: 20 }} closable={false} maskClosable={false} keyboard={false} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E4] updateButton[저장].Select (L115) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={async () => { await crud.saveRows(); }}>저장</Button>
            <Button type="close" onClick={close}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 'calc(100vh - 260px)', minHeight: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L103) → retrieve(), [E1] searchText.KeyPress [Enter] (L94) → retrieve() */}
        <SearchBar onSearch={() => crud.retrieve()} extra={<Button type="download" onClick={setRealAmt}>최근잔고 가져오기</Button>}>
          <SearchBar.Field label="잔고일자">
            <DatePicker style={{ width: 120 }} allowClear={false} value={holdDate} onChange={d => d && setHoldDate(d)} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 250 }} placeholder="기관/계좌/통화" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<AstBookReal> crud={crud} columnDefs={columnDefs} rowSelection={SINGLE_CHECK} />
        </div>
      </div>
    </LookupModal>
  );
};
