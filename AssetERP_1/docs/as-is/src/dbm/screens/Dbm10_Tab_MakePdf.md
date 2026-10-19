# Dbm10_Tab_MakePdf

- 종류: 화면
- 메뉴: 관리자 > 09. 기타 > PDF 생성 테스트 (#1108)
- 파일: `client/vi/dbm/Dbm10_Tab_MakePdf.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectPdfMakeTarget` | Dbm10_Tab_MakePdf:60 | [`Apr01_Appr.java:961`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectPdfMakeTarget`](../../apr/sql/apr01_appr.md) |
| `utils.pdf.PDFCreate.createPDF7` | Dbm10_Tab_MakePdf:75 | [`PDFCreate.java:38`](../../utils/services/pdf.PDFCreate.md) | - |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_class_tree_nm_allpath`, `f_emp_kor_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dbm10_Tab_MakePdf (`client/vi/dbm/Dbm10_Tab_MakePdf.java`, 100줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "등록일" Date
  - effectDate 100 "시행일" Date
  - classTreeNameAllPath 300 "문서분류" Text
  - title 400 "문서명" Text
  - regEmpName 80 "등록자" Text
  - orgName 150 "등록부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L26-37) → retrieve()
[E1] searchbarBuilder[조회].Retrieve (L30) → retrieve()
[E2] searchbarBuilder[PDF 생성].Update (L31) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L56-66 | 생성자,E1,update | 서비스 apr.Apr01_Appr.selectPdfMakeTarget(companyId) | 업무 |
| public update() | L69-86 | E2 | 상태 처리 | 업무 |
| public insertRow() | L89-90 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L93-94 | 공개 메서드 | 상태 처리 | 업무 |
| public getServiceResult() | L97-98 | update | 상태 처리 | 업무 |
| private buildGrid() | L39-53 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L45
  gb.date('effectDate', 100, '시행일'),  // L46
  gb.text('treeNmAllpath', 300, '문서분류'),  // L47
  gb.text('title', 400, '문서명'),  // L48
  gb.text('regEmpNm', 80, '등록자'),  // L49
  gb.text('orgName', 150, '등록부서'),  // L50
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="generate" onClick={update}>PDF 생성</Button>

