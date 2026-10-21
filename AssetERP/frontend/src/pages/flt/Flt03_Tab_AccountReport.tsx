/**
 * 계좌신고 (I02) — 준법감시 > 10. 임직원매매 > 계좌신고 #1125
 * AS-IS: myApp/client/vi/flt/Flt03_Tab_AccountReport.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L110-163: center(60%, 분할) = 위 안내 두 줄(보고주기·서약서) + [보고주기 변경 및 서약서 서명] / 툴바 / 체크박스 다중 셀 편집 그리드 / 아래 "문서분류" 칸 + [상신],
 *                  south(40%) = Flt06_TabPage_AccountClose(폐쇄계좌)
 * 1단계: [보고주기 변경 및 서약서 서명](Flt02_Lookup_Emp)·[최초원장 등록](Flt13_Lookup_BookInit)·[상신]/상세보기(전자결재 편집창 Apr01_Edit_ApprDoc)는 다음 단계
 * UX보강(10): 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button as AntButton, message, Modal, Space, Splitter } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { CustomCellRendererProps } from 'ag-grid-react';
import { fltApi } from '@/api/flt';
import { sysApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { Code, Corp } from '@/types/sys';
import { FltAccount, FltAccountStatus } from '@/types/flt';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { useGridCrud } from '@/hooks/useGridCrud';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Dcr30_Move_DcrClass } from '@/components/lookup/Dcr30_Move_DcrClass';
import { Sys15_Lookup_Corp } from '@/components/lookup/Sys15_Lookup_Corp';
import { Flt03_Lookup_AccountClose } from './Flt03_Lookup_AccountClose';
import { Flt03_Lookup_ItemType, ItemTypeResult } from './Flt03_Lookup_ItemType';
import { Flt03_Lookup_MainAccount } from './Flt03_Lookup_MainAccount';
import { Flt06_TabPage_AccountClose } from './Flt06_TabPage_AccountClose';

const gb = gbFor<FltAccount>();

const BLUE = '#456EA6';
const RED = '#DD5E5E';
/** 결재 중(10 상신·20 진행·30 완료)이면 건드릴 수 없다 (반려 40·임시저장 50은 가능) */
const IN_APPROVAL = ['10', '20', '30'];
const inApproval = (m: FltAccount) => IN_APPROVAL.includes(m.apprStatusCode ?? '');

/** GXT TextField 빈 값 = null */
const n = (s: string | null | undefined) => (s == null || s === '' ? null : s);

export const Flt03_Tab_AccountReport: React.FC = () => {
  const [status, setStatus] = useState<FltAccountStatus>({ checkCycle: '1', oathStatusCode: '30', oathStatusName: null });  // 처음 모양 = Quarterly·Finish (L94-95)
  const [classTree, setClassTree] = useState<{ id: number | null; name: string }>({ id: null, name: '' });
  const [docOpen, setDocOpen] = useState(false);
  const [mainOpen, setMainOpen] = useState(false);
  const [closeIds, setCloseIds] = useState<number[] | null>(null);
  const [corpRow, setCorpRow] = useState<FltAccount | null>(null);
  const [itemRow, setItemRow] = useState<FltAccount | null>(null);
  const [regReasons, setRegReasons] = useState<Code[]>([]);
  const [familyRelates, setFamilyRelates] = useState<Code[]>([]);
  const [closeKey, setCloseKey] = useState(0);

  const crud = useGridCrud<FltAccount>({
    idField: 'accountId',
    // retrieve() L443-455: 서비스 flt.Flt03_Account.selectByPersonId(companyId, personId) → 끝나면 tabPage.retrieve()
    search: useCallback(async () => {
      const list = await fltApi.searchAccounts();
      setCloseKey(k => k + 1);
      return list;
    }, []),
    // update() L458-534: GridUpdate → flt.Flt03_Account.update
    save: rows => fltApi.updateAccounts(rows.map(r => ({
      ...r, accountName: n(r.accountName), accountNoDec: n(r.accountNoDec), corpBranchName: n(r.corpBranchName), note: n(r.note),
    }))),
    // 삭제는 deleteRow() → delete()로 따로 한다(체크 행 삭제 안 씀)
    remove: async () => 0,
    // insertRow() L537-543: 회사·사원은 서버가 로그인 사용자로 채운다
    newRow: () => ({}),
    firstEditField: 'setupDate',
    // update() L463-530: 바뀐 행마다 순서대로 검사하고, 마지막에 주 계좌 개수
    validate: (changed, all) => {
      for (const m of changed) {
        if (!m.setupDate) return '계좌개설일을 입력해주세요';
        if (!m.regReason) return '신고사유를 선택해주세요';
        if (!m.familyRelateCode) return '관계를 선택해주세요';
        if (!m.accountName) return '계좌명의를 입력해주세요';
        if (!m.accountNoDec) return '계좌번호를 입력해주세요';
        if (m.corpId == null) return '개설기관을 선택해주세요';
        if (!m.corpBranchName) return '개설점포를 입력해주세요';
        if (!m.itemType) return '종목유형을 선택하세요';
        if (inApproval(m)) return '상신 중인 정보가 포함되어있습니다';
      }
      if (all.filter(m => m.mainAccountYn).length > 1) return '주 계좌는 하나만 가능합니다.';
      return undefined;
    },
    reloadAfterSave: false,
  });

  // check() L257-328: dcr.Dcr30_Link.selectByLinkCode(companyId, "B05") → 기본 문서분류 / flt.Flt02_Emp.selectByDate → 보고주기 / flt.Flt04_Oath.selectByDate → 서약서
  const check = useCallback(async () => {
    try {
      const [doc, st] = await Promise.all([fltApi.getDocClass('B05'), fltApi.getAccountStatus()]);
      if (doc) setClassTree({ id: doc.classTreeId, name: doc.classTreeFullName ?? '' });
      setStatus(st);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, []);

  // [E0] 화면 열림 (생성자 L110-163) → settings(), check(), retrieve()
  useEffect(() => {
    sysApi.searchCodes('AccountRegReason').then(setRegReasons).catch(() => {});  // buildGrid() L334 신고사유 콤보
    sysApi.searchCodes('FamilyRelateCode').then(setFamilyRelates).catch(() => {});  // buildGrid() L343 관계 콤보
    void check();
    void crud.retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // actionCell(Detail) L379-408: apr.Apr01_Appr.selectById(apprId) → 있으면 Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false), 없으면 "상신문서가 존재하지 않습니다"
  const viewAppr = (row: FltAccount) => {
    if (row.apprId == null) {
      message.warning('상신문서가 존재하지 않습니다');
      return;
    }
    // [생략] 편집창은 다음 단계
    message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
  };

  // [E13] corpLookup.TriggerClick (L354) → Sys15_Lookup_Corp.open(true, …): 고른 거래처의 ID·이름
  const pickCorp = (data: FltAccount, corp: Corp | null) => {
    crud.updateRow(data.accountId, { corpId: corp?.corpId ?? null, corpName: corp?.corpName ?? null });
    setCorpRow(null);
  };

  // [E14] itemLookup.TriggerClick (L373) → openItem() L427-440: Flt03_Lookup_ItemType → 고른 종목유형·이름
  const pickItem = (data: FltAccount, result: ItemTypeResult) => {
    crud.updateRow(data.accountId, { itemType: result.itemType, itemTypeName: result.itemTypeName });
    setItemRow(null);
  };

  const triggerCell = (setRow: (row: FltAccount) => void) => (p: CustomCellRendererProps<FltAccount>) => (
    <Space size={4}>
      <AntButton type="text" size="small" icon={<SearchOutlined />} onClick={e => { e.stopPropagation(); if (p.data) setRow(p.data); }} />
      {p.value}
    </Space>
  );

  // buildGrid() L330-425: setChecked(MULTI)
  const columnDefs = useMemo(() => [
    gb.date('setupDate', 90, '계좌개설일', { editor: 'date' }),  // L410
    // [E11] AccountRegReasonComboBox[AccountRegReason].Collapse (L335) → regReason 동기화
    gb.text('regReasonName', 100, '신고사유', {  // L411
      editor: 'select',
      values: regReasons.map(c => c.name),
      valueSetter: p => {
        p.data.regReasonName = p.newValue;
        p.data.regReason = regReasons.find(c => c.name === p.newValue)?.code ?? p.data.regReason;
        return true;
      },
    }),
    // [E12] FamilyRelateComboBox[FamilyRelateCode].Collapse (L344) → familyRelateCode 동기화
    gb.text('familyRelateName', 80, '관계', {  // L412
      editor: 'select',
      values: familyRelates.map(c => c.name),
      valueSetter: p => {
        p.data.familyRelateName = p.newValue;
        p.data.familyRelateCode = familyRelates.find(c => c.name === p.newValue)?.code ?? p.data.familyRelateCode;
        return true;
      },
    }),
    gb.boolean('mainAccountYn', 70, '주 계좌', { editable: true }),  // L413
    gb.text('accountName', 150, '계좌명의', { editor: 'text' }),  // L414
    gb.text('accountNoDec', 180, '계좌번호', { editor: 'text' }),  // L415
    gb.text('corpName', 150, '개설기관', { cellStyle: { color: '#1677ff' }, cellRenderer: triggerCell(setCorpRow) }),  // L416 corpLookup(LookupTriggerField, 편집 불가)
    gb.text('corpBranchName', 150, '개설점포', { editor: 'text' }),  // L417
    gb.text('itemTypeName', 150, '종목유형', { cellStyle: { color: '#1677ff' }, cellRenderer: triggerCell(setItemRow) }),  // L418 itemLookup(LookupTriggerField, 편집 불가)
    gb.text('note', 150, '비고', { editor: 'text' }),  // L419
    gb.date('apprRegDate', 90, '상신일'),  // L420
    gb.textCenter('apprStatusName', 80, '상신상태'),  // L421
    iconCell<FltAccount>('view', 'actionCell', 80, '상세보기', viewAppr),  // L422
  ], [regReasons, familyRelates]);  // eslint-disable-line react-hooks/exhaustive-deps

  const selected = () => (crud.gridRef.current?.api?.getSelectedRows() ?? []) as FltAccount[];

  // [E5] deleteButton[삭제].Select (L204) → deleteRow() L546-570 → [E15] msgBox.DialogHide [YES] (L555) → delete() L572-614
  const deleteRow = () => {
    const list = selected();
    if (list.length === 0) {
      message.warning('삭제할 계좌를 선택해주세요');
      return;
    }
    Modal.confirm({
      title: '삭제',
      content: `${list.length}건의 정보를 삭제하시겠습니까?`,
      width: 300,
      okText: '예',
      cancelText: '아니오',
      onOk: () => remove(list),
    });
  };

  const remove = async (list: FltAccount[]) => {
    for (const m of list) {
      const no = m.accountNoDec;
      let validMsg: string | null = null;
      if (inApproval(m)) validMsg = `[${no}] 계좌의 상신 중인 정보가 포함되어있습니다`;
      else if ((m.trCnt ?? 0) !== 0) validMsg = `[${no}] 계좌의 매수/매도 내역이 존재합니다.`;
      else if ((m.bookInitCnt ?? 0) !== 0) validMsg = `[${no}] 계좌의 최초원장이 존재합니다.`;
      else if ((m.bookCnt ?? 0) !== 0) validMsg = `[${no}] 계좌의 보유내역이 존재합니다.`;
      if (validMsg) {
        message.warning(validMsg);
        return;
      }
    }
    try {
      const saved = list.map(m => m.accountId).filter(id => id > 0);
      if (saved.length > 0) await fltApi.deleteAccounts(saved);  // flt.Flt03_Account.delete
      crud.removeRows(list.map(m => m.accountId));
      message.success(`${list.length}건 삭제되었습니다.`);
    } catch (err) {
      message.warning(errorMessage(err, '삭제 실패'));  // serviceResult.getStatus() < 0 → SimpleMessage(message)
    }
  };

  // [E6] cancleButton[계좌폐쇄].Select (L210) → insertAccountClose() L719-765 → [E16] msgBox.DialogHide [YES] (L744) → Flt03_Lookup_AccountClose → retrieve()
  const insertAccountClose = () => {
    const list = selected();
    if (list.length === 0) {
      message.warning('폐쇄할 계좌를 선택해주세요');
      return;
    }
    if (list[0].setupDate == null) {
      message.warning('해당 계좌정보를 저장 후 상신을 진행해주세요');
      return;
    }
    if (list.some(m => !inApproval(m))) {
      message.warning('상신 전인 계좌정보가 포함되어있습니다');
      return;
    }
    Modal.confirm({
      title: '확인',
      content: `${list.length}건의 계좌정보를 폐쇄하시겠습니까?`,
      width: 380,
      okText: '예',
      cancelText: '아니오',
      onOk: () => setCloseIds(list.map(m => m.accountId)),
    });
  };

  // [E10] apprButton[상신].Select (L249) → insertLinkApproval() L627-695
  const insertLinkApproval = () => {
    const list = selected();
    if (list.length === 0) {
      message.warning('신고할 계좌정보를 선택해주세요');
      return;
    }
    if (list[0].setupDate == null) {
      message.warning('해당 계좌정보를 저장 후 상신을 진행해주세요');
      return;
    }
    if (classTree.id == null) {
      message.warning('문서분류를 먼저 선택해주세요');
      return;
    }
    if (list.some(inApproval)) {
      message.warning('결재 중인 문서이거나, 완료된 문서가 포함되어있습니다');
      return;
    }
    if (status.checkCycle == null) {
      message.warning('보고주기를 먼저 입력해주세요');
      return;
    }
    // [E10 다음 단계] flt.Flt13_BookInit.getInfo → Apr01_Edit_ApprDoc.insertLinkApprovals(classTreeModel, "B05", param) → updateApprId() (flt.Flt03_Account.updateApprId)
    message.info('전자결재 상신 창은 다음 단계에서 연결합니다.');
  };

  const cycleLabel = status.checkCycle === '1' ? { text: '분기별', color: BLUE }
    : status.checkCycle === '2' ? { text: '월별', color: BLUE }
    : { text: '미지정', color: RED };
  const oathDone = status.oathStatusName != null && status.oathStatusCode === '30';

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel defaultSize="60%" min={300}>
          <div style={{ height: '100%', padding: 20, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', border: '1px solid #d9d9d9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
              {/* hlc01 L123-125: 왼쪽 안내 두 줄(15, 높이 50씩), 오른쪽 [보고주기 변경 및 서약서 서명](폭 250, 끝 정렬, 여백 20) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', minHeight: 80 }}>
                <div style={{ padding: '15px 15px 0', fontSize: 14, fontWeight: 'bold', lineHeight: '30px' }}>
                  <div>* 보고주기 : <span style={{ color: cycleLabel.color }}>{cycleLabel.text}</span> (조사분석인력 및 투자운용인력은 월별점검 대상입니다)</div>
                  <div>* 임직원 금융투자상품 매매 법규준수 서약서 : <span style={{ color: oathDone ? BLUE : RED }}>{oathDone ? '서명완료' : '미완료'}</span></div>
                </div>
                <div style={{ margin: 20 }}>
                  {/* [E1] openButton[보고주기 변경 및 서약서 서명].Select (L174) → Flt02_Lookup_Emp.open(→ check()): [E1 다음 단계] */}
                  <Button type="download" style={{ width: 250 }} onClick={() => message.info('임직원매매 설정(보고주기·서약서) 창은 다음 단계에서 연결합니다.')}>보고주기 변경 및 서약서 서명</Button>
                </div>
              </div>
              <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
                {/* [E2] retrieveButton[조회].Select (L186) → retrieve() */}
                <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
                {/* [E3] insertButton[등록].Select (L192) → insertRow() */}
                <Button type="register" onClick={crud.addRow}>등록</Button>
                {/* [E4] updateButton[저장].Select (L198) → update() */}
                <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
                <Button type="delete" onClick={deleteRow}>삭제</Button>
                <span style={{ width: 8 }} />
                <Button type="close" onClick={insertAccountClose}>계좌폐쇄</Button>
                {/* [E7] mainAccountButton[주계좌 설정].Select (L216) → Flt03_Lookup_MainAccount.open(→ retrieve()) */}
                <Button type="save" onClick={() => setMainOpen(true)}>주계좌 설정</Button>
                {/* [E8] initBookButton[최초원장 등록].Select (L228) → Flt13_Lookup_BookInit.open(오늘): [E8 다음 단계] */}
                <Button type="register" onClick={() => message.info('최초원장 등록 창은 다음 단계에서 연결합니다.')}>최초원장 등록</Button>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <CellEditGrid<FltAccount> crud={crud} columnDefs={columnDefs} />
              </div>
              <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
                <span style={{ fontSize: 14 }}>문서분류</span>
                {/* [E9] classTreeFullName.TriggerClick (L243) → openLookupDoc() L616-625: Dcr30_Move_DcrClass → 고른 분류 */}
                <LookupInput value={classTree.name} placeholder="문서분류를 선택해주세요" width={550} onOpen={() => setDocOpen(true)} />
                <Button type="register" onClick={insertLinkApproval}>상신</Button>
              </div>
            </div>
          </div>
        </Splitter.Panel>
        <Splitter.Panel min={150}>
          <Flt06_TabPage_AccountClose refreshKey={closeKey} onChanged={() => void crud.retrieve()} />
        </Splitter.Panel>
      </Splitter>

      <Dcr30_Move_DcrClass
        open={docOpen}
        onResult={r => { setClassTree({ id: r.classTreeId, name: r.classTreeFullName ?? '' }); setDocOpen(false); }}
        onClose={() => setDocOpen(false)}
      />
      <Flt03_Lookup_MainAccount open={mainOpen} onClose={() => { setMainOpen(false); void crud.retrieve(); }} />
      <Flt03_Lookup_AccountClose
        open={closeIds != null}
        accountIds={closeIds ?? []}
        onDone={() => { setCloseIds(null); void crud.retrieve(); }}
        onClose={() => setCloseIds(null)}
      />
      <Sys15_Lookup_Corp open={corpRow != null} regYn onResult={c => corpRow && pickCorp(corpRow, c)} onClose={() => setCorpRow(null)} />
      <Flt03_Lookup_ItemType open={itemRow != null} itemType={itemRow?.itemType ?? null} onResult={r => itemRow && pickItem(itemRow, r)} onClose={() => setItemRow(null)} />
    </div>
  );
};
