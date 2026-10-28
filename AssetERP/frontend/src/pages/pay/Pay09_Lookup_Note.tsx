/**
 * 급여 비고 창 (S16) — Pay11_TabPage_MonthItem의 [비고작성]이 연다.
 * AS-IS: myApp/client/vi/pay/Pay09_Lookup_Note.java (290줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * 생성자 L111-162: 600×350 모달 "비고", 탭 [전체 비고](비고 입력 칸 "비고내용을 입력해주세요") | [개인별 비고](위 [행 추가][행 삭제] + 새로고침 아이콘,
 *   체크 다중 셀 편집 그리드: 사원명 120 가운데 · 비고 400 큰 글), 아래 가운데 [저장][닫기]
 * open() L83-109: checkNote(noteType "1")로 전체 비고 행을 받아(없으면 서버가 만들어 줌) 채우고 개인별 비고(noteType "2")를 조회
 * update() L243-269: 보고 있는 탭이 전체 비고면 그 행만 저장, 개인별 비고면 변경 행 저장 + 삭제 목록 삭제, 끝에 늘 "저장이 완료되었습니다"
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input, message, Space, Tabs } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { payApi } from '@/api/pay';
import { errorMessage } from '@/api/client';
import { PayRelateNote } from '@/types/pay';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { CellEditGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';
import { useGridCrud } from '@/hooks/useGridCrud';

const gb = gbFor<PayRelateNote>();
const MULTI_SELECTION = { mode: 'multiRow', checkboxes: true, headerCheckbox: true, enableClickSelection: false } as const;

interface Props {
  /** open(payCode, payDate, …) — 지급구분과 지급일. null이면 닫힘 */
  target: { payCode: string; payDate: string } | null;
  onClose: () => void;
}

export const Pay09_Lookup_Note: React.FC<Props> = ({ target, onClose }) => {
  // [E0] 화면 열림 (생성자 L111-162) → makeButtonEvent(), getEditor()
  const [activeTab, setActiveTab] = useState('all');
  const [allNote, setAllNote] = useState<PayRelateNote | null>(null);
  const [allText, setAllText] = useState('');
  const [empOpen, setEmpOpen] = useState(false);
  // deleteList: [행 삭제]로 화면에서 뺀 기존 행. [저장]에서 서버에 보낸다
  const deleteList = useRef<number[]>([]);
  const targetRef = useRef(target);
  targetRef.current = target;

  const crud = useGridCrud<PayRelateNote>({
    idField: 'relateNoteId',
    // retrieve() L271-285: pay.Pay09_RelateNote.selectByCompanyId(noteType "2")
    search: useCallback(() => (targetRef.current ? payApi.searchRelateNotes(targetRef.current.payCode, targetRef.current.payDate, '2') : Promise.resolve([])), []),
    save: useCallback(async () => [], []),
    remove: useCallback(async () => 0, []),
    newRow: () => ({ payDate: targetRef.current?.payDate ?? '', payCd: targetRef.current?.payCode ?? '', noteType: '2' }),
    firstEditField: 'note',
  });
  const { retrieve: retrieveRows } = crud;

  const retrieve = useCallback(async () => {
    deleteList.current = [];
    await retrieveRows();
  }, [retrieveRows]);

  // open() L83-109
  useEffect(() => {
    if (!target) return;
    setActiveTab('all');
    setAllNote(null);
    setAllText('');
    payApi.checkRelateNote(target.payCode, target.payDate, '1')
      .then(row => { setAllNote(row); setAllText(row.note ?? ''); void retrieve(); })
      .catch(err => message.error(errorMessage(err, '조회 실패')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  // buildGrid(): 사원명 120(가운데, 읽기 전용) · 비고 400(큰 글 편집)
  const columnDefs = useMemo(() => [
    gb.textCenter('personNm', 120, '사원명'),
    gb.text('note', 400, '비고', { editor: 'largeText' }),
  ], []);

  // [E4] insertRowButton[행 추가].Select (L196) → insertRow() L210-233: Emp00_Lookup_SelectMulti.open(오늘) → 고른 사원마다 개별 비고 행
  const insertRows = (list: TransInfo[]) => {
    setEmpOpen(false);
    if (!target || list.length === 0) return;
    crud.addRows(list.map(m => ({ payDate: target.payDate, payCd: target.payCode, noteType: '2', personId: m.personId, personNm: m.korNm ?? '' })), true);
  };

  // [E5] deleteRowButton[행 삭제].Select (L202) → deleteRow() L235-241: 고른 행을 삭제 목록에 담고 화면에서 뺀다
  const deleteRow = () => {
    const selected = crud.gridRef.current?.api.getSelectedRows() ?? [];
    if (selected.length === 0) return;
    deleteList.current = [...deleteList.current, ...selected.filter(r => r.relateNoteId > 0).map(r => r.relateNoteId)];
    crud.removeRows(selected.map(r => r.relateNoteId));
  };

  // [E3] updateButton[저장].Select (L190) → update() L243-269
  const update = async () => {
    if (!target) return;
    try {
      if (activeTab === 'all') {
        if (allNote) await payApi.saveRelateNotes([{ ...allNote, note: allText }]);
      } else {
        const changed = crud.getChanged();
        if (changed.length > 0) await payApi.saveRelateNotes(changed);
        if (deleteList.current.length > 0) await payApi.deleteRelateNotes(deleteList.current);
        deleteList.current = [];
        await retrieve();
      }
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
      return;
    }
    message.success('저장이 완료되었습니다');
  };

  return (
    <>
      <LookupModal
        open={target != null}
        title="비고"
        width={680}
        maskClosable={false}
        onCancel={onClose}
        focusFirst={false}
        footer={(
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="save" onClick={update}>저장</Button>
              {/* [E2] closeButton[닫기].Select (L184) → hide() */}
              <Button type="close" onClick={onClose}>닫기</Button>
            </Space>
          </div>
        )}
      >
        <div style={{ height: 270 }}>
          <Tabs
            size="small"
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ height: '100%' }}
            items={[
              {
                key: 'all',
                label: '전체 비고',
                children: (
                  <Input.TextArea style={{ height: 210 }} placeholder="비고내용을 입력해주세요" value={allText} onChange={e => setAllText(e.target.value)} />
                ),
              },
              {
                key: 'person',
                label: '개인별 비고',
                children: (
                  <div style={{ height: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Button type="addRow" onClick={() => setEmpOpen(true)}>행 추가</Button>
                      <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
                      <span style={{ flex: 1 }} />
                      {/* [E1] anchor.MouseDown (L121) → retrieve() */}
                      <ReloadOutlined style={{ cursor: 'pointer' }} onMouseDown={() => void retrieve()} />
                    </div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                      <CellEditGrid<PayRelateNote> crud={crud} columnDefs={columnDefs} rowSelection={MULTI_SELECTION} />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectMulti open={empOpen} transDate={dayjs().format('YYYY-MM-DD')} onResult={insertRows} onClose={() => setEmpOpen(false)} />
    </>
  );
};
