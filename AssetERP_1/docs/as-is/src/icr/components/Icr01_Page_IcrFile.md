# Icr01_Page_IcrFile

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `sch`, `tdm`
- 파일: `client/vi/icr/Icr01_Page_IcrFile.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByParentId` | Icr01_Page_IcrFile:59 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icr01_Page_IcrFile (`client/vi/icr/Icr01_Page_IcrFile.java`, 66줄)

- 그리드 `grid` (buildApprFileGrid()):
  - fileName 320 "서식파일" Text
  - regDate 95 "등록일" Date
  - actionCell 45 " " Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L25-31) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildApprFileGrid() | L33-52 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L54-65 | 공개 메서드 | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 320, '서식파일'),  // L47
  gb.date('regDate', 95, '등록일'),  // L48
  // ⚠ 대응 없음 (GridBuilder L49) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

