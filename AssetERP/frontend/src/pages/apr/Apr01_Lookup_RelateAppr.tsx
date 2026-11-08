/**
 * 연관문서 설정 창 (V16) — 결재완료(30) 문서에서 [연관문서설정]으로 연관문서를 더하거나 뺀다.
 * AS-IS: myApp/client/vi/apr/Apr01_Lookup_RelateAppr.java (173줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L53-115: 700×300 모달 "연관문서", 위 [등록][확정][새로고침], 단일 체크 그리드(구분 50 · 등록일 100 · 문서명 400 · 삭제 80), 푸터 [닫기]
 * 열면 바로 조회한다(retrieve). [확정]은 이 문서의 연관문서를 모두 지우고 창에 남은 줄을 넣는다.
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { aprDetailApi, aprRelateEditApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprLoadDoc2, AprRelateAppr } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Apr21_Lookup_RelateAppr } from './Apr21_Lookup_RelateAppr';

const gb = gbFor<AprRelateAppr>();

interface Props {
  /** open(apprModel, callback) — 값이 있으면 열린다 */
  apprId: number | null;
  /** [확정] 뒤와 [닫기] — AS-IS callback.execute(): 문서창이 연관 탭을 다시 읽는다 */
  onClosed: () => void;
  onClose: () => void;
}

export const Apr01_Lookup_RelateAppr: React.FC<Props> = ({ apprId, onClosed, onClose }) => {
  const [rows, setRows] = useState<AprRelateAppr[]>([]);
  const [loading, setLoading] = useState(false);
  const [pickOpen, setPickOpen] = useState(false);
  const tmpId = useRef(0);

  // retrieve() L137-148: apr.Apr21_RelateAppr.selectByApprId(companyId, apprId)
  const retrieve = useCallback(async () => {
    if (apprId == null) return;
    setLoading(true);
    try {
      setRows(await aprDetailApi.getRelateApprs(apprId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [apprId]);
  useEffect(() => {
    if (apprId == null) { setRows([]); return; }
    void retrieve();
  }, [apprId, retrieve]);

  // [E1] insertButton[등록].Select (L62) → Apr21_Lookup_RelateAppr(grid, apprId, callback) — 고른 문서마다 연관문서 한 줄을 맨 아래에 붙인다(03 원칙 17)
  const onApprsPicked = (list: AprLoadDoc2[]) => {
    setPickOpen(false);
    setRows(prev => [...prev, ...list.map<AprRelateAppr>(d => ({
      relateApprId: --tmpId.current, targetApprId: d.apprId, inOutTypeCode: d.inOutTypeCode, inOutTypeName: d.inOutTypeCode === '10' ? '대외' : '사내', targetRegDate: d.regDate, targetTitle: d.title,
    }))]);
  };

  // [E4] updateButton[확정].Select (L81) → update() L150-168: apr.Apr21_RelateAppr.insert → "연관문서 추가/삭제가 정상적으로 완료되었습니다", callback.execute()
  const update = async () => {
    if (apprId == null) return;
    try {
      await aprRelateEditApi.saveAfterApprs(apprId, rows.map(r => ({ relateApprId: r.relateApprId, targetApprId: r.targetApprId })));
      Modal.info({ title: '확인', content: '연관문서 추가/삭제가 정상적으로 완료되었습니다', okText: '확인' });
      onClosed();
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // buildGrid() L117-135: 삭제 아이콘 — 목록에서만 빼고 [확정]에서 반영
  const columnDefs = useMemo(() => [
    gb.textCenter('inOutTypeName', 50, '구분'),  // L129
    gb.date('targetRegDate', 100, '등록일'),  // L130
    gb.text('targetTitle', 400, '문서명'),  // L131
    iconCell<AprRelateAppr>('delete', 'deleteCell', 80, '삭제', row => setRows(prev => prev.filter(r => r.relateApprId !== row.relateApprId))),  // L132
  ], []);

  // [E5] closeButton[닫기].Select (L87) → callback.execute(), hide()
  const close = () => { onClosed(); onClose(); };

  return (
    <>
      <LookupModal
        open={apprId != null}
        title="연관문서"
        width={760}
        style={{ top: 20 }}
        maskClosable={false}
        onCancel={close}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={<div style={{ textAlign: 'center' }}><Button type="close" onClick={close}>닫기</Button></div>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button type="register" onClick={() => setPickOpen(true)}>등록</Button>
            <Button type="save" onClick={update}>확정</Button>
            {/* [E3] retrieveButton[새로고침].Select (L75) → retrieve() */}
            <Button type="reset" onClick={() => void retrieve()}>새로고침</Button>
          </div>
          <div style={{ height: 200 }}>
            <SingleGrid<AprRelateAppr>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.relateApprId)}
              loading={loading}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            />
          </div>
        </div>
      </LookupModal>
      {/* [E2] editor (Apr21_Lookup_RelateAppr).callbackOnCreate (L66) */}
      <Apr21_Lookup_RelateAppr open={pickOpen} onResult={onApprsPicked} onClose={() => setPickOpen(false)} />
    </>
  );
};
