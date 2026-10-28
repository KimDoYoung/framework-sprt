/**
 * 급여관리(항목별) (S17) — 경영관리 > 04. 급여관리 > 급여관리(항목별) #1281
 * AS-IS: myApp/client/vi/pay/Pay10_Tab_MonthItem.java (430줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L201-220 / settings() L85-199: 툴바 50 (해당 연도 · 구분 칸 "구분을 선택해주세요" · 항목 칸 "전체" · 검색 칸 "사원/항목명" · [조회][저장][일괄생성][출력/다운로드])
 *   + 항목 편집 그리드(체크 다중: 사번 100 · 사원명 150 · 직급 100 · 항목구분 150 · 항목명 250 · 금액 150(편집)).
 * 급여 지급일(payDate)은 화면에 보이는 입력칸이 아니라 구분 조회창(Pay10_Lookup_GroupList, S16)이 정해 주는 값이다
 * insert() L237-247(Pay10_Lookup_Insert 열기)은 호출처가 없어 만들지 않았다(툴바에 [생성]이 없다)
 * 출력 창은 공통 RdViewer가 맡는다(AS-IS RDViewer.viewer, mrd Pay10_Rd_MonthItem)
 * UX보강(10): 툴바 = SearchBar(UX-01·04), 저장(n) = UX-03
 */
import React, { useMemo, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { payApi } from '@/api/pay';
import { rdApi } from '@/api/rd';
import { errorMessage } from '@/api/client';
import { PayItem, PayMonthGroup, PayMonthItemText } from '@/types/pay';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';
import { SearchBar } from '@/components/search';
import { LookupInput } from '@/components/lookup/LookupInput';
import { RdViewer } from '@/components/lookup/RdViewer';
import dayjs from 'dayjs';
import { Pay10_Lookup_GroupList } from './Pay10_Lookup_GroupList';
import { Pay20_Lookup_MonthItem } from './Pay20_Lookup_MonthItem';

const gb = gbFor<PayMonthItemText>();

// GXT 체크박스 선택 모델처럼 체크한 행이 선택 행. 금액 셀 편집이 행 선택을 흔들지 않도록 클릭 선택은 끈다
const ROW_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

/** 항목 칸 [E2]의 두 용도 — 칸을 눌러 항목을 고르는 것('filter')과 [일괄생성]이 일괄 생성할 항목을 고르는 것('bulk') */
type ItemLookup = 'filter' | 'bulk' | null;

export const Pay10_Tab_MonthItem: React.FC = () => {
  // [E0] 화면 열림 (생성자 L201-220) → settings(): 연도 = 올해, 구분 = "구분을 선택해주세요", 항목 = "전체"(코드 "%"), 검색 = "사원/항목명"
  const [yearText, setYearText] = useState(dayjs().format('YYYY'));
  // payGroupName: 값 = 지급구분 코드(payCode), 글자 = 구분명
  const [payCode, setPayCode] = useState<string | null>(null);
  const [payGroupText, setPayGroupText] = useState('');
  const [payDate, setPayDate] = useState<string | null>(null);
  // itemCode: 항목 칸이 정한 코드("%" = 전체), itemName: 칸에 보이는 글자
  const [itemCode, setItemCode] = useState('%');
  const [itemName, setItemName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [groupOpen, setGroupOpen] = useState(false);
  const [itemLookup, setItemLookup] = useState<ItemLookup>(null);
  const [rdUrl, setRdUrl] = useState<string | null>(null);
  const [rdLoading, setRdLoading] = useState(false);
  // monthId: retrieve() 뒤 첫 행의 급여 ID (checkAppr에 쓴다), 구분을 새로 고르면 비운다
  const monthIdRef = useRef<number | null>(null);

  // retrieve() L394-420 → pay.Pay11_MonthItem.selectByText (companyId는 서버가 로그인 사용자로)
  const crud = useGridCrud<PayMonthItemText>({
    idField: 'monthItemId',
    search: async () => {
      if (payCode == null || payDate == null) return [];
      const list = await payApi.searchMonthItemsByText({ payCode, payDate, itemCode, searchText });
      monthIdRef.current = list.length > 0 ? list[0].monthId : monthIdRef.current;
      return list;
    },
    // 저장은 update()가 checkAppr 뒤에 직접 한다(아래). 행 추가·삭제 버튼은 원본에 없다
    save: async () => [] as PayMonthItemText[],
    remove: async () => 0,
    newRow: () => ({ monthItemId: 0, monthId: 0, personId: 0, itemType: '', itemCd: '' }),
  });
  const { gridRef, retrieve: retrieveRows } = crud;

  // buildGrid() L222-235: 사번 100 · 사원명 150 · 직급 100 · 항목구분 150(가운데) · 항목명 250 · 금액 150(편집)
  const columnDefs = useMemo(() => [
    gb.textCenter('personNo', 100, '사번'),
    gb.textCenter('personName', 150, '사원명'),
    gb.textCenter('posName', 100, '직급'),
    gb.textCenter('itemTypeName', 150, '항목구분'),
    gb.text('itemName', 250, '항목명'),
    gb.long('itemAmt', 150, '금액', { editor: 'number' }),
  ], []);

  // [E3][E4] retrieve(): 구분이 없으면 안내, 조회 뒤 첫 행 선택 + 그 급여 ID 보관
  const retrieve = async () => {
    if (payCode == null || payDate == null) {
      message.warning('구분을 선택해주세요');
      return;
    }
    await retrieveRows();
    setTimeout(() => gridRef.current?.api?.getDisplayedRowAtIndex(0)?.setSelected(true, true), 0);
  };

  // [E1] payGroupName.TriggerClick (L107) → lookupPayGroup() L362-375: 고른 구분·지급일로 채우고 monthId를 비운다(조회는 안 함)
  const lookupPayGroup = (g: PayMonthGroup) => {
    setGroupOpen(false);
    setPayCode(g.payCd);
    setPayGroupText(g.payGroupNm);
    setPayDate(g.date);
    monthIdRef.current = null;
  };

  // [E5] updateButton[저장].Select (L142) → checkAppr() L249-268 → update() L324-360
  const checkAppr = async () => {
    if (payCode == null || payDate == null) {
      message.warning('구분을 먼저 선택해주세요');
      return;
    }
    try {
      const res = await payApi.checkMonthAppr(payCode, payDate, monthIdRef.current);
      if (!res.ok) {
        message.warning(res.message ?? '저장할 수 없습니다');
        return;
      }
    } catch (err) {
      message.error(errorMessage(err, '확인 실패'));
      return;
    }
    await update();
  };

  // update(): 바뀐 행만 보낸다 → 성공하면 retrieve(), 실패하면 서버 메시지
  const update = async () => {
    const changed = crud.getChanged();
    if (changed.length === 0) return;
    try {
      await payApi.saveMonthItemAmounts(changed.map(r => ({
        monthId: r.monthId, monthItemId: r.monthItemId, itemType: r.itemType, itemCd: r.itemCd, itemAmt: r.itemAmt ?? null,
      })));
    } catch (err) {
      message.warning(errorMessage(err, '저장 실패'));
      return;
    }
    await retrieve();
  };

  // [E2] itemName.TriggerClick (L115) → lookupItemList() L377-392 / [E6] insertButton[일괄생성].Select (L148) → lookupItem() L270-304
  const onItemPicked = (item: PayItem | null) => {
    const mode = itemLookup;
    setItemLookup(null);
    if (mode === 'filter') {
      // 고르면 항목 코드·이름, [취소]면 코드 "%"·이름 비움
      setItemCode(item?.itemCd ?? '%');
      setItemName(item?.itemName ?? '');
      return;
    }
    if (item == null || payCode == null || payDate == null) return;
    // [E8] msgBox.DialogHide [YES] (L285) → insertItem() L306-322
    Modal.confirm({
      title: '확인',
      content: `'${item.itemName}' 해당항목을 일괄생성을 진행하시겠습니까?`,
      width: 500,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await payApi.insertMonthItemBulk({ payCode, payDate, itemType: item.itemType ?? '', itemCode: item.itemCd ?? '' });
        } catch (err) {
          message.warning(errorMessage(err, '일괄생성 실패'));
          return;
        }
        message.info('일괄생성이 완료되었습니다');
        await retrieve();
      },
    });
  };

  const lookupItem = () => {
    if (payDate == null) {
      message.warning('구분을 먼저 선택해주세요');
      return;
    }
    setItemLookup('bulk');
  };

  // [E7] downLoadButton[출력/다운로드].Select (L154): insertRdMonthItem → RDViewer.viewer(mrd Pay10_Rd_MonthItem, rv rdGroupId·year)
  const download = async () => {
    if (payCode == null || payDate == null) {
      message.warning('구분을 선택해주세요');
      return;
    }
    setRdLoading(true);
    try {
      const rdGroupId = await payApi.rdPrintMonthItems({ payCode, payDate, itemCode, searchText });
      const res = await rdApi.buildUrl({ kind: 'viewer', mrd: 'Pay10_Rd_MonthItem', options: '/rhtmlimportopt [2]', rv: { rdGroupId, year: payGroupText } });
      setRdUrl(res.url);
    } catch (err) {
      message.error(errorMessage(err, '출력 실패'));
    } finally {
      setRdLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', boxSizing: 'border-box', padding: 20 }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: '1px solid #d9d9d9', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E4] retrieveButton[조회].Select (L136) → retrieve() */}
        <SearchBar
          onSearch={retrieve}
          loading={crud.loading}
          extra={<>
            {/* [E5] updateButton[저장].Select (L142) → checkAppr() */}
            <Button type="save" count={crud.changes} onClick={checkAppr}>저장</Button>
            {/* [E6] insertButton[일괄생성].Select (L148) → lookupItem() */}
            <Button type="generate" onClick={lookupItem}>일괄생성</Button>
            {/* [E7] downLoadButton[출력/다운로드].Select (L154) */}
            <Button type="download" onClick={download} loading={rdLoading}>출력/다운로드</Button>
          </>}
        >
          <SearchBar.Field label="해당 연도">
            <SearchBar.Input style={{ width: 70 }} value={yearText} onChange={e => setYearText(e.target.value)} />
          </SearchBar.Field>
          <SearchBar.Field label="구분">
            {/* [E1] payGroupName.TriggerClick (L107) → lookupPayGroup() */}
            <LookupInput value={payGroupText} placeholder="구분을 선택해주세요" width={200} onOpen={() => setGroupOpen(true)} />
          </SearchBar.Field>
          <SearchBar.Field label="항목">
            {/* [E2] itemName.TriggerClick (L115) → lookupItemList(). x = 항목 "전체"로 되돌림(AS-IS [취소]) */}
            <LookupInput
              value={itemName}
              placeholder="전체"
              width={160}
              onOpen={() => setItemLookup('filter')}
              onClear={() => { setItemCode('%'); setItemName(''); }}
            />
          </SearchBar.Field>
          <SearchBar.Field label="검색">
            {/* [E3] searchText.KeyPress [Enter] (L123) → retrieve() */}
            <SearchBar.Input style={{ width: 150 }} placeholder="사원/항목명" value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<PayMonthItemText> crud={crud} columnDefs={columnDefs} rowSelection={ROW_SELECTION} />
        </div>
      </div>
      <Pay10_Lookup_GroupList open={groupOpen} year={yearText} onResult={lookupPayGroup} onClose={() => setGroupOpen(false)} />
      <Pay20_Lookup_MonthItem open={itemLookup != null} onResult={onItemPicked} />
      {/* 출력 창은 RdViewer (AS-IS RDViewer.viewer) */}
      <RdViewer url={rdUrl} title="급여관리(항목별)" onClose={() => setRdUrl(null)} />
    </div>
  );
};
