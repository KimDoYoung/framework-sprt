/**
 * [1072] 관리자 > 01. 화면권한관리 > 사용자별 권한그룹 맵핑  (A04)
 * AS-IS: myApp/client/vi/sys/Sys05_Tab_PersonRole.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃(생성자 L53-127): center = 툴바(높이 50) + 사원 그리드, south(40%, 분할, 최대 1000) = 권한 그리드 + 가운데 저장 버튼
 * UX보강(10) B12-1: 사원 툴바 = SearchBar(UX-01·02·04, 초기화 = 검색어 비움·재직), 저장 = 저장(n)(UX-03, 권한 칸이 바뀐 행 수)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Select, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { empApi } from '@/api/emp';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { PersonRole } from '@/types/sys';
import { Button } from '@/components/button';
import { SearchBar, useSearchParams } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';

const gbUser = gbFor<TransInfo>();
const gbRole = gbFor<PersonRole>();

/** AS-IS buildUserGrid() L129-147 (setChecked SINGLE) */
const buildUserGrid = () => [
  gbUser.text('orgKorNm', 200, '부서명'),  // L135
  gbUser.text('titleNm', 100, '직책'),  // L136
  gbUser.text('empNo', 80, '사번'),  // L137
  gbUser.text('korNm', 100, '성명'),  // L138
  gbUser.text('posNm', 100, '직위'),  // L139
  gbUser.text('kindNm', 80, '사원구분'),  // L140
  gbUser.text('mobileTelNo', 120, '헨드폰번호'),  // L143
  gbUser.text('emailAddr', 200, '이메일주소'),  // L144
];

/** AS-IS buildRoleGrid() L149-160 (setChecked SINGLE) */
const buildRoleGrid = () => [
  gbRole.text('roleNm', 200, '권한명'),  // L154
  gbRole.boolean('userRoleYn', 40, '권한', { editable: true }),  // L155 addBoolean = CheckBoxCell(클릭으로 바뀜)
  gbRole.text('seq', 80, '순서'),  // L156
  gbRole.text('note', 600, '비고'),  // L157
];

/** 생성자 L56-63 workTypeCode: 입력 불가 콤보, 처음 "재직". retrieve() L193-206: 이름 → transCode */
const WORK_TYPES = [
  { label: '전체', value: '000' },
  { label: '재직', value: '100' },
  { label: '겸직', value: '800' },
  { label: '퇴직', value: '900' },
];

const selectOne = { mode: 'singleRow' as const, checkboxes: true, enableClickSelection: true };

export const Sys05_Tab_PersonRole: React.FC = () => {
  const userGridRef = useRef<AgGridReact<TransInfo>>(null);
  const roleGridRef = useRef<AgGridReact<PersonRole>>(null);
  const sp = useSearchParams(() => ({ searchText: '', transCode: '100' }));
  const { searchText, transCode } = sp.values;
  const [users, setUsers] = useState<TransInfo[]>([]);
  const [user, setUser] = useState<TransInfo>();
  const [roles, setRoles] = useState<PersonRole[]>([]);
  /** 조회·저장 때의 userRoleYn — 다르면 바뀐 행(GXT getModifiedRecords) */
  const orig = useRef(new Map<number, string>());
  const [changedCount, setChangedCount] = useState(0);  // 저장(n) (UX-03)
  const userColumns = useMemo(buildUserGrid, []);
  const roleColumns = useMemo(buildRoleGrid, []);

  const showRoles = (list: PersonRole[]) => {
    orig.current = new Map(list.map(r => [r.roleId, r.userRoleYn]));
    setChangedCount(0);
    setRoles(list);
  };

  const getChanged = () => {
    const changed: PersonRole[] = [];
    roleGridRef.current?.api.forEachNode(n => {
      if (n.data && orig.current.get(n.data.roleId) !== n.data.userRoleYn) changed.push(n.data);
    });
    return changed;
  };

  // retrieve() L180-222: 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transCode)
  // transDate·isSeparateAddTitle은 안 보낸다 → 서버가 오늘·false(겸직도 재직으로)
  const retrieve = useCallback(async () => {
    try {
      setUsers(await empApi.searchTransInfos(undefined, searchText, transCode, false));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [searchText, transCode]);

  // retrieve() 콜백 L215-219: userGrid.getSelectionModel().select(0)
  const onUserRowDataUpdated = () => {
    const first = userGridRef.current?.api.getDisplayedRowAtIndex(0);
    if (first?.data) first.setSelected(true, true);
    else setUser(undefined);
  };

  // retrieveUserRole() L163-176: 선택 사원이 있으면 sys.Sys04_Role.selectByUserId(personId, companyId), 없으면 비움
  useEffect(() => {
    if (!user) { showRoles([]); return; }
    sysApi.searchPersonRoles(user.personId)
      .then(showRoles)
      .catch(err => message.error(errorMessage(err, '조회 실패')));
  }, [user]);

  // update() L225-239: 사원 미선택이면 메시지. GridUpdate → sys.Sys04_Role.updateUserRole — 바뀐 행만, 0건이면 조용히(05 §8)
  const update = async () => {
    if (!user) {
      message.warning('선택된 사원이 없습니다');
      return;
    }
    const changed = getChanged();
    if (changed.length === 0) return;
    try {
      // 결과 = selectByUserId 전체 → store 갱신
      showRoles(await sysApi.updatePersonRoles(user.personId, changed));
      message.success(`${changed.length}건 저장되었습니다.`);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L53-127) → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  return (
    <Splitter layout="vertical" style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel min={150}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 12px 0', boxSizing: 'border-box' }}>
          {/* [E1] retrieveButton[조회].Select (L64) → retrieve(). 초기화는 UX-02 */}
          <SearchBar onSearch={retrieve} onReset={sp.reset}>
            <SearchBar.Field label="사원검색">
              {/* [E2] searchText.KeyPress [Enter] (L70) → retrieve() — SearchBar.Input의 Enter */}
              <SearchBar.Input style={{ width: 150 }} value={searchText} onChange={e => sp.set('searchText', e.target.value)} />
            </SearchBar.Field>
            <SearchBar.Field label="재직구분">
              <Select style={{ width: 150 }} value={transCode} options={WORK_TYPES} onChange={v => sp.set('transCode', v)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E3] userGrid.SelectionChanged (L97) → retrieveUserRole() */}
            <SingleGrid<TransInfo>
              gridRef={userGridRef}
              rowData={users}
              columnDefs={userColumns}
              getRowId={p => String(p.data.transId)}
              rowSelection={selectOne}
              onSelect={r => setUser(r ?? undefined)}
              onRowDataUpdated={onUserRowDataUpdated}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel defaultSize="40%" max={1000} min={120}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 12, boxSizing: 'border-box' }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<PersonRole>
              gridRef={roleGridRef}
              rowData={roles}
              columnDefs={roleColumns}
              getRowId={p => String(p.data.roleId)}
              rowSelection={selectOne}
              onCellValueChanged={() => setChangedCount(getChanged().length)}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            {/* [E4] updateButton[저장].Select (L109) → update(). 저장(n)은 UX-03 */}
            <Button type="save" count={changedCount} onClick={update}>저장</Button>
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
  );
};
