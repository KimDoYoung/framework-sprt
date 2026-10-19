# Com10_Lookup_CommonMapping

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/com/Com10_Lookup_CommonMapping.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Pay06_Popup_Example`](../../pay/components/Pay06_Popup_Example.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `com.Com10_FormMapping.modelUpdate` | Com10_Lookup_CommonMapping:239 | [`Com10_FormMapping.java:46`](../../com/services/Com10_FormMapping.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr30_link.updateFormMappingId`](../../dcr/sql/dcr30_link.md), `UpdateDataModel(com10_form_mapping)` 동적 INSERT/UPDATE → [`com10_form_mapping.selectById`](../../com/sql/com10_form_mapping.md) |

## 테이블

[`com10_form_mapping`](../../../db/tables/com.md), [`dcr30_link`](../../../db/tables/dcr.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Com10_Lookup_CommonMapping (`client/vi/com/Com10_Lookup_CommonMapping.java`, 270줄)

- 입력·하위 화면: `content` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L152-191) → 초기화
[E1] updateButton[저장].Select (L169) → update()
[E2] closeButton[닫기].Select (L175) → hide()
[E3] referenceLabel.Click (L181) → 인라인 L181-186 (new ClickHandler() { @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L72-150 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L193-228 | open | 상태 처리 | 업무 |
| public update() | L230-251 | E1 | 서비스 com.Com10_FormMapping.modelUpdate(linkId) | 업무 |
| private setHtmlStyle() | L263-265 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L267-269 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

