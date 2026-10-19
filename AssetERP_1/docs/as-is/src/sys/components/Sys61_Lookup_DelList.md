# Sys61_Lookup_DelList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`
- 파일: `client/vi/sys/Sys61_Lookup_DelList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys61_FileDel.selectByParentId` | Sys61_Lookup_DelList:83 | [`Sys61_FileDel.java:28`](../../sys/services/Sys61_FileDel.md) | [`sys61_file_del.selectByParentId`](../../sys/sql/sys61_file_del.md) |

## 테이블

[`sys10_file`](../../../db/tables/sys.md), [`sys61_file_del`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys61_Lookup_DelList (`client/vi/sys/Sys61_Lookup_DelList.java`, 134줄)

- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid()):
  - fileName 270 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - personName 100 "삭제자" TextCenter
  - delDate 150 "삭제일시" DateTime
  - actionCell 50 "사유" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L43-68) → settings(), show()
[E1] closeButton[닫기].Select (L71) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-41 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L79-89 | open | 서비스 sys.Sys61_FileDel.selectByParentId(parentId) | 업무 |
| private settings() | L70-77 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L91-129 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L131-133 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 270, '첨부파일'),  // L121 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L122) addCell
  // ⚠ 대응 없음 (GridBuilder L123) addCell
  gb.textCenter('personNm', 100, '삭제자'),  // L124 SQL 계산 컬럼(selectByParentId: f_emp_kor_nm(sys61_person_id))
  gb.dateTime('delDate', 150, '삭제일시'),  // L125
  // ⚠ 대응 없음 (GridBuilder L126) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

