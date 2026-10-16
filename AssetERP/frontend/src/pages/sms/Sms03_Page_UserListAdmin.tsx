/**
 * 문자발송 대상 고르기·발송 (C06) — Sms03_Tab_SendAdmin 오른쪽
 * AS-IS: myApp/client/vi/sms/Sms03_Page_UserListAdmin.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L92-134: 위 툴바(고객사·검색·사용고객만 보기·조회·기타고객사 추가) → 고객사원 그리드 40%(페이징 100) → 툴바(▼ 문자발송 대상리스트·발송) → 대상 그리드 60%
 * 부모가 선택한 단체문자 ID(setGroupSendId)를 prop으로 준다. 없으면 위쪽 조회·발송·기타고객사 추가를 못 쓴다.
 * 실제 문자 발송은 서버 SmsSender가 하며, 지금은 사용자 지시로 보내지 않는다(서버가 거절 문구를 돌려준다).
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox, message, Modal, Select, Typography } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import { empUserInfoApi } from '@/api/emp';
import { smsApi } from '@/api/sms';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code, ClientInfo } from '@/types/sys';
import { CompanyPerson } from '@/types/emp';
import { GroupSendTarget } from '@/types/sms';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Button } from '@/components/button';
import { SearchBar } from '@/components/search';
import { PagingToolBar, SingleGrid, gbFor, iconCell } from '@/components/grid';
import { Sys85_Lookup_ClientInfoList } from '../sys/Sys85_Lookup_ClientInfoList';

const LIMIT = 100;                       // grid01ToolBar.setToolBar(100)
const ALL = '%';                         // CommonComboBoxField("sys.Sys00_Common.selectCompanyName", "%", "전체")
const DEFAULT_COMPANY = '한국펀드서비스(주)'; // settings() L137 companyName.setValue

const gb01 = gbFor<CompanyPerson>();
const gb02 = gbFor<GroupSendTarget>();

interface Props {
  /** AS-IS setGroupSendId(groupSendId) L70-90 */
  groupSendId?: number | null;
}

export const Sms03_Page_UserListAdmin: React.FC<Props> = ({ groupSendId }) => {
  const loginUser = useLoginUser();
  const grid01Ref = useRef<AgGridReact<CompanyPerson>>(null);
  const [companies, setCompanies] = useState<Code[]>([]);
  const [companyCode, setCompanyCode] = useState<string>(ALL);
  const [searchText, setSearchText] = useState('');
  const [useYn, setUseYn] = useState(true);  // settings(): useYn = true("사용고객만 보기")
  const [rows01, setRows01] = useState<CompanyPerson[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rows02, setRows02] = useState<GroupSendTarget[]>([]);
  const [lookupOpen, setLookupOpen] = useState(false);
  const rowSeq = useRef(0);
  /** grid01ToolBar.addParam(…) — 페이지를 넘길 때는 마지막 조회 조건을 쓴다(GridPagingLoader) */
  const paramRef = useRef<{ companyId: string; searchText: string; useYn: string } | undefined>(undefined);

  const disabled = groupSendId == null;

  // addList() L240-264: 이미 있으면 막고, 없으면 grid02에 넣는다
  const addList = (selectModel: CompanyPerson) => {
    if (rows02.some(r => r.personId === selectModel.personId)) {
      message.warning('이미 추가된 사원정보입니다');
      return;
    }
    setRows02(prev => [...prev, {
      rowKey: --rowSeq.current, personId: selectModel.personId, companyName: selectModel.companyName, orgName: selectModel.orgName,
      posName: selectModel.posName, korName: selectModel.korName, mobileTelNo: selectModel.mobileTelNo,
    }]);
  };

  /** AS-IS buildGrid01() L205-220 */
  const columns01 = useMemo(() => [
    iconCell<CompanyPerson>('add', 'actionCell', 40, ' ', addList),
    gb01.text('companyName', 250, '고객사'),
    gb01.text('orgName', 180, '부서명'),
    gb01.text('posName', 100, '직위'),
    gb01.text('korName', 100, '사원명'),
    gb01.text('mobileTelNo', 120, '휴대폰'),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [rows02]);

  /** AS-IS buildGrid02() L222-238: 삭제 아이콘 = 그 행을 목록에서 뺀다 */
  const columns02 = useMemo(() => [
    iconCell<GroupSendTarget>('delete', 'actionCell', 40, ' ', row => setRows02(prev => prev.filter(r => r.rowKey !== row.rowKey))),
    gb02.text('companyName', 250, '고객사'),
    gb02.text('orgName', 180, '부서명'),
    gb02.text('posName', 100, '직위'),
    gb02.text('korName', 100, '사원명'),
    gb02.text('mobileTelNo', 120, '휴대폰'),
  ], []);

  // GridPagingLoader.getPaging(): 저장된 조건 + offset·limit → 목록·전체 건수
  const getPaging = async (p: number) => {
    if (!paramRef.current) return;
    setLoading(true);  // grid01.mask("Loading")
    try {
      const res = await empUserInfoApi.searchCompanyPersons({ ...paramRef.current, offset: (p - 1) * LIMIT, limit: LIMIT });
      setRows01(res.rows);
      setTotal(res.total);
      setPage(p);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);  // grid01.unmask()
    }
  };

  // retrieve() L266-304: 조건을 만들어 1페이지부터 다시 읽는다
  const retrieve = (code: string = companyCode, list: Code[] = companies) => {
    const label = code === ALL ? '전체' : list.find(c => c.code === code)?.name;
    let companyId: string;
    if (label === '전체' || code === ALL) {
      companyId = '%';
    } else if (label === DEFAULT_COMPANY && loginUser.loginId === 'kfiamuser') {
      companyId = '1';
    } else if (label === DEFAULT_COMPANY && loginUser.loginId === 'idmsuser') {
      companyId = '28000';
    } else {
      companyId = code;
    }
    paramRef.current = {
      companyId,
      searchText,  // 원본은 "%" + 검색어 + "%" — 서버가 만든다(05 §6)
      useYn: useYn ? 'true' : 'false',
    };
    return getPaging(1);
  };

  // [E0] 화면 열림 (생성자 L92-134) → settings(), retrieve(): 회사 콤보를 읽어 '한국펀드서비스(주)'로 두고 처음 한 번 조회
  useEffect(() => {
    sysApi.searchCompanyNames().then(list => {
      setCompanies(list);
      const def = list.find(c => c.name === DEFAULT_COMPANY)?.code ?? ALL;
      setCompanyCode(def);
      retrieve(def, list);
    }).catch(err => message.error(errorMessage(err, '조회 실패')));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // getPaging 콜백(L286-291): 첫 행이 있으면 select(0)
  const onRowDataUpdated = () => {
    grid01Ref.current?.api.getDisplayedRowAtIndex(0)?.setSelected(true, true);
  };

  // sendCheck() L306-325 → [E6] msgBox.DialogHide [YES] (L309) → sendMessage()
  const sendCheck = () => {
    Modal.confirm({
      title: '확인',
      content: '선택한 고객사원들에게 해당 내용을 발송하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      onOk: sendMessage,
    });
  };

  // sendMessage() L327-354: 서비스 sms.Sms03_GroupSend.sendGroupMessage(companyId, groupSendId, grid02 전체 행)
  const sendMessage = async () => {
    if (groupSendId == null) {
      message.warning('보내실 내용을 좌측에서 선택해주세요');
      return;
    }
    try {
      await smsApi.sendGroupMessage(groupSendId, rows02);
      message.success('발송이 완료되었습니다');
    } catch (err) {
      message.error(errorMessage(err, '발송 실패'));
    }
  };

  // [E5] listButton[기타고객사 추가].Select [result != null] (L170-202): 고른 고객사 정보마다 grid02에 행을 넣는다
  const onClientInfoResult = (list: ClientInfo[]) => {
    setLookupOpen(false);
    setRows02(prev => [...prev, ...list.map(r => ({
      rowKey: --rowSeq.current, personId: r.clientInfoId, companyName: r.companyName, orgName: r.orgName,
      posName: r.posName, korName: r.clientName, mobileTelNo: r.moblieTelno,
    }))]);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #d9d9d9' }}>
      <div style={{ flex: 'none', minHeight: 50, display: 'flex', alignItems: 'center', padding: '4px 8px' }}>
        {/* [E3] retrieveButton[조회].Select (L158) → retrieve(). 초기화(UX-02)는 조건 3개가 이미 한 줄을 채워 넣으면 줄바꿈이 늘어 넣지 않는다 */}
        <SearchBar disabled={disabled} loading={loading} onSearch={() => retrieve()} extra={
          /* [E5] listButton[기타고객사 추가].Select (L170) → Sys85_Lookup_ClientInfoList.open(callback) */
          <Button type="assign" disabled={disabled} onClick={() => setLookupOpen(true)}>기타고객사 추가</Button>
        }>
          <SearchBar.Field label="고객사">
            {/* [E1] companyName[sys.Sys00_Common.selectCompanyName].Collapse (L140) → retrieve() */}
            <Select style={{ width: 200 }} value={companyCode}
              options={[{ value: ALL, label: '전체' }, ...companies.map(c => ({ value: c.code, label: c.name }))]}
              onChange={code => { setCompanyCode(code); retrieve(code); }} />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E2] searchText.KeyPress [Enter] (L148) → retrieve() */}
            <SearchBar.Input style={{ width: 200 }} placeholder="고객사명/사원명/휴대폰/비고" value={searchText}
              onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
          <Checkbox disabled={disabled} checked={useYn} onChange={e => setUseYn(e.target.checked)}>사용고객만 보기</Checkbox>
        </SearchBar>
      </div>
      <div style={{ flex: 4, minHeight: 0, display: 'flex', flexDirection: 'column', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : undefined }}>
        <div style={{ flex: 1, minHeight: 0 }}>
          <SingleGrid<CompanyPerson>
            gridRef={grid01Ref}
            rowData={rows01}
            loading={loading}
            columnDefs={columns01}
            getRowId={p => String(p.data.personId)}
            onRowDataUpdated={onRowDataUpdated}
          />
        </div>
        <PagingToolBar page={page} limit={LIMIT} total={total} loading={loading} onChange={getPaging} />
      </div>
      <div style={{ flex: 'none', height: 50, display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px', borderTop: '1px solid #d9d9d9' }}>
        <Typography.Text strong>▼ 문자발송 대상리스트</Typography.Text>
        {/* [E4] sendButton[발송].Select (L164) → sendCheck() */}
        <Button type="send" disabled={disabled} onClick={sendCheck}>발송</Button>
      </div>
      <div style={{ flex: 6, minHeight: 0 }}>
        <SingleGrid<GroupSendTarget>
          rowData={rows02}
          columnDefs={columns02}
          getRowId={p => String(p.data.rowKey)}
        />
      </div>
      <Sys85_Lookup_ClientInfoList open={lookupOpen} onResult={onClientInfoResult} onClose={() => setLookupOpen(false)} />
    </div>
  );
};
