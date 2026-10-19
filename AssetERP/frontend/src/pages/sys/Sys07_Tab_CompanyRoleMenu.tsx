/**
 * [1286] 기초자료 > 50. 권한 > 고객사별 메뉴권한 관리  (A07) — admin 회사 메뉴(sys admin만)
 * AS-IS: myApp/client/vi/sys/Sys07_Tab_CompanyRoleMenu.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L41-73): 왼쪽(55%, 최대 1000, 분할) = 회사명(트리거) 조회 + 권한 그리드, 가운데(45%) = 권한그룹별 매뉴 트리
 * UX보강(10) B12-1: 툴바 = SearchBar(UX-01). 초기화(UX-02)는 조건이 1개라 없음
 */
import React, { useMemo, useState } from 'react';
import { message, Splitter } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Company, Role } from '@/types/sys';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_SelectSingle } from './Sys01_Lookup_SelectSingle';
import { Sys07_Tree_CompanyRoleMenu } from './Sys07_Tree_CompanyRoleMenu';

const gb = gbFor<Role>();

/** AS-IS buildGrid() L114-123 */
const buildGrid = () => [
  gb.text('roleNm', 150, '권한명'),  // L118
  gb.boolean('defaultRole', 100, '기본권한'),  // L119
  gb.boolean('adminYn', 100, '관리자권한'),  // L120
  gb.text('note', 550, '권한설명'),  // L121
];

export const Sys07_Tab_CompanyRoleMenu: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState<number>();
  const [lookupOpen, setLookupOpen] = useState(false);
  const [rows, setRows] = useState<Role[]>([]);
  const [roleModel, setRoleModel] = useState<Role>();
  const columnDefs = useMemo(buildGrid, []);

  // Sys01_Lookup_SelectSingle 결과(L84-94) → 결과가 있으면 회사명·ID, 없으면(취소) 둘 다 비움
  // 취소면 권한 목록·메뉴 트리도 비운다 — 원본은 남겨 둠(사용자 결정 2026-10-12: 회사명이 지워지면 양쪽 목록도 없어야 맞다)
  const onLookupResult = (resultModel: Company | null) => {
    setLookupOpen(false);
    setCompanyName(resultModel?.companyNm ?? '');
    setCompanyId(resultModel?.companyId);
    if (!resultModel) {
      setRows([]);
      setRoleModel(undefined);
    }
  };

  // retrieve() L125-133: 서비스 sys.Sys04_Role.selectByCompanyId(companyId)
  const retrieve = async () => {
    if (companyId == null) {
      message.warning('회사명을 먼저 선택해주세요');
      return;
    }
    try {
      setRows(await sysApi.searchCompanyRoles(companyId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L41-73) → settings() — 조회는 회사를 고른 뒤 [조회]
  return (
    <>
      <Splitter style={{ height: '100%', background: '#fff' }}>
        <Splitter.Panel defaultSize="55%" max={1000} min={200}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 4px 0 12px', boxSizing: 'border-box' }}>
            {/* [E2] retrieveButton[조회].Select (L99) → retrieve() */}
            <SearchBar onSearch={retrieve}>
              <SearchBar.Field label="회사명">
                {/* [E1] companyName.TriggerClick (L78) → Sys01_Lookup_SelectSingle.open() — 입력은 편집 불가(L77) */}
                <LookupInput width={150} value={companyName} onOpen={() => setLookupOpen(true)} />
              </SearchBar.Field>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E3] roleGrid.SelectionChanged (L105-111) → roleMenuTree.retrieve(선택 권한) */}
              <SingleGrid<Role>
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.roleId)}
                onSelect={r => r && setRoleModel(r)}
              />
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel max={1000}>
          <Sys07_Tree_CompanyRoleMenu roleModel={roleModel} />
        </Splitter.Panel>
      </Splitter>
      <Sys01_Lookup_SelectSingle open={lookupOpen} onResult={onLookupResult} />
    </>
  );
};
