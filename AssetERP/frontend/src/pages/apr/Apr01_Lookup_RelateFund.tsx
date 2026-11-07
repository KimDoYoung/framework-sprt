/**
 * 연관펀드 설정 창 (V16) — 결재완료(30) 문서에서 [연관펀드설정]으로 연관펀드를 더하거나(결재이후) 뺀다.
 * AS-IS: myApp/client/vi/apr/Apr01_Lookup_RelateFund.java (209줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L56-145: 700×300 모달 "연관펀드", 위 [등록][확정][새로고침], 단일 체크 그리드(펀드유형 80 · 코드 90 · 연관펀드명 350 · 삭제 35 · 결재이후 70), 푸터 [닫기]
 * 열면 바로 조회한다(retrieve). 조회(apr03_relate_fund.selectByAfterYn)는 afterYn 조건이 없어 문서의 연관펀드 전부가 나온다(이상한점 #42).
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { aprRelateEditApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprAfterFund } from '@/types/apr';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Fnd01_Lookup_SelectMulti } from '@/components/lookup/Fnd01_Lookup_SelectMulti';
import { FundMulti } from '@/types/fnd';

const gb = gbFor<AprAfterFund>();

interface Props {
  /** open(apprModel, callback) — 값이 있으면 열린다 */
  apprId: number | null;
  /** [확정] 뒤와 [닫기] — AS-IS callback.execute(): 문서창이 연관 탭을 다시 읽는다 */
  onClosed: () => void;
  onClose: () => void;
}

export const Apr01_Lookup_RelateFund: React.FC<Props> = ({ apprId, onClosed, onClose }) => {
  const [rows, setRows] = useState<AprAfterFund[]>([]);
  const [loading, setLoading] = useState(false);
  const [pickOpen, setPickOpen] = useState(false);
  const tmpId = useRef(0);

  // retrieve() L173-184: apr.Apr03_RelateFund.selectByAfterYn(apprId, afterYn=true)
  const retrieve = useCallback(async () => {
    if (apprId == null) return;
    setLoading(true);
    try {
      setRows(await aprRelateEditApi.getAfterFunds(apprId));
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

  // [E1] insertButton[등록].Select (L65) → Fnd01_Lookup_SelectMulti.open(이미 있는 펀드 ID, callback) L65-104:
  //   고른 펀드마다 연관펀드 한 줄 — 결재이후(afterYn)=true, 출력(printYn)=false, 맨 아래에 붙인다(03 원칙 17)
  const onFundsPicked = (list: FundMulti[]) => {
    setRows(prev => [...prev, ...list.map<AprAfterFund>(f => ({
      relateFundId: --tmpId.current, fundId: f.fundId, fundTypeName: f.kofiaFundTypeName, fundCode: f.fundCode, fundName: f.fundName, printYn: 'false', afterYn: 'true',
    }))]);
  };

  // [E3] updateButton[확정].Select (L111) → update() L186-204: apr.Apr03_RelateFund.insert → "연관펀드 추가/삭제가 정상적으로 완료되었습니다", callback.execute()
  const update = async () => {
    if (apprId == null) return;
    try {
      await aprRelateEditApi.saveAfterFunds(apprId, rows.map(r => ({ relateFundId: r.relateFundId, fundId: r.fundId, printYn: r.printYn, afterYn: r.afterYn })));
      Modal.info({ title: '확인', content: '연관펀드 추가/삭제가 정상적으로 완료되었습니다', okText: '확인' });
      onClosed();
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // buildGrid() L147-171: 삭제 아이콘 — 결재완료 이후 등록한 펀드만 지운다 (목록에서만 빼고 [확정]에서 반영)
  const columnDefs = useMemo(() => [
    gb.text('fundTypeName', 80, '펀드유형'),  // L164
    gb.text('fundCode', 90, '코드'),  // L165
    gb.text('fundName', 350, '연관펀드명'),  // L166
    iconCell<AprAfterFund>('delete', 'deleteCell', 35, '삭제', row => {  // L167
      if (row.afterYn !== 'true') {
        Modal.info({ title: '확인', content: '결재완료 이후 등록한 펀드만 삭제가능합니다', okText: '확인' });  // L155
        return;
      }
      setRows(prev => prev.filter(r => r.relateFundId !== row.relateFundId));
    }),
    gb.booleanYn2('afterYn', 70, '결재이후'),  // L168
  ], []);

  // [E4] closeButton[닫기].Select (L117) → callback.execute(), hide()
  const close = () => { onClosed(); onClose(); };

  return (
    <>
      <LookupModal
        open={apprId != null}
        title="연관펀드"
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
            {/* [E2] retrieveButton[새로고침].Select (L105) → retrieve() */}
            <Button type="reset" onClick={() => void retrieve()}>새로고침</Button>
          </div>
          <div style={{ height: 200 }}>
            <SingleGrid<AprAfterFund>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.relateFundId)}
              loading={loading}
              rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
            />
          </div>
        </div>
      </LookupModal>
      <Fnd01_Lookup_SelectMulti open={pickOpen} excludeIds={rows.map(r => r.fundId)} onSelect={list => { onFundsPicked(list); setPickOpen(false); }} onClose={() => setPickOpen(false)} />
    </>
  );
};
