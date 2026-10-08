/**
 * 조직찾기 조회창 (C01에서 처음 씀) — openFixDate(기준일 고정)만 변환했다.
 * AS-IS: myApp/client/vi/org/Org00_Lookup_SelectSingle.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 쓰는 곳: Emp03_Edit_Person(조직, 기준일 = 입사일), Emp03_TabPage_Trans(발령조직, 기준일 = 발령일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatePicker, Input, message, Modal, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { AgGridReact } from 'ag-grid-react';
import { orgApi } from '@/api/emp';
import { errorMessage } from '@/api/client';
import { OrgInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { gbFor } from '@/components/grid';
import { BaseGrid } from '@/components/grid/BaseGrid';

const gb = gbFor<OrgInfo>();

/** AS-IS buildGrid() L193-203 (setChecked SINGLE). openFixDate는 setHidden(3) → parentFullName을 숨긴다(행번호0·체크1 다음 3번째) */
const buildGrid = () => [
  gb.textCenter('orgCd', 80, '조직코드'),  // L198
  gb.text('parentFullNm', 270, '본부(실)명', { hide: true }),  // L199 (openFixDate L77-83 → open() L111 setHidden(3))
  gb.text('korNm', 350, '본부(실)명'),  // L200
];

interface Props {
  /** 'yyyy-MM-dd' 기준일 — 있으면 열린다 (AS-IS openFixDate(baseDate, callback)) */
  baseDate?: string;
  onClose: () => void;
  /** AS-IS callback.execute(orgCodeModel) */
  onSelect: (org: OrgInfo) => void;
}

export const Org00_Lookup_SelectSingle: React.FC<Props> = ({ baseDate, onClose, onSelect }) => {
  const gridRef = useRef<AgGridReact<OrgInfo>>(null);
  const [korName, setKorName] = useState('');
  const [rows, setRows] = useState<OrgInfo[]>([]);
  const columnDefs = useMemo(buildGrid, []);

  // retrieve() L205-236: openFixDate는 selectByKorName(companyId, korName, baseDate)
  const retrieve = useCallback(async () => {
    if (!baseDate) return;
    try {
      setRows(await orgApi.searchOrgInfos(korName, baseDate));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [korName, baseDate]);

  // [E4]·[E5] allButton[전체](allButtonYn=false라 openFixDate에는 없음) / cancelButton[닫기].Select (L155) → hide()
  const hide = () => { setKorName(''); setRows([]); onClose(); };

  // [E3] oKButton[확인].Select (L142) / [E6] grid.CellDoubleClick (L183) → confirm() L238-251
  const confirm = () => {
    const org = gridRef.current?.api.getSelectedRows()[0];
    if (!org) {
      message.warning('조직을 선택해주세요');
      return;
    }
    onSelect(org);
    hide();
  };

  // open() L103-191 끝: show() → retrieve()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (baseDate) retrieve(); }, [baseDate]);

  return (
    <Modal
      open={!!baseDate}
      title="조직찾기"
      width={450}
      maskClosable={false}
      onCancel={hide}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="save" onClick={confirm}>확인</Button>
            <Button type="close" onClick={hide}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          <Typography.Text strong>기준일</Typography.Text>
          {/* openFixDate L77-83: 기준일 읽기 전용 */}
          <DatePicker style={{ width: 120 }} value={baseDate ? dayjs(baseDate) : null} disabled format="YYYY-MM-DD" />
          <Typography.Text strong>조직명</Typography.Text>
          {/* [E1] korName.KeyPress [Enter] (L126) → retrieve() */}
          <Input style={{ width: 100 }} value={korName} onChange={e => setKorName(e.target.value)} onPressEnter={retrieve} />
          {/* [E2] retrieveButton[조회].Select (L135) → retrieve() */}
          <Button type="search" onClick={retrieve}>조회</Button>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <BaseGrid<OrgInfo>
            gridRef={gridRef}
            rowData={rows}
            columnDefs={columnDefs}
            getRowId={p => String(p.data.orgCodeId)}
            rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            onRowDoubleClicked={confirm}
          />
        </div>
      </div>
    </Modal>
  );
};
