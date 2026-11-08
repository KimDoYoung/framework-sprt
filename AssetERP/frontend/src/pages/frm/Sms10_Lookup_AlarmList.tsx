/**
 * 알림함 창 (EE57) — Frm01_Lookup_CheckList(알림)의 [알림함]이 연다. 받은(발신) 알림 기록 조회
 * AS-IS: myApp/client/vi/sms/Sms10_Lookup_AlarmList.java (196줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L58-94: 750×400, 머리말 "알림함", [구분(수신/발신)][조회기간(7일 전~오늘)][검색][조회] + 단일 그리드
 * buildGrid() L136-156: 수신(발신)일 140 · 수신(발신)자 90 · 내용(HTML) 350 · 보기 아이콘 50 · 성공여부 60
 * 보기 아이콘 → SocketMessage.show(content) (SocketMessage.java: 450×250 "실시간 알림", 읽기 전용 글상자 + [닫기])
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { DatePicker, Input, Select, Space, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { frmApi } from '@/api/frm';
import { errorMessage } from '@/api/client';
import { FrmAlarmHistory } from '@/types/frm';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<FrmAlarmHistory>();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Sms10_Lookup_AlarmList: React.FC<Props> = ({ open, onClose }) => {
  const [rows, setRows] = useState<FrmAlarmHistory[]>([]);
  const [loading, setLoading] = useState(false);
  // settings() L96-134: 시작일 = 오늘 -7일, 종료일 = 오늘, 구분 "수신"
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(7, 'day'));
  const [closeDate, setCloseDate] = useState<Dayjs>(dayjs());
  const [inOut, setInOut] = useState<'in' | 'out'>('in');
  const [searchText, setSearchText] = useState('');
  const [content, setContent] = useState<string | null>(null);

  // retrieve() L158-188 — sms.Sms10_AlarmHistory.selectByText (검색어 없으면 '%', 있으면 '%검색어%')
  const retrieve = useCallback(async (io: 'in' | 'out', s: Dayjs, c: Dayjs, text: string) => {
    setLoading(true);
    try {
      setRows(await frmApi.searchAlarmHistories(io, text, s.format('YYYY-MM-DD'), c.format('YYYY-MM-DD')));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 화면 열림 (생성자 L58-94, open L54-56) → show(), retrieve() — 열 때마다 처음 조건으로
  useEffect(() => {
    if (!open) return;
    const s = dayjs().subtract(7, 'day');
    const c = dayjs();
    setStartDate(s); setCloseDate(c); setInOut('in'); setSearchText('');
    void retrieve('in', s, c, '');
  }, [open, retrieve]);

  const columns = [
    gb.textCenter('sendTimeStr', 140, '수신(발신)일'),     // L149
    gb.textCenter('targetPersonName', 90, '수신(발신)자 '), // L150
    gb.textHtml('content', 350, '내용'),                   // L151
    // [E3] 보기 아이콘 (actionCell L140-148) → SocketMessage.show(content)
    iconCell<FrmAlarmHistory>('view', 'actionCell', 50, ' ', row => setContent(row.content)),
    gb.booleanYn('sendYn', 60, '성공여부'),                // L153
  ];

  return (
    <>
      <LookupModal
        open={open}
        title="알림함"
        width={880}
        maskClosable={false}
        onCancel={onClose}
        footer={null}
      >
        <div style={{ height: 330, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E1] retrieveButton[조회].Select (L128) → retrieve(). [E2] searchText.KeyPress [Enter] (L120) → retrieve() */}
          <SearchBar onSearch={() => retrieve(inOut, startDate, closeDate, searchText)} loading={loading}>
            <SearchBar.Field label="구분">
              {/* [E4] inOutName.ValueChange (L111) → retrieve() */}
              <Select<'in' | 'out'> style={{ width: 80 }} value={inOut}
                options={[{ value: 'in', label: '수신' }, { value: 'out', label: '발신' }]}
                onChange={v => { setInOut(v); void retrieve(v, startDate, closeDate, searchText); }} />
            </SearchBar.Field>
            <SearchBar.Field label="조회기간">
              <Space size={4}>
                <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} onChange={d => d && setStartDate(d)} format="YYYY-MM-DD" />
                ~
                <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} onChange={d => d && setCloseDate(d)} format="YYYY-MM-DD" />
              </Space>
            </SearchBar.Field>
            <SearchBar.Field label="검색">
              <SearchBar.Input style={{ width: 150 }} placeholder="수신(발신)자/내용" value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ flex: 1, minHeight: 0 }}>
            <SingleGrid<FrmAlarmHistory> rowData={rows} columnDefs={columns} loading={loading} getRowId={p => String(p.data.alarmHistoryId)} />
          </div>
        </div>
      </LookupModal>
      {/* SocketMessage (L14-58): 450×250 "실시간 알림", 읽기 전용 글상자, [닫기] */}
      <LookupModal
        open={content != null}
        title="실시간 알림"
        width={450}
        maskClosable={false}
        onCancel={() => setContent(null)}
        footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={() => setContent(null)}>닫기</Button></div>}
      >
        <Input.TextArea readOnly value={content ?? ''} style={{ height: 150, resize: 'none' }} />
      </LookupModal>
    </>
  );
};
