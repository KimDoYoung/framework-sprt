/**
 * 인감종류 조회창 (G06, apr 도메인) — Apr01_Tab_StampSeq(인감대장)의 인감선택 칸에서 연다
 * AS-IS: myApp/client/vi/apr/Apr10_Lookup_Stamp.java (251줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L79-82(flag, checkflag) · makeLayout() L118-158: 모달 830×550 "인감종류", 위 툴바(검색어 + 200 + [검색]) + 체크박스 단일 그리드(인감 80 이미지 · 인감이름 200 · 사용용도 250 · 부서 200),
 * 아래 가운데 [확인][전체 | 해당사항 없음][닫기]. flag=true는 서비스 apr.Apr10_Stamp.selectBySearchText(모두 사용 가능하거나 내 조직에 역할로 준 인감).
 * 이 ID에서 쓰는 호출은 flag=true·checkflag=true(인감대장)뿐이라 selectByOrgId(flag=false)·selectBySearchTextAdmin(openAdmin)은 다음에 쓰는 화면이 나올 때 더한다
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
  open: boolean;
  /** checkflag: true이면 deleteButton이 "전체", false이면 "해당사항 없음" (titleString L48) */
  checkflag: boolean;
  /** callback.execute(stampModel) — [확인]·더블클릭은 고른 인감, 고른 것이 없으면 원본은 null을 넘긴다 */
  onResult: (stamp: AprStamp | null) => void;
  /** delete() L231-242 — [전체 | 해당사항 없음]: checkflag이면 이름 "전체보기"인 모델, 아니면 빈 모델을 넘긴다. 여기서는 "고르지 않음" 하나로 알린다 */
  onDelete: () => void;
  onClose: () => void;
}

export const Apr10_Lookup_Stamp: React.FC<Props> = ({ open, checkflag, onResult, onDelete, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprStamp[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<AgGridReact<AprStamp>>(null);

  // buildGrid() L188-199: setChecked(SINGLE)
  const columnDefs = useMemo(() => [
    {  // L193 addCell(stampId_string, 80, "인감", CustomImageCell) — FileDownload?fileType=image&parentId={stampId}
      ...gb.textCenter('stampIdString', 80, '인감'),
      autoHeight: true,
      cellRenderer: (p: CustomCellRendererProps<AprStamp>) =>
        p.value ? <img alt="" style={{ height: 50, width: 50, margin: '5px 5px' }} src={fileApi.imageUrl({ parentId: Number(p.value) })} /> : null,
    },
    gb.text('stampName', 200, '인감이름'),  // L194
    gb.text('useName', 250, '사용용도'),  // L195
    gb.text('orgName', 200, '부서'),  // L196
  ], []);

  // [E5] searchText.KeyPress [Enter] (L162) · [E6] searchButton[검색].Select (L170) → retrieve() L202-223: 서비스 apr.Apr10_Stamp.selectBySearchText(companyId, orgId, searchText)
  const retrieve = async (text: string) => {
    setLoading(true);
    try {
      setRows(await aprApi.searchStamps(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L79-82) → open() L84-94: makeLayout(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    void retrieve('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E1] grid.CellDoubleClick (L126) · [E2] confirmButton[확인].Select (L132) → confirm() L225-229: callback.execute(고른 인감); hide()
  const confirm = (stamp?: AprStamp) => {
    const picked = stamp ?? gridRef.current?.api?.getSelectedRows()[0] ?? null;
    onResult(picked);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="인감종류"
      width={830}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E3] deleteButton.Select (L140) → delete() L231-242 (색인은 "도달 불가"로 적었지만 makeLayout L154에서 buttonBar에 붙는다) */}
            <Button type="unassign" onClick={() => { onDelete(); onClose(); }}>{checkflag ? '전체' : '해당사항 없음'}</Button>
            {/* [E4] closeButton[닫기].Select (L147) → hide() */}
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
