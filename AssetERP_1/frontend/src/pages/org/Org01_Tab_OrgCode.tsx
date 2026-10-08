/**
 * [4110] 경영관리 > 01. 조직 및 사원관리 > 조직정보 등록, [202504242267306] 기본정보 > 기본정보 > 조직정보 등록 (C02)
 * AS-IS: myApp/client/vi/org/Org01_Tab_OrgCode.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, message, Space, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { CustomCellRendererProps } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { orgCodeApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { OrgCode } from '@/types/org';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { useTreeGrid } from '@/hooks/useTreeGrid';
import { Org01_Edit_OrgCode, OrgEditTarget } from './Org01_Edit_OrgCode';
import { Org02_Lookup_OrgInfo, OrgLookupTarget } from './Org02_Lookup_OrgInfo';

const gb = gbFor<OrgCode>();

export const Org01_Tab_OrgCode: React.FC = () => {
  const tree = useTreeGrid<OrgCode>({ idField: 'codeId', parentField: 'parentCodeId', depthField: 'depth' });
  const [baseDate, setBaseDate] = useState<Dayjs | null>(dayjs()); // 생성자 L69: 기준일 = 오늘
  const [editTarget, setEditTarget] = useState<OrgEditTarget | null>(null);
  const [lookupTarget, setLookupTarget] = useState<OrgLookupTarget | null>(null);
  /** updatedModel: 등록·삭제 뒤 다시 조회하면 펼치고 선택할 조직 */
  const updatedModel = useRef<number | null>(null);
  const loaded = useRef(false);
  const base = () => (baseDate ?? dayjs()).format('YYYY-MM-DD');

  const parentOf = useCallback((row: OrgCode) => tree.rows.find(r => r.codeId === tree.ancestors(row.codeId)[0]) ?? null, [tree]);

  // editOrgCode() L228-239: 선택 행과 트리 부모로 이력 조회창 → 콜백에서 다시 조회
  const editOrgCode = (editModel: OrgCode) => {
    tree.gridRef.current?.api?.getRowNode(String(editModel.codeId))?.setSelected(true, true);
    setLookupTarget({ editModel, parentModel: parentOf(editModel), baseDate: base() });
  };

  // buildTreeGrid() L135-159 — getTreeGrid(1): 트리 컬럼 = 조직명, 행번호 숨김(setRowNumHidden)
  const columnDefs = useMemo(() => [
    tree.treeCol('korNm', 450, '조직명'), // L147
    gb.text('orgCd', 100, '조직코드'), // L148
    gb.text('levelNm', 100, '조직구분'), // L149
    gb.text('orgHeadList', 120, '조직 장'), // L150
    gb.text('sortOrder', 100, '조회순서'), // L151
    gb.date('modDate', 100, '최근변경일'), // L152
    { // L153 addCell(actionCell, 80, "수정", ImageCell("TreeEdit")) → editOrgCode()
      colId: 'actionCell', headerName: '수정', width: 80, sortable: false,
      cellStyle: { textAlign: 'center' },
      cellRenderer: (p: CustomCellRendererProps<OrgCode>) => p.data ? (
        <EditOutlined style={{ cursor: 'pointer', color: '#1677ff' }} onClick={e => { e.stopPropagation(); editOrgCode(p.data!); }} />
      ) : null,
    },
    gb.text('modReason', 300, '변경사유'), // L154
    gb.date('openDate', 100, '개설일'), // L155
    gb.date('closeDate', 100, '폐쇄일'), // L156
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [tree.treeCol, tree.rows]);

  // [E1] retrieveButton[조회].Select (L76) → retrieve() L161-167: 서비스 org.Org01_Code.selectByCompanyId(companyId, baseDate)
  const retrieve = useCallback(async () => {
    try {
      tree.setRows(await orgCodeApi.searchOrgCodes(base()));
      loaded.current = true;
    } catch (err) {
      tree.setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseDate, tree.setRows]);

  // getServiceResult() L242-268: 최상위 조직을 펼치고, updatedModel이 있으면 펼치고 선택
  useEffect(() => {
    if (!loaded.current) return;
    loaded.current = false;
    const rows = tree.rows;
    const roots = new Set(rows.filter(r => !tree.ancestors(r.codeId).length).map(r => r.codeId));
    const open = rows.filter(r => roots.has(r.parentCodeId)).map(r => r.codeId); // 자식의 조상 = 최상위
    const upd = updatedModel.current;
    updatedModel.current = null;
    if (upd != null) {
      open.push(upd, ...rows.filter(r => r.parentCodeId === upd).map(r => r.codeId));
    }
    tree.expandAncestors(open);
    if (upd != null) {
      setTimeout(() => {
        const node = tree.gridRef.current?.api?.getRowNode(String(upd));
        node?.setSelected(true, true);
        if (node) tree.gridRef.current?.api?.ensureNodeVisible(node);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.rows]);

  // [E0] 화면 열림 (생성자 L68-123) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E2] addSubMenu[하위조직등록].Select (L93) → insertChild() L215-226 → insertOrgCode(parentModel) L181-213
  const insertChild = () => {
    const parentModel = tree.gridRef.current?.api?.getSelectedRows()[0];
    if (!parentModel) {
      message.warning('먼저 상위 조직을 선택해주세요');
      return;
    }
    // 상위조직ID 설정. codeId = infoId 채번(DBUtil.setSeq)은 서버가 등록할 때 한다
    setEditTarget({ parentModel, editModel: { parentCodeId: parentModel.codeId }, baseDate: base(), actionCode: 'insertData' });
  };

  // [E3 생략] viewOrgChart[조직도보기].Select (L103) → viewOrgChart() L125-133: Org02_View_Chart(orgchart.jsp + JsonProvider orgchart + jOrgChart)는
  // 범위 밖 컴포넌트 — 별도 ID로 변환한다(C02-작업기록 의존)
  const viewOrgChart = () => message.info('조직도보기(Org02_View_Chart)는 아직 변환 전입니다.');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, background: '#fff' }}>
      <Space wrap>
        <Typography.Text strong>기준일</Typography.Text>
        <DatePicker style={{ width: 120 }} value={baseDate} onChange={setBaseDate} format="YYYY-MM-DD" />
        <Button type="search" onClick={retrieve}>조회</Button>
        <Button type="register" onClick={insertChild}>하위조직등록</Button>
        <Button type="org" onClick={viewOrgChart}>조직도보기</Button>
      </Space>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<OrgCode>
          gridRef={tree.gridRef}
          {...tree.gridProps}
          columnDefs={columnDefs}
          rowNumber={false}
          sortable={false}
        />
      </div>
      <Org01_Edit_OrgCode
        target={editTarget}
        onClose={() => setEditTarget(null)}
        // insertOrgCode 콜백: updatedModel = result → retrieve()
        onSaved={model => { updatedModel.current = model?.codeId ?? null; retrieve(); }}
      />
      <Org02_Lookup_OrgInfo target={lookupTarget} onClose={() => setLookupTarget(null)} onChanged={retrieve} />
    </div>
  );
};
