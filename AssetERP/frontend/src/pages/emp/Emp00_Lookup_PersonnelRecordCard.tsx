/**
 * 인사기록카드 창 (EE71) — 사원정보(Emp00_Tab_TransInfo)의 [인사기록카드]가 연다
 * AS-IS: myApp/client/vi/emp/Emp00_Lookup_PersonnelRecordCard.java (264줄) — 줄 번호는 원본(IDMS-IC)
 * 생성자 L58-136: 1300×800 모달, 머리말 "인사기록카드", [조직/직책/사번/성명][조회][다운로드] + 왼쪽 체크 다중 그리드 580 + 가운데 RD 뷰어(Emp00_Rd_PersonnelRecordCard) + [닫기]
 * [E5] grid.CellClick (L101) → 1건 선택이면 retrieveEditPage() L173 (sys.Sys99_Print.insertRdPersonnelRecordCard → RD 보기), 아니면 rdForm.clear()
 * [E4] downloadButton[다운로드] (L94) → createRdExcel() L194 (같은 서비스 → RD 내려받기 pdf, 파일명 "인사기록카드(성명)" / 여러 명이면 "인사기록카드")
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Space, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { empApi } from '@/api/emp';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { rdDownload } from '@/utils/rdDownload';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<TransInfo>();

/** AS-IS buildGrid() L138-150 (setChecked MULTI) */
const columns = [
  gb.text('parentFullNm', 200, '조직'),  // L144
  gb.text('titleNm', 120, '직책'),        // L145
  gb.text('empNo', 80, '사번'),           // L146
  gb.text('korNm', 100, '성명'),          // L147
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Emp00_Lookup_PersonnelRecordCard: React.FC<Props> = ({ open, onClose }) => {
  const gridRef = useRef<AgGridReact<TransInfo>>(null);
  const [rows, setRows] = useState<TransInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // retrieve() L152-171 — emp.Emp00_TransInfo.selectByText(searchText, 오늘, transCode "100", isSeparateAddTitle false, orgCodeId null)
  const retrieve = useCallback(async (search: string) => {
    setLoading(true);
    try {
      setRows(await empApi.searchTransInfos(dayjs().format('YYYY-MM-DD'), search, '100', false));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // 열 때마다 처음부터 — 생성자에는 조회가 없다(열면 빈 그리드). 입력칸 비우고 RD 지움
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    setRdUrl(null);
  }, [open]);

  // getSelectList() L252-258
  const selectedList = () => gridRef.current?.api.getSelectedRows() ?? [];

  // [E5] grid.CellClick (L101) → 1건이면 retrieveEditPage() L173-192, 아니면 rdForm.clear()
  const onSelectionChanged = async () => {
    const list = selectedList();
    if (list.length !== 1) { setRdUrl(null); return; }
    try {
      const groupId = await empApi.rdPrintPersonnelRecordCard(list.map(r => r.personId));
      const res = await rdApi.buildUrl({
        kind: 'viewer',
        mrd: 'Emp00_Rd_PersonnelRecordCard',
        options: '/rexportopt [7] /rimageopt resize[100]',
        rv: { rdGroupId: groupId },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E4] downloadButton[다운로드].Select (L94) → createRdExcel() L194-250
  const createRdExcel = async () => {
    const list = selectedList();
    if (list.length === 0) { message.warning('선택된 사원이 없습니다'); return; }
    setLoading(true);
    try {
      const fileName = list.length === 1 ? `인사기록카드(${list[0].korNm})` : '인사기록카드';
      const groupId = await empApi.rdPrintPersonnelRecordCard(list.map(r => r.personId));
      const res = await rdApi.buildUrl({
        kind: 'download',
        mrd: 'Emp00_Rd_PersonnelRecordCard',
        options: '/rxlsopt [100]',
        exportType: 'pdf',
        fileName: `${fileName}.pdf`,
        rv: { rdGroupId: groupId },
      });
      await rdDownload(res);
    } catch (err) {
      message.error(errorMessage(err, '다운로드 실패'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LookupModal
      open={open}
      title="인사기록카드"
      width={1300}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* [E3] closeButton[닫기].Select (L88) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L82) → retrieve(). [E1] searchText.KeyPress [Enter] (L74) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)} loading={loading}
          extra={<Button type="download" onClick={createRdExcel}>다운로드</Button>}>
          <SearchBar.Field label="">
            <SearchBar.Input style={{ width: 200 }} placeholder="조직/직책/사번/성명" value={searchText}
              onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 8 }}>
          <div style={{ width: 580, flexShrink: 0 }}>
            <MultiGrid<TransInfo>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columns}
              rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: false, enableClickSelection: true }}
              getRowId={p => String(p.data.personId)}
              onSelectionChanged={onSelectionChanged}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0, border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
            {rdUrl && <iframe title="인사기록카드" src={rdUrl} style={{ width: '100%', height: '100%', border: 0 }} />}
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
