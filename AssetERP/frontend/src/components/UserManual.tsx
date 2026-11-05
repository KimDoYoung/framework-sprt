/**
 * 온라인 도움말 창 — TopBar 도움말 아이콘이 연다
 * AS-IS: MainFrame helpAnchor "?" L754-767 → Window.open("user_manual.jsp?personId=…&companyId=…", "helpwin")
 *   user_manual.jsp: 왼쪽 jstree(고정 "IDMS소개 > IDMS란?" + JsonProvider mode=menu 사용자 메뉴), 오른쪽 iframe = {manualBaseUrl}/{화면 클래스}.html
 *   → TOBE는 새 창 대신 모달, 사용자 메뉴는 MainFrame이 이미 읽은 메뉴(권한 기준)를 쓴다
 * A-Man(aman_opener.jsp, 원본은 아직 아무 데서도 부르지 않는다)은 서명 키가 설정되었을 때만 [A-Man 매뉴얼] 단추로 연다
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Tree, message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { helpApi, HelpConfig } from '@/api/help';
import { errorMessage } from '@/api/client';
import { Button } from '@/components/button';
import { MenuLevel_1 } from '@/types';

interface Props {
  open: boolean;
  menus: MenuLevel_1[];
  onClose: () => void;
}

/** user_manual.jsp 고정 노드 — showHtml('menu00') */
const INTRO_KEY = 'menu00';

export const UserManual: React.FC<Props> = ({ open, menus, onClose }) => {
  const [config, setConfig] = useState<HelpConfig | null>(null);
  const [page, setPage] = useState<string>(INTRO_KEY);

  useEffect(() => {
    if (!open || config) return;
    helpApi.getConfig().then(setConfig).catch(err => message.error(errorMessage(err, '도움말 설정을 읽지 못했습니다')));
  }, [open, config]);

  // makeTree(menuList): 메뉴 이름 트리, 잎(화면)의 key = 화면 클래스(className)
  const treeData = useMemo<DataNode[]>(() => [
    { key: INTRO_KEY, title: 'IDMS소개', children: [{ key: 'menu01', title: 'IDMS란?', isLeaf: true }] },
    ...menus.map(m1 => ({
      key: `m1:${m1.id}`, title: m1.title, selectable: false,
      children: m1.groups.map(g => ({
        key: `m2:${m1.id}:${g.groupCode}`, title: g.groupTitle, selectable: false,
        children: g.items.filter(i => i.classNm).map(i => ({ key: `c:${i.code}:${i.classNm}`, title: i.title, isLeaf: true })),
      })),
    })),
  ], [menus]);

  // showHtml(pageId) L108-115: {manualBaseUrl}/{pageId}.html
  const base = (config?.manualBaseUrl ?? '').replace(/\/+$/, '');
  const src = base ? `${base}/${page}.html` : undefined;

  const onSelect = (keys: React.Key[]) => {
    const key = String(keys[0] ?? '');
    if (!key) return;
    if (key === INTRO_KEY || key === 'menu01') setPage(INTRO_KEY);
    else if (key.startsWith('c:')) setPage(key.split(':').slice(2).join(':'));
  };

  const openAman = async () => {
    try {
      const aka = page === INTRO_KEY ? undefined : page;
      window.open(await helpApi.getAmanUrl(aka), 'amanwin');
    } catch (err) {
      message.error(errorMessage(err, 'A-Man 매뉴얼을 열 수 없습니다'));
    }
  };

  return (
    <Modal
      open={open}
      title="온라인 도움말"
      width={1200}
      onCancel={onClose}
      maskClosable={false}
      footer={
        <div style={{ textAlign: 'center' }}>
          {config?.amanEnabled && <Button type="view" onClick={openAman} style={{ marginRight: 8 }}>A-Man 매뉴얼</Button>}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: 8, height: 640 }}>
        <div style={{ width: 300, overflow: 'auto', border: '1px solid #d9d9d9', padding: 8 }}>
          <Tree treeData={treeData} defaultExpandedKeys={[INTRO_KEY]} onSelect={onSelect} />
        </div>
        <div style={{ flex: 1, border: '1px solid #d9d9d9' }}>
          {src && <iframe title="user-manual" src={src} style={{ width: '100%', height: '100%', border: 0 }} />}
        </div>
      </div>
    </Modal>
  );
};
