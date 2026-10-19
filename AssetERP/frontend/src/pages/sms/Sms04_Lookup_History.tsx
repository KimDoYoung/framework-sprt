/**
 * 전송기록 조회창 (C06) — Sms03_Tab_SendAdmin 그리드의 아이콘에서 연다
 * AS-IS: myApp/client/vi/sms/Sms04_Lookup_History.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L42-67: 모달 600×500 "전송기록", 툴바(검색 + 조회) + 그리드, 하단 닫기
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message } from 'antd';
import { LookupModal } from '@/components/lookup/LookupModal';
import { smsApi } from '@/api/sms';
import { errorMessage } from '@/api/client';
import { GroupSendHistory } from '@/types/sms';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<GroupSendHistory>();

/** AS-IS buildGrid() */
const buildGrid = () => [
  gb.textCenter('sendDateStr', 150, '발송일시'),
  gb.text('targetName', 250, '고객사'),
  gb.text('targetTelNo', 120, '휴대폰'),
];

interface Props {
  open: boolean;
  /** AS-IS open(groupSendId) L37-40 */
  groupSendId?: number;
  onClose: () => void;
}

export const Sms04_Lookup_History: React.FC<Props> = ({ open, groupSendId, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<GroupSendHistory[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L95-108: groupSendId, companyId(로그인 — 서버), searchText("%…%" — 서버) → sms.Sms04_GroupSendHistory.selectByText
  const retrieve = useCallback(async (text: string) => {
    if (groupSendId == null) return;
    try {
      setRows(await smsApi.searchGroupSendHistories(groupSendId, text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [groupSendId]);

  // [E0] 화면 열림 (생성자 L42-67) → settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setRows([]);
    retrieve('');
  }, [open, retrieve]);

  return (
    <LookupModal
      open={open}
      title="전송기록"
      width={600}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] closeButton[닫기].Select (L78) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] retrieveButton[조회].Select (L72) → retrieve(). 조건이 1개라 초기화(UX-02) 없음 */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="검색">
            {/* 원본에 Enter 이벤트가 없어 SearchBar.Input 대신 Input allowClear(UX-04만) */}
            <Input allowClear style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<GroupSendHistory>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => p.data.historyId}
          />
        </div>
      </div>
    </LookupModal>
  );
};
