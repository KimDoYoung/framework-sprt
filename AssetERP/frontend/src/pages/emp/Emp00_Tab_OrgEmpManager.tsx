/**
 * [1031] 관리자 > 06. 경영관리 > 조직별 사원조회(관리자) (EE12)
 * AS-IS: myApp/client/vi/emp/Emp00_Tab_OrgEmpManager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본)
 * 레이아웃(생성자 L58-124): 위 툴바(기준일·[조회]) / 왼쪽 조직 트리(Org01_Tree_OrgCode, 0.2, 분할) / 가운데 사원 그리드.
 * 짝 화면 Emp00_Tab_OrgPerson(S04)과 같은 모양이고 그리드에 성별·생년월일·입사구분·집전화·주민번호·사원구분이 더 있다.
 * 스타일: SGT (견본 Fnd08_Tab_OrgAuth — 좌우 칸은 트리/그리드로 바뀌었다)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Splitter, Tree } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { empApi } from '@/api/emp';
import { orgCodeApi } from '@/api/org';
import { fileApi } from '@/api/file';
import { errorMessage } from '@/api/client';
import { OrgCode } from '@/types/org';
import { OrgEmpManager } from '@/types/emp';
import { SearchBar } from '@/components/search';
import { SingleGrid, gbFor } from '@/components/grid';
import { toTree } from '../org/Org01_Move_OrgCode';

const gb = gbFor<OrgEmpManager>();

/** buildGrid() L126-147 — 이미지 열은 EmpImageCell(L40-48): FileDownload?fileType=image&parentId=사원ID, 80×100, 여백 5 */
const columnDefs = [
  { // L129 addCell(personIdString, 110, "이미지", EmpImageCell)
    colId: 'personIdString', headerName: '이미지', width: 110, sortable: false,
    cellStyle: { textAlign: 'center' },
    cellRenderer: (p: { data?: OrgEmpManager }) => p.data ? (
      <img alt="" style={{ height: 100, width: 80, margin: '5px 5px' }} src={fileApi.imageUrl({ parentId: p.data.personId })} />
    ) : null,
  },
  gb.text('empKorName', 100, '성명'), // L130
  gb.text('genderName', 40, '성별'), // L131
  gb.date('birthday', 90, '생년월일'), // L132 (읽기 전용 날짜 열 UX-08: 90)
  gb.text('posName', 80, '직위'), // L133
  gb.text('orgKorName', 150, '본부(부서)'), // L134
  gb.text('titleName2', 100, '직책'), // L135
  gb.date('hireDate', 90, '입사일'), // L136
  gb.text('hireName', 80, '입사구분'), // L137
  gb.text('emailAddress', 200, 'e-mail'), // L138
  gb.text('mobileTelNo', 120, 'H˙P'), // L139
  gb.text('officeTelNo', 120, '전화'), // L140
  gb.text('homeTelNo', 120, '집전화'), // L141
  gb.text('decCtzNo', 200, '주민번호'), // L142
  gb.text('kindName', 80, '사원구분'), // L143
  gb.text('empNo', 80, '사번'), // L144
];

export const Emp00_Tab_OrgEmpManager: React.FC = () => {
  const [baseDate, setBaseDate] = useState<Dayjs | null>(dayjs()); // L63-65: 기준일 = 오늘(LoginUser.getToday)
  const [orgCodes, setOrgCodes] = useState<OrgCode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [rows, setRows] = useState<OrgEmpManager[]>([]);
  const [loading, setLoading] = useState(false);
  const treeData = useMemo(() => toTree(orgCodes), [orgCodes]);
  const base = () => (baseDate ?? dayjs()).format('YYYY-MM-DD');

  // [E0] 화면 열림 (생성자 L58-124) / [E1] retrieveButton[조회].Select (L68) → retrieve() L150-152:
  // buildTree.retrieve(baseDate) → 서비스 org.Org01_Code.selectByCompanyId, 첫 레벨만 펼친다(Org01_Tree_OrgCode.getServiceResult L82-98). 그리드는 그대로 둔다
  const retrieve = async () => {
    try {
      const list = await orgCodeApi.searchOrgCodes(base());
      setSelectedKey(null);
      setOrgCodes(list);
      setExpandedKeys(toTree(list).map(n => n.key));
    } catch (err) {
      message.error(errorMessage(err, '매뉴조회 오류'));
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { retrieve(); }, []);

  // [E2] orgTree.SelectionChanged [data != null] (L77) → 서비스 emp.Emp00_TransInfo.selectByAllOrgCodeId(orgCodeId, baseDate, companyId)
  const onSelectOrg = async (codeId: number) => {
    setSelectedKey(codeId);
    setLoading(true);
    try {
      setRows(await empApi.searchOrgEmpManagers(codeId, base()));
    } catch (err) {
      setRows([]);
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 8px 8px 20px', flexShrink: 0 }}>
        <SearchBar onSearch={() => void retrieve()}>
          <SearchBar.Field label="기준일">
            <DatePicker style={{ width: 140 }} value={baseDate} onChange={setBaseDate} format="YYYY-MM-DD" />
          </SearchBar.Field>
        </SearchBar>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Splitter style={{ height: '100%' }}>
          <Splitter.Panel defaultSize="20%" min={100} max={1000}>
            <div style={{ height: '100%', padding: '0 0 20px 20px', boxSizing: 'border-box' }}>
              <div style={{ height: '100%', border: '1px solid #d9d9d9', background: '#fff', overflow: 'auto', boxSizing: 'border-box' }}>
                {treeData.length > 0 && (
                  <Tree
                    treeData={treeData}
                    expandedKeys={expandedKeys}
                    onExpand={keys => setExpandedKeys(keys)}
                    selectedKeys={selectedKey == null ? [] : [selectedKey]}
                    onSelect={keys => { if (keys.length) void onSelectOrg(Number(keys[0])); }}
                  />
                )}
              </div>
            </div>
          </Splitter.Panel>
          <Splitter.Panel min={200}>
            <div style={{ height: '100%', padding: '0 20px 20px 0', boxSizing: 'border-box' }}>
              <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}>
                <SingleGrid<OrgEmpManager>
                  rowData={rows}
                  columnDefs={columnDefs}
                  loading={loading}
                  rowHeight={110}
                  getRowId={p => String(p.data.transId)}
                />
              </div>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  );
};
