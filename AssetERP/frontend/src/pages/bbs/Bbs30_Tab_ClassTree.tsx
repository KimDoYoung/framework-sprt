/**
 * [1379] 커뮤니티 > 05. 게시판 > 게시판 (Z13)
 * AS-IS: myApp/client/vi/bbs/Bbs30_Tab_ClassTree.java (170줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 스타일: GG (docs/page-style.md) — 단, 원본이 좌우(BorderLayout West 270 / Center)로 나눈다(GGH와 같은 좌우 구조, 위 검색줄은 없음). 견본 Est02_Tab_PfResultReport의 바깥 여백·테두리 없음 규칙을 따르되 세로 Splitter 대신 좌우 배치
 * 생성자 L46-96: 왼쪽 270 = 분류(세부항목) 그리드(머리글 숨김 — 게시물 분류명 190 굵게 · 게시물 수 60) + 아래 [게시물 항목 설정](사용자관리자만) / 새로고침 아이콘, 오른쪽 = 게시물 목록(Bbs31_Grid_Content)
 * 연결: Bbs31_Grid_Content(게시물 목록·상세·작성·댓글·첨부) · Bbs30_Lookup_ClassTree(게시물 항목 설정 — 분류/세부항목/이동/권한)
 * 12-화면우선원칙: 원본의 테두리 박스(setBorders)는 두지 않는다(선 최소화) — 영역은 여백으로 나눈다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import { Button as AntButton, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { bbsBoardApi } from '@/api/bbs';
import { schApi } from '@/api/sch';
import { errorMessage } from '@/api/client';
import { BbsClassTree } from '@/types/bbs';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { Bbs30_Lookup_ClassTree } from './Bbs30_Lookup_ClassTree';
import { Bbs31_Grid_Content } from './Bbs31_Grid_Content';

const gb = gbFor<BbsClassTree>();

export const Bbs30_Tab_ClassTree: React.FC = () => {
  const gridRef = useRef<AgGridReact<BbsClassTree>>(null);
  const [rows, setRows] = useState<BbsClassTree[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<BbsClassTree | null>(null);
  const [userManager, setUserManager] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);

  // retrieve() L129-164: [게시물 항목 설정]은 LoginUser.getIsUserManager()일 때만 보이고, 서비스 bbs.Bbs30_ClassTree.selectByRoleUserTypeCode(companyId, orgId, personId, "T") 뒤 첫 줄을 골라 오른쪽을 읽는다
  const retrieve = useCallback(async () => {
    setLoading(true);
    try {
      const list = await bbsBoardApi.searchMyClassTrees();
      setRows(list);
      setSelected(list[0] ?? null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L46-96) → settings(), retrieve()
  useEffect(() => {
    schApi.isUserManager().then(setUserManager).catch(() => setUserManager(false));
    void retrieve();
  }, [retrieve]);

  // buildGrid() L119-127: 부모 이름 0폭(숨김) · 빈 열 10 · 분류 190(굵게) · 게시물 수 60 — 머리글은 원본이 가려 둔다(cp01 MarginData -35)
  const columnDefs = useMemo(() => [
    gb.text('parentTreeNm', 0, '', { hide: true }),  // L121
    { colId: 'actionCell', headerName: '', width: 10, minWidth: 10, resizable: false },  // L122 (값 없는 빈 열)
    gb.text('classTreeNm', 190, '분류', { cellStyle: { fontWeight: 'bold' } }),  // L123 addTextBold
    gb.long('count', 60, ''),  // L124
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', gap: 12, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ width: 270, flex: 'none', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* [E2] grid.RowClick (L99) → contentList.retrieve(선택한 줄) — 선택이 바뀌면 오른쪽이 따라간다 */}
          <SingleGrid<BbsClassTree>
            gridRef={gridRef}
            rowNumber={false}
            headerHeight={0}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.classTreeId)}
            loading={loading}
            onSelect={row => { if (row) setSelected(row); }}
            // 조회가 끝나면 첫 줄을 고른다: grid.getSelectionModel().select(0, false)
            onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 32 }}>
          {/* [E3] insertButton[게시물 항목 설정].Select (L105) → Bbs30_Lookup_ClassTree.open(callback → retrieve()) */}
          {userManager ? <Button type="save" onClick={() => setSettingOpen(true)}>게시물 항목 설정</Button> : <span />}
          {/* [E1] anchor.MouseDown (L52) → retrieve() — 새로고침 아이콘 */}
          <AntButton type="text" size="small" icon={<ReloadOutlined />} title="새로고침" onClick={() => void retrieve()} />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Bbs31_Grid_Content classTree={selected} />
      </div>
      <Bbs30_Lookup_ClassTree open={settingOpen} onClose={() => { setSettingOpen(false); void retrieve(); }} />
    </div>
  );
};
