/**
 * 불러오기 창의 문서 목록 (W05 ⓒ) — 고른 문서분류(최하위 T)의 문서 + 상신제목 찾기
 * AS-IS: myApp/client/vi/apr/Apr05_Grid_RelateAprList.java (141줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 툴바 "문서 : [상신제목 150] [찾기]" + 단일 선택 그리드(상태 80 · 상신제목 260 · 펀드명 260 · 등록일 100 · 등록자 100)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { aprApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprLoadDoc } from '@/types/apr';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<AprLoadDoc>();

interface Props {
  /** 고른 문서분류 ID — 바뀌면 retrieve() (null이면 비움) */
  classTreeId: number | null;
  onSelect: (row: AprLoadDoc | null) => void;
}

export const Apr05_Grid_RelateAprList: React.FC<Props> = ({ classTreeId, onSelect }) => {
  const [rows, setRows] = useState<AprLoadDoc[]>([]);
  const [docSearch, setDocSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // retrieve() L93-107: apr.Apr03_RelateFund.selectByClassTreeId(classTreeId, orgId, empId, companyId) — 끝나면 docSearch.clear()
  const retrieve = useCallback(async (id: number) => {
    setLoading(true);
    try {
      setRows(await aprApi.searchLoadDocs(id));
      setDocSearch('');
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L35-37) / 트리에서 T를 고를 때 retrieve(classTreeModel) L87-91: grid.store.clear() 뒤 위 retrieve()
  useEffect(() => {
    setRows([]);
    onSelect(null);
    if (classTreeId != null) void retrieve(classTreeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classTreeId]);

  // [E1] docSearch.KeyPress [Enter] (L48), [E2] searchButton[찾기].Select (L56) → search() L109-136: apr.Apr03_RelateFund.selectBySearch(searchText "%…%", classTreeId, orgId, empId)
  const search = async () => {
    if (classTreeId == null) { message.warning('왼쪽 항목을 선택해주세요.'); return; }
    setLoading(true);
    try {
      onSelect(null);
      setRows(await aprApi.searchLoadDocs(classTreeId, docSearch));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // buildGrid() L73-85
  const columnDefs = useMemo(() => [
    gb.textHtml('statusName', 80, '상태'),  // L78 addTextHtml
    gb.text('title', 260, '상신제목'),  // L79
    gb.text('fundName', 260, '펀드명'),  // L80
    gb.date('regDate', 100, '등록일'),  // L81
    gb.textCenter('regEmpName', 100, '등록자'),  // L82
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SearchBar onSearch={search} searchText="찾기" loading={loading}>
        <SearchBar.Field label="문서">
          <SearchBar.Input style={{ width: 150 }} placeholder="상신제목" value={docSearch} onChange={e => setDocSearch(e.target.value)} />
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<AprLoadDoc> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.apprId)} onSelect={row => onSelect(row ?? null)} />
      </div>
    </div>
  );
};
