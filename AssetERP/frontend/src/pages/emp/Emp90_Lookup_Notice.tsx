/**
 * 알림설정 창 — 캘린더 일정표시 차단 (EE66) — MyPage 달력의 [🔔 일정표시]가 연다. 알림 항목마다 달력에 안 보이게 차단/차단해제
 * AS-IS: myApp/client/vi/emp/Emp90_Lookup_Notice.java (183줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 호출: JSCaller.returnOpenNotice() L142-151 (fullcalendar.jsp 의 myNoticeButton). [닫기]에서 callback 을 불러 달력·목록을 다시 읽는다
 * 생성자 L88-111: 420×700 모달 "알림설정", 툴바(검색어 120 "일정표시" + [조회][차단][차단해제]) + 체크박스 다중 그리드(차단 60 · 알림항목 210), 푸터 가운데 [닫기]
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { empNoticeApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { Notice } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<Notice>();

/** buildGrid() L113-121 */
const buildGrid = () => [
  gb.booleanYn2('noticeYn', 60, '차단'),  // L117
  gb.text('noticeKeyword', 210, '알림항목'),  // L118
];

interface Props {
  open: boolean;
  /** [닫기]의 callback.execute() (L83) — 부른 쪽이 달력 등을 다시 읽는다 */
  onClosed?: () => void;
  onClose: () => void;
}

export const Emp90_Lookup_Notice: React.FC<Props> = ({ open, onClosed, onClose }) => {
  const [rows, setRows] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [checked, setChecked] = useState<Notice[]>([]);
  const [gridKey, setGridKey] = useState(0);   // retrieve() L132 grid.getSelectionModel().deselectAll()
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L123-136 — emp.Emp90_Notice.selectByPersonId(personId, "%" + 검색어 + "%")
  const retrieve = useCallback(async (text: string) => {
    setLoading(true);
    try {
      setRows(await empNoticeApi.search(text));
      setChecked([]);
      setGridKey(k => k + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 열림 (생성자 L88-111) → show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    void retrieve('');
  }, [open, retrieve]);

  // [E2] updateButton[차단].Select (L67) → update() L138-157: 체크된 항목을 emp.Emp90_Notice.updateList, 성공하면 retrieve()
  const block = async () => {
    try {
      await empNoticeApi.block(checked.map(r => r.noticeKeyword));
      await retrieve(searchText);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] deleteButton[차단해제].Select (L73) → delete() L159-178: 체크된 항목을 emp.Emp90_Notice.deleteList, 성공하면 retrieve()
  const unblock = async () => {
    try {
      await empNoticeApi.unblock(checked.map(r => r.noticeKeyword));
      await retrieve(searchText);
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E4] closeButton[닫기].Select (L79) → hide(), callback.execute()
  const close = () => {
    onClose();
    onClosed?.();
  };

  return (
    // 열 폭 합계 60 + 210 = 270 + 체크·행번호 60 + 여백 130 = 460 (03 원칙 21, AS-IS 420보다 작지 않게)
    <LookupModal open={open} title="알림설정" width={460} maskClosable={false} onCancel={close} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Button type="close" onClick={close}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 520, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L61) → retrieve(). searchText.KeyPress [Enter] (L53) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)} loading={loading}
          extra={<>
            <Button type="change" onClick={block}>차단</Button>
            <Button type="delete" onClick={unblock}>차단해제</Button>
          </>}>
          <SearchBar.Input style={{ width: 120 }} placeholder="일정표시" value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<Notice> key={gridKey} rowClick rowData={rows} columnDefs={columnDefs} loading={loading}
            getRowId={p => String(p.data.noticeId)} onCheckedChange={setChecked} />
        </div>
      </div>
    </LookupModal>
  );
};
