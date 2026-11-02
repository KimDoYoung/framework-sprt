/**
 * 활동처 선택 창 (Z05) — Mkt01_Lookup_TargetCompany의 [활동처 변경]에서 연다 (고른 담당자들을 다른 활동처로 옮긴다)
 * AS-IS: myApp/client/vi/mkt/Mkt01_Lookup_SelectCompany.java (216줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L60-136: 모달 "활동처" 650×510, 위 = 검색(활동처 200)·[조회], 아래 = 단일 체크 그리드(활동처 270·주요사항 270) + 페이징(100), 아래 가운데 [확인][취소]
 */
import React, { useEffect, useRef, useState } from 'react';
import { message, Space, Spin } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { LookupModal } from '@/components/lookup/LookupModal';
import { mktManagerApi, mktTargetCompanyApi } from '@/api/mkt';
import { errorMessage } from '@/api/client';
import { MktManager, MktTargetCompany } from '@/types/mkt';
import { Button } from '@/components/button';
import { PagingToolBar, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<MktTargetCompany>();
const LIMIT = 100;
/** setChecked(SINGLE) — 렌더마다 새 객체를 주면 선택이 풀리므로 한 번만 만든다 */
const SINGLE_CHECK = { mode: 'singleRow', checkboxes: true, enableClickSelection: true } as const;

// buildGrid() L138-148
const columnDefs = [
  gb.text('targetCompanyName', 270, '활동처'),  // L144
  gb.text('note', 270, '주요사항'),             // L145
];

interface Props {
  /** open(managerList, callback) — 옮길 담당자들. 값이 있으면 열린다 */
  managers: MktManager[] | null;
  /** companyChange() L187-207: 옮긴 뒤 callback.execute("") */
  onDone: () => void;
  onClose: () => void;
}

export const Mkt01_Lookup_SelectCompany: React.FC<Props> = ({ managers, onDone, onClose }) => {
  const open = managers != null;
  const gridRef = useRef<AgGridReact<MktTargetCompany>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<MktTargetCompany[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [afterLoad, setAfterLoad] = useState(0);
  const lastText = useRef('');

  // retrieve() L150-173: 검색어 "%…%", 구분 전체(%), 미사용 제외. 읽은 뒤 첫 행 선택
  const load = async (toPage: number, text: string) => {
    lastText.current = text;
    setBusy(true);
    try {
      const res = await mktTargetCompanyApi.search({ itemTypeCode: '%', unUseYn: true, searchText: text, offset: (toPage - 1) * LIMIT, limit: LIMIT });
      setRows(res.rows);
      setTotal(res.total);
      setPage(toPage);
      setAfterLoad(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setBusy(false);
    }
  };

  // [E5] gridToolBar.callbackOnCreate (L110) → retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    setTotal(0);
    void load(1, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (afterLoad === 0 || rows.length === 0) return;
    gridRef.current?.api?.getRowNode(String(rows[0].targetCompanyId))?.setSelected(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterLoad]);

  // [E3] oKButton[확인].Select (L86) · [E6] grid.CellDoubleClick (L124) → confirm() L175-185 → companyChange() L187-207: mkt.Mkt02_Manager.updateTargetCompanyId
  const confirm = async (row?: MktTargetCompany) => {
    const target = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!target) {
      message.warning('선택된 활동처가 없습니다');
      return;
    }
    try {
      await mktManagerApi.move(target.targetCompanyId, (managers ?? []).map(m => m.managerId));
      onClose();
      onDone();
    } catch (err) {
      message.error(errorMessage(err, '활동처 변경 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title="활동처"
      width={690}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] cancelButton[취소].Select (L92) → hide() */}
            <Button type="cancel" onClick={onClose}>취소</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] searchText.KeyPress [Enter] (L70), [E2] retrieveButton[조회].Select (L80) → retrieve() */}
        <SearchBar onSearch={() => load(1, searchText)} loading={busy}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="활동처" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
          <SingleGrid<MktTargetCompany>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.targetCompanyId)}
            rowSelection={SINGLE_CHECK}
            onRowDoubleClicked={e => void confirm(e.data)}
          />
          {busy && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin tip="loading" />
            </div>
          )}
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={busy} onChange={p => void load(p, lastText.current)} />
      </div>
    </LookupModal>
  );
};
