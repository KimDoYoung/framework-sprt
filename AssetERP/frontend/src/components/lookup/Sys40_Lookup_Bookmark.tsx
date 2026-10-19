/**
 * 북마크 목록(그룹설정) 조회창 (E29) — Sys06_Lookup_SearchMenu의 [북마크]에서 연다 (sys 도메인 다른 화면에서도 쓸 수 있는 조회창)
 * AS-IS: myApp/client/vi/sys/Sys40_Lookup_Bookmark.java — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L75-99: 모달 710×500 "북마크 목록(그룹설정)", 툴바([조회][저장][전체삭제] + 안내 글) + 셀 편집 그리드(행번호, 그룹명 160·그룹내 매뉴순서 130 편집, 매뉴명 360), 아래 [닫기]
 * UX보강(10): 저장 = 저장(n)(UX-03)
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { message, Modal, Space } from 'antd';
import { errorMessage } from '@/api/client';
import { sysApi } from '@/api/sys';
import { Bookmark } from '@/types/sys';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<Bookmark>();

/** buildGrid() L101-109 */
const buildGrid = () => [
  gb.text('parentTitleNm', 160, '그룹명', { editor: 'text' }),  // L104
  gb.textCenter('seq', 130, '그룹내 매뉴순서', { editor: 'text' }),  // L105
  gb.text('menuNm', 360, '매뉴명'),  // L106
];

interface Props {
  open: boolean;
  /** 닫기 [E4] closeButton[닫기].Select (L66): callback.execute() 뒤 hide() — 부르는 쪽이 목록을 다시 읽는다 */
  onClose: () => void;
}

export const Sys40_Lookup_Bookmark: React.FC<Props> = ({ open, onClose }) => {
  const columnDefs = useMemo(buildGrid, []);

  const crud = useGridCrud<Bookmark>({
    idField: 'bookmarkId',
    // retrieve() L111-124: 로그인 회사·사용자, searchText "%" → sys.Sys40_Bookmark.selectBySearchText
    search: useCallback(() => sysApi.searchBookmarks(), []),
    // update() L126-129: GridUpdate → sys.Sys40_Bookmark.update (그룹명·순서)
    save: useCallback(async (rows: Bookmark[]) => { await sysApi.updateBookmarks(rows); return rows; }, []),
    remove: useCallback(async () => 0, []),
    newRow: useCallback(() => ({}), []),
    reloadAfterSave: true,
  });
  const { retrieve } = crud;

  // [E0] 화면 열림 (생성자 L75-99) → show(), retrieve()
  useEffect(() => {
    if (open) void retrieve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // [E3] deleteButton[전체삭제].Select (L59) → deleteCheck() L131-150: "확인"/"북마크 설정을 모두 해제하시겠습니까?" → [E5] msgBox.DialogHide [YES] (L134) → delete() L152-166
  const deleteCheck = () => {
    Modal.confirm({
      title: '확인',
      content: '북마크 설정을 모두 해제하시겠습니까?',
      width: 450,
      okText: '예',
      cancelText: '아니오',
      onOk: async () => {
        try {
          await sysApi.deleteAllBookmarks();
          await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  return (
    <Modal open={open} title="북마크 목록(그룹설정)" width={710} maskClosable={false} onCancel={onClose} destroyOnHidden
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button type="close" onClick={onClose}>닫기</Button>
          </Space>
        </div>
      }
    >
      <div style={{ height: 380, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Space>
          {/* [E1] retrieveButton[조회].Select (L47) → retrieve() */}
          <Button type="search" onClick={() => crud.retrieve()}>조회</Button>
          {/* [E2] updateButton[저장].Select (L53) → update(). 저장(n)은 UX-03 */}
          <Button type="save" count={crud.changes} onClick={crud.saveRows}>저장</Button>
          <Button type="delete" onClick={deleteCheck}>전체삭제</Button>
          <span style={{ color: '#4472C4' }}>※ 그룹명은 '가나다' 순으로 자동 정렬되어 보여집니다</span>
        </Space>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CellEditGrid<Bookmark> crud={crud} columnDefs={columnDefs} />
        </div>
      </div>
    </Modal>
  );
};
