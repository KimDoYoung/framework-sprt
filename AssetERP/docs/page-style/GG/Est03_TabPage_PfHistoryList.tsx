/**
 * 일정별 용역 수행내역 (Q12) — Est02_Tab_PfResultReport 아래 330 영역 (읽기 전용 목록)
 * AS-IS: myApp/client/vi/est/Est03_TabPage_PfHistoryList.java (142줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L35-49: 툴바 50("▶ 일정별 용역 수행내역") + 그리드(행번호, 단일 선택, 테두리). 증빙자료 아이콘 → Est04_Lookup_PfFile
 * statusCheck() L126-137(모든 수행내역이 승인 20인가)은 부모(결재 아이콘)가 쓰므로 부모가 같은 API로 다시 읽어 확인한다
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { estApi } from '@/api/est';
import { errorMessage } from '@/api/client';
import { PfHistory } from '@/types/est';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Est04_Lookup_PfFile } from './Est04_Lookup_PfFile';

const gb = gbFor<PfHistory>();

interface Props {
  /** retrieve(pfContractId) L75-89 — null이면 비운다 */
  pfContractId: number | null;
  /** 같은 계약을 다시 눌러도 다시 읽도록 부모가 올린다 */
  nonce: number;
}

export const Est03_TabPage_PfHistoryList: React.FC<Props> = ({ pfContractId, nonce }) => {
  const [rows, setRows] = useState<PfHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileHistoryId, setFileHistoryId] = useState<number | null>(null);

  // retrieve(pfContractId) L75-89: est.Est03_PfHistory.selectByPfContractId(companyId, pfContractId)
  const retrieve = useCallback(async () => {
    if (pfContractId == null) { setRows([]); return; }
    setLoading(true);
    try {
      setRows(await estApi.searchPfHistories(pfContractId));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [pfContractId]);

  useEffect(() => { void retrieve(); }, [retrieve, nonce]);

  // buildGrid() L51-73
  const columnDefs = useMemo(() => [
    gb.longCenter('no', 50, '연번'),
    gb.date('startDate', 100, '수행시작일'),
    gb.date('closeDate', 100, '수행종료일'),
    gb.text('content', 350, '용역수행내역'),
    gb.text('detail', 450, '용역수행내역상세'),
    gb.text('orgName', 150, '담당부서'),
    gb.text('fileCountStr', 100, '증빙자료'),
    // actionCell L52-59: Est04_Lookup_PfFile.open(selectModel.getPfHistoryId())
    iconCell<PfHistory>('view', 'viewAction', 50, ' ', row => setFileHistoryId(row.pfHistoryId)),
    gb.textCenter('statusName', 100, '승인상태'),
  ], []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: '#fff' }}>
      {/* [E0] 화면 열림 (생성자 L35-49) */}
      <div style={{ height: 40, flex: 'none', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 14, fontWeight: 'bold' }}>
        ▶ 일정별 용역 수행내역
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <SingleGrid<PfHistory>
          rowData={rows}
          loading={loading}
          columnDefs={columnDefs}
          getRowId={p => String(p.data.pfHistoryId)}
        />
      </div>
      <Est04_Lookup_PfFile pfHistoryId={fileHistoryId} onClose={() => setFileHistoryId(null)} />
    </div>
  );
};
