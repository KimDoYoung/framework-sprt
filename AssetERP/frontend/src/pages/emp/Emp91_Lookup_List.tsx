/**
 * 화면안내 창 (EE62) — 기본설정(MySetting)의 [Asset-ERP 화면안내]가 연다. 내가 "다시 보지 않음"으로 끈 메뉴 안내 목록과 전체 비활성화
 * AS-IS: myApp/client/vi/emp/Emp91_Lookup_List.java (242줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L59-86: 520×550, 머리말 "화면안내", [검색(메뉴명)][조회] + [화면안내 전체 비활성화] 체크 + 단일 그리드 + 푸터 [닫기]
 * buildGrid() L163-206: 메뉴명 240 · 차단일자 100 · 해제 아이콘 60 · 보기 아이콘 60
 * 스타일: MG (임시 스크립트 판별 — docs/modal-style.md 모달 SID)
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, Modal, message } from 'antd';
import { empMenuInfoNoticeApi } from '@/api/emp';
import { sysMenuGuideContentApi } from '@/api/sys';
import { errorMessage } from '@/api/client';
import { MenuInfoNotice } from '@/types/emp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor, iconCell } from '@/components/grid';
import { SearchBar } from '@/components/search';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Sys55_Lookup_Content } from '../sys/Sys55_Lookup_Content';

const gb = gbFor<MenuInfoNotice>();

interface Props {
  open: boolean;
  onClose: () => void;
}

export const Emp91_Lookup_List: React.FC<Props> = ({ open, onClose }) => {
  const [rows, setRows] = useState<MenuInfoNotice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [guideContent, setGuideContent] = useState<string | null>(null);   // 회사 화면안내(Sys55_Lookup_Content.view)
  const [allBlocked, setAllBlocked] = useState(false);   // settings() L89-99: 전체 차단이면 체크, 그리드 가림, 검색·조회 꺼짐

  // retrieve() L208-219 — emp.Emp91_MenuInfoNotice.selectByText
  const retrieve = useCallback(async (text: string) => {
    setLoading(true);
    try {
      setRows(await empMenuInfoNoticeApi.search(text));
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, []);

  // [E0] 열림 (open L55-57, settings L89-99) → 전체 비활성 상태 확인 + retrieve()
  useEffect(() => {
    if (!open) return;
    setSearchText('');
    void (async () => {
      try { setAllBlocked(await empMenuInfoNoticeApi.isAllBlocked()); } catch { setAllBlocked(false); }
    })();
    void retrieve('');
  }, [open, retrieve]);

  // [E1] checkBox.ValueChange (L101-138) → updatePersonId(menuId 0) / deletePersonId(menuId 0)
  const toggleAll = async (blocked: boolean) => {
    try {
      await empMenuInfoNoticeApi.setAllBlocked(blocked);
      setAllBlocked(blocked);
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E4] 해제 아이콘 (deleteCell L165-170) → deleteRow() L221-225 → emp.Emp91_MenuInfoNotice.delete
  const release = async (row: MenuInfoNotice) => {
    try {
      await empMenuInfoNoticeApi.remove([row.menuInfoNoticeId]);
      setRows(prev => prev.filter(r => r.menuInfoNoticeId !== row.menuInfoNoticeId));
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // [E5] 보기 아이콘 (viewCell L171-198): sys.Sys55_MenuGuideCompany.getMenuDetailModel(companyId, menuNo)
  //      결과가 없거나 내용이 비었으면 MenuInfoNotice.message(메뉴 안내문), 있으면 Sys55_Lookup_Content.view(resultModel, false)
  const view = async (row: MenuInfoNotice) => {
    try {
      const guide = row.menuNo ? await sysMenuGuideContentApi.getByMenuNo(row.menuNo) : null;
      if (guide && (guide.content ?? '').trim() !== '') {
        setGuideContent(guide.content);
      } else {
        Modal.info({ title: '화면안내', content: row.menuNote ?? '', okText: '닫기', width: 450 });
      }
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    }
  };

  const columns = [
    gb.text('menuName', 240, '매뉴명'),                 // L200
    gb.date('date', 100, '차단일자'),                    // L201
    iconCell<MenuInfoNotice>('delete', 'actionCell', 60, '해제', release),   // L202
    iconCell<MenuInfoNotice>('view', 'actionCell02', 60, '보기', view),       // L203
  ];

  return (
    <>
    <LookupModal
      open={open}
      title="화면안내"
      width={650}
      maskClosable={false}
      onCancel={onClose}
      footer={
        <div style={{ textAlign: 'center' }}>
          {/* [E6] cancelButton[닫기].Select (L155) → hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </div>
      }
    >
      <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* [E2] retrieveButton[조회].Select (L149) → retrieve(). [E3] searchTextField.KeyPress [Enter] (L141) → retrieve() */}
        <SearchBar onSearch={() => retrieve(searchText)} loading={loading} disabled={allBlocked}
          extra={<Checkbox checked={allBlocked} onChange={e => void toggleAll(e.target.checked)}>화면안내 전체 비활성화</Checkbox>}>
          <SearchBar.Field label="검색">
            <SearchBar.Input style={{ width: 150 }} placeholder="매뉴명" disabled={allBlocked} value={searchText} onChange={e => setSearchText(e.target.value)} />
          </SearchBar.Field>
        </SearchBar>
        <div style={{ flex: 1, minHeight: 0, opacity: allBlocked ? 0.4 : 1, pointerEvents: allBlocked ? 'none' : undefined }}>
          <SingleGrid<MenuInfoNotice> rowData={rows} columnDefs={columns} loading={loading} getRowId={p => String(p.data.menuInfoNoticeId)} />
        </div>
      </div>
    </LookupModal>
    <Sys55_Lookup_Content open={guideContent != null} mode="view" content={guideContent} onClose={() => setGuideContent(null)} />
    </>
  );
};
