/**
 * 법인인감·대표명의 선택 창 — Apr16_Tab_StampDocManager의 인감 및 대표명의 칸에서 연다 (T23)
 * AS-IS: myApp/client/vi/apr/Apr16_Lookup_StampReprCorp.java (206줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L68-99: 모달 600×500, 제목 = 구분 1이면 "법인인감 선택" 아니면 "대표명의 선택", 툴바(검색 200 · [조회]) + 체크박스 단일 그리드(구분 150 · 인감 및 대표명의 350),
 *   아래 가운데 [확인][전체][닫기]
 * 원본 SQL(selectByApplType)은 검색어·기간을 쓰지 않는다 — 입력칸은 두되 조회에는 보내지 않는다(작업방법)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { aprStampDocApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprStampDocLookup } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<AprStampDocLookup>();

interface Props {
  /** open(applType, startDate, closeDate, callback) — 값이 있으면 열린다. applType null = 전체 */
  target: { applType: string | null } | null;
  /** callback.execute(고른 행) · [전체]는 null */
  onResult: (row: AprStampDocLookup | null) => void;
  onClose: () => void;
}

export const Apr16_Lookup_StampReprCorp: React.FC<Props> = ({ target, onResult, onClose }) => {
  const gridRef = useRef<AgGridReact<AprStampDocLookup>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprStampDocLookup[]>([]);
  const [loading, setLoading] = useState(false);

  // retrieve() L149-172: apr.Apr16_StampDoc.selectByApplType(companyId, personId, applType, startDate, closeDate, searchText)
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await aprStampDocApi.searchLookup(target?.applType ?? undefined));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L68-99, open L54-66) → settings(), show() · retrieve()
  useEffect(() => {
    if (!target) return;
    setSearchText('');
    setRows([]);
    void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E5] oKButton[확인].Select (L124) → confirm() L179-187: 고른 행이 없으면 아무것도 하지 않는다
  const confirm = (row?: AprStampDocLookup) => {
    const picked = row ?? gridRef.current?.api?.getSelectedRows()[0];
    if (!picked) return;
    onResult(picked);
    onClose();
  };

  // buildGrid() L138-147
  const columnDefs = useMemo(() => [
    gb.text('applTypeName', 150, '구분'),  // L143
    gb.text('stampReprCorpName', 350, '인감 및 대표명의'),  // L144
  ], []);

  return (
    <LookupModal
      open={target != null}
      title={target?.applType === '1' ? '법인인감 선택' : '대표명의 선택'}
      width={600}
      maskClosable={false}
      destroyOnClose
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={() => confirm()}>확인</Button>
            {/* [E4] allButton[전체].Select (L118) → confirmAll() L174-177: callback.execute(null); hide() */}
            <Button type="unassign" onClick={() => { onResult(null); onClose(); }}>전체</Button>
            {/* [E6] cancelButton[닫기].Select (L130) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] searchText.KeyPress [Enter] (L103) → retrieve(), [E3] retrieveButton[조회].Select (L111) → retrieve() */}
        <SearchBar onSearch={retrieve}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E1] grid.CellDoubleClick (L92) → confirm() */}
          <SingleGrid<AprStampDocLookup>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.stampDocId)}
            loading={loading}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={e => { if (e.data) confirm(e.data); }}
          />
        </div>
      </div>
    </LookupModal>
  );
};
