# Sch14_Lookup_IpoMismatch

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/sch/Sch14_Lookup_IpoMismatch.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch14_IpoMismatch.createIpoMismatch` | Sch14_Lookup_IpoMismatch:189 | [`Sch14_IpoMismatch.java:26`](../../sch/services/Sch14_IpoMismatch.md) | [`sch14_ipo_mismatch.createIpoMismatch`](../../sch/sql/sch14_ipo_mismatch.md) |
| `sch.Sch14_IpoMismatch.selectByCheckYn` | Sch14_Lookup_IpoMismatch:203 | [`Sch14_IpoMismatch.java:21`](../../sch/services/Sch14_IpoMismatch.md) | [`sch14_ipo_mismatch.selectByCheckYn`](../../sch/sql/sch14_ipo_mismatch.md) |
| `sch.Sch14_IpoMismatch.update` | Sch14_Lookup_IpoMismatch:215 | [`Sch14_IpoMismatch.java:35`](../../sch/services/Sch14_IpoMismatch.md) | `UpdateDataModel(sch14_ipo_mismatch)` 동적 INSERT/UPDATE → [`sch14_ipo_mismatch.selectById`](../../sch/sql/sch14_ipo_mismatch.md) |

## 테이블

[`sch14_ipo_mismatch`](../../../db/tables/sch.md)

## DB 함수

`f_create_ipomismatch`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch14_Lookup_IpoMismatch (`client/vi/sch/Sch14_Lookup_IpoMismatch.java`, 226줄)

- 툴바 `buttonBar`: {checkYn} {retrieveButton} {batchForm}
- 입력·하위 화면: `checkYn` CheckBox
- 그리드 `grid` (buildGrid()):
  - stkCode 80 "종목코드" TextCenter
  - target1 550 "공모주일정" Text
  - target2 550 "IpoStock" Text
  - insertDateTimeStr 150 "생성일시" TextCenter
  - checkYn 80 "확인완료" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L52-60) → 초기화
[E1] retrieveButton[조회].Select (L91) → retrieve()
[E2] closeButton[닫기].Select (L97) → hide()
[E3] grid.getStore().StoreRecordChange (L104) → update()
[E4] grid.CellDoubleClick (L111) → getCellValue()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L62-84 | 공개 메서드 | 상태 처리 | 업무 |
| private getCellValue() | L132-139 | E4 | 상태 처리 | 업무 |
| private showCopyMessage() | L151-170 | 미사용 후보 | 확인창 표시 | 업무 |
| public retrieve() | L185-211 | E1,open | 서비스 sch.Sch14_IpoMismatch.createIpoMismatch, sch.Sch14_IpoMismatch.selectByCheckYn(checkYn) | 업무 |
| private update() | L213-216 | E3 | 서비스 sch.Sch14_IpoMismatch.update | 업무 |
| private settings() | L86-129 | open | 이벤트 연결, 초기값: checkYn=true("미확인 종목만 조회") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L172-183 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L218-220 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L222-224 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('stkCd', 80, '종목코드'),  // L176
  gb.text('target1', 550, '공모주일정'),  // L177
  gb.text('target2', 550, 'IpoStock'),  // L178
  gb.textCenter('insertDateTimeStr', 150, '생성일시'),  // L179 SQL 계산 컬럼(selectByCheckYn: to_char(sch14_insert_date_time,'yyyy-mm…)
  gb.boolean('checkYn', 80, '확인완료'),  // L180
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

