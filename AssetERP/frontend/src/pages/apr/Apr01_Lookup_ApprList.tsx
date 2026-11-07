/**
 * 최근결재선 불러오기 (V08) — 내가 상신한 문서를 골라 그 결재선을 결재선 설정 창으로 가져온다
 * AS-IS: myApp/client/vi/apr/Apr01_Lookup_ApprList.java (238줄) — 함수 이름은 원본 메서드 이름 그대로 (줄 번호는 원본, 새 원본 IDMS-IC)
 * open(callback) L64-99: 720×500 모달 "최근결재선 불러오기", 위 줄 = 제목 라벨 + 검색(220, "상신제목을 입력해주세요") + [조회] + 라디오 둘
 *   (최근 7일간 상신문서 / 문서분류별 최근상신문서), 아래 그리드(결재상태 80·등록일 100·문서분류 360·제목 360, SingleGrid), 푸터 [확인][닫기]
 * [E1] 라디오 변경 · [E2] 조회 · [E3] Enter → retrieve() L160-182, [E4] 확인 → updateChk() L184-203("기존 결재선 정보는 삭제됩니다. 진행하시겠습니까?") [E6] → update() L205-225,
 * [E5] 닫기 → callback(null), hide()
 * 12 원칙: 머리 아래 선·푸터 위 선(LookupModal). 문서분류 열은 "문서분류별" 보기에서만 보인다(L164-170 setHidden). 7일 보기는 제목 검색어를 원본도 쓰지 않는다(이상한점 #23).
 * 스타일: MFG (임시 스크립트 판별 — docs/page-style.md 모달 스타일)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Input, message, Modal, Radio, Space } from 'antd';
import type { ColDef } from 'ag-grid-community';
import { aprStepEditApi } from '@/api/apr';
import { errorMessage } from '@/api/client';
import { AprNewStep, AprRecentDoc } from '@/types/apr';
import { Button } from '@/components/button';
import { LookupModal } from '@/components/lookup/LookupModal';
import { SingleGrid, gbFor } from '@/components/grid';

const gb = gbFor<AprRecentDoc>();

interface Props {
  open: boolean;
  /** [확인] 뒤 — 고른 문서의 결재선(상신자 제외, callback.execute(resultList)) */
  onResult: (lines: AprNewStep[]) => void;
  onClose: () => void;
}

export const Apr01_Lookup_ApprList: React.FC<Props> = ({ open, onResult, onClose }) => {
  const [mode, setMode] = useState<'week' | 'group'>('week');
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState<AprRecentDoc[]>([]);
  const [selected, setSelected] = useState<AprRecentDoc | null>(null);
  const [loading, setLoading] = useState(false);

  // retrieve() L160-182
  const retrieve = async (m: 'week' | 'group' = mode) => {
    setLoading(true);
    try {
      setRows(await aprStepEditApi.recentDocs(m, searchText));
      setSelected(null);
    } catch (err) {
      message.error(errorMessage(err, '조회 실패'));
    } finally {
      setLoading(false);
    }
  };

  // open() L64-99: 열자마자 retrieve()
  useEffect(() => {
    if (!open) return;
    setMode('week');
    setSearchText('');
    setRows([]);
    setSelected(null);
    void (async () => {
      setLoading(true);
      try { setRows(await aprStepEditApi.recentDocs('week', '')); } catch (err) { message.error(errorMessage(err, '조회 실패')); } finally { setLoading(false); }
    })();
  }, [open]);

  // updateChk() L184-203 → update() L205-225: 문서를 안 골랐으면 "문서를 선택해주세요"
  const confirmLoad = () => {
    if (!selected) { message.warning('문서를 선택해주세요'); return; }
    Modal.confirm({
      title: '확인', content: '기존 결재선 정보는 삭제됩니다. 진행하시겠습니까?', width: 500, okText: '예', cancelText: '아니오',
      onOk: async () => {
        try {
          onResult(await aprStepEditApi.recentLines(selected.apprId));
        } catch (err) {
          message.error(errorMessage(err, '결재선 불러오기 실패'));
        }
      },
    });
  };

  const cols = useMemo<ColDef<AprRecentDoc>[]>(() => [
    gb.textCenter('statusName', 80, '결재상태'),
    gb.date('regDate', 100, '등록일'),
    ...(mode === 'group' ? [gb.text('classTreeNameAllpath', 360, '문서분류')] : []),
    gb.text('title', mode === 'group' ? 360 : 460, '제목'),
  ], [mode]);

  return (
    <LookupModal
      open={open}
      title="최근결재선 불러오기"
      width={720}
      style={{ top: 20 }}
      maskClosable={false}
      onCancel={onClose}
      destroyOnHidden
      styles={{ header: { borderBottom: '1px solid #d9d9d9', paddingBottom: 12, marginBottom: 12 } }}
      footer={
        <Space>
          {/* [E4] updateButton[확인] (L133) → updateChk() */}
          <Button type="select" onClick={confirmLoad}>확인</Button>
          {/* [E5] closeButton[닫기] → callback(null), hide() */}
          <Button type="close" onClick={onClose}>닫기</Button>
        </Space>
      }
    >
      <div style={{ height: 'min(340px, calc(100vh - 260px))', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', borderRadius: 4, padding: '6px 10px' }}>
          <span style={{ fontWeight: 'bold', fontSize: 12 }}>제목</span>
          {/* [E3] searchField.KeyPress [Enter] (L125) → retrieve() */}
          <Input value={searchText} onChange={e => setSearchText(e.target.value)} onPressEnter={() => void retrieve()} placeholder="상신제목을 입력해주세요" allowClear style={{ width: 220 }} />
          {/* [E2] retrieveButton[조회] (L119) */}
          <Button type="search" onClick={() => retrieve()}>조회</Button>
          {/* [E1] toggle.ValueChange (L113) → retrieve() */}
          <Radio.Group value={mode} onChange={e => { setMode(e.target.value); void retrieve(e.target.value); }} style={{ marginLeft: 8 }}>
            <Radio value="week">최근 7일간 상신문서</Radio>
            <Radio value="group">문서분류별 최근상신문서</Radio>
          </Radio.Group>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* 7일 보기는 결재선 줄마다 한 줄씩 나오므로(원본 그대로) 문서 번호가 겹칠 수 있다 → 줄 위치를 키로 쓴다 */}
          <SingleGrid<AprRecentDoc>
            rowData={rows}
            columnDefs={cols}
            loading={loading}
            getRowId={p => `${p.data.apprId}-${rows.indexOf(p.data)}`}
            onSelect={row => setSelected(row ?? null)}
          />
        </div>
      </div>
    </LookupModal>
  );
};
