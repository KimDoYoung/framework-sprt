/**
 * [1005] 문서작성 > 02. 문서검색 > 펀드별 문서검색 (F06, 1단계)
 * AS-IS: myApp/client/vi/apr/Apr01_Tab_FundDocument.java (212줄) + Apr01_Grid_FundDocList.java (72줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L49-98: 위(250, 분할 가능, 여백 20·20·0·20) = 박스(툴바 50 + 펀드 그리드) / 아래 = 문서 그리드(Apr01_Grid_FundDocList, 여백 20)
 * 1단계(F01~F05와 같은 사유): 상세보기 아이콘이 여는 전자결재 편집창 Apr01_Edit_ApprDoc은 다른 도메인(apr)이라 다음 단계에서 연결한다 — 지금은 안내만 띄운다.
 * UX보강(10): 툴바 = SearchBar(UX-01·04). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useMemo, useRef, useState } from 'react';
import { Checkbox, message, Splitter } from 'antd';
import { aprApi } from '@/api/apr';
import { fndApi } from '@/api/fnd';
import { errorMessage } from '@/api/client';
import { AprFundDoc } from '@/types/apr';
import { FundCode } from '@/types/fnd';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { SearchBar } from '@/components/search';
import { SystemCodeComboBox } from '@/components/form/SystemCodeComboBox';

const gbFund = gbFor<FundCode>();
const gbDoc = gbFor<AprFundDoc>();
const ALL = '%';
/** 콤보 "전체"(ComboBoxField(kind, "%", "전체")) */
const ALL_CODE: [string, string] = [ALL, '전체'];

export const Apr01_Tab_FundDocument: React.FC = () => {
  // [E0] 화면 열림 (생성자 L49-98) → settings() L100-148 — 열 때 자동 조회는 없다
  // settings() L100-148: 펀드유형·클래스구분 "전체", 해지펀드포함 해제, 클래스펀드&차등분배형 제외 체크
  const [fundTypeCode, setFundTypeCode] = useState<string>(ALL);
  const [classTypeCode, setClassTypeCode] = useState<string>(ALL);
  const [fundText, setFundText] = useState('');
  const [closeYn, setCloseYn] = useState(false);
  const [classFundExceptYn, setClassFundExceptYn] = useState(true);
  const [funds, setFunds] = useState<FundCode[]>([]);
  const [docs, setDocs] = useState<AprFundDoc[]>([]);
  const [fundLoading, setFundLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const selectedFundId = useRef<number | null>(null);
  const fundSeq = useRef(0);
  const docSeq = useRef(0);

  // public Apr01_Grid_FundDocList.retrieve(fundCodeId) L57-71: apr.Apr01_Appr.selectByFundDocList
  const retrieveDocList = async (fundCodeId: number) => {
    const my = ++docSeq.current;
    setDocLoading(true);  // grid.mask("Loading")
    try {
      const list = await aprApi.searchFundDocList(fundCodeId);
      if (my !== docSeq.current) return;
      setDocs(list);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === docSeq.current) setDocLoading(false);
    }
  };

  // [E1] fundText.KeyPress [Enter] (L115)·[E3] retrieveButton[조회].Select (L134) → retrieveFundList() L172-198: fnd.Fnd01_FundCode.selectByFundOrgAuth
  // ([E2] receiveName은 원본 툴바에서 주석 처리돼 화면에 없다 — 서버가 받는 receiveName은 SQL이 쓰지 않는다)
  const retrieveFundList = async () => {
    const my = ++fundSeq.current;
    setFundLoading(true);  // grid.mask("loading...")
    try {
      const list = await fndApi.searchFundCodesByOrgAuth({ closeYn, classFundExceptYn, fundName: fundText, fundTypeCode, classTypeCode });
      if (my !== fundSeq.current) return;
      selectedFundId.current = list.length > 0 ? list[0].fundCodeId : null;
      setFunds(list);
      // 조회가 끝나면 첫 행을 고른다(grid.getSelectionModel().select(0, false)) → E4
      if (list.length > 0) void retrieveDocList(list[0].fundCodeId);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      if (my === fundSeq.current) setFundLoading(false);
    }
  };

  // buildGrid() L150-170
  const fundColumnDefs = useMemo(() => [
    gbFund.text('fundCode', 70, '코드'),  // L155
    gbFund.text('fundName', 500, '펀드명'),  // L156
    gbFund.text('kofiaFundTypeName', 150, '펀드유형'),  // L157
    gbFund.date('startDate', 90, '설정일'),  // L158
    gbFund.date('endDate', 90, '해지(예정)일'),  // L159
    gbFund.text('closeName', 60, '펀드상태'),  // L160
    gbFund.text('kofiaTrustName', 80, '신탁구분'),  // L161
    gbFund.text('kofiaPublicName', 40, '구분'),  // L162
    gbFund.text('orgCodeName', 150, '운용본부(팀)'),  // L163
    gbFund.text('operator1', 90, '운용역1'),  // L164
    gbFund.text('operator2', 90, '운용역2'),  // L165
    gbFund.text('note', 200, '비고'),  // L166
    gbFund.long('apprCount', 90, '생성문서'),  // L167
  ], []);

  // Apr01_Grid_FundDocList.buildGrid() L27-55
  const docColumnDefs = useMemo(() => [
    gbDoc.date('regDate', 100, '상신일'),
    gbDoc.date('effectDate', 100, '시행일'),
    gbDoc.text('classTreeNameAllPath', 500, '문서분류'),
    gbDoc.text('title', 500, '상신제목'),
    gbDoc.text('receiveName', 150, '수신처'),
    // actionCell(Detail) → Apr01_Edit_ApprDoc.retrieveApproval(...)
    // [생략] 편집창은 다음 단계
    iconCell<AprFundDoc>('view', 'actionCell', 60, '상세보기', () => message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다')),
    gbDoc.text('fileName', 500, '첨부파일'),
  ], []);

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize={270} min={120} max={1020}>
          <div style={{ height: '100%', padding: '20px 20px 0 20px', boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              <SearchBar onSearch={() => void retrieveFundList()} loading={fundLoading}>
                <SearchBar.Field label="펀드유형">
                  <SystemCodeComboBox kindCd="IcamFundType" altCode={ALL_CODE} style={{ width: 150 }} value={fundTypeCode} onChange={c => setFundTypeCode(c ?? ALL)} />
                </SearchBar.Field>
                <SearchBar.Field label="클래스구분">
                  <SystemCodeComboBox kindCd="IcamClassType" altCode={ALL_CODE} style={{ width: 120 }} value={classTypeCode} onChange={c => setClassTypeCode(c ?? ALL)} />
                </SearchBar.Field>
                <SearchBar.Field label="펀드">
                  <SearchBar.Input style={{ width: 300 }} placeholder="전체" value={fundText} onChange={e => setFundText(e.target.value)} />
                </SearchBar.Field>
                <Checkbox checked={closeYn} onChange={e => setCloseYn(e.target.checked)}>해지펀드포함</Checkbox>
                <Checkbox checked={classFundExceptYn} onChange={e => setClassFundExceptYn(e.target.checked)}>클래스펀드&amp;차등분배형 제외</Checkbox>
              </SearchBar>
              <div style={{ flex: 1, minHeight: 0 }}>
                {/* [E4] grid.SelectionChanged [선택>0] (L140) → retrieveDocList() L200-203 */}
                <SingleGrid<FundCode>
                  rowData={funds}
                  columnDefs={fundColumnDefs}
                  getRowId={p => String(p.data.fundCodeId)}
                  loading={fundLoading}
                  rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
                  onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
                  onSelectionChanged={e => {
                    const row = e.api.getSelectedRows()[0];
                    if (row == null || row.fundCodeId === selectedFundId.current) return;
                    selectedFundId.current = row.fundCodeId;
                    void retrieveDocList(row.fundCodeId);
                  }}
                />
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
              <SingleGrid<AprFundDoc>
                rowData={docs}
                columnDefs={docColumnDefs}
                loading={docLoading}
                rowSelection={{ mode: 'singleRow', checkboxes: true, enableClickSelection: true }}
              />
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};
