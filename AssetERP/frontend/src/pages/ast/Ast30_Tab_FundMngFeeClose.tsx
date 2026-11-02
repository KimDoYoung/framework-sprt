/**
 * [1218] 관리회계 > 30. 펀드운용보수관리 > 운용보수 회계처리 (X35)
 * AS-IS: myApp/client/vi/ast/Ast30_Tab_FundMngFeeClose.java (396줄) + Ast06_Grid_Journal.java (143줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L64-83: BorderLayout 위 = 툴바 50(여백 20,20,0,20: 결산년월 70 · [조회][결산처리][결산취소] · [출력/다운로드] · [보수원장정리])
 *   + 가운데 그리드(행번호·체크 다중·4열, 맨 아래 합계 행 getSumGrid("계",2,5,5)), 아래 300(여백 0,20,20,20) = Ast06_Grid_Journal
 * 스타일: GG (견본 Est02_Tab_PfResultReport — docs/page-style.md). 툴바는 한 줄이라 SearchBar, 원본 툴바의 [결산처리]부터는 extra
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 읽기 전용 날짜 열 폭 90(UX-08, 원본 100). 결산년월 입력 폭 100(12 원칙 7, 원본 70)
 * X13(사무보수 `Ast30_Tab_OfficeMngFeeClose`)의 짝 — 같은 서버 `ast/fund-fee-closes`(조회·처리·취소·보수원장정리)를 쓰고, 운용사·검색 칸·[변경] 아이콘이 없으며 출력(RD)만 별도(`fund-rd`)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Modal, Splitter } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { AgGridReact } from 'ag-grid-react';
import { astApi } from '@/api/ast';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { AstFundFeeClose } from '@/types/ast';
import { useLoginUser } from '@/hooks/useLoginUser';
import { MultiGrid, gbFor } from '@/components/grid';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { RdViewer } from '@/components/lookup/RdViewer';
import { Ast06_Grid_Journal, Ast06_Grid_JournalHandle } from './Ast06_Grid_Journal';

const gb = gbFor<AstFundFeeClose>();
const FORMAT = 'YYYY-MM-DD';

export const Ast30_Tab_FundMngFeeClose: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<AstFundFeeClose>>(null);
  const journalRef = useRef<Ast06_Grid_JournalHandle>(null);
  // [E0] 화면 열림 (생성자 L64-83) → setting() L85-190: 결산년월 = 지난달(이번 달 1일의 전날) `YYYY.MM` → retrieve()
  const [yyyyMM, setYyyyMM] = useState(() => dayjs().startOf('month').subtract(1, 'day').format('YYYY.MM'));
  const [rows, setRows] = useState<AstFundFeeClose[]>([]);
  const [loading, setLoading] = useState(false);
  const [rdUrl, setRdUrl] = useState<string | null>(null);

  /** getCloseDate() L376-382: 결산년월의 말일 (형식이 틀리면 null) */
  const getCloseDate = (): Dayjs | null => {
    const m = dayjs(yyyyMM.replace(/-/g, '.') + '.01', 'YYYY.MM.DD', true);
    return m.isValid() ? m.endOf('month') : null;
  };
  const checkDate = (): Dayjs | null => {
    const d = getCloseDate();
    if (!d) message.warning('결산년월을 확인하세요. (YYYY.MM)');
    return d;
  };

  // retrievePage() L226-241: ast.Ast06_Tr.selectById(trId) → 분개 그리드 retrieve(journalId, date). 결산 전 행은 거래가 없어 비운다
  const retrievePage = async (row: AstFundFeeClose | undefined) => {
    if (!row || row.trId == null) { journalRef.current?.clear(); return; }
    try {
      const tr = await astApi.getTr(row.trId);
      await journalRef.current?.retrieve(tr.journalId);
    } catch (err) {
      message.error(errorMessage(err, '분개 조회 실패'));
    }
  };

  // retrieve() L204-224: ast.Ast30_BookFundFee.selectEvalFundFee(companyId, holdDate, corpIdStr=null, searchText=null) → 첫 행 선택 → retrievePage()
  // [E1] yyyyMM.KeyPress [Enter] (L94) / [E2] retrieveButton[조회].Select (L117) → retrieve()
  const retrieve = async () => {
    const close = checkDate();
    if (!close) return;
    setLoading(true);
    journalRef.current?.clear();
    try {
      const list = await astApi.searchFundFeeCloses({ holdDate: close.format(FORMAT) });
      setRows(list);
      const first = list[0];
      if (first) {
        setTimeout(() => gridRef.current?.api?.getRowNode(String(first.keyId))?.setSelected(true), 0);
        await retrievePage(first);
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // 화면을 열 때 한 번 조회 (setting() 끝의 retrieve())
  useEffect(() => { void retrieve(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const checked = () => gridRef.current?.api.getSelectedRows() ?? [];

  // [E3] updateButton[결산처리].Select (L123) / [E4] deleteButton[결산취소].Select (L129) → preCheck("P"|"C") L243-319:
  //   선택 없음 "처리대상을 선택해주세요." → 결산일 미래일 "결산일이 미래일입니다." → 확인(300) "N건의 결산을 처리|취소하시겠습니까?" → [E8]·[E9] YES → 회계마감 검사(서버) → update() L321-344
  const preCheck = (procType: 'P' | 'C') => {
    const sel = checked();
    if (sel.length === 0) { message.warning('처리대상을 선택해주세요.'); return; }
    if (dayjs(sel[0].holdDate).isAfter(dayjs(), 'day')) { message.warning('결산일이 미래일입니다.'); return; }
    const title = procType === 'P' ? '결산처리' : '결산취소';
    Modal.confirm({
      title, width: 300, okText: '예', cancelText: '아니오',
      content: procType === 'P' ? `${sel.length}건의 결산을 처리하시겠습니까?` : `${sel.length}건의 결산을 취소하시겠습니까?`,
      onOk: async () => {
        try {
          if (procType === 'P') await astApi.processFundFeeCloses(sel);
          else await astApi.cancelFundFeeCloses(sel);
          message.success(procType === 'P' ? '결산처리가 완료되었습니다.' : '결산취소가 완료되었습니다.');
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, title + ' 실패'));
        }
      },
    });
  };

  // [E5] reprocFundFeeButton[보수원장정리].Select (L135) → reprocFundFee() L346-366: ast.Ast30_BookFundFee.reprocFundFee(closeDate) → "보수원장 정리가 완료 되었습니다"
  const reprocFundFee = async () => {
    const close = checkDate();
    if (!close) return;
    setLoading(true);
    try {
      await astApi.reprocFundFee(close.format(FORMAT));
      message.info('보수원장 정리가 완료 되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '보수원장 정리 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E6] downloadButton[출력/다운로드].Select [result.getStatus() == 1] (L141) → sys.Sys99_Print.insertRdFundMngFeeClose → RDViewer(mrd Ast30_Rd_FundMngFeeClose, rv rdGroupId·companyId·personId·Date "yyyy년 MM월")
  const download = async () => {
    const close = checkDate();
    if (!close) return;
    setLoading(true);
    try {
      const groupId = await astApi.rdFundMngFeeClose({ holdDate: close.format(FORMAT) });
      const res = await rdApi.buildUrl({
        kind: 'viewer', mrd: 'Ast30_Rd_FundMngFeeClose', options: '/rhtmlimportopt [2]',
        rv: { rdGroupId: String(groupId), companyId: String(user.companyId), personId: String(user.userId), Date: close.format('YYYY년 MM월') },
      });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setLoading(false);
    }
  };

  // buildGrid() L192-202 (analysis grid): setChecked(MULTI), getSumGrid("계", 2, 5, 5)
  const columnDefs = useMemo(() => [
    gb.textCenter('closeYnName', 80, '결산여부'),   // L196
    gb.date('holdDate', 90, '결산일자'),            // L197 (UX-08 폭 90, 원본 100)
    gb.text('trName', 220, '거래유형'),             // L198
    gb.long('fee', 150, '누적보수'),                // L199
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={120}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <SearchBar
                onSearch={() => void retrieve()}
                loading={loading}
                extra={<>
                  <Button type="save" onClick={() => preCheck('P')}>결산처리</Button>
                  <Button type="cancel" onClick={() => preCheck('C')}>결산취소</Button>
                  <Button type="download" onClick={download}>출력/다운로드</Button>
                  <Button type="reset" onClick={reprocFundFee}>보수원장정리</Button>
                </>}
              >
                <SearchBar.Field label="결산년월">
                  <Input style={{ width: 100 }} placeholder="YYYY.MM" value={yyyyMM} onChange={e => setYyyyMM(e.target.value)} onPressEnter={() => void retrieve()} />
                </SearchBar.Field>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
                {/* [E7] grid.RowClick (L182) → retrievePage(): 고른 행의 분개를 다시 읽는다 */}
                <MultiGrid<AstFundFeeClose> gridRef={gridRef} rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.keyId)}
                  sumRow={{ labelField: 'closeYnName', label: '계', sum: ['fee'] }}
                  onRowClicked={e => { if (e.data) void retrievePage(e.data); }} />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={300} min={200}>
          <div style={{ height: '100%', padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
            <Ast06_Grid_Journal ref={journalRef} />
          </div>
        </Splitter.Panel>
      </Splitter>
      <RdViewer url={rdUrl} title="운용보수 회계처리" onClose={() => setRdUrl(null)} />
    </div>
  );
};
