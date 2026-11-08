/**
 * 알림발송 창 (EE51) — MainFrame 상단의 알림(쪽지) 아이콘이 연다 (관리자는 AS-IS도 "관리자는 해당기능을 제공하지않습니다")
 * AS-IS: myApp/client/vi/emp/Emp00_Lookup_SendMessage.java (273줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L53-102: 700×530, 머리말 "알림발송", [기준일(오늘, 비활성)][조직/직무/성명][조회] + 체크 다중 그리드 250 + 알림내용 줄 + 입력칸 + [전송][닫기]
 * 접속 중인 사원만 나온다(AS-IS BroadcastWebsocket 접속자 → TOBE 접속자 현황). 알림은 받는 사람의 WebSocket 알림으로 간다.
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, Modal, Space, Typography, message } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { empApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<TransInfo>();

/** AS-IS buildGrid() L140-152 (setChecked MULTI) */
const columns = [
  gb.text('parentFullNm', 200, '조직'),   // L145
  gb.text('titleNm', 120, '직책'),         // L146
  gb.text('empNo', 80, '사번'),            // L147
  gb.text('korNm', 100, '성명'),           // L148
  gb.date('transDate', 100, '발령일'),     // L149
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Emp00_Lookup_SendMessage: React.FC<Props> = ({ open, onClose }) => {
  const gridRef = useRef<AgGridReact<TransInfo>>(null);
  const [rows, setRows] = useState<TransInfo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [exampleOpen, setExampleOpen] = useState(false);
  const baseDate = dayjs().format('YYYY-MM-DD'); // L107 baseDate.setValue(LoginUser.getToday()), L109 비활성

  // retrieve() L154-168 — emp.Emp00_TransInfo.getOnlineList
  const retrieve = useCallback(async (search: string) => {
    setLoading(true);
    try {
      setRows(await empApi.searchOnlineTransInfos(baseDate, search));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [baseDate]);

  // open() L53-102: 열 때마다 처음부터 → retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    setText('');
    setRows([]);
    void retrieve('');
  }, [open, retrieve]);

  // [E4] sendButton[전송].Select (L126) → sendMessage() L170-218
  const sendMessage = async () => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) { message.warning('선택된 사원이 없습니다'); return; }
    if (!text.trim()) { message.warning('알림내용을 입력해주세요'); return; }
    try {
      const res = await empApi.sendAlarm(selected.map(r => r.personId), text);
      const offline = selected.filter(r => res.offlinePersonIds.includes(r.personId)).map(r => r.korNm).join(' ');
      if (res.sentPersonIds.length === 0) {
        message.info('알림을 전송할 대상자가 오프라인 상태입니다.');
      } else if (offline) {
        message.info(`[ ${offline} ] 해당 사용자는 오프라인 상태입니다`);
      } else {
        message.info('알림이 발송되었습니다');
      }
    } catch (err) {
      message.error(errorMessage(err, '전송 실패'));
    }
  };

  return (
    <>
      <LookupModal
        open={open}
        title="알림발송"
        width={700}
        maskClosable={false}
        onCancel={onClose}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="send" onClick={sendMessage}>전송</Button>
              {/* [E5] closeButton[닫기].Select (L132) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        }
      >
        <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E3] retrieveButton[조회].Select (L120) → retrieve(). [E2] searchText.KeyPress [Enter] (L112) → retrieve() */}
          <SearchBar onSearch={() => retrieve(searchText)} loading={loading}>
            <SearchBar.Field label="기준일">
              <Input style={{ width: 100 }} disabled value={baseDate} />
            </SearchBar.Field>
            <SearchBar.Field label="조직/직무/성명">
              <SearchBar.Input style={{ width: 200 }} value={searchText} onChange={e => setSearchText(e.target.value)} />
            </SearchBar.Field>
          </SearchBar>
          <div style={{ height: 200 }}>
            <MultiGrid<TransInfo>
              gridRef={gridRef}
              rowData={rows}
              columnDefs={columns}
              rowSelection={{ mode: 'multiRow', checkboxes: true, headerCheckbox: false, enableClickSelection: true }}
              getRowId={p => String(p.data.personId)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Typography.Text strong>알림내용</Typography.Text>
            <Typography.Text style={{ color: '#DD5E5E' }}>※ 해당 사용자가 오프라인 상태일 경우 알림이 발송되지 않습니다 ※</Typography.Text>
            {/* [E1] label01.MouseDown (L75) → Emp00_Popup_Example 열기 (알림설정방법 이미지) */}
            <a style={{ color: '#4B81B9' }} onClick={() => setExampleOpen(true)}>(최소화 상태에서 알림받는 방법보기)</a>
          </div>
          <Input.TextArea style={{ flex: 1, resize: 'none' }} value={text} onChange={e => setText(e.target.value)} />
        </div>
      </LookupModal>
      {/* Emp00_Popup_Example (L15-43): 700×800 "알림설정방법", 이미지 클릭 → 닫기 */}
      <Modal open={exampleOpen} title="알림설정방법" width={700} footer={null} onCancel={() => setExampleOpen(false)}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 } }}>
        <img src="./img/example/websocket_example.png" alt="" style={{ width: '98%', cursor: 'pointer' }}
          onClick={() => setExampleOpen(false)} />
      </Modal>
    </>
  );
};
