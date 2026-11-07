/**
 * 증감액 상세 창 (X25) — Ast30_Tab_OfficeMngFeeState 펀드 그리드 행 더블클릭에서 연다
 * AS-IS: myApp/client/vi/ast/Ast30_Lookup_FeeDetail.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(corpId, fundCode, stdDate) L47-55: 모달 "증감액 상세" 500×350, 위 툴바(검색 200 "적요" · [조회]), 아래 그리드(4열, 체크박스 없음), 가운데 [닫기]. 열자마자 retrieve()
 * 열 폭 합계 50+200+50+120 = 420 (+행번호 약 60 + 여백 130 = 610) → 620 (AS-IS 500보다 커야 스크롤이 없다, 03 원칙 21)
 * 스타일: MG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { icamApi } from '@/api/icam';
import { errorMessage } from '@/api/client';
import { IcamFeeDetail } from '@/types/icam';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';

const gb = gbFor<IcamFeeDetail>();

/** AS-IS buildGrid() L105-115 */
const columnDefs = [
  gb.textCenter('rmkCode', 50, '적요코드'),
  gb.text('rmkName', 200, '적요명'),
  gb.textCenter('curCode', 50, '통화'),
  gb.double('fee', 120, '펀드보수'),
];

export interface FeeDetailTarget {
  corpId: number;
  fundCode: string;
  /** 'yyyy-MM-dd' */
  stdDate: string;
}

interface Props {
  /** 값이 있으면 열림 */
  target: FeeDetailTarget | null;
  onClose: () => void;
}

export const Ast30_Lookup_FeeDetail: React.FC<Props> = ({ target, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<IcamFeeDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // [E1] searchText.KeyPress [Enter] (L78)·[E3] retrieveButton[조회].Select (L97) → retrieve() L117-134: icam.Icam10_Fee.selectByFundCode(companyId, corpId, fundCode, stdDate, searchText)
  const retrieve = useCallback(async (text: string) => {
    if (!target) return;
    setLoading(true);  // grid.mask("Loading")
    try {
      setRows(await icamApi.searchFeesByFund({ corpId: target.corpId, fundCode: target.fundCode, stdDate: target.stdDate, searchText: text }));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid.unmask()
    }
  }, [target]);

  // [E0] 화면 열림 (생성자 L57-73) → open() 마지막 줄 retrieve()
  useEffect(() => {
    setSearchText('');
    setRows([]);
    void retrieve('');
  }, [retrieve]);

  return (
    <LookupModal
      open={!!target}
      title="증감액 상세"
      width={620}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 0 } }}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E2] cancleButton[닫기].Select (L91) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 0', height: 'min(300px, calc(100vh - 250px))', boxSizing: 'border-box' }}>
        <SearchBar onSearch={() => retrieve(searchText)}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 200 }} placeholder="적요" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<IcamFeeDetail> rowData={rows} loading={loading} columnDefs={columnDefs} getRowId={p => p.data.rmkCode} />
        </div>
      </div>
    </LookupModal>
  );
};
