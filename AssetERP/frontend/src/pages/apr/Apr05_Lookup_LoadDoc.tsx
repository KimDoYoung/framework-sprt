/**
 * 불러오기 창 (W05 ⓒ) — 이미 상신된 전자결재 문서를 골라 연관문서로 연결한다 (연관문서 창 Act80_Lookup_RelateAppr의 [불러오기])
 * AS-IS: myApp/client/vi/apr/Apr05_Lookup_LoadDoc.java (336줄) + Apr05_Grid_RelateAprList (141줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 init() L82-194: 1200×800 모달 "불러오기", 왼쪽 30% = 툴바 "문서분류 [검색 150] [찾기]" + 문서분류 트리(typeCode %),
 *   가운데 위 250 = 문서 목록 그리드, 그 아래 안내 "● 미리보기 화면과 실제 화면은 차이가 있을 수 있습니다 ●" + 미리보기(고른 문서의 내용), 푸터 [확인][닫기]
 * 조회창 규격(11a)·모달 공통 원칙(modal-style): LookupModal, 머리 아래 선·푸터 위 선, 스크롤은 트리·그리드 안쪽 하나씩
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space, Tree } from 'antd';
import type { GetRef } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { AprLoadDoc } from '@/types/apr';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';
import { HtmlView } from '@/components/form/HtmlView';
import { ancestorKeys, toTree } from '../dcr/dcr01Tree';
import { Apr05_Grid_RelateAprList } from './Apr05_Grid_RelateAprList';

interface Props {
  open: boolean;
  /** [확인]의 callback.execute(apprModel) — 고른 문서 */
  onResult: (doc: AprLoadDoc) => void;
  onClose: () => void;
}

/** 최하위(T) 노드에 문서 아이콘 (modal-TREE #8) */
const withIcons = (nodes: DataNode[], byId: Map<number, DcrClassTree>): DataNode[] =>
  nodes.map(n => {
    const row = byId.get(Number(n.key));
    return {
      ...n,
      icon: row?.typeCode === 'T' ? <FileTextOutlined style={{ color: '#8c8c8c' }} /> : undefined,
      children: n.children ? withIcons(n.children, byId) : undefined,
    };
  });

export const Apr05_Lookup_LoadDoc: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [rows, setRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [docSearch, setDocSearch] = useState('');
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [doc, setDoc] = useState<AprLoadDoc | null>(null);
  const treeRef = useRef<GetRef<typeof Tree>>(null);
  const byId = useMemo(() => new Map(rows.map(r => [r.classTreeId, r])), [rows]);
  const treeData = useMemo(() => withIcons(toTree(rows), byId), [rows, byId]);

  // [E0] 화면 열림 (생성자 → init() L82-194 끝 retrieve() L263-277): dcr.Dcr01_ClassTree.selectByCompanyIdRole(companyId, empId, orgId, typeCode %)
  //   권한(dcr03)은 열을 더할 뿐 행을 거르지 않는다(selectByParentIdRole_1Bang) → 사용 중인 전체 분류 = dcrApi.searchClassTree('%')
  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setExpanded([]);
    setDocSearch('');
    setClassTreeId(null);
    setDoc(null);
    dcrApi.searchClassTree('%')
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '매뉴조회 오류')));
  }, [open]);

  // [E1] docSearch.KeyPress [Enter] (L92), [E2] searchButton[찾기].Select (L100) → search() L305-326
  const search = () => {
    setSelected(null);
    setExpanded([]);
    if (docSearch === '') return;
    const lower = docSearch.toLowerCase();
    const matches = rows.filter(r => (r.classTreeName ?? '').toLowerCase().indexOf(lower) > -1);
    if (matches.length === 0) return;
    const keys = new Set<React.Key>();
    matches.forEach(m => ancestorKeys(rows, m.classTreeId).forEach(k => keys.add(k)));
    setExpanded([...keys]);
    setSelected(matches[matches.length - 1].classTreeId);
    setTimeout(() => treeRef.current?.scrollTo({ key: matches[0].classTreeId, align: 'auto' }));
  };

  // [E3] tree.Selection (L127) → typeCode가 T일 때만 gridPage.retrieve(classTreeModel)
  const onTreeSelect = (id: number, key: React.Key) => {
    setSelected(id);
    setExpanded(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]));
    if (byId.get(id)?.typeCode === 'T') setClassTreeId(id);
  };

  // [E5] insertButton[확인].Select (L176) → insert() L296-303: 고른 문서가 없으면 "문서를 선택해주세요", 있으면 callback.execute(apprModel) 뒤 hide()
  const insert = () => {
    if (doc == null) { message.warning('문서를 선택해주세요'); return; }
    onResult(doc);
    onClose();
  };

  return (
    <LookupModal
      open={open}
      title="불러오기"
      width={1200}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={insert}>확인</Button>
            {/* [E6] closeButton[닫기].Select (L182) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 'min(640px, calc(100vh - 220px))', minHeight: 420, display: 'flex', gap: 8 }}>
        {/* west 30%: 문서분류 트리 (getMenuTree() L196-230: 한 번 눌러도 노드가 열리고 닫힌다) */}
        <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
          <div style={{ background: '#f5f5f5', borderRadius: 4, padding: '6px 10px' }}>
            <SearchBar onSearch={search} searchText="찾기">
              <SearchBar.Field label="문서분류">
                <SearchBar.Input style={{ width: 150 }} value={docSearch} onChange={e => setDocSearch(e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {treeData.length > 0 && (
              <Tree
                ref={treeRef}
                showIcon
                height={560}
                treeData={treeData}
                expandedKeys={expanded}
                onExpand={keys => setExpanded(keys)}
                selectedKeys={selected == null ? [] : [selected]}
                onSelect={(keys, info) => onTreeSelect(keys.length ? Number(keys[0]) : Number(info.node.key), info.node.key)}
              />
            )}
          </div>
        </div>
        {/* center: 문서 목록(north 250) + 안내 + 미리보기 (setHtml() L283-286: 고른 문서의 내용) */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ height: 250 }}>
            {/* [E4] gridPage.grid.Selection (L138) → setHtml() L283-286: 고른 문서의 내용을 아래 미리보기에 */}
            <Apr05_Grid_RelateAprList classTreeId={classTreeId} onSelect={setDoc} />
          </div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>● 미리보기 화면과 실제 화면은 차이가 있을 수 있습니다 ●</div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <HtmlView html={doc?.content} height="100%" />
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
