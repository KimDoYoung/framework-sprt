/**
 * 고객사 정보 조회창 (C06 연결, sys 도메인) — Sms03_Page_UserListAdmin의 "기타고객사 추가"에서 연다
 * AS-IS: myApp/client/vi/sys/Sys85_Lookup_ClientInfoList.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L55-86: 모달 900×500 "고객사 정보", 툴바(검색 + 조회·저장·등록·삭제 + 안내문) + 셀 편집 그리드(체크박스 다중), 하단 확인·닫기
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, message, Modal, Space, Typography } from 'antd';
import { sysApi } from '@/api/sys';
import { ClientInfo } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<ClientInfo>();

/** AS-IS buildGrid() */
const buildGrid = () => [
  gb.text('companyName', 250, '고객사', { editor: 'text' }),
  gb.text('orgName', 180, '부서명', { editor: 'text' }),
  gb.text('posName', 100, '직위', { editor: 'text' }),
  gb.text('clientName', 100, '사원명', { editor: 'text' }),
  gb.text('moblieTelno', 120, '휴대폰', { editor: 'text' }),
];

interface Props {
  open: boolean;
  /** AS-IS open(callback): 확인 → 고른 행 목록, 닫기 → onClose(callback 없음) */
  onResult: (rows: ClientInfo[]) => void;
  onClose: () => void;
}

const NEW_ROW: Partial<ClientInfo> = {};

export const Sys85_Lookup_ClientInfoList: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<ClientInfo>({
    idField: 'clientInfoId',
    // retrieve() L147-158: searchText("%…%" — 서버) → sys.Sys85_ClientInfo.selectByText
    search: useCallback(() => sysApi.searchClientInfos(searchText), [searchText]),
    // update() L167-170: GridUpdate → sys.Sys85_ClientInfo.update
    save: sysApi.updateClientInfos,
    remove: sysApi.deleteClientInfos,
    // insert() L160-165: 빈 행(등록일은 서버가 저장할 때 오늘로)
    newRow: useCallback(() => NEW_ROW, []),
    firstEditField: 'companyName',
    // delete() L172-176: 확인 창 없이 GridDeleteData
    deleteConfirm: false,
  });

  // [E0] 화면 열림 (생성자 L55-86) → settings(), show(), retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    crud.retrieve();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E5] confirmButton[확인].Select [선택>0] (L115) → callback.execute(선택 목록), hide()
  const confirm = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) {
      message.warning('고객사 정보를 선택해주세요');
      return;
    }
    onResult(selected);
  };

  return (
    <Modal
      open={open}
      title="고객사 정보"
      width={900}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            {/* [E6] closeButton[닫기].Select (L127) → hide() */}
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space wrap>
          <Typography.Text strong>검색</Typography.Text>
          <Input style={{ width: 300 }} placeholder="고객사/부서명/직위/사원명/휴대폰/비고"
            value={searchText} onChange={e => setSearchText(e.target.value)} />
          {/* [E1] retrieveButton[조회].Select (L91) → retrieve() */}
          <Button type="search" onClick={crud.retrieve}>조회</Button>
          {/* [E2] updateButton[저장].Select (L97) → update() */}
          <Button type="save" onClick={crud.saveRows}>저장</Button>
          {/* [E3] insertButton[등록].Select (L103) → insert() */}
          <Button type="register" onClick={crud.addRow}>등록</Button>
          {/* [E4] deleteButton[삭제].Select (L109) → delete() */}
          <Button type="delete" onClick={crud.deleteChecked}>삭제</Button>
          <Typography.Text style={{ color: '#4472C4' }}>※  '가나다' 순으로 정렬</Typography.Text>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<ClientInfo> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </Modal>
  );
};
