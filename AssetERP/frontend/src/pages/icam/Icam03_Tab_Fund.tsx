/**
 * [1096] I/F > 10. ICAM > ICAM 펀드정보 (D07)
 * AS-IS: myApp/client/vi/icam/Icam03_Tab_Fund.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L56-138: west(580, 분할 조절 최대 800) = 툴바1(운용사 조회창 · 조회) + 툴바2(ICAM Get · 타사무 Get) + 그리드(펀드코드·펀드명·최신적용일),
 *   center = Icam03_Grid_Fund(선택한 펀드의 일자별 이력, 페이징 100)
 * UX보강(10): 툴바1 = SearchBar(UX-01). 조건이 1개라 초기화(UX-02) 없음
 * 버튼 type: 조회 `search`, ICAM Get·타사무 Get = `download`(원본 문구가 button-types에 없어 '외부에서 가져오기' 뜻으로 고름).
 * ICAM Get·타사무 Get(BatchMain 서블릿)은 외부 ICAM DB를 읽는 작업이라 서버가 거절한다 — 작업기록 의존
 */
import React, { useCallback, useState } from 'react';
import { message, Modal, Space, Splitter } from 'antd';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { Company } from '@/types/sys';
import { IcamFund } from '@/types/icam';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Sys01_Lookup_Company } from '@/components/lookup/Sys01_Lookup_Company';
import { SearchBar } from '@/components/search';
import { Icam03_Grid_Fund } from './Icam03_Grid_Fund';

const gb = gbFor<IcamFund>();

/** AS-IS buildGrid() L140-149 (체크박스 없음 — L143 주석) */
const columnDefs = [
  gb.textCenter('fundCd', 70, '펀드코드'),  // L144
  gb.text('fundNm', 350, '펀드명'),  // L145
  gb.date('stdDate', 90, '최신적용일'),  // L146
];

// [E0] 화면 열림 (생성자 L56-138) → 운용사 칸(읽기 전용)·툴바·그리드 구성. 열 때 조회하지 않는다
export const Icam03_Tab_Fund: React.FC = () => {
  const [lookupOpen, setLookupOpen] = useState(false);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyText, setCompanyText] = useState('');
  const [rows, setRows] = useState<IcamFund[]>([]);
  /** 위쪽 그리드에서 고른 펀드 — 오른쪽 이력의 조건 */
  const [selected, setSelected] = useState<IcamFund | null>(null);
  /** 이력 조건으로 쓰는 회사 (조회한 때의 회사 — 조회 뒤 운용사를 바꿔도 이력은 그대로) */
  const [loadedCompanyId, setLoadedCompanyId] = useState<number | null>(null);

  // [E1] companyField.TriggerClick [result != null] (L60) → Sys01_Lookup_Company.open() L63-81: "[ICAM코드] 고객명"(코드가 없으면 고객명만), 선택안함이면 비움
  const onCompany = (company: Company | null) => {
    setLookupOpen(false);
    if (company) {
      setCompanyText(company.icamCompanyCd != null ? `[${company.icamCompanyCd}] ${company.companyNm}` : company.companyNm);
      setCompanyId(company.companyId);
    } else {
      setCompanyText('');
      setCompanyId(null);
    }
  };

  // retrieve() L237-254: 운용사가 없으면 "ICAM 운용사를 선택하여 주십시오." → 서비스 icam.Icam03_Fund.selectRecentFund(companyId) → 행이 있으면 첫 행 선택
  const retrieve = useCallback(async () => {
    if (companyId == null) {
      message.warning('ICAM 운용사를 선택하여 주십시오.');
      return;
    }
    try {
      const list = await icamApi.searchRecentFunds(companyId);
      setRows(list);
      setLoadedCompanyId(companyId);
      setSelected(list[0] ?? null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [companyId]);

  // batchCall() L199-211·batchCallExtr() L213-226: BatchMain?actionCode=icamFund|extrFund&companyId=…&worker=…
  const batchCall = async (actionCode: 'icamFund' | 'extrFund', target: string) => {
    try {
      await icamApi.runFundBatch(actionCode, target);
    } catch (err) {
      message.error(errorMessage(err, '실패'));
    }
  };

  // [E3] icamButton[ICAM Get].Select (L91) → icamFundGet() L151-173, [E4] extrButton[타사무 Get].Select (L97) → extrFundGet() L175-197
  // 운용사가 없으면 확인창(전체고객사) → [E6]·[E7] msgBox.DialogHide [YES] (L155·L179) → batchCall("ALL")·batchCallExtr("ALL"), 있으면 바로
  const batchGet = (actionCode: 'icamFund' | 'extrFund', question: string) => {
    if (companyId == null) {
      Modal.confirm({
        title: '확인',
        content: question,
        okText: '예',
        cancelText: '아니오',
        onOk: () => batchCall(actionCode, 'ALL'),
      });
    } else {
      void batchCall(actionCode, String(companyId));
    }
  };

  return (
    <>
    <Splitter style={{ height: '100%', background: '#fff' }}>
      <Splitter.Panel defaultSize={580} max={800} min={300}>
        <div style={{ height: '100%', boxSizing: 'border-box', padding: '20px 0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* [E2] retrieveButton[조회].Select (L84) → retrieve() */}
          <SearchBar onSearch={retrieve}>
            <SearchBar.Field label="운용사">
              <LookupInput width={250} value={companyText} onOpen={() => setLookupOpen(true)} onClear={() => onCompany(null)} />
            </SearchBar.Field>
          </SearchBar>
          <Space>
            <Button type="download" onClick={() => batchGet('icamFund', '전체고객사의 펀드정보를 가져오시겠습니까?')}>ICAM Get</Button>
            <Button type="download" onClick={() => batchGet('extrFund', '전체고객사의 타사무 펀드정보를 가져오시겠습니까?')}>타사무 Get</Button>
          </Space>
          <div style={{ flex: 1, minHeight: 0 }}>
            {/* [E5] grid.SelectionChanged (L104) → retrievePage() L228-234: 1건 선택이면 fundGrid.retrieve(companyId, fundCode), 아니면 setClear() */}
            <SingleGrid<IcamFund>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.fundId)}
              onSelect={row => setSelected(row ?? null)}
              onRowDataUpdated={e => {
                // retrieve() L249-251: 행이 있으면 첫 행 선택
                if (selected && !e.api.getSelectedRows().length) e.api.getRowNode(String(selected.fundId))?.setSelected(true, true);
              }}
            />
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel>
        <Icam03_Grid_Fund companyId={loadedCompanyId} fundCode={selected?.fundCd ?? null} />
      </Splitter.Panel>
    </Splitter>
    <Sys01_Lookup_Company open={lookupOpen} onResult={onCompany} onClose={() => setLookupOpen(false)} />
    </>
  );
};
