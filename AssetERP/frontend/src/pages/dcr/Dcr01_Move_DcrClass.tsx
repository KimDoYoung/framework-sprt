/**
 * 관리자 > 03. 문서관리 > 문서이동 — 문서분류 변경 창 (EE05)
 * AS-IS: myApp/client/vi/dcr/Dcr01_Move_DcrClass.java (280줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L57-134: 모달 "문서분류 변경" 500×700, 툴바(문서분류 · 입력 250 · [찾기]) + 트리(서비스 dcr.Dcr01_ClassTree.selectByCompanyId, typeCode %) + [변경]·[닫기]
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Space, Tree, Typography } from 'antd';
import { FolderOpenOutlined, FolderOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { LookupModal } from '@/components/lookup/LookupModal';
import { aprApi } from '@/api/apr';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { AprDoc } from '@/types/apr';
import { DcrClassTree } from '@/types/dcr';
import { Button } from '@/components/button';
import { ancestorKeys, toTree } from './dcr01Tree';

interface Props {
  /** 옮길 문서 (있으면 열린다) */
  apprList: AprDoc[] | null;
  /** 이동이 끝났을 때 callback.execute() — 화면은 다시 조회한다 */
  onMoved: () => void;
  onClose: () => void;
}

export const Dcr01_Move_DcrClass: React.FC<Props> = ({ apprList, onMoved, onClose }) => {
  const [rows, setRows] = useState<DcrClassTree[]>([]);
  const [expanded, setExpanded] = useState<React.Key[]>([]);
  const [selected, setSelected] = useState<DcrClassTree | null>(null);
  const [docSearch, setDocSearch] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);
  const open = apprList != null;
  const treeData = useMemo(() => toTree(rows), [rows]);

  // [E0] 화면 열림 (생성자 L57-134) → show(), retrieve() L206-216: dcr.Dcr01_ClassTree.selectByCompanyId (typeCode %)
  useEffect(() => {
    if (!open) return;
    setSelected(null);
    setExpanded([]);
    setDocSearch('');
    dcrApi.searchClassTree('%')
      .then(setRows)
      .catch(err => message.error(errorMessage(err, '매뉴조회 오류')));  // getServiceResult L246-249
  }, [open]);

  // [E1] docSearch.KeyPress [Enter] (L72)·[E2] searchButton[찾기].Select (L82) → search() L218-238: 선택을 풀고 모두 접은 뒤 이름에 검색어가 든 노드의 조상을 펼치고 선택한다
  const search = () => {
    setSelected(null);
    setExpanded([]);
    if (docSearch === '') return;
    const matches = rows.filter(r => r.classTreeName.indexOf(docSearch) > -1);
    if (matches.length === 0) return;
    const keys = new Set<React.Key>();
    matches.forEach(m => ancestorKeys(rows, m.classTreeId).forEach(k => keys.add(k)));
    setExpanded([...keys]);
    setSelected(matches[matches.length - 1]);
    setTimeout(() => boxRef.current?.querySelector(`[data-ckey="${matches[0].classTreeId}"]`)?.scrollIntoView({ block: 'nearest' }), 0);
  };

  // [E4] okButton[변경].Select (L115) → update() L136-153: 최하위(T)가 아니면 "최하위 문서분류를 선택해주세요", 문서마다 apr.Apr01_Appr.updateParentId → 성공하면 닫고 callback
  const update = async () => {
    if (selected == null || selected.typeCode !== 'T') {
      message.warning('최하위 문서분류를 선택해주세요');
      return;
    }
    try {
      await aprApi.moveDocClass((apprList ?? []).map(a => a.apprId), selected.classTreeId);
      onClose();  // hide()
      onMoved();  // callback.execute()
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  return (
    <LookupModal
      open={open}
      title="문서분류 변경"
      width={500}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="change" onClick={() => void update()}>변경</Button>
            {/* [E5] cancleButton[닫기].Select (L123) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 600, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
          <Typography.Text strong style={{ flex: 'none' }}>문서분류</Typography.Text>
          <Input autoFocus style={{ width: 250, flex: 'none' }} allowClear value={docSearch} onChange={e => setDocSearch(e.target.value)} onPressEnter={search} />
          <Button type="search" onClick={search}>찾기</Button>
        </div>
        <div ref={boxRef} style={{ flex: 1, minHeight: 0, overflow: 'auto', border: '1px solid #d9d9d9' }}>
          {/* [E3] tree.Selection (L102) → 고른 분류 id를 기억 */}
          {treeData.length > 0 && (
            <Tree
              treeData={treeData}
              showIcon
              blockNode
              titleRender={n => <span data-ckey={String(n.key)}>{n.title as React.ReactNode}</span>}
              icon={p => (p.isLeaf ? <UnorderedListOutlined /> : p.expanded ? <FolderOpenOutlined /> : <FolderOutlined />)}
              expandedKeys={expanded}
              onExpand={keys => setExpanded(keys)}
              selectedKeys={selected == null ? [] : [selected.classTreeId]}
              onSelect={(_keys, info) => {
                const id = Number(info.node.key);
                setSelected(rows.find(r => r.classTreeId === id) ?? null);
                setExpanded(prev => (prev.includes(info.node.key) ? prev.filter(k => k !== info.node.key) : [...prev, info.node.key]));
              }}
            />
          )}
        </div>
      </div>
    </LookupModal>
  );
};
