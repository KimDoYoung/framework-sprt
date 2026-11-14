/**
 * [1314] KFS > 04. ICAM 사용자ID 관리 > 사용자ID 신청서 작성 (EE29)
 * AS-IS: myApp/client/vi/icam/Icam55_Tab_UserRegAppr.java (582줄) + Icam55_Edit_UserRegAppr(305줄, 아래 편집 폼) + Icam55_Lookup_RegContent(153줄, 신청내용 창)
 *   — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 L79-118: center(여백 20/20/0/20) = 툴바(신청일자 ~ · 검색 300 · 미처리만 조회 · [조회][등록][삭제]) + 그리드(SingleGrid, 행번호, 14열, "처리구분" 묶음 머리),
 *   south(400, 여백 20) = Icam55_Edit_UserRegAppr.
 * 결재요청 = 전자결재 편집창 Apr01_Edit_ApprDoc 링크코드 A33 — insertLinkApproval() L336-397 → updateApprId() L289-301. 본문은 서버 IcamUserLinkSeedProvider가 양식(com10_form_mapping)에 #{키}를 치환해 만든다.
 * 스타일: SGEF (견본 Sys90_Tab_AfterService — docs/page-style.md)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 날짜 열 폭 90(UX-08). 초기화(UX-02)는 원본에 없어 넣지 않는다
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, DatePicker, message, Modal, Splitter } from 'antd';
import type { AgGridReact } from 'ag-grid-react';
import dayjs, { Dayjs } from 'dayjs';
import { icamUserApi } from '@/api/icam';
import { dcrApi } from '@/api/dcr';
import { errorMessage } from '@/api/client';
import { IcamUser } from '@/types/icam';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { useLoginUser } from '@/hooks/useLoginUser';
import { Apr01_Edit_ApprDoc } from '../apr/Apr01_Edit_ApprDoc';
import { Icam55_Edit_UserRegAppr } from './Icam55_Edit_UserRegAppr';

const gb = gbFor<IcamUser>();
const FORMAT = 'YYYY-MM-DD';
const LINK_CODE = 'A33';
const RUNNING = ['10', '20', '30'];

export const Icam55_Tab_UserRegAppr: React.FC = () => {
  const user = useLoginUser();
  const gridRef = useRef<AgGridReact<IcamUser>>(null);
  /** 조회·등록 뒤 그리드가 행을 채우면 선택할 신청서 */
  const keepId = useRef<number | null>(null);
  const tempId = useRef(0);
  // settings() L120-186: 신청일자 = 올해 1월 1일 ~ 오늘, 미처리만 조회 = true
  const [startDate, setStartDate] = useState<Dayjs>(() => dayjs().startOf('year'));
  const [closeDate, setCloseDate] = useState<Dayjs>(() => dayjs());
  const [searchText, setSearchText] = useState('');
  const [procResult, setProcResult] = useState(true);
  const [rows, setRows] = useState<IcamUser[]>([]);
  const [selected, setSelected] = useState<IcamUser | null>(null);
  /** 선택·저장마다 편집 폼을 다시 만든다 (AS-IS retrieveEditPage → editForm.retrieve(model)) */
  const [formSeq, setFormSeq] = useState(0);
  /** retrieveDoc() L269-287: dcr.Dcr30_Link.selectByLinkCode("A33") — 정확히 1건일 때만 지정된 것으로 본다 */
  const [classTreeId, setClassTreeId] = useState<number | null>(null);
  const [viewApprId, setViewApprId] = useState<number | null>(null);
  const [viewStatus, setViewStatus] = useState<string | null>(null);
  const [link, setLink] = useState<{ classTreeId: number; linkCode: string; refId: number } | null>(null);

  // retrieve() L303-334: icam.Icam55_IcamUser.selectBySearchText
  const retrieve = useCallback(async () => {
    try {
      const list = await icamUserApi.search({
        searchText, startDate: startDate.format(FORMAT), closeDate: closeDate.format(FORMAT), procResult,
      });
      keepId.current = null;
      setRows(list);
      setSelected(null);
      setFormSeq(n => n + 1);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  }, [searchText, startDate, closeDate, procResult]);

  // [E0] 화면 열림 (생성자 L79-118) → retrieveDoc(), settings(), retrieve()
  useEffect(() => {
    dcrApi.searchClassTreeByLinkCode(LINK_CODE).then(list => setClassTreeId(list.length === 1 ? list[0].classTreeId : null)).catch(() => setClassTreeId(null));
    void retrieve();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // [E5] grid.SelectionChanged [선택>0] (L172) → retrieveEditPage() L188-204: 선택이 없으면 폼 비활성(init)
  const retrieveEditPage = (row: IcamUser | undefined) => {
    setSelected(prev => {
      if (prev?.icamUserId === row?.icamUserId) return prev;
      setFormSeq(n => n + 1);
      return row ?? null;
    });
  };

  // [E3] insertButton[등록].Select (L151) → insertRow() L399-411: 신청일자 = 오늘, 등록자 = 로그인 사원, 구분 1. 맨 아래에 넣고 보여 준다(03 원칙 17) — DB에는 폼 [저장]이 넣는다
  const insertRow = () => {
    tempId.current -= 1;
    const row: IcamUser = {
      icamUserId: tempId.current, regDate: dayjs().format(FORMAT), regType: '1', regEmpId: user.userId, regEmpName: user.name,
      procAddYn: false, procModiYn: false, procdelYn: false,
    };
    keepId.current = row.icamUserId;
    setRows(prev => [...prev, row]);
    setTimeout(() => {
      const index = gridRef.current?.api?.getRowNode(String(row.icamUserId))?.rowIndex;
      if (index != null) gridRef.current?.api.ensureIndexVisible(index);
    });
  };

  // 폼 [저장] 뒤: 그리드 행을 바꾸고(새 행은 임시 번호 → 저장된 번호) 그 행을 계속 선택한다
  const onSaved = (oldId: number, row: IcamUser) => {
    keepId.current = row.icamUserId;
    setRows(prev => prev.map(r => (r.icamUserId === oldId ? row : r)));
    setSelected(row);
    setFormSeq(n => n + 1);
  };
  // 신청내용 창 저장 뒤: 행만 바꾼다 (폼의 다른 입력은 그대로)
  const onContentSaved = (row: IcamUser) => {
    setRows(prev => prev.map(r => (r.icamUserId === row.icamUserId ? row : r)));
    setSelected(row);
  };

  // [E4] deleteButton[삭제].Select (L165) → deleteCheck() L447-483
  const deleteCheck = () => {
    if (!selected) { message.warning('삭제할 정보를 먼저 선택해주세요'); return; }
    if (selected.apprStatusCode === '10' || selected.apprStatusCode === '20') { message.warning('결재진행 중인 문서가 존재합니다'); return; }
    // [E8] msgBox.DialogHide [YES] (L468) → delete() L504-528
    Modal.confirm({
      title: '확인',
      content: <span>결재완료된 문서도 같이 삭제됩니다.<br />1건의 정보를 삭제하시겠습니까?</span>,
      okText: '예',
      cancelText: '아니오',
      width: 310,
      onOk: async () => {
        try {
          if (selected.icamUserId > 0) await icamUserApi.remove([selected.icamUserId]);
          const rest = rows.filter(r => r.icamUserId !== selected.icamUserId);
          setRows(rest);
          setSelected(null);
          setFormSeq(n => n + 1);
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // viewCell (ImageCell "View") L222-250: apr.Apr01_Appr.selectById → Apr01_Edit_ApprDoc.retrieveApproval(apprModel, false, 닫으면 retrieve())  [E6]
  const apprView = (row: IcamUser) => {
    if (row.apprId == null) { message.warning('관련 상신문서가 존재하지 않습니다'); return; }
    setViewStatus(row.apprStatusCode ?? null);
    setViewApprId(row.apprId);
  };

  // insertLinkApproval() L336-397 [E7]
  const insertLinkApproval = (row: IcamUser) => {
    if (classTreeId == null) { message.warning('[문서분류지정]에서 먼저 문서분류를 선택해주세요'); return; }
    if (row.icamUserId <= 0) { message.warning('저장 후 결재요청을 진행하세요'); return; }   // 원본은 저장 전 행도 열지만 상신 대상 ID가 없어 TOBE는 저장 뒤에 한다
    if (RUNNING.includes(row.apprStatusCode ?? '')) { message.warning('결재 중인 문서이거나, 완료된 문서가 포함되어있습니다'); return; }
    const open = () => setLink({ classTreeId, linkCode: LINK_CODE, refId: row.icamUserId });
    if (row.apprId != null) {
      Modal.confirm({
        title: '상신',
        content: '새로운 결재요청을 진행시 기존문서는 삭제됩니다. 진행하시겠습니까?',
        okText: '예',
        cancelText: '아니오',
        width: 500,
        // aprDelete() L485-502: apr.Apr01_Appr.deleteByApprId — 실패하면 오류를 알리고 멈춘다
        onOk: async () => {
          try {
            await icamUserApi.deleteAppr(row.apprId as number);
            open();
          } catch (err) {
            message.error(errorMessage(err, '오류'));
          }
        },
      });
      return;
    }
    open();
  };

  // updateApprId() L289-301: icam.Icam55_IcamUser.updateApprId → retrieve()
  const updateApprId = async (apprId: number) => {
    if (!link) return;
    try {
      await icamUserApi.updateApprId(link.refId, apprId);
      void retrieve();
    } catch (err) {
      message.error(errorMessage(err, '결재문서 ID를 기록하지 못했습니다'));
    }
  };

  // buildGrid() L206-267
  const columnDefs = [
    gb.date('regDate', 90, '신청일자'),                                     // L251 (UX-08: 읽기 전용 날짜 90)
    gb.text('companyName', 300, '회사명'),                                  // L252
    gb.text('userName', 150, '사용자'),                                     // L253
    gb.group('처리구분', [                                                   // addHeaderGroupMap(0, 4, "처리구분", 1, 3)
      gb.textCenter('procAddYnStr', 80, '추가'),                            // L254
      gb.textCenter('procModiYnStr', 80, '변경'),                           // L255
      gb.textCenter('procdelYnStr', 80, '삭제'),                            // L256
    ]),
    gb.textCenter('apprStatusName', 100, '결재상태'),                        // L257
    iconCell<IcamUser>('edit', 'apprCell', 50, '결재요청', insertLinkApproval),   // L258
    iconCell<IcamUser>('view', 'viewCell', 50, '문서보기', apprView),             // L259
    gb.textCenter('regEmpName', 80, '등록자'),                              // L260
    gb.textCenter('procStateName', 100, '처리결과'),                         // L261
    gb.date('procDate', 90, '처리일자'),                                    // L262 (UX-08)
    gb.textCenter('procEmpName', 80, '처리자'),                              // L263
    gb.textArea('procNote', 300, '처리상세'),                                // L264
  ];

  return (
    <div style={{ height: '100%', background: '#fff' }}>
      <Splitter layout="vertical" style={{ height: '100%' }}>
        <Splitter.Panel min={200}>
          <div style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', padding: '20px 20px 8px', gap: 8 }}>
            {/* [E2] retrieveButton[조회].Select (L144) → retrieve() */}
            <SearchBar
              onSearch={() => void retrieve()}
              extra={
                <>
                  {/* [E3] insertButton[등록].Select (L151) → insertRow() */}
                  <Button type="register" onClick={insertRow}>등록</Button>
                  {/* [E4] deleteButton[삭제].Select (L165) → deleteCheck() */}
                  <Button type="delete" onClick={deleteCheck}>삭제</Button>
                </>
              }
            >
              <SearchBar.Field label="신청일자">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <DatePicker style={{ width: 130 }} allowClear={false} value={startDate} format={FORMAT} onChange={d => d && setStartDate(d)} />
                  ~
                  <DatePicker style={{ width: 130 }} allowClear={false} value={closeDate} format={FORMAT} onChange={d => d && setCloseDate(d)} />
                </span>
              </SearchBar.Field>
              <SearchBar.Field label="검색">
                {/* [E1] searchText.KeyPress [Enter] (L135) → retrieve() */}
                <SearchBar.Input style={{ width: 300 }} placeholder="회사명/사용자/처리상세" value={searchText} onChange={e => setSearchText(e.target.value)} />
              </SearchBar.Field>
              <Checkbox checked={procResult} onChange={e => setProcResult(e.target.checked)}>미처리만 조회</Checkbox>
            </SearchBar>
            <div style={{ flex: 1, minHeight: 0 }}>
              {/* [E5] grid.SelectionChanged (L172) → retrieveEditPage() */}
              <SingleGrid<IcamUser>
                gridRef={gridRef}
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.icamUserId)}
                onSelect={retrieveEditPage}
                onRowDataUpdated={e => {
                  if (keepId.current != null) e.api.getRowNode(String(keepId.current))?.setSelected(true, true);
                }}
              />
            </div>
          </div>
        </Splitter.Panel>
        {/* 편집 폼 높이 = 위 20 + 편집기 약 230 + 저장 줄 60 + 여유 = 400 (Icam55_Edit_UserRegAppr). 이보다 작으면 저장이 가려진다 */}
        <Splitter.Panel defaultSize={400} min={360}>
          <Icam55_Edit_UserRegAppr key={`${selected?.icamUserId ?? 'none'}-${formSeq}`} model={selected} onSaved={onSaved} onContentSaved={onContentSaved} />
        </Splitter.Panel>
      </Splitter>
      {/* 상세보기 = retrieveApproval, 결재요청 = insertLinkApproval(classTreeModel, "A33", 신청서 행, …) */}
      <Apr01_Edit_ApprDoc
        apprId={viewApprId}
        statusCode={viewStatus}
        link={link}
        onLinkSaved={id => void updateApprId(id)}
        onClosed={() => void retrieve()}
        onClose={() => { setViewApprId(null); setLink(null); }}
      />
    </div>
  );
};
