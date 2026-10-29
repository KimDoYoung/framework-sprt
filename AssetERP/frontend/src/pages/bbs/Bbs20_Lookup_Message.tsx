/**
 * 문자발송 창 — Bbs20_Tab_FloralRequestMng 행의 [문자발송] 아이콘에서 연다 (T21)
 * AS-IS: myApp/client/vi/bbs/Bbs20_Lookup_Message.java (196줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L63-87: 모달 700×500 "문자발송", 툴바(검색 300 "사원명/부서명/사원번호" · [조회]), 그리드(조직 200·직책 120·사번 80·성명 100·발령일 100, 체크 다중), 아래 가운데 [발송][닫기]
 * open(option, model) L53-61: option "02"면 검색칸을 신청자 이름으로 채우고 조회한다
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { message, Space } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';
import { bbsFloralApi } from '@/api/bbs';
import { errorMessage } from '@/api/client';
import { empApi } from '@/api/emp';
import { BbsFloralRequest } from '@/types/bbs';
import { TransInfo } from '@/types/emp';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SearchBar } from '@/components/search';

const gb = gbFor<TransInfo>();

interface Props {
  /** open(option, selectModel) — 값이 있으면 열린다 */
  target: { option: '01' | '02'; model: BbsFloralRequest } | null;
  onClose: () => void;
}

export const Bbs20_Lookup_Message: React.FC<Props> = ({ target, onClose }) => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<TransInfo>>(null);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<TransInfo[]>([]);
  const [sending, setSending] = useState(false);

  // retrieve() L172-187: 서비스 emp.Emp00_TransInfo.selectByText(companyId, "%검색어%", 오늘, transCode "100", isSeparateAddTitle false)
  const retrieve = async (text: string) => {
    try {
      setRows(await empApi.searchTransInfos(dayjs().format('YYYY-MM-DD'), text, '100', false));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L63-87, open L53-61) → settings(), show() · option "02"면 검색칸 = 신청자 이름
  useEffect(() => {
    if (!target) return;
    const text = target.option === '02' ? target.model.personName ?? '' : '';
    setSearchText(text);
    setRows([]);
    void retrieve(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // [E3] updateButton[발송].Select (L106) → sendMessage() L132-162
  const sendMessage = async () => {
    if (!target) return;
    const checked = gridRef.current?.api?.getSelectedRows() ?? [];
    if (checked.length === 0) { message.warning('발송할 사원정보를 선택해주세요'); return; }
    const m = target.model;
    const content = target.option === '01'
      ? `[Asset-ERP] '${user.name}'가 '${m.reason ?? ''}'로 화환을 신청하였습니다.`
      : `[Asset-ERP] ${m.personName ?? ''}님의  화환이 ${m.statusName ?? ''}되었습니다.`;
    setSending(true);
    try {
      await bbsFloralApi.sendMessage(content, checked.map(r => r.personId));
      message.success('정상적으로 발송완료되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '일치하는 정보가 없습니다'));
    } finally {
      setSending(false);
    }
  };

  // buildGrid() L120-130
  const columnDefs = useMemo(() => [
    gb.text('parentFullNm', 200, '조직'),  // L124
    gb.text('titleNm', 120, '직책'),  // L125
    gb.text('empNo', 80, '사번'),  // L126
    gb.text('korNm', 100, '성명'),  // L127
    gb.date('transDate', 100, '발령일'),  // L128
  ], []);

  return (
    <LookupModal
      open={target != null}
      title="문자발송"
      width={700}
      maskClosable={false}
      onCancel={onClose}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="send" onClick={sendMessage} loading={sending}>발송</Button>
            {/* [E4] closeButton[닫기].Select (L112) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E1] findTextField.KeyPress [Enter] (L92) → retrieve(), [E2] retrieveButton[조회].Select (L100) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 300 }} placeholder="사원명/부서명/사원번호" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <MultiGrid<TransInfo> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.transId)} rowClick />
        </div>
      </div>
    </LookupModal>
  );
};
