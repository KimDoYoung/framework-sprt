/**
 * 인감종류 조회창 (E16, apr 도메인) — Dcr01_Grid_DocType의 인감종류 칸 트리거에서 연다
 * AS-IS: myApp/client/vi/apr/Apr10_Lookup_DocStamp.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L81-97(flag=true): 모달 580×550 "인감종류", 위 툴바(검색어 + 200 + [검색]) + 체크박스 단일 그리드(인감 80 이미지 · 인감이름 120 · 사용용도 200 · 부서 100),
 * 아래 가운데 [확인][해당사항 없음][닫기]. flag=true는 서비스 apr.Apr10_Stamp.selectBySearchText2
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import type { AgGridReact } from 'ag-grid-react';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { aprApi } from '@/api/apr';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { AprStamp } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';

const gb = gbFor<AprStamp>();

interface Props {
  /** open(classTreeId, callback) L75 — 문서구분 ID (있으면 열린다) */
  classTreeId: number | null;
  /** callback.execute(stampModel) — [확인]·더블클릭은 고른 인감, [해당사항 없음]은 null(빈 모델) */
  onResult: (stamp: AprStamp | null) => void;
  onClose: () => void;
}

export const Apr10_Lookup_DocStamp: React.FC<Props> = ({ classTreeId, onResult, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprStamp[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<AprStamp>>(null);

  // buildGrid() L153-162: setChecked(SINGLE)
  const columnDefs = useMemo(() => [
    {  // L156 addCell(stampId_string, 80, "인감", CustomImageCell) — FileDownload?fileType=image&parentId={stampId}
      ...gb.textCenter('stampIdString', 80, '인감'),
      autoHeight: true,
      cellRenderer: (p: CustomCellRendererProps<AprStamp>) =>
        p.value ? <img alt="" style={{ height: 50, width: 50, margin: '5px 5px' }} src={fileApi.imageUrl({ parentId: Number(p.value) })} /> : null,
    },
    gb.text('stampName', 120, '인감이름'),  // L157
    gb.text('useName', 200, '사용용도'),  // L158
    gb.text('orgName', 100, '부서'),  // L159
  ], []);

  // [E1] searchText.KeyPress [Enter] (L101) · [E2] searchButton[검색].Select (L109) → retrieve() L164-175: 서비스 apr.Apr10_Stamp.selectBySearchText2(searchText, companyId, orgId, classTreeId)
  const retrieve = async (text: string) => {
    if (classTreeId == null) return;
    setLoading(true);
    try {
      setRows(await aprApi.searchDocStamps(classTreeId, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L81-97) → settings(), setLayoutData(), show() / open() L75-79 → retrieve()
  useEffect(() => {
    if (classTreeId == null) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classTreeId]);

  // [E3] confirmButton[확인].Select (L115) · [E6] grid.CellDoubleClick (L133) → confirm() L177-181: callback.execute(고른 인감); hide() (고른 것이 없으면 원본은 null을 넘긴다)
  const confirm = (stamp?: AprStamp) => {
    const picked = stamp ?? gridRef.current?.api?.getSelectedRows()[0] ?? null;
    onResult(picked);
    onClose();
  };

  return (
    <LookupModal
      open={classTreeId != null}
      title="인감종류"
      width={580}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] deleteButton[해당사항 없음].Select (L121) → delete() L183-187: callback.execute(빈 모델); hide() */}
            <Button type="unassign" onClick={() => { onResult(null); onClose(); }}>해당사항 없음</Button>
            {/* [E5] closeButton[닫기].Select (L127) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SearchBar searchText="검색" onSearch={() => retrieve(searchText)} loading={loading}>
          <SearchBar.Field label="검색어">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<AprStamp> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            getRowId={p => String(p.data.stampId)} onRowDoubleClicked={e => { if (e.data) confirm(e.data); }} />
        </div>
      </div>
    </LookupModal>
  );
};
