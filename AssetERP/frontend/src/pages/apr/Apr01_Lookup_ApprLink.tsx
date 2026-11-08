/**
 * 상신문서 선택 창 (V34) — 이행점검 보고서(A94)처럼 연결된 결재문서가 둘 이상일 때 [문서보기]가 연다.
 * AS-IS: myApp/client/vi/apr/Apr01_Lookup_ApprLink.java (209줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 checkJobOpen() L83-102: 위 = 버튼줄([조회]) + 아래 = 문서 MultiGrid(행번호 30 · 선택 30 · 상신일자 100 · 상신제목 400 · 상태 100 · 문서보기 80) + [닫기]
 * 12-화면우선원칙: 스크롤이 생기지 않도록 폭을 열 합계 + 안쪽 여백(행번호·선택 60, 여백 130)을 더해 880으로 둔다.
 * 범위: 이행점검(`CheckJob`) 목록으로 여는 길만 — 번호 목록으로 읽는다(selectByApprIdList). 링크코드·기준일로 읽는 `open(stdDate, linkCode)` 길(apr.Apr01_Appr.selectByLinkCode)은 쓰는 화면이 TOBE에 없어 다음 단계.
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message } from 'antd';
import { aprWriteApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprApprIdRow } from '@/types/apr';
import { Button } from '@/components/button';
import { MultiGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr01_Edit_ApprDoc } from './Apr01_Edit_ApprDoc';

const gb = gbFor<AprApprIdRow>();

interface Props {
  /** AS-IS checkJobOpen(list, "CheckJob", callBack)의 CheckJobList(연결된 문서 번호들) — 값이 있으면 열린다 */
  apprIds: number[] | null;
  /** [닫기] → callback.execute(), hide() — 부르는 쪽이 결재상태를 다시 읽는다 */
  onClosed?: () => void;
  onClose: () => void;
}

export const Apr01_Lookup_ApprLink: React.FC<Props> = ({ apprIds, onClosed, onClose }) => {
  const [rows, setRows] = useState<AprApprIdRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewApprId, setViewApprId] = useState<number | null>(null);

  // retrieve() L174-203: apr.Apr01_Appr.selectByApprIdList(companyId, CheckJobList)
  const retrieve = useCallback(async () => {
    if (apprIds == null) return;
    setLoading(true);
    try {
      setRows(await aprWriteApi.searchByApprIds(apprIds));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [apprIds]);

  // [E0] 화면 열림 (checkJobOpen L83-102) → retrieve()
  const retrieveRef = useRef(retrieve);
  retrieveRef.current = retrieve;
  useEffect(() => {
    if (apprIds != null) void retrieveRef.current();
    else setRows([]);
  }, [apprIds]);

  // [E3] actionCell (ImageCell "View").callbackOnCreate (L128-160): apprId가 없으면 "문서가 존재하지않습니다", 있으면 ApprCallbackResult + Apr01_Edit_ApprDoc.retrieveApproval (닫으면 retrieve())
  const viewAppr = (row: AprApprIdRow) => {
    if (row.apprId == null) { message.warning('문서가 존재하지않습니다'); return; }
    setViewApprId(row.apprId);
  };

  // buildGrid() L127-172
  const columnDefs = useMemo(() => [
    gb.date('regDate', 100, '상신일자'),  // L166
    gb.text('title', 400, '상신제목'),  // L167
    gb.textCenter('statusName', 100, '상태'),  // L168
    iconCell<AprApprIdRow>('view', 'actionCell', 80, '문서보기', viewAppr),  // L169
  ], []);

  const close = () => {
    onClosed?.();   // [E2] cancelButton[닫기].Select (L111) → callback(), hide()
    onClose();
  };

  return (
    <>
      <LookupModal
        open={apprIds != null}
        title="상신문서"
        width={880}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={close}
        destroyOnClose
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 }, footer: { borderTop: '1px solid #d9d9d9', paddingTop: 12, marginTop: 12 } }}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button type="close" onClick={close}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ textAlign: 'right' }}>
            {/* [E1] retrieveButton[조회].Select (L105) → retrieve() */}
            <Button type="search" onClick={retrieve}>조회</Button>
          </div>
          <div style={{ height: 'min(360px, calc(100vh - 300px))' }}>
            <MultiGrid<AprApprIdRow>
              rowClick
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.apprId)}
              loading={loading}
            />
          </div>
        </div>
      </LookupModal>
      <Apr01_Edit_ApprDoc apprId={viewApprId} onClosed={() => void retrieve()} onClose={() => setViewApprId(null)} />
    </>
  );
};
