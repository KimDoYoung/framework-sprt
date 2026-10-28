/**
 * 문서분류지정 창 (B15) — AS-IS: myApp/client/vi/dcr/Dcr30_Lookup_Link.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L60 / open(linkCodeList, callback) L69: 모달 "문서분류지정"(닫기 X 없음, 크기 고정). 열 때 insertCheck() 뒤 retrieve().
 *   linkCodeList 없음 = 1200×600, 툴바(검색 300 · [조회] · 안내 라벨) 보임, 로그인 회사의 Link 전체.
 *   linkCodeList 있음 = 툴바 감춤, Link 코드/코드그룹으로 줄인 목록. "D01"은 데이터연결(양식) 열을 감추고 1100×300, "LinkCode0001"은 1200×500, 그 밖은 1200×300.
 * 그리드 buildGrid() L145-213 (setChecked MULTI): Link명 350 · 문서분류명 500(조회창 트리거) · 데이터연결(양식) 95(아이콘) · 비고 60(아이콘) · 구분 60 · 코드 60.
 * 푸터: [저장] [닫기](닫기 = callback 후 hide). 저장은 바뀐 행만 보낸다(서버가 updateDcrAuth까지).
 * 쓰는 곳: Emp31_Tab_Director("LinkCode0005")·Fnd30_Tab_Opr("A26")·Fnd30_Tab_DemandOpr·Apr01_Tab_BizPriorApproval·Sch04_Tab_DailyCheckList 등.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button as AntButton, message, Space, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { dcrApi } from '@/api/dcr';
import { comApi } from '@/api/com';
import { errorMessage } from '@/api/client';
import { DcrLink } from '@/types/dcr';
import { FormMapping } from '@/types/com';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Com10_Lookup_CommonMapping } from '@/pages/com/Com10_Lookup_CommonMapping';
import { Dcr30_Lookup_LinkNote } from '@/pages/dcr/Dcr30_Lookup_LinkNote';

const gb = gbFor<DcrLink>();

interface Props {
  /** true인 동안 열려 있다 — 열릴 때마다 insertCheck 뒤 다시 조회한다 */
  open: boolean;
  /** open(linkCodeList, callback)의 linkCodeList — Link 코드 또는 코드그룹. 없으면 open(callback) */
  linkCodeList?: string;
  /** [닫기]의 callback.execute() 뒤 창이 닫힌다 — 부르는 쪽이 open을 끈다 */
  onClose: () => void;
}

/** 창 크기 (open L60-88) */
const sizeOf = (linkCodeList?: string): { width: number; height: number } => {
  if (!linkCodeList) return { width: 1200, height: 600 };
  if (linkCodeList === 'D01') return { width: 1100, height: 300 };
  if (linkCodeList === 'LinkCode0001') return { width: 1200, height: 500 };
  return { width: 1200, height: 300 };
};

export const Dcr30_Lookup_Link: React.FC<Props> = ({ open, linkCodeList, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [classTarget, setClassTarget] = useState<DcrLink | null>(null);
  const [mapping, setMapping] = useState<{ model: FormMapping; link: DcrLink } | null>(null);
  const [noteLink, setNoteLink] = useState<DcrLink | null>(null);
  // retrieve() L262-276(전체/코드 목록) 과 retrieveSearch() L278-290(검색)을 나눈다
  const mode = useRef<'list' | 'search'>('list');
  const searchRef = useRef(searchText);
  searchRef.current = searchText;
  const toolbarVisible = !linkCodeList;

  const crud = useGridCrud<DcrLink>({
    idField: 'linkId',
    search: useCallback(
      () => (mode.current === 'search' ? dcrApi.searchLinks(searchRef.current) : dcrApi.lookupLinks(linkCodeList)),
      [linkCodeList],
    ),
    // update() L243-260: GridUpdate → dcr.Dcr30_Link.update → updateDcrAuth(로그인 회사) → retrieve()
    save: useCallback(async (rows: DcrLink[]) => {
      mode.current = 'list';
      await dcrApi.updateLinks(rows.map(r => ({ linkId: r.linkId, classTreeId: r.classTreeId, note: r.note })));
      return rows;
    }, []),
    reloadAfterSave: true,
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),
  });

  // [E0] 화면 열림 (open L60-88, 생성자 L90-143) → insertCheck() L229-241: dcr.Dcr30_Link.insertCheck(kindCode LinkCode) 뒤 retrieve()
  useEffect(() => {
    if (!open) return;
    mode.current = 'list';
    setSearchText('');
    dcrApi.linkCheckCompany()
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => { void crud.retrieve(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, linkCodeList]);

  // [E2] retrieveButton[조회].Select (L106), [E1] searchText.KeyPress [Enter] (L98) → retrieveSearch() L278-290: dcr.Dcr30_Link.selectBySearchId
  const retrieveSearch = async () => {
    mode.current = 'search';
    await crud.retrieve();
  };

  // 데이터연결(양식) 아이콘 L157-187: com.Com10_FormMapping.selectById(formMappingId) → 없으면 새 모델(회사 = 로그인 회사) → Com10_Lookup_CommonMapping.open → 닫히면 retrieve()
  const openMapping = useCallback(async (link: DcrLink) => {
    try {
      const found = link.formMappingId != null ? await comApi.getFormMapping(link.formMappingId) : null;
      setMapping({ model: found ?? {}, link });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  const columnDefs = useMemo<ColDef<DcrLink>[]>(() => [
    gb.text('linkName', 350, 'Link명'),  // L205
    // L206 classTreeFullName + lookupClassTree(LookupTriggerField) — [E5] 아이콘으로 문서분류 조회창
    gb.text('classTreeFullName', 500, '문서분류명', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: CustomCellRendererProps<DcrLink>) => (
        <Space size={4}>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setClassTarget(p.data); }} />
          {p.value}
        </Space>
      ),
    }),
    // L207 — "D01"이면 이 열을 감춘다(open L77-79)
    { ...iconCell<DcrLink>('edit', 'actionCell', 95, '데이터연결(양식)', openMapping), hide: linkCodeList === 'D01' },
    iconCell<DcrLink>('history', 'noteActionCell', 60, '비고', link => setNoteLink(link)),  // L208
    gb.textCenter('gubun', 60, '구분'),  // L209
    gb.textCenter('linkCode', 60, '코드'),  // L210
  ], [openMapping, linkCodeList]);

  const { width, height } = sizeOf(linkCodeList);
  // 제목줄·푸터 약 110, 툴바 50
  const bodyHeight = height - 110 - (toolbarVisible ? 50 : 0);

  return (
    <>
      <LookupModal
        open={open}
        title="문서분류지정"
        width={width}
        closable={false}
        maskClosable={false}
        keyboard={false}
        onCancel={onClose}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {/* [E3] updateButton[저장].Select (L112) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            {/* [E4] cancleButton[닫기].Select (L118) → callback.execute(), hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {toolbarVisible && (
            <SearchBar onSearch={retrieveSearch} loading={crud.loading}>
              <SearchBar.Field label="검색">
                <SearchBar.Input style={{ width: 300 }} placeholder="Link명/문서분류명" value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
              <Typography.Text strong style={{ color: '#404040' }}>A : 시스템지정(양식) / B : 데이터연결(양식)</Typography.Text>
            </SearchBar>
          )}
          <div style={{ height: bodyHeight }}>
            <CellEditGrid<DcrLink> crud={crud} columnDefs={columnDefs} />
          </div>
        </div>
      </LookupModal>

      {/* [E5] lookupClassTree.TriggerClick (L150) → lookupClassTree() L215-227: Dcr30_Move_DcrClass.openNull(cb) → 그 행의 문서분류명·ID를 변경으로 */}
      <Dcr30_Move_DcrClass
        open={classTarget != null}
        onResult={r => {
          if (classTarget) crud.updateRow(classTarget.linkId, { classTreeId: r.classTreeId, classTreeFullName: r.classTreeFullName });
        }}
        onClose={() => setClassTarget(null)}
      />
      <Com10_Lookup_CommonMapping
        model={mapping?.model ?? null}
        linkId={mapping?.link.linkId ?? 0}
        linkCode={mapping?.link.linkCode ?? ''}
        // [E6] actionCell (ImageCell).callbackOnCreate (L178) → retrieve(): 양식 창이 저장·닫히면 다시 조회
        onSaved={() => { void crud.retrieve(); }}
        onClose={() => setMapping(null)}
      />
      {/* 비고 아이콘 L189-202: Dcr30_Lookup_LinkNote.open(linkModel, cb) — callback은 아무것도 하지 않는다 */}
      <Dcr30_Lookup_LinkNote link={noteLink} onSaved={() => undefined} onClose={() => setNoteLink(null)} />
    </>
  );
};
