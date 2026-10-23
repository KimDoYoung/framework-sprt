/**
 * 이익제공(수령) 내용별 직원 자동등록 설정 (L01) — 이익제공 기준관리(#1130)의 [직원 자동등록 설정]이 연다
 * AS-IS: myApp/client/vi/biz/Biz04_Lookup_EmpSetup.java — 창 780x500(크기 고정), 제목 "이익제공(수령) 내용별 직원 자동등록 설정"
 * 레이아웃 L53-83: 위 = 툴바 [조회], 아래 = 왼쪽 290 목적 그리드(행번호, 이익제공(수령) 목적 200) | 오른쪽 내용 그리드(행번호, 이익제공(수령) 내용 250 · 자동등록 80 체크박스)
 * 창 아래 버튼(가운데): [저장] [닫기]
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import type { CellValueChangedEvent } from 'ag-grid-community';
import { bizProvideSetupApi } from '@/api/biz';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { BizProvideSetup } from '@/types/biz';
import { Code } from '@/types/sys';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';

const purGb = gbFor<Code>();
const gb = gbFor<BizProvideSetup>();

/** purBuildGrid() L117-124 */
const purColumns = [purGb.text('name', 200, '이익제공(수령) 목적')];  // L121

/** contentBuildGrid() L126-134 */
const contentColumns = [
  gb.text('provideContentName', 250, '이익제공(수령) 내용'),  // L130
  gb.boolean('empSetYn', 80, '자동등록', { editable: true }),  // L131
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Biz04_Lookup_EmpSetup: React.FC<Props> = ({ open, onClose }) => {
  const [purs, setPurs] = useState<Code[]>([]);
  const [contents, setContents] = useState<BizProvideSetup[]>([]);
  const purRef = useRef<Code | undefined>(undefined);
  /** 값이 바뀐 행(AS-IS getModifiedRecords) — 내용 코드 기준 */
  const changedRef = useRef<Set<string>>(new Set());

  // contentRetrieve() L153-164: 서비스 biz.Biz04_ProvideSetup.selectByProvidePurCode(providePurCode = 목적 코드 + "%")
  const contentRetrieve = useCallback(async (): Promise<void> => {
    const pur = purRef.current;
    if (!pur?.code) {
      message.info('이익제공(수령) 목적을 선택하세요');  // L156
      return;
    }
    try {
      setContents(await bizProvideSetupApi.searchProvideSetups(pur.code));
      changedRef.current = new Set();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // purRetrieve() L136-151: 서비스 sys.Sys09_Code.selectByCodeKind(kindCode = ProvidePurCode, 오늘 기준) → 목록이 있으면 첫 행을 선택하고 contentRetrieve()
  const purRetrieve = useCallback(async (): Promise<void> => {
    try {
      const list = await sysApi.searchCodes('ProvidePurCode');
      setPurs(list);
      if (list.length > 0) {
        purRef.current = list[0];
        await contentRetrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [contentRetrieve]);

  // [E0] 화면 열림 (생성자 L45-51, open() L53-83) → settings(), purRetrieve()
  useEffect(() => {
    if (!open) return;
    setPurs([]);
    setContents([]);
    purRef.current = undefined;
    changedRef.current = new Set();
    void purRetrieve();
  }, [open, purRetrieve]);

  // [E3] updateButton[저장].Select (L103) → update() L166-181: GridUpdate — 바뀐 행이 0건이면 서버도 안 부르고 메시지도 없다
  const update = async (): Promise<void> => {
    const changed = contents.filter(r => changedRef.current.has(r.provideContentCode));
    if (changed.length === 0) return;
    try {
      await bizProvideSetupApi.saveProvideSetups(changed);
      message.success('저장이 완료되었습니다.');  // L173
      await contentRetrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장실패-관리자에게 문의하세요'));  // L176
    }
  };

  return (
    <LookupModal
      open={open}
      title={<b style={{ color: '#0069B4' }}>이익제공(수령) 내용별 직원 자동등록 설정</b>}
      width={780}
      centered
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <Button type="save" onClick={update}>저장</Button>
          {/* [E4] closeButton[닫기].Select (L109) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* [E2] retrieveButton[조회].Select (L97) → purRetrieve() */}
          <Button type="search" onClick={purRetrieve}>조회</Button>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: 0, border: '1px solid #d9d9d9' }}>
          <div style={{ width: 290, minHeight: 0 }}>
            {/* [E1] purGrid.RowClick (L90) → contentRetrieve() */}
            <SingleGrid<Code>
              rowData={purs}
              columnDefs={purColumns}
              getRowId={p => p.data.code}
              onRowClicked={e => { purRef.current = e.data; void contentRetrieve(); }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SingleGrid<BizProvideSetup>
              rowData={contents}
              columnDefs={contentColumns}
              getRowId={p => p.data.provideContentCode}
              onCellValueChanged={(e: CellValueChangedEvent<BizProvideSetup>) => {
                if (e.oldValue !== e.newValue) changedRef.current.add(e.data.provideContentCode);
              }}
            />
          </div>
        </div>
      </div>
    </LookupModal>
  );
};
