/**
 * 사내 조직도 (팝업) — Org01_Tab_OrgCode [조직도보기]가 연다
 * AS-IS: myApp/client/vi/org/Org02_View_Chart.java (iframe template/orgchart.jsp + /JsonProvider mode=orgchart + jQuery jOrgChart)
 * - 생성자(companyId, baseYmd) = full "0": 조직명만 (JsonOrgChart.justOrgName → org01_code.selectByParentId_1Bang + TreeUtil.makeOrgTree)
 *   → TOBE는 같은 SQL을 옮긴 GET /api/v1/org/org-codes(searchOrgCodes, 전위 순서 + depth)를 그대로 쓴다
 * - full "1"(조직장·사진, emp00_trans_info.selectForOrgChart)은 Emp00_Tab_OrgPerson 버튼에서만 쓰는데 원본에서 툴바에 넣지 않아(L102 주석) 만들지 않는다
 * - init() L85-148: 1100×700, 머리말 "사내 조직도", 아래 [작게][초기화][크게][닫기]. 확대·축소는 orgchart.jsp viewInc/viewDec/viewReset (zoom ±0.1)
 * - orgchart.jsp makeChartHtml: 노드 = 조직명(p.tit), 단계(level)마다 윗선 색 blue·green·pink·yellow (org-custom.css)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Space, Spin, message } from 'antd';
import { orgCodeApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { OrgCode } from '@/types/org';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';

interface Props {
  open: boolean;
  /** 기준일 YYYY-MM-DD (AS-IS baseYmd) */
  baseDate: string;
  onClose: () => void;
}

interface OrgNode { org: OrgCode; children: OrgNode[]; level: number }

/** TreeUtil.makeOrgTree — 전위 순서(depth 1 2 3 3 2 …)를 부모·자식으로 */
const makeOrgTree = (rows: OrgCode[]): OrgNode[] => {
  const roots: OrgNode[] = [];
  const stack: OrgNode[] = [];
  for (const org of rows) {
    const level = org.depth ?? 1;
    const node: OrgNode = { org, children: [], level };
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
    if (stack.length) stack[stack.length - 1].children.push(node);
    else roots.push(node);
    stack.push(node);
  }
  return roots;
};

/** org-custom.css .node.blue/green/pink/yellow border-top-color */
const LEVEL_COLORS = ['#51a6d8', '#aecc50', '#FF9999', '#ffff00'];

const CSS = `
.org02-chart { display: inline-block; min-width: 100%; text-align: center; padding: 16px; box-sizing: border-box; }
.org02-chart ul { display: flex; justify-content: center; padding-top: 20px; position: relative; margin: 0; padding-left: 0; }
.org02-chart li { list-style: none; position: relative; padding: 20px 6px 0 6px; text-align: center; }
.org02-chart li::before, .org02-chart li::after { content: ''; position: absolute; top: 0; right: 50%; width: 50%; height: 20px; border-top: 1px solid #999; }
.org02-chart li::after { right: auto; left: 50%; border-left: 1px solid #999; }
.org02-chart li:only-child::before, .org02-chart li:only-child::after { display: none; }
.org02-chart li:only-child { padding-top: 0; }
.org02-chart li:first-child::before, .org02-chart li:last-child::after { border: 0 none; }
.org02-chart li:last-child::before { border-right: 1px solid #999; }
.org02-chart ul ul::before { content: ''; position: absolute; top: 0; left: 50%; height: 20px; border-left: 1px solid #999; }
.org02-chart > ul { padding-top: 0; }
.org02-node { display: inline-block; min-width: 90px; max-width: 160px; padding: 8px 10px; background: #fff; border: 1px solid #d9d9d9;
  border-top-width: 4px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); color: #262d3f; font-weight: 600; font-size: 12px; word-break: keep-all; }
`;

const ChartNode: React.FC<{ node: OrgNode }> = ({ node }) => (
  <li>
    <div className="org02-node" style={{ borderTopColor: LEVEL_COLORS[node.level % LEVEL_COLORS.length] }}>{node.org.korNm}</div>
    {node.children.length > 0 && <ul>{node.children.map(c => <ChartNode key={c.org.codeId} node={c} />)}</ul>}
  </li>
);

export const Org02_View_Chart: React.FC<Props> = ({ open, baseDate, onClose }) => {
  const [rows, setRows] = useState<OrgCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setZoom(1);
    setLoading(true);
    orgCodeApi.searchOrgCodes(baseDate)
      .then(list => { if (alive) setRows(list); })
      .catch(err => { if (alive) { setRows([]); message.error(errorMessage(err, '조직도 조회 실패')); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [open, baseDate]);

  // orgchart.jsp ajaxCall: 첫 최상위 조직(json[0]) 하나만 그린다
  const root = useMemo(() => makeOrgTree(rows)[0], [rows]);

  return (
    <LookupModal
      open={open}
      title="사내 조직도"
      width={1100}
      onCancel={onClose}
      maskClosable={false}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            {/* zoomDec() / zoomReset() / zoomInc() — orgchart.jsp viewDec·viewReset·viewInc */}
            <Button onClick={() => setZoom(z => Math.max(0.1, +(z - 0.1).toFixed(1)))}>작게</Button>
            <Button type="reset" onClick={() => setZoom(1)}>초기화</Button>
            <Button onClick={() => setZoom(z => +(z + 0.1).toFixed(1))}>크게</Button>
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <style>{CSS}</style>
      <div style={{ height: 600, overflow: 'auto', border: '1px solid #d9d9d9', background: '#fff' }}>
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}><Spin /></div>
        ) : root ? (
          <div className="org02-chart" style={{ zoom }}>
            <ul><ChartNode node={root} /></ul>
          </div>
        ) : null}
      </div>
    </LookupModal>
  );
};
