/**
 * [1344] 커뮤니티 > 01. 회사규정 > 회사규정 (Z01)  같은 클래스: 준법감시 > 02. 회사규정 > 회사규정 #1476
 * AS-IS: myApp/client/vi/bbs/Bbs15_Tab_CompanyRule.java (150줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L49-72: 가운데(여백 20, 테두리) = 툴바(구분 150 · 검색 "규정명" · [조회]) + 회사규정 그리드(SingleGrid, 행번호)
 * 함께: Bbs15_Lookup_Content(내용 조회창, "상세보기" 아이콘) → Bbs02_Lookup_File(첨부파일, 사용자용)
 * 스타일: SG (견본 — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { errorMessage } from '@/api/client';
import { bbsApi } from '@/api/bbs';
import { BbsCompanyRule } from '@/types/bbs';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { Bbs15_Lookup_Content } from './Bbs15_Lookup_Content';

const gb = gbFor<BbsCompanyRule>();

export const Bbs15_Tab_CompanyRule: React.FC = () => {
  const [ruleType, setRuleType] = useState('%');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<BbsCompanyRule[]>([]);
  const [viewing, setViewing] = useState<BbsCompanyRule | null>(null);

  // retrieve() L125-139: bbs.Bbs15_CompanyRule.selectBySearchText (companyId·stdDate는 서버, searchText = '%' + 글자 + '%' — 서버가 감싼다)
  const retrieve = async (over?: { ruleType?: string }) => {
    try {
      setRows(await bbsApi.searchPublicCompanyRules(over?.ruleType ?? ruleType, searchText));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // [E0] 화면 열림 (생성자 L49-72) → settings(), retrieve()
  useEffect(() => { void retrieve(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // buildGrid() L103-123
  const columnDefs = useMemo(() => [
    gb.text('ruleTypeName', 150, '구분'),  // L113
    gb.textCenter('companyRuleCode', 100, '규정코드'),  // L114
    gb.text('title', 650, '회사규정명'),  // L115
    // L116 addCell(ImageCell("보기")) → viewContent() L141-145: 선택한 규정의 내용 조회창
    iconCell<BbsCompanyRule>('view', 'actionCell', 50, '상세보기', setViewing),
    gb.text('note', 350, '비고'),  // L117
    gb.date('revisionDate', 100, '제개정일'),  // L118
    gb.longCenter('revisionNo', 70, '개정회차'),  // L119
    gb.longCenter('fileCnt', 130, '규정 첨부파일 갯수'),  // L120
  ], []);

  return (
    <div style={{ height: '100%', padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L95) → retrieve() */}
        <SearchBar onSearch={() => void retrieve()}>
          <SearchBar.Field label="구분">
            {/* [E1] callbackOnCreate (L41) → retrieve() / [E3] companyRuleName[CompanyRuleType].Collapse (L88) → retrieve() */}
            <SystemCodeComboBox kindCd="CompanyRuleType" altCode={['%', '전체']} style={{ width: 150 }} value={ruleType}
              onChange={code => { const v = code ?? '%'; setRuleType(v); void retrieve({ ruleType: v }); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E2] searchTextField.KeyPress [Enter] (L77) → retrieve() */}
            <SearchBar.Input style={{ width: 230 }} placeholder="규정명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<BbsCompanyRule> rowData={rows} columnDefs={columnDefs} getRowId={p => String(p.data.companyRuleId)} />
        </div>
      </div>
      <Bbs15_Lookup_Content rule={viewing} onClose={() => setViewing(null)} />
    </div>
  );
};
