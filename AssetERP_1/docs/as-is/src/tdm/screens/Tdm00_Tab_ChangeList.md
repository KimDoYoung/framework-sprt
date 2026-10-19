# Tdm00_Tab_ChangeList

- 종류: 화면
- 메뉴: 책무 > 90. 책무관리현황 > 조치대상조회(변화관리) (#1466)
- 파일: `client/vi/tdm/Tdm00_Tab_ChangeList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tdm.Tdm02_HrRecord.selectChangeList` | Tdm00_Tab_ChangeList:85 | [`Tdm02_HrRecord.java:27`](../../tdm/services/Tdm02_HrRecord.md) | [`tdm02_hr_record.selectChangeList`](../../tdm/sql/tdm02_hr_record.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `getperson`, `gettdm30roleallc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm00_Tab_ChangeList (`client/vi/tdm/Tdm00_Tab_ChangeList.java`, 96줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {stdDate} {retrieveButton}
- 입력·하위 화면: `stdDate` MyDateField
- 그리드 `grid` (buildGrid()):
  - changeData 250 "변화구분" Text
  - note 750 "내용" Text

#### 이벤트
[E0] 화면 열림 (생성자 L34-55) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L61) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L78-91 | 생성자,E1 | 서비스 tdm.Tdm02_HrRecord.selectChangeList(companyId, stdDate) | 업무 |
| private settings() | L57-67 | 생성자 | 이벤트 연결, 초기값: stdDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L69-76 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L93-95 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('changeData', 250, '변화구분'),  // L72
  gb.text('note', 750, '내용'),  // L73
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

