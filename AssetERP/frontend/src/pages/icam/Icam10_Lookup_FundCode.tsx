/**
 * 펀드 조회창 (X29) — Icam10_Tab_FundMngFee의 펀드 칸에서 연다
 * AS-IS: myApp/client/vi/icam/Icam10_Lookup_FundCode.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L54-72: 모달 600×400 "펀드", 위 = 툴바(검색 200 "펀드코드/펀드명" · [조회]), 아래 = 단일 체크 그리드(펀드코드 100·펀드명 400), 아래 가운데 [확인][전체][닫기]
 * 모달 폭은 열 폭 합계 500 + 60 + 130 = 690 (12 원칙 2, 스크롤 방지 — 원본 600보다 넓힘)
 * UX보강(10): 툴바 = SearchBar(UX-01), 행 클릭 선택(UX-06), 첫 입력칸 포커스(UX-05, LookupModal)
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Spin } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamFeeFund } from '@/types/icam';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<IcamFeeFund>();
/** setChecked(SINGLE) — 체크박스 한 행. 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

interface Props {
  open: boolean;
  /** open(stdDate, callback) L74-79: 이 날짜 이후 발생보수가 있는 펀드와 이 날짜 기준 펀드명 ('yyyy-MM-dd') */
  stdDate: string;
  /** [확인]·더블클릭 = 고른 펀드, [전체] = null (callback.execute(null)) — 닫는 것은 이 창이 스스로 한다 */
  onResult: (fund: IcamFeeFund | null) => void;
  onClose: () => void;
}

export const Icam10_Lookup_FundCode: React.FC<Props> = ({ open, stdDate, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<IcamFeeFund>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IcamFeeFund[]>([]);
  const [busy, setBusy] = useState(false);

  // retrieve() L154-168: icam.Icam10_Fee.selectFundList (companyId는 서버, stdDate, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const load = async (text: string) => {
    setBusy(true);
    try {
      setRows(await icamApi.searchFundList(stdDate, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E0] 화면 열림 (생성자 L54-72) → open() L74-79: setting(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E2] grid.CellDoubleClick (L98)·[E3] confirmButton[확인].Select (L108) → callback(selectModel), hide()
  const confirm = (row?: IcamFeeFund) => {
    const target = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!target) {
      message.warning('펀드를 선택하세요');   // setting() L108-116
      return;
    }
    onResult(target);
    onClose();
  };

  // buildGrid() L143-152
  const columnDefs = useMemo(() => [
    gb.text('fundCode', 100, '펀드코드'),
    gb.text('fundName', 400, '펀드명'),
  ], []);

  return (
    <LookupModal
      open={open}
      title="펀드"
      width={690}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] selectAllButton[전체].Select (L122) → callback(null), hide() */}
            <Button type="selectNone" onClick={() => { onResult(null); onClose(); }}>전체</Button>
            {/* [E5] cancleButton[닫기].Select (L129) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L84)·[E6] retrieveButton[조회].Select (L135) → retrieve() */}
        <SearchBar onSearch={() => load(searchText)} loading={busy}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="펀드코드/펀드명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <SingleGrid<IcamFeeFund>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => p.data.feeId}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => confirm(e.data)}
          />
          {busy && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin tip="loading" />
            </div>
          )}
        </div>
      </div>
    </LookupModal>
  );
};
