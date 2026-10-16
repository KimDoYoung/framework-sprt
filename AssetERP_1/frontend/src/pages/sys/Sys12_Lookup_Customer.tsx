/**
 * 고객사반영 조회창 (A18, sys 도메인) — Sys12_Tab_Calendar의 "고객사반영"(관리자 회사만)에서 연다
 * AS-IS: myApp/client/vi/sys/Sys12_Lookup_Customer.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L51-78: 모달 1000×600 "고객사반영", 툴바(조회·저장·"Admin(관리자)정보로 고객사 변경") + 셀 편집 그리드(체크박스 다중), 하단 닫기
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = 저장(n)(UX-03). 조건이 없어 초기화(UX-02) 없음
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { message, Modal, Space } from 'antd';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Calendar } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Calendar>();

/** AS-IS buildGrid() L147-157 */
const buildGrid = () => [
  gb.text('companyName', 200, '고객사'),  // L151 SQL 계산 컬럼(sys01_company_nm)
  gb.date('day', 100, '일자'),  // L152
  gb.text('weekday', 100, '요일'),  // L153
  gb.boolean('workingYn', 70, '영업일', { editable: true }),  // L154 workingYnFlag(addBoolean) = workingYn 'true'
  gb.text('offReason', 420, '휴일사유', { editor: 'text' }),  // L155
];

interface Props {
  open: boolean;
  /** AS-IS open(selectModel): 본 화면에서 고른 일자 행(영업일·휴일사유를 고객사에 반영) */
  calendar: Calendar | null;
  onClose: () => void;
}

const NEW_ROW: Partial<Calendar> = {};

export const Sys12_Lookup_Customer: React.FC<Props> = ({ open, calendar, onClose }) => {
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<Calendar>({
    idField: 'calendarId',
    // retrieve() L159-168: stdDate = 고른 일자 → sys.Sys12_Calendar.selectByDay
    search: useCallback(() => (calendar ? sysApi.searchCalendarCustomers(calendar.day) : Promise.resolve([])), [calendar]),
    // update() L170-173: GridUpdate → sys.Sys12_Calendar.update
    save: useCallback(async (rows: Calendar[]) => { await sysApi.updateCalendarCustomers(rows); return rows; }, []),
    // 행 추가·삭제 버튼이 없다(원본에 없음)
    remove: async () => 0,
    newRow: useCallback(() => NEW_ROW, []),
  });

  // open() L51-78: 열면 조회
  useEffect(() => {
    if (open) crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, calendar]);

  // [E3] copyButton[Admin(관리자)정보로 고객사 변경].Select (L93) → 선택 확인 → [E4] msgBox.DialogHide [YES] (L103) → updateList → retrieve()
  const copy = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('반영할 고객사를 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: '선택한 고객사의 일자정보를 변경하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          // 고른 고객사 행마다 영업일·휴일사유를 본 화면의 행 값으로
          await sysApi.updateCalendarCustomers(selected.map(r => ({ ...r, workingYn: calendar?.workingYn ?? 'true', offReason: calendar?.offReason ?? null })));
          message.success('정상적으로 반영되었습니다');
        } catch (err) {
          message.error(errorMessage(err, '반영 실패'));
        }
        await crud.retrieve();
      },
    });
  };

  return (
    <Modal
      open={open}
      title="고객사반영"
      width={1000}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E5] cancelButton[닫기].Select (L139) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 460, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L81) → retrieve() */}
        <SearchBar onSearch={crud.retrieve} loading={crud.loading} extra={<Space>
          {/* [E2] updateButton[저장].Select (L87) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="save" onClick={copy}>Admin(관리자)정보로 고객사 변경</Button>
        </Space>} />
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Calendar> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </Modal>
  );
};
