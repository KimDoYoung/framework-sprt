/**
 * 발신기록 조회창 (C05) — Sms02_Tab_TotalCount 그리드의 발신기록 아이콘에서 연다
 * AS-IS: myApp/client/vi/sms/Sms02_Lookup_History.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L51-80: 모달 700×500 "발신기록 (최근 300건)", 툴바(조회기간 시작일 ~ 종료일, 검색 내용, 조회) + 그리드, 하단 닫기
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, Input, message, Modal, Space, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { smsApi } from '@/api/sms';
import { errorMessage } from '@/api/client';
import { SmsHistory } from '@/types/sms';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<SmsHistory>();

/** AS-IS buildGrid() L112-118 */
const buildGrid = () => [
  gb.textCenter('sendDateStr', 170, '전송일'),  // L115
  gb.textArea('content', 470, '내용'),  // L116
];

interface Props {
  open: boolean;
  /** AS-IS open(companyId) L46-49 */
  companyId?: number;
  onClose: () => void;
}

const FORMAT = 'YYYY-MM-DD';

export const Sms02_Lookup_History: React.FC<Props> = ({ open, companyId, onClose }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [closeDate, setCloseDate] = useState<Dayjs | null>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<SmsHistory[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L120-135: companyId, startDate, closeDate, searchText("%…%"), limit 300 → sms.Sms02_History.selectByDate
  const retrieve = useCallback(async (start: Dayjs | null, close: Dayjs | null, text: string) => {
    if (companyId == null || !start || !close) return;
    try {
      setRows(await smsApi.searchHistories(companyId, start.format(FORMAT), close.format(FORMAT), text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [companyId]);

  // [E0] 화면 열림 (생성자 L51-80) → settings(), show()
  // settings() L82-110 + open(companyId) → retrieve(): 시작일 = 올해 1월 1일, 종료일 = 오늘(LoginUser.getToday()), 검색어 빈칸
  useEffect(() => {
    if (!open) return;
    const start = dayjs().startOf('year');
    const close = dayjs();
    setStartDate(start);
    setCloseDate(close);
    setSearchText('');
    setRows([]);
    retrieve(start, close, '');
  }, [open, retrieve]);

  return (
    <Modal
      open={open}
      title="발신기록 (최근 300건)"
      width={700}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E3] closeButton[닫기].Select (L104) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>조회기간</Typography.Text>
          <DatePicker style={{ width: 160 }} allowClear={false} value={startDate} onChange={setStartDate} format={FORMAT} />
          <Typography.Text>~</Typography.Text>
          <DatePicker style={{ width: 160 }} allowClear={false} value={closeDate} onChange={setCloseDate} format={FORMAT} />
          <Typography.Text strong>검색</Typography.Text>
          {/* [E1] searchText.KeyPress [Enter] (L90) → retrieve() */}
          <Input style={{ width: 200 }} placeholder="내용" value={searchText} onChange={e => setSearchText(e.target.value)}
            onPressEnter={() => retrieve(startDate, closeDate, searchText)} />
          {/* [E2] retrieveButton[조회].Select (L98) → retrieve() */}
          <Button type="search" onClick={() => retrieve(startDate, closeDate, searchText)}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<SmsHistory>
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.historyId)}
          />
        </div>
      </div>
    </Modal>
  );
};
