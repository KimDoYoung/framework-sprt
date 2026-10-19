# Emp00_Lookup_SelectSingleTdm

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `tdm`
- 파일: `client/vi/emp/Emp00_Lookup_SelectSingleTdm.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp03_Trans.selectByTdmYn` | Emp00_Lookup_SelectSingleTdm:161 | [`Emp03_Trans.java:140`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.selectByTdmYn`](../../emp/sql/emp03_trans.md) |

## DB 함수

`f_cdnm`, `getorg`, `getperson`, `getsuborg`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp00_Lookup_SelectSingleTdm (`client/vi/emp/Emp00_Lookup_SelectSingleTdm.java`, 191줄)

- 툴바 `buttonBar`: 기준일: {stdDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="조직/사번/성명"
- 그리드 `grid` (buildGrid(), 체크박스):
  - orgName 200 "조직" Text
  - titleName 120 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 100 "성명" Text
  - transDate 100 "발령일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L50-57) → 초기화
[E1] grid.CellDoubleClick (L90) → confirm()
[E2] searchText.KeyPress [Enter] (L108) → retrieve()
[E3] retrieveButton[조회].Select (L117) → retrieve()
[E4] oKButton[확인].Select (L124) → confirm()
[E5] cancelButton[닫기].Select (L130) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L59-62 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L64-103 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L105-136 | open | 상태 처리 | 업무 |
| public retrieve() | L152-167 | E2,E3,open | 서비스 emp.Emp03_Trans.selectByTdmYn(companyId, stdDate, orgId, searchText) | 업무 |
| public confirm() | L169-181 | E1,E4 | 미선택 시 alert "선택된 사원이 없습니다" | 업무 |
| private buildGrid() | L138-150 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L183-185 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L187-189 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 200, '조직'),  // L143
  gb.text('titleNm', 120, '직책'),  // L144 SQL 계산 컬럼(selectByTdmYn: f_cdnm('EmpTitleCode', emp00_title_cd, …)
  gb.text('empNo', 80, '사번'),  // L145
  gb.text('korNm', 100, '성명'),  // L146
  gb.date('transDate', 100, '발령일'),  // L147
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

