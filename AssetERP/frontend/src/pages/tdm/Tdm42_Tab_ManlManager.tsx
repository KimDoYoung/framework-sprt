/**
 * [1424] 책무 > 03. 부서책무매뉴얼 > 매뉴얼 관리(관리자) (N19, 1단계)
 * AS-IS: myApp/client/vi/tdm/Tdm42_Tab_ManlManager.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L104-136: 위 = 툴바(부서 300 "전체" · 검색 200 "직책/임원" · 사용 & 작성중인 매뉴얼만 조회 · [조회][저장][잠금][잠금해제]) + 아래 = 부서 책무매뉴얼 그리드(행번호, 체크박스 다중, 건수 묶음 헤더, 합계 행, 적용기간 셀 편집, 점검항목 조회창 아이콘)
 * N18 Tdm42_Tab_ManlOrgAppr와 같은 서버 클래스·같은 저장/잠금 흐름이고, 이 화면은 부서를 직접 고르고(로그인 부서 고정이 아님) 점검부서·점검항목 사용/미사용 건수 열이 더 있다.
 * 1단계: 결재요청(Apr01_Edit_ApprDoc.insertLinkApproval)·문서보기(Apr01_Edit_ApprDoc.retrieveApproval)는 다른 도메인(apr) 전자결재 편집창이라 점검만 하고 안내한다.
 *        잠금의 파일 생성(RD 리포트 PDF)은 E13처럼 서버 ManlOrgPdfMaker 기본 구현이 거절한다 — 연동이 서면 같은 흐름이 그대로 동작한다.
 * UX보강(10): 툴바 = SearchBar(UX-01), 저장 = count(UX-03)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, Modal, message } from 'antd';
import dayjs from 'dayjs';
import { errorMessage } from '@/api/client';
import { fileApi } from '@/api/file';
import { tdmApi } from '@/api/tdm';
import { FileInfo } from '@/types/sys';
import { TdmManlOrgManager } from '@/types/tdm';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor, iconCell } from '@/components/grid';
import { LookupInput } from '@/components/lookup/LookupInput';
import { Org00_Lookup_SelectTdm } from '@/components/lookup/Org00_Lookup_SelectTdm';
import { OrgTdm } from '@/types/emp';
import { SearchBar } from '@/components/search';
import { useGridCrud } from '@/hooks/useGridCrud';
import { Sys10_Lookup_FileViewer } from '../sys/Sys10_Lookup_FileViewer';
import { dynamicIconCell, dynamicViewCell } from './tdmGridCells';
import { Tdm43_Lookup_ManlItem } from './Tdm43_Lookup_ManlItem';

type Row = TdmManlOrgManager;

const gb = gbFor<Row>();
const APPR_SENT = ['10', '20', '30'];                                 // 상신(결재 진행·완료) 상태 코드
const END_OF_TIME = '2999-01-01';                                     // 종료일이 없을 때 쓰는 값 (AS-IS L333)

export const Tdm42_Tab_ManlManager: React.FC = () => {
  // [E0] 화면 열림 (생성자 L104-136) → settings() L138-205: useYn=false, retrieve()
  const [orgId, setOrgId] = useState<number | undefined>(undefined);   // orgLookup 빈칸="전체"
  const [orgName, setOrgName] = useState('');
  const [lookupOrg, setLookupOrg] = useState(false);
  const [itemOrg, setItemOrg] = useState<Row | null>(null);           // Tdm43_Lookup_ManlItem
  const [searchText, setSearchText] = useState('');
  const [useYn, setUseYn] = useState(false);                          // useYn.setBoxLabel("사용 & 작성중인 매뉴얼만 조회"), setValue(false)
  const [viewFile, setViewFile] = useState<FileInfo | null>(null);
  const [progress, setProgress] = useState<{ text: React.ReactNode; done: boolean } | null>(null);   // messageBox "파일 생성 및 잠금"

  // retrieve() L331-345: 서비스 tdm.Tdm42_ManlOrg.selectByText(companyId(서버가 로그인 회사), orgId(고른 부서), "%검색어%", useYn)
  const crud = useGridCrud<Row>({
    idField: 'manlOrgId',
    search: () => tdmApi.searchManlOrgManager(orgId, searchText, useYn),
    save: async changed => {
      await tdmApi.updateManlOrgPeriods(changed.map(r => ({ manlOrgId: r.manlOrgId, startDate: r.startDate, endDate: r.endDate })));
      return changed;
    },
    remove: async () => { /* 삭제 버튼이 없다 */ },
    newRow: () => ({}),
    reloadAfterSave: true,                                            // update() L586-594: GridUpdate 뒤 retrieve()
  });

  useEffect(() => { void crud.retrieve(); }, []);                     // eslint-disable-line react-hooks/exhaustive-deps

  // [E2] searchText.KeyPress [Enter] (L164)·[E3] retrieveButton[조회].Select (L175) → retrieve()
  const retrieve = () => crud.retrieve();

  // [E1] orgLookup.TriggerClick [result != null] (L142) → Org00_Lookup_SelectTdm.openAll(오늘, null, true, …): 고른 조직으로 바꾸고, [전체]면 비운다(orgId null). 조회는 [조회]
  const onOrgResult = (org: OrgTdm | null) => {
    setOrgId(org ? org.orgCodeId : undefined);
    setOrgName(org ? (org.korNm ?? '') : '');
  };

  // buildGrid() L207-329 actionCell(ImageCell "View", 점검항목 열) → lookupDetail() L347-357: Tdm43_Lookup_ManlItem.open(manlOrgId, lockYn, roleName, orgName)
  const lookupDetail = (row: Row) => setItemOrg(row);

  // [E4] updateButton[저장].Select (L181) → updateChk() L491-584
  const updateChk = async () => {
    crud.gridRef.current?.api?.stopEditing();
    const changed = crud.getChanged();
    for (const m of changed) {
      if (m.endDate && m.startDate && m.startDate > m.endDate) {
        return void message.warning('적용종료일은 적용시작일보다 미래일이어야 합니다.');
      }
    }
    try {
      // 화면 목록에 없는 부서 책무매뉴얼을 더해 적용기간 중복을 본다 (notManlOrgList)
      const others = await tdmApi.notManlOrgList(crud.rows.map(r => r.manlOrgId));
      const all = [...crud.rows, ...others];
      for (let i = 0; i < all.length; i++) {
        const m1 = all[i];
        if (!m1.startDate && !m1.endDate) continue;                   // 없으면 패스
        const start1 = m1.startDate ?? '';
        const close1 = m1.endDate ?? END_OF_TIME;
        if (start1 > close1) return void message.warning('적용종료일은 적용시작일보다 과거일 수 없습니다');
        for (let j = i + 1; j < all.length; j++) {
          const m2 = all[j];
          if (!m2.startDate && !m2.endDate) continue;
          const start2 = m2.startDate ?? '';
          const close2 = m2.endDate ?? END_OF_TIME;
          if (m1.manlOrgId !== m2.manlOrgId && m1.orgId === m2.orgId && m1.roleId === m2.roleId) {
            if (start1 <= close2 && close1 >= start2) return void message.warning('적용기간이 중복됩니다.');
          }
        }
      }
    } catch (err) {
      return void message.error(errorMessage(err, '조회 실패'));
    }
    await crud.saveRows();                                            // update()
  };

  // [E5] lockButton[잠금].Select (L187) → updateLock("P") / [E6] unLockButton[잠금해제].Select (L193) → updateLock("C") L596-686
  const updateLock = (actionType: 'P' | 'C') => {
    if (crud.hasChanges()) return void message.warning('저장되지 않은 데이터가 존재합니다. 저장 후 처리해 주세요');
    const selectList = (crud.gridRef.current?.api?.getSelectedRows() ?? []) as Row[];
    if (selectList.length === 0) return void message.warning('매뉴얼을 선택하세요');

    const updateList: Row[] = [];
    for (const m of selectList) {
      if (actionType === 'P' && !m.lockYn) {
        if (!m.manlDutyEndYn) return void message.warning('작성완료된 매뉴얼만 잠금설정이 가능합니다');
        if (!m.startDate) return void message.warning('적용시작일을 선택하세요');
        updateList.push(m);
      } else if (actionType === 'C' && m.lockYn) {
        if (m.apprStatusCode && APPR_SENT.includes(m.apprStatusCode)) return void message.warning('결재문서가 존재하여 잠금해제할 수 없습니다');
        updateList.push(m);
      }
    }
    if (updateList.length === 0) {
      return void message.warning(actionType === 'P' ? '선택된 매뉴얼은 이미 잠겨있습니다' : '선택된 매뉴얼은 잠겨있지 않습니다');
    }

    Modal.confirm({
      title: '확인',
      width: 450,
      content: actionType === 'P'
        ? `${updateList.length}건의 매뉴얼(잠금 매뉴얼 제외)을 잠금 설정하시겠습니까?`
        : `${updateList.length}건의 매뉴얼(미잠금 매뉴얼 제외)을 잠금 해제하시겠습니까?`,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {                                             // [E9] messageBox.DialogHide (L653) YES
        if (actionType === 'P') {
          await createFile(selectList);                               // 원본은 고른 행 전체(selectList)를 넘긴다
        } else {
          try {
            await tdmApi.updateManlOrgLock('C', updateList.map(m => m.manlOrgId));
            message.success('처리가 완료되었습니다');
            await retrieve();
          } catch (err) {
            message.warning(errorMessage(err, '처리 실패'));
          }
        }
      },
    });
  };

  // createFile() L688-718 → processRecreate() L720-773: 고른 행을 차례로 한 건씩 파일을 만들고(createRd), 끝나면 updateLock('P')
  // 한 건이 실패하면 멈추고(닫기만 켠다) 잠금은 하지 않는다 — createRd의 Sys99_Print 실패 분기
  const createFile = async (selectList: Row[]) => {
    setProgress({ text: '파일 생성준비중 ...', done: false });
    for (let i = 0; i < selectList.length; i++) {
      const m = selectList[i];
      const who = `${m.roleName ?? ''} ${m.exctName ?? ''}`;
      setProgress({ text: <>파일 재생성 ({i + 1}/{selectList.length})<br />파일 생성준비중 [{who}]</>, done: false });
      try {
        await tdmApi.recreateManlOrg(m.manlOrgId);
      } catch (err) {
        setProgress({
          text: <>파일 생성실패 [{who}]<div style={{ color: '#888', marginTop: 4 }}>{errorMessage(err, '파일 생성 실패')}</div></>,
          done: true,
        });
        return;
      }
    }
    try {
      await tdmApi.updateManlOrgLock('P', selectList.map(m => m.manlOrgId));
      setProgress({ text: `${selectList.length}개의 파일생성 및 잠금이 완료되었습니다.`, done: true });
      await retrieve();
    } catch (err) {
      setProgress(null);
      message.warning(errorMessage(err, '처리 실패'));
    }
  };

  // viewRd() L425-467: CreateTdmManlOrg → RD 뷰어(Tdm42_Rd_Manual) — RD 연동이 없어 열 수 없다
  const viewRd = () => {
    message.warning('RD 뷰어 연동이 없어 책무매뉴얼을 열 수 없습니다.');
  };

  // viewFile() L469-489: sys.Sys10_File.selectByParentId(manlOrgId) 첫 건을 Sys10_Lookup_FileViewer로, 없으면 "파일생성실패로인한 RD뷰어호출" 후 viewRd()
  const viewManlFile = async (row: Row) => {
    const files = await fileApi.searchByParentId(row.manlOrgId);
    if (files.length > 0) {
      setViewFile(files[0]);
    } else {
      message.info('파일생성실패로인한 RD뷰어호출');
      viewRd();                                                       // 혹시나 파일생성 안됬을시 RD뷰어 호출
    }
  };

  // buildGrid() viewCell(ImageCell "View", 부서책무매뉴얼 열): 잠금이면 viewFile(), 아니면 viewRd()
  const onViewManl = async (row: Row) => {
    try {
      if (row.lockYn) await viewManlFile(row);
      else viewRd();
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  // buildGrid() actionCell(ImageCell "Edit", 결재요청 열) → dcrChk() L359-391 → insertLinkApproval() L393-407 (Dcr30_Link.selectByLinkCode "A93" → Apr01_Edit_ApprDoc 상신)
  const onApprRequest = (row: Row) => {
    if (crud.hasChanges()) return void message.warning('저장 후 진행해주세요');
    if (!row.lockYn) return void message.warning('잠금설정된 매뉴얼만 결재요청이 가능합니다');
    const code = row.apprStatusCode;
    if (code && !['00', '40', '99'].includes(code)) return void message.warning('결재 중인 문서가 존재합니다');
    message.info('전자결재 상신 창은 다음 단계에서 연결됩니다');       // Apr01_Edit_ApprDoc.insertLinkApproval → updateApprId() L409-423
  };

  // buildGrid() apprCell(ImageCell "View", 문서보기 열) → ApprCallbackResult + Apr01_Edit_ApprDoc.retrieveApproval
  const onViewAppr = (row: Row) => {
    if (row.apprId == null) return void message.warning('문서가 존재하지않습니다');
    message.info('전자결재 문서 보기 창은 다음 단계에서 연결됩니다');
  };

  // [E7 생략] rdFileDownloadForm.SubmitComplete (L199) → insertLinkApproval(): 툴바에 붙은 숨은 폼이라 화면에서 제출하는 곳이 없다(결재요청은 그리드 아이콘 → dcrChk). 전자결재 상신은 다음 단계
  // [E10 생략] button01[닫기].Select (L706) → 도달 불가: 파일 생성 진행 창의 [닫기]는 아래 Modal 푸터로 변환(createFile의 messageBox)

  // buildGrid() L207-329. 묶음 헤더 "건수"(HeaderGroupMap(0,6,1,7): 책무~점검항목(미사용) 6열 + 아이콘), getSumGrid("", 2, 6, 11): 직책 열 라벨 없음, 합계는 6~11번째 열(책무~점검항목(미사용))
  const columnDefs = useMemo(() => [
    gb.text('orgName', 170, '점검부서'),  // L293
    gb.text('roleName', 170, '직책'),  // L294
    gb.textCenter('exctName', 100, '임원'),  // L295
    gb.booleanYn2('manlDutyEndYn', 55, '작성<br>완료'),  // L296
    gb.date('manlDutyEndDate', 90, '작성완료일'),  // L297
    {
      ...gb.group('건수', [
        gb.longCenter('taskCnt', 70, '책무'),  // L298
        gb.longCenter('taskRelateDetailCnt', 70, '책무세부'),  // L299
        gb.longCenter('taskRelateDutyCnt', 70, '관리의무'),  // L300
        gb.longCenter('manlCnt', 70, '점검항목<br>(전체)'),  // L301
        gb.longCenter('manlUseCnt', 70, '점검항목<br>(사용)'),  // L302
        gb.longCenter('manlUnuseCnt', 70, '점검항목<br>(미사용)'),  // L303
        iconCell<Row>('view', 'actionCell', 30, ' ', row => lookupDetail(row)),  // L304 addCell(editCell)
      ]),
    },
    gb.date('startDate', 90, '적용시작일', { editor: 'date' }),  // L305
    gb.date('endDate', 90, '적용종료일', { editor: 'date' }),  // L306
    gb.booleanYn2('lockYn', 55, '잠금'),  // L307
    dynamicViewCell<Row>('startDateYnStr', 'startDateYnStr', 60, '부서책무<br>매뉴얼', row => { void onViewManl(row); }),  // L308 addDynamicCell(viewCell, true)
    dynamicIconCell<Row>('edit', 'apprStatusCode', 'apprRequest', 60, '결재요청', ['00', '99', '40'], onApprRequest),  // L310 addDynamicCell(actionCell, {00,99,40})
    gb.textStatus('apprStatusName', 80, '결재상태'),  // L311
    dynamicIconCell<Row>('view', 'apprStatusCode', 'apprView', 60, '문서보기', ['10', '20', '30'], onViewAppr),  // L312 addDynamicCell(apprCell, {10,20,30})
    gb.text('jobName', 200, '작업명'),  // L313
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  // [E8] gridBuilder.BeforeStartEdit [model != null] (L316) → 잠겨 있으면 적용종료일만 수정할 수 있다: "수정할 수 없습니다. 잠금해제 후 저장하세요"
  const gridCrud = {
    ...crud,
    gridProps: {
      ...crud.gridProps,
      onCellEditingStarted: (e: Parameters<NonNullable<typeof crud.gridProps.onCellEditingStarted>>[0]) => {
        crud.gridProps.onCellEditingStarted?.(e);
        if (e.data?.lockYn && e.column.getColId() !== 'endDate') {
          e.api.stopEditing(true);
          message.warning('수정할 수 없습니다. 잠금해제 후 저장하세요');
        }
      },
    },
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, padding: 20, boxSizing: 'border-box', background: '#fff' }}>
      <SearchBar
        onSearch={retrieve}
        extra={
          <>
            <Button type="save" count={crud.changes} onClick={updateChk}>저장</Button>
            <Button type="save" onClick={() => updateLock('P')}>잠금</Button>
            <Button type="cancel" onClick={() => updateLock('C')}>잠금해제</Button>
          </>
        }
      >
        <SearchBar.Field label="부서">
          <LookupInput width={300} placeholder="전체" value={orgName} onOpen={() => setLookupOrg(true)} onClear={() => onOrgResult(null)} />
        </SearchBar.Field>
        <SearchBar.Field label="검색">
          <SearchBar.Input style={{ width: 200 }} placeholder="직책/임원" value={searchText} onChange={e => setSearchText(e.target.value)} />
          <Checkbox checked={useYn} onChange={e => setUseYn(e.target.checked)}>사용 &amp; 작성중인 매뉴얼만 조회</Checkbox>
        </SearchBar.Field>
      </SearchBar>
      <div style={{ flex: 1, minHeight: 0 }}>
        <CellEditGrid<Row>
          crud={gridCrud}
          columnDefs={columnDefs}
          sumRow={{ labelField: 'roleName', label: '', sum: ['taskCnt', 'taskRelateDetailCnt', 'taskRelateDutyCnt', 'manlCnt', 'manlUseCnt', 'manlUnuseCnt'] }}
        />
      </div>
      <Org00_Lookup_SelectTdm stdDate={lookupOrg ? dayjs().format('YYYY-MM-DD') : undefined} single allButton onClose={() => setLookupOrg(false)} onSelect={onOrgResult} />
      <Tdm43_Lookup_ManlItem manlOrg={itemOrg} onClose={() => setItemOrg(null)} />
      <Sys10_Lookup_FileViewer file={viewFile} onClose={() => setViewFile(null)} />
      {/* messageBox "파일 생성 및 잠금" (L563-593): 430×170, 진행 중 닫을 수 없고 끝나면 [닫기] — [E8] button01[닫기].Select (L581) → messageBox.hide() */}
      <Modal
        open={progress !== null}
        title="파일 생성 및 잠금"
        width={430}
        closable={false}
        maskClosable={false}
        keyboard={false}
        footer={<Button type="close" disabled={!progress?.done} onClick={() => setProgress(null)}>닫기</Button>}
      >
        {progress?.text}
      </Modal>
    </div>
  );
};
