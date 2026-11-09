/**
 * 관리자 > 02. 문서권한관리 > 조직별 문서분류 맵핑 — 왼쪽 조직 트리 + 오른쪽 문서분류 권한 트리 (EE07, #1074)
 * 스타일: TG
 * AS-IS: myApp/client/vi/dcr/Dcr03_Tab_OrgAuth.java (217줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L81-141: west(20%, 분할선, 최대 1000, 여백 20/0/20/20) = 테두리 박스(툴바 50 오른쪽 정렬: [권한복사][조회] / 조직 트리 흰 배경),
 *   center = 테두리 박스(Dcr03_TabPage_OrgAuth, 여백 20/20/20/0). 조직 트리는 한 번 눌러도 열리지 않는다(기본 GXT Tree: 더블클릭·화살표로 연다)
 * 원본의 TabPanel(문서권한/펀드권한)은 만들어 두기만 하고 화면에 붙이지 않는다(L108-110) → 만들지 않는다
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message, Splitter, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import dayjs from 'dayjs';
import { dcrOrgAuthApi } from '@/api/dcr';
import { orgCodeApi } from '@/api/org';
import { errorMessage } from '@/api/client';
import { OrgCode } from '@/types/org';
import { OrgInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { Org00_Lookup_SelectMulti } from '@/components/lookup/Org00_Lookup_SelectMulti';
import { Dcr03_TabPage_OrgAuth } from './Dcr03_TabPage_OrgAuth';

/** getServiceResult() L198-213 + addChild(): 조직 목록 → 중첩 트리 (이름 = 조직정보의 한글명) */
const toOrgTree = (rows: OrgCode[]): DataNode[] => {
  const ids = new Set(rows.map(r => r.codeId));
  const kids = new Map<number, OrgCode[]>();
  rows.forEach(r => {
    const p = ids.has(r.parentCodeId) ? r.parentCodeId : 0;
    if (!kids.has(p)) kids.set(p, []);
    kids.get(p)!.push(r);
  });
  const build = (parent: number): DataNode[] => (kids.get(parent) ?? []).map(r => ({ key: r.codeId, title: r.korNm ?? '', children: build(r.codeId) }));
  return build(0);
};

export const Dcr03_Tab_OrgAuth: React.FC = () => {
  const [rows, setRows] = useState<OrgCode[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [orgOpen, setOrgOpen] = useState(false);
  const treeData = useMemo(() => toOrgTree(rows), [rows]);

  // [E0] 화면 열림 (생성자 L81-141) → retrieve() L144-150: org.Org01_Code.selectByCompanyId (companyId는 서버가 세션에서, baseDate 오늘)
  // [E1] retrieveButton[조회].Select (L82) → retrieve()
  //   getServiceResult() L198-213: 트리를 다시 채우고 최상위 노드만 펼친다. 선택은 사라져 오른쪽 트리도 비워진다
  const retrieve = async () => {
    try {
      const list = await orgCodeApi.searchOrgCodes(dayjs().format('YYYY-MM-DD'));
      setRows(list);
      setSelected(null);
      const top = new Set(list.map(r => r.codeId));
      setExpanded(list.filter(r => !top.has(r.parentCodeId) && list.some(c => c.parentCodeId === r.codeId)).map(r => r.codeId));
    } catch (err) {
      message.error(errorMessage(err, '매뉴조회 오류'));
    }
  };
  useEffect(() => { void retrieve(); }, []);

  // [E2] copyButton[권한복사].Select (L88) → copy() L152-184: 고른 조직(출발)의 문서권한을 Org00_Lookup_SelectMulti(오늘)로 고른 조직(도착)마다 복사 → retrieve()
  //   조직을 안 고르고 누르면 원본은 NPE로 아무 일도 안 일어난다 → 안내 메시지를 보인다
  const copy = () => {
    if (selected == null) {
      message.warning('조직을 선택해주세요.');
      return;
    }
    setOrgOpen(true);
  };
  const copyTo = async (list: OrgInfo[]) => {
    const targets = list.map(o => o.orgCodeId).filter((id): id is number => id != null);
    if (targets.length === 0) {
      message.info('선택된 조직이 없습니다.');  // L180 SimpleMessage
      return;
    }
    try {
      await dcrOrgAuthApi.copy(selected!, targets);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '권한복사 실패'));
    }
  };

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <Splitter style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="20%" min={200} max={1000}>
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', border: '1px solid #d9d9d9' }}>
            <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '0 8px', flex: 'none', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
              <Button type="change" onClick={copy}>권한복사</Button>
              <Button type="search" onClick={retrieve}>조회</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: '#fff', marginTop: 8 }}>
              {/* [E3] orgCodeTree.SelectionChanged [선택>0] (L111) → orgAuthPage.retrieve(orgCodeId), 선택이 없으면 treeClear() */}
              {treeData.length > 0 && (
                <Tree
                  treeData={treeData}
                  blockNode
                  expandedKeys={expanded}
                  onExpand={keys => setExpanded(keys)}
                  onDoubleClick={(_e, node) => setExpanded(prev => (prev.includes(node.key) ? prev.filter(k => k !== node.key) : [...prev, node.key]))}
                  selectedKeys={selected == null ? [] : [selected]}
                  onSelect={keys => setSelected(keys.length > 0 ? Number(keys[0]) : null)}
                />
              )}
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9' }}>
            <Dcr03_TabPage_OrgAuth orgCodeId={selected} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <Org00_Lookup_SelectMulti
        baseDate={orgOpen ? dayjs().format('YYYY-MM-DD') : undefined}
        onSelect={copyTo}
        onClose={() => setOrgOpen(false)}
      />
    </div>
  );
};
