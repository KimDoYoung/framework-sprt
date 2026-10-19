/**
 * 휴일관리 조회창 (A18, sys 도메인) — Sys12_Tab_Calendar의 "휴일관리"에서 연다
 * AS-IS: myApp/client/vi/sys/Sys14_Lookup_Holiday.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L76-179: 모달 800×450 "휴일관리", 툴바(조회연도 + 조회·등록·저장·삭제, 관리자 회사만 고객사 칸 + 기초데이터생성) + 셀 편집 그리드(체크박스 다중), 하단 닫기
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03). 조건이 1개라 초기화(UX-02) 없음. 툴바는 원본처럼 줄바꿈 없이 가로 스크롤
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message, Modal } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Holiday } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { useLoginUser } from '@/hooks/useLoginUser';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';

const gb = gbFor<Holiday>();

/** AS-IS buildGrid() L181-192 */
const buildGrid = () => [
  gb.date('day', 100, '일자', { editor: 'date' }),  // L187
  gb.text('holidayName', 180, '휴일명', { editor: 'text' }),  // L188
  gb.text('note', 250, '비고', { editor: 'text' }),  // L189
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const NEW_ROW: Partial<Holiday> = {};

export const Sys14_Lookup_Holiday: React.FC<Props> = ({ open, onClose }) => {
  const user = useLoginUser();
  const columnDefs = useMemo(buildGrid, []);
  const [searchText, setSearchText] = useState('');
  // 관리자 회사만: 기초데이터생성 대상 고객사 (AS-IS companyField·companyId)
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [lookupCompany, setLookupCompany] = useState(false);

  const crud = useGridCrud<Holiday>({
    idField: 'holidayId',
    // retrieve() L217-231: year = 조회연도(그대로 LIKE) → sys.Sys14_Holiday.selectByYear
    search: useCallback(() => sysApi.searchHolidays(searchText), [searchText]),
    // update() L240-247: GridUpdate → sys.Sys14_Holiday.update
    save: sysApi.updateHolidays,
    remove: sysApi.deleteHolidays,
    // insertRow() L233-238: 빈 행(회사는 서버가 로그인 회사로)
    newRow: useCallback(() => NEW_ROW, []),
    firstEditField: 'day',
    // deleteRow() L249-270
    deleteConfirm: '해당 정보를 삭제하시겠습니까?',
  });

  // [E0] 화면 열림 (생성자 L76-179) → show(), open() L72-74 → retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E8] dataButton[기초데이터생성].Select (L145) → initData() L194-215: 고른(체크한) 일자의 admin 휴일을 고객사로 복사
  const initData = async () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    try {
      await sysApi.insertHolidayInitData(companyId, selected.map(r => r.day).filter((d): d is string => !!d));
      message.success('생성이 완료되었습니다.');
    } catch (err) {
      message.error(errorMessage(err, '생성 실패'));
    }
  };

  return (
    <>
      <Modal
        open={open}
        title="휴일관리"
        width={800}
        maskClosable={false}
        onCancel={onClose}
        destroyOnClose
        footer={
          <div style={{ textAlign: 'center' }}>
            {/* [E6] cancelButton[닫기].Select (L120) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </div>
        }
      >
        <div style={{ height: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E2] retrieveButton[조회].Select (L96) → retrieve(), [E1] searchText.KeyPress [Enter] (L87) → retrieve() */}
          <div style={{ overflowX: 'auto' }}>
            <SearchBar onSearch={crud.retrieve} loading={crud.loading} style={{ flexWrap: 'nowrap' }} extra={<>
              {/* [E3] insertButton[등록].Select (L102) → insertRow() */}
              <Button type="register" onClick={crud.addRow}>등록</Button>
              {/* [E4] updateButton[저장].Select (L108) → update(). 저장(n)은 UX-03 */}
              <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
              {/* [E5] deleteButton[삭제].Select (L114) → deleteRow(), [E9] msgBox.DialogHide [YES] (L252) → sys.Sys14_Holiday.delete */}
              <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
              {user.companyId === 0 && <>
                {/* [E7] companyField.TriggerClick [result != null] (L129) → Sys01_Lookup_Company: 고른 회사명·ID */}
                <LookupInput width={150} value={companyName} onOpen={() => setLookupCompany(true)} onClear={() => { setCompanyName(''); setCompanyId(null); }} />
                <Button type="register" onClick={initData}>기초데이터생성</Button>
              </>}
            </>}>
              <SearchBar.Field label="조회연도">
                <SearchBar.Input style={{ width: 90 }} placeholder="연도입력" value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
            </SearchBar>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <CellEditGrid<Holiday> crud={crud} columnDefs={columnDefs} />
          </div>
        </div>
      </Modal>
      <Sys01_Lookup_Company open={lookupCompany}
        onResult={c => { if (c) { setCompanyName(c.companyNm); setCompanyId(c.companyId); } setLookupCompany(false); }}
        onClose={() => setLookupCompany(false)} />
    </>
  );
};
