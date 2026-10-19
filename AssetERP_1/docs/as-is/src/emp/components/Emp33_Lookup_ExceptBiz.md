# Emp33_Lookup_ExceptBiz

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `ics`
- 파일: `client/vi/emp/Emp33_Lookup_ExceptBiz.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp33_ExceptBiz.delete` | Emp33_Lookup_ExceptBiz:226 | [`Emp33_ExceptBiz.java:33`](../../emp/services/Emp33_ExceptBiz.md) | `UpdateDataModel(emp33_except_biz)` 동적 DELETE |
| `emp.Emp33_ExceptBiz.selectByExceptBizCode` | Emp33_Lookup_ExceptBiz:144 | [`Emp33_ExceptBiz.java:22`](../../emp/services/Emp33_ExceptBiz.md) | [`emp33_except_biz.selectByExceptBizCode`](../../emp/sql/emp33_except_biz.md) |
| `emp.Emp33_ExceptBiz.update` | Emp33_Lookup_ExceptBiz:166 | [`Emp33_ExceptBiz.java:28`](../../emp/services/Emp33_ExceptBiz.md) | `UpdateDataModel(emp33_except_biz)` 동적 INSERT/UPDATE → [`emp33_except_biz.selectById`](../../emp/sql/emp33_except_biz.md) |

## 테이블

[`emp33_except_biz`](../../../db/tables/emp.md)

## DB 함수

`f_cdnm`, `f_today`, `getperson`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp33_Lookup_ExceptBiz (`client/vi/emp/Emp33_Lookup_ExceptBiz.java`, 232줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookupEmp` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - personInfo 250 "사원명" Text
  - startDate 100 "예외시작일" Date 편집:MyDateField
  - closeDate 100 "예외종료일" Date 편집:MyDateField
  - reason 350 "예외사유" TextArea 편집:TextArea
  - unvisibleYn 250 "보고서에서 제거<br>(미체크시 '해당없음'으로 표시됨)" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L58-64) → 초기화
[E1] retrieveButton[조회].Select (L92) → retrieve()
[E2] insertButton[등록].Select (L98) → insertRow()
[E3] updateButton[저장].Select (L104) → update()
[E4] deleteButton[삭제].Select (L110) → deleteChk()
       └ [E6] msgBox.DialogHide [YES] (L206) → deleteRow()
[E5] cancelButton[닫기].Select (L116) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L66-89 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L137-150 | E1,open | 서비스 emp.Emp33_ExceptBiz.selectByExceptBizCode(companyId, exceptBizCode) | 업무 |
| public update() | L152-167 | E3 | 서비스 emp.Emp33_ExceptBiz.update | 업무 |
| public insertRow() | L169-196 | E2 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private deleteChk() | L198-221 | E4 | ConfirmBox → E6 | 업무 |
| public deleteRow() | L223-227 | E6 | GridDeleteData emp.Emp33_ExceptBiz.delete(체크된 행 목록) | 업무 |
| private settings() | L91-122 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L124-135 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L229-231 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('personInfo', 250, '사원명'),  // L128 SQL 계산 컬럼(selectByExceptBizCode: emp00_kor_nm||'('||emp00_org_code_nm||'…)
  gb.date('startDate', 100, '예외시작일', { editor: 'date' }),  // L129
  gb.date('closeDate', 100, '예외종료일', { editor: 'date' }),  // L130
  gb.textArea('reason', 350, '예외사유', { editor: 'largeText' }),  // L131
  gb.boolean('unvisibleYn', 250, '보고서에서 제거<br>(미체크시 \'해당없음\'으로 표시됨)'),  // L132
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

