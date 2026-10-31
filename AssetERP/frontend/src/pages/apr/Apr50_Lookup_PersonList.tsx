/**
 * 중요표시 설정 창 (V09) — 문서창 푸터의 북마크 별을 누르면 열린다. 문서를 "전체 중요표시"(모두에게 별) 하거나 "개별 중요표시"(고른 사원에게만 별) 한다.
 * AS-IS: myApp/client/vi/apr/Apr50_Lookup_PersonList.java (404줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open() L79-133: 580×500 모달 "중요표시 설정 (활성화|비활성화)"(닫기 X 없음), 위 ◉전체 중요표시 ◉개별 중요표시 · [등록][저장][삭제] · 새로고침 아이콘,
 *   안내 글(파랑 12), 체크 다중 그리드(사원정보 500), 푸터 [초기화][닫기]
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { message, Modal, Radio } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { aprExtraApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { TransInfo } from '@/types/emp';
import { Button } from '@/components/button';
import { MultiGrid, gbFor } from '@/components/grid';
import { LookupModal } from '@/components/lookup/LookupModal';
import { Emp00_Lookup_SelectMulti } from '@/components/lookup/Emp00_Lookup_SelectMulti';

interface Row {
  /** 화면용 줄 번호(저장된 줄은 bookmarkId, 새 줄은 음수) */
  rowKey: number;
  bookmarkId: number | null;
  personId: number;
  personInfo: string;
}

const gb = gbFor<Row>();
const TEXT01 = "※ '중요표시'는 문서의 중요도만 나타내며, 열람권한은 '공람설정'을 통해 설정해주세요";

interface Props {
  /** open(apprId, callback) — 값이 있으면 열린다 */
  apprId: number | null;
  /** [닫기]·[초기화] 뒤 (AS-IS callback.execute() → getApprBookmark) — 문서창의 별을 다시 읽는다 */
  onChanged: () => void;
  onClose: () => void;
}

export const Apr50_Lookup_PersonList: React.FC<Props> = ({ apprId, onChanged, onClose }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [checked, setChecked] = useState<Row[]>([]);
  /** buttonSettings(chk): 전체 중요표시가 켜져 있으면 true — 개별 줄 편집은 막는다 */
  const [publicOn, setPublicOn] = useState(false);
  /** headingSettings(active) */
  const [active, setActive] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const seq = useRef(0);

  // retrieve() L266-295: apr.Apr50_Bookmark.selectByApprId — 사원이 없는 줄(전체 스위치)은 그리드에서 뺀다
  const retrieve = useCallback(async () => {
    if (apprId == null) return;
    setLoading(true);
    try {
      const list = await aprExtraApi.getBookmarks(apprId);
      setActive(list.length > 0);
      setPublicOn(list.some(r => r.publicYn === 'true'));
      setRows(list.filter(r => r.personId != null).map(r => ({ rowKey: r.bookmarkId, bookmarkId: r.bookmarkId, personId: r.personId as number, personInfo: r.personInfo ?? '' })));
      setChecked([]);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  }, [apprId]);
  useEffect(() => {
    if (apprId == null) { setRows([]); setChecked([]); setPublicOn(false); setActive(false); return; }
    void retrieve();
  }, [apprId, retrieve]);

  // [E2] toggle.ValueChange (L142) → update01(publicYn) L297-310 → retrieve()
  const update01 = async (publicYn: boolean) => {
    if (apprId == null) return;
    try {
      await aprExtraApi.setBookmarkPublic(apprId, publicYn);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E3] insertRowButton[등록].Select (L163) → insertRow() L237-264: Emp00_Lookup_SelectMulti.open(오늘) → "이름 (조직)" 줄을 맨 아래에 (03 원칙 17)
  const onPick = (list: TransInfo[]) => {
    setLookupOpen(false);
    setRows(prev => [...prev, ...list.map(m => ({ rowKey: --seq.current, bookmarkId: null, personId: m.personId, personInfo: `${m.korNm ?? ''} (${m.orgKorNm ?? ''})` }))]);
  };

  // [E4] updateButton[저장].Select (L169) → update02() L312-324: apr.Apr50_Bookmark.update(새 줄)
  const update02 = async () => {
    if (apprId == null) return;
    const added = rows.filter(r => r.bookmarkId == null).map(r => r.personId);
    if (added.length === 0) return;
    try {
      await aprExtraApi.addBookmarkPersons(apprId, added);
      await retrieve();
    } catch (err) {
      message.error(errorMessage(err, '저장 실패'));
    }
  };

  // [E5] deleteButton[삭제].Select (L175) → deleteChk() L326-344 "선택한 항목을 삭제하시겠습니까?" → [E9] delete() L346-359: 체크한 줄 (아직 저장 안 한 줄은 화면에서만 뺀다)
  const deleteChk = () => {
    Modal.confirm({
      title: '삭제',
      content: '선택한 항목을 삭제하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 350,
      onOk: async () => {
        if (apprId == null) return;
        const gone = new Set(checked.map(r => r.rowKey));
        const ids = checked.filter(r => r.bookmarkId != null).map(r => r.bookmarkId as number);
        try {
          if (ids.length > 0) await aprExtraApi.deleteBookmarks(apprId, ids);
          setRows(prev => prev.filter(r => !gone.has(r.rowKey)));
          setChecked([]);
          if (ids.length > 0) await retrieve();
        } catch (err) {
          message.error(errorMessage(err, '삭제 실패'));
        }
      },
    });
  };

  // [E6] clearButton[초기화].Select → "해당 문서의 중요표시를 초기화하시겠습니까?" [E7] msgBox [YES] (L186) → allClear() L213-227
  const clearAll = () => {
    Modal.confirm({
      title: '확인',
      content: '해당 문서의 중요표시를 초기화하시겠습니까?',
      okText: '예',
      cancelText: '아니오',
      width: 400,
      onOk: async () => {
        if (apprId == null) return;
        try {
          await aprExtraApi.clearBookmarks(apprId);
          await retrieve();
          Modal.info({ title: '확인', content: '초기화가 완료되었습니다', okText: '확인' });
          onChanged();
        } catch (err) {
          message.error(errorMessage(err, '초기화 실패'));
        }
      },
    });
  };

  // [E8] closeButton[닫기].Select (L204) → callback(), hide()
  const close = () => { onChanged(); onClose(); };

  // buildGrid() L229-235
  const columnDefs = useMemo(() => [gb.text('personInfo', 500, '사원정보')], []);

  return (
    <>
      <LookupModal
        open={apprId != null}
        title={active ? '중요표시 설정 (활성화)' : '중요표시 설정 (비활성화)'}
        width={640}
        style={{ top: 20 }}
        closable={false}
        maskClosable={false}
        onCancel={close}
        destroyOnClose
        focusFirst={false}
        styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <Button type="delete" onClick={clearAll}>초기화</Button>
            <Button type="close" onClick={close}>닫기</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio.Group value={publicOn ? 'all' : 'each'} onChange={e => void update01(e.target.value === 'all')}>
              <Radio value="all">전체 중요표시</Radio>
              <Radio value="each">개별 중요표시</Radio>
            </Radio.Group>
            <span style={{ flex: 1 }} />
            <Button type="register" disabled={publicOn} onClick={() => setLookupOpen(true)}>등록</Button>
            <Button type="save" disabled={publicOn} onClick={update02}>저장</Button>
            <Button type="delete" disabled={publicOn} onClick={deleteChk}>삭제</Button>
            {/* [E1] anchor.MouseDown (L99) — 새로고침 이미지 링크 */}
            <a role="button" title="새로고침" onClick={() => void retrieve()} style={{ fontSize: 15, color: '#595959', cursor: 'pointer' }}><ReloadOutlined spin={loading} /></a>
          </div>
          <div style={{ fontSize: 12, color: '#4E81CE' }}>{TEXT01}</div>
          <div style={{ height: 'min(340px, calc(100vh - 340px))', opacity: publicOn ? 0.5 : 1, pointerEvents: publicOn ? 'none' : undefined }}>
            <MultiGrid<Row>
              rowData={rows}
              columnDefs={columnDefs}
              getRowId={p => String(p.data.rowKey)}
              loading={loading}
              onCheckedChange={setChecked}
            />
          </div>
        </div>
      </LookupModal>
      <Emp00_Lookup_SelectMulti open={lookupOpen && apprId != null} transDate={dayjs().format('YYYY-MM-DD')} onResult={onPick} onClose={() => setLookupOpen(false)} />
    </>
  );
};
