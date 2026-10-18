/**
 * [1280] 기초자료 > 20. 문서(전자결재) > 문서분류지정 (E17)
 * AS-IS: myApp/client/vi/dcr/Dcr30_Tab_LinkAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L68-118: north = 툴바 [문서분류지정복사][양식복사] + 안내 라벨(높이 45), center(55%) = 툴바(검색 600 · 조회 · 저장) + Link 셀 편집 그리드(체크 다중),
 *   south(45%, 분할) = Dcr30_TabPage_Company(목적지 회사)
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03). 초기화(UX-02)는 원본에 없는 동작이라 넣지 않는다
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Space, Splitter, Typography } from 'antd';
import { SearchOutlined, } from '@ant-design/icons';
import { Button as AntButton } from 'antd';
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
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Com10_Lookup_CommonMapping } from '@/pages/com/Com10_Lookup_CommonMapping';
import { Dcr30_TabPage_Company, Dcr30CompanyHandle } from './Dcr30_TabPage_Company';

const gb = gbFor<DcrLink>();

export const Dcr30_Tab_LinkAdmin: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const companyRef = useRef<Dcr30CompanyHandle>(null);
  const [classTarget, setClassTarget] = useState<DcrLink | null>(null);
  const [mapping, setMapping] = useState<{ model: FormMapping; link: DcrLink } | null>(null);

  const crud = useGridCrud<DcrLink>({
    idField: 'linkId',
    // retrieve() L275-291: 로그인 회사, searchText = "%검색어%" → dcr.Dcr30_Link.selectBySearchId
    search: useCallback(() => dcrApi.searchLinks(searchText), [searchText]),
    // update() L306-323: GridUpdate → dcr.Dcr30_Link.update → updateDcrAuth(로그인 회사) → retrieve()
    save: useCallback(async (rows: DcrLink[]) => {
      await dcrApi.updateLinks(rows.map(r => ({ linkId: r.linkId, classTreeId: r.classTreeId, note: r.note })));
      return rows;
    }, []),
    reloadAfterSave: true,
    onChanged: useCallback(() => { companyRef.current?.open(searchText); companyRef.current?.retrieveLinks(searchText); }, [searchText]),
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),
  });

  // retrieve() L275-291: 위 그리드 조회 뒤 companyMenu.open("%검색어%"), 곧바로 companyMenu.retrieve(로그인 회사, "%검색어%")
  const retrieve = useCallback(async () => {
    await crud.retrieve();
    companyRef.current?.open(searchText);
    await companyRef.current?.retrieveLinks(searchText);
  }, [crud, searchText]);

  // [E0] 화면 열림 (생성자 L68-118) → settings(), linkCheck() L263-273: dcr.Dcr30_Link.linkCheck(kindCode LinkCode) 뒤 retrieve()
  useEffect(() => {
    dcrApi.linkCheck()
      .catch(err => message.error(errorMessage(err, '조회 실패')))
      .finally(() => { retrieve(); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터연결(양식) 아이콘 L219-251: com.Com10_FormMapping.selectById(formMappingId) → 없으면 새 모델(회사 = 로그인 회사) → Com10_Lookup_CommonMapping.open → 닫히면 retrieve()
  const openMapping = async (link: DcrLink) => {
    try {
      const found = link.formMappingId != null ? await comApi.getFormMapping(link.formMappingId) : null;
      setMapping({ model: found ?? {}, link });
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  /** AS-IS buildGrid() L211-261 (setChecked MULTI) */
  const columnDefs = useMemo<ColDef<DcrLink>[]>(() => [
    gb.text('linkName', 400, 'Link명'),  // L250
    // L251 classTreeFullName + lookupClassTree(LookupTriggerField) — 아이콘으로 문서분류 조회창 (E8)
    gb.text('classTreeFullName', 450, '문서분류명', {
      cellStyle: { color: '#1677ff' },
      cellRenderer: (p: CustomCellRendererProps<DcrLink>) => (
        <Space size={4}>
          <AntButton type="text" size="small" icon={<SearchOutlined />}
            onClick={e => { e.stopPropagation(); if (p.data) setClassTarget(p.data); }} />
          {p.value}
        </Space>
      ),
    }),
    iconCell<DcrLink>('edit', 'actionCell', 95, '데이터연결(양식)', openMapping),  // L252
    gb.text('note', 550, '비고', { editor: 'text' }),  // L253
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  /** 복사 공통 (E4~E7): 목적지 회사를 안 골랐으면 알리고, 확인창 뒤 서비스를 부른다 */
  const copy = (title: string, doneMessage: string, run: (companyIds: number[], linkIds: number[]) => Promise<number>) => {
    const companyList = companyRef.current?.getModels() ?? [];
    const basicList = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (companyList.length === 0) {
      message.warning('복사할 목적지 회사를 선택해주세요');
      return;
    }
    Modal.confirm({
      title,
      content: `${companyList.length}개의 회사에 복사하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      width: 300,
      onOk: async () => {
        try {
          await run(companyList.map(c => c.companyId), basicList.map(l => l.linkId));
          await companyRef.current?.retrieve();
          message.success(doneMessage);
        } catch (err) {
          message.error(errorMessage(err, '복사 실패'));
        }
      },
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* north: vlcHeader L68-118 */}
      <div style={{ flex: 'none', padding: '10px 20px', borderBottom: '1px solid #f0f0f0' }}>
        <Space>
          {/* [E4] documentCopyButton[문서분류지정복사].Select [YES] (L145), [E5] msgBox.DialogHide [YES] (L158) → documentCopy() L325-348 */}
          <Button type="change" onClick={() => copy('문서분류지정복사', '문서분류지정 복사가 완료되었습니다', dcrApi.copyLinks)}>문서분류지정복사</Button>
          {/* [E6] formCopyButton[양식복사].Select [YES] (L178), [E7] msgBox.DialogHide [YES] (L191) → formCopy() L350-372 */}
          <Button type="change" onClick={() => copy('양식복사', '양식 복사가 완료되었습니다', dcrApi.copyLinkForms)}>양식복사</Button>
          <Typography.Text strong style={{ color: '#4472C4' }}>※ 상단 : 기초문서분류 / 하단 : 목적지 회사</Typography.Text>
        </Space>
      </div>
      <Splitter layout="vertical" style={{ flex: 1, minHeight: 0 }}>
        <Splitter.Panel defaultSize="55%" min={200}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 20px', boxSizing: 'border-box' }}>
            {/* [E2] retrieveButton[조회].Select (L132), [E1] searchText.KeyPress [Enter] (L123) → retrieve() */}
            <SearchBar onSearch={retrieve} loading={crud.loading} extra={
              /* [E3] updateButton[저장].Select (L138) → update(). 저장(n)은 UX-03 */
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
            }>
              <SearchBar.Field label="검색">
                <SearchBar.Input style={{ width: 600 }} placeholder="Link명/문서분류명" value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CellEditGrid<DcrLink> crud={crud} columnDefs={columnDefs} />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px', boxSizing: 'border-box' }}>
            <Dcr30_TabPage_Company ref={companyRef} />
          </div>
        </Splitter.Panel>
      </Splitter>

      {/* [E8] lookupClassTree.TriggerClick (L216) → lookupClassTree() L292-304: openNull(cb) → 그 행의 문서분류명·ID를 변경으로 */}
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
        onSaved={() => { retrieve(); }}
        onClose={() => setMapping(null)}
      />
    </div>
  );
};
