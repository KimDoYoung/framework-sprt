# Apr15_Tab_ReprCorp

- 종류: 화면
- 메뉴: 문서작성 > 04. 전자결재 > 추가 대표명의 등록 (#1506)
- 파일: `client/vi/apr/Apr15_Tab_ReprCorp.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr15_ReprCorp.delete` | Apr15_Tab_ReprCorp:228 | [`Apr15_ReprCorp.java:38`](../../apr/services/Apr15_ReprCorp.md) | [`apr16_stamp_doc.selectByReprCorpId`](../../apr/sql/apr16_stamp_doc.md), `UpdateDataModel(apr15_repr_corp)` 동적 DELETE |
| `apr.Apr15_ReprCorp.selectByCompanyId` | Apr15_Tab_ReprCorp:155 | [`Apr15_ReprCorp.java:23`](../../apr/services/Apr15_ReprCorp.md) | [`apr15_repr_corp.selectByCompanyId`](../../apr/sql/apr15_repr_corp.md) |
| `apr.Apr15_ReprCorp.update` | Apr15_Tab_ReprCorp:198 | [`Apr15_ReprCorp.java:33`](../../apr/services/Apr15_ReprCorp.md) | `UpdateDataModel(apr15_repr_corp)` 동적 INSERT/UPDATE → [`apr15_repr_corp.selectById`](../../apr/sql/apr15_repr_corp.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr15_Tab_ReprCorp (`client/vi/apr/Apr15_Tab_ReprCorp.java`, 240줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `corpTypeCombo` ComboBoxField("ReprCorpType") 빈칸="(선택하세요)", `stampLookup` LookupTriggerField, `lookup` Apr10_Lookup_Stamp
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - corpTypeName 100 "구분" Text 편집:corpTypeCombo
  - corpName 250 "대표회사" Text 편집:TextField
  - reprName 200 "대표자" Text 편집:TextField
  - corpRegYn 80 "법인등기" Boolean
  - stampName 200 "인감" Text 편집:stampLookup
  - note 250 "비고" Text 편집:TextField
  - useYn 70 "사용" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L53-73) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L76) → retrieve()
[E2] insertButton[등록].Select (L82) → insert()
[E3] updateButton[저장].Select (L88) → updateChk()
[E4] deleteButton[삭제].Select (L94) → deleteChk()
       └ [E7] messageBox.DialogHide (L213) → delete()
[E5] corpTypeCombo[ReprCorpType].Collapse (L105) → 인라인 L105-111 (new CollapseHandler() { @Override pub…)
[E6] stampLookup.TriggerClick (L115) → lookupStamp()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupStamp() | L135-147 | E6 | 조회창 Apr10_Lookup_Stamp 열기 | 업무 |
| private retrieve() | L149-161 | 생성자,E1 | 서비스 apr.Apr15_ReprCorp.selectByCompanyId(companyId) | 업무 |
| private insert() | L163-169 | E2 | 상태 처리 | 업무 |
| private updateChk() | L171-204 | E3 | 서비스 apr.Apr15_ReprCorp.update | 업무 |
| private deleteChk() | L206-223 | E4 | ConfirmBox → E7 | 업무 |
| private delete() | L225-238 | E7 | GridDeleteData apr.Apr15_ReprCorp.delete(체크된 행 목록) | 업무 |
| private settings() | L75-100 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L102-133 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('corpTypeNm', 100, '구분'),  // L124 SQL 계산 컬럼(selectByCompanyId: f_cdnm('ReprCorpType', apr15_corp_type,…)
  gb.text('corpNm', 250, '대표회사', { editor: 'text' }),  // L125
  gb.text('reprNm', 200, '대표자', { editor: 'text' }),  // L126
  gb.boolean('corpRegYn', 80, '법인등기'),  // L127
  gb.text('stampNm', 200, '인감'),  // L128 SQL 계산 컬럼(selectByCompanyId: apr10_stamp_nm)
  gb.text('note', 250, '비고', { editor: 'text' }),  // L129
  gb.boolean('useYn', 70, '사용'),  // L130
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="save" onClick={updateChk}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

