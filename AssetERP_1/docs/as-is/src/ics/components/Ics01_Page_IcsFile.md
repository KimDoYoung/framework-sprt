# Ics01_Page_IcsFile

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `sch`, `tdm`
- 파일: `client/vi/ics/Ics01_Page_IcsFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys11_RelateFile.selectByParentId` | Ics01_Page_IcsFile:69 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Page_IcsFile (`client/vi/ics/Ics01_Page_IcsFile.java`, 76줄)

- 입력·하위 화면: `lookupForm` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildApprFileGrid()):
  - fileName 300 "서식파일" Text
  - regDate 90 "등록일" Date
  - actionCell 35 " " Cell 편집:downloadCell
  - actionCell 35 " " Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L26-32) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildApprFileGrid() | L34-62 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| public retrieve() | L64-75 | 공개 메서드 | 서비스 sys.Sys11_RelateFile.selectByParentId(parentId) | 업무 |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 300, '서식파일'),  // L56 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  gb.date('regDate', 90, '등록일'),  // L57 SQL 계산 컬럼(selectByParentId: sys10_reg_date)
  // ⚠ 대응 없음 (GridBuilder L58) addCell
  // ⚠ 대응 없음 (GridBuilder L59) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

