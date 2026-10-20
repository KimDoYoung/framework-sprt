/**
 * [1212] 문서작성 > 05. 메일관리 > 공용메일 관리 (G13)
 * AS-IS: myApp/client/vi/cmp/Cmp10_Tab_MailBook.java (208줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 레이아웃 생성자 L48-80: BorderLayout — west(폭 1000, 분할, 여백 20·0·22·20, 테두리) 툴바 [조회][등록][삭제] + 그리드(단일 선택, 행번호, 3열: 이메일 220 · 비고 500 · 수정 60),
 *   center = Cmp10_Tab_MailBookList(공용메일 권한자, 테두리, 여백 20·20·22·-2)
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Splitter, message } from 'antd';
import { cmpMailBookApi } from '@/api/cmp';
import { errorMessage } from '@/api/client';
import { CmpMailBook } from '@/types/cmp';
import { Button } from '@/components/button';
import { SingleGrid, gbFor } from '@/components/grid';
import { iconCell } from '@/components/grid/iconCell';
import { Cmp10_Tab_MailBookList } from './Cmp10_Tab_MailBookList';
import { Cmp10_Edit_Tab_MailBook } from './Cmp10_Edit_Tab_MailBook';

const gb = gbFor<CmpMailBook>();

export const Cmp10_Tab_MailBook: React.FC = () => {
  const [rows, setRows] = useState<CmpMailBook[]>([]);
  const [loading, setLoading] = useState(false);
  // 권한자 목록에 넘기는 공용메일 ID — 고르기 전·고른 행이 없어졌을 때는 그대로 둔다 (retrieveMailBookList L149-154: mailBookModel != null 일 때만)
  const [mailBookId, setMailBookId] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ open: boolean; mailBook: CmpMailBook | null }>({ open: false, mailBook: null });
  // 삭제할 때 고른 행 (grid.getSelectionModel().getSelectedItem())
  const selectedRef = useRef<CmpMailBook | null>(null);

  // retrieve() L133-147: 서비스 cmp.Cmp10_MailBook.selectByCompanyId(companyId), 끝나면 첫 행 선택 (select(0))
  const retrieve = async () => {
    setLoading(true);
    try {
      setRows(await cmpMailBookApi.searchMailBooks());
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // [E0] 화면 열림 (생성자 L48-80) → settings(), retrieve()
  useEffect(() => {
    void retrieve();
  }, []);

  // [E4] grid.SelectionChanged (L103) → retrieveMailBookList() L149-154
  const onSelect = (row: CmpMailBook | undefined) => {
    selectedRef.current = row ?? null;
    if (row) setMailBookId(row.mailBookId);
  };

  // [E2] insertButton[등록].Select (L91) → insert() L156-164: Cmp10_Edit_Tab_MailBook.insert(callback → retrieve())
  const insert = () => setEditing({ open: true, mailBook: null });

  // [E3] deleteButton[삭제].Select (L97) → deleteCheck() L166-185: "확인"/"해당 공유메일 정보를 삭제하겠습니까?"(폭 320) → [E5] msgBox.DialogHide [YES] (L169) → delete() L187-207
  const deleteCheck = () => {
    Modal.confirm({
      title: '확인',
      content: '해당 공유메일 정보를 삭제하겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 320,
      onOk: () => deleteMailBook(),
    });
  };

  // delete() L187-207: 서비스 cmp.Cmp11_MailRole.deleteByMailBookId(mailBookId) → cmp.Cmp10_MailBook.delete → retrieve()
  const deleteMailBook = async () => {
    const target = selectedRef.current;
    if (!target) return;
    try {
      await cmpMailBookApi.deleteMailBook(target.mailBookId);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '삭제 실패'));
    }
  };

  // buildGrid() L111-131 (단일 선택)
  const columnDefs = useMemo(() => [
    gb.text('emailAddr', 220, '이메일'),  // L125
    gb.text('note', 500, '비고'),  // L126
    // L127 actionCell(Edit) → Cmp10_Edit_Tab_MailBook.edit(선택한 행, callback → retrieve())
    iconCell<CmpMailBook>('edit', 'actionCell', 60, '수정', row => setEditing({ open: true, mailBook: row })),
  ], []);

  return (
    <>
    <Splitter style={{ height: '100%' }}>
      <Splitter.Panel defaultSize={1000} max={1000} min={300}>
        <div style={{ height: '100%', padding: '20px 0 22px 20px', boxSizing: 'border-box' }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
            <div>
              {/* [E1] retrieveButton[조회].Select (L85) → retrieve() */}
              <Button type="search" onClick={retrieve}>조회</Button>
              <Button type="register" onClick={insert}>등록</Button>
              <Button type="delete" onClick={deleteCheck}>삭제</Button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <SingleGrid<CmpMailBook>
                rowData={rows}
                columnDefs={columnDefs}
                getRowId={p => String(p.data.mailBookId)}
                loading={loading}
                onSelect={onSelect}
                // 조회가 끝나면 첫 행을 고른다: grid.getSelectionModel().select(0, false)
                onRowDataUpdated={e => e.api.getDisplayedRowAtIndex(0)?.setSelected(true)}
              />
            </div>
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel min={200}>
        <div style={{ height: '100%', padding: '20px 20px 22px 0', boxSizing: 'border-box' }}>
          <div style={{ height: '100%', border: '1px solid #d9d9d9', padding: 8, boxSizing: 'border-box' }}>
            <Cmp10_Tab_MailBookList mailBookId={mailBookId} />
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
    <Cmp10_Edit_Tab_MailBook
      open={editing.open}
      mailBook={editing.mailBook}
      onSaved={() => void retrieve()}
      onClose={() => setEditing(e => ({ ...e, open: false }))}
    />
    </>
  );
};
