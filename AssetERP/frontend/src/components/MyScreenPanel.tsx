import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, InputRef, Spin, message } from 'antd';
import { SaveOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { IJsonModel } from 'flexlayout-react';
import { userPropsApi, MyScreenPreset } from '../api/userProps';
import { errorMessage } from '../api/client';

/** 단축키 1~9, 0 (재설계 03) */
const MAX_PRESETS = 10;
const MAX_NAME_LEN = 30;
const slotLabel = (i: number) => (i === 9 ? '0' : String(i + 1));

interface MyScreenPanelProps {
  /** 패널이 열려 있는지 — 열릴 때마다 서버에서 목록을 다시 읽는다 */
  open: boolean;
  /** 지금 열려 있는지 (실시간). Popover 는 닫힐 때 내용을 다시 그리지 않아 open prop 이 true 로 남을 수 있다 */
  liveOpenRef?: React.RefObject<boolean>;
  onClose: () => void;
  /** 지금 배치(Model.toJson())와 저장 이름 기본값(활성 탭 제목) */
  getCurrentLayout: () => { model: IJsonModel; defaultName: string };
  /** 고른 배치로 복원 */
  onApply: (preset: MyScreenPreset) => void;
}

/**
 * 나의 화면 저장 (TOBE 재설계 03, docs/4-재설계/03-나의-화면-저장.md).
 * TopBar 아이콘 또는 F9로 연다. 패널이 열려 있는 동안 ↑↓·Enter·1~9,0·Esc 를 패널이 직접 처리한다.
 */
export const MyScreenPanel: React.FC<MyScreenPanelProps> = ({ open, liveOpenRef, onClose, getCurrentLayout, onApply }) => {
  const [presets, setPresets] = useState<MyScreenPreset[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(0);
  /** 이름 입력 중(현재 배치 저장)이면 그 이름, 아니면 null */
  const [saveName, setSaveName] = useState<string | null>(null);
  /** 삭제 확인 중인 행 */
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  /** 이름 바꾸는 중인 행과 새 이름 */
  const [renameIndex, setRenameIndex] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const nameRef = useRef<InputRef>(null);
  const renameRef = useRef<InputRef>(null);

  // 열릴 때마다 서버에서 다시 읽는다 (사무실·집 PC 일치)
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setSaveName(null);
    setConfirmDelete(null);
    setRenameIndex(null);
    setActive(0);
    setLoading(true);
    userPropsApi
      .getMine()
      .then(res => { if (alive) setPresets(res.presets ?? []); })
      .catch(e => { if (alive) message.error(errorMessage(e, '나의 화면 목록을 불러오지 못했습니다.')); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [open]);

  useEffect(() => {
    if (saveName !== null) nameRef.current?.focus({ cursor: 'all' });
  }, [saveName !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (renameIndex !== null) renameRef.current?.focus({ cursor: 'all' });
  }, [renameIndex]);

  const persist = async (next: MyScreenPreset[], okMsg: string) => {
    setBusy(true);
    try {
      const saved = await userPropsApi.saveMyScreenLayout(next);
      setPresets(saved);
      message.success(okMsg);
      return true;
    } catch (e) {
      message.error(errorMessage(e, '저장하지 못했습니다.'));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const trimmedName = (saveName ?? '').trim();
  const sameIndex = presets.findIndex(p => p.name === trimmedName);

  const startRename = (index: number) => {
    setSaveName(null);
    setConfirmDelete(null);
    setRenameValue(presets[index]?.name ?? '');
    setRenameIndex(index);
  };

  const doRename = async () => {
    if (busy || renameIndex === null) return;
    const oldName = presets[renameIndex]?.name;
    const name = renameValue.trim();
    if (!name) { message.warning('이름을 입력하세요.'); return; }
    if (name === oldName) { setRenameIndex(null); return; }
    if (presets.some((p, i) => i !== renameIndex && p.name === name)) {
      message.warning(`같은 이름이 있습니다: ${name}`);
      return;
    }
    const next = presets.map((p, i) => (i === renameIndex ? { ...p, name } : p));
    if (await persist(next, `'${oldName}' → '${name}'(으)로 바꿨습니다.`)) setRenameIndex(null);
  };

  const startSave = () => {
    setConfirmDelete(null);
    setRenameIndex(null);
    setSaveName(getCurrentLayout().defaultName.slice(0, MAX_NAME_LEN));
  };

  const doSave = async () => {
    if (busy) return;
    if (!trimmedName) { message.warning('이름을 입력하세요.'); return; }
    if (sameIndex < 0 && presets.length >= MAX_PRESETS) {
      message.warning(`${MAX_PRESETS}개까지 저장할 수 있습니다. 하나를 지운 뒤 저장하세요.`);
      return;
    }
    const item: MyScreenPreset = { name: trimmedName, model: getCurrentLayout().model, savedAt: new Date().toISOString() };
    const next = sameIndex >= 0 ? presets.map((p, i) => (i === sameIndex ? item : p)) : [...presets, item];
    if (await persist(next, sameIndex >= 0 ? `'${trimmedName}'에 덮어썼습니다.` : `'${trimmedName}'을(를) 저장했습니다.`)) {
      setSaveName(null);
      setActive(sameIndex >= 0 ? sameIndex : next.length - 1);
    }
  };

  const doDelete = async (index: number) => {
    const name = presets[index]?.name;
    if (busy || name === undefined) return;
    if (await persist(presets.filter((_, i) => i !== index), `'${name}'을(를) 삭제했습니다.`)) {
      setConfirmDelete(null);
      setActive(a => Math.max(0, Math.min(a, presets.length - 2)));
    }
  };

  const apply = (index: number) => {
    const p = presets[index];
    if (!p) return;
    onApply(p);
    onClose();
  };

  // 패널 열린 동안의 키: capture 단계에서 먼저 받아 전역 단축키(Esc→화면번호 칸 등)보다 앞선다
  const keyRef = useRef<(e: KeyboardEvent) => void>(() => undefined);
  keyRef.current = (e: KeyboardEvent) => {
    if (liveOpenRef && !liveOpenRef.current) return; // 이미 닫혔다 — 키를 가로채지 않는다
    if (e.isComposing) return; // keyCode 229 는 보지 않는다 (useGlobalHotkeys.ts 의 composing 주석)
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (saveName !== null) setSaveName(null);
      else if (renameIndex !== null) setRenameIndex(null);
      else if (confirmDelete !== null) setConfirmDelete(null);
      else onClose();
      return;
    }
    if (saveName !== null || renameIndex !== null) return; // 이름 입력 중에는 입력칸이 키를 쓴다 (Enter 는 입력칸 onPressEnter)
    if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      if (presets.length === 0) return;
      const d = e.code === 'ArrowDown' ? 1 : -1;
      setActive(a => (a + d + presets.length) % presets.length);
      return;
    }
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      e.preventDefault();
      e.stopPropagation();
      if (confirmDelete !== null) doDelete(confirmDelete);
      else apply(active);
      return;
    }
    const m = /^(?:Digit|Numpad)([0-9])$/.exec(e.code);
    if (m && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      const n = Number(m[1]);
      apply(n === 0 ? 9 : n - 1);
    }
  };
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => keyRef.current(e);
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [open]);

  return (
    <div style={{ width: 300 }} onMouseDown={e => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontWeight: 600, fontSize: 13 }}>나의 화면</span>
        <Button type="link" size="small" icon={<SaveOutlined />} onClick={startSave} disabled={busy || saveName !== null} style={{ padding: 0 }}>
          현재 배치 저장
        </Button>
      </div>

      {saveName !== null && (
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <Input
              ref={nameRef}
              size="small"
              value={saveName}
              maxLength={MAX_NAME_LEN}
              placeholder="이름 (예: 3계좌와 종목상세)"
              onChange={e => setSaveName(e.target.value)}
              onPressEnter={doSave}
            />
            <Button size="small" type="primary" danger={sameIndex >= 0} loading={busy} onClick={doSave}>
              {sameIndex >= 0 ? '덮어쓰기' : '저장'}
            </Button>
            <Button size="small" onClick={() => setSaveName(null)}>취소</Button>
          </div>
          {sameIndex >= 0 && (
            <div style={{ marginTop: 4, fontSize: 12, color: '#d46b08' }}>
              같은 이름이 있습니다. 저장하면 {slotLabel(sameIndex)}번 '{trimmedName}'에 덮어씁니다.
            </div>
          )}
        </div>
      )}

      <Spin spinning={loading}>
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '4px 0', minHeight: 48 }}>
          {!loading && presets.length === 0 && (
            <div style={{ padding: '12px', color: '#8c8c8c', fontSize: 12 }}>
              저장한 화면이 없습니다. 탭을 열어 두고 [현재 배치 저장]을 누르세요.
            </div>
          )}
          {presets.map((p, i) => (
            <div
              key={p.name}
              onMouseEnter={() => setActive(i)}
              onClick={() => confirmDelete === null && renameIndex === null && apply(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px', cursor: 'pointer',
                background: i === active ? '#e6f4ff' : undefined,
              }}
            >
              <span style={{ width: 14, color: '#8c8c8c', fontSize: 12, textAlign: 'right' }}>{slotLabel(i)}</span>
              {renameIndex === i ? (
                <span onClick={e => e.stopPropagation()} style={{ flex: 1, display: 'flex', gap: 4 }}>
                  <Input
                    ref={renameRef}
                    size="small"
                    value={renameValue}
                    maxLength={MAX_NAME_LEN}
                    onChange={e => setRenameValue(e.target.value)}
                    onPressEnter={doRename}
                  />
                  <Button size="small" type="primary" loading={busy} onClick={doRename}>확인</Button>
                  <Button size="small" onClick={() => setRenameIndex(null)}>취소</Button>
                </span>
              ) : (
                <span style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              )}
              {renameIndex === i ? null : confirmDelete === i ? (
                <span onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                  삭제할까요?
                  <Button size="small" danger type="primary" loading={busy} onClick={() => doDelete(i)}>예</Button>
                  <Button size="small" onClick={() => setConfirmDelete(null)}>아니오</Button>
                </span>
              ) : (
                i === active && (
                  <span style={{ display: 'flex', gap: 10 }}>
                    <EditOutlined
                      title="이름 바꾸기"
                      onClick={e => { e.stopPropagation(); startRename(i); }}
                      style={{ color: '#8c8c8c', fontSize: 13 }}
                    />
                    <DeleteOutlined
                      title="삭제"
                      onClick={e => { e.stopPropagation(); setSaveName(null); setRenameIndex(null); setConfirmDelete(i); }}
                      style={{ color: '#8c8c8c', fontSize: 13 }}
                    />
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </Spin>

      <div style={{ padding: '6px 12px', borderTop: '1px solid #f0f0f0', fontSize: 11, color: '#8c8c8c' }}>
        ↑↓ 이동 · Enter 적용 · 1-9,0 바로 선택 · Esc 닫기
      </div>
    </div>
  );
};
