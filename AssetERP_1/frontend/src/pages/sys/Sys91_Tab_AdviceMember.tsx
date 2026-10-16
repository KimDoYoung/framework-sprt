/**
 * [1301] 커뮤니티 > 91. AssetERP > AssetERP 자문위원 / [1302] 관리자 > 09. 기타 > AssetERP 자문의원 관리 (A31)
 * AS-IS: myApp/client/vi/sys/Sys91_Tab_AdviceMember.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L44-67: 툴바(조회·등록·저장·삭제) + 그리드(행번호). 두 메뉴가 같은 클래스를 쓴다 — 로그인 회사가 관리자 회사(0)면
 *   셀 편집 그리드 + 4개 버튼(buildGrid L108-134, settings L69-106), 아니면 읽기 전용 그리드(홈페이지는 링크) + 조회 버튼만.
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03). 조건이 없어 초기화(UX-02) 없음
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { sysApi } from '@/api/sys';
import { AdviceMember } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { isSysAdmin, useLoginUser } from '@/hooks/useLoginUser';

const gb = gbFor<AdviceMember>();

/** AS-IS buildGrid() L111-117 — 관리자 회사: 셀 편집 */
const buildEditGrid = () => [
  gb.textCenter('field', 100, '분야', { editor: 'text' }),  // L112
  gb.textCenter('companyNm', 150, '회사명', { editor: 'text' }),  // L113
  gb.textCenter('memberNm', 150, '대표', { editor: 'text' }),  // L114
  gb.textArea('career', 300, '약력', { editor: 'largeText' }),  // L115
  gb.text('homepage', 250, '홈페이지', { editor: 'text' }),  // L116
  gb.text('telno', 200, '상담전화', { editor: 'text' }),  // L117
  gb.text('email', 200, '이메일', { editor: 'text' }),  // L118
  gb.textArea('address', 300, '주소', { editor: 'largeText' }),  // L119
  gb.textArea('note', 300, '비고', { editor: 'largeText' }),  // L120
];

/** AS-IS buildGrid() L122-130 — 그 밖의 회사: 읽기 전용, 홈페이지는 addTextLink(L944-962: 새 창 링크, 굵게, href = 값 그대로) */
const buildViewGrid = () => [
  gb.textCenter('field', 100, '분야'),  // L122
  gb.textCenter('companyNm', 150, '회사명'),  // L123
  gb.textCenter('memberNm', 150, '대표'),  // L124
  gb.textArea('career', 300, '약력'),  // L125
  gb.text('homepage', 250, '홈페이지', {  // L126 addTextLink
    cellRenderer: (p: { value?: string | null }) => (p.value
      ? <a href={p.value} target="_blank" rel="noopener noreferrer"><b>{p.value}</b></a>
      : ' '),
  }),
  gb.text('telno', 200, '상담전화'),  // L127
  gb.text('email', 200, '이메일'),  // L128
  gb.textArea('address', 300, '주소'),  // L129
  gb.textArea('note', 300, '비고'),  // L130
];

export const Sys91_Tab_AdviceMember: React.FC = () => {
  const user = useLoginUser();
  const editable = isSysAdmin(user);  // AS-IS LoginUser.getCompanyId().equals(0l)
  const columnDefs = useMemo(editable ? buildEditGrid : buildViewGrid, [editable]);

  const crud = useGridCrud<AdviceMember>({
    idField: 'adviceMemberId',
    // retrieve() L137-146 → sys.Sys91_AdviceMember.selectByAll
    search: sysApi.searchAdviceMembers,
    // update() L149-152: GridUpdate → sys.Sys91_AdviceMember.update
    save: sysApi.updateAdviceMembers,
    remove: sysApi.deleteAdviceMembers,
    // insertRow() L155-160: GridInsertRow, companyId = 1
    newRow: useCallback(() => ({ companyId: 1 }), []),
    firstEditField: 'field',
    // deleteChk() L162-180
    deleteConfirm: n => `${n}건을 삭제하시겠습니까?`,
  });

  // [E0] 화면 열림 (생성자 L44-67) → settings(), retrieve()
  useEffect(() => {
    crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* [E1] retrieveButton[조회].Select (L70) → retrieve() */}
      <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={editable && <>
        {/* [E2] insertButton[등록].Select (L76) → insertRow() */}
        <Button type="register" onClick={crud.addRow}>등록</Button>
        {/* [E3] updateButton[저장].Select (L82) → update(). 저장(n)은 UX-03 */}
        <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
        {/* [E4] deleteButton[삭제].Select (L88) → deleteChk(), [E5] msgBox.DialogHide [YES] (L165) → deleteRow() → sys.Sys91_AdviceMember.delete */}
        <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
      </>} />
      <div style={{ flex: 1, minHeight: 0 }}>
        {editable
          ? <CellEditGrid<AdviceMember> crud={crud} columnDefs={columnDefs} rowSelection={{ mode: 'singleRow', checkboxes: false, enableClickSelection: true }} />
          : <SingleGrid<AdviceMember> rowData={crud.rows} columnDefs={columnDefs} getRowId={p => String(p.data.adviceMemberId)} />}
      </div>
    </div>
  );
};
